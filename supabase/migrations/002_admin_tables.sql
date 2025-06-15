-- Create additional tables for admin dashboard
-- Run this in Supabase Dashboard → SQL Editor

-- Destinations table
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

-- Hotels table
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
  amenities TEXT[] DEFAULT '{}',
  room_types JSONB DEFAULT '[]',
  contact_info JSONB,
  policies JSONB,
  is_featured BOOLEAN DEFAULT false,
  status TEXT CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
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

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
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

-- Activity logs table for admin dashboard
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for destinations (public read, admin write)
CREATE POLICY "Anyone can view active destinations" 
  ON public.destinations FOR SELECT 
  USING (status = 'active');

CREATE POLICY "Admins can manage destinations" 
  ON public.destinations FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND email IN ('admin@explorekaltara.com', 'demo@admin.com')
    )
  );

-- RLS Policies for hotels (public read, admin write)
CREATE POLICY "Anyone can view active hotels" 
  ON public.hotels FOR SELECT 
  USING (status = 'active');

CREATE POLICY "Admins can manage hotels" 
  ON public.hotels FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND email IN ('admin@explorekaltara.com', 'demo@admin.com')
    )
  );

-- RLS Policies for bookings (users can view own, admins can view all)
CREATE POLICY "Users can view own bookings" 
  ON public.bookings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings" 
  ON public.bookings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings" 
  ON public.bookings FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND email IN ('admin@explorekaltara.com', 'demo@admin.com')
    )
  );

CREATE POLICY "Admins can manage all bookings" 
  ON public.bookings FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND email IN ('admin@explorekaltara.com', 'demo@admin.com')
    )
  );

-- RLS Policies for reviews (users can view approved, manage own, admins can manage all)
CREATE POLICY "Anyone can view approved reviews" 
  ON public.reviews FOR SELECT 
  USING (status = 'approved');

CREATE POLICY "Users can create own reviews" 
  ON public.reviews FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own reviews" 
  ON public.reviews FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews" 
  ON public.reviews FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND email IN ('admin@explorekaltara.com', 'demo@admin.com')
    )
  );

-- RLS Policies for activity logs (admin only)
CREATE POLICY "Admins can view activity logs" 
  ON public.activity_logs FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND email IN ('admin@explorekaltara.com', 'demo@admin.com')
    )
  );

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.destinations, public.hotels TO anon, authenticated;
GRANT ALL ON public.bookings, public.reviews TO authenticated;
GRANT ALL ON public.destinations, public.hotels, public.activity_logs TO authenticated;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_destinations_status ON public.destinations(status);
CREATE INDEX IF NOT EXISTS idx_destinations_city ON public.destinations(city);
CREATE INDEX IF NOT EXISTS idx_destinations_category ON public.destinations(category);
CREATE INDEX IF NOT EXISTS idx_hotels_status ON public.hotels(status);
CREATE INDEX IF NOT EXISTS idx_hotels_city ON public.hotels(city);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at);

-- Update functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON public.destinations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON public.hotels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
