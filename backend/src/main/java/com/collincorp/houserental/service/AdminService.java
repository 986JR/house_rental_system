package com.collincorp.houserental.service;

import com.collincorp.houserental.api.ApiException;
import com.collincorp.houserental.domain.UserRole;
import com.collincorp.houserental.dto.AdminStatsResponse;
import com.collincorp.houserental.dto.AdminUserPatchRequest;
import com.collincorp.houserental.dto.UserResponse;
import com.collincorp.houserental.entity.UserEntity;
import com.collincorp.houserental.repository.BookingRepository;
import com.collincorp.houserental.repository.MessageRepository;
import com.collincorp.houserental.repository.PropertyRepository;
import com.collincorp.houserental.repository.UserRepository;
import com.collincorp.houserental.support.SecurityUtils;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final BookingRepository bookingRepository;
    private final MessageRepository messageRepository;

    public AdminService(
            UserRepository userRepository,
            PropertyRepository propertyRepository,
            BookingRepository bookingRepository,
            MessageRepository messageRepository) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.bookingRepository = bookingRepository;
        this.messageRepository = messageRepository;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> users() {
        assertAdmin();
        return userRepository.findAll().stream().map(this::toUser).toList();
    }

    @Transactional
    public UserResponse patchUser(long id, AdminUserPatchRequest req) {
        assertAdmin();
        UserEntity u = userRepository.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "user_not_found"));
        if (req.active() != null) {
            u.setActive(req.active());
        }
        if (req.role() != null) {
            u.setRole(req.role());
        }
        return toUser(userRepository.save(u));
    }

    @Transactional
    public void deleteUser(long id) {
        assertAdmin();
        UserEntity self = SecurityUtils.currentUser();
        if (self.getId().equals(id)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "cannot_delete_self");
        }
        userRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public AdminStatsResponse stats() {
        assertAdmin();
        return new AdminStatsResponse(
                userRepository.count(),
                propertyRepository.count(),
                bookingRepository.count(),
                messageRepository.count());
    }

    private void assertAdmin() {
        if (SecurityUtils.currentUser().getRole() != UserRole.admin) {
            throw new ApiException(HttpStatus.FORBIDDEN, "admin_only");
        }
    }

    private UserResponse toUser(UserEntity u) {
        return new UserResponse(u.getId(), u.getEmail(), u.getFullName(), u.getRole().name());
    }
}
