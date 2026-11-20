package com.vibeseekers.dto.product;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SizeStockDto {

    @NotBlank(message = "Size is required")
    private String size; // S, M, L, XL, XXL

    @NotNull(message = "Stock cannot be null")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock = 0;

    public SizeStockDto() {
    }

    public SizeStockDto(String size, Integer stock) {
        this.size = size;
        this.stock = stock;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}
