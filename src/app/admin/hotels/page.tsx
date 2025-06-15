'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminService from '@/lib/supabase/admin-service';
import type { Hotel } from '@/lib/supabase/types';
import { 
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  MapPin,
  Building2,
  MoreVertical,
  Download,
  DollarSign,
  Users,
  Wifi,
  Car,
  Utensils
} from 'lucide-react';

export default function HotelsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [hotelList, setHotelList] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<string>('all');

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push('/');
      return;
    }

    if (user && !isAdminUser(user.email)) {
      router.push('/');
      return;
    }

    if (user && isAdminUser(user.email)) {
      loadHotels();
    }
  }, [user, isAuthenticated, isLoading, router]);

  const isAdminUser = (email: string) => {
    const adminEmails = ['admin@explorekaltara.com', 'demo@admin.com'];
    return adminEmails.includes(email);
  };
  const loadHotels = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getHotels();
      setHotelList(response.data || []);
    } catch (error) {
      console.error('Error loading hotels:', error);
      // For hotels, we don't need to show error state, just empty list
      setHotelList([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = hotelList.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = filterLocation === 'all' || hotel.location === filterLocation;
    const matchesRating = filterRating === 'all' || 
                         (filterRating === '4+' && (hotel.rating || 0) >= 4) ||
                         (filterRating === '3+' && (hotel.rating || 0) >= 3) ||
                         (filterRating === '2+' && (hotel.rating || 0) >= 2);
    
    return matchesSearch && matchesLocation && matchesRating;
  });

  const locations = [...new Set(hotelList.map((h: Hotel) => h.location).filter(Boolean))];

  const getStarRating = (rating: number | null) => {
    if (!rating) return 0;
    return Math.floor(rating);
  };

  const getTopAmenities = (amenities: string[] | null) => {
    if (!amenities || !Array.isArray(amenities)) return [];
    
    const amenityIcons: Record<string, any> = {
      wifi: <Wifi className="w-4 h-4" />,
      parking: <Car className="w-4 h-4" />,
      restaurant: <Utensils className="w-4 h-4" />,
      pool: <Users className="w-4 h-4" />,
      gym: <Building2 className="w-4 h-4" />
    };

    return amenities
      .slice(0, 3)
      .map(amenity => amenityIcons[amenity.toLowerCase()])
      .filter(Boolean);
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !isAdminUser(user.email)) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hotels Management</h1>
            <p className="text-gray-600 mt-1">Manage hotel listings and accommodations</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="flex items-center px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Hotel
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Hotels</p>
                <p className="text-2xl font-bold text-gray-900">{hotelList.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {hotelList.length > 0 ? 
                    (hotelList.reduce((sum, h) => sum + (h.rating || 0), 0) / hotelList.length).toFixed(1) 
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {hotelList.reduce((sum, h) => sum + (h.review_count || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Price/Night</p>
                <p className="text-2xl font-bold text-gray-900">
                  {hotelList.length > 0 && hotelList.some(h => h.price_per_night) ? 
                    `$${Math.round(hotelList.reduce((sum, h) => sum + (h.price_per_night || 0), 0) / hotelList.filter(h => h.price_per_night).length)}`
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search hotels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Ratings</option>
                <option value="4+">4+ Stars</option>
                <option value="3+">3+ Stars</option>
                <option value="2+">2+ Stars</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <img
                  src={hotel.featured_image || hotel.images?.[0] || '/images/placeholder.jpg'}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <button className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <div className="flex items-center space-x-1 bg-white/90 backdrop-blur rounded-full px-2 py-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < getStarRating(hotel.star_rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {hotel.name}
                  </h3>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{hotel.rating || 'N/A'}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {hotel.location}
                </p>
                
                <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                  {hotel.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-emerald-600">
                    {hotel.price_per_night ? `$${hotel.price_per_night}/night` : 'Price on request'}
                  </span>
                  <div className="flex space-x-1">
                    {getTopAmenities(hotel.amenities).map((icon, index) => (
                      <div key={index} className="text-gray-400">
                        {icon}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <button className="flex-1 p-2 text-gray-400 hover:text-emerald-600 transition-colors border border-gray-200 rounded-lg hover:border-emerald-200">
                    <Eye className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 p-2 text-gray-400 hover:text-blue-600 transition-colors border border-gray-200 rounded-lg hover:border-blue-200">
                    <Edit className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 p-2 text-gray-400 hover:text-red-600 transition-colors border border-gray-200 rounded-lg hover:border-red-200">
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredHotels.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterLocation !== 'all' || filterRating !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first hotel'}
            </p>
            <button className="inline-flex items-center px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Hotel
            </button>
          </div>
        )}
      </div>
    </AdminLayout>  );
}
