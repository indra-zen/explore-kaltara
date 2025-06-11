'use client';

import { useState, useEffect } from 'react';
import WeatherWidget from '@/components/WeatherWidget';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { CloudSun, MapPin, Calendar, TrendingUp, Info } from 'lucide-react';

export default function WeatherPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('Tarakan');

  const locations = [
    { name: 'Tarakan', description: 'Kota terbesar di Kaltara', emoji: '🏙️' },
    { name: 'Nunukan', description: 'Kota perbatasan strategis', emoji: '🌊' },
    { name: 'Malinau', description: 'Hutan hujan tropis', emoji: '🌿' },
    { name: 'Bulungan', description: 'Daerah pesisir timur', emoji: '🏖️' },
    { name: 'Tana Tidung', description: 'Kabupaten terkecil', emoji: '🏞️' }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1200);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Memuat informasi cuaca...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <CloudSun className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cuaca Kalimantan Utara</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pantau kondisi cuaca terkini di seluruh wilayah Kaltara untuk merencanakan perjalanan Anda
          </p>
        </div>

        {/* Location Selector */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Pilih Lokasi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {locations.map(location => (
                <button
                  key={location.name}
                  onClick={() => setSelectedLocation(location.name)}
                  className={`p-4 rounded-xl text-center transition-all duration-200 ${
                    selectedLocation === location.name
                      ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-2">{location.emoji}</div>
                  <div className="font-semibold text-sm">{location.name}</div>
                  <div className="text-xs opacity-75 mt-1">{location.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Weather Display */}
        <div className="max-w-4xl mx-auto mb-8">
          <WeatherWidget 
            location={selectedLocation}
            showForecast={true}
            className="mb-6"
          />
        </div>

        {/* All Locations Overview */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Ringkasan Cuaca Seluruh Kaltara
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map(location => (
                <WeatherWidget 
                  key={location.name}
                  location={location.name}
                  showForecast={false}
                  className="transform hover:scale-105 transition-transform cursor-pointer"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Weather Information */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Info className="w-5 h-5 mr-2 text-purple-600" />
              Informasi Cuaca Kaltara
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">🌦️ Iklim Tropis</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Kalimantan Utara memiliki iklim tropis dengan suhu rata-rata 26-32°C sepanjang tahun. 
                  Kelembaban tinggi (70-85%) dan curah hujan yang cukup tinggi.
                </p>
                
                <h4 className="font-semibold text-gray-900 mb-3">☔ Musim Hujan</h4>
                <p className="text-gray-600 text-sm">
                  Oktober - Maret: Musim hujan dengan intensitas tinggi, terutama di daerah pedalaman.
                  Suhu relatif lebih sejuk dengan angin yang lebih kencang.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">☀️ Musim Kemarau</h4>
                <p className="text-gray-600 text-sm mb-4">
                  April - September: Musim kemarau dengan cuaca cerah dan suhu yang lebih tinggi.
                  Waktu terbaik untuk aktivitas outdoor dan wisata pantai.
                </p>
                
                <h4 className="font-semibold text-gray-900 mb-3">💡 Tips Cuaca</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Selalu bawa payung atau jas hujan</li>
                  <li>• Gunakan tabir surya saat cuaca cerah</li>
                  <li>• Pakai pakaian ringan dan menyerap keringat</li>
                  <li>• Minum air yang cukup untuk mencegah dehidrasi</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Alert */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-amber-600" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Perencanaan Perjalanan</h4>
                <p className="text-amber-700 text-sm">
                  Gunakan informasi cuaca ini untuk merencanakan aktivitas wisata Anda. 
                  Kondisi cuaca dapat berubah dengan cepat di daerah tropis, jadi selalu periksa 
                  update terbaru sebelum bepergian.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
