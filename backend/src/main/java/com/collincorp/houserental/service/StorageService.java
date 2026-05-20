package com.collincorp.houserental.service;

import com.collincorp.houserental.api.ApiException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StorageService {

    private static final long MAX_BYTES = 10 * 1024 * 1024; // 10MB limit

    @Value("${app.uploads.dir}")
    private String uploadsDir;

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "empty_file");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "file_too_large");
        }

        try {
            // Ensure uploads directory exists
            Path uploadPath = Paths.get(uploadsDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;

            // Save to disk
            Path targetLocation = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return relative path matching WebConfig's /uploads/** handler
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "upload_failed");
        }
    }
}
