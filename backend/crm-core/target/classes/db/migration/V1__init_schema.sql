-- ============================================================
-- XenoReach AI - Initial Schema
-- ============================================================

CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    firebase_uid    VARCHAR(128) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    name            VARCHAR(255),
    picture_url     TEXT,
    role            VARCHAR(32)  NOT NULL DEFAULT 'ADMIN',
    created_at      TIMESTAMP NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE customers (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    phone           VARCHAR(32),
    city            VARCHAR(128),
    gender          VARCHAR(16),
    age             INTEGER,
    total_spend     NUMERIC(14,2) NOT NULL DEFAULT 0,
    last_order_date TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_total_spend ON customers(total_spend);
CREATE INDEX idx_customers_last_order_date ON customers(last_order_date);
CREATE INDEX idx_customers_city ON customers(city);

CREATE TABLE orders (
    id              BIGSERIAL PRIMARY KEY,
    customer_id     BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    amount          NUMERIC(14,2) NOT NULL,
    status          VARCHAR(32) NOT NULL DEFAULT 'COMPLETED',
    order_date      TIMESTAMP NOT NULL DEFAULT now(),
    created_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_order_date ON orders(order_date);

CREATE TABLE segments (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    rules_json      JSONB NOT NULL,
    audience_size   INTEGER NOT NULL DEFAULT 0,
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMP NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE campaigns (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    segment_id      BIGINT NOT NULL REFERENCES segments(id) ON DELETE RESTRICT,
    channel         VARCHAR(32) NOT NULL,
    subject         VARCHAR(255),
    message         TEXT NOT NULL,
    cta             VARCHAR(255),
    status          VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    created_by      BIGINT REFERENCES users(id),
    launched_at     TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_campaigns_segment_id ON campaigns(segment_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);

CREATE TABLE communications (
    id              BIGSERIAL PRIMARY KEY,
    campaign_id     BIGINT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    customer_id     BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    channel         VARCHAR(32) NOT NULL,
    message         TEXT NOT NULL,
    status          VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    converted       BOOLEAN NOT NULL DEFAULT FALSE,
    sent_at         TIMESTAMP,
    delivered_at    TIMESTAMP,
    opened_at       TIMESTAMP,
    clicked_at      TIMESTAMP,
    failed_at       TIMESTAMP,
    failure_reason  VARCHAR(255),
    created_at      TIMESTAMP NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_communications_campaign_id ON communications(campaign_id);
CREATE INDEX idx_communications_customer_id ON communications(customer_id);
CREATE INDEX idx_communications_status ON communications(status);

CREATE TABLE events (
    id                BIGSERIAL PRIMARY KEY,
    communication_id  BIGINT NOT NULL REFERENCES communications(id) ON DELETE CASCADE,
    type              VARCHAR(32) NOT NULL,
    metadata_json     JSONB,
    occurred_at       TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_communication_id ON events(communication_id);
CREATE INDEX idx_events_type ON events(type);
