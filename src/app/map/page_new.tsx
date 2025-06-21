'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Map from '@/components/Map';
import { PublicDataService } from '@/lib/supabase/public-service';
import LoadingState from '@/components/LoadingState';

interface Destination {
  id: string;
  name: string;
  slug: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  rating: number;
}

interface Hotel {
  id: string;
  name: string;
  slug: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  rating: number;
}

export default function InteractiveMapPage() {
  const [showDestinations, setShowDestinations] = useState(true);
  const [showHotels, setShowHotels] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [destinationsResult, hotelsResult] = await Promise.all([
          PublicDataService.getDestinations(),
          PublicDataService.getHotels()
        ]);

        // Filter out items without coordinates
        const destinationsWithCoords = destinationsResult.data.filter((d: any) => 
          d.latitude !== null && d.longitude !== null
        );
        const hotelsWithCoords = hotelsResult.data.filter((h: any) => 
          h.latitude !== null && h.longitude !== null
        );

        setDestinations(destinationsWithCoords);
        setHotels(hotelsWithCoords);
      } catch (error) {
        console.error('Error fetching map data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingState />
        </div>
      </div>
    );
  }

  // Get unique locations
  const locations = [...new Set([
    ...destinations.map(d => d.location),
    ...hotels.map(h => h.location)
  ])];

  // Filter data based on selected location
  const filteredDestinations = selectedLocation === 'all' 
    ? destinations 
    : destinations.filter(d => d.location === selectedLocation);

  const filteredHotels = selectedLocation === 'all'
    ? hotels
    : hotels.filter(h => h.location === selectedLocation);

  // Prepare markers for map
  const markers = [
    ...(showDestinations ? filteredDestinations.map(dest => ({
      position: [dest.latitude!, dest.longitude!] as [number, number],
      title: `🏞️ ${dest.name}`,
      description: `${dest.location} • Rating: ${dest.rating}/5`,
      link: `/destinations/${dest.slug}`
    })) : []),
    ...(showHotels ? filteredHotels.map(hotel => ({
      position: [hotel.latitude!, hotel.longitude!] as [number, number],
      title: `🏨 ${hotel.name}`,
      description: `${hotel.location} • Rating: ${hotel.rating}/5`,
      link: `/hotels/${hotel.slug}`
    })) : [])
  ];

  // Center map on Kaltara region
  const kaltaraCenter: [number, number] = [3.0, 117.0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <div className="bg-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Peta Interaktif Kaltara</h1>
          <p className="text-xl text-emerald-100">Jelajahi destinasi dan hotel di Kalimantan Utara secara visual</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Kontrol Peta</h3>
              
              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Lokasi</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">Semua Lokasi</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Show/Hide Controls */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Tampilkan di Peta</label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showDestinations}
                      onChange={(e) => setShowDestinations(e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">🏞️ Destinasi Wisata ({filteredDestinations.length})</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showHotels}
                      onChange={(e) => setShowHotels(e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">🏨 Hotel & Penginapan ({filteredHotels.length})</span>
                  </label>
                </div>
              </div>

              {/* Legend */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Legenda</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">🏞️</span>
                    <span>Destinasi Wisata</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg mr-2">🏨</span>
                    <span>Hotel & Penginapan</span>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-emerald-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Statistik</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Total Marker: {markers.length}</div>
                  <div>Destinasi: {showDestinations ? filteredDestinations.length : 0}</div>
                  <div>Hotel: {showHotels ? filteredHotels.length : 0}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Peta Kalimantan Utara</h2>
                <p className="text-gray-600 mt-1">Klik marker untuk melihat detail lokasi</p>
              </div>
              
              <Map
                center={kaltaraCenter}
                zoom={8}
                markers={markers}
                height="600px"
                className="w-full"
              />
            </div>

            {/* Quick Links */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <Link href="/destinations" className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">🏞️</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Jelajahi Semua Destinasi</h3>
                    <p className="text-gray-600">Lihat daftar lengkap destinasi wisata</p>
                  </div>
                </div>
              </Link>

              <Link href="/hotels" className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">🏨</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Cari Hotel & Penginapan</h3>
                    <p className="text-gray-600">Temukan akomodasi terbaik</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
