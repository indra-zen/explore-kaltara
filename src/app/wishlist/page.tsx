'use client';

import { useWishlist } from '@/contexts/WishlistContext';
import Header from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Building2, Star, Trash2 } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  
  const destinations = wishlistItems.filter(item => item.type === 'destination');
  const hotels = wishlistItems.filter(item => item.type === 'hotel');
  
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Wishlist Kosong</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Belum ada destinasi atau hotel yang disimpan. Mulai jelajahi dan simpan tempat favorit Anda!
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/destinations"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Jelajahi Destinasi
              </Link>
              <Link 
                href="/hotels"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
              >
                <Building2 className="w-5 h-5" />
                Lihat Hotel
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Wishlist Saya</h1>
            <p className="text-gray-600">
              {wishlistItems.length} tempat favorit tersimpan
            </p>
          </div>
          
          {wishlistItems.length > 0 && (
            <button
              onClick={clearWishlist}
              className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Semua
            </button>
          )}
        </div>
        
        {/* Destinations Section */}
        {destinations.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              Destinasi ({destinations.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((destination) => (
                <div key={destination.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <button
                      onClick={() => removeFromWishlist(destination.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                      title="Hapus dari wishlist"
                    >
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {destination.name}
                    </h3>
                    <p className="text-gray-600 mb-3 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {destination.location}
                    </p>
                    <div className="flex items-center gap-1 mb-4">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-gray-700 font-medium">{destination.rating}</span>
                    </div>
                    {destination.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {destination.description}
                      </p>
                    )}
                    <Link
                      href={`/destinations/${destination.id}`}
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
        
        {/* Hotels Section */}
        {hotels.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-green-600" />
              Hotel ({hotels.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <div key={hotel.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <button
                      onClick={() => removeFromWishlist(hotel.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                      title="Hapus dari wishlist"
                    >
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {hotel.name}
                    </h3>
                    <p className="text-gray-600 mb-3 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {hotel.location}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-gray-700 font-medium">{hotel.rating}</span>
                      </div>
                      {hotel.priceRange && (
                        <span className="text-green-600 font-semibold">
                          {hotel.priceRange}
                        </span>
                      )}
                    </div>
                    {hotel.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {hotel.description}
                      </p>
                    )}
                    <Link
                      href={`/hotels/${hotel.id}`}
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
    </div>
  );
}
