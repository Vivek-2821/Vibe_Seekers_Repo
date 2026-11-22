package com.vibeseekers.dto.product;

import com.vibeseekers.entity.ProductCategory;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ProductResponseDto {

    private Long id;
    private String name;
    private String slug;
    private ProductCategory category;
    private BigDecimal price;
    private BigDecimal mrp;
    private Integer discountPercent;
    private String description;
    private String fabricDetails;
    private boolean isNewArrival;
    private boolean isBestSeller;
    private String colors;
    private String gsm;
    private String washingInstructions;
    private String collectionName;
    private boolean isActive;
    private String primaryImageUrl;
    private int totalStock;
    private List<ProductImageDto> images = new ArrayList<>();
    private List<SizeStockDto> sizeStocks = new ArrayList<>();
    private LocalDateTime createdAt;

    public ProductResponseDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public ProductCategory getCategory() {
        return category;
    }

    public void setCategory(ProductCategory category) {
        this.category = category;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getMrp() {
        return mrp;
    }

    public void setMrp(BigDecimal mrp) {
        this.mrp = mrp;
    }

    public Integer getDiscountPercent() {
        return discountPercent;
    }

    public void setDiscountPercent(Integer discountPercent) {
        this.discountPercent = discountPercent;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFabricDetails() {
        return fabricDetails;
    }

    public void setFabricDetails(String fabricDetails) {
        this.fabricDetails = fabricDetails;
    }

    public boolean isNewArrival() {
        return isNewArrival;
    }

    public void setNewArrival(boolean newArrival) {
        isNewArrival = newArrival;
    }

    public boolean isBestSeller() {
        return isBestSeller;
    }

    public void setBestSeller(boolean bestSeller) {
        isBestSeller = bestSeller;
    }

    public String getColors() {
        return colors;
    }

    public void setColors(String colors) {
        this.colors = colors;
    }

    public String getGsm() {
        return gsm;
    }

    public void setGsm(String gsm) {
        this.gsm = gsm;
    }

    public String getWashingInstructions() {
        return washingInstructions;
    }

    public void setWashingInstructions(String washingInstructions) {
        this.washingInstructions = washingInstructions;
    }

    public String getCollectionName() {
        return collectionName;
    }

    public void setCollectionName(String collectionName) {
        this.collectionName = collectionName;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getPrimaryImageUrl() {
        return primaryImageUrl;
    }

    public void setPrimaryImageUrl(String primaryImageUrl) {
        this.primaryImageUrl = primaryImageUrl;
    }

    public int getTotalStock() {
        return totalStock;
    }

    public void setTotalStock(int totalStock) {
        this.totalStock = totalStock;
    }

    public List<ProductImageDto> getImages() {
        return images;
    }

    public void setImages(List<ProductImageDto> images) {
        this.images = images;
    }

    public List<SizeStockDto> getSizeStocks() {
        return sizeStocks;
    }

    public void setSizeStocks(List<SizeStockDto> sizeStocks) {
        this.sizeStocks = sizeStocks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
