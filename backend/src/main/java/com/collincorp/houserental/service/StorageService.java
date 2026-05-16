package com.collincorp.houserental.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.collincorp.houserental.api.ApiException;
import java.io.IOException;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StorageService {

    private static final long MAX_BYTES = 10 * 1024 * 1024; // Increased to 10MB

    private final Cloudinary cloudinary;

    public StorageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "empty_file");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "file_too_large");
        }

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), 
                ObjectUtils.asMap("resource_type", "auto"));
            
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "upload_failed");
        }
    }
}
