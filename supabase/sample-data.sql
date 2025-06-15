-- Sample data for admin dashboard testing
-- Run this in Supabase Dashboard → SQL Editor to update existing records

-- Update sample destinations
UPDATE public.destinations SET 
    name = 'Hutan Mangrove Bekantan',
    description = 'Hutan mangrove yang menjadi habitat alami bekantan dan berbagai satwa endemik Kalimantan.',
    category = 'nature',
    location = 'Tarakan, Kalimantan Utara',
    city = 'Tarakan',
    latitude = 3.3272,
    longitude = 117.5914,
    images = ARRAY['/images/hutan-mangrove-bekantan-1.jpg', '/images/hutan-mangrove-bekantan-2.jpg'],
    featured_image = '/images/hutan-mangrove-bekantan-1.jpg',
    rating = 4.5,
    review_count = 89,
    price_range = 'budget',
    facilities = ARRAY['Jembatan kayu', 'Menara pandang', 'Toilet', 'Area parkir'],
    is_featured = true,
    status = 'active'
WHERE slug = 'hutan-mangrove-bekantan';

UPDATE public.destinations SET 
    name = 'Pantai Amal',
    description = 'Pantai indah dengan pemandangan sunset yang memukau dan fasilitas lengkap untuk wisata keluarga.',
    category = 'nature',
    location = 'Tarakan, Kalimantan Utara',
    city = 'Tarakan',
    latitude = 3.2743,
    longitude = 117.6125,
    images = ARRAY['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop'],
    featured_image = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    rating = 4.2,
    review_count = 67,
    price_range = 'budget',
    facilities = ARRAY['Gazebo', 'Area bermain', 'Warung makan', 'Toilet'],
    is_featured = true,
    status = 'active'
WHERE slug = 'pantai-amal';

UPDATE public.destinations SET 
    name = 'Pulau Bunyu',
    description = 'Pulau kecil dengan pantai berpasir putih dan air laut yang jernih, cocok untuk snorkeling.',
    category = 'nature',
    location = 'Bunyu, Kalimantan Utara',
    city = 'Bunyu',
    latitude = 3.4612,
    longitude = 117.8734,
    images = ARRAY['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'],
    featured_image = 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    rating = 4.0,
    review_count = 45,
    price_range = 'mid-range',
    facilities = ARRAY['Penyewaan alat snorkel', 'Perahu', 'Homestay'],
    is_featured = false,
    status = 'active'
WHERE slug = 'pulau-bunyu';

UPDATE public.destinations SET 
    name = 'Taman Nasional Kayan Mentarang',
    description = 'Taman nasional dengan keanekaragaman hayati tinggi dan budaya Dayak yang masih lestari.',
    category = 'nature',
    location = 'Malinau, Kalimantan Utara',
    city = 'Malinau',
    latitude = 2.9167,
    longitude = 116.0000,
    images = ARRAY['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'],
    featured_image = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    rating = 4.7,
    review_count = 34,
    price_range = 'expensive',
    facilities = ARRAY['Pemandu wisata', 'Trekking trail', 'Camping ground'],
    is_featured = false,
    status = 'active'
WHERE slug = 'taman-nasional-kayan-mentarang';

UPDATE public.destinations SET 
    name = 'Museum Baloy Mayo',
    description = 'Museum yang menampilkan sejarah dan budaya masyarakat Tidung dan Dayak di Kalimantan Utara.',
    category = 'culture',
    location = 'Tanjung Selor, Kalimantan Utara',
    city = 'Tanjung Selor',
    latitude = 2.8375,
    longitude = 117.3542,
    images = ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
    featured_image = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    rating = 3.8,
    review_count = 28,
    price_range = 'budget',
    facilities = ARRAY['Koleksi artefak', 'Pemandu museum', 'Ruang audio visual'],
    is_featured = false,
    status = 'active'
WHERE slug = 'museum-baloy-mayo';

-- Update sample hotels
UPDATE public.hotels SET 
    name = 'Swiss-Belhotel Tarakan',
    description = 'Hotel bintang 4 dengan fasilitas modern dan pemandangan laut yang indah di pusat kota Tarakan.',
    star_rating = 4,
    location = 'Jl. Yos Sudarso No. 1, Tarakan',
    city = 'Tarakan',
    latitude = 3.3017,
    longitude = 117.6386,
    images = ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop'],
    featured_image = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    rating = 4.3,
    review_count = 156,
    price_per_night = 850000,
    amenities = ARRAY['WiFi gratis', 'Kolam renang', 'Fitness center', 'Restaurant', 'Room service', 'Spa'],
    is_featured = true,
    status = 'active'
WHERE slug = 'swiss-belhotel-tarakan';

