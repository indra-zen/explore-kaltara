'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Building2, Search } from 'lucide-react';
import WishlistButton from '@/components/WishlistButton';
import destinations from '@/data/destinations.json';
import hotels from '@/data/hotels.json';

interface SearchResult {
  id: string;
  name: string;
  location: string;
  type: 'destination' | 'hotel';
  rating: number;
  image: string;
  description: string;
  priceRange?: string;
}

export default function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const searchResults = useMemo(() => {
    if (!query || query.length < 2) return [];

    const searchQuery = query.toLowerCase();
    
    // Search destinations
    const destResults: SearchResult[] = destinations
      .filter(dest => 
        dest.name.toLowerCase().includes(searchQuery) ||
        dest.location.toLowerCase().includes(searchQuery) ||
        dest.description.toLowerCase().includes(searchQuery)
      )
      .map(dest => ({
        id: dest.id,
        name: dest.name,
        location: dest.location,
        type: 'destination' as const,
        rating: dest.rating,
        image: dest.image,
        description: dest.description
      }));

    // Search hotels
    const hotelResults: SearchResult[] = hotels
      .filter(hotel => 
        hotel.name.toLowerCase().includes(searchQuery) ||
        hotel.location.toLowerCase().includes(searchQuery) ||
        hotel.description.toLowerCase().includes(searchQuery)
      )
      .map(hotel => ({
        id: hotel.id,
        name: hotel.name,
        location: hotel.location,
        type: 'hotel' as const,
        rating: hotel.rating,
        image: hotel.image,
        description: hotel.description,
        priceRange: hotel.priceRange
      }));

    return [...destResults, ...hotelResults]
      .sort((a, b) => b.rating - a.rating);
  }, [query]);

  const destinationResults = searchResults.filter(r => r.type === 'destination');
  const hotelResults = searchResults.filter(r => r.type === 'hotel');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Hasil Pencarian untuk "{query}"
        </h1>
        <p className="text-gray-600">
          Ditemukan {searchResults.length} hasil ({destinationResults.length} destinasi, {hotelResults.length} hotel)
        </p>
      </div>

      {searchResults.length === 0 ? (
        <div className="text-center py-20">
          <Search className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Tidak ada hasil ditemukan
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Coba gunakan kata kunci yang berbeda atau lebih umum
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/destinations"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              Lihat Semua Destinasi
            </Link>
            <Link 
              href="/hotels"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
              <Building2 className="w-5 h-5" />
              Lihat Semua Hotel
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Destinations Results */}
          {destinationResults.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-600" />
                Destinasi ({destinationResults.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinationResults.map((result) => (
                  <div key={result.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative">
                      <Link href={`/destinations/${result.id}`}>
                        <Image
                          src={result.image}
                          alt={result.name}
                          width={400}
                          height={250}
                          className="w-full h-48 object-cover rounded-t-xl"
                        />
                      </Link>
                      <div className="absolute top-3 right-3">
                        <WishlistButton 
                          item={{
                            id: result.id,
                            name: result.name,
                            type: 'destination',
                            location: result.location,
                            image: result.image,
                            rating: result.rating,
                            description: result.description
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {result.name}
                      </h3>
                      <p className="text-gray-600 mb-3 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {result.location}
                      </p>
                      <div className="flex items-center gap-1 mb-4">
                        <span className="text-yellow-400">★</span>
                        <span className="text-gray-700 font-medium">{result.rating}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {result.description}
                      </p>
                      <Link
                        href={`/destinations/${result.id}`}
                        className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hotels Results */}
          {hotelResults.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-green-600" />
                Hotel ({hotelResults.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotelResults.map((result) => (
                  <div key={result.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative">
                      <Link href={`/hotels/${result.id}`}>
                        <Image
                          src={result.image}
                          alt={result.name}
                          width={400}
                          height={250}
                          className="w-full h-48 object-cover rounded-t-xl"
                        />
                      </Link>
                      <div className="absolute top-3 right-3">
                        <WishlistButton 
                          item={{
                            id: result.id,
                            name: result.name,
                            type: 'hotel',
                            location: result.location,
                            image: result.image,
                            rating: result.rating,
                            description: result.description,
                            priceRange: result.priceRange
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {result.name}
                      </h3>
                      <p className="text-gray-600 mb-3 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {result.location}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-gray-700 font-medium">{result.rating}</span>
                        </div>
                        {result.priceRange && (
                          <span className="text-green-600 font-semibold text-sm">
                            {result.priceRange.split(' - ')[0]}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {result.description}
                      </p>
                      <Link
                        href={`/hotels/${result.id}`}
                        className="block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
