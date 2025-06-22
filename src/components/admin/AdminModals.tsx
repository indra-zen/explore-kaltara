'use client';

import { useState, useEffect, useRef } from 'react';
import AdminService from '@/lib/supabase/admin-service';
import { getFacilityIcon, commonFacilities, commonHotelAmenities } from '@/lib/facility-icons';
import { X, Plus } from 'lucide-react';

// Debug: Track form submission attempts
let submissionCounter = 0;

// User CRUD Modal
interface UserModalProps {
  isOpen: boolean;
  user?: any;
  onSave: (userData: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function UserModal({ isOpen, user, onSave, onCancel, loading = false }: UserModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    avatar_url: '',
    favorite_locations: [] as string[],
    interests: [] as string[],
    travel_style: 'mid-range' as 'budget' | 'mid-range' | 'luxury',
    is_admin: false
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        password: '', // Never pre-fill password
        name: user.name || '',
        avatar_url: user.avatar_url || '',
        favorite_locations: user.favorite_locations || [],
        interests: user.interests || [],
        travel_style: user.travel_style || 'mid-range',
        is_admin: user.is_admin || false
      });
    } else {
      setFormData({
        email: '',
        password: '',
        name: '',
        avatar_url: '',
        favorite_locations: [],
        interests: [],
        travel_style: 'mid-range',
        is_admin: false
      });
    }
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {user ? 'Edit User' : 'Create New User'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>              <input
                type="email"
                required
                disabled={!!user} // Don't allow email changes for existing users
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900 bg-white"
              />
            </div>
            
            {!user && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>                <input
                  type="password"
                  required={!user}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
              <input
                type="url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Travel Style</label>
              <select
                value={formData.travel_style}
                onChange={(e) => setFormData({ ...formData, travel_style: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="budget">Budget</option>
                <option value="mid-range">Mid-range</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_admin}
                onChange={(e) => setFormData({ ...formData, is_admin: e.target.checked })}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">Admin User</label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (user ? 'Update User' : 'Create User')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Destination CRUD Modal
interface DestinationModalProps {
  isOpen: boolean;
  destination?: any;
  onSave: (destinationData: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function DestinationModal({ isOpen, destination, onSave, onCancel, loading = false }: DestinationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    location: '',
    city: '',
    category: 'nature' as 'nature' | 'culture' | 'history' | 'entertainment' | 'adventure',
    price_range: 'free' as 'free' | 'budget' | 'mid-range' | 'expensive',
    rating: 0,
    images: [] as string[],
    featured_image: '',
    facilities: [] as string[],
    latitude: 0,
    longitude: 0,
    contact_info: {} as any,
    opening_hours: {} as any,
    is_featured: false,
    status: 'active' as 'active' | 'inactive' | 'pending'
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newFacility, setNewFacility] = useState('');
  
  // Modal timer lock to prevent interference after 2-3 seconds
  const modalOpenTimeRef = useRef<number>(0);
  const isModalStaleRef = useRef(false);
  
  // Force fresh modal state
  const refreshModal = () => {
    console.log('🔄 REFRESHING MODAL STATE');
    modalOpenTimeRef.current = Date.now();
    isModalStaleRef.current = false;
    setModalAgeDisplay('');
    
    // Trigger a small state update to force React refresh
    const currentData = { ...formData };
    setFormData({ ...currentData });
  };
  
  // Modal timer display for debugging
  const [modalAgeDisplay, setModalAgeDisplay] = useState('');
  
  useEffect(() => {
    // Initialize modal timer when opened
    if (isOpen) {
      modalOpenTimeRef.current = Date.now();
      isModalStaleRef.current = false;
      console.log('🚀 DESTINATION MODAL opened at:', new Date().toISOString());
    }
    
    if (destination) {
      setFormData({
        name: destination.name || '',
        slug: destination.slug || '',
        description: destination.description || '',
        location: destination.location || '',
        city: destination.city || '',
        category: destination.category || 'nature',
        price_range: destination.price_range || 'free',
        rating: destination.rating || 0,
        images: destination.images || [],
        featured_image: destination.featured_image || '',
        facilities: destination.facilities || [],
        latitude: destination.latitude || 0,
        longitude: destination.longitude || 0,
        contact_info: destination.contact_info || {},
        opening_hours: destination.opening_hours || {},
        is_featured: destination.is_featured || false,
        status: destination.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        location: '',
        city: '',
        category: 'nature',
        price_range: 'free',
        rating: 0,
        images: [],
        featured_image: '',
        facilities: [],
        latitude: 0,
        longitude: 0,
        contact_info: {},
        opening_hours: {},
        is_featured: false,
        status: 'active'
      });
    }
  }, [destination, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    
    const updateTimer = () => {
      const age = Math.round((Date.now() - modalOpenTimeRef.current) / 1000);
      if (age <= 2) {
        setModalAgeDisplay(''); // No display for first 2 seconds
      } else if (age <= 5) {
        setModalAgeDisplay(` (${age}s)`); // Yellow zone
      } else {
        setModalAgeDisplay(` (${age}s - DANGER!)`); // Red zone
      }
    };
    
    const timer = setInterval(updateTimer, 500); // Update every 500ms for better feedback
    return () => clearInterval(timer);
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    submissionCounter++;
    const thisSubmission = submissionCounter;
    const modalAge = Date.now() - modalOpenTimeRef.current;
    
    console.log(`🚀 DESTINATION FORM SUBMISSION #${thisSubmission} STARTED`);
    console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
    console.log(`⏰ Modal age: ${modalAge}ms`);
    console.log(`⏳ Loading state: ${loading}`);
    console.log(`� Modal stale: ${isModalStaleRef.current}`);
    
    // Check if modal has been open too long (more than 3 seconds)
    if (modalAge > 3000) {
      console.warn(`⚠️ SUBMISSION #${thisSubmission} - Modal has been open for ${Math.round(modalAge/1000)}s - HIGH RISK OF FAILURE`);
      const options = confirm(`⚠️ TIMING ISSUE DETECTED!\n\nThis form has been open for ${Math.round(modalAge/1000)} seconds.\nBased on your bug report, this is likely to get stuck.\n\nChoose:\n- OK: Try anyway (will probably fail)\n- Cancel: I'll close and re-open the modal`);
      
      if (!options) {
        console.log(`❌ SUBMISSION #${thisSubmission} - User chose to cancel due to stale modal`);
        alert('💡 TIP: Close this modal and click Edit again for best results!');
        return;
      }
      
      console.warn(`⚠️ SUBMISSION #${thisSubmission} - User chose to proceed despite timing risk`);
    }
    
    // Prevent multiple submissions
    if (loading) {
      console.log(`⛔ SUBMISSION #${thisSubmission} BLOCKED - Already loading`);
      return;
    }
    
    // Generate slug from name if not provided
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Ensure all required fields are present and properly formatted
    const submissionData = {
      ...formData,
      slug,
      description: formData.description || '',
      rating: formData.rating || 0,
      images: formData.images || [],
      facilities: formData.facilities || [],
      contact_info: formData.contact_info || {},
      opening_hours: formData.opening_hours || {}
    };
    
    console.log(`✅ SUBMISSION #${thisSubmission} DATA PREPARED:`, submissionData);
    console.log(`🏁 SUBMISSION #${thisSubmission} CALLING onSave...`);
    
    // Force immediate submission with no delays
    onSave(submissionData);
  };

  const categories = ['nature', 'culture', 'history', 'entertainment', 'adventure'];
  const priceRanges = ['free', 'budget', 'mid-range', 'expensive'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {destination ? 'Edit Destination' : 'Create New Destination'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
              <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Price Range</label>
              <select
                required
                value={formData.price_range}
                onChange={(e) => setFormData({ ...formData, price_range: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Price Range</option>
                {priceRanges.map(range => (
                  <option key={range} value={range}>{range.charAt(0).toUpperCase() + range.slice(1)}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating (0-5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Images</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Enter image URL"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newImageUrl.trim()) {
                        setFormData({
                          ...formData,
                          images: [...formData.images, newImageUrl.trim()]
                        });
                        setNewImageUrl('');
                      }
                    }}
                    className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="space-y-1">
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <img src={image} alt={`Preview ${index + 1}`} className="w-12 h-12 object-cover rounded" />
                        <span className="flex-1 text-sm text-gray-600 truncate">{image}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              images: formData.images.filter((_, i) => i !== index)
                            });
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                        {!formData.featured_image && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                featured_image: image
                              });
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Set as Featured
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
                <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700">Featured Image URL</label>
                <input
                  type="text"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  placeholder="Enter featured image URL or select from images above"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Facilities</label>
              <div className="space-y-3">
                {/* Quick Add Common Facilities */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Quick Add Common Facilities</label>
                  <div className="flex flex-wrap gap-2">
                    {commonFacilities.map((facility) => {
                      const Icon = facility.icon;
                      const isAdded = formData.facilities.includes(facility.name);
                      return (
                        <button
                          key={facility.name}
                          type="button"
                          onClick={() => {
                            if (!isAdded) {
                              setFormData({
                                ...formData,
                                facilities: [...formData.facilities, facility.name]
                              });
                            }
                          }}
                          disabled={isAdded}
                          className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md border transition-colors ${
                            isAdded 
                              ? 'bg-green-100 text-green-800 border-green-300 cursor-not-allowed' 
                              : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300'
                          }`}
                        >
                          <Icon size={12} />
                          <span>{facility.name}</span>
                          {isAdded && <span className="text-green-600">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Facility Input */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Add Custom Facility</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter custom facility (e.g., Hot Spring, Cave Tour)"
                      value={newFacility}
                      onChange={(e) => setNewFacility(e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newFacility.trim() && !formData.facilities.includes(newFacility.trim())) {
                          setFormData({
                            ...formData,
                            facilities: [...formData.facilities, newFacility.trim()]
                          });
                          setNewFacility('');
                        }
                      }}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                {/* Selected Facilities with Icons */}
                {formData.facilities.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">Selected Facilities</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.facilities.map((facility, index) => {
                        const Icon = getFacilityIcon(facility);
                        return (
                          <div key={index} className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm border border-blue-200">
                            <Icon size={14} />
                            <span>{facility}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  facilities: formData.facilities.filter((_, i) => i !== index)
                                });
                              }}
                              className="text-blue-600 hover:text-blue-800 ml-1 font-bold"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Coordinates Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Latitude</label>
              <input
                type="number"
                step="any"
                placeholder="e.g., 3.0736"
                value={formData.latitude || ''}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">Decimal degrees (North Kaltara: ~2.8 to 4.0)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Longitude</label>
              <input
                type="number"
                step="any"
                placeholder="e.g., 117.1356"
                value={formData.longitude || ''}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">Decimal degrees (East Kaltara: ~116.8 to 117.7)</p>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">Featured Destination</label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            {modalAgeDisplay.includes('s') && (
              <button
                type="button"
                onClick={refreshModal}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 border border-orange-300 rounded-md hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                title="Modal has been open too long - refresh to prevent save issues"
              >
                🔄 Refresh
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                modalAgeDisplay.includes('DANGER') 
                  ? 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 animate-pulse' 
                  : modalAgeDisplay.includes('s') 
                    ? 'text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                    : 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              }`}
            >
              {loading ? 'Saving...' : (destination ? `Update Destination${modalAgeDisplay}` : `Create Destination${modalAgeDisplay}`)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Hotel CRUD Modal
interface HotelModalProps {
  isOpen: boolean;
  hotel?: any;
  onSave: (hotelData: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function HotelModal({ isOpen, hotel, onSave, onCancel, loading = false }: HotelModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    city: '',
    location: '',
    price_per_night: 0,
    star_rating: 3,
    rating: 0,
    images: [] as string[],
    featured_image: '',
    amenities: [] as string[],
    room_types: [] as string[],
    latitude: 0,
    longitude: 0,
    contact_info: {} as any,
    policies: {} as any,
    currency: 'USD',
    status: 'active' as 'active' | 'inactive' | 'pending',
    is_featured: false
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name || '',
        slug: hotel.slug || '',
        description: hotel.description || '',
        city: hotel.city || '',
        location: hotel.location || '',
        price_per_night: hotel.price_per_night || 0,
        star_rating: hotel.star_rating || 3,
        rating: hotel.rating || 0,
        images: hotel.images || [],
        featured_image: hotel.featured_image || '',
        amenities: hotel.amenities || [],
        room_types: hotel.room_types || [],
        latitude: hotel.latitude || 0,
        longitude: hotel.longitude || 0,
        contact_info: hotel.contact_info || {},
        policies: hotel.policies || {},
        currency: hotel.currency || 'USD',
        status: hotel.status || 'active',
        is_featured: hotel.is_featured || false
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        city: '',
        location: '',
        price_per_night: 0,
        star_rating: 3,
        rating: 0,
        images: [],
        featured_image: '',
        amenities: [],
        room_types: [],
        latitude: 0,
        longitude: 0,
        contact_info: {},
        policies: {},
        currency: 'USD',
        status: 'active',
        is_featured: false
      });
    }
  }, [hotel, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (loading) {
      console.log('Form already submitting, ignoring duplicate submission');
      return;
    }
    
    // Validate required fields
    if (!formData.name?.trim()) {
      alert('Hotel name is required');
      return;
    }
    
    if (!formData.location?.trim()) {
      alert('Hotel location is required');
      return;
    }
    
    // Generate slug from name if not provided
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Ensure all required fields are present and properly formatted
    const submissionData = {
      ...formData,
      slug,
      name: formData.name.trim(),
      location: formData.location.trim(),
      description: formData.description?.trim() || '',
      rating: formData.rating || 0,
      images: Array.isArray(formData.images) ? formData.images.filter(img => img?.trim()) : [],
      amenities: Array.isArray(formData.amenities) ? formData.amenities.filter(amenity => amenity?.trim()) : [],
      contact_info: formData.contact_info || {},
      policies: formData.policies || {},
      room_types: formData.room_types || []
    };
    
    console.log('Submitting hotel data:', submissionData);
    onSave(submissionData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {hotel ? 'Edit Hotel' : 'Create New Hotel'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
              <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Location/Address</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Price per Night</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.price_per_night}
                onChange={(e) => setFormData({ ...formData, price_per_night: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Star Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.star_rating}
                onChange={(e) => setFormData({ ...formData, star_rating: parseInt(e.target.value) || 3 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Rating (0-5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Images</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Enter image URL"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newImageUrl.trim()) {
                        setFormData({
                          ...formData,
                          images: [...formData.images, newImageUrl.trim()]
                        });
                        setNewImageUrl('');
                      }
                    }}
                    className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="space-y-1">
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <img src={image} alt={`Preview ${index + 1}`} className="w-12 h-12 object-cover rounded" />
                        <span className="flex-1 text-sm text-gray-600 truncate">{image}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              images: formData.images.filter((_, i) => i !== index)
                            });
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                        {!formData.featured_image && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                featured_image: image
                              });
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Set as Featured
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
                <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700">Featured Image URL</label>
                <input
                  type="text"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  placeholder="Enter featured image URL or select from images above"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Amenities</label>
              <div className="space-y-3">
                {/* Quick Add Common Amenities */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Quick Add Common Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {commonHotelAmenities.map((amenity) => {
                      const Icon = amenity.icon;
                      const isAdded = formData.amenities.includes(amenity.name);
                      return (
                        <button
                          key={amenity.name}
                          type="button"
                          onClick={() => {
                            if (!isAdded) {
                              setFormData({
                                ...formData,
                                amenities: [...formData.amenities, amenity.name]
                              });
                            }
                          }}
                          disabled={isAdded}
                          className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md border transition-colors ${
                            isAdded 
                              ? 'bg-green-100 text-green-800 border-green-300 cursor-not-allowed' 
                              : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-green-50 hover:text-green-700 hover:border-green-300'
                          }`}
                        >
                          <Icon size={12} />
                          <span>{amenity.name}</span>
                          {isAdded && <span className="text-green-600">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Amenity Input */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Add Custom Amenity</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter custom amenity (e.g., Spa, Balcony, Mini Bar)"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
                          setFormData({
                            ...formData,
                            amenities: [...formData.amenities, newAmenity.trim()]
                          });
                          setNewAmenity('');
                        }
                      }}
                      className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                {/* Selected Amenities with Icons */}
                {formData.amenities.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">Selected Amenities</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.amenities.map((amenity, index) => {
                        const Icon = getFacilityIcon(amenity);
                        return (
                          <div key={index} className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm border border-green-200">
                            <Icon size={14} />
                            <span>{amenity}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  amenities: formData.amenities.filter((_, i) => i !== index)
                                });
                              }}
                              className="text-green-600 hover:text-green-800 ml-1 font-bold"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Coordinates Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Latitude</label>
              <input
                type="number"
                step="any"
                placeholder="e.g., 3.0736"
                value={formData.latitude || ''}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">Decimal degrees (North Kaltara: ~2.8 to 4.0)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Longitude</label>
              <input
                type="number"
                step="any"
                placeholder="e.g., 117.1356"
                value={formData.longitude || ''}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">Decimal degrees (East Kaltara: ~116.8 to 117.7)</p>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">Featured Hotel</label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (hotel ? 'Update Hotel' : 'Create Hotel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
  loading = false
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantClasses = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${variantClasses[variant]}`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

interface StatusUpdateModalProps {
  isOpen: boolean;
  title: string;
  currentStatus: string;
  statusOptions: { value: string; label: string; color: string }[];
  onUpdate: (status: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function StatusUpdateModal({
  isOpen,
  title,
  currentStatus,
  statusOptions,
  onUpdate,
  onCancel,
  loading = false
}: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        
        <div className="space-y-3">
          {statusOptions.map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                value={option.value}
                checked={selectedStatus === option.value}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${option.color}`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onUpdate(selectedStatus)}
            disabled={loading || selectedStatus === currentStatus}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface BulkActionModalProps {
  isOpen: boolean;
  title: string;
  selectedCount: number;
  actions: { value: string; label: string; variant: 'danger' | 'warning' | 'success' }[];
  onAction: (action: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function BulkActionModal({
  isOpen,
  title,
  selectedCount,
  actions,
  onAction,
  onCancel,
  loading = false
}: BulkActionModalProps) {
  const [selectedAction, setSelectedAction] = useState('');

  if (!isOpen) return null;

  const actionVariants = {
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    success: 'bg-green-100 text-green-800'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">
          {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
        </p>
        
        <div className="space-y-2">
          {actions.map((action) => (
            <label key={action.value} className="flex items-center">
              <input
                type="radio"
                value={action.value}
                checked={selectedAction === action.value}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${actionVariants[action.variant]}`}>
                {action.label}
              </span>
            </label>
          ))}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onAction(selectedAction)}
            disabled={loading || !selectedAction}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Apply Action'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Toast({ 
  message, 
  variant = 'success', 
  isVisible, 
  onClose 
}: { 
  message: string; 
  variant?: 'success' | 'error' | 'warning'; 
  isVisible: boolean; 
  onClose: () => void; 
}) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const variantClasses = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black'
  };

  const emoji = {
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${variantClasses[variant]}`}>
        <span>{emoji[variant]}</span>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-current hover:opacity-75"
        >
          ×
        </button>
      </div>
    </div>
  );
}
