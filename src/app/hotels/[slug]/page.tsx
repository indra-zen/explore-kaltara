import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PublicDataService } from '@/lib/supabase/public-service';
import type { Hotel } from '@/lib/supabase/types';
import Map from '@/components/Map';
import Header from '@/components/Header';
import WishlistButton from '@/components/WishlistButton';
import HotelBookingForm from './HotelBookingForm';
import { getFacilityIcon } from '@/lib/facility-icons';

interface HotelPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateStaticParams() {
  try {
    const result = await PublicDataService.getHotels();
    // Only generate a few key pages at build time, others will be generated on-demand
    return result.data.slice(0, 5).map((hotel: Hotel) => ({
      slug: hotel.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: HotelPageProps) {
  try {
    const { slug } = await params;
    const result = await PublicDataService.getHotelBySlug(slug);
    const hotel = result.data;
    
    if (!hotel) {
      return {
        title: 'Hotel Tidak Ditemukan - Explore Kaltara',
      };
    }

    return {
      title: `${hotel.name} - Explore Kaltara`,
      description: hotel.description || `Menginap di ${hotel.name} di Kalimantan Utara`,
    };
  } catch (error) {
    return {
      title: 'Hotel Tidak Ditemukan - Explore Kaltara',
    };
  }
}

export default async function HotelPage({ params }: HotelPageProps) {
  try {
    const { slug } = await params;
    const result = await PublicDataService.getHotelBySlug(slug);
    const hotel = result.data;

    if (!hotel) {
      notFound();
    }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-500 hover:text-emerald-600">Beranda</Link>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <span className="text-gray-900 font-medium">Hotel</span>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <span className="text-emerald-600 font-medium">{hotel.name}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px]">
        <Image
          src={hotel.featured_image || (hotel.images && hotel.images[0]) || '/images/hutan-mangrove-bekantan-1.jpg'}
          alt={hotel.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Wishlist Button */}
        <div className="absolute top-8 right-8">
          <WishlistButton 
            item={{
              id: hotel.id,
              name: hotel.name,
              type: 'hotel',
              location: hotel.location,
              image: hotel.featured_image || (hotel.images && hotel.images[0]) || '/images/hutan-mangrove-bekantan-1.jpg',
              rating: hotel.rating || 0,
              description: hotel.description || '',
              priceRange: hotel.price_per_night ? `IDR ${hotel.price_per_night.toLocaleString()}` : 'Contact for price'
            }}
            showText={true}
          />
        </div>
        
        <div className="absolute bottom-8 left-8 text-white">
          <div className="inline-block bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
            {hotel.star_rating ? `${hotel.star_rating} STAR HOTEL` : 'HOTEL'}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-2">{hotel.name}</h1>
          <p className="text-xl text-gray-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {hotel.location}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-gray-900">Tentang Hotel</h2>              <div className="flex items-center bg-emerald-100 px-4 py-2 rounded-full">
                <span className="text-yellow-500 text-lg mr-1">★</span>
                <span className="font-bold text-emerald-800">{hotel.rating || 0}</span>
                <span className="text-gray-600 ml-1">({hotel.review_count || 0} ulasan)</span>
              </div>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              {hotel.description || 'Hotel yang nyaman untuk menginap di Kalimantan Utara.'}
            </p>
            <p className="text-gray-600">📍 {hotel.location}</p>
          </div>

          {/* Gallery */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Galeri Foto</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {hotel.images && hotel.images.length > 0 ? 
                hotel.images.map((image: string, index: number) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${hotel.name} ${index + 1}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )) : (
                  <div className="col-span-3 text-center py-8 text-gray-500">
                    Galeri foto belum tersedia
                  </div>
                )
              }
            </div>
          </div>

          {/* Facilities */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Fasilitas Hotel</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {hotel.amenities && hotel.amenities.length > 0 ? 
                hotel.amenities.map((amenity: string, index: number) => {
                  const IconComponent = getFacilityIcon(amenity);
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <IconComponent className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-800">{amenity}</span>
                    </div>
                  );
                }) : (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    Informasi fasilitas belum tersedia
                  </div>
                )
              }
            </div>
          </div>

            {/* Amenities Icons */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Amenitas</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {hotel.amenities && hotel.amenities.includes('WiFi') && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">📶</div>
                    <span className="text-sm text-gray-700">WiFi</span>
                  </div>
                )}
                {hotel.amenities && hotel.amenities.includes('Pool') && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">🏊</div>
                    <span className="text-sm text-gray-700">Pool</span>
                  </div>
                )}
                {hotel.amenities && hotel.amenities.includes('Gym') && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">💪</div>
                    <span className="text-sm text-gray-700">Gym</span>
                  </div>
                )}
                {hotel.amenities && hotel.amenities.includes('Restaurant') && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">🍽️</div>
                    <span className="text-sm text-gray-700">Restaurant</span>
                  </div>
                )}
                {hotel.amenities && hotel.amenities.includes('Parking') && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">🅿️</div>
                    <span className="text-sm text-gray-700">Parking</span>
                  </div>
                )}
                {hotel.amenities && hotel.amenities.includes('Airport Shuttle') && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">🚐</div>
                    <span className="text-sm text-gray-700">Shuttle</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <HotelBookingForm hotel={hotel} />

            {/* Hotel Info */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Informasi Hotel</h3>
              <div className="space-y-3">
                {hotel.star_rating && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bintang</span>
                    <span className="font-semibold">{hotel.star_rating} Bintang</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-semibold">{hotel.rating || 0}/5</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ulasan</span>
                  <span className="font-semibold">{hotel.review_count || 0} reviews</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-gray-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lokasi</h3>
              {hotel.latitude && hotel.longitude ? (
                <>
                  <Map
                    center={[hotel.latitude, hotel.longitude]}
                    zoom={15}
                    markers={[{
                      position: [hotel.latitude, hotel.longitude],
                      title: hotel.name,
                      description: hotel.location,
                      link: `#`
                    }]}
                    height="300px"
                  />
                  <div className="mt-3 text-sm text-gray-600">
                    <p>📍 {hotel.location}</p>
                    <p className="text-xs mt-1">Koordinat: {hotel.latitude}, {hotel.longitude}</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>📍 {hotel.location}</p>
                  <p className="text-sm">Peta tidak tersedia</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Hotels */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Hotel Lainnya di {hotel.city}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* For now, we'll show a placeholder since we need to fetch related hotels */}
            <div className="text-center py-8 col-span-3">
              <div className="text-gray-500">
                <p>Hotel terkait akan ditampilkan di sini</p>
                <Link href="/hotels" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                  Lihat Semua Hotel →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
  } catch (error) {
    console.error('Error loading hotel:', error);
    notFound();
  }
}
