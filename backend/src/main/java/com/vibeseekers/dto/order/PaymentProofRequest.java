package com.vibeseekers.dto.order;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PaymentProofRequest {

    @NotBlank(message = "12-digit UPI UTR / Transaction ID is required")
    @Pattern(regexp = "^[0-9A-Za-z]{10,22}$", message = "Please enter a valid UPI Transaction Reference / UTR ID")
    private String upiTransactionId;

    private String screenshotUrl;

    public PaymentProofRequest() {
    }

    public PaymentProofRequest(String upiTransactionId, String screenshotUrl) {
        this.upiTransactionId = upiTransactionId;
        this.screenshotUrl = screenshotUrl;
    }

    public String getUpiTransactionId() {
        return upiTransactionId;
    }

    public void setUpiTransactionId(String upiTransactionId) {
        this.upiTransactionId = upiTransactionId;
    }

    public String getScreenshotUrl() {
        return screenshotUrl;
    }

    public void setScreenshotUrl(String screenshotUrl) {
        this.screenshotUrl = screenshotUrl;
    }
}
