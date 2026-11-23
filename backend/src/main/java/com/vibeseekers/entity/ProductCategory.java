package com.vibeseekers.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum ProductCategory {
    TSHIRTS,
    HOODIES,
    JACKETS,
    CUSTOMIZE_TSHIRTS;

    @JsonCreator
    public static ProductCategory fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        String clean = value.trim().toUpperCase().replace("-", "_").replace(" ", "_");
        if (clean.equals("CUSTOM") || clean.equals("CUSTOMIZE") || clean.equals("CUSTOM_TSHIRTS")
                || clean.equals("CUSTOMIZED_TSHIRTS")) {
            return CUSTOMIZE_TSHIRTS;
        }
        for (ProductCategory category : values()) {
            if (category.name().equalsIgnoreCase(clean)) {
                return category;
            }
        }
        return valueOf(clean);
    }
}
