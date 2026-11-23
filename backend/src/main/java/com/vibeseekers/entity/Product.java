package com.vibeseekers.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductCategory category; // TSHIRTS, HOODIES, JACKETS

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 10, scale = 2)
    private BigDecimal mrp;

    @Column(name = "discount_percent")
    private Integer discountPercent;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String fabricDetails; // e.g. 240 GSM, 100% Combed Cotton, Acid Wash

    @Column(nullable = false)
    private boolean isNewArrival = false;

    private Boolean isBestSeller = false;

    private String colors; // e.g. "Acid Black, Vintage White, Olive, Charcoal"

    private String gsm; // e.g. "240 GSM", "400 GSM Heavyweight Fleece"

    @Column(columnDefinition = "TEXT")
    private String washingInstructions;

    private String collectionName; // e.g. "Monochrome Drop 01", "Winter Cargo '26"

    @Column(name = "is_active", columnDefinition = "boolean default true")
    private Boolean isActive = true;

    @Column(nullable = false)
    private boolean isCustomizable = false;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<ProductSizeStock> sizeStocks = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isActive == null) {
            isActive = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (isActive == null) {
            isActive = true;
        }
    }

    public Product() {
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

    public Boolean isBestSeller() {
        return isBestSeller != null && isBestSeller;
    }

    @com.fasterxml.jackson.annotation.JsonIgnore
    public Boolean getIsBestSeller() {
        return isBestSeller != null && isBestSeller;
    }

    public void setBestSeller(Boolean bestSeller) {
        this.isBestSeller = bestSeller != null ? bestSeller : false;
    }

    @com.fasterxml.jackson.annotation.JsonIgnore
    public void setIsBestSeller(Boolean bestSeller) {
        this.isBestSeller = bestSeller != null ? bestSeller : false;
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

    public Boolean getIsActive() {
        return isActive != null ? isActive : true;
    }

    public boolean isActive() {
        return isActive != null ? isActive : true;
    }

    public void setActive(Boolean active) {
        this.isActive = active != null ? active : true;
    }

    public void setIsActive(Boolean active) {
        this.isActive = active != null ? active : true;
    }

    public boolean isCustomizable() {
        return isCustomizable || category == ProductCategory.CUSTOMIZE_TSHIRTS;
    }

    public void setCustomizable(boolean customizable) {
        isCustomizable = customizable;
    }

    public List<ProductImage> getImages() {
        return images;
    }

    public void setImages(List<ProductImage> images) {
        this.images = images;
    }

    public List<ProductSizeStock> getSizeStocks() {
        return sizeStocks;
    }

    public void setSizeStocks(List<ProductSizeStock> sizeStocks) {
        this.sizeStocks = sizeStocks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public String getPrimaryImageUrl() {
        if (images == null || images.isEmpty()) return null;
        return images.stream()
                .filter(ProductImage::isPrimary)
                .findFirst()
                .map(ProductImage::getImageUrl)
                .orElse(images.get(0).getImageUrl());
    }

    public int getTotalStock() {
        if (sizeStocks == null) return 0;
        return sizeStocks.stream().mapToInt(ProductSizeStock::getStock).sum();
    }
}
