package com.vibeseekers.dto.shiprocket;

public class ShiprocketCourierCheckDto {

    private String pickupPincode = "440001"; // Default store hub
    private String deliveryPincode;
    private Integer weightKg = 1;
    private boolean isCod = false;

    public ShiprocketCourierCheckDto() {
    }

    public ShiprocketCourierCheckDto(String deliveryPincode) {
        this.deliveryPincode = deliveryPincode;
    }

    public String getPickupPincode() {
        return pickupPincode;
    }

    public void setPickupPincode(String pickupPincode) {
        this.pickupPincode = pickupPincode;
    }

    public String getDeliveryPincode() {
        return deliveryPincode;
    }

    public void setDeliveryPincode(String deliveryPincode) {
        this.deliveryPincode = deliveryPincode;
    }

    public Integer getWeightKg() {
        return weightKg;
    }

    public void setWeightKg(Integer weightKg) {
        this.weightKg = weightKg;
    }

    public boolean isCod() {
        return isCod;
    }

    public void setCod(boolean cod) {
        isCod = cod;
    }
}
