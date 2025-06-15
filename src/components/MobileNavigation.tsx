'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Menu, 
  X, 
  Home, 
  MapPin, 
  Building2, 
  Map, 
  Heart, 
  Search,
  Calendar,
  CloudSun,
  User,
  LogOut,
  Settings
} from 'lucide-react';
import MobileSearchModal from './MobileSearchModal';
import AuthModal from './AuthModal';

export default function MobileNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  // Fix hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);
  const navItems = [
    { href: '/', label: 'Beranda', icon: Home },
    { href: '/destinations', label: 'Destinasi', icon: MapPin },
    { href: '/hotels', label: 'Hotel', icon: Building2 },
    { href: '/map', label: 'Peta', icon: Map },
    { href: '/trip-planner', label: 'Trip Planner', icon: Calendar },
    { href: '/weather', label: 'Cuaca', icon: CloudSun },
    { href: '/wishlist', label: 'Wishlist', icon: Heart, badge: wishlistCount },
  ];

  const isActive = (href: string) => {
    if (!isClient) return false; // Prevent hydration mismatch
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="md:hidden bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-800">Explore Kaltara</span>
          </Link>

          {/* Search & Menu Button */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            
            {/* User Auth Button */}
            {isAuthenticated ? (
              <Link href="/profile" className="flex items-center space-x-1">
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
              </Link>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-emerald-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Masuk
              </button>
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - Fixed positioning */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-lg z-50 max-h-screen overflow-y-auto">
            {/* Menu Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="text-lg font-semibold text-gray-800">Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Menu Items */}
            <nav className="py-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-6 py-4 text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-6 h-6" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
              
              {/* User Section */}
              <div className="border-t mt-4 pt-4">
                {isAuthenticated ? (
                  <>
                    {/* User Profile */}
                    <Link
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-6 py-4 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
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
                        <div>
                          <div className="font-semibold">{user?.name}</div>
                          <div className="text-sm text-gray-500">Lihat Profil</div>
                        </div>
                      </div>
                    </Link>
                    
                    {/* Logout */}                    <button
                      onClick={async () => {
                        await logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center px-6 py-4 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <LogOut className="w-6 h-6" />
                        <span>Logout</span>
                      </div>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center px-6 py-4 text-base font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors w-full text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <User className="w-6 h-6" />
                      <span>Masuk / Daftar</span>
                    </div>
                  </button>
                )}
              </div>
            </nav>
          </div>
        </>
      )}

      {/* Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <nav className="flex items-center justify-around py-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors relative ${
                  isActive(item.href)
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
          
          {/* Profile/Login Button in Bottom Nav */}
          {isAuthenticated ? (
            <Link
              href="/profile"
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                isActive('/profile')
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <div className="relative">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <span className="text-xs font-medium">Profil</span>
            </Link>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors text-emerald-600 hover:text-emerald-700"
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">Masuk</span>
            </button>
          )}
        </nav>
      </div>

      {/* Mobile Search Modal */}
      <MobileSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}
