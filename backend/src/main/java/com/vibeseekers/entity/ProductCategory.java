package com.vibeseekers.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum ProductCategory {
    TSHIRTS,
    HOODIES,
    JACKETS,
    CUSTOMIZE_TSHIRTS,
    SHIRTS;

    @JsonCreator
    public static ProductCategory fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        String clean = value.trim().toLowerCase().replaceAll("[\\s-_]+", "");
        if (clean.equals("all")) {
            return null;
        }
        if (clean.contains("custom")) {
            return CUSTOMIZE_TSHIRTS;
        }
        if (clean.contains("tshirt") || clean.contains("tee")) {
            return TSHIRTS;
        }
        if (clean.contains("hoodie")) {
            return HOODIES;
        }
        if (clean.contains("jacket")) {
            return JACKETS;
        }
        if (clean.contains("shirt")) {
            return SHIRTS;
        }
        for (ProductCategory category : values()) {
            if (category.name().equalsIgnoreCase(value.trim()) || category.name().equalsIgnoreCase(clean)) {
                return category;
            }
        }
        return null;
    }
}