UPDATE public.hotels SET 
    name = 'Hotel Perdana Tarakan',
    description = 'Hotel nyaman dengan harga terjangkau di pusat kota Tarakan, dekat dengan berbagai tempat wisata.',
    star_rating = 3,
    location = 'Jl. Mulawarman No. 15, Tarakan',
    city = 'Tarakan',
    latitude = 3.2987,
    longitude = 117.6354,
    images = ARRAY['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'],
    featured_image = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
    rating = 3.9,
    review_count = 89,
    price_per_night = 450000,
    amenities = ARRAY['WiFi gratis', 'AC', 'TV', 'Restaurant', 'Laundry'],
    is_featured = false,
    status = 'active'
WHERE slug = 'hotel-perdana-tarakan';

UPDATE public.hotels SET 
    name = 'Tarakan Plaza Hotel',
    description = 'Hotel bisnis dengan fasilitas lengkap dan lokasi strategis di pusat perdagangan Tarakan.',
    star_rating = 3,
    location = 'Jl. Sudirman No. 38, Tarakan',
    city = 'Tarakan',
    latitude = 3.3043,
    longitude = 117.6401,
    images = ARRAY['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop'],
    featured_image = 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop',
    rating = 4.0,
    review_count = 112,
    price_per_night = 650000,
    amenities = ARRAY['WiFi gratis', 'Business center', 'Meeting room', 'Restaurant', 'Parking'],
    is_featured = true,
    status = 'active'
WHERE slug = 'tarakan-plaza-hotel';

UPDATE public.hotels SET 
    name = 'Green Garden Hotel',
    description = 'Hotel ramah lingkungan dengan taman yang asri dan suasana tenang untuk liburan keluarga.',
    star_rating = 2,
    location = 'Jl. Pantai Amal, Tarakan',
    city = 'Tarakan',
    latitude = 3.2756,
    longitude = 117.6089,
    images = ARRAY['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop'],
    featured_image = 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
    rating = 3.7,
    review_count = 67,
    price_per_night = 350000,
    amenities = ARRAY['WiFi gratis', 'Taman', 'Restaurant', 'Playground'],
    is_featured = false,
    status = 'active'
WHERE slug = 'green-garden-hotel';

UPDATE public.hotels SET 
    name = 'Malinau Riverfront Lodge',
    description = 'Lodge eksklusif di tepi sungai dengan pemandangan alam yang spektakuler dan pengalaman eco-tourism.',
    star_rating = 4,
    location = 'Jl. Sungai Malinau, Malinau',
    city = 'Malinau',
    latitude = 2.5833,
    longitude = 116.3833,
    images = ARRAY['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'],
    featured_image = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    rating = 4.6,
    review_count = 23,
    price_per_night = 1200000,
    amenities = ARRAY['WiFi gratis', 'River view', 'Eco tour', 'Restaurant', 'Boat service'],
    is_featured = true,
    status = 'active'
WHERE slug = 'malinau-riverfront-lodge';

-- Insert sample bookings (using existing user IDs - you may need to adjust these)
-- First, let's create some sample bookings with the admin user ID
DO $$
DECLARE
    admin_user_id uuid;
    demo_user_id uuid;
    hotel1_id uuid;
    hotel2_id uuid;
    dest1_id uuid;
BEGIN
    -- Get admin user ID
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@explorekaltara.com' LIMIT 1;
    
    -- Get hotel and destination IDs
    SELECT id INTO hotel1_id FROM public.hotels WHERE slug = 'swiss-belhotel-tarakan' LIMIT 1;
    SELECT id INTO hotel2_id FROM public.hotels WHERE slug = 'tarakan-plaza-hotel' LIMIT 1;
    SELECT id INTO dest1_id FROM public.destinations WHERE slug = 'hutan-mangrove-bekantan' LIMIT 1;
    
    IF admin_user_id IS NOT NULL THEN
        -- Insert sample bookings
        INSERT INTO public.bookings (user_id, hotel_id, booking_type, check_in_date, check_out_date, guests, rooms, total_amount, status, payment_status, contact_name, contact_email, contact_phone) VALUES
        (admin_user_id, hotel1_id, 'hotel', CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '9 days', 2, 1, 1700000, 'confirmed', 'paid', 'Admin', 'admin@explorekaltara.com', '081234567890'),
        (admin_user_id, hotel2_id, 'hotel', CURRENT_DATE + INTERVAL '14 days', CURRENT_DATE + INTERVAL '16 days', 1, 1, 1300000, 'pending', 'pending', 'Admin', 'admin@explorekaltara.com', '081234567890'),
        (admin_user_id, NULL, 'destination', CURRENT_DATE + INTERVAL '21 days', CURRENT_DATE + INTERVAL '21 days', 4, 0, 200000, 'confirmed', 'paid', 'Admin', 'admin@explorekaltara.com', '081234567890');
        
        -- Set destination_id for the destination booking
        UPDATE public.bookings SET destination_id = dest1_id WHERE booking_type = 'destination' AND user_id = admin_user_id;
    END IF;
END $$;

-- Insert sample reviews
DO $$
DECLARE
    admin_user_id uuid;
    hotel1_id uuid;
    dest1_id uuid;
    booking1_id uuid;
