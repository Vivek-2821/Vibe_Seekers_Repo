package com.vibeseekers.dto.setting;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ShippingSettingsDto {

    @JsonProperty("shippingEnabled")
    @JsonAlias({"isShippingEnabled", "shippingEnabled"})
    private boolean shippingEnabled = false;

    private BigDecimal shippingAmount = new BigDecimal("79.00");

    public ShippingSettingsDto() {
    }

    public ShippingSettingsDto(boolean shippingEnabled, BigDecimal shippingAmount) {
        this.shippingEnabled = shippingEnabled;
        this.shippingAmount = shippingAmount;
    }

    public boolean isShippingEnabled() {
        return shippingEnabled;
    }

    public void setShippingEnabled(boolean shippingEnabled) {
        this.shippingEnabled = shippingEnabled;
    }

    public BigDecimal getShippingAmount() {
        return shippingAmount;
    }

    public void setShippingAmount(BigDecimal shippingAmount) {
        this.shippingAmount = shippingAmount;
    }
}
