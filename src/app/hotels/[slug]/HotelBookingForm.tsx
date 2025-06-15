'use client';

import { useState } from 'react';
import Link from 'next/link';

interface HotelBookingFormProps {
  hotel: any;
}

export default function HotelBookingForm({ hotel }: HotelBookingFormProps) {
  const [bookingDates, setBookingDates] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const handleBookingChange = (field: string, value: string | number) => {
    setBookingDates(prev => ({ ...prev, [field]: value }));
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-emerald-50 rounded-2xl p-6 mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Pesan Kamar</h3>
      <div className="space-y-4">
        <div>
          <span className="text-2xl font-bold text-emerald-600">{hotel.priceRange.split(' - ')[0]}</span>
          <span className="text-gray-600"> / malam</span>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
            <input 
              type="date" 
              value={bookingDates.checkIn}
              min={today}
              onChange={(e) => handleBookingChange('checkIn', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
            <input 
              type="date" 
              value={bookingDates.checkOut}
              min={bookingDates.checkIn || today}
              onChange={(e) => handleBookingChange('checkOut', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Tamu</label>
            <select 
              value={bookingDates.guests}
              onChange={(e) => handleBookingChange('guests', parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white"
            >
              <option value={1}>1 Tamu</option>
              <option value={2}>2 Tamu</option>
              <option value={3}>3 Tamu</option>
              <option value={4}>4 Tamu</option>
            </select>
          </div>
        </div>        <Link 
          href={`/booking?item=${hotel.id}&type=hotel&checkIn=${bookingDates.checkIn}&checkOut=${bookingDates.checkOut}&guests=${bookingDates.guests}`}
          className={`block w-full py-3 rounded-lg font-semibold transition-colors text-center ${
            bookingDates.checkIn && bookingDates.checkOut
              ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={(e) => {
            if (!bookingDates.checkIn || !bookingDates.checkOut) {
              e.preventDefault();
              alert('Silakan pilih tanggal check-in dan check-out terlebih dahulu');
            }
          }}
        >
          Pesan Sekarang
        </Link>
        
        <div className="text-center text-sm text-gray-600">
          Tidak ada biaya tersembunyi
        </div>
      </div>
    </div>
  );
}
