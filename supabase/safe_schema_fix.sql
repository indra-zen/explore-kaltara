-- Safe Database Schema Fix for Explore Kaltara (Preserves Existing Data)
-- Run this ENTIRE script in Supabase Dashboard → SQL Editor

-- =================================
-- STEP 1: Ensure Profiles Table Exists with Correct Structure
-- =================================

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  avatar_url TEXT,
  location TEXT,
  preferences JSONB DEFAULT '{"favoriteLocations": [], "interests": [], "travelStyle": "mid-range"}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add missing columns to profiles if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone') THEN
    ALTER TABLE public.profiles ADD COLUMN phone TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'location') THEN
    ALTER TABLE public.profiles ADD COLUMN location TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'preferences') THEN
    ALTER TABLE public.profiles ADD COLUMN preferences JSONB DEFAULT '{"favoriteLocations": [], "interests": [], "travelStyle": "mid-range"}'::jsonb;
  END IF;
END $$;

-- =================================
-- STEP 2: Ensure Destinations Table Exists
-- =================================

-- Create destinations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('nature', 'culture', 'history', 'entertainment', 'adventure')) DEFAULT 'nature',
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  images TEXT[] DEFAULT '{}',
  featured_image TEXT,
  rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  price_range TEXT CHECK (price_range IN ('free', 'budget', 'mid-range', 'expensive')) DEFAULT 'budget',
  facilities TEXT[] DEFAULT '{}',
  opening_hours JSONB,
  contact_info JSONB,
  is_featured BOOLEAN DEFAULT false,
  status TEXT CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =================================
-- STEP 3: Ensure Hotels Table Exists
-- =================================

-- Create hotels table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.hotels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  star_rating INTEGER CHECK (star_rating >= 1 AND star_rating <= 5) DEFAULT 3,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  images TEXT[] DEFAULT '{}',
  featured_image TEXT,
  rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  price_per_night DECIMAL(10, 2),
  currency TEXT DEFAULT 'IDR',
  facilities TEXT[] DEFAULT '{}',
  amenities JSONB DEFAULT '{}'::jsonb,
  room_types JSONB DEFAULT '{}'::jsonb,
  contact_info JSONB,
  policies JSONB,
  is_featured BOOLEAN DEFAULT false,
  status TEXT CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =================================
-- STEP 4: Create/Update Bookings Table with Correct Foreign Keys
-- =================================

-- Create bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hotel_id UUID,
  destination_id UUID,
  booking_type TEXT CHECK (booking_type IN ('hotel', 'destination', 'package')) NOT NULL,
  check_in_date DATE,
  check_out_date DATE,
  guests INTEGER DEFAULT 1,
  rooms INTEGER DEFAULT 1,
  total_amount DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'IDR',
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'refunded')) DEFAULT 'pending',
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  payment_method TEXT,
  notes TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add missing columns to bookings if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'currency') THEN
    ALTER TABLE public.bookings ADD COLUMN currency TEXT DEFAULT 'IDR';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'payment_status') THEN
    ALTER TABLE public.bookings ADD COLUMN payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'payment_method') THEN
    ALTER TABLE public.bookings ADD COLUMN payment_method TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'notes') THEN
    ALTER TABLE public.bookings ADD COLUMN notes TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'contact_name') THEN
    ALTER TABLE public.bookings ADD COLUMN contact_name TEXT NOT NULL DEFAULT 'Guest';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'contact_email') THEN
    ALTER TABLE public.bookings ADD COLUMN contact_email TEXT NOT NULL DEFAULT 'guest@example.com';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'contact_phone') THEN
    ALTER TABLE public.bookings ADD COLUMN contact_phone TEXT;
  END IF;
END $$;

-- =================================
-- STEP 5: Fix Foreign Key Relationships for Bookings
-- =================================

-- Drop existing foreign key constraints for bookings if they exist
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'bookings_user_id_fkey' AND table_name = 'bookings') THEN
    ALTER TABLE public.bookings DROP CONSTRAINT bookings_user_id_fkey;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'bookings_hotel_id_fkey' AND table_name = 'bookings') THEN
    ALTER TABLE public.bookings DROP CONSTRAINT bookings_hotel_id_fkey;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'bookings_destination_id_fkey' AND table_name = 'bookings') THEN
    ALTER TABLE public.bookings DROP CONSTRAINT bookings_destination_id_fkey;
  END IF;
END $$;

-- Add correct foreign key constraints for bookings
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_hotel_id_fkey 
FOREIGN KEY (hotel_id) REFERENCES public.hotels(id) ON DELETE CASCADE;

ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_destination_id_fkey 
FOREIGN KEY (destination_id) REFERENCES public.destinations(id) ON DELETE CASCADE;

