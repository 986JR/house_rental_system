-- Add contact details to properties table
ALTER TABLE properties ADD COLUMN phone VARCHAR(20);
ALTER TABLE properties ADD COLUMN contact_email VARCHAR(255);

-- Create system_logs table
CREATE TABLE system_logs (
    id BIGSERIAL PRIMARY KEY,
    action VARCHAR(32) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT,
    user_id BIGINT,
    user_email VARCHAR(255),
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_system_logs_created_at ON system_logs (created_at DESC);
CREATE INDEX idx_system_logs_action ON system_logs (action);
CREATE INDEX idx_system_logs_entity ON system_logs (entity_type, entity_id);
