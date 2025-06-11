'use client';

import Link from 'next/link';
import { useWishlist } from '@/contexts/WishlistContext';
import { Heart, MapPin, Building2, Map } from 'lucide-react';
import GlobalSearch from './GlobalSearch';
import MobileNavigation from './MobileNavigation';

export default function Header() {
  const { wishlistCount } = useWishlist();
  
  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">Explore Kaltara</span>
            </Link>
            
            {/* Desktop Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <GlobalSearch />
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              <Link 
                href="/destinations" 
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>Destinasi</span>
              </Link>
              <Link 
                href="/hotels" 
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Building2 className="w-4 h-4" />
                <span>Hotel</span>
              </Link>
              <Link 
                href="/map" 
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Map className="w-4 h-4" />
                <span>Peta</span>
              </Link>
              <Link 
                href="/wishlist" 
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors relative"
              >
                <Heart className="w-4 h-4" />
                <span>Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </>
  );
}
