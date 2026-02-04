-- Database Schema for ORC Verification System

-- Table for auditors
CREATE TABLE auditors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    firm_name VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'verified', 'expired', 'suspended', 'not_found', 'pending'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for companies
CREATE TABLE companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    registration_number VARCHAR(50) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for appointments (auditor-company relationships)
CREATE TABLE appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    auditor_id UUID REFERENCES auditors(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'pending', 'expired'
    consent_code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for consent records
CREATE TABLE consent_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    auditor_id UUID REFERENCES auditors(id) ON DELETE CASCADE,
    consent_code VARCHAR(50) UNIQUE NOT NULL,
    date_of_consent DATE NOT NULL,
    auditor_signature TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_auditors_license_number ON auditors(license_number);
CREATE INDEX idx_auditors_status ON auditors(status);
CREATE INDEX idx_companies_registration_number ON companies(registration_number);
CREATE INDEX idx_appointments_consent_code ON appointments(consent_code);
CREATE INDEX idx_appointments_company_id ON appointments(company_id);
CREATE INDEX idx_appointments_auditor_id ON appointments(auditor_id);
CREATE INDEX idx_consent_records_consent_code ON consent_records(consent_code);