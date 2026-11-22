package com.vibeseekers.dto.product;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductImageDto {

    private Long id;
    private String imageUrl;
    private String publicId;

    @JsonProperty("primary")
    @JsonAlias({"isPrimary", "primary"})
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

    @JsonProperty("primary")
    public boolean isPrimary() {
        return isPrimary;
    }

    @JsonProperty("isPrimary")
    public boolean getIsPrimary() {
        return isPrimary;
    }

    @JsonSetter
    @JsonAlias({"isPrimary", "primary"})
    public void setPrimary(boolean primary) {
        isPrimary = primary;
    }

    public void setIsPrimary(boolean primary) {
        isPrimary = primary;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
