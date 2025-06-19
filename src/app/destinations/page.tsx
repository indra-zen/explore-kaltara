'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import WishlistButton from '@/components/WishlistButton';
import { SkeletonGrid } from '@/components/SkeletonCards';
import { SectionLoading } from '@/components/LoadingState';
import { PublicDataService } from '@/lib/supabase/public-service';
import type { Destination } from '@/lib/supabase/types';

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [dataSource, setDataSource] = useState<'database' | 'fallback'>('database');

  // Load destinations from database
  useEffect(() => {
    const loadDestinations = async () => {
      setIsLoading(true);
      try {
        const { data, fromFallback } = await PublicDataService.getDestinations();
        setDestinations(data || []);
        setDataSource(fromFallback ? 'fallback' : 'database');
      } catch (error) {
        console.error('Error loading destinations:', error);
        setDestinations([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDestinations();
  }, []);

  // Get unique locations and categories
  const locations = [...new Set(destinations.map(d => d.location || d.city))];
  const categories = [...new Set(destinations.map(d => d.category))];

  // Simulate initial loading (removed since we're loading from database)
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  // Filtered destinations with debounced filtering
  const filteredDestinations = useMemo(() => {
    setIsFiltering(true);
    
    const filtered = destinations.filter(destination => {
      const matchesSearch = destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (destination.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (destination.location || destination.city).toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation = selectedLocation === 'all' || destination.location === selectedLocation || destination.city === selectedLocation;
      const matchesCategory = selectedCategory === 'all' || destination.category === selectedCategory;
      const matchesRating = (destination.rating || 0) >= minRating;

      return matchesSearch && matchesLocation && matchesCategory && matchesRating;
    });

    // Simulate filtering delay for better UX
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 300);

    return filtered;
  }, [searchQuery, selectedLocation, selectedCategory, minRating, destinations]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <div className="bg-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Semua Destinasi Wisata</h1>
          <p className="text-xl text-emerald-100">Temukan destinasi impian Anda di Kalimantan Utara</p>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <p className="text-emerald-200">Ditemukan {filteredDestinations.length} destinasi</p>
            {dataSource === 'fallback' && (
              <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm">
                📋 Data Lokal
              </span>
            )}
            {dataSource === 'database' && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                🗄️ Database Live
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Filter Destinasi</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cari Destinasi</label>
                <input
                  type="text"
                  placeholder="Nama destinasi atau lokasi..."
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
                  <option value="alam">Wisata Alam</option>
                  <option value="budaya">Wisata Budaya</option>
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>2.5</span>
                  <span>5</span>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLocation('all');
                  setSelectedCategory('all');
                  setMinRating(0);
                }}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          </div>

          {/* Destinations Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <SkeletonGrid type="destination" count={6} />
            ) : isFiltering ? (
              <SectionLoading message="Memfilter destinasi..." />
            ) : filteredDestinations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada destinasi ditemukan</h3>
                <p className="text-gray-600">Coba ubah filter pencarian Anda</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDestinations.map((destination) => (
                  <div key={destination.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                    <div className="relative h-48 overflow-hidden">
                      <Link href={`/destinations/${destination.slug}`}>
                        <Image
                          src={destination.featured_image || destination.images?.[0] || '/images/placeholder.jpg'}
                          alt={destination.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={false}
                          loading="lazy"
                        />
                      </Link>
                      {/* ...existing overlay content... */}
                      {/* ...existing overlay content... */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 font-semibold">{destination.rating || 0}</span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {destination.category === 'nature' ? 'Alam' : 
                           destination.category === 'culture' ? 'Budaya' :
                           destination.category === 'history' ? 'Sejarah' :
                           destination.category === 'entertainment' ? 'Hiburan' :
                           destination.category === 'adventure' ? 'Petualangan' : 'Lainnya'}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <WishlistButton 
                          item={{
                            id: destination.id,
                            name: destination.name,
                            type: 'destination',
                            location: destination.location || destination.city,
                            image: destination.featured_image || destination.images?.[0] || '/images/placeholder.jpg',
                            rating: destination.rating || 0,
                            description: destination.description || ''
                          }}
                        />
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="text-emerald-600 text-sm font-semibold mb-2">{destination.location || destination.city}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{destination.name}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-3">{destination.description || ''}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-600 font-semibold">
                          {destination.price_range === 'free' ? 'Gratis' :
                           destination.price_range === 'budget' ? 'Budget' :
                           destination.price_range === 'mid-range' ? 'Menengah' :
                           destination.price_range === 'expensive' ? 'Premium' : 'Harga Bervariasi'}
                        </span>
                        <Link 
                          href={`/destinations/${destination.slug}`}
                          className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                        >
                          Selengkapnya →
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
