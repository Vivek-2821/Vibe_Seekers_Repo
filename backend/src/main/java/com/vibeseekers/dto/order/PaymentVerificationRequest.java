package com.vibeseekers.dto.order;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.validation.constraints.NotNull;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PaymentVerificationRequest {

    @NotNull(message = "Approved status flag is required")
    @JsonProperty("approved")
    @JsonAlias({"isApproved", "approved"})
    private Boolean approved;

    private String rejectionReason;

    public PaymentVerificationRequest() {
    }

    public PaymentVerificationRequest(Boolean approved, String rejectionReason) {
        this.approved = approved;
        this.rejectionReason = rejectionReason;
    }

    @JsonProperty("approved")
    public Boolean getApproved() {
        return approved;
    }

    @JsonProperty("isApproved")
    public Boolean getIsApproved() {
        return approved;
    }

    @JsonSetter
    @JsonAlias({"isApproved", "approved"})
    public void setApproved(Boolean approved) {
        this.approved = approved;
    }

    public void setIsApproved(Boolean approved) {
        this.approved = approved;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
