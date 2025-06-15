'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, MapPin, Building2 } from 'lucide-react';
import destinations from '@/data/destinations.json';
import hotels from '@/data/hotels.json';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSearchModal({ isOpen, onClose }: MobileSearchModalProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (query.length > 1) {
      const searchQuery = query.toLowerCase();
      
      const destSuggestions = destinations
        .filter(dest => 
          dest.name.toLowerCase().includes(searchQuery) ||
          dest.location.toLowerCase().includes(searchQuery)
        )
        .slice(0, 3)
        .map(dest => ({ ...dest, type: 'destination' }));

      const hotelSuggestions = hotels
        .filter(hotel => 
          hotel.name.toLowerCase().includes(searchQuery) ||
          hotel.location.toLowerCase().includes(searchQuery)
        )
        .slice(0, 3)
        .map(hotel => ({ ...hotel, type: 'hotel' }));

      setSuggestions([...destSuggestions, ...hotelSuggestions]);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
      setQuery('');
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    const url = suggestion.type === 'destination' 
      ? `/destinations/${suggestion.id}` 
      : `/hotels/${suggestion.id}`;
    router.push(url);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 md:hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center p-4 border-b">
          <button
            onClick={onClose}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="ml-2 text-lg font-semibold text-gray-800">Pencarian</h2>
        </div>

        {/* Search Form */}
        <div className="p-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari destinasi, hotel, atau lokasi..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white text-gray-900"
                autoFocus
              />
            </div>
          </form>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 pb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Saran Pencarian</h3>
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={`${suggestion.type}-${suggestion.id}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {suggestion.type === 'destination' ? (
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-green-600" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="text-base font-medium text-gray-900">
                        {suggestion.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {suggestion.location} • {suggestion.type === 'destination' ? 'Destinasi' : 'Hotel'}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-sm">★</span>
                      <span className="ml-1 text-sm text-gray-600">{suggestion.rating}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {query.length === 0 && (
          <div className="flex-1 p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Jelajahi</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  router.push('/destinations');
                  onClose();
                }}
                className="w-full flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <MapPin className="w-6 h-6 text-blue-600" />
                <div className="ml-3 text-left">
                  <div className="font-medium text-gray-900">Semua Destinasi</div>
                  <div className="text-sm text-gray-500">Jelajahi tempat wisata</div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  router.push('/hotels');
                  onClose();
                }}
                className="w-full flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Building2 className="w-6 h-6 text-green-600" />
                <div className="ml-3 text-left">
                  <div className="font-medium text-gray-900">Semua Hotel</div>
                  <div className="text-sm text-gray-500">Temukan penginapan</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
