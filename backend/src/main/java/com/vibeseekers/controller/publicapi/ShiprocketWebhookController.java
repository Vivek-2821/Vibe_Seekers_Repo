package com.vibeseekers.controller.publicapi;

import com.vibeseekers.dto.common.ApiResponse;
import com.vibeseekers.service.ShiprocketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks")
public class ShiprocketWebhookController {

    private final ShiprocketService shiprocketService;

    public ShiprocketWebhookController(ShiprocketService shiprocketService) {
        this.shiprocketService = shiprocketService;
    }

    @PostMapping("/shiprocket")
    public ResponseEntity<ApiResponse<String>> handleShiprocketWebhook(
            @RequestHeader(value = "X-Shiprocket-Secret", required = false) String secretHeader,
            @RequestBody String payload
    ) {
        shiprocketService.processWebhook(secretHeader, payload);
        return ResponseEntity.ok(ApiResponse.ok("Webhook processed successfully", null));
    }
}
