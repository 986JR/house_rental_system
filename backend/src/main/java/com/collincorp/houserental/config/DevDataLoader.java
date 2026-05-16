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

        // Property 1
        PropertyEntity p1 = property(landlord, "Modern Skyline Penthouse", "Breathtaking panoramic city views from this luxurious penthouse. Floor-to-ceiling windows, chef's kitchen with quartz countertops, and a private rooftop terrace. Concierge and valet parking included.", "Manhattan, New York", new BigDecimal("8500.00"), 3);
        addImage(p1, "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200");
        propertyRepository.save(p1);

        // Property 2
        PropertyEntity p2 = property(landlord2, "Cozy Brooklyn Brownstone", "Charming pre-war brownstone in the heart of Park Slope. Original hardwood floors, exposed brick walls, and a private garden. Walkable to Prospect Park and top-rated restaurants.", "Brooklyn, New York", new BigDecimal("3200.00"), 2);
        addImage(p2, "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1200");
        propertyRepository.save(p2);

        // Property 3
        PropertyEntity p3 = property(landlord, "Beachfront Malibu Villa", "Wake up to the sound of waves in this stunning beachfront villa. Wraparound deck, infinity pool, chef's kitchen, and direct beach access. Perfect for those who want the ultimate California lifestyle.", "Malibu, California", new BigDecimal("12000.00"), 4);
        addImage(p3, "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200");
        propertyRepository.save(p3);

        // Property 4
        PropertyEntity p4 = property(landlord2, "Downtown Chicago Loft", "Industrial-chic loft in the vibrant River North neighborhood. Exposed concrete ceilings, polished floors, and massive industrial windows. Building amenities include rooftop deck, gym and concierge.", "River North, Chicago", new BigDecimal("2800.00"), 1);
        addImage(p4, "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200");
        propertyRepository.save(p4);

        // Property 5
        PropertyEntity p5 = property(landlord, "Suburban Family Home", "Spacious family home in a quiet, tree-lined street. Large backyard with deck, updated kitchen, and 2-car garage. Top-rated school district. Perfect for growing families.", "Naperville, Illinois", new BigDecimal("2400.00"), 4);
        p5.setAvailability(PropertyAvailability.unavailable);
        addImage(p5, "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=1200");
        propertyRepository.save(p5);

        // Property 6
        PropertyEntity p6 = property(landlord2, "Austin Tech District Studio", "Sleek, modern studio in the heart of Austin's tech corridor. High-speed fiber internet, smart home features, and access to co-working spaces. Walkable to top restaurants and entertainment.", "Downtown Austin, Texas", new BigDecimal("1800.00"), 1);
        addImage(p6, "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200");
        propertyRepository.save(p6);

        // Property 7
        PropertyEntity p7 = property(landlord, "Miami Art Deco Apartment", "Iconic Art Deco building steps from South Beach. Renovated interior with original architectural details. Pool, fitness center, and valet parking. Live the Miami dream.", "South Beach, Miami", new BigDecimal("4500.00"), 2);
        addImage(p7, "https://images.unsplash.com/photo-1600607687940-4e7a6a953c1b?auto=format&fit=crop&q=80&w=1200");
        propertyRepository.save(p7);

        // Property 8
        PropertyEntity p8 = property(landlord2, "Pacific Heights Victorian", "Beautifully restored Victorian with spectacular bay and bridge views. Original period details with modern updates throughout. Private garden and 2-car parking. A San Francisco treasure.", "Pacific Heights, San Francisco", new BigDecimal("6200.00"), 3);
        addImage(p8, "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200");
        propertyRepository.save(p8);

        // Property 9
        PropertyEntity p9 = property(landlord, "Seattle Waterfront Condo", "Stunning waterfront condo with panoramic views of Puget Sound. Modern finishes, open floor plan, and floor-to-ceiling windows. Building amenities include infinity pool, gym, and kayak storage.", "Capitol Hill, Seattle", new BigDecimal("3800.00"), 2);
        addImage(p9, "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200");
        propertyRepository.save(p9);
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
