package com.collincorp.houserental.api.v1;

import com.collincorp.houserental.dto.AdminStatsResponse;
import com.collincorp.houserental.dto.AdminUserPatchRequest;
import com.collincorp.houserental.dto.UserResponse;
import com.collincorp.houserental.service.AdminService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public List<UserResponse> users() {
        return adminService.users();
    }

    @PatchMapping("/users/{id}")
    public UserResponse patchUser(@PathVariable long id, @Valid @RequestBody AdminUserPatchRequest request) {
        return adminService.patchUser(id, request);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable long id) {
        adminService.deleteUser(id);
    }

    @GetMapping("/stats")
    public AdminStatsResponse stats() {
        return adminService.stats();
    }
}
