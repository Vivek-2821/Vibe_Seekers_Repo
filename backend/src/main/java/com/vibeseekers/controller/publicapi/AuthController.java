package com.vibeseekers.controller.publicapi;

import com.vibeseekers.dto.auth.*;
import com.vibeseekers.dto.common.ApiResponse;
import com.vibeseekers.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping({"/register", "/signup"})
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@Valid @RequestBody RegisterRequest request) {
        String otp = authService.register(request);
        Map<String, Object> data = new HashMap<>();
        boolean mailConfigured = authService.isMailConfigured();
        if (!mailConfigured) {
            data.put("demoOtp", otp);
            return ResponseEntity.ok(ApiResponse.ok("Verification code generated (demo mode): " + otp, data));
        }
        return ResponseEntity.ok(ApiResponse.ok("A 6-digit verification code has been sent to " + request.getEmail().toLowerCase().trim(), data));
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
    public ResponseEntity<ApiResponse<Map<String, Object>>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String otp = authService.forgotPassword(request);
        Map<String, Object> data = new HashMap<>();
        boolean mailConfigured = authService.isMailConfigured();
        if (!mailConfigured) {
            data.put("demoOtp", otp);
            return ResponseEntity.ok(ApiResponse.ok("Password reset code generated (demo mode): " + otp, data));
        }
        return ResponseEntity.ok(ApiResponse.ok("A 6-digit password reset code has been sent to " + request.getEmail().toLowerCase().trim(), data));
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
