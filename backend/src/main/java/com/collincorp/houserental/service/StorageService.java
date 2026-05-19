package com.collincorp.houserental.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.collincorp.houserental.api.ApiException;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StorageService {

    private static final long MAX_BYTES = 10 * 1024 * 1024; // Increased to 10MB

    private final Cloudinary cloudinary;
    private final String cloudinaryUrl;
    private final String cloudName;
    private final String apiKey;
    private final String apiSecret;
    private final String folder;

    public StorageService(
            Cloudinary cloudinary,
            @Value("${app.cloudinary.url:}") String cloudinaryUrl,
            @Value("${app.cloudinary.cloud-name:}") String cloudName,
            @Value("${app.cloudinary.api-key:}") String apiKey,
            @Value("${app.cloudinary.api-secret:}") String apiSecret,
            @Value("${app.cloudinary.folder:house-rental/properties}") String folder) {
        this.cloudinary = cloudinary;
        this.cloudinaryUrl = cloudinaryUrl;
        this.cloudName = cloudName;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.folder = folder;
    }

    public String store(MultipartFile file) {
        ensureCloudinaryConfigured();
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "empty_file");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "file_too_large");
        }

        try {
            var options = StringUtils.hasText(folder)
                    ? ObjectUtils.asMap("resource_type", "image", "folder", folder)
                    : ObjectUtils.asMap("resource_type", "image");

            var uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
            
            return (String) uploadResult.get("secure_url");
        } catch (IOException | RuntimeException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "upload_failed");
        }
    }

    private void ensureCloudinaryConfigured() {
        boolean hasCloudinaryUrl = StringUtils.hasText(cloudinaryUrl);
        boolean hasSeparateCredentials = StringUtils.hasText(cloudName)
                && StringUtils.hasText(apiKey)
                && StringUtils.hasText(apiSecret);

        if (!hasCloudinaryUrl && !hasSeparateCredentials) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "cloudinary_not_configured");
        }
    }
}
