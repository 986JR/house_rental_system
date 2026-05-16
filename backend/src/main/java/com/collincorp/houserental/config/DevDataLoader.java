package com.collincorp.houserental.config;

import com.collincorp.houserental.domain.PropertyAvailability;
import com.collincorp.houserental.domain.UserRole;
import com.collincorp.houserental.entity.PropertyEntity;
import com.collincorp.houserental.entity.PropertyImageEntity;
import com.collincorp.houserental.entity.UserEntity;
import com.collincorp.houserental.repository.PropertyRepository;
import com.collincorp.houserental.repository.UserRepository;
import java.math.BigDecimal;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("dev")
@Order(Integer.MAX_VALUE)
public class DevDataLoader implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final PasswordEncoder passwordEncoder;

    public DevDataLoader(UserRepository userRepository, PropertyRepository propertyRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (userRepository.count() > 0) {
            return;
        }
        UserEntity admin = user("admin@houserental.com", "Admin@123", "Admin User", UserRole.admin);
        UserEntity landlord = user("landlord@houserental.com", "Landlord@123", "Landlord One", UserRole.landlord);
        UserEntity landlord2 = user("landlord2@houserental.com", "Landlord@123", "Landlord Two", UserRole.landlord);
        UserEntity tenant = user("tenant@houserental.com", "Tenant@123", "Tenant One", UserRole.tenant);
        UserEntity tenant2 = user("tenant2@houserental.com", "Tenant@123", "Tenant Two", UserRole.tenant);
        userRepository.save(admin);
        userRepository.save(landlord);
        userRepository.save(landlord2);
        userRepository.save(tenant);
        userRepository.save(tenant2);

        PropertyEntity p1 = property(landlord, "Sunny 2BR near campus", "Bright apartment with balcony.", "Springfield, IL", new BigDecimal("1200.00"), 2);
        addImage(p1, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200");
        propertyRepository.save(p1);

        PropertyEntity p2 = property(landlord2, "Downtown loft", "Walk to transit and nightlife.", "Chicago, IL", new BigDecimal("2100.00"), 3);
        addImage(p2, "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200");
        propertyRepository.save(p2);
    }

    private UserEntity user(String email, String password, String fullName, UserRole role) {
        UserEntity u = new UserEntity();
        u.setEmail(email);
        u.setPasswordHash(passwordEncoder.encode(password));
        u.setFullName(fullName);
        u.setRole(role);
        return u;
    }

    private static PropertyEntity property(
            UserEntity landlord, String title, String description, String location, BigDecimal price, int rooms) {
        PropertyEntity p = new PropertyEntity();
        p.setLandlord(landlord);
        p.setTitle(title);
        p.setDescription(description);
        p.setLocation(location);
        p.setPricePerMonth(price);
        p.setRooms(rooms);
        p.setAvailability(PropertyAvailability.available);
        return p;
    }

    private static void addImage(PropertyEntity p, String url) {
        PropertyImageEntity img = new PropertyImageEntity();
        img.setFilePath(url);
        p.addImage(img);
    }
}
