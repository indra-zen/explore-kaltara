'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Plus, X, Save, Download, Star } from 'lucide-react';
import destinationsData from '@/data/destinations.json';
import hotelsData from '@/data/hotels.json';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Header from '@/components/Header';
import Link from 'next/link';

interface TripDay {
  id: string;
  date: string;
  activities: TripActivity[];
}

interface TripActivity {
  id: string;
  type: 'destination' | 'hotel' | 'transport' | 'meal';
  itemId?: string;
  title: string;
  location: string;
  time: string;
  duration: string;
  notes: string;
  cost?: number;
}

interface TripPlan {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  days: TripDay[];
  createdAt: string;
}

export default function TripPlannerPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrip, setCurrentTrip] = useState<TripPlan | null>(null);
  const [savedTrips, setSavedTrips] = useState<TripPlan[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showActivityForm, setShowActivityForm] = useState(false);

  // Form states
  const [tripForm, setTripForm] = useState({
    title: '',
    destination: 'Tarakan',
    startDate: '',
    endDate: '',
    travelers: 2,
    budget: 5000000
  });

  const [activityForm, setActivityForm] = useState({
    type: 'destination' as TripActivity['type'],
    itemId: '',
    title: '',
    location: '',
    time: '09:00',
    duration: '2',
    notes: '',
    cost: 0
  });

  const locations = ['Tarakan', 'Nunukan', 'Malinau', 'Bulungan', 'Tana Tidung'];

  useEffect(() => {
    // Load saved trips from localStorage
    const saved = localStorage.getItem('kaltara-trips');
    if (saved) {
      setSavedTrips(JSON.parse(saved));
    }
    
    // Simulate loading
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const createNewTrip = () => {
    if (!tripForm.title || !tripForm.startDate || !tripForm.endDate) return;

    const startDate = new Date(tripForm.startDate);
    const endDate = new Date(tripForm.endDate);
    const days: TripDay[] = [];

    // Generate days between start and end date
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push({
        id: `day-${d.getTime()}`,
        date: d.toISOString().split('T')[0],
        activities: []
      });
    }

    const newTrip: TripPlan = {
      id: `trip-${Date.now()}`,
      title: tripForm.title,
      destination: tripForm.destination,
      startDate: tripForm.startDate,
      endDate: tripForm.endDate,
      travelers: tripForm.travelers,
      budget: tripForm.budget,
      days,
      createdAt: new Date().toISOString()
    };

    setCurrentTrip(newTrip);
    setSelectedDay(days[0]?.id || null);
    setShowCreateForm(false);
    setTripForm({
      title: '',
      destination: 'Tarakan',
      startDate: '',
      endDate: '',
      travelers: 2,
      budget: 5000000
    });
  };

  const addActivity = () => {
    if (!currentTrip || !selectedDay || !activityForm.title) return;

    const newActivity: TripActivity = {
      id: `activity-${Date.now()}`,
      ...activityForm
    };

    const updatedTrip = {
      ...currentTrip,
      days: currentTrip.days.map(day => 
        day.id === selectedDay 
          ? { ...day, activities: [...day.activities, newActivity] }
          : day
      )
    };

    setCurrentTrip(updatedTrip);
    setShowActivityForm(false);
    setActivityForm({
      type: 'destination',
      itemId: '',
      title: '',
      location: '',
      time: '09:00',
      duration: '2',
      notes: '',
      cost: 0
    });
  };

  const removeActivity = (dayId: string, activityId: string) => {
    if (!currentTrip) return;

    const updatedTrip = {
      ...currentTrip,
      days: currentTrip.days.map(day => 
        day.id === dayId 
          ? { ...day, activities: day.activities.filter(a => a.id !== activityId) }
          : day
      )
    };

    setCurrentTrip(updatedTrip);
  };

  const saveTrip = () => {
    if (!currentTrip) return;

    const updatedTrips = [...savedTrips.filter(t => t.id !== currentTrip.id), currentTrip];
    setSavedTrips(updatedTrips);
    localStorage.setItem('kaltara-trips', JSON.stringify(updatedTrips));
    alert('Rencana perjalanan berhasil disimpan!');
  };

  const exportTrip = () => {
    if (!currentTrip) return;

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentTrip, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${currentTrip.title.replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const getTotalCost = () => {
    if (!currentTrip) return 0;
    return currentTrip.days.reduce((total, day) => 
      total + day.activities.reduce((dayTotal, activity) => dayTotal + (activity.cost || 0), 0), 0
    );
  };

  const getActivityIcon = (type: TripActivity['type']) => {
    switch (type) {
      case 'destination': return '🏞️';
      case 'hotel': return '🏨';
      case 'transport': return '🚗';
      case 'meal': return '🍽️';
      default: return '📍';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Memuat Trip Planner...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentTrip && !showCreateForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Trip Planner</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Rencanakan perjalanan impian Anda ke Kalimantan Utara dengan mudah dan terorganisir
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Buat Rencana Baru</span>
            </button>
          </div>

          {/* Saved Trips */}
          {savedTrips.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Rencana Tersimpan</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {savedTrips.map(trip => (
                  <div key={trip.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{trip.title}</h3>
                        <p className="text-gray-600">{trip.destination}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {new Date(trip.startDate).toLocaleDateString('id-ID')} - {new Date(trip.endDate).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{trip.travelers} orang</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{trip.days.length} hari</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setCurrentTrip(trip)}
                      className="w-full bg-emerald-50 text-emerald-600 py-2 rounded-lg font-medium hover:bg-emerald-100 transition-colors"
                    >
                      Buka Rencana
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Fitur Trip Planner</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Perencanaan Harian</h3>
                <p className="text-gray-600">Atur aktivitas harian dengan detail waktu dan lokasi</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Integrasi Destinasi</h3>
                <p className="text-gray-600">Pilih dari database destinasi dan hotel Kaltara</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Save className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Simpan & Export</h3>
                <p className="text-gray-600">Simpan rencana dan export untuk dibagikan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Buat Rencana Perjalanan Baru</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); createNewTrip(); }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Perjalanan
                  </label>
                  <input
                    type="text"
                    value={tripForm.title}
                    onChange={(e) => setTripForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Liburan ke Kaltara"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destinasi Utama
                  </label>
                  <select
                    value={tripForm.destination}
                    onChange={(e) => setTripForm(prev => ({ ...prev, destination: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={tripForm.startDate}
                      onChange={(e) => setTripForm(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Selesai
                    </label>
                    <input
                      type="date"
                      value={tripForm.endDate}
                      onChange={(e) => setTripForm(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah Traveler
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={tripForm.travelers}
                      onChange={(e) => setTripForm(prev => ({ ...prev, travelers: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget (Rp)
                    </label>
                    <input
                      type="number"
                      value={tripForm.budget}
                      onChange={(e) => setTripForm(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Buat Rencana
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentTrip?.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{currentTrip?.destination}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(currentTrip?.startDate || '').toLocaleDateString('id-ID')} - {new Date(currentTrip?.endDate || '').toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{currentTrip?.travelers} orang</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button
                onClick={saveTrip}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan</span>
              </button>
              <button
                onClick={exportTrip}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={() => setCurrentTrip(null)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Tutup</span>
              </button>
            </div>
          </div>

          {/* Budget Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Budget Awal</p>
                <p className="text-lg font-semibold text-gray-900">Rp {currentTrip?.budget.toLocaleString('id-ID')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Pengeluaran</p>
                <p className="text-lg font-semibold text-gray-900">Rp {getTotalCost().toLocaleString('id-ID')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sisa Budget</p>
                <p className={`text-lg font-semibold ${(currentTrip?.budget || 0) - getTotalCost() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Rp {((currentTrip?.budget || 0) - getTotalCost()).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Days */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Days Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hari Perjalanan</h3>
              <div className="space-y-2">
                {currentTrip?.days.map((day, index) => (
                  <button
                    key={day.id}
                    onClick={() => setSelectedDay(day.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedDay === day.id 
                        ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200' 
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="font-medium">Hari {index + 1}</div>
                    <div className="text-sm text-gray-600">{new Date(day.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
                    <div className="text-xs text-gray-500 mt-1">{day.activities.length} aktivitas</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Day Details */}
          <div className="lg:col-span-3">
            {selectedDay && currentTrip && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Hari {currentTrip.days.findIndex(d => d.id === selectedDay) + 1}
                    </h3>
                    <p className="text-gray-600">
                      {new Date(currentTrip.days.find(d => d.id === selectedDay)?.date || '').toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowActivityForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Aktivitas</span>
                  </button>
                </div>

                {/* Activities */}
                <div className="space-y-4">
                  {currentTrip.days.find(d => d.id === selectedDay)?.activities.map(activity => (
                    <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                            <div>
                              <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                              <p className="text-sm text-gray-600">{activity.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{activity.time}</span>
                            </div>
                            <span>•</span>
                            <span>{activity.duration} jam</span>
                            {activity.cost && activity.cost > 0 && (
                              <>
                                <span>•</span>
                                <span>Rp {activity.cost.toLocaleString('id-ID')}</span>
                              </>
                            )}
                          </div>
                          {activity.notes && (
                            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{activity.notes}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeActivity(selectedDay, activity.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Belum ada aktivitas untuk hari ini</p>
                      <p className="text-sm">Klik &quot;Tambah Aktivitas&quot; untuk mulai merencanakan</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Activity Modal */}
        {showActivityForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Tambah Aktivitas</h3>
                <button
                  onClick={() => setShowActivityForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); addActivity(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Aktivitas
                  </label>
                  <select
                    value={activityForm.type}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, type: e.target.value as TripActivity['type'] }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="destination">Destinasi Wisata</option>
                    <option value="hotel">Hotel/Penginapan</option>
                    <option value="transport">Transportasi</option>
                    <option value="meal">Makan/Kuliner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Aktivitas
                  </label>
                  <input
                    type="text"
                    value={activityForm.title}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Contoh: Kunjungi Pantai Amal"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    value={activityForm.location}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Contoh: Tarakan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waktu
                    </label>
                    <input
                      type="time"
                      value={activityForm.time}
                      onChange={(e) => setActivityForm(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durasi (jam)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={activityForm.duration}
                      onChange={(e) => setActivityForm(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimasi Biaya (Rp)
                  </label>
                  <input
                    type="number"
                    value={activityForm.cost}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan
                  </label>
                  <textarea
                    value={activityForm.notes}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    rows={3}
                    placeholder="Catatan tambahan..."
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowActivityForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Tambah Aktivitas
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
