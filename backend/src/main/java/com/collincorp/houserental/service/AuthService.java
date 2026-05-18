package com.collincorp.houserental.service;

import com.collincorp.houserental.api.ApiException;
import com.collincorp.houserental.domain.UserRole;
import com.collincorp.houserental.dto.LoginRequest;
import com.collincorp.houserental.dto.ProfileUpdateRequest;
import com.collincorp.houserental.dto.RegisterRequest;
import com.collincorp.houserental.dto.TokenResponse;
import com.collincorp.houserental.dto.UserResponse;
import com.collincorp.houserental.entity.UserEntity;
import com.collincorp.houserental.repository.UserRepository;
import com.collincorp.houserental.security.JwtService;
import com.collincorp.houserental.support.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public UserResponse register(RegisterRequest req) {
        if (userRepository.existsByEmailIgnoreCase(req.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "email_taken");
        }
        UserRole role = req.role() != null ? req.role() : UserRole.tenant;
        if (role == UserRole.admin) {
            role = UserRole.tenant;
        }
        UserEntity u = new UserEntity();
        u.setEmail(req.email().trim().toLowerCase());
        u.setPasswordHash(passwordEncoder.encode(req.password()));
        u.setFullName(req.fullName());
        u.setRole(role);
        userRepository.save(u);
        return toUser(u);
    }

    @Transactional(readOnly = true)
    public TokenResponse login(LoginRequest req) {
        UserEntity u = userRepository
                .findByEmailIgnoreCase(req.email().trim().toLowerCase())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "invalid_credentials"));
        if (!u.isActive() || !passwordEncoder.matches(req.password(), u.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "invalid_credentials");
        }
        String token = jwtService.generateToken(u.getId(), u.getEmail(), u.getRole().name());
        return TokenResponse.of(token, toUser(u));
    }

    @Transactional(readOnly = true)
    public UserResponse me() {
        return toUser(SecurityUtils.currentUser());
    }

    @Transactional
    public UserResponse updateProfile(ProfileUpdateRequest req) {
        UserEntity u = userRepository.findById(SecurityUtils.currentUser().getId()).orElseThrow();
        if (req.fullName() != null && !req.fullName().isBlank()) {
            u.setFullName(req.fullName());
        }
        if (req.password() != null && !req.password().isBlank()) {
            u.setPasswordHash(passwordEncoder.encode(req.password()));
        }
        return toUser(userRepository.save(u));
    }

    private static UserResponse toUser(UserEntity u) {
        return new UserResponse(u.getId(), u.getEmail(), u.getFullName(), u.getRole().name());
    }
}
