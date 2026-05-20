DELETE FROM messages
WHERE sender_id IN (
    SELECT id FROM users WHERE email IN (
        'landlord@houserental.com',
        'landlord2@houserental.com',
        'tenant@houserental.com',
        'tenant2@houserental.com'
    )
)
OR recipient_id IN (
    SELECT id FROM users WHERE email IN (
        'landlord@houserental.com',
        'landlord2@houserental.com',
        'tenant@houserental.com',
        'tenant2@houserental.com'
    )
);

DELETE FROM favorites
WHERE user_id IN (
    SELECT id FROM users WHERE email IN (
        'landlord@houserental.com',
        'landlord2@houserental.com',
        'tenant@houserental.com',
        'tenant2@houserental.com'
    )
)
OR property_id IN (
    SELECT p.id
    FROM properties p
    JOIN users u ON u.id = p.landlord_id
    WHERE u.email IN ('landlord@houserental.com', 'landlord2@houserental.com')
);

DELETE FROM bookings
WHERE tenant_id IN (
    SELECT id FROM users WHERE email IN ('tenant@houserental.com', 'tenant2@houserental.com')
)
OR property_id IN (
    SELECT p.id
    FROM properties p
    JOIN users u ON u.id = p.landlord_id
    WHERE u.email IN ('landlord@houserental.com', 'landlord2@houserental.com')
);

DELETE FROM property_images
WHERE property_id IN (
    SELECT p.id
    FROM properties p
    JOIN users u ON u.id = p.landlord_id
    WHERE u.email IN ('landlord@houserental.com', 'landlord2@houserental.com')
);

DELETE FROM properties
WHERE landlord_id IN (
    SELECT id FROM users WHERE email IN ('landlord@houserental.com', 'landlord2@houserental.com')
);

DELETE FROM users
WHERE email IN (
    'landlord@houserental.com',
    'landlord2@houserental.com',
    'tenant@houserental.com',
    'tenant2@houserental.com'
);
