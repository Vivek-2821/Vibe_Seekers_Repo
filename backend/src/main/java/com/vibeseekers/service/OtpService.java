package com.vibeseekers.service;

import com.vibeseekers.entity.OtpToken;
import com.vibeseekers.exception.BadRequestException;
import com.vibeseekers.repository.OtpTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OtpService {

    private final OtpTokenRepository otpTokenRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int RESEND_COOLDOWN_SECONDS = 60;

    public OtpService(OtpTokenRepository otpTokenRepository) {
        this.otpTokenRepository = otpTokenRepository;
    }

    @Transactional
    public String generateOtp(String email, String purpose) {
        // Check cooldown from last sent OTP
        Optional<OtpToken> lastOtpOpt = otpTokenRepository.findTopByEmailOrderByCreatedAtDesc(email);
        if (lastOtpOpt.isPresent()) {
            OtpToken lastOtp = lastOtpOpt.get();
            if (lastOtp.getCreatedAt() != null &&
                lastOtp.getCreatedAt().plusSeconds(RESEND_COOLDOWN_SECONDS).isAfter(LocalDateTime.now())) {
                throw new BadRequestException("Please wait 60 seconds before requesting another OTP.");
            }
        }

        // Generate cryptographic 6-digit OTP
        int code = 100000 + secureRandom.nextInt(900000);
        String otpCode = String.valueOf(code);

        OtpToken otpToken = new OtpToken(
                email.toLowerCase().trim(),
                otpCode,
                purpose,
                LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES)
        );

        otpTokenRepository.save(otpToken);
        return otpCode;
    }

    @Transactional
    public boolean verifyOtp(String email, String otpCode, String purpose) {
        Optional<OtpToken> tokenOpt = otpTokenRepository.findTopByEmailAndPurposeAndIsUsedFalseOrderByCreatedAtDesc(
                email.toLowerCase().trim(), purpose
        );

        if (tokenOpt.isEmpty()) {
            throw new BadRequestException("No active OTP found for this email. Please request a new code.");
        }

        OtpToken token = tokenOpt.get();

        if (token.isExpired()) {
            throw new BadRequestException("OTP has expired. Please request a new code.");
        }

        if (!token.getOtpCode().equals(otpCode.trim())) {
            throw new BadRequestException("Invalid OTP code. Please check and try again.");
        }

        token.setUsed(true);
        otpTokenRepository.save(token);
        return true;
    }
}
