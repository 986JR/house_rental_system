package com.collincorp.houserental.api.v1;

import com.collincorp.houserental.domain.LogAction;
import com.collincorp.houserental.dto.LoginRequest;
import com.collincorp.houserental.dto.ProfileUpdateRequest;
import com.collincorp.houserental.dto.RegisterRequest;
import com.collincorp.houserental.dto.TokenResponse;
import com.collincorp.houserental.dto.UserResponse;
import com.collincorp.houserental.service.AuthService;
import com.collincorp.houserental.service.LogService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final LogService logService;

    public AuthController(AuthService authService, LogService logService) {
        this.authService = authService;
        this.logService = logService;
    }

    @PostMapping("/register")
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public TokenResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        logService.log(LogAction.LOGOUT, "user", null, "User logged out");
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public UserResponse me() {
        return authService.me();
    }

    @org.springframework.web.bind.annotation.PutMapping("/profile")
    public UserResponse updateProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        return authService.updateProfile(request);
    }
}
