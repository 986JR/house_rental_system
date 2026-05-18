package com.collincorp.houserental.service;

import com.collincorp.houserental.api.ApiException;
import com.collincorp.houserental.domain.BookingStatus;
import com.collincorp.houserental.domain.LogAction;
import com.collincorp.houserental.domain.PropertyAvailability;
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
    private final LogService logService;

    public BookingService(BookingRepository bookingRepository, PropertyRepository propertyRepository, LogService logService) {
        this.bookingRepository = bookingRepository;
        this.propertyRepository = propertyRepository;
        this.logService = logService;
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> listMine() {
        UserEntity u = SecurityUtils.currentUser();
        return bookingRepository.findAllForUser(u.getId()).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> listMyBookings() {
        UserEntity u = SecurityUtils.currentUser();
        return bookingRepository.findAllForTenant(u.getId()).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> listLandlordBookings() {
        UserEntity u = SecurityUtils.currentUser();
        return bookingRepository.findAllForLandlord(u.getId()).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> listAll() {
        return bookingRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public long countByProperty(Long propertyId) {
        return bookingRepository.countByPropertyId(propertyId);
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
        BookingEntity saved = bookingRepository.save(b);
        logService.log(LogAction.BOOKING_CREATED, "booking", saved.getId(), 
                "Property: " + property.getTitle() + ", Tenant: " + tenant.getEmail());
        return toResponse(saved);
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
        
        BookingStatus oldStatus = b.getStatus();
        b.setStatus(req.status());
        
        // Auto-update property availability based on booking status
        if (req.status() == BookingStatus.approved && oldStatus != BookingStatus.approved) {
            p.setAvailability(PropertyAvailability.rented);
            propertyRepository.save(p);
            logService.log(LogAction.BOOKING_APPROVED, "booking", b.getId(), 
                    "Property: " + p.getTitle() + " marked as rented");
            logService.log(LogAction.PROPERTY_STATUS_CHANGED, "property", p.getId(), 
                    "Status changed to: rented");
        } else if (req.status() == BookingStatus.rejected && oldStatus != BookingStatus.rejected) {
            logService.log(LogAction.BOOKING_REJECTED, "booking", b.getId(), 
                    "Property: " + p.getTitle());
        } else if (req.status() == BookingStatus.cancelled && oldStatus != BookingStatus.cancelled) {
            p.setAvailability(PropertyAvailability.available);
            propertyRepository.save(p);
            logService.log(LogAction.BOOKING_CANCELLED, "booking", b.getId(), 
                    "Property: " + p.getTitle() + " marked as available again");
            logService.log(LogAction.PROPERTY_STATUS_CHANGED, "property", p.getId(), 
                    "Status changed to: available");
        }
        
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
