package com.vibeseekers.dto.product;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductImageDto {

    private Long id;
    private String imageUrl;
    private String publicId;

    @JsonProperty("primary")
    @JsonAlias({"isPrimary", "primary"})
    private boolean primary;

    private Integer displayOrder;

    public ProductImageDto() {
    }

    public ProductImageDto(Long id, String imageUrl, String publicId, boolean primary, Integer displayOrder) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.publicId = publicId;
        this.primary = primary;
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
        return primary;
    }

    public void setPrimary(boolean primary) {
        this.primary = primary;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
