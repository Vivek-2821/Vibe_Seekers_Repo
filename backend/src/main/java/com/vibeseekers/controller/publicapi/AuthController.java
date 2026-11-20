package com.vibeseekers.controller.publicapi;

import com.vibeseekers.dto.auth.*;
import com.vibeseekers.dto.common.ApiResponse;
import com.vibeseekers.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        String otp = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Verification OTP code sent! OTP: " + otp, otp));
    }

    @PostMapping("/verify-registration")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyRegistration(@Valid @RequestBody OtpVerifyRequest request) {
        AuthResponse response = authService.verifyRegistrationOtp(request);
        return ResponseEntity.ok(ApiResponse.ok("Account verified and registered successfully!", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request, false);
        return ResponseEntity.ok(ApiResponse.ok("Logged in successfully", response));
    }

    @PostMapping("/admin-login")
    public ResponseEntity<ApiResponse<AuthResponse>> adminLogin(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request, true);
        return ResponseEntity.ok(ApiResponse.ok("Admin authenticated successfully", response));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String otp = authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.ok("Password reset OTP sent! OTP: " + otp, otp));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.ok("Password has been reset successfully. You can now login.", null));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@RequestBody Map<String, String> body) {
        String token = body.get("refreshToken");
        AuthResponse response = authService.refreshToken(token);
        return ResponseEntity.ok(ApiResponse.ok("Token refreshed", response));
    }
}
