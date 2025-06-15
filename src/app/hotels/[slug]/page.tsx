import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import hotels from '@/data/hotels.json';
import Map from '@/components/Map';
import Header from '@/components/Header';
import WishlistButton from '@/components/WishlistButton';
import HotelBookingForm from './HotelBookingForm';

interface HotelPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return hotels.map((hotel) => ({
    slug: hotel.id,
  }));
}

export async function generateMetadata({ params }: HotelPageProps) {
  const { slug } = await params;
  const hotel = hotels.find((h) => h.id === slug);
  
  if (!hotel) {
    return {
      title: 'Hotel Tidak Ditemukan - Explore Kaltara',
    };
  }

  return {
    title: `${hotel.name} - Explore Kaltara`,
    description: hotel.description,
  };
}

export default async function HotelPage({ params }: HotelPageProps) {
  const { slug } = await params;
  const hotel = hotels.find((h) => h.id === slug);

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
          src={hotel.image}
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
              image: hotel.image,
              rating: hotel.rating,
              description: hotel.description,
              priceRange: hotel.priceRange
            }}
            showText={true}
          />
        </div>
        
        <div className="absolute bottom-8 left-8 text-white">
          <div className="inline-block bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
            {hotel.category.replace('-', ' ').toUpperCase()}
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
                <h2 className="text-3xl font-bold text-gray-900">Tentang Hotel</h2>
                <div className="flex items-center bg-emerald-100 px-4 py-2 rounded-full">
                  <span className="text-yellow-500 text-lg mr-1">★</span>
                  <span className="font-bold text-emerald-800">{hotel.rating}</span>
                  <span className="text-gray-600 ml-1">({hotel.reviewCount} ulasan)</span>
                </div>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">{hotel.description}</p>
              <p className="text-gray-600">📍 {hotel.address}</p>
            </div>

            {/* Gallery */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Galeri Foto</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {hotel.gallery.map((image: string, index: number) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${hotel.name} ${index + 1}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Fasilitas Hotel</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {hotel.facilities.map((facility: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    <span className="text-gray-800">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Icons */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Amenitas</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {hotel.amenities.wifi && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">📶</div>
                    <span className="text-sm text-gray-700">WiFi</span>
                  </div>
                )}
                {hotel.amenities.pool && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">🏊</div>
                    <span className="text-sm text-gray-700">Pool</span>
                  </div>
                )}
                {hotel.amenities.gym && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">💪</div>
                    <span className="text-sm text-gray-700">Gym</span>
                  </div>
                )}
                {hotel.amenities.restaurant && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">🍽️</div>
                    <span className="text-sm text-gray-700">Restaurant</span>
                  </div>
                )}
                {hotel.amenities.parking && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">🅿️</div>
                    <span className="text-sm text-gray-700">Parking</span>
                  </div>
                )}
                {hotel.amenities.airportShuttle && (
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
                <div className="flex justify-between">
                  <span className="text-gray-600">Kategori</span>
                  <span className="font-semibold">{hotel.category.replace('-', ' ').toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-semibold">{hotel.rating}/5</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ulasan</span>
                  <span className="font-semibold">{hotel.reviewCount} reviews</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-gray-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lokasi</h3>
              <Map
                center={[hotel.coordinates.lat, hotel.coordinates.lng]}
                zoom={15}
                markers={[{
                  position: [hotel.coordinates.lat, hotel.coordinates.lng],
                  title: hotel.name,
                  description: hotel.address,
                  link: `#`
                }]}
                height="300px"
              />
              <div className="mt-3 text-sm text-gray-600">
                <p>📍 {hotel.address}</p>
                <p className="text-xs mt-1">Koordinat: {hotel.coordinates.lat}, {hotel.coordinates.lng}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Hotels */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Hotel Lainnya di {hotel.location}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {hotels
              .filter(h => h.location === hotel.location && h.id !== hotel.id)
              .slice(0, 3)
              .map((relatedHotel) => (
                <Link key={relatedHotel.id} href={`/hotels/${relatedHotel.id}`} className="group">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative h-48">
                      <Image
                        src={relatedHotel.image}
                        alt={relatedHotel.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{relatedHotel.name}</h3>
                          <p className="text-emerald-600 text-sm">{relatedHotel.location}</p>
                        </div>
                        <div className="flex items-center bg-emerald-100 px-2 py-1 rounded-full">
                          <span className="text-yellow-500 text-sm">★</span>
                          <span className="ml-1 text-sm font-semibold text-emerald-800">{relatedHotel.rating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-600 font-bold">{relatedHotel.priceRange.split(' - ')[0]}</span>
                        <span className="text-gray-500 text-sm">per malam</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
