package com.vibeseekers.controller.customer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibeseekers.dto.common.ApiResponse;
import com.vibeseekers.dto.order.CreateOrderRequest;
import com.vibeseekers.dto.order.OrderResponseDto;
import com.vibeseekers.dto.order.PaymentProofRequest;
import com.vibeseekers.entity.ShippingAddress;
import com.vibeseekers.entity.User;
import com.vibeseekers.repository.UserRepository;
import com.vibeseekers.security.UserPrincipal;
import com.vibeseekers.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    private final OrderService orderService;
    private final UserRepository userRepository;
    private final com.vibeseekers.service.WishlistService wishlistService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public CustomerController(OrderService orderService,
                              UserRepository userRepository,
                              com.vibeseekers.service.WishlistService wishlistService) {
        this.orderService = orderService;
        this.userRepository = userRepository;
        this.wishlistService = wishlistService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("email", user.getEmail());
        profile.put("fullName", user.getFullName());
        profile.put("phone", user.getPhone());
        profile.put("role", user.getRole());
        profile.put("defaultAddress", user.getDefaultAddress());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, Object> body
    ) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        if (body.containsKey("fullName")) user.setFullName((String) body.get("fullName"));
        if (body.containsKey("phone")) user.setPhone((String) body.get("phone"));

        if (body.containsKey("defaultAddress")) {
            ShippingAddress addr = objectMapper.convertValue(body.get("defaultAddress"), ShippingAddress.class);
            user.setDefaultAddress(addr);
        }

        userRepository.save(user);

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("email", user.getEmail());
        profile.put("fullName", user.getFullName());
        profile.put("phone", user.getPhone());
        profile.put("defaultAddress", user.getDefaultAddress());
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", profile));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderResponseDto>>> getMyOrders(@AuthenticationPrincipal UserPrincipal principal) {
        List<OrderResponseDto> orders = orderService.getUserOrders(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @PostMapping(value = "/orders", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ApiResponse<OrderResponseDto>> createOrderWithScreenshot(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestPart("orderData") String orderDataJson,
            @RequestPart(value = "screenshot", required = false) MultipartFile screenshot
    ) throws Exception {
        CreateOrderRequest request = objectMapper.readValue(orderDataJson, CreateOrderRequest.class);
        User user = null;
        if (principal != null && principal.getId() != null) {
            user = userRepository.findById(principal.getId()).orElse(null);
        }
        OrderResponseDto order = orderService.createOrder(user, request, screenshot);
        return ResponseEntity.ok(ApiResponse.ok("Order placed successfully!", order));
    }

    @PostMapping(value = "/orders", consumes = { MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<ApiResponse<OrderResponseDto>> createOrderJson(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateOrderRequest request
    ) {
        User user = null;
        if (principal != null && principal.getId() != null) {
            user = userRepository.findById(principal.getId()).orElse(null);
        }
        OrderResponseDto order = orderService.createOrder(user, request, null);
        return ResponseEntity.ok(ApiResponse.ok("Order placed successfully!", order));
    }

    @PostMapping(value = "/orders/{orderNumber}/payment-proof", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ApiResponse<OrderResponseDto>> submitPaymentProofMultipart(
            @PathVariable String orderNumber,
            @RequestParam("upiTransactionId") String upiTransactionId,
            @RequestPart(value = "screenshot", required = false) MultipartFile screenshot
    ) {
        PaymentProofRequest proof = new PaymentProofRequest(upiTransactionId, null);
        OrderResponseDto order = orderService.submitPaymentProof(orderNumber, proof, screenshot);
        return ResponseEntity.ok(ApiResponse.ok("Payment proof submitted for verification", order));
    }

    @PostMapping(value = "/orders/{orderNumber}/payment-proof", consumes = { MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<ApiResponse<OrderResponseDto>> submitPaymentProofJson(
            @PathVariable String orderNumber,
            @Valid @RequestBody PaymentProofRequest proof
    ) {
        OrderResponseDto order = orderService.submitPaymentProof(orderNumber, proof, null);
        return ResponseEntity.ok(ApiResponse.ok("Payment proof submitted for verification", order));
    }

    // ==================== WISHLIST ====================

    @GetMapping("/wishlist")
    public ResponseEntity<ApiResponse<List<com.vibeseekers.dto.product.ProductResponseDto>>> getMyWishlist(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(ApiResponse.ok(wishlistService.getWishlist(principal.getId())));
    }

    @PostMapping("/wishlist/{productId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleWishlist(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long productId
    ) {
        boolean added = wishlistService.toggleWishlist(principal.getId(), productId);
        Map<String, Object> resp = new HashMap<>();
        resp.put("productId", productId);
        resp.put("inWishlist", added);
        resp.put("message", added ? "Added to wishlist" : "Removed from wishlist");
        return ResponseEntity.ok(ApiResponse.ok(resp));
    }

    @DeleteMapping("/wishlist/{productId}")
    public ResponseEntity<ApiResponse<String>> removeFromWishlist(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long productId
    ) {
        wishlistService.removeFromWishlist(principal.getId(), productId);
        return ResponseEntity.ok(ApiResponse.ok("Removed from wishlist", null));
    }
}
