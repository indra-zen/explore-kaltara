'use client';

import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, Droplets, Eye } from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'overcast';
  forecast: {
    day: string;
    temp: number;
    condition: string;
  }[];
}

interface WeatherWidgetProps {
  location: string;
  className?: string;
  showForecast?: boolean;
}

// Mock weather data for Kaltara locations
const mockWeatherData: Record<string, WeatherData> = {
  'Tarakan': {
    location: 'Tarakan',
    temperature: 29,
    description: 'Cerah berawan',
    humidity: 78,
    windSpeed: 12,
    visibility: 10,
    condition: 'cloudy' as const,
    forecast: [
      { day: 'Besok', temp: 30, condition: 'Cerah' },
      { day: 'Lusa', temp: 28, condition: 'Hujan ringan' },
      { day: 'Senin', temp: 31, condition: 'Cerah' },
      { day: 'Selasa', temp: 29, condition: 'Berawan' },
    ]
  },
  'Nunukan': {
    location: 'Nunukan',
    temperature: 28,
    description: 'Hujan ringan',
    humidity: 85,
    windSpeed: 15,
    visibility: 8,
    condition: 'rainy' as const,
    forecast: [
      { day: 'Besok', temp: 29, condition: 'Berawan' },
      { day: 'Lusa', temp: 27, condition: 'Hujan' },
      { day: 'Senin', temp: 30, condition: 'Cerah' },
      { day: 'Selasa', temp: 28, condition: 'Cerah berawan' },
    ]
  },
  'Malinau': {
    location: 'Malinau',
    temperature: 26,
    description: 'Berawan',
    humidity: 80,
    windSpeed: 8,
    visibility: 12,
    condition: 'overcast' as const,
    forecast: [
      { day: 'Besok', temp: 27, condition: 'Cerah berawan' },
      { day: 'Lusa', temp: 25, condition: 'Hujan ringan' },
      { day: 'Senin', temp: 29, condition: 'Cerah' },
      { day: 'Selasa', temp: 26, condition: 'Hujan ringan' },
    ]
  },
  'Bulungan': {
    location: 'Bulungan',
    temperature: 30,
    description: 'Cerah',
    humidity: 70,
    windSpeed: 10,
    visibility: 15,
    condition: 'sunny' as const,
    forecast: [
      { day: 'Besok', temp: 31, condition: 'Cerah' },
      { day: 'Lusa', temp: 30, condition: 'Cerah berawan' },
      { day: 'Senin', temp: 29, condition: 'Berawan' },
      { day: 'Selasa', temp: 28, condition: 'Hujan ringan' },
    ]
  },
  'Tana Tidung': {
    location: 'Tana Tidung',
    temperature: 27,
    description: 'Cerah berawan',
    humidity: 75,
    windSpeed: 9,
    visibility: 11,
    condition: 'cloudy' as const,
    forecast: [
      { day: 'Besok', temp: 28, condition: 'Cerah' },
      { day: 'Lusa', temp: 27, condition: 'Berawan' },
      { day: 'Senin', temp: 29, condition: 'Cerah berawan' },
      { day: 'Selasa', temp: 26, condition: 'Hujan' },
    ]
  }
};

export default function WeatherWidget({ location, className = '', showForecast = false }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const weatherData = mockWeatherData[location] || mockWeatherData['Tarakan'];
        setWeather(weatherData);
      } catch (err) {
        setError('Gagal memuat data cuaca');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="w-6 h-6 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="w-6 h-6 text-blue-500" />;
      case 'overcast':
        return <Cloud className="w-6 h-6 text-gray-600" />;
      default:
        return <Sun className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return 'from-yellow-400 to-orange-500';
      case 'cloudy':
        return 'from-gray-400 to-gray-600';
      case 'rainy':
        return 'from-blue-400 to-blue-600';
      case 'overcast':
        return 'from-gray-500 to-gray-700';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
          {showForecast && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-300 rounded"></div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
        <div className="text-center text-red-500">
          <Cloud className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className={`bg-gradient-to-br ${getConditionColor(weather.condition)} rounded-2xl shadow-lg p-6 text-white ${className}`}>
      {/* Main Weather Info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">{weather.location}</h3>
          <div className="flex items-center space-x-3">
            {getWeatherIcon(weather.condition)}
            <span className="text-3xl font-bold">{weather.temperature}°C</span>
          </div>
          <p className="text-sm opacity-90 mt-1">{weather.description}</p>
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <Droplets className="w-4 h-4 mx-auto mb-1 opacity-75" />
          <p className="text-xs opacity-75">Kelembaban</p>
          <p className="text-sm font-semibold">{weather.humidity}%</p>
        </div>
        <div className="text-center">
          <Wind className="w-4 h-4 mx-auto mb-1 opacity-75" />
          <p className="text-xs opacity-75">Angin</p>
          <p className="text-sm font-semibold">{weather.windSpeed} km/h</p>
        </div>
        <div className="text-center">
          <Eye className="w-4 h-4 mx-auto mb-1 opacity-75" />
          <p className="text-xs opacity-75">Jarak pandang</p>
          <p className="text-sm font-semibold">{weather.visibility} km</p>
        </div>
      </div>

      {/* Forecast */}
      {showForecast && (
        <div className="border-t border-white border-opacity-20 pt-4">
          <h4 className="text-sm font-semibold mb-3 opacity-90">Prakiraan 4 Hari</h4>
          <div className="grid grid-cols-4 gap-2">
            {weather.forecast.map((day, index) => (
              <div key={index} className="text-center bg-white bg-opacity-10 rounded-lg p-2">
                <p className="text-xs font-medium mb-1">{day.day}</p>
                <p className="text-sm font-bold">{day.temp}°</p>
                <p className="text-xs opacity-75">{day.condition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weather Tips */}
      <div className="mt-4 p-3 bg-white bg-opacity-10 rounded-lg">
        <p className="text-xs opacity-90">
          {weather.condition === 'rainy' && '🌧️ Jangan lupa bawa payung!'}
          {weather.condition === 'sunny' && '☀️ Cuaca cerah, waktu yang tepat untuk berwisata!'}
          {weather.condition === 'cloudy' && '⛅ Cuaca nyaman untuk aktivitas outdoor.'}
          {weather.condition === 'overcast' && '☁️ Cuaca mendung, bersiap untuk kemungkinan hujan.'}
        </p>
      </div>
    </div>
  );
}
