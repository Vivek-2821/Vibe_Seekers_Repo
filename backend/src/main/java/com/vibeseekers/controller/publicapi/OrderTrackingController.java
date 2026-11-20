package com.vibeseekers.controller.publicapi;

import com.vibeseekers.dto.common.ApiResponse;
import com.vibeseekers.dto.order.OrderResponseDto;
import com.vibeseekers.dto.shiprocket.ShiprocketTrackingDto;
import com.vibeseekers.service.OrderService;
import com.vibeseekers.service.ShiprocketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/tracking")
public class OrderTrackingController {

    private final OrderService orderService;
    private final ShiprocketService shiprocketService;

    public OrderTrackingController(OrderService orderService, ShiprocketService shiprocketService) {
        this.orderService = orderService;
        this.shiprocketService = shiprocketService;
    }

    @GetMapping("/{query}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> trackOrder(@PathVariable String query) {
        OrderResponseDto orderDto;
        try {
            if (query.toUpperCase().startsWith("VS-")) {
                orderDto = orderService.getOrderByOrderNumber(query.toUpperCase());
            } else {
                orderDto = orderService.getOrderByAwb(query);
            }
        } catch (Exception e) {
            // Try searching by order number as fallback
            orderDto = orderService.getOrderByOrderNumber(query);
        }

        ShiprocketTrackingDto liveTracking = null;
        if (orderDto.getShiprocketAwb() != null && !orderDto.getShiprocketAwb().isEmpty()) {
            liveTracking = shiprocketService.getLiveTracking(orderDto.getShiprocketAwb());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("order", orderDto);
        response.put("liveTracking", liveTracking);
        response.put("returnsAllowed", false); // Enforces strictly no returns
        response.put("policyNotice", "Return option is currently not available for this store.");

        return ResponseEntity.ok(ApiResponse.ok("Tracking details fetched successfully", response));
    }
}
