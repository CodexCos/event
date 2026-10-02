-- Run this in psql or pgAdmin against your 'eventmate' database
-- psql -U postgres -d eventmate -f schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  role        VARCHAR(20) NOT NULL DEFAULT 'participant',
  bio         TEXT,
  company     VARCHAR(120),
  interests   TEXT[] DEFAULT '{}',
  joined_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            VARCHAR(255) NOT NULL,
  description      TEXT,
  date             DATE NOT NULL,
  time             VARCHAR(20),
  end_time         VARCHAR(20),
  location         VARCHAR(255),
  category         VARCHAR(80),
  image_url        TEXT,
  price            INTEGER DEFAULT 0,
  capacity         INTEGER DEFAULT 100,
  organizer_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  status           VARCHAR(20) DEFAULT 'published',
  trending         BOOLEAN DEFAULT FALSE,
  featured         BOOLEAN DEFAULT FALSE,
  tags             TEXT[] DEFAULT '{}',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Registrations
CREATE TABLE IF NOT EXISTS registrations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id      UUID REFERENCES events(id) ON DELETE CASCADE,
  status        VARCHAR(20) DEFAULT 'confirmed',
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  message    TEXT NOT NULL,
  type       VARCHAR(50) DEFAULT 'info',
  read       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id         UUID REFERENCES events(id) ON DELETE CASCADE,
  registration_id  UUID REFERENCES registrations(id) ON DELETE SET NULL,
  amount           NUMERIC(10, 2) NOT NULL,
  transaction_uuid VARCHAR(255) UNIQUE NOT NULL,
  esewa_ref_id     VARCHAR(255),
  status           VARCHAR(50) DEFAULT 'PENDING',
  payment_method   VARCHAR(50) DEFAULT 'ESEWA',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Useful view: events with registered count
CREATE OR REPLACE VIEW events_with_count AS
  SELECT e.*,
    (SELECT COUNT(*) FROM registrations r
     WHERE r.event_id = e.id AND r.status = 'confirmed') AS registered_count
  FROM events e;

