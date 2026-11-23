package com.vibeseekers.controller.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibeseekers.dto.common.ApiResponse;
import com.vibeseekers.dto.order.OrderResponseDto;
import com.vibeseekers.dto.order.PaymentVerificationRequest;
import com.vibeseekers.dto.product.ProductRequestDto;
import com.vibeseekers.dto.product.ProductResponseDto;
import com.vibeseekers.dto.setting.ShippingSettingsDto;
import com.vibeseekers.dto.setting.StoreSettingDto;
import com.vibeseekers.entity.*;
import com.vibeseekers.repository.*;
import com.vibeseekers.security.UserPrincipal;
import com.vibeseekers.service.OrderService;
import com.vibeseekers.service.ProductService;
import com.vibeseekers.service.StoreSettingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN')")
public class AdminController {

    private final ProductService productService;
    private final OrderService orderService;
    private final StoreSettingService storeSettingService;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final com.vibeseekers.service.CouponService couponService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AdminController(ProductService productService,
                           OrderService orderService,
                           StoreSettingService storeSettingService,
                           OrderRepository orderRepository,
                           PaymentRepository paymentRepository,
                           UserRepository userRepository,
                           ProductRepository productRepository,
                           ContactMessageRepository contactMessageRepository,
                           com.vibeseekers.service.CouponService couponService) {
        this.productService = productService;
        this.orderService = orderService;
        this.storeSettingService = storeSettingService;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.contactMessageRepository = contactMessageRepository;
        this.couponService = couponService;
    }

