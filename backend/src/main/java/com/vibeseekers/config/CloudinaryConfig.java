package com.vibeseekers.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${app.cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${app.cloudinary.api-key:}")
    private String apiKey;

    @Value("${app.cloudinary.api-secret:}")
    private String apiSecret;

    @Value("${CLOUDINARY_URL:}")
    private String cloudinaryUrl;

    @Bean
    public Cloudinary cloudinary() {
        if (cloudinaryUrl != null && !cloudinaryUrl.trim().isEmpty()) {
            return new Cloudinary(cloudinaryUrl);
        }

        if (cloudName != null && !cloudName.trim().isEmpty() &&
            apiKey != null && !apiKey.trim().isEmpty() &&
            apiSecret != null && !apiSecret.trim().isEmpty()) {
            Map<String, String> config = new HashMap<>();
            config.put("cloud_name", cloudName);
            config.put("api_key", apiKey);
            config.put("api_secret", apiSecret);
            return new Cloudinary(config);
        }

        // Return empty cloudinary instance when credentials are not configured
        return new Cloudinary(ObjectUtils.emptyMap());
    }
}
