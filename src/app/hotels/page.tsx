'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import WishlistButton from '@/components/WishlistButton';
import { SkeletonGrid } from '@/components/SkeletonCards';
import { SectionLoading } from '@/components/LoadingState';
import { PublicDataService } from '@/lib/supabase/public-service';
import type { Hotel } from '@/lib/supabase/types';

export default function HotelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000000);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [dataSource, setDataSource] = useState<'database' | 'fallback'>('database');
  const [error, setError] = useState<string | null>(null);

  // Load hotels data
  useEffect(() => {
    const loadHotels = async () => {
      try {
        setIsLoading(true);
        const result = await PublicDataService.getHotels();
        setHotels(result.data);
        setDataSource(result.fromFallback ? 'fallback' : 'database');
        setError(null);
      } catch (err) {
        console.error('Error loading hotels:', err);
        setError('Failed to load hotels');
        setHotels([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadHotels();
  }, []);

  // Get unique locations and categories
  const locations = [...new Set(hotels.map(h => h.city))];
  const categories = ['1', '2', '3', '4', '5']; // Star ratings as categories

  // Extract price for filtering
  const getHotelPrice = (hotel: Hotel) => {
    return hotel.price_per_night || 0;
  };

  // Filtered hotels with loading states
  const filteredHotels = useMemo(() => {
    const filtered = hotels.filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (hotel.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation = selectedLocation === 'all' || hotel.city === selectedLocation;
      const matchesCategory = selectedCategory === 'all' || (hotel.star_rating?.toString() === selectedCategory);
      const matchesRating = (hotel.rating || 0) >= minRating;
      const hotelPrice = getHotelPrice(hotel);
      const matchesPrice = hotelPrice <= maxPrice;

      return matchesSearch && matchesLocation && matchesCategory && matchesRating && matchesPrice;
    });

    return filtered;
  }, [searchQuery, selectedLocation, selectedCategory, minRating, maxPrice, hotels]);

  // Handle filtering state updates
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedLocation, selectedCategory, minRating, maxPrice]);

  const formatPrice = (price: number) => {
    return `IDR ${(price / 1000).toFixed(0)}K`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <div className="bg-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Semua Hotel & Penginapan</h1>
          <p className="text-xl text-emerald-100">Temukan akomodasi terbaik di Kalimantan Utara</p>
          <p className="text-emerald-200 mt-2">Ditemukan {filteredHotels.length} hotel</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Filter Hotel</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cari Hotel</label>
                <input
                  type="text"
                  placeholder="Nama hotel atau lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">Semua Lokasi</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating Bintang</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">Semua Rating</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category} Bintang
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating Minimal: {minRating.toFixed(1)} ⭐
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>2.5</span>
                  <span>5</span>
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga Maksimal: {formatPrice(maxPrice)}
                </label>
                <input
                  type="range"
                  min="200000"
                  max="2000000"
                  step="50000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>200K</span>
                  <span>1100K</span>
                  <span>2000K</span>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLocation('all');
                  setSelectedCategory('all');
                  setMinRating(0);
                  setMaxPrice(2000000);
                }}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          </div>

          {/* Hotels Grid */}
          <div className="lg:col-span-3">
            {/* Data Source Indicator */}
            <div className="mb-4 text-sm text-gray-600">
              Data dari: {dataSource === 'database' ? '🗄️ Database' : '📄 File Fallback'}
            </div>

            {isLoading ? (
              <SkeletonGrid type="hotel" count={6} />
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Hotels</h3>
                <p className="text-gray-600">{error}</p>
              </div>
            ) : isFiltering ? (
              <SectionLoading message="Memfilter hotel..." />
            ) : filteredHotels.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏨</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada hotel ditemukan</h3>
                <p className="text-gray-600">Coba ubah filter pencarian Anda</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                  <div key={hotel.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                      <Link href={`/hotels/${hotel.slug}`}>
                        <Image
                          src={hotel.featured_image || (hotel.images && hotel.images[0]) || '/images/hutan-mangrove-bekantan-1.jpg'}
                          alt={hotel.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={false}
                          loading="lazy"
                        />
                      </Link>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 font-semibold">{hotel.rating || 0}</span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {hotel.star_rating ? `${hotel.star_rating} STAR` : 'HOTEL'}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
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
                        />
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-grow">
                          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{hotel.name}</h3>
                          <p className="text-emerald-600 text-sm font-semibold">{hotel.city}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3 flex-grow">
                        {hotel.description || 'Hotel yang nyaman untuk menginap.'}
                      </p>
                      
                      {/* Amenities Icons */}
                      <div className="flex gap-2 mb-3">
                        {hotel.amenities && hotel.amenities.includes('WiFi') && <span className="text-xs">📶</span>}
                        {hotel.amenities && hotel.amenities.includes('Pool') && <span className="text-xs">🏊</span>}
                        {hotel.amenities && hotel.amenities.includes('Gym') && <span className="text-xs">💪</span>}
                        {hotel.amenities && hotel.amenities.includes('Restaurant') && <span className="text-xs">🍽️</span>}
                        {hotel.amenities && hotel.amenities.includes('Parking') && <span className="text-xs">🅿️</span>}
                      </div>

                      <div className="flex justify-between items-center mt-auto">
                        <div>
                          <span className="text-emerald-600 font-bold">
                            {hotel.price_per_night ? `IDR ${hotel.price_per_night.toLocaleString()}` : 'Hubungi untuk harga'}
                          </span>
                          <span className="text-gray-500 text-xs block">per malam</span>
                        </div>
                        <Link 
                          href={`/hotels/${hotel.slug}`}
                          className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                        >
                          Lihat Detail →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