    // ==================== DASHBOARD OVERVIEW ====================

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardOverview() {
        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        long totalOrders = orderRepository.count();
        long pendingPayments = paymentRepository.countByPaymentStatus(PaymentStatus.PENDING_VERIFICATION);
        long activeShipments = orderRepository.countActiveShipments();
        long totalCustomers = userRepository.countByRole(Role.ROLE_CUSTOMER);
        List<Product> lowStock = productRepository.findLowStockProducts(5);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalOrders", totalOrders);
        stats.put("pendingPaymentVerifications", pendingPayments);
        stats.put("activeShipments", activeShipments);
        stats.put("totalCustomers", totalCustomers);
        stats.put("lowStockCount", lowStock.size());

        List<ProductResponseDto> lowStockDtos = new ArrayList<>();
        for (Product p : lowStock) {
            lowStockDtos.add(productService.mapToResponseDto(p));
        }
        stats.put("lowStockProducts", lowStockDtos);

        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    // ==================== PRODUCT & IMAGE MANAGEMENT ====================

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<ProductResponseDto>>> getAllProducts() {
        List<ProductResponseDto> list = productService.getAllProductsAdmin();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping(value = "/products", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ApiResponse<ProductResponseDto>> createProduct(
            @RequestPart("productData") String productDataJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> imageFiles
    ) throws Exception {
        ProductRequestDto request = objectMapper.readValue(productDataJson, ProductRequestDto.class);
        ProductResponseDto product = productService.createProduct(request, imageFiles);
        return ResponseEntity.ok(ApiResponse.ok("Product created successfully", product));
    }

    @PutMapping(value = "/products/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ApiResponse<ProductResponseDto>> updateProduct(
            @PathVariable Long id,
            @RequestPart("productData") String productDataJson,
            @RequestPart(value = "newImages", required = false) List<MultipartFile> newImageFiles
    ) throws Exception {
        ProductRequestDto request = objectMapper.readValue(productDataJson, ProductRequestDto.class);
        ProductResponseDto product = productService.updateProduct(id, request, newImageFiles);
        return ResponseEntity.ok(ApiResponse.ok("Product updated successfully", product));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.ok("Product deleted successfully", null));
    }

    // ==================== ORDER & PAYMENT MANAGEMENT ====================

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<Page<OrderResponseDto>>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<OrderResponseDto> orders = orderService.getAllOrdersAdmin(status, page, size);
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @PostMapping("/orders/{id}/verify-payment")
    public ResponseEntity<ApiResponse<OrderResponseDto>> verifyPayment(
            @PathVariable Long id,
            @Valid @RequestBody PaymentVerificationRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        OrderResponseDto updated = orderService.verifyPaymentByAdmin(id, request, principal.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Payment verification status updated", updated));
    }

    @PostMapping("/orders/{id}/dispatch-shiprocket")
    public ResponseEntity<ApiResponse<OrderResponseDto>> dispatchToShiprocket(@PathVariable Long id) {
        OrderResponseDto order = orderService.dispatchToShiprocket(id);
        return ResponseEntity.ok(ApiResponse.ok("Order successfully dispatched to Shiprocket", order));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponseDto>> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        OrderStatus status = OrderStatus.valueOf(body.get("status"));
        String adminNotes = body.get("adminNotes");
        OrderResponseDto order = orderService.updateOrderStatus(id, status, adminNotes);
        return ResponseEntity.ok(ApiResponse.ok("Order status updated", order));
    }

    // ==================== CUSTOMER MANAGEMENT ====================

    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getCustomers() {
        List<User> customers = userRepository.findByRole(Role.ROLE_CUSTOMER);
        List<Map<String, Object>> result = new ArrayList<>();
        for (User u : customers) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("email", u.getEmail());
            map.put("fullName", u.getFullName());
            map.put("phone", u.getPhone());
            map.put("isVerified", u.isVerified());
            map.put("createdAt", u.getCreatedAt());
            map.put("orderCount", orderRepository.findByUserIdOrderByCreatedAtDesc(u.getId()).size());
            result.add(map);
        }
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    // ==================== STORE SETTINGS ====================

    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<Map<String, String>>> getSettings() {
        return ResponseEntity.ok(ApiResponse.ok(storeSettingService.getAllSettings()));
    }

    @PutMapping("/settings")
    public ResponseEntity<ApiResponse<String>> updateSetting(@Valid @RequestBody StoreSettingDto dto) {
        storeSettingService.setSetting(dto.getSettingKey(), dto.getSettingValue(), dto.getDescription());
        return ResponseEntity.ok(ApiResponse.ok("Setting updated successfully", null));
    }

    @GetMapping("/settings/shipping")
    public ResponseEntity<ApiResponse<ShippingSettingsDto>> getShippingSettings() {
        return ResponseEntity.ok(ApiResponse.ok(storeSettingService.getShippingSettings()));
    }

    @PutMapping("/settings/shipping")
    public ResponseEntity<ApiResponse<ShippingSettingsDto>> updateShippingSettings(@RequestBody ShippingSettingsDto dto) {
        ShippingSettingsDto updated = storeSettingService.updateShippingSettings(dto);
        return ResponseEntity.ok(ApiResponse.ok("Shipping settings updated successfully", updated));
    }

    // ==================== CONTACT INQUIRIES ====================

    @GetMapping("/contact-messages")
    public ResponseEntity<ApiResponse<Page<ContactMessage>>> getContactMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<ContactMessage> messages = contactMessageRepository.findAllByOrderByCreatedAtDesc(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        return ResponseEntity.ok(ApiResponse.ok(messages));
    }

    @PutMapping("/contact-messages/{id}/read")
    public ResponseEntity<ApiResponse<String>> markContactMessageRead(@PathVariable Long id) {
        contactMessageRepository.findById(id).ifPresent(msg -> {
            msg.setRead(true);
            contactMessageRepository.save(msg);
        });
        return ResponseEntity.ok(ApiResponse.ok("Message marked as read", null));
    }

    // ==================== COUPONS MANAGEMENT ====================

    @GetMapping("/coupons")
    public ResponseEntity<ApiResponse<List<com.vibeseekers.entity.Coupon>>> getAllCoupons() {
        return ResponseEntity.ok(ApiResponse.ok(couponService.getAllCoupons()));
    }

    @PostMapping("/coupons")
    public ResponseEntity<ApiResponse<com.vibeseekers.entity.Coupon>> createCoupon(@RequestBody com.vibeseekers.entity.Coupon coupon) {
        return ResponseEntity.ok(ApiResponse.ok("Coupon created successfully", couponService.createCoupon(coupon)));
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.ok("Coupon deleted successfully", null));
    }
}
