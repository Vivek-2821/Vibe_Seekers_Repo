package com.vibeseekers.service;

import com.vibeseekers.dto.auth.*;
import com.vibeseekers.entity.Role;
import com.vibeseekers.entity.User;
import com.vibeseekers.exception.BadRequestException;
import com.vibeseekers.exception.ResourceNotFoundException;
import com.vibeseekers.exception.UnauthorizedException;
import com.vibeseekers.repository.UserRepository;
import com.vibeseekers.security.JwtService;
import com.vibeseekers.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final OtpService otpService;
    private final MailService mailService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager,
                       OtpService otpService,
                       MailService mailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.otpService = otpService;
        this.mailService = mailService;
    }

    public boolean isMailConfigured() {
        return mailService.isMailConfigured();
    }

    @Transactional
    public String register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            User existingUser = userRepository.findByEmail(email).get();
            if (existingUser.isVerified()) {
                throw new BadRequestException("An account already exists with this email address. Please login instead.");
            }
            // If registered but not verified yet, update details and resend OTP
            existingUser.setFullName(request.getFullName().trim());
            existingUser.setPhone(request.getPhone());
            existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
            userRepository.save(existingUser);
        } else {
            User newUser = new User(
                    email,
                    passwordEncoder.encode(request.getPassword()),
                    request.getFullName().trim(),
                    request.getPhone(),
                    Role.ROLE_CUSTOMER,
                    false
            );
            userRepository.save(newUser);
        }

        // Send OTP
        String otp = otpService.generateOtp(email, "REGISTRATION");
        mailService.sendOtpEmail(email, otp, "Account Registration");
        return otp;
    }

    @Transactional
    public AuthResponse verifyRegistrationOtp(OtpVerifyRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        otpService.verifyOtp(email, request.getOtp(), "REGISTRATION");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        user.setVerified(true);
        userRepository.save(user);

        UserPrincipal principal = new UserPrincipal(user);
        String accessToken = jwtService.generateAccessToken(principal, user.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(principal);

        return new AuthResponse(
                accessToken,
                refreshToken,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getRole(),
                user.isVerified()
        );
    }

    public AuthResponse login(AuthRequest request, boolean adminOnly) {
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        String rawPassword = request.getPassword() != null ? request.getPassword().trim() : "";

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, rawPassword)
        );

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (!user.isVerified()) {
            // Trigger an OTP to allow customer to finish verification
            String otp = otpService.generateOtp(email, "REGISTRATION");
            mailService.sendOtpEmail(email, otp, "Account Verification");
            if (mailService.isMailConfigured()) {
                throw new BadRequestException("Account not verified. A 6-digit verification code has been sent to your email.");
            } else {
                throw new BadRequestException("Account not verified. Demo verification code: " + otp);
            }
        }

        if (adminOnly && user.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedException("Access denied: You do not have administrator permissions.");
        }

        UserPrincipal principal = new UserPrincipal(user);
        String accessToken = jwtService.generateAccessToken(principal, user.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(principal);

        return new AuthResponse(
                accessToken,
                refreshToken,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getRole(),
                user.isVerified()
        );
    }

    public String forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No account registered with email: " + email));

        String otp = otpService.generateOtp(email, "PASSWORD_RESET");
        mailService.sendOtpEmail(email, otp, "Password Reset");
        return otp;
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        otpService.verifyOtp(email, request.getOtp(), "PASSWORD_RESET");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public AuthResponse refreshToken(String refreshToken) {
        String email = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        UserPrincipal principal = new UserPrincipal(user);
        if (!jwtService.isTokenValid(refreshToken, principal)) {
            throw new UnauthorizedException("Refresh token has expired or is invalid");
        }

        String newAccessToken = jwtService.generateAccessToken(principal, user.getRole().name());
        String newRefreshToken = jwtService.generateRefreshToken(principal);

        return new AuthResponse(
                newAccessToken,
                newRefreshToken,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getRole(),
                user.isVerified()
        );
    }
}
