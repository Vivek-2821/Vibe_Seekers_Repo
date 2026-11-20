package com.vibeseekers.entity;

import jakarta.persistence.Embeddable;

@Embeddable
public class ShippingAddress {

    private String fullName;
    private String mobileNumber;
    private String email;
    private String houseFlatNo;
    private String streetAddress;
    private String landmark;
    private String city;
    private String state;
    private String pincode;

    public ShippingAddress() {
    }

    public ShippingAddress(String fullName, String mobileNumber, String email, String houseFlatNo,
                           String streetAddress, String landmark, String city, String state, String pincode) {
        this.fullName = fullName;
        this.mobileNumber = mobileNumber;
        this.email = email;
        this.houseFlatNo = houseFlatNo;
        this.streetAddress = streetAddress;
        this.landmark = landmark;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getHouseFlatNo() {
        return houseFlatNo;
    }

    public void setHouseFlatNo(String houseFlatNo) {
        this.houseFlatNo = houseFlatNo;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getLandmark() {
        return landmark;
    }

    public void setLandmark(String landmark) {
        this.landmark = landmark;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getFormattedAddress() {
        StringBuilder sb = new StringBuilder();
        if (houseFlatNo != null && !houseFlatNo.isEmpty()) sb.append(houseFlatNo).append(", ");
        if (streetAddress != null && !streetAddress.isEmpty()) sb.append(streetAddress).append(", ");
        if (landmark != null && !landmark.isEmpty()) sb.append("Near ").append(landmark).append(", ");
        if (city != null) sb.append(city).append(", ");
        if (state != null) sb.append(state).append(" - ");
        if (pincode != null) sb.append(pincode);
        return sb.toString();
    }
}
