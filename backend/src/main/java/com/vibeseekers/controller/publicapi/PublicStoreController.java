package com.vibeseekers.controller.publicapi;

import com.vibeseekers.dto.common.ApiResponse;
import com.vibeseekers.dto.contact.ContactMessageDto;
import com.vibeseekers.dto.product.ProductResponseDto;
import com.vibeseekers.dto.shiprocket.ShiprocketCourierCheckDto;
import com.vibeseekers.entity.ContactMessage;
import com.vibeseekers.entity.ProductCategory;
import com.vibeseekers.repository.ContactMessageRepository;
import com.vibeseekers.service.ProductService;
import com.vibeseekers.service.ShiprocketService;
import com.vibeseekers.service.StoreSettingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicStoreController {

    private final ProductService productService;
    private final StoreSettingService storeSettingService;
    private final ShiprocketService shiprocketService;
    private final ContactMessageRepository contactMessageRepository;

    public PublicStoreController(ProductService productService,
                                 StoreSettingService storeSettingService,
                                 ShiprocketService shiprocketService,
                                 ContactMessageRepository contactMessageRepository) {
        this.productService = productService;
        this.storeSettingService = storeSettingService;
        this.shiprocketService = shiprocketService;
        this.contactMessageRepository = contactMessageRepository;
    }

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<Page<ProductResponseDto>>> getProducts(
            @RequestParam(required = false) ProductCategory category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int pageSize
    ) {
        Page<ProductResponseDto> products = productService.getPublicProducts(
                category, minPrice, maxPrice, size, keyword, sortBy, page, pageSize
        );
        return ResponseEntity.ok(ApiResponse.ok(products));
    }

    @GetMapping("/products/{slug}")
    public ResponseEntity<ApiResponse<ProductResponseDto>> getProductBySlug(@PathVariable String slug) {
        ProductResponseDto product = productService.getProductBySlug(slug);
        return ResponseEntity.ok(ApiResponse.ok(product));
    }

    @GetMapping("/new-arrivals")
    public ResponseEntity<ApiResponse<List<ProductResponseDto>>> getNewArrivals() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getNewArrivals()));
    }

    @GetMapping("/categories/{category}")
    public ResponseEntity<ApiResponse<List<ProductResponseDto>>> getByCategory(@PathVariable ProductCategory category) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getByCategory(category)));
    }

    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPublicSettings() {
        Map<String, Object> settings = new HashMap<>();
        settings.put("brandName", "VIBE SEEKERS");
        settings.put("ownerName", storeSettingService.getSetting("upiPayeeName", "Vivek Ashok Matne"));
        settings.put("upiId", storeSettingService.getSetting("upiId", "9860498749-2@ybl"));
        settings.put("supportPhone", storeSettingService.getSetting("supportPhone", "+919860498749"));
        settings.put("whatsAppLink", "https://wa.me/919860498749");
        settings.put("storeEmail", storeSettingService.getSetting("storeEmail", "vibeseekers09@gmail.com"));
        settings.put("instagramUrl", storeSettingService.getSetting("instagramUrl", "https://www.instagram.com/vibe_seekers_09?cnvx=enZ5NDYwM2doN2ll&utm_source=qr"));
        settings.put("phonePeQrUrl", storeSettingService.getSetting("phonePeQrUrl", "/assets/phonepe-qr.jpg"));
        settings.put("codEnabled", storeSettingService.isCodEnabled());
        settings.put("returnsEnabled", storeSettingService.isReturnsEnabled());
        return ResponseEntity.ok(ApiResponse.ok(settings));
    }

    @GetMapping("/pincode/check")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkPincode(
            @RequestParam String pincode
    ) {
        ShiprocketCourierCheckDto checkDto = new ShiprocketCourierCheckDto(pincode);
        Map<String, Object> result = shiprocketService.checkCourierServiceability(checkDto);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping("/contact")
    public ResponseEntity<ApiResponse<String>> submitContactMessage(@Valid @RequestBody ContactMessageDto dto) {
        ContactMessage message = new ContactMessage(
                dto.getName(),
                dto.getEmail(),
                dto.getPhone(),
                dto.getSubject(),
                dto.getMessage()
        );
        contactMessageRepository.save(message);
        return ResponseEntity.ok(ApiResponse.ok("Thank you for reaching out to Vibe Seekers. Our team will get back to you shortly.", null));
    }
}
