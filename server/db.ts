import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from '@shared/schema';
import pg from 'pg';
const { Pool } = pg;
import { log } from './vite';
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import dotenv from 'dotenv';
import { hashPassword } from './auth';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
  connectionTimeoutMillis: 10000
});

// Keep this version (the more complete one)
export async function testConnection() {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    console.log('Database connection test successful');
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  } finally {
    client.release();
  }
}

// Create a drizzle instance with the schema
export const db = drizzle(pool, { schema });

// Run migrations (this should be done once when the app starts)
export async function runMigrations() {
  try {
    log('Running database migrations...', 'database');
    // Uncomment this when there are actual migrations in the migrations folder
    // await migrate(db, { migrationsFolder: './migrations' });
    log('Database migrations completed successfully', 'database');
  } catch (error) {
    log(`Error running migrations: ${error}`, 'database');
    throw error;
  }
}

// Function to create admin user
async function createAdminUser() {
  try {
    const adminEmail = 'srinathballa20@gmail.com';
    const adminUsername = 'admin';
    
    // Check if admin already exists
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2 LIMIT 1',
      [adminEmail, adminUsername]
    );
    
    if (result.rows.length === 0) {
      log('Creating admin user...', 'database');
      const hashedPassword = await hashPassword('Srinath12#');
      
      await pool.query(
        'INSERT INTO users (username, email, password, name, role, verified, email_verified, phone_verified) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [adminUsername, adminEmail, hashedPassword, 'System Administrator', 'admin', true, true, true]
      );
      
      log('Admin user created successfully', 'database');
    } else {
      log('Admin user already exists', 'database');
    }
  } catch (error) {
    log(`Error creating admin user: ${error}`, 'database');
  }
}


// Function to create default ad packages
async function createDefaultAdPackages() {
  try {
    // Check if packages already exist
    const result = await pool.query('SELECT COUNT(*) FROM ad_packages');
    
    if (parseInt(result.rows[0].count) === 0) {
      log('Creating default ad packages...', 'database');
      
      // Insert default packages
      await pool.query(`
        INSERT INTO ad_packages (
          name, description, price, discounted_price, ad_listings,
          top_urgency_list, countdown, high_impact_banners, response_rate,
          notifications_to_buyers, higher_position, verified_tag,
          professional_photoshoot, titanium_tag, email_promotion,
          property_description_by_experts, service_manager, guaranteed_buyers,
          relationship_manager, social_media_marketing, privacy_phone_number,
          high_impact_display_days, plan_validity_months
        ) VALUES 
        (
          'Free Package', 'Basic listing for your property', 0, 0, 3,
          false, false, false, 'Standard',
          0, false, false,
          false, false, false,
          false, false, false,
          false, false, false,
          0, 3
        ),
        (
          'Quick Sell Plan', 'Enhanced visibility for faster sales', 4999, 4999, 10,
          true, false, false, 'Medium',
          300, true, true,
          false, false, false,
          false, false, false,
          false, false, false,
          15, 3
        ),
        (
          'FastTrack Plan', 'Premium features for serious sellers', 6999, 6999, 15,
          true, true, true, 'High',
          500, true, true,
          true, false, false,
          false, false, false,
          false, false, false,
          30, 6
        ),
        (
          'Top Urgency Plan', 'Advanced features for maximum exposure', 9999, 9999, 25,
          true, true, true, 'Highest',
          750, true, true,
          true, true, true,
          true, true, false,
          false, false, true,
          60, 6
        ),
        (
          'Elite Urgency Plan', 'Complete solution with guaranteed results', 14999, 14999, 30,
          true, true, true, 'Priority',
          1000, true, true,
          true, true, true,
          true, true, true,
          true, true, true,
          90, 12
        )
      `);
      
      log('Default ad packages created successfully', 'database');
    } else {
      log('Ad packages already exist', 'database');
    }
  } catch (error) {
    log(`Error creating default ad packages: ${error}`, 'database');
  }
}

