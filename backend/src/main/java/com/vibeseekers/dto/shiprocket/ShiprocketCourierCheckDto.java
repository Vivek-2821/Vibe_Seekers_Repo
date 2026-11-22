package com.vibeseekers.dto.shiprocket;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ShiprocketCourierCheckDto {

    private String pickupPincode = "440001"; // Default store hub
    private String deliveryPincode;
    private Integer weightKg = 1;

    @JsonProperty("cod")
    @JsonAlias({"isCod", "cod"})
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

    @JsonProperty("cod")
    public boolean isCod() {
        return isCod;
    }

    @JsonProperty("isCod")
    public boolean getIsCod() {
        return isCod;
    }

    @JsonSetter
    @JsonAlias({"isCod", "cod"})
    public void setCod(boolean cod) {
        isCod = cod;
    }

    public void setIsCod(boolean cod) {
        isCod = cod;
    }
}
