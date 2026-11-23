package com.vibeseekers.controller.publicapi;

import com.vibeseekers.dto.common.ApiResponse;
import com.vibeseekers.service.MediaStorageService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
public class FileUploadController {

    private final MediaStorageService mediaStorageService;

    public FileUploadController(MediaStorageService mediaStorageService) {
        this.mediaStorageService = mediaStorageService;
    }

    @PostMapping(value = {"/api/upload", "/api/public/upload"}, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "customizations") String folder
    ) {
        MediaStorageService.UploadResult result = mediaStorageService.storeFile(file, folder);
        Map<String, String> response = new HashMap<>();
        response.put("url", result.getUrl());
        response.put("secure_url", result.getUrl());
        response.put("publicId", result.getPublicId());
        return ResponseEntity.ok(ApiResponse.ok("File uploaded successfully", response));
    }
}
