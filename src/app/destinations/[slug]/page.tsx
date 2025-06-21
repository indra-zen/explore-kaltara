import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PublicDataService } from '@/lib/supabase/public-service';
import type { Destination } from '@/lib/supabase/types';
import Map from '@/components/Map';
import Header from '@/components/Header';
import WishlistButton from '@/components/WishlistButton';
import WeatherWidget from '@/components/WeatherWidget';

interface DestinationPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateStaticParams() {
  try {
    const result = await PublicDataService.getDestinations();
    // Only generate a few key pages at build time, others will be generated on-demand
    return result.data.slice(0, 5).map((destination: Destination) => ({
      slug: destination.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: DestinationPageProps) {
  try {
    const { slug } = await params;
    const result = await PublicDataService.getDestinations();
    const destination = result.data.find((dest: Destination) => dest.slug === slug);
    
    if (!destination) {
      return {
        title: 'Destinasi Tidak Ditemukan - Explore Kaltara',
      };
    }

    return {
      title: `${destination.name} - Explore Kaltara`,
      description: destination.description || `Jelajahi ${destination.name} di Kalimantan Utara`,
    };
  } catch (error) {
    return {
      title: 'Destinasi Tidak Ditemukan - Explore Kaltara',
    };
  }
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  try {
    const { slug } = await params;
    
    // Fetch fresh data from database on each request (for ISR)
    const result = await PublicDataService.getDestinationBySlug(slug);
    const destination = result.data;

    if (!destination) {
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
                <span className="text-gray-900 font-medium">Destinasi</span>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <span className="text-emerald-600 font-medium">{destination.name}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px]">
        <Image
          src={destination.featured_image || (destination.images && destination.images[0]) || '/images/hutan-mangrove-bekantan-1.jpg'}
          alt={destination.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Wishlist Button */}
        <div className="absolute top-8 right-8">
          <WishlistButton 
            item={{
              id: destination.id,
              name: destination.name,
              type: 'destination',
              location: destination.location,
              image: destination.featured_image || (destination.images && destination.images[0]) || '/images/hutan-mangrove-bekantan-1.jpg',
              rating: destination.rating || 0,
              description: destination.description || ''
            }}
            showText={true}
          />
        </div>
        
        <div className="absolute bottom-8 left-8 text-white">
          <div className="inline-block bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
            {destination.category === 'nature' ? 'Wisata Alam' : 
             destination.category === 'culture' ? 'Wisata Budaya' :
             destination.category === 'history' ? 'Wisata Sejarah' :
             destination.category === 'adventure' ? 'Wisata Petualangan' : 'Wisata'}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-2">{destination.name}</h1>
          <p className="text-xl text-gray-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {destination.location}
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Tentang Destinasi</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{destination.description}</p>
            </div>

            {/* Gallery */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Galeri Foto</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {destination.images && destination.images.length > 0 ? 
                  destination.images.map((image: string, index: number) => (
                    <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`${destination.name} ${index + 1}`}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )) : (
                    <div className="col-span-3 text-center py-8 text-gray-500">
                      Belum ada foto galeri tersedia
                    </div>
                  )
                }
              </div>
            </div>

            {/* Facilities */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Fasilitas</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {destination.facilities && destination.facilities.length > 0 ? 
                  destination.facilities.map((facility: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                      <span className="text-gray-800">{facility}</span>
                    </div>
                  )) : (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                      Informasi fasilitas belum tersedia
                    </div>
                  )
                }
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Info */}
            <div className="bg-emerald-50 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Informasi Penting</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-semibold">{destination.rating || 0}/5</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kategori</span>
                  <span className="font-semibold text-emerald-600 capitalize">
                    {destination.price_range === 'free' ? 'Gratis' :
                     destination.price_range === 'budget' ? 'Murah' :
                     destination.price_range === 'mid-range' ? 'Sedang' :
                     destination.price_range === 'expensive' ? 'Mahal' : 'Hubungi kami'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jam Buka</span>
                  <span className="font-semibold">
                    {destination.opening_hours ? 
                      (typeof destination.opening_hours === 'string' ? 
                        destination.opening_hours : 
                        'Cek info terbaru') : 
                      '24 Jam'}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <span className="text-gray-600 block mb-2">Kota</span>
                  <span className="text-sm text-gray-800">{destination.city}</span>
                </div>
              </div>
            </div>

            {/* Weather Widget */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cuaca Terkini</h3>
              <WeatherWidget location={destination.city} />
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-100 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lokasi</h3>
              {destination.latitude && destination.longitude ? (
                <Map
                  center={[destination.latitude, destination.longitude]}
                  zoom={13}
                  markers={[{
                    position: [destination.latitude, destination.longitude],
                    title: destination.name,
                    description: destination.location,
                    link: `#`
                  }]}
                  height="300px"
                />
              ) : (
                <div className="h-72 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Lokasi peta tidak tersedia</span>
                </div>
              )}
              <div className="mt-3 text-sm text-gray-600">
                {destination.latitude && destination.longitude ? (
                  <p>📍 Koordinat: {destination.latitude}, {destination.longitude}</p>
                ) : (
                  <p>📍 {destination.location}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link 
                href={`/booking?item=${destination.id}&type=destination`}
                className="block w-full bg-emerald-600 text-white py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors text-center"
              >
                Pesan Aktivitas
              </Link>
              <button className="w-full border-2 border-emerald-600 text-emerald-600 py-3 rounded-full font-semibold hover:bg-emerald-600 hover:text-white transition-colors">
                Simpan ke Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Destinations */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Destinasi Lainnya di {destination.city}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* For now, we'll show a placeholder since we need to fetch related destinations */}
            <div className="text-center py-8 col-span-3">
              <div className="text-gray-500">
                <p>Destinasi terkait akan ditampilkan di sini</p>
                <Link href="/destinations" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                  Lihat Semua Destinasi →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
  } catch (error) {
    console.error('Error loading destination:', error);
    notFound();
  }
}
