import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import destinations from '@/data/destinations.json';
import hotels from '@/data/hotels.json';

export default function Home() {
  // Get featured destinations from JSON data
  const featuredDestinations = [
    destinations.find(d => d.id === "taman-nasional-kayan-mentarang"),
    destinations.find(d => d.id === "hutan-mangrove-bekantan-tarakan"), 
    destinations.find(d => d.id === "air-terjun-tujuh-tingkat")
  ].filter((dest): dest is NonNullable<typeof dest> => dest !== undefined);

  // Get featured hotels from JSON data  
  const featuredHotels = [
    hotels.find(h => h.id === "swiss-belhotel-tarakan"),
    hotels.find(h => h.id === "luminor-hotel-tanjung-selor"),
    hotels.find(h => h.id === "hotel-dcalia-malinau")
  ].filter((hotel): hotel is NonNullable<typeof hotel> => hotel !== undefined);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop"
            alt="Kalimantan Utara Nature"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Jelajahi Keajaiban
            <span className="block text-emerald-400">Kalimantan Utara</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Temukan pesona alam liar, budaya Dayak yang kaya, dan pengalaman tak terlupakan di ujung utara Borneo
          </p>            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/destinations" className="bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-all transform hover:scale-105">
                Mulai Petualangan
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all">
                Lihat Video
              </button>
            </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section id="destinations" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Destinasi Unggulan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Jelajahi keindahan alam dan budaya Kalimantan Utara yang menakjubkan
            </p>
            <Link href="/destinations" className="inline-flex items-center bg-emerald-600 text-white px-6 py-3 rounded-full hover:bg-emerald-700 transition-colors">
              Lihat Semua Destinasi
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map((destination, index) => (
              <Link key={index} href={`/destinations/${destination.id}`} className="group">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 font-semibold">{destination.rating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-emerald-600 text-sm font-semibold mb-2">{destination.location}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{destination.name}</h3>
                    <p className="text-gray-600 leading-relaxed">{destination.description}</p>
                    <div className="mt-4 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                      Selengkapnya →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hotels Section */}
      <section id="hotels" className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Hotel Terbaik
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Nikmati kenyamanan menginap di hotel-hotel pilihan terbaik
            </p>
            <Link href="/hotels" className="inline-flex items-center bg-emerald-600 text-white px-6 py-3 rounded-full hover:bg-emerald-700 transition-colors">
              Lihat Semua Hotel
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHotels.map((hotel, index) => (
              <Link key={index} href={`/hotels/${hotel.id}`} className="group">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="relative h-48">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{hotel.name}</h3>
                        <p className="text-emerald-600 text-sm">{hotel.location}</p>
                      </div>
                      <div className="flex items-center bg-emerald-100 px-2 py-1 rounded-full">
                        <span className="text-yellow-500 text-sm">★</span>
                        <span className="ml-1 text-sm font-semibold text-emerald-800">{hotel.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-600 font-bold">{hotel.priceRange.split(' - ')[0]}</span>
                      <div className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                        Lihat Detail
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section id="culture" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Warisan Budaya Dayak
              </h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Selami kekayaan budaya suku Dayak dengan mengunjungi desa-desa tradisional, 
                menyaksikan upacara adat, dan belajar tentang kerajinan tangan yang telah 
                diwariskan turun temurun.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Desa Wisata Budaya Dayak Setulang</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Rumah Adat Baloy Tidung</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Museum Rumah Bundar</span>
                </div>
              </div>
              <button className="mt-8 bg-emerald-600 text-white px-8 py-3 rounded-full hover:bg-emerald-700 transition-colors">
                Jelajahi Budaya
              </button>
            </div>
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=500&fit=crop"
                alt="Budaya Dayak"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">25+</div>
              <div className="text-emerald-100">Destinasi Wisata</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-emerald-100">Hotel & Penginapan</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5</div>
              <div className="text-emerald-100">Kabupaten/Kota</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">4.5★</div>
              <div className="text-emerald-100">Rating Rata-rata</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Jelajahi dengan Peta
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Temukan lokasi destinasi wisata dan hotel secara visual dengan peta interaktif kami
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mt-1">
                    <span className="text-2xl">🗺️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Peta Interaktif</h3>
                    <p className="text-gray-600">Lihat semua lokasi destinasi dan hotel dalam satu tampilan peta yang mudah digunakan</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mt-1">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Lokasi Akurat</h3>
                    <p className="text-gray-600">Koordinat GPS yang akurat untuk setiap destinasi dan hotel</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mt-1">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Filter Lokasi</h3>
                    <p className="text-gray-600">Filter berdasarkan kabupaten/kota untuk memudahkan perencanaan perjalanan</p>
                  </div>
                </div>
              </div>

              <Link href="/map" className="inline-flex items-center bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-all transform hover:scale-105 mt-8">
                Buka Peta Interaktif
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-8 text-white">
                <div className="text-center">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-2xl font-bold mb-4">Peta Kalimantan Utara</h3>
                  <p className="text-emerald-100 mb-6">Jelajahi {featuredDestinations.length + featuredHotels.length}+ lokasi wisata dan hotel</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="text-2xl font-bold">{featuredDestinations.length}+</div>
                      <div className="text-sm">Destinasi</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="text-2xl font-bold">{featuredHotels.length}+</div>
                      <div className="text-sm">Hotel</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Features Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Fitur Terbaru
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Nikmati pengalaman baru dengan fitur-fitur canggih untuk merencanakan perjalanan Anda
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Trip Planner Feature */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Trip Planner</h3>
                <p className="text-gray-600 mb-6">
                  Rencanakan perjalanan Anda dengan detail. Atur itinerary harian, kelola budget, 
                  dan simpan rencana perjalanan untuk referensi di masa depan.
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Perencanaan aktivitas harian yang detail</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Manajemen budget dan tracking biaya</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Export dan sharing rencana perjalanan</span>
                </div>
              </div>

              <Link href="/trip-planner" className="block w-full bg-emerald-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
                Mulai Merencanakan Trip
              </Link>
            </div>

            {/* Weather Widget Feature */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Informasi Cuaca</h3>
                <p className="text-gray-600 mb-6">
                  Dapatkan informasi cuaca terkini untuk semua lokasi di Kaltara. 
                  Rencanakan aktivitas outdoor dengan data cuaca yang akurat dan prediksi 4 hari ke depan.
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Cuaca real-time untuk 5 kabupaten/kota</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Prakiraan cuaca 4 hari ke depan</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Tips aktivitas berdasarkan cuaca</span>
                </div>
              </div>

              <Link href="/weather" className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all">
                Lihat Info Cuaca
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Siap Memulai Petualangan?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Dapatkan panduan lengkap dan penawaran terbaik untuk liburan impian Anda di Kalimantan Utara
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-all transform hover:scale-105">
              Rencanakan Trip
            </button>
            <button className="border-2 border-emerald-400 text-emerald-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-400 hover:text-gray-900 transition-all">
              Hubungi Kami
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EK</span>
                </div>
                <span className="text-xl font-bold">Explore Kaltara</span>
              </div>
              <p className="text-gray-400">
                Platform terdepan untuk menjelajahi keindahan Kalimantan Utara
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Destinasi</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Tarakan</li>
                <li>Malinau</li>
                <li>Nunukan</li>
                <li>Bulungan</li>
                <li>Tana Tidung</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Layanan</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Tour Guide</li>
                <li>Booking Hotel</li>
                <li>Paket Wisata</li>
                <li>Transportasi</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Kontak</h3>
              <ul className="space-y-2 text-gray-400">
                <li>info@explorekaltara.com</li>
                <li>+62 XXX XXXX XXXX</li>
                <li>Tanjung Selor, Kaltara</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Explore Kaltara. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
