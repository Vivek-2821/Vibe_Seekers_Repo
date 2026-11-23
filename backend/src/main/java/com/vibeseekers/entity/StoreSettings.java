package com.vibeseekers.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "store_config_settings")
public class StoreSettings {

    @Id
    private Long id = 1L;

    @Column(nullable = false)
    private boolean shippingEnabled = false;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal shippingAmount = new BigDecimal("79.00");

    public StoreSettings() {
    }

    public StoreSettings(Long id, boolean shippingEnabled, BigDecimal shippingAmount) {
        this.id = id;
        this.shippingEnabled = shippingEnabled;
        this.shippingAmount = shippingAmount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
