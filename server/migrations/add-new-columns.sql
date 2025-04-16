-- Add new columns to the projects table

-- Image URLs
ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery_urls TEXT[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS location_map_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS master_plan_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS floor_plan_urls TEXT[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS specification_urls TEXT[];

-- BHK Sizes
ALTER TABLE projects ADD COLUMN IF NOT EXISTS bhk2_sizes TEXT[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS bhk3_sizes TEXT[];

-- Location fields
ALTER TABLE projects ADD COLUMN IF NOT EXISTS location_advantages TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- Financial fields
ALTER TABLE projects ADD COLUMN IF NOT EXISTS loan_amount TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS interest_rate TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS loan_tenure TEXT;

-- Luxury category fields
ALTER TABLE projects ADD COLUMN IF NOT EXISTS premium_features TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS exclusive_services TEXT;

-- Affordable category fields
ALTER TABLE projects ADD COLUMN IF NOT EXISTS affordability_features TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS financial_schemes TEXT;

-- Commercial category fields
ALTER TABLE projects ADD COLUMN IF NOT EXISTS commercial_type TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS business_amenities TEXT;

-- New Launch category fields
ALTER TABLE projects ADD COLUMN IF NOT EXISTS launch_date TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS launch_offers TEXT;

-- Upcoming category fields
ALTER TABLE projects ADD COLUMN IF NOT EXISTS expected_completion_date TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS construction_status TEXT;

-- Top Urgent category fields
ALTER TABLE projects ADD COLUMN IF NOT EXISTS sale_deadline TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS urgency_reason TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS discount_offered TEXT;

-- Featured category fields
ALTER TABLE projects ADD COLUMN IF NOT EXISTS highlight_features TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS accolades TEXT;

-- Newly Listed category fields
ALTER TABLE projects ADD COLUMN IF NOT EXISTS listing_date TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS special_intro_offer TEXT;

-- Company Projects category fields
ALTER TABLE projects ADD COLUMN IF NOT EXISTS company_profile TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS past_projects TEXT;

-- RERA fields
ALTER TABLE projects ADD COLUMN IF NOT EXISTS rera_number TEXT;

-- Additional image URLs
ALTER TABLE projects ADD COLUMN IF NOT EXISTS about_project_image_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS developer_logo_url TEXT;