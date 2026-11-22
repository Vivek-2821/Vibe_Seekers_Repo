package com.vibeseekers.entity;

public enum OrderStatus {
    ORDER_PLACED,
    CONFIRMED,
    PROCESSING,
    SHIPPED,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED,
    // Preserved for backward compatibility with existing DB entries
    PENDING_PAYMENT,
    PAYMENT_VERIFIED
}
