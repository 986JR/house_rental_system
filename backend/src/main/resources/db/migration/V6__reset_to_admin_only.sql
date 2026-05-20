DELETE FROM messages;
DELETE FROM favorites;
DELETE FROM bookings;
DELETE FROM property_images;
DELETE FROM properties;
DELETE FROM system_logs;

DELETE FROM users
WHERE lower(email) <> 'admin@gmail.com'
   OR role <> 'admin';

INSERT INTO users (email, password_hash, role, full_name, active)
SELECT
    'admin@gmail.com',
    '$2a$10$CFX4KWygLmnGX1Ddl24MOOgJaA1xQc62f4n7kRX6BrQgD83Nk5OBC',
    'admin',
    'Default Admin',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE lower(email) = 'admin@gmail.com'
);
