package com.collincorp.houserental.service;

import com.collincorp.houserental.api.ApiException;
import com.collincorp.houserental.domain.PropertyAvailability;
import com.collincorp.houserental.domain.UserRole;
import com.collincorp.houserental.dto.PropertyCreateRequest;
import com.collincorp.houserental.dto.PropertyImageResponse;
import com.collincorp.houserental.dto.PropertyResponse;
import com.collincorp.houserental.dto.PropertyUpdateRequest;
import com.collincorp.houserental.entity.PropertyEntity;
import com.collincorp.houserental.entity.PropertyImageEntity;
import com.collincorp.houserental.entity.UserEntity;
import com.collincorp.houserental.repository.PropertyImageRepository;
import com.collincorp.houserental.repository.PropertyRepository;
import com.collincorp.houserental.support.SecurityUtils;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final StorageService storageService;
    private final BookingService bookingService;

    public PropertyService(PropertyRepository propertyRepository, PropertyImageRepository propertyImageRepository, StorageService storageService, BookingService bookingService) {
        this.propertyRepository = propertyRepository;
        this.propertyImageRepository = propertyImageRepository;
        this.storageService = storageService;
        this.bookingService = bookingService;
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> listMine() {
        UserEntity u = SecurityUtils.currentUser();
        return propertyRepository.findAllByLandlordIdOrderByIdDesc(u.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<PropertyResponse> search(
            String location,
            BigDecimal maxPrice,
            Integer minRooms,
            PropertyAvailability availability,
            Pageable pageable) {

        Specification<PropertyEntity> spec = buildSpec(location, maxPrice, minRooms, availability);
        return propertyRepository.findAll(spec, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public PropertyResponse get(long id) {
        PropertyEntity p = propertyRepository
                .findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "property_not_found"));
        return toResponse(p);
    }

    @Transactional
    public PropertyResponse create(PropertyCreateRequest req) {
        UserEntity user = SecurityUtils.currentUser();
        if (user.getRole() != UserRole.landlord && user.getRole() != UserRole.admin) {
            throw new ApiException(HttpStatus.FORBIDDEN, "landlord_role_required");
        }
        PropertyEntity p = new PropertyEntity();
        p.setLandlord(user);
        p.setTitle(req.title());
        p.setDescription(req.description());
        p.setLocation(req.location());
        p.setPricePerMonth(req.pricePerMonth());
        p.setRooms(req.rooms());
        p.setAvailability(req.availability() != null ? req.availability() : PropertyAvailability.available);
        p.setPhone(req.phone());

        p.setContactEmail(req.contactEmail());

        return toResponse(propertyRepository.save(p));
    }

    @Transactional
    public PropertyResponse update(long id, PropertyUpdateRequest req) {
        PropertyEntity p = propertyRepository
                .findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "property_not_found"));
        assertOwnerOrAdmin(p);
        if (req.title() != null) {
            p.setTitle(req.title());
        }
        if (req.description() != null) {
            p.setDescription(req.description());
        }
        if (req.location() != null) {
            p.setLocation(req.location());
        }
        if (req.pricePerMonth() != null) {
            p.setPricePerMonth(req.pricePerMonth());
        }
        if (req.rooms() != null) {
            p.setRooms(req.rooms());
        }
        if (req.availability() != null) {
            p.setAvailability(req.availability());
        }
        if (req.phone() != null) {
            p.setPhone(req.phone());
        }
        if (req.contactEmail() != null) {
            p.setContactEmail(req.contactEmail());
        }
        return toResponse(p);
    }

    @Transactional
    public void delete(long id) {
        PropertyEntity p = propertyRepository
                .findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "property_not_found"));
        assertOwnerOrAdmin(p);
        propertyRepository.delete(p);
    }

    @Transactional
    public List<PropertyImageResponse> addImages(long propertyId, List<MultipartFile> files) {
        PropertyEntity p = propertyRepository
                .findById(propertyId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "property_not_found"));
        assertOwnerOrAdmin(p);

        List<PropertyImageEntity> newImages = new ArrayList<>();
        for (MultipartFile file : files) {
            String path = storageService.store(file);
            PropertyImageEntity img = new PropertyImageEntity();
            img.setFilePath(path);
            p.addImage(img);
            newImages.add(propertyImageRepository.saveAndFlush(img));
        }
        return newImages.stream()
                .map(img -> new PropertyImageResponse(img.getId(), img.getFilePath()))
                .toList();
    }

    @Transactional
    public PropertyImageResponse addImage(long propertyId, MultipartFile file) {
        PropertyEntity p = propertyRepository
                .findById(propertyId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "property_not_found"));
        assertOwnerOrAdmin(p);
        String path = storageService.store(file);
        PropertyImageEntity img = new PropertyImageEntity();
        img.setFilePath(path);
        p.addImage(img);
        PropertyImageEntity saved = propertyImageRepository.saveAndFlush(img);
        return new PropertyImageResponse(saved.getId(), saved.getFilePath());
    }

    private void assertOwnerOrAdmin(PropertyEntity p) {
        UserEntity u = SecurityUtils.currentUser();
        if (u.getRole() == UserRole.admin) {
            return;
        }
        if (u.getRole() != UserRole.landlord || !p.getLandlord().getId().equals(u.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "not_property_owner");
        }
    }

    private PropertyResponse toResponse(PropertyEntity p) {
        List<PropertyImageResponse> imgs = p.getImages().stream()
                .map(i -> new PropertyImageResponse(i.getId(), i.getFilePath()))
                .toList();
        long bookingCount = bookingService.countByProperty(p.getId());
        return new PropertyResponse(
                p.getId(),
                p.getLandlord().getId(),
                p.getLandlord().getEmail(),
                p.getTitle(),
                p.getDescription(),
                p.getLocation(),
                p.getPricePerMonth(),
                p.getRooms(),
                p.getAvailability().name(),
                p.getCreatedAt(),
                imgs,
                p.getPhone(),
                p.getContactEmail(),
                bookingCount);
    }

    private static Specification<PropertyEntity> buildSpec(
            String location, BigDecimal maxPrice, Integer minRooms, PropertyAvailability availability) {
        return (root, query, cb) -> {
            List<Predicate> parts = new ArrayList<>();
            if (StringUtils.hasText(location)) {
                parts.add(cb.like(cb.lower(root.get("location")), "%" + location.trim().toLowerCase() + "%"));
            }
            if (maxPrice != null) {
                parts.add(cb.lessThanOrEqualTo(root.get("pricePerMonth"), maxPrice));
            }
            if (minRooms != null) {
                parts.add(cb.greaterThanOrEqualTo(root.get("rooms"), minRooms));
            }
            if (availability != null) {
                parts.add(cb.equal(root.get("availability"), availability));
            }
            if (parts.isEmpty()) {
                return cb.conjunction();
            }
            return cb.and(parts.toArray(Predicate[]::new));
        };
    }
}
