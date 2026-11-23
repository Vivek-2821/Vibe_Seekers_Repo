package com.vibeseekers.controller.publicapi;

import com.vibeseekers.dto.common.ApiResponse;
import com.vibeseekers.dto.setting.ShippingSettingsDto;
import com.vibeseekers.service.StoreSettingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settings")
public class StoreSettingsController {

    private final StoreSettingService storeSettingService;

    public StoreSettingsController(StoreSettingService storeSettingService) {
        this.storeSettingService = storeSettingService;
    }

    @GetMapping("/shipping")
    public ResponseEntity<ApiResponse<ShippingSettingsDto>> getShippingSettings() {
        return ResponseEntity.ok(ApiResponse.ok(storeSettingService.getShippingSettings()));
    }
}
