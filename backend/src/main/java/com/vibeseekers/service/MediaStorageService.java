package com.vibeseekers.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.vibeseekers.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
public class MediaStorageService {

    private static final Logger log = LoggerFactory.getLogger(MediaStorageService.class);

    private final Cloudinary cloudinary;

    @Value("${app.cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${app.cloudinary.api-key:}")
    private String apiKey;

    @Value("${app.cloudinary.api-secret:}")
    private String apiSecret;

    @Value("${app.media.upload-dir:./uploads}")
    private String localUploadDir;

    private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
    );

    public MediaStorageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public static class UploadResult {
        private String url;
        private String publicId;

        public UploadResult(String url, String publicId) {
            this.url = url;
            this.publicId = publicId;
        }

        public String getUrl() {
            return url;
        }

        public String getPublicId() {
            return publicId;
        }
    }

    public UploadResult storeFile(MultipartFile file, String folder) {
        validateFile(file);

        // Check if Cloudinary is configured via environment or bean
        if (isCloudinaryConfigured()) {
            Cloudinary target = getEffectiveCloudinary();
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> uploadResult = target.uploader().upload(
                        file.getBytes(),
                        ObjectUtils.asMap(
                                "folder", "vibe-seekers/" + folder,
                                "resource_type", "image"
                        )
                );
                String secureUrl = (String) uploadResult.get("secure_url");
                String publicId = (String) uploadResult.get("public_id");
                log.info("Uploaded image to Cloudinary: {}", secureUrl);
                return new UploadResult(secureUrl, publicId);
            } catch (Exception e) {
                log.error("Cloudinary upload failed: {}", e.getMessage(), e);
                throw new BadRequestException("Failed to upload image to Cloudinary: " + e.getMessage());
            }
        }

        // Local storage fallback for dev / tests only when Cloudinary env vars are blank
        log.info("Cloudinary env vars are blank; falling back to local file storage for folder: {}", folder);
        return storeLocally(file, folder);
    }

    private boolean isCloudinaryConfigured() {
        if (cloudinary != null && cloudinary.config != null
                && isNonEmpty(cloudinary.config.apiKey)
                && isNonEmpty(cloudinary.config.apiSecret)
                && isNonEmpty(cloudinary.config.cloudName)) {
            return true;
        }
        return isNonEmpty(cloudName) && isNonEmpty(apiKey) && isNonEmpty(apiSecret);
    }

    private boolean isNonEmpty(String s) {
        return s != null && !s.trim().isEmpty();
    }

    private Cloudinary getEffectiveCloudinary() {
        if (cloudinary != null && cloudinary.config != null
                && isNonEmpty(cloudinary.config.apiKey)
                && isNonEmpty(cloudinary.config.apiSecret)
                && isNonEmpty(cloudinary.config.cloudName)) {
            return cloudinary;
        }
        if (isNonEmpty(cloudName) && isNonEmpty(apiKey) && isNonEmpty(apiSecret)) {
            Map<String, String> config = new HashMap<>();
            config.put("cloud_name", cloudName.trim());
            config.put("api_key", apiKey.trim());
            config.put("api_secret", apiSecret.trim());
            return new Cloudinary(config);
        }
        return null;
    }

    private UploadResult storeLocally(MultipartFile file, String folder) {
        try {
            Path targetDir = Paths.get(localUploadDir, folder).toAbsolutePath().normalize();
            Files.createDirectories(targetDir);

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String filename = UUID.randomUUID().toString() + extension;
            Path targetPath = targetDir.resolve(filename);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String localUrl = "/uploads/" + folder + "/" + filename;
            return new UploadResult(localUrl, filename);
        } catch (IOException e) {
            throw new BadRequestException("Failed to store file locally: " + e.getMessage());
        }
    }

    public void deleteFile(String publicId) {
        if (publicId == null || publicId.isEmpty()) return;

        if (isCloudinaryConfigured()) {
            Cloudinary target = getEffectiveCloudinary();
            if (target != null) {
                try {
                    target.uploader().destroy(publicId, ObjectUtils.emptyMap());
                    log.info("Deleted image from Cloudinary: {}", publicId);
                } catch (Exception e) {
                    log.warn("Failed to delete image from Cloudinary: {}", e.getMessage());
                }
            }
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new BadRequestException("File exceeds maximum allowed size of 5MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Invalid file type: " + contentType + ". Only JPG, PNG, and WEBP images are allowed.");
        }
    }
}
