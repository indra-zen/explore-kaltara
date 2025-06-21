'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminService from '@/lib/supabase/admin-service';
import { DestinationModal, ConfirmDialog, Toast } from '@/components/admin/AdminModals';
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
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');

  // CRUD states
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' | 'warning' } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Don't do anything while still loading auth state
    if (isLoading) {
      setAuthChecked(false);
      return;
    }

    // Mark that we've checked authentication
    setAuthChecked(true);

    // If not authenticated after loading is complete, redirect
    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }

    // Check if user is admin
    if (!isAdminUser(user.email)) {
      router.push('/');
      return;
    }

    // If user is admin, load data
    loadDestinations();
  }, [isLoading, isAuthenticated, user, router]); // Added router to dependencies
  const isAdminUser = (email: string | null | undefined): boolean => {
    if (!email) return false;
    const adminEmails = ['admin@explorekaltara.com', 'demo@admin.com'];
    return adminEmails.includes(email);
  };

  const loadDestinations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await AdminService.getDestinations();
      setDestinationList(response.data || []);
    } catch (err) {
      console.error('Error loading destinations:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load destinations';
      if (errorMessage.includes('auth') || errorMessage.includes('connection') || errorMessage.includes('network')) {
        setError('Failed to load destinations. Please check your connection and try again.');
      } else {
        setError(null);
      }
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

  const handleCreateDestination = () => {
    setCurrentDestination(null);
    setShowDestinationModal(true);
  };

  const handleEditDestination = (destination: Destination) => {
    setCurrentDestination(destination);
    setShowDestinationModal(true);
  };

  const handleDeleteDestination = (destination: Destination) => {
    setCurrentDestination(destination);
    setShowDeleteDialog(true);
  };

  const handleSaveDestination = async (destinationData: any) => {
    try {
      setActionLoading(true);
      
      console.log('Saving destination with data:', destinationData);
      
      if (currentDestination) {
        // Update existing destination
        const updatedDestination = await AdminService.updateDestination(currentDestination.id, destinationData);
        setDestinationList(prev => prev.map(d => d.id === currentDestination.id ? { ...d, ...updatedDestination } : d));
        setToast({ message: 'Destination updated successfully!', variant: 'success' });
      } else {
        // Create new destination
        const newDestination = await AdminService.createDestination(destinationData);
        setDestinationList(prev => [...prev, newDestination]);
        setToast({ message: 'Destination created successfully!', variant: 'success' });
      }
      
      setShowDestinationModal(false);
      setCurrentDestination(null);
    } catch (error) {
      console.error('Error saving destination:', error);
      setToast({ 
        message: error instanceof Error ? error.message : 'Failed to save destination', 
        variant: 'error' 
      });
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDeleteDestination = async () => {
    if (!currentDestination) return;
    
    try {
      setActionLoading(true);
      await AdminService.deleteDestination(currentDestination.id);
      setDestinationList(prev => prev.filter(d => d.id !== currentDestination.id));
      setToast({ message: 'Destination deleted successfully!', variant: 'success' });
      setShowDeleteDialog(false);
      setCurrentDestination(null);
    } catch (error) {
      console.error('Error deleting destination:', error);
      setToast({ 
        message: error instanceof Error ? error.message : 'Failed to delete destination', 
        variant: 'error' 
      });
    } finally {
      setActionLoading(false);
    }
  };

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
  if (isLoading || loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isLoading ? 'Checking authentication...' : 'Loading destinations...'}
          </p>
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
            <button 
              onClick={handleCreateDestination}
              className="flex items-center px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Destination
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={loadDestinations}
              className="mt-2 text-red-700 hover:text-red-800 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

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
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
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
                <option value="all">All Categories</option>
                {categories.map(category => (
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
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading destinations...</p>
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search or filter criteria.' : 'Get started by creating your first destination.'}
            </p>
            {!searchTerm && (
              <button 
                onClick={handleCreateDestination}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Create your first destination
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination) => (
              <div key={destination.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <img
                    src={destination.featured_image || destination.images?.[0] || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
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
                      <span className="text-sm font-medium text-gray-900">{destination.rating || 0}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {destination.location}
                  </p>
                  
                  <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                    {destination.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-600">
                      {destination.price_range || 'Free'}
                    </span>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handleEditDestination(destination)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Destination"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteDestination(destination)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Destination"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <DestinationModal
        isOpen={showDestinationModal}
        destination={currentDestination}
        onSave={handleSaveDestination}
        onCancel={() => {
          setShowDestinationModal(false);
          setCurrentDestination(null);
        }}
        loading={actionLoading}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Destination"
        message={`Are you sure you want to delete "${currentDestination?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDeleteDestination}
        onCancel={() => {
          setShowDeleteDialog(false);
          setCurrentDestination(null);
        }}
        loading={actionLoading}
        variant="danger"
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </AdminLayout>
  );
}
