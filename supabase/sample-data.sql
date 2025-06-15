-- Sample data for admin dashboard testing
-- Run this in Supabase Dashboard → SQL Editor after creating the tables

-- Insert sample destinations
INSERT INTO public.destinations (name, slug, description, category, location, city, latitude, longitude, images, featured_image, rating, review_count, price_range, facilities, is_featured, status) VALUES
('Hutan Mangrove Bekantan', 'hutan-mangrove-bekantan', 'Hutan mangrove yang menjadi habitat alami bekantan dan berbagai satwa endemik Kalimantan.', 'nature', 'Tarakan, Kalimantan Utara', 'Tarakan', 3.3272, 117.5914, ARRAY['/images/hutan-mangrove-bekantan-1.jpg', '/images/hutan-mangrove-bekantan-2.jpg'], '/images/hutan-mangrove-bekantan-1.jpg', 4.5, 89, 'budget', ARRAY['Jembatan kayu', 'Menara pandang', 'Toilet', 'Area parkir'], true, 'active'),

('Pantai Amal', 'pantai-amal', 'Pantai indah dengan pemandangan sunset yang memukau dan fasilitas lengkap untuk wisata keluarga.', 'nature', 'Tarakan, Kalimantan Utara', 'Tarakan', 3.2743, 117.6125, ARRAY['/images/pantai-amal-1.jpg', '/images/pantai-amal-2.jpg'], '/images/pantai-amal-1.jpg', 4.2, 67, 'budget', ARRAY['Gazebo', 'Area bermain', 'Warung makan', 'Toilet'], true, 'active'),

('Pulau Bunyu', 'pulau-bunyu', 'Pulau kecil dengan pantai berpasir putih dan air laut yang jernih, cocok untuk snorkeling.', 'nature', 'Bunyu, Kalimantan Utara', 'Bunyu', 3.4612, 117.8734, ARRAY['/images/pulau-bunyu-1.jpg'], '/images/pulau-bunyu-1.jpg', 4.0, 45, 'mid-range', ARRAY['Penyewaan alat snorkel', 'Perahu', 'Homestay'], false, 'active'),

('Taman Nasional Kayan Mentarang', 'taman-nasional-kayan-mentarang', 'Taman nasional dengan keanekaragaman hayati tinggi dan budaya Dayak yang masih lestari.', 'nature', 'Malinau, Kalimantan Utara', 'Malinau', 2.9167, 116.0000, ARRAY['/images/kayan-mentarang-1.jpg'], '/images/kayan-mentarang-1.jpg', 4.7, 34, 'expensive', ARRAY['Pemandu wisata', 'Trekking trail', 'Camping ground'], false, 'active'),

('Museum Baloy Mayo', 'museum-baloy-mayo', 'Museum yang menampilkan sejarah dan budaya masyarakat Tidung dan Dayak di Kalimantan Utara.', 'culture', 'Tanjung Selor, Kalimantan Utara', 'Tanjung Selor', 2.8375, 117.3542, ARRAY['/images/museum-baloy-mayo-1.jpg'], '/images/museum-baloy-mayo-1.jpg', 3.8, 28, 'budget', ARRAY['Koleksi artefak', 'Pemandu museum', 'Ruang audio visual'], false, 'active');

-- Insert sample hotels
INSERT INTO public.hotels (name, slug, description, star_rating, location, city, latitude, longitude, images, featured_image, rating, review_count, price_per_night, amenities, is_featured, status) VALUES
('Swiss-Belhotel Tarakan', 'swiss-belhotel-tarakan', 'Hotel bintang 4 dengan fasilitas modern dan pemandangan laut yang indah di pusat kota Tarakan.', 4, 'Jl. Yos Sudarso No. 1, Tarakan', 'Tarakan', 3.3017, 117.6386, ARRAY['/images/swiss-belhotel-1.jpg', '/images/swiss-belhotel-2.jpg'], '/images/swiss-belhotel-1.jpg', 4.3, 156, 850000, ARRAY['WiFi gratis', 'Kolam renang', 'Fitness center', 'Restaurant', 'Room service', 'Spa'], true, 'active'),

('Hotel Perdana Tarakan', 'hotel-perdana-tarakan', 'Hotel nyaman dengan harga terjangkau di pusat kota Tarakan, dekat dengan berbagai tempat wisata.', 3, 'Jl. Mulawarman No. 15, Tarakan', 'Tarakan', 3.2987, 117.6354, ARRAY['/images/hotel-perdana-1.jpg'], '/images/hotel-perdana-1.jpg', 3.9, 89, 450000, ARRAY['WiFi gratis', 'AC', 'TV', 'Restaurant', 'Laundry'], false, 'active'),

('Tarakan Plaza Hotel', 'tarakan-plaza-hotel', 'Hotel bisnis dengan fasilitas lengkap dan lokasi strategis di pusat perdagangan Tarakan.', 3, 'Jl. Sudirman No. 38, Tarakan', 'Tarakan', 3.3043, 117.6401, ARRAY['/images/tarakan-plaza-1.jpg'], '/images/tarakan-plaza-1.jpg', 4.0, 112, 650000, ARRAY['WiFi gratis', 'Business center', 'Meeting room', 'Restaurant', 'Parking'], true, 'active'),

('Green Garden Hotel', 'green-garden-hotel', 'Hotel ramah lingkungan dengan taman yang asri dan suasana tenang untuk liburan keluarga.', 2, 'Jl. Pantai Amal, Tarakan', 'Tarakan', 3.2756, 117.6089, ARRAY['/images/green-garden-1.jpg'], '/images/green-garden-1.jpg', 3.7, 67, 350000, ARRAY['WiFi gratis', 'Taman', 'Restaurant', 'Playground'], false, 'active'),

('Malinau Riverfront Lodge', 'malinau-riverfront-lodge', 'Lodge eksklusif di tepi sungai dengan pemandangan alam yang spektakuler dan pengalaman eco-tourism.', 4, 'Jl. Sungai Malinau, Malinau', 'Malinau', 2.5833, 116.3833, ARRAY['/images/malinau-lodge-1.jpg'], '/images/malinau-lodge-1.jpg', 4.6, 23, 1200000, ARRAY['WiFi gratis', 'River view', 'Eco tour', 'Restaurant', 'Boat service'], true, 'active');

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
