import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import destinations from '@/data/destinations.json';

interface DestinationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return destinations.map((destination) => ({
    slug: destination.id,
  }));
}

export async function generateMetadata({ params }: DestinationPageProps) {
  const { slug } = await params;
  const destination = destinations.find((dest) => dest.id === slug);
  
  if (!destination) {
    return {
      title: 'Destinasi Tidak Ditemukan - Explore Kaltara',
    };
  }

  return {
    title: `${destination.name} - Explore Kaltara`,
    description: destination.description,
  };
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { slug } = await params;
  const destination = destinations.find((dest) => dest.id === slug);

  if (!destination) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EK</span>
              </div>
              <span className="text-2xl font-bold text-emerald-800">Explore Kaltara</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/#destinations" className="text-gray-700 hover:text-emerald-600 transition-colors">Destinasi</Link>
              <Link href="/#hotels" className="text-gray-700 hover:text-emerald-600 transition-colors">Hotel</Link>
              <Link href="/#culture" className="text-gray-700 hover:text-emerald-600 transition-colors">Budaya</Link>
            </nav>
          </div>
        </div>
      </header>

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
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute bottom-8 left-8 text-white">
          <div className="inline-block bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
            {destination.category === 'alam' ? 'Wisata Alam' : 'Wisata Budaya'}
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
                {destination.gallery.map((image, index) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${destination.name} ${index + 1}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Fasilitas</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {destination.facilities.map((facility, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    <span className="text-gray-800">{facility}</span>
                  </div>
                ))}
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
                    <span className="font-semibold">{destination.rating}/5</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Harga Tiket</span>
                  <span className="font-semibold text-emerald-600">{destination.ticketPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jam Buka</span>
                  <span className="font-semibold">{destination.openingHours}</span>
                </div>
                <div className="border-t pt-4">
                  <span className="text-gray-600 block mb-2">Waktu Terbaik Berkunjung</span>
                  <span className="text-sm text-gray-800">{destination.bestTimeToVisit}</span>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-100 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lokasi</h3>
              <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm">Peta lokasi akan segera hadir</p>
                  <p className="text-xs mt-1">Lat: {destination.coordinates.lat}, Lng: {destination.coordinates.lng}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-emerald-600 text-white py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors">
                Bagikan Destinasi
              </button>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Destinasi Lainnya di {destination.location}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {destinations
              .filter(dest => dest.location === destination.location && dest.id !== destination.id)
              .slice(0, 3)
              .map((relatedDest) => (
                <Link key={relatedDest.id} href={`/destinations/${relatedDest.id}`} className="group">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative h-48">
                      <Image
                        src={relatedDest.image}
                        alt={relatedDest.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 font-semibold">{relatedDest.rating}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="text-emerald-600 text-sm font-semibold mb-2">{relatedDest.location}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{relatedDest.name}</h3>
                      <p className="text-gray-600 leading-relaxed line-clamp-3">{relatedDest.description}</p>
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
