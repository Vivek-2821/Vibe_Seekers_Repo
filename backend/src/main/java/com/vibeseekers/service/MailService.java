package com.vibeseekers.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibeseekers.entity.Order;
import com.vibeseekers.exception.BadRequestException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpTimeoutException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);
    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    private final JavaMailSender mailSender;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Value("${app.brevo.api-key:${BREVO_API_KEY:}}")
    private String brevoApiKey;

    @Value("${spring.mail.username:${MAIL_USERNAME:vibeseekers09@gmail.com}}")
    private String fromEmail;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${app.brevo.sender-name:Vibe Seekers}")
    private String senderName;

    public MailService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public boolean isMailConfigured() {
        boolean hasBrevo = brevoApiKey != null && !brevoApiKey.trim().isEmpty();
        boolean hasSmtp = mailPassword != null && !mailPassword.trim().isEmpty();
        return hasBrevo || hasSmtp;
    }

    public boolean isBrevoConfigured() {
        return brevoApiKey != null && !brevoApiKey.trim().isEmpty();
    }

    public void sendOtpEmail(String toEmail, String otpCode, String purpose) {
        String subject = "VIBE SEEKERS — Verification Code: " + otpCode;
        String htmlContent = buildOtpEmailHtml(otpCode, purpose);

        sendEmail(toEmail, subject, htmlContent, true);
    }

    @Async
    public void sendOrderConfirmationEmail(Order order) {
        String subject = "VIBE SEEKERS — Order Placed #" + order.getOrderNumber();
        String htmlContent = buildOrderEmailHtml(order);

        sendEmail(order.getShippingAddress().getEmail(), subject, htmlContent, false);
    }

    @Async
    public void sendPaymentVerifiedEmail(Order order) {
        String subject = "VIBE SEEKERS — Payment Verified for #" + order.getOrderNumber();
        String htmlContent = "<div style='background-color:#0a0a0a; color:#ffffff; padding:30px; font-family:sans-serif;'>"
                + "<h1 style='color:#ff4d00; text-transform:uppercase;'>Payment Verified</h1>"
                + "<p>Great news! Your payment of <strong>₹" + order.getTotalAmount() + "</strong> for Order <strong>#" + order.getOrderNumber() + "</strong> has been approved.</p>"
                + "<p>Our warehouse team is now packing your fresh streetwear drip. We will notify you with the Shiprocket AWB tracking link as soon as it is dispatched.</p>"
                + "<hr style='border:1px solid #27272a; margin:20px 0;'/>"
                + "<p style='color:#a1a1aa; font-size:12px;'>VIBE SEEKERS | vibeseekers09@gmail.com | +91 9860498749</p>"
                + "</div>";

        sendEmail(order.getShippingAddress().getEmail(), subject, htmlContent, false);
    }

    private void sendEmail(String toEmail, String subject, String htmlContent, boolean failOnError) {
        if (isBrevoConfigured()) {
            sendEmailViaBrevo(toEmail, subject, htmlContent, failOnError);
            return;
        }

        if (mailPassword != null && !mailPassword.trim().isEmpty() && mailSender != null) {
            sendEmailViaSmtp(toEmail, subject, htmlContent, failOnError);
            return;
        }

        // Local development & testing fallback (mock email logged)
        log.info("============== [MOCK EMAIL SENT (Local Dev)] ==============");
        log.info("To: {}", toEmail);
        log.info("Subject: {}", subject);
        log.info("From: {} ({})", fromEmail, senderName);
        log.info("Content preview: {}", htmlContent.replaceAll("<[^>]*>", " ").replaceAll("\\s+", " ").trim().substring(0, Math.min(180, htmlContent.length())));
        log.info("===========================================================");
    }

    private void sendEmailViaBrevo(String toEmail, String subject, String htmlContent, boolean failOnError) {
        try {
            Map<String, Object> payload = new HashMap<>();

            Map<String, String> sender = new HashMap<>();
            sender.put("name", (senderName != null && !senderName.isBlank()) ? senderName.trim() : "Vibe Seekers");
            sender.put("email", (fromEmail != null && !fromEmail.isBlank()) ? fromEmail.trim() : "vibeseekers09@gmail.com");
            payload.put("sender", sender);

            List<Map<String, String>> toList = new ArrayList<>();
            Map<String, String> recipient = new HashMap<>();
            recipient.put("email", toEmail.trim());
            toList.add(recipient);
            payload.put("to", toList);

            payload.put("subject", subject);
            payload.put("htmlContent", htmlContent);

            String jsonPayload = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(BREVO_API_URL))
                    .timeout(Duration.ofSeconds(10))
                    .header("api-key", brevoApiKey.trim())
                    .header("accept", "application/json")
                    .header("content-type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            int statusCode = response.statusCode();

            if (statusCode >= 200 && statusCode < 300) {
                log.info("Email sent successfully to {} via Brevo REST API (HTTP {})", toEmail, statusCode);
            } else {
                String responseBody = response.body();
                log.error("Brevo API rejected email to {}. HTTP {} - Body: {}", toEmail, statusCode, responseBody);
                String errorDetails = parseBrevoErrorMessage(responseBody, statusCode);
                if (failOnError) {
                    throw new BadRequestException("Failed to send verification email: " + errorDetails);
                }
            }
        } catch (BadRequestException e) {
            throw e;
        } catch (HttpTimeoutException e) {
            log.error("Brevo API request timed out after 10s when sending to {}: {}", toEmail, e.getMessage());
            if (failOnError) {
                throw new BadRequestException("Email service timed out while sending verification code. Please try again.");
            }
        } catch (Exception e) {
            log.error("Failed to send email to {} via Brevo API: {}", toEmail, e.getMessage());
            if (failOnError) {
                throw new BadRequestException("Failed to send verification email: " + e.getMessage());
            }
        }
    }

    private void sendEmailViaSmtp(String toEmail, String subject, String htmlContent, boolean failOnError) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, (senderName != null && !senderName.isBlank()) ? senderName.trim() : "Vibe Seekers");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Email sent successfully to {} via SMTP", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email to {} via SMTP: {}", toEmail, e.getMessage());
            if (failOnError) {
                throw new BadRequestException("Failed to send verification email: " + e.getMessage());
            }
        }
    }

    private String parseBrevoErrorMessage(String responseBody, int statusCode) {
        if (responseBody == null || responseBody.isBlank()) {
            return "Brevo API returned HTTP " + statusCode;
        }
        try {
            JsonNode node = objectMapper.readTree(responseBody);
            if (node.has("message") && !node.get("message").asText().isBlank()) {
                return node.get("message").asText();
            }
        } catch (Exception ignored) {
        }
        return responseBody.length() > 200 ? responseBody.substring(0, 200) : responseBody;
    }

    private String buildOtpEmailHtml(String otpCode, String purpose) {
        return "<div style='background-color:#0a0a0a; color:#ffffff; padding:40px; font-family:Arial, sans-serif; text-align:center; max-width:600px; margin:0 auto; border:1px solid #27272a; border-radius:12px;'>"
                + "<h2 style='letter-spacing:4px; font-size:26px; margin-bottom:10px; color:#ffffff;'>VIBE SEEKERS</h2>"
                + "<p style='color:#ff4d00; font-size:14px; text-transform:uppercase; letter-spacing:2px; font-weight:bold;'>AUTHENTIC INDIAN STREETWEAR</p>"
                + "<div style='margin:30px 0; background-color:#121212; border:1px solid #27272a; border-radius:8px; padding:25px;'>"
                + "<p style='font-size:15px; color:#a1a1aa; margin-top:0;'>Your single-use 6-digit verification code for " + purpose.toLowerCase().replace('_', ' ') + " is:</p>"
                + "<h1 style='font-size:42px; letter-spacing:10px; color:#ffffff; margin:15px 0; font-family:monospace;'>" + otpCode + "</h1>"
                + "<p style='color:#a1a1aa; font-size:13px; margin-bottom:0;'>This code expires in <strong>5 minutes</strong>. Never share this OTP with anyone.</p>"
                + "</div>"
                + "<p style='color:#71717a; font-size:12px;'>If you did not request this verification, please ignore this email or contact support at vibeseekers09@gmail.com.</p>"
                + "</div>";
    }

    private String buildOrderEmailHtml(Order order) {
        return "<div style='background-color:#0a0a0a; color:#ffffff; padding:40px; font-family:Arial, sans-serif; max-width:600px; margin:0 auto; border:1px solid #27272a; border-radius:12px;'>"
                + "<h2 style='letter-spacing:4px; color:#ffffff; margin-bottom:5px;'>VIBE SEEKERS</h2>"
                + "<p style='color:#ff4d00; font-size:14px; text-transform:uppercase; letter-spacing:1px; margin-top:0;'>Order Confirmed</p>"
                + "<p>Thank you for shopping with Vibe Seekers. We have received your order <strong>#" + order.getOrderNumber() + "</strong>.</p>"
                + "<div style='background-color:#121212; border:1px solid #27272a; padding:15px; border-radius:8px; margin:20px 0;'>"
                + "<p style='margin:5px 0;'><strong>Total Amount:</strong> ₹" + order.getTotalAmount() + "</p>"
                + "<p style='margin:5px 0;'><strong>Payment Method:</strong> " + order.getPayment().getPaymentMethod() + "</p>"
                + "<p style='margin:5px 0;'><strong>Payment Status:</strong> " + order.getPayment().getPaymentStatus() + "</p>"
                + "<p style='margin:5px 0;'><strong>Shipping To:</strong> " + order.getShippingAddress().getFormattedAddress() + "</p>"
                + "</div>"
                + "<p style='color:#a1a1aa; font-size:13px;'>Note: Returns are currently unavailable. Please contact WhatsApp support (+91 9860498749) for any shipping inquiries.</p>"
                + "</div>";
    }
}
