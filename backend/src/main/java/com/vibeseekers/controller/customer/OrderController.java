package com.vibeseekers.controller.customer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibeseekers.dto.common.ApiResponse;
import com.vibeseekers.dto.order.CreateOrderRequest;
import com.vibeseekers.dto.order.OrderResponseDto;
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

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public OrderController(OrderService orderService, UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
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

    @PostMapping(consumes = { MediaType.APPLICATION_JSON_VALUE })
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
}
