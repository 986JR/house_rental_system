-- Seed Users
INSERT INTO users (email, password_hash, role, full_name, active) VALUES
('admin@houserental.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'admin', 'Admin User', true),
('landlord@houserental.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'landlord', 'Landlord One', true),
('landlord2@houserental.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'landlord','Landlord Two', true),
('tenant@houserental.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'tenant', 'Tenant One', true),
('tenant2@houserental.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'tenant','Tenant Two', true);

-- Seed Properties
-- Assuming IDs 1 to 5 for users above
INSERT INTO properties (landlord_id, title, description, location, price_per_month, rooms, availability) VALUES
(2, 'Modern Skyline Penthouse', 'Breathtaking panoramic city views from this luxurious penthouse. Floor-to-ceiling windows, chef''s kitchen with quartz countertops, and a private rooftop terrace. Concierge and valet parking included.', 'Manhattan, New York', 8500.00, 3, 'available'),
(3, 'Cozy Brooklyn Brownstone', 'Charming pre-war brownstone in the heart of Park Slope. Original hardwood floors, exposed brick walls, and a private garden. Walkable to Prospect Park and top-rated restaurants.', 'Brooklyn, New York', 3200.00, 2, 'available'),
(2, 'Beachfront Malibu Villa', 'Wake up to the sound of waves in this stunning beachfront villa. Wraparound deck, infinity pool, chef''s kitchen, and direct beach access. Perfect for those who want the ultimate California lifestyle.', 'Malibu, California', 12000.00, 4, 'available'),
(3, 'Downtown Chicago Loft', 'Industrial-chic loft in the vibrant River North neighborhood. Exposed concrete ceilings, polished floors, and massive industrial windows. Building amenities include rooftop deck, gym and concierge.', 'River North, Chicago', 2800.00, 1, 'available'),
(2, 'Suburban Family Home', 'Spacious family home in a quiet, tree-lined street. Large backyard with deck, updated kitchen, and 2-car garage. Top-rated school district. Perfect for growing families.', 'Naperville, Illinois', 2400.00, 4, 'unavailable'),
(3, 'Austin Tech District Studio', 'Sleek, modern studio in the heart of Austin''s tech corridor. High-speed fiber internet, smart home features, and access to co-working spaces. Walkable to top restaurants and entertainment.', 'Downtown Austin, Texas', 1800.00, 1, 'available'),
(2, 'Miami Art Deco Apartment', 'Iconic Art Deco building steps from South Beach. Renovated interior with original architectural details. Pool, fitness center, and valet parking. Live the Miami dream.', 'South Beach, Miami', 4500.00, 2, 'available'),
(3, 'Pacific Heights Victorian', 'Beautifully restored Victorian with spectacular bay and bridge views. Original period details with modern updates throughout. Private garden and 2-car parking. A San Francisco treasure.', 'Pacific Heights, San Francisco', 6200.00, 3, 'available'),
(2, 'Seattle Waterfront Condo', 'Stunning waterfront condo with panoramic views of Puget Sound. Modern finishes, open floor plan, and floor-to-ceiling windows. Building amenities include infinity pool, gym, and kayak storage.', 'Capitol Hill, Seattle', 3800.00, 2, 'available');

-- Seed Images
INSERT INTO property_images (property_id, file_path) VALUES
(1, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200'),
(2, 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1200'),
(3, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200'),
(4, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'),
(5, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=1200'),
(6, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200'),
(7, 'https://images.unsplash.com/photo-1600607687940-4e7a6a953c1b?auto=format&fit=crop&q=80&w=1200'),
(8, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200'),
(9, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200');
