package com.vibeseekers.dto.shiprocket;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ShiprocketTrackingDto {

    private String awb;
    private String courierName;
    private String currentStatus;
    private String origin;
    private String destination;
    private String expectedDeliveryDate;
    private List<TrackingScan> trackingScans = new ArrayList<>();

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TrackingScan {
        private String date;
        private String activity;
        private String location;

        public TrackingScan() {
        }

        public TrackingScan(String date, String activity, String location) {
            this.date = date;
            this.activity = activity;
            this.location = location;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getActivity() {
            return activity;
        }

        public void setActivity(String activity) {
            this.activity = activity;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }
    }

    public ShiprocketTrackingDto() {
    }

    public String getAwb() {
        return awb;
    }

    public void setAwb(String awb) {
        this.awb = awb;
    }

    public String getCourierName() {
        return courierName;
    }

    public void setCourierName(String courierName) {
        this.courierName = courierName;
    }

    public String getCurrentStatus() {
        return currentStatus;
    }

    public void setCurrentStatus(String currentStatus) {
        this.currentStatus = currentStatus;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getExpectedDeliveryDate() {
        return expectedDeliveryDate;
    }

    public void setExpectedDeliveryDate(String expectedDeliveryDate) {
        this.expectedDeliveryDate = expectedDeliveryDate;
    }

    public List<TrackingScan> getTrackingScans() {
        return trackingScans;
    }

    public void setTrackingScans(List<TrackingScan> trackingScans) {
        this.trackingScans = trackingScans;
    }
}