// Update the initializeDatabase function to call createDefaultAdPackages
export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    await testConnection();
    
    const client = await pool.connect();
    try {
      // Check if all required tables exist
      const tablesExist = await client.query(`
        SELECT 
          (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')) AS users_exists,
          (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'projects')) AS projects_exists,
          (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'properties')) AS properties_exists,
          (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ad_packages')) AS ad_packages_exists,
          (SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_subscriptions')) AS user_subscriptions_exists
      `);
      
      const allTablesExist = tablesExist.rows[0].users_exists && 
                             tablesExist.rows[0].projects_exists && 
                             tablesExist.rows[0].properties_exists &&
                             tablesExist.rows[0].ad_packages_exists &&
                             tablesExist.rows[0].user_subscriptions_exists;
      
      if (!allTablesExist) {
        console.log('Creating missing database tables...');
        
        // Manually create tables if they don't exist
        await pool.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT,
            role TEXT NOT NULL DEFAULT 'buyer',
            avatar TEXT,
            bio TEXT,
            verified BOOLEAN DEFAULT FALSE,
            email_verified BOOLEAN DEFAULT FALSE,
            phone_verified BOOLEAN DEFAULT FALSE,
            subscription_level TEXT DEFAULT 'free',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
          CREATE TABLE IF NOT EXISTS properties (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            price DOUBLE PRECISION NOT NULL,
            discounted_price DOUBLE PRECISION, /* Added missing column */
            property_type TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'available',
            rent_or_sale TEXT NOT NULL,
            bedrooms INTEGER,
            bathrooms INTEGER,
            area DOUBLE PRECISION,
            address TEXT,
            city TEXT,
            state TEXT,
            zip TEXT,
            location TEXT,
            latitude DOUBLE PRECISION,
            longitude DOUBLE PRECISION,
            image_urls TEXT[],
            video_urls TEXT[],
            virtual_tour_url TEXT,
            floor_plan_url TEXT,
            amenities TEXT[],
            features TEXT[],
            user_id INTEGER NOT NULL,
            agent_id INTEGER,
            company_id INTEGER,
            featured BOOLEAN DEFAULT FALSE,
            verified BOOLEAN DEFAULT FALSE,
            premium BOOLEAN DEFAULT FALSE,
            approval_status TEXT DEFAULT 'pending',
            approved_by INTEGER,
            rejection_reason TEXT,
            approval_date TIMESTAMP,
            subscription_level TEXT DEFAULT 'free',
            subscription_amount INTEGER DEFAULT 0,
            subscription_expires_at TIMESTAMP,
            year_built INTEGER,
            expires_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
      
          CREATE TABLE IF NOT EXISTS property_recommendations (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            property_id INTEGER NOT NULL,
            score DOUBLE PRECISION NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
      
          CREATE TABLE IF NOT EXISTS property_views (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            property_id INTEGER NOT NULL,
            viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
      
          CREATE TABLE IF NOT EXISTS saved_properties (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            property_id INTEGER NOT NULL,
            saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
      
          CREATE TABLE IF NOT EXISTS inquiries (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            property_id INTEGER NOT NULL,
            recipient_id INTEGER NOT NULL,
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
      
          CREATE TABLE IF NOT EXISTS agent_reviews (
            id SERIAL PRIMARY KEY,
            agent_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            rating INTEGER NOT NULL,
            review TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
      
          CREATE TABLE IF NOT EXISTS notifications (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT NOT NULL,
            reference_id INTEGER,
            reference_type TEXT,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
          CREATE TABLE IF NOT EXISTS free_properties (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  price INTEGER,
  property_type TEXT,
  property_category TEXT,
  transaction_type TEXT,
  is_urgent_sale BOOLEAN,
  location TEXT,
  city TEXT,
  project_name TEXT,
  pincode TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  balconies INTEGER,
  floor_no INTEGER,
  total_floors INTEGER,
  floors_allowed_construction INTEGER,
  furnished_status TEXT,
  road_width TEXT,
  open_sides TEXT,
  area INTEGER,
  area_unit TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  whatsapp_enabled BOOLEAN,
  user_type TEXT,
  parking TEXT,
  facing TEXT,
  amenities TEXT[],
  possession_status TEXT,
  ownership_type TEXT,
  boundary_wall TEXT,
  electricity_status TEXT,
  water_availability TEXT,
  flooring_type TEXT,
  overlooking TEXT,
  preferred_tenant TEXT,
  property_age TEXT,
  project_status TEXT,
  launch_date TEXT,
  rera_registered BOOLEAN,
  rera_number TEXT,
  landmarks TEXT,
  brokerage INTEGER,
  no_broker_responses BOOLEAN,
  address TEXT,
  rent_or_sale TEXT,
  image_urls TEXT[],
  image_categories JSONB,
  approval_status TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  location TEXT,
  city TEXT,
  state TEXT,
  price TEXT,
  price_range TEXT,
  bhk_config TEXT,
  builder TEXT,
  possession_date TEXT,
  category TEXT,
  status TEXT,
  amenities TEXT[],
  tags TEXT[],
  image_url TEXT,
  gallery_urls TEXT[],
  featured BOOLEAN,
  rating DOUBLE PRECISION,
  total_area TEXT,
  starting_price TEXT,
  approval_status TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  image_urls TEXT[],
  contact_number TEXT,
  user_id INTEGER,
  approved_by INTEGER,
  contact_email TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  contact_position TEXT,
  approved_at TIMESTAMP,
  approval_date TIMESTAMP,
  completion_date TIMESTAMP,
  launch_date TIMESTAMP,
  rejection_reason TEXT,
  rejected_at TIMESTAMP,
  rejected_by INTEGER,
  rera_number TEXT,
  rera_registered BOOLEAN,
  project_status TEXT
);
CREATE TABLE IF NOT EXISTS referrals (
  id SERIAL PRIMARY KEY,
  referrer_user_id INTEGER,
  referrer_name TEXT,
  referrer_email TEXT,
  referrer_phone TEXT,
  referred_name TEXT,
  referred_email TEXT,
  referred_phone TEXT,
  property_interest TEXT,
  budget INTEGER,
  location TEXT,
  status TEXT,
  notes TEXT,
  commission INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

          CREATE TABLE IF NOT EXISTS ad_packages (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            price DOUBLE PRECISION NOT NULL,
            discounted_price DOUBLE PRECISION,
            ad_listings INTEGER NOT NULL,
            top_urgency_list BOOLEAN DEFAULT FALSE,
            countdown BOOLEAN DEFAULT FALSE,
            high_impact_banners BOOLEAN DEFAULT FALSE,
            response_rate TEXT DEFAULT 'Standard',
            notifications_to_buyers INTEGER DEFAULT 0,
            higher_position BOOLEAN DEFAULT FALSE,
            verified_tag BOOLEAN DEFAULT FALSE,
            professional_photoshoot BOOLEAN DEFAULT FALSE,
            titanium_tag BOOLEAN DEFAULT FALSE,
            email_promotion BOOLEAN DEFAULT FALSE,
            property_description_by_experts BOOLEAN DEFAULT FALSE,
            service_manager BOOLEAN DEFAULT FALSE,
            guaranteed_buyers BOOLEAN DEFAULT FALSE,
            relationship_manager BOOLEAN DEFAULT FALSE,
            social_media_marketing BOOLEAN DEFAULT FALSE,
            privacy_phone_number BOOLEAN DEFAULT FALSE,
            high_impact_display_days INTEGER DEFAULT 0,
            plan_validity_months INTEGER DEFAULT 3,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE TABLE IF NOT EXISTS user_subscriptions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            package_id INTEGER NOT NULL,
            payment_id TEXT,
            payment_status TEXT DEFAULT 'pending',
            amount_paid DOUBLE PRECISION NOT NULL,
            gst_amount DOUBLE PRECISION NOT NULL,
            total_amount DOUBLE PRECISION NOT NULL,
            start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            end_date TIMESTAMP,
            is_active BOOLEAN DEFAULT FALSE,
            properties_listed INTEGER DEFAULT 0,
            properties_remaining INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (package_id) REFERENCES ad_packages(id) ON DELETE CASCADE
          );
        `);
        
        // Insert default ad packages
        await pool.query(`
          INSERT INTO ad_packages (name, description, price, discounted_price, ad_listings, top_urgency_list, countdown, high_impact_banners, response_rate, notifications_to_buyers, higher_position, verified_tag, professional_photoshoot, titanium_tag, email_promotion, property_description_by_experts, service_manager, guaranteed_buyers, relationship_manager, social_media_marketing, privacy_phone_number, high_impact_display_days, plan_validity_months)
          VALUES 
            ('Free Package', 'Basic listing for property owners', 0, 0, 3, false, false, false, 'Standard', 125, false, false, false, false, true, false, false, false, false, false, true, 7, 3),
            ('Quick Sell Plan', 'For faster property sales', 6999, 4999, 10, true, false, false, 'Medium', 300, true, false, false, false, true, true, false, false, false, false, true, 15, 3),
            ('FastTrack Plan', 'Accelerated property sales with countdown feature', 6999, 6999, 15, true, true, false, 'High', 500, true, true, false, false, true, true, false, false, false, true, true, 30, 3),
            ('Top Urgency Plan', 'Premium visibility with high-impact banners', 9999, 9999, 25, true, true, true, 'Highest', 750, true, true, false, true, true, true, false, false, false, true, true, 45, 3),
            ('Elite Urgency Plan', 'Complete premium package with all features', 14999, 14999, 30, true, true, true, 'Priority', 1000, true, true, true, true, true, true, true, true, true, true, true, 60, 3)
          ON CONFLICT DO NOTHING;
        `);
      
        log('Tables created successfully', 'database');
      } else {
        log('All required tables already exist', 'database');
      }
      
      await createAdminUser();
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Add this at the end of the file to ensure database is initialized
initializeDatabase().catch(error => {
  console.error('Failed to initialize database:', error);
});