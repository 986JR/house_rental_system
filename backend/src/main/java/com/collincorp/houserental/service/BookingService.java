package com.collincorp.houserental.service;

import com.collincorp.houserental.api.ApiException;
import com.collincorp.houserental.domain.BookingStatus;
import com.collincorp.houserental.domain.UserRole;
import com.collincorp.houserental.dto.BookingCreateRequest;
import com.collincorp.houserental.dto.BookingResponse;
import com.collincorp.houserental.dto.BookingUpdateRequest;
import com.collincorp.houserental.entity.BookingEntity;
import com.collincorp.houserental.entity.PropertyEntity;
import com.collincorp.houserental.entity.UserEntity;
import com.collincorp.houserental.repository.BookingRepository;
import com.collincorp.houserental.repository.PropertyRepository;
import com.collincorp.houserental.support.SecurityUtils;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;

    public BookingService(BookingRepository bookingRepository, PropertyRepository propertyRepository) {
        this.bookingRepository = bookingRepository;
        this.propertyRepository = propertyRepository;
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> listMine() {
        UserEntity u = SecurityUtils.currentUser();
        return bookingRepository.findAllForUser(u.getId()).stream().map(this::toResponse).toList();
    }

    @Transactional
    public BookingResponse create(BookingCreateRequest req) {
        UserEntity tenant = SecurityUtils.currentUser();
        if (tenant.getRole() != UserRole.tenant && tenant.getRole() != UserRole.admin) {
            throw new ApiException(HttpStatus.FORBIDDEN, "tenant_role_required");
        }
        PropertyEntity property = propertyRepository
                .findById(req.propertyId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "property_not_found"));
        if (!req.startDate().isBefore(req.endDate())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "invalid_date_range");
        }
        BookingEntity b = new BookingEntity();
        b.setProperty(property);
        b.setTenant(tenant);
        b.setStartDate(req.startDate());
        b.setEndDate(req.endDate());
        b.setMessage(req.message());
        b.setStatus(BookingStatus.pending);
        return toResponse(bookingRepository.save(b));
    }

    @Transactional
    public BookingResponse update(long id, BookingUpdateRequest req) {
        BookingEntity b = bookingRepository
                .findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "booking_not_found"));
        UserEntity u = SecurityUtils.currentUser();
        PropertyEntity p = b.getProperty();
        boolean landlord = u.getRole() == UserRole.landlord && p.getLandlord().getId().equals(u.getId());
        boolean admin = u.getRole() == UserRole.admin;
        if (!landlord && !admin) {
            throw new ApiException(HttpStatus.FORBIDDEN, "landlord_only");
        }
        b.setStatus(req.status());
        return toResponse(bookingRepository.save(b));
    }

    private BookingResponse toResponse(BookingEntity b) {
        return new BookingResponse(
                b.getId(),
                b.getProperty().getId(),
                b.getProperty().getTitle(),
                b.getTenant().getId(),
                b.getTenant().getEmail(),
                b.getStatus().name(),
                b.getStartDate(),
                b.getEndDate(),
                b.getMessage(),
                b.getCreatedAt());
    }
}
