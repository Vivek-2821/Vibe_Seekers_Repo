package com.vibeseekers.dto.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class OrderItemRequestDto {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotBlank(message = "Size is required")
    private String size;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    public OrderItemRequestDto() {
    }

    public OrderItemRequestDto(Long productId, String size, Integer quantity) {
        this.productId = productId;
        this.size = size;
        this.quantity = quantity;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
