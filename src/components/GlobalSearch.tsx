'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Building2, X } from 'lucide-react';
import destinations from '@/data/destinations.json';
import hotels from '@/data/hotels.json';

interface SearchResult {
  id: string;
  name: string;
  location: string;
  type: 'destination' | 'hotel';
  rating: number;
  image: string;
}

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search function
  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    if (query.length < 2) {
      return;
    }

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
        image: dest.image
      }))
      .slice(0, 3);

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
        image: hotel.image
      }))
      .slice(0, 3);

    const combinedResults = [...destResults, ...hotelResults]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);

    setResults(combinedResults);
    setIsOpen(combinedResults.length > 0);
  }, [query]);

  const handleResultClick = () => {
    setQuery('');
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Cari destinasi atau hotel..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 px-3 py-2 font-medium">
              Ditemukan {results.length} hasil
            </div>
            {results.map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                href={`/${result.type === 'destination' ? 'destinations' : 'hotels'}/${result.id}`}
                onClick={handleResultClick}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={result.image}
                    alt={result.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {result.type === 'destination' ? (
                      <MapPin className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Building2 className="w-4 h-4 text-green-500" />
                    )}
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {result.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{result.location}</span>
                    <span className="text-xs text-yellow-500">★ {result.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
            
            {/* View All Results */}
            <div className="border-t pt-2 mt-2">
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={handleResultClick}
                className="block w-full text-center py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Lihat semua hasil untuk &quot;{query}&quot;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 text-center text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Tidak ada hasil untuk &quot;{query}&quot;</p>
          </div>
        </div>
      )}
    </div>
  );
}
