package com.collincorp.houserental.config;

import com.collincorp.houserental.domain.UserRole;
import com.collincorp.houserental.entity.UserEntity;
import com.collincorp.houserental.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DefaultAdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DefaultAdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@gmail.com";
        if (!userRepository.existsByEmailIgnoreCase(adminEmail)) {
            UserEntity admin = new UserEntity();
            admin.setEmail(adminEmail);
            admin.setPasswordHash(passwordEncoder.encode("admin"));
            admin.setFullName("Default Admin");
            admin.setRole(UserRole.admin);
            admin.setActive(true);
            userRepository.save(admin);
            System.out.println("Default admin user created: " + adminEmail + " / admin");
        }
    }
}
