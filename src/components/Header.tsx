'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, MapPin, Building2, Map, Calendar, CloudSun, User, LogOut, Settings } from 'lucide-react';
import GlobalSearch from './GlobalSearch';
import MobileNavigation from './MobileNavigation';
import AuthModal from './AuthModal';

export default function Header() {
  const { wishlistCount } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Close user menu when clicking outside
  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleMenuItemClick = () => {
    setShowUserMenu(false);
  };
  
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
                href="/blog" 
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <span>Blog</span>
              </Link>
              <Link 
                href="/map" 
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Map className="w-4 h-4" />
                <span>Peta</span>
              </Link>
              <Link 
                href="/trip-planner" 
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Trip Planner</span>
              </Link>
              <Link 
                href="/weather" 
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <CloudSun className="w-4 h-4" />
                <span>Cuaca</span>
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
              
              {/* User Authentication */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={handleUserMenuToggle}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="hidden lg:block">{user?.name}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={handleMenuItemClick}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Profil</span>
                        </Link>
                        <Link
                          href="/trip-planner"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={handleMenuItemClick}
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Trip Planner</span>
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={() => {
                            logout();
                            handleMenuItemClick();
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Masuk
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}
