package com.vibeseekers.service;

import com.vibeseekers.dto.setting.ShippingSettingsDto;
import com.vibeseekers.entity.StoreSetting;
import com.vibeseekers.entity.StoreSettings;
import com.vibeseekers.repository.StoreSettingRepository;
import com.vibeseekers.repository.StoreSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StoreSettingService {

    private final StoreSettingRepository repository;
    private final StoreSettingsRepository storeSettingsRepository;

    public StoreSettingService(StoreSettingRepository repository,
                               StoreSettingsRepository storeSettingsRepository) {
        this.repository = repository;
        this.storeSettingsRepository = storeSettingsRepository;
    }

    public ShippingSettingsDto getShippingSettings() {
        StoreSettings settings = storeSettingsRepository.findById(1L).orElseGet(() -> {
            StoreSettings s = new StoreSettings();
            s.setId(1L);
            s.setShippingEnabled(false);
            s.setShippingAmount(new BigDecimal("79.00"));
            return storeSettingsRepository.save(s);
        });
        return new ShippingSettingsDto(settings.isShippingEnabled(), settings.getShippingAmount());
    }

    @Transactional
    public ShippingSettingsDto updateShippingSettings(ShippingSettingsDto dto) {
        StoreSettings settings = storeSettingsRepository.findById(1L).orElseGet(() -> {
            StoreSettings s = new StoreSettings();
            s.setId(1L);
            return s;
        });
        settings.setShippingEnabled(dto.isShippingEnabled());
        if (dto.getShippingAmount() != null) {
            settings.setShippingAmount(dto.getShippingAmount());
        }
        StoreSettings saved = storeSettingsRepository.save(settings);
        return new ShippingSettingsDto(saved.isShippingEnabled(), saved.getShippingAmount());
    }

    public String getSetting(String key, String defaultValue) {
        return repository.findBySettingKey(key)
                .map(StoreSetting::getSettingValue)
                .orElse(defaultValue);
    }

    public boolean isBooleanSettingEnabled(String key, boolean defaultValue) {
        String val = getSetting(key, String.valueOf(defaultValue));
        return "true".equalsIgnoreCase(val);
    }

    @Transactional
    public StoreSetting setSetting(String key, String value, String description) {
        StoreSetting setting = repository.findBySettingKey(key)
                .orElseGet(() -> new StoreSetting(key, value, description));
        setting.setSettingValue(value);
        if (description != null) {
            setting.setDescription(description);
        }
        return repository.save(setting);
    }

    public Map<String, String> getAllSettings() {
        List<StoreSetting> settings = repository.findAll();
        Map<String, String> map = new HashMap<>();
        for (StoreSetting s : settings) {
            map.put(s.getSettingKey(), s.getSettingValue());
        }
        return map;
    }

    public boolean isCodEnabled() {
        return isBooleanSettingEnabled("codEnabled", false);
    }

    public boolean isReturnsEnabled() {
        return isBooleanSettingEnabled("returnsEnabled", false);
    }
}
