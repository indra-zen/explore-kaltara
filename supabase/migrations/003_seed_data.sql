-- Seed data for testing the admin dashboard
-- Run this after the main migration to populate test data

-- Insert some test destinations
INSERT INTO public.destinations (
  name, slug, description, category, location, city, 
  latitude, longitude, images, featured_image, rating, 
  review_count, price_range, facilities, is_featured, status
) VALUES 
(
  'Hutan Mangrove dan Konservasi Bekantan',
  'hutan-mangrove-bekantan-tarakan',
  'Kawasan hutan mangrove yang luas, menjadi habitat alami bagi bekantan (kera hidung panjang) dan berbagai jenis burung. Terdapat jembatan kayu yang memudahkan pengunjung untuk menyusuri hutan dan mengamati satwa liar.',
  'nature',
  'Tarakan',
  'Tarakan',
  3.3,
  117.6,
  ARRAY['/images/hutan-mangrove-bekantan-1.jpg', '/images/hutan-mangrove-bekantan-2.jpg'],
  '/images/hutan-mangrove-bekantan-1.jpg',
  4.5,
  23,
  'budget',
  ARRAY['Jembatan kayu', 'Area parkir', 'Toilet', 'Warung makan'],
  true,
  'active'
),
(
  'Museum Batiwakkal',
  'museum-batiwakkal',
  'Museum yang menyimpan koleksi sejarah dan budaya suku Dayak Kaltara, termasuk artefak, pakaian adat, dan peralatan tradisional.',
  'culture',
  'Tanjung Selor',
  'Tanjung Selor',
  2.8,
  117.4,
  ARRAY['/images/museum-batiwakkal-1.jpg'],
  '/images/museum-batiwakkal-1.jpg',
  4.2,
  15,
  'budget',
  ARRAY['Pemandu wisata', 'AC', 'Toilet', 'Parkir'],
  false,
  'active'
),
(
  'Pantai Amal',
  'pantai-amal',
  'Pantai dengan pasir putih dan air laut yang jernih, cocok untuk berenang dan olahraga air. Terdapat fasilitas cottage dan restoran.',
  'nature',
  'Tarakan',
  'Tarakan',
  3.35,
  117.65,
  ARRAY['/images/pantai-amal-1.jpg'],
  '/images/pantai-amal-1.jpg',
  4.3,
  42,
  'mid-range',
  ARRAY['Cottage', 'Restoran', 'Penyewaan alat selam', 'Parkir'],
  true,
  'active'
);

-- Insert some test hotels
INSERT INTO public.hotels (
  name, slug, description, location, city, 
  latitude, longitude, images, featured_image, rating, 
  review_count, price_per_night, currency, facilities, 
  room_types, is_featured, status
) VALUES 
(
  'Swiss-Belhotel Tarakan',
  'swiss-belhotel-tarakan',
  'Hotel berbintang 4 dengan fasilitas lengkap di pusat kota Tarakan. Menyediakan kamar yang nyaman dengan pemandangan kota dan laut.',
  'Jl. Yos Sudarso No. 1',
  'Tarakan',
  3.32,
  117.63,
  ARRAY['/images/swiss-belhotel-1.jpg'],
  '/images/swiss-belhotel-1.jpg',
  4.4,
  156,
  850000,
  'IDR',
  ARRAY['WiFi gratis', 'Kolam renang', 'Fitness center', 'Restaurant', 'Room service', 'Laundry'],
  '{"deluxe": {"name": "Deluxe Room", "price": 850000}, "suite": {"name": "Executive Suite", "price": 1200000}}'::jsonb,
  true,
  'active'
),
(
  'Hotel Tarakan Plaza',
  'hotel-tarakan-plaza',
  'Hotel bisnis dengan lokasi strategis di pusat kota, dilengkapi dengan meeting room dan business center.',
  'Jl. Mulawarman No. 15',
  'Tarakan',
  3.31,
  117.62,
  ARRAY['/images/tarakan-plaza-1.jpg'],
  '/images/tarakan-plaza-1.jpg',
  4.1,
  89,
  650000,
  'IDR',
  ARRAY['WiFi gratis', 'Meeting room', 'Restaurant', 'Parkir', 'AC'],
  '{"standard": {"name": "Standard Room", "price": 650000}, "superior": {"name": "Superior Room", "price": 750000}}'::jsonb,
  false,
  'active'
),
(
  'Gusher Hotel Tanjung Selor',
  'gusher-hotel-tanjung-selor',
  'Hotel modern dengan fasilitas lengkap di Tanjung Selor, ibukota Kalimantan Utara.',
  'Jl. Kesuma Bangsa No. 8',
  'Tanjung Selor',
  2.83,
  117.41,
  ARRAY['/images/gusher-hotel-1.jpg'],
  '/images/gusher-hotel-1.jpg',
  4.2,
  67,
  720000,
  'IDR',
  ARRAY['WiFi gratis', 'Restaurant', 'Meeting room', 'Laundry', 'Parkir'],
  '{"standard": {"name": "Standard Room", "price": 720000}, "deluxe": {"name": "Deluxe Room", "price": 850000}}'::jsonb,
  false,
  'active'
);

-- You can manually create test user profiles in the Supabase Auth dashboard,
-- then insert some test bookings and reviews if needed
