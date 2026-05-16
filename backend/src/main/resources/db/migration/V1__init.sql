CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL,
    full_name VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE properties (
    id BIGSERIAL PRIMARY KEY,
    landlord_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(512) NOT NULL,
    price_per_month NUMERIC(12, 2) NOT NULL,
    rooms INTEGER NOT NULL,
    availability VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_properties_location ON properties (location);
CREATE INDEX idx_properties_price ON properties (price_per_month);
CREATE INDEX idx_properties_landlord ON properties (landlord_id);

CREATE TABLE property_images (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL REFERENCES properties (id) ON DELETE CASCADE,
    file_path VARCHAR(1024) NOT NULL
);

CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL REFERENCES properties (id) ON DELETE CASCADE,
    tenant_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_tenant ON bookings (tenant_id);
CREATE INDEX idx_bookings_property ON bookings (property_id);

CREATE TABLE favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    property_id BIGINT NOT NULL REFERENCES properties (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, property_id)
);

CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    sender_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    recipient_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_sender ON messages (sender_id);
CREATE INDEX idx_messages_recipient ON messages (recipient_id);
