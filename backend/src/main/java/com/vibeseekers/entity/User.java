package com.vibeseekers.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.ROLE_CUSTOMER;

    @Column(nullable = false)
    private boolean isVerified = false;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "fullName", column = @Column(name = "addr_full_name")),
            @AttributeOverride(name = "mobileNumber", column = @Column(name = "addr_mobile_number")),
            @AttributeOverride(name = "email", column = @Column(name = "addr_email")),
            @AttributeOverride(name = "houseFlatNo", column = @Column(name = "addr_house_flat_no")),
            @AttributeOverride(name = "streetAddress", column = @Column(name = "addr_street_address")),
            @AttributeOverride(name = "landmark", column = @Column(name = "addr_landmark")),
            @AttributeOverride(name = "city", column = @Column(name = "addr_city")),
            @AttributeOverride(name = "state", column = @Column(name = "addr_state")),
            @AttributeOverride(name = "pincode", column = @Column(name = "addr_pincode"))
    })
    private ShippingAddress defaultAddress;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public User() {
    }

    public User(String email, String password, String fullName, String phone, Role role, boolean isVerified) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.phone = phone;
        this.role = role;
        this.isVerified = isVerified;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public ShippingAddress getDefaultAddress() {
        return defaultAddress;
    }

    public void setDefaultAddress(ShippingAddress defaultAddress) {
        this.defaultAddress = defaultAddress;
    }
}
