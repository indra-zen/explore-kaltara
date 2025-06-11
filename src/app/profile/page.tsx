'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import BookingManager from '@/components/BookingManager';
import { User, Mail, Calendar, MapPin, Heart, Settings, Camera, Save, X, CreditCard } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    preferences: {
      favoriteLocations: [] as string[],
      interests: [] as string[],
      travelStyle: 'mid-range' as 'budget' | 'mid-range' | 'luxury'
    }
  });

  const availableLocations = ['Tarakan', 'Nunukan', 'Malinau', 'Bulungan', 'Tana Tidung'];
  const availableInterests = ['Alam', 'Budaya', 'Kuliner', 'Pantai', 'Adventure', 'Fotografi', 'Sejarah', 'Religi'];
  const travelStyles = [
    { value: 'budget', label: 'Budget (Hemat)', description: 'Perjalanan dengan biaya terjangkau' },
    { value: 'mid-range', label: 'Mid-range (Standar)', description: 'Keseimbangan antara kenyamanan dan biaya' },
    { value: 'luxury', label: 'Luxury (Mewah)', description: 'Pengalaman premium dan eksklusif' }
  ];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name,
        email: user.email,
        preferences: user.preferences
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateProfile({
      name: editForm.name,
      email: editForm.email,
      preferences: editForm.preferences
    });
    
    if (success) {
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const toggleLocation = (location: string) => {
    setEditForm(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        favoriteLocations: prev.preferences.favoriteLocations.includes(location)
          ? prev.preferences.favoriteLocations.filter(l => l !== location)
          : [...prev.preferences.favoriteLocations, location]
      }
    }));
  };

  const toggleInterest = (interest: string) => {
    setEditForm(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        interests: prev.preferences.interests.includes(interest)
          ? prev.preferences.interests.filter(i => i !== interest)
          : [...prev.preferences.interests, interest]
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-600 flex items-center justify-center">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
                <button className="absolute bottom-2 right-2 bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                <p className="text-gray-600 mb-4">{user.email}</p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Bergabung {new Date(user.joinDate).toLocaleDateString('id-ID', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.preferences.favoriteLocations.length} lokasi favorit</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{user.preferences.interests.length} minat</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="mt-6 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                >
                  {isEditing ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                  <span>{isEditing ? 'Batal Edit' : 'Edit Profil'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Profil</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === 'bookings'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Booking</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'profile' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-emerald-600" />
                Informasi Personal
              </h2>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Nama Lengkap</p>
                      <p className="font-medium text-gray-900">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Travel Preferences */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-emerald-600" />
                Preferensi Perjalanan
              </h2>

              <div className="space-y-6">
                {/* Travel Style */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Gaya Perjalanan</label>
                  {isEditing ? (
                    <div className="space-y-2">
                      {travelStyles.map(style => (
                        <label key={style.value} className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="travelStyle"
                            value={style.value}
                            checked={editForm.preferences.travelStyle === style.value}
                            onChange={(e) => setEditForm(prev => ({
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                travelStyle: e.target.value as 'budget' | 'mid-range' | 'luxury'
                              }
                            }))}
                            className="mt-1 text-emerald-600"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{style.label}</p>
                            <p className="text-sm text-gray-500">{style.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="font-medium text-emerald-800">
                        {travelStyles.find(s => s.value === user.preferences.travelStyle)?.label}
                      </p>
                      <p className="text-sm text-emerald-600">
                        {travelStyles.find(s => s.value === user.preferences.travelStyle)?.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Favorite Locations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Lokasi Favorit</label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-2">
                      {availableLocations.map(location => (
                        <label key={location} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editForm.preferences.favoriteLocations.includes(location)}
                            onChange={() => toggleLocation(location)}
                            className="text-emerald-600 rounded"
                          />
                          <span className="text-sm text-gray-700">{location}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.preferences.favoriteLocations.map(location => (
                        <span key={location} className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
                          {location}
                        </span>
                      ))}
                      {user.preferences.favoriteLocations.length === 0 && (
                        <span className="text-gray-500 text-sm">Belum ada lokasi favorit</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Minat Wisata</label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-2">
                      {availableInterests.map(interest => (
                        <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editForm.preferences.interests.includes(interest)}
                            onChange={() => toggleInterest(interest)}
                            className="text-emerald-600 rounded"
                          />
                          <span className="text-sm text-gray-700">{interest}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.preferences.interests.map(interest => (
                        <span key={interest} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {interest}
                        </span>
                      ))}
                      {user.preferences.interests.length === 0 && (
                        <span className="text-gray-500 text-sm">Belum ada minat yang dipilih</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <BookingManager />
          )}

          {/* Save Button for Profile Tab */}
          {activeTab === 'profile' && isEditing && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSaving ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
