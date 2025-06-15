-- Create Admin User in Supabase Database
-- Run this in Supabase Dashboard → SQL Editor

-- Method 1: Create auth user and profile using admin SQL functions
-- This method creates both auth user and profile in one go

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Insert into auth.users (this might require RLS to be disabled temporarily)
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        phone_confirmed_at,
        confirmation_sent_at,
        recovery_sent_at,
        email_change_sent_at,
        new_email,
        invited_at,
        action_link,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        role,
        aud,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change
    ) VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000000',
        'demo@admin.com',
        crypt('admin123', gen_salt('bf')),
        NOW(),
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "Demo Admin"}',
        false,
        'authenticated',
        'authenticated',
        NULL,
        NULL,
        NULL,
        NULL
    ) RETURNING id INTO new_user_id;

    -- Insert corresponding profile
    INSERT INTO public.profiles (
        id,
        email,
        name,
        avatar_url,
        favorite_locations,
        interests,
        travel_style
    ) VALUES (
        new_user_id,
        'demo@admin.com',
        'Demo Admin',
        'https://ui-avatars.com/api/?name=Demo+Admin&background=10b981&color=fff&size=100',
        ARRAY['Kalimantan Utara', 'Tarakan'],
        ARRAY['nature', 'culture', 'adventure'],
        'mid-range'
    );
    
    RAISE NOTICE 'Admin user created with ID: %', new_user_id;
END $$;

-- Method 2: EASIER APPROACH - Use Supabase Dashboard Authentication
-- This is the most reliable method for hosted Supabase

-- Step 1: Go to Supabase Dashboard → Authentication → Users
-- Step 2: Click "Add User" button
-- Step 3: Fill in:
--   Email: demo@admin.com
--   Password: admin123
--   Email Confirm: true
-- Step 4: Click "Create User"

-- Step 5: After user is created, run this to create the profile:
INSERT INTO public.profiles (
    id,
    email,
    name,
    avatar_url,
    favorite_locations,
    interests,
    travel_style
) 
SELECT 
    id,
    'demo@admin.com',
    'Demo Admin',
    'https://ui-avatars.com/api/?name=Demo+Admin&background=10b981&color=fff&size=100',
    ARRAY['Kalimantan Utara', 'Tarakan'],
    ARRAY['nature', 'culture', 'adventure'],
    'mid-range'
FROM auth.users 
WHERE email = 'demo@admin.com'
ON CONFLICT (id) DO UPDATE SET
    email = 'demo@admin.com',
    name = 'Demo Admin';

-- Method 3: If you already registered but password is wrong
-- Check if user exists and what the issue might be:
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    u.created_at,
    p.name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'demo@admin.com';

-- If user exists but no profile, create profile:
-- (Replace the UUID with the actual ID from the query above)
-- INSERT INTO public.profiles (id, email, name) 
-- VALUES ('actual-uuid-here', 'demo@admin.com', 'Demo Admin');
