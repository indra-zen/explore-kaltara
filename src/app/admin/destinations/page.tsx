'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminService from '@/lib/supabase/admin-service';
import { 
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  MapPin,
  Image,
  MoreVertical,
  Download
} from 'lucide-react';

// Using the Destination type from our Supabase types
import type { Destination } from '@/lib/supabase/types';

export default function DestinationsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [destinationList, setDestinationList] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');

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
      loadDestinations();
    }
  }, [user, isAuthenticated, isLoading, router]);

  const isAdminUser = (email: string) => {
    const adminEmails = ['admin@explorekaltara.com', 'demo@admin.com'];
    return adminEmails.includes(email);
  };
  const loadDestinations = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getDestinations();
      setDestinationList(response.data);
    } catch (error) {
      console.error('Error loading destinations:', error);
      // Fallback to empty array if there's an error
      setDestinationList([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDestinations = destinationList.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || destination.category === filterCategory;
    const matchesLocation = filterLocation === 'all' || destination.location === filterLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const categories = [...new Set(destinationList.map((d: Destination) => d.category).filter(Boolean))];
  const locations = [...new Set(destinationList.map((d: Destination) => d.location).filter(Boolean))];

  const getCategoryBadge = (category: string | null) => {
    if (!category) return null;
    
    const categoryConfig: Record<string, string> = {
      nature: 'bg-green-100 text-green-800',
      culture: 'bg-purple-100 text-purple-800',
      history: 'bg-yellow-100 text-yellow-800',
      entertainment: 'bg-blue-100 text-blue-800',
      adventure: 'bg-red-100 text-red-800',
      default: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryConfig[category] || categoryConfig.default}`}>
        {category}
      </span>
    );
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
            <h1 className="text-2xl font-bold text-gray-900">Destinations Management</h1>
            <p className="text-gray-600 mt-1">Manage tourist destinations across Kalimantan Utara</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="flex items-center px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Destination
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Destinations</p>
                <p className="text-2xl font-bold text-gray-900">{destinationList.length}</p>
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
                  {destinationList.length > 0 ? 
                    (destinationList.reduce((sum, d) => sum + (d.rating || 0), 0) / destinationList.length).toFixed(1) 
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Image className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Images</p>
                <p className="text-2xl font-bold text-gray-900">
                  {destinationList.reduce((sum, d) => sum + (d.images?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Locations</p>
                <p className="text-2xl font-bold text-gray-900">{locations.length}</p>
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
                  placeholder="Search destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>                {categories.map(category => (
                  <option key={category} value={category || ''}>{category}</option>
                ))}
              </select>
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
            </div>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => (
            <div key={destination.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48">                <img
                  src={destination.featured_image || destination.images?.[0] || '/images/placeholder.jpg'}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <button className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2">
                  {getCategoryBadge(destination.category)}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {destination.name}
                  </h3>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{destination.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {destination.location}
                </p>
                
                <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                  {destination.description}
                </p>
                
                <div className="flex items-center justify-between">                  <span className="text-sm font-medium text-emerald-600">
                    {destination.price_range || 'Free'}
                  </span>
                  <div className="flex space-x-1">
                    <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
