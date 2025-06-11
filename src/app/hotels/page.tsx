'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import WishlistButton from '@/components/WishlistButton';
import hotels from '@/data/hotels.json';

export default function HotelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000000);

  // Get unique locations and categories
  const locations = [...new Set(hotels.map(h => h.location))];
  const categories = [...new Set(hotels.map(h => h.category))];

  // Extract price range for filtering
  const getPriceRange = (priceRange: string) => {
    const prices = priceRange.match(/IDR ([\d,]+)/g)?.map(p => 
      parseInt(p.replace(/IDR |,/g, ''))
    ) || [0];
    return Math.max(...prices);
  };

  // Filtered hotels
  const filteredHotels = useMemo(() => {
    return hotels.filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           hotel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation = selectedLocation === 'all' || hotel.location === selectedLocation;
      const matchesCategory = selectedCategory === 'all' || hotel.category === selectedCategory;
      const matchesRating = hotel.rating >= minRating;
      const hotelMaxPrice = getPriceRange(hotel.priceRange);
      const matchesPrice = hotelMaxPrice <= maxPrice;

      return matchesSearch && matchesLocation && matchesCategory && matchesRating && matchesPrice;
    });
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">Semua Kategori</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
            {filteredHotels.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏨</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada hotel ditemukan</h3>
                <p className="text-gray-600">Coba ubah filter pencarian Anda</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                  <div key={hotel.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative h-48 overflow-hidden">
                      <Link href={`/hotels/${hotel.id}`}>
                        <Image
                          src={hotel.image}
                          alt={hotel.name}
                          fill
                          className="object-cover"
                        />
                      </Link>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 font-semibold">{hotel.rating}</span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {hotel.category.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
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
                        />
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{hotel.name}</h3>
                          <p className="text-emerald-600 text-sm font-semibold">{hotel.location}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">{hotel.description}</p>
                      
                      {/* Amenities Icons */}
                      <div className="flex gap-2 mb-3">
                        {hotel.amenities.wifi && <span className="text-xs">📶</span>}
                        {hotel.amenities.pool && <span className="text-xs">🏊</span>}
                        {hotel.amenities.gym && <span className="text-xs">💪</span>}
                        {hotel.amenities.restaurant && <span className="text-xs">🍽️</span>}
                        {hotel.amenities.parking && <span className="text-xs">🅿️</span>}
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-emerald-600 font-bold">{hotel.priceRange.split(' - ')[0]}</span>
                          <span className="text-gray-500 text-xs block">per malam</span>
                        </div>
                        <Link 
                          href={`/hotels/${hotel.id}`}
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
