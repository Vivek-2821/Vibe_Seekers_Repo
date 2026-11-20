package com.vibeseekers.service;

import com.vibeseekers.entity.Order;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:vibeseekers09@gmail.com}")
    private String fromEmail;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendOtpEmail(String toEmail, String otpCode, String purpose) {
        String subject = "VIBE SEEKERS — Verification Code: " + otpCode;
        String htmlContent = buildOtpEmailHtml(otpCode, purpose);

        sendEmail(toEmail, subject, htmlContent);
    }

    @Async
    public void sendOrderConfirmationEmail(Order order) {
        String subject = "VIBE SEEKERS — Order Placed #" + order.getOrderNumber();
        String htmlContent = buildOrderEmailHtml(order);

        sendEmail(order.getShippingAddress().getEmail(), subject, htmlContent);
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

        sendEmail(order.getShippingAddress().getEmail(), subject, htmlContent);
    }

    private void sendEmail(String toEmail, String subject, String htmlContent) {
        // If password is not set, log gracefully (convenient for local dev & testing)
        if (mailPassword == null || mailPassword.trim().isEmpty()) {
            log.info("============== [MOCK EMAIL SENT] ==============");
            log.info("To: {}", toEmail);
            log.info("Subject: {}", subject);
            log.info("From: {}", fromEmail);
            log.info("Content preview: {}", htmlContent.replaceAll("<[^>]*>", " ").substring(0, Math.min(180, htmlContent.length())));
            log.info("===============================================");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "VIBE SEEKERS");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Email sent successfully to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
        }
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
