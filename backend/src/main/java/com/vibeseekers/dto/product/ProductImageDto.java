package com.vibeseekers.dto.product;

public class ProductImageDto {

    private Long id;
    private String imageUrl;
    private String publicId;
    private boolean isPrimary;
    private Integer displayOrder;

    public ProductImageDto() {
    }

    public ProductImageDto(Long id, String imageUrl, String publicId, boolean isPrimary, Integer displayOrder) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.publicId = publicId;
        this.isPrimary = isPrimary;
        this.displayOrder = displayOrder;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getPublicId() {
        return publicId;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }

    public boolean isPrimary() {
        return isPrimary;
    }

    public void setPrimary(boolean primary) {
        isPrimary = primary;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