BEGIN
    -- Get IDs
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@explorekaltara.com' LIMIT 1;
    SELECT id INTO hotel1_id FROM public.hotels WHERE slug = 'swiss-belhotel-tarakan' LIMIT 1;
    SELECT id INTO dest1_id FROM public.destinations WHERE slug = 'hutan-mangrove-bekantan' LIMIT 1;
    SELECT id INTO booking1_id FROM public.bookings WHERE user_id = admin_user_id AND hotel_id = hotel1_id LIMIT 1;
    
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO public.reviews (user_id, hotel_id, booking_id, review_type, rating, title, content, status) VALUES
        (admin_user_id, hotel1_id, booking1_id, 'hotel', 5, 'Pengalaman menginap yang luar biasa!', 'Hotel dengan fasilitas lengkap dan pelayanan yang sangat memuaskan. Staff ramah dan pemandangan laut sangat indah.', 'approved'),
        (admin_user_id, NULL, NULL, 'destination', 4, 'Destinasi alam yang menawan', 'Hutan mangrove yang indah dengan bekantan yang lucu. Sangat cocok untuk edukasi dan rekreasi keluarga.', 'approved');
        
        -- Set destination_id for destination review
        UPDATE public.reviews SET destination_id = dest1_id WHERE review_type = 'destination' AND user_id = admin_user_id;
    END IF;
END $$;

-- Insert sample activity logs
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@explorekaltara.com' LIMIT 1;
    
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, description, metadata) VALUES
        (admin_user_id, 'user_login', 'auth', admin_user_id::text, 'Admin user logged in', '{"ip": "127.0.0.1"}'),
        (admin_user_id, 'booking_created', 'booking', gen_random_uuid()::text, 'New hotel booking created', '{"hotel": "Swiss-Belhotel Tarakan", "amount": 1700000}'),
        (admin_user_id, 'review_submitted', 'review', gen_random_uuid()::text, 'New review submitted for hotel', '{"rating": 5, "hotel": "Swiss-Belhotel Tarakan"}'),
        (admin_user_id, 'destination_viewed', 'destination', gen_random_uuid()::text, 'User viewed destination details', '{"destination": "Hutan Mangrove Bekantan"}'),
        (admin_user_id, 'profile_updated', 'profile', admin_user_id::text, 'User updated profile information', '{"fields": ["preferences"]}');
    END IF;
END $$;

-- Update destination and hotel review counts and ratings
UPDATE public.destinations SET 
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE destination_id = destinations.id AND status = 'approved'),
    rating = (SELECT COALESCE(AVG(rating), 0) FROM public.reviews WHERE destination_id = destinations.id AND status = 'approved');

UPDATE public.hotels SET 
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE hotel_id = hotels.id AND status = 'approved'),
    rating = (SELECT COALESCE(AVG(rating), 0) FROM public.reviews WHERE hotel_id = hotels.id AND status = 'approved');

-- ==============================================
-- ALTERNATIVE: UPDATE QUERIES FOR EXISTING DATA
-- ==============================================
-- Use these queries if you want to update existing records instead of the complex DO blocks above

-- Update sample bookings (if they already exist)
-- Note: You'll need to replace the user_id, hotel_id, and destination_id with actual values from your database

-- UPDATE public.bookings SET 
--     check_in_date = CURRENT_DATE + INTERVAL '7 days',
--     check_out_date = CURRENT_DATE + INTERVAL '9 days',
--     guests = 2,
--     rooms = 1,
--     total_amount = 1700000,
--     status = 'confirmed',
--     payment_status = 'paid',
--     contact_name = 'Admin',
--     contact_email = 'admin@explorekaltara.com',
--     contact_phone = '081234567890'
-- WHERE booking_type = 'hotel' AND user_id = 'YOUR_USER_ID_HERE';

-- Update sample reviews (if they already exist)
-- UPDATE public.reviews SET 
--     rating = 5,
--     title = 'Pengalaman menginap yang luar biasa!',
--     content = 'Hotel dengan fasilitas lengkap dan pelayanan yang sangat memuaskan. Staff ramah dan pemandangan laut sangat indah.',
--     status = 'approved'
-- WHERE review_type = 'hotel' AND user_id = 'YOUR_USER_ID_HERE';

-- Update activity logs (if they already exist)
-- UPDATE public.activity_logs SET 
--     action = 'user_login',
--     entity_type = 'auth',
--     description = 'Admin user logged in',
--     metadata = '{"ip": "127.0.0.1"}'
-- WHERE user_id = 'YOUR_USER_ID_HERE' AND action = 'user_login';

-- Manual update for review counts and ratings (these can be used as-is)
UPDATE public.destinations SET 
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE destination_id = destinations.id AND status = 'approved'),
    rating = (SELECT COALESCE(AVG(rating), 0) FROM public.reviews WHERE destination_id = destinations.id AND status = 'approved');

UPDATE public.hotels SET 
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE hotel_id = hotels.id AND status = 'approved'),
    rating = (SELECT COALESCE(AVG(rating), 0) FROM public.reviews WHERE hotel_id = hotels.id AND status = 'approved');
