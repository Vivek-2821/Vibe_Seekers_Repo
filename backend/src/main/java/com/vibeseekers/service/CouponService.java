package com.vibeseekers.service;

import com.vibeseekers.entity.Coupon;
import com.vibeseekers.exception.BadRequestException;
import com.vibeseekers.exception.ResourceNotFoundException;
import com.vibeseekers.repository.CouponRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    public Map<String, Object> validateCoupon(String code, BigDecimal orderAmount) {
        if (code == null || code.trim().isEmpty()) {
            throw new BadRequestException("Coupon code is required");
        }
        String cleanCode = code.trim().toUpperCase();
        Coupon coupon = couponRepository.findByCodeIgnoreCaseAndIsActiveTrue(cleanCode)
                .orElseThrow(() -> new BadRequestException("Invalid or inactive coupon code: " + cleanCode));

        if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Coupon code " + cleanCode + " has expired.");
        }

        if (orderAmount != null && coupon.getMinOrderAmount() != null &&
                orderAmount.compareTo(coupon.getMinOrderAmount()) < 0) {
            throw new BadRequestException("Minimum order amount of ₹" + coupon.getMinOrderAmount() + " required to use this coupon.");
        }

        BigDecimal discountAmount = BigDecimal.ZERO;
        if (orderAmount != null && orderAmount.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal percent = BigDecimal.valueOf(coupon.getDiscountPercent());
            discountAmount = orderAmount.multiply(percent).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (coupon.getMaxDiscountAmount() != null && coupon.getMaxDiscountAmount().compareTo(BigDecimal.ZERO) > 0) {
                if (discountAmount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                    discountAmount = coupon.getMaxDiscountAmount();
                }
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("valid", true);
        result.put("code", coupon.getCode());
        result.put("discountPercent", coupon.getDiscountPercent());
        result.put("discountAmount", discountAmount);
        result.put("minOrderAmount", coupon.getMinOrderAmount());
        result.put("maxDiscountAmount", coupon.getMaxDiscountAmount());
        result.put("message", coupon.getDiscountPercent() + "% OFF applied successfully!");
        return result;
    }

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    @Transactional
    public Coupon createCoupon(Coupon coupon) {
        if (couponRepository.existsByCodeIgnoreCase(coupon.getCode())) {
            throw new BadRequestException("Coupon code " + coupon.getCode() + " already exists.");
        }
        coupon.setCode(coupon.getCode().toUpperCase().trim());
        return couponRepository.save(coupon);
    }

    @Transactional
    public void deleteCoupon(Long id) {
        if (!couponRepository.existsById(id)) {
            throw new ResourceNotFoundException("Coupon not found with id: " + id);
        }
        couponRepository.deleteById(id);
    }
}