-- =================================
-- STEP 6: Create/Update Reviews Table with Correct Foreign Keys
-- =================================

-- Create reviews table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hotel_id UUID,
  destination_id UUID,
  booking_id UUID,
  review_type TEXT CHECK (review_type IN ('hotel', 'destination')) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  helpful_count INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =================================
-- STEP 7: Fix Foreign Key Relationships for Reviews
-- =================================

-- Drop existing foreign key constraints for reviews if they exist
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'reviews_user_id_fkey' AND table_name = 'reviews') THEN
    ALTER TABLE public.reviews DROP CONSTRAINT reviews_user_id_fkey;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'reviews_hotel_id_fkey' AND table_name = 'reviews') THEN
    ALTER TABLE public.reviews DROP CONSTRAINT reviews_hotel_id_fkey;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'reviews_destination_id_fkey' AND table_name = 'reviews') THEN
    ALTER TABLE public.reviews DROP CONSTRAINT reviews_destination_id_fkey;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'reviews_booking_id_fkey' AND table_name = 'reviews') THEN
    ALTER TABLE public.reviews DROP CONSTRAINT reviews_booking_id_fkey;
  END IF;
END $$;

-- Add correct foreign key constraints for reviews
ALTER TABLE public.reviews 
ADD CONSTRAINT reviews_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.reviews 
ADD CONSTRAINT reviews_hotel_id_fkey 
FOREIGN KEY (hotel_id) REFERENCES public.hotels(id) ON DELETE CASCADE;

ALTER TABLE public.reviews 
ADD CONSTRAINT reviews_destination_id_fkey 
FOREIGN KEY (destination_id) REFERENCES public.destinations(id) ON DELETE CASCADE;

ALTER TABLE public.reviews 
ADD CONSTRAINT reviews_booking_id_fkey 
FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;

-- =================================
-- STEP 8: Set up RLS and Permissions
-- =================================

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for public read access to destinations and hotels
DROP POLICY IF EXISTS "Public can view destinations" ON public.destinations;
DROP POLICY IF EXISTS "Public can view hotels" ON public.hotels;

CREATE POLICY "Public can view destinations" 
  ON public.destinations FOR SELECT 
  USING (status = 'active');

CREATE POLICY "Public can view hotels" 
  ON public.hotels FOR SELECT 
  USING (status = 'active');

-- Create RLS policies for bookings (users can only see their own)
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON public.bookings;

CREATE POLICY "Users can view own bookings" 
  ON public.bookings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings" 
  ON public.bookings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for reviews (users can only see and create their own)
DROP POLICY IF EXISTS "Users can view own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can create own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.reviews;

CREATE POLICY "Users can view own reviews" 
  ON public.reviews FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reviews" 
  ON public.reviews FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view approved reviews" 
  ON public.reviews FOR SELECT 
  USING (status = 'approved');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- =================================
-- STEP 9: Insert Sample Data (Only if Not Exists)
-- =================================

-- Insert sample destinations
INSERT INTO public.destinations (
  name, slug, description, category, location, city, 
  latitude, longitude, images, featured_image, rating, 
  review_count, price_range, facilities, is_featured, status
) VALUES 
(
  'Hutan Mangrove dan Konservasi Bekantan',
  'hutan-mangrove-bekantan-tarakan',
  'Kawasan hutan mangrove yang luas, menjadi habitat alami bagi bekantan (kera hidung panjang) dan berbagai jenis burung.',
  'nature',
  'Tarakan',
  'Tarakan',
  3.3,
  117.6,
  ARRAY['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'],
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  4.5,
  23,
  'budget',
  ARRAY['Jembatan kayu', 'Area parkir', 'Toilet', 'Warung makan'],
  true,
  'active'
) ON CONFLICT (slug) DO NOTHING;

-- Insert sample hotels
INSERT INTO public.hotels (
  name, slug, description, location, city, 
  latitude, longitude, images, featured_image, rating, 
  review_count, price_per_night, currency, facilities, 
  room_types, is_featured, status
) VALUES 
(
  'Swiss-Belhotel Tarakan',
  'swiss-belhotel-tarakan',
  'Hotel berbintang 4 dengan fasilitas lengkap di pusat kota Tarakan.',
  'Jl. Yos Sudarso No. 1',
  'Tarakan',
  3.32,
  117.63,
  ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'],
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
  4.4,
  156,
  850000,
  'IDR',
  ARRAY['WiFi gratis', 'Kolam renang', 'Fitness center', 'Restaurant'],
  '{"deluxe": {"name": "Deluxe Room", "price": 850000}}'::jsonb,
  true,
  'active'
) ON CONFLICT (slug) DO NOTHING;

-- Success message
SELECT 'Database schema has been safely updated without data loss!' as status;
