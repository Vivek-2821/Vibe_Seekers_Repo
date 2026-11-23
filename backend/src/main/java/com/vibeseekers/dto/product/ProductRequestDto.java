package com.vibeseekers.dto.product;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.vibeseekers.entity.ProductCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductRequestDto {

    @NotBlank(message = "Product name is required")
    private String name;

    @NotNull(message = "Category is required")
    private ProductCategory category; // TSHIRTS, HOODIES, JACKETS

    @NotNull(message = "Price is required")
    @DecimalMin(value = "1.0", message = "Price must be at least ₹1")
    private BigDecimal price;

    private BigDecimal mrp;

    private Integer discountPercent;

    @NotBlank(message = "Description is required")
    private String description;

    private String fabricDetails;

    @JsonProperty("newArrival")
    @JsonAlias({"isNewArrival", "newArrival"})
    private boolean newArrival = false;

    @JsonProperty("bestSeller")
    @JsonAlias({"isBestSeller", "bestSeller"})
    private boolean bestSeller = false;

    private String colors;

    private String gsm;

    private String washingInstructions;

    private String collectionName;

    @JsonProperty("active")
    @JsonAlias({"isActive", "active"})
    private Boolean active = true;

    @JsonProperty("customizable")
    @JsonAlias({"isCustomizable", "customizable"})
    private boolean customizable = false;

    private List<SizeStockDto> sizeStocks = new ArrayList<>();

    @JsonProperty("existingImages")
    @JsonAlias({"images", "existingImages"})
    private List<ProductImageDto> existingImages = new ArrayList<>();

    public ProductRequestDto() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
        return newArrival;
    }

    public void setNewArrival(boolean newArrival) {
        this.newArrival = newArrival;
    }

    public boolean isBestSeller() {
        return bestSeller;
    }

    public void setBestSeller(boolean bestSeller) {
        this.bestSeller = bestSeller;
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
        return active != null ? active : true;
    }

    public Boolean getActive() {
        return active != null ? active : true;
    }

    public void setActive(Boolean active) {
        this.active = active != null ? active : true;
    }

    public boolean isCustomizable() {
        return customizable;
    }

    public void setCustomizable(boolean customizable) {
        this.customizable = customizable;
    }

    public List<SizeStockDto> getSizeStocks() {
        return sizeStocks;
    }

    public void setSizeStocks(List<SizeStockDto> sizeStocks) {
        this.sizeStocks = sizeStocks;
    }

    public List<ProductImageDto> getExistingImages() {
        return existingImages;
    }

    public void setExistingImages(List<ProductImageDto> existingImages) {
        this.existingImages = existingImages;
    }
}
