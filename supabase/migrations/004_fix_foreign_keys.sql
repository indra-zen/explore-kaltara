-- Fix foreign key relationships to reference profiles table
-- Run this in Supabase Dashboard → SQL Editor

-- First, drop existing foreign key constraints if they exist
ALTER TABLE IF EXISTS public.bookings 
DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;

ALTER TABLE IF EXISTS public.reviews 
DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;

-- Add new foreign key constraints referencing profiles table
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.reviews 
ADD CONSTRAINT reviews_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update the database types to reflect the change
COMMENT ON CONSTRAINT bookings_user_id_fkey ON public.bookings IS 'Foreign key to profiles table';
COMMENT ON CONSTRAINT reviews_user_id_fkey ON public.reviews IS 'Foreign key to profiles table';
