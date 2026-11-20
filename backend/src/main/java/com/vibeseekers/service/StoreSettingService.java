package com.vibeseekers.service;

import com.vibeseekers.entity.StoreSetting;
import com.vibeseekers.repository.StoreSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StoreSettingService {

    private final StoreSettingRepository repository;

    public StoreSettingService(StoreSettingRepository repository) {
        this.repository = repository;
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
