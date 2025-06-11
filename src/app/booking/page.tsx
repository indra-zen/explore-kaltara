'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, MapPin, Users, Clock, CreditCard, Check, ArrowLeft, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import destinationsData from '@/data/destinations.json';
import hotelsData from '@/data/hotels.json';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

interface BookingItem {
  id: string;
  type: 'hotel' | 'destination';
  name: string;
  location: string;
  image: string;
  rating: number;
  price: number;
  description: string;
}

interface BookingForm {
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  specialRequests: string;
}

interface PaymentForm {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
  billingAddress: string;
  city: string;
  postalCode: string;
}

export default function BookingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [bookingItem, setBookingItem] = useState<BookingItem | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1,
    specialRequests: ''
  });
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    billingAddress: '',
    city: '',
    postalCode: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const itemId = searchParams.get('item');
    const type = searchParams.get('type') as 'hotel' | 'destination';

    if (!itemId || !type) {
      router.push('/');
      return;
    }

    // Find the item from data
    let item: BookingItem | null = null;

    if (type === 'hotel') {
      const hotel = hotelsData.find(h => h.id === itemId);
      if (hotel) {
        // Extract price from priceRange string (e.g., "IDR 800,000 - IDR 1,500,000")
        const priceMatch = hotel.priceRange.match(/IDR ([\d,]+)/);
        const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 800000;
        
        item = {
          id: hotel.id,
          type: 'hotel',
          name: hotel.name,
          location: hotel.location,
          image: hotel.image,
          rating: hotel.rating,
          price: price,
          description: hotel.description
        };
      }
    } else if (type === 'destination') {
      const destination = destinationsData.find(d => d.id === itemId);
      if (destination) {
        // Extract price from ticketPrice or use default
        const priceMatch = destination.ticketPrice.match(/[\d,]+/);
        const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 250000;
        
        item = {
          id: destination.id,
          type: 'destination',
          name: destination.name,
          location: destination.location,
          image: destination.image,
          rating: destination.rating,
          price: price,
          description: destination.description
        };
      }
    }

    setBookingItem(item);
    setIsLoading(false);
  }, [searchParams, router]);

  // Load and save booking draft
  useEffect(() => {
    const itemId = searchParams.get('item');
    const draftKey = `booking-draft-${itemId}`;
    const savedDraft = localStorage.getItem(draftKey);
    
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setBookingForm(draft.bookingForm || bookingForm);
        setPaymentForm(draft.paymentForm || paymentForm);
        setCurrentStep(draft.currentStep || 1);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [searchParams]);

  // Auto-save draft
  useEffect(() => {
    if (bookingItem) {
      const draftKey = `booking-draft-${bookingItem.id}`;
      const draft = {
        bookingForm,
        paymentForm,
        currentStep,
        timestamp: Date.now()
      };
      localStorage.setItem(draftKey, JSON.stringify(draft));
    }
  }, [bookingForm, paymentForm, currentStep, bookingItem]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setPaymentForm(prev => ({ ...prev, cardNumber: formatted }));
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setPaymentForm(prev => ({ ...prev, expiryDate: formatted }));
    }
  };

  const calculateNights = () => {
    if (!bookingForm.checkIn || !bookingForm.checkOut) return 0;
    const checkIn = new Date(bookingForm.checkIn);
    const checkOut = new Date(bookingForm.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!bookingItem) return 0;
    const nights = calculateNights();
    const basePrice = bookingItem.price * bookingForm.rooms * (bookingItem.type === 'hotel' ? nights : 1);
    const tax = basePrice * 0.1; // 10% tax
    const serviceFee = basePrice * 0.05; // 5% service fee
    return basePrice + tax + serviceFee;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Silakan login terlebih dahulu untuk melakukan booking.');
      return;
    }

    // Validate dates
    if (bookingItem?.type === 'hotel') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const checkInDate = new Date(bookingForm.checkIn);
      const checkOutDate = new Date(bookingForm.checkOut);
      
      if (checkInDate < today) {
        alert('Tanggal check-in tidak boleh sebelum hari ini.');
        return;
      }
      
      if (checkOutDate <= checkInDate) {
        alert('Tanggal check-out harus setelah tanggal check-in.');
        return;
      }
      
      if (!bookingForm.checkIn || !bookingForm.checkOut) {
        alert('Silakan pilih tanggal check-in dan check-out.');
        return;
      }
    }

    setShowConfirmModal(true);
  };

  const confirmBooking = () => {
    setShowConfirmModal(false);
    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate payment form
    if (!paymentForm.cardNumber || paymentForm.cardNumber.length < 16) {
      alert('Nomor kartu tidak valid.');
      return;
    }
    
    if (!paymentForm.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentForm.expiryDate)) {
      alert('Tanggal kedaluwarsa tidak valid. Format: MM/YY');
      return;
    }
    
    if (!paymentForm.cvv || paymentForm.cvv.length < 3) {
      alert('CVV tidak valid.');
      return;
    }
    
    if (!paymentForm.cardHolder.trim()) {
      alert('Nama pemegang kartu tidak boleh kosong.');
      return;
    }
    
    if (!paymentForm.billingAddress.trim() || !paymentForm.city.trim() || !paymentForm.postalCode.trim()) {
      alert('Alamat billing harus lengkap.');
      return;
    }
    
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate booking ID
    const newBookingId = `KLT-${Date.now().toString().slice(-6)}`;
    setBookingId(newBookingId);

    // Save booking to localStorage (in real app, this would be API call)
    const booking = {
      id: newBookingId,
      userId: user?.id,
      item: bookingItem,
      details: bookingForm,
      payment: { ...paymentForm, cardNumber: paymentForm.cardNumber.replace(/\d(?=\d{4})/g, '*') },
      total: calculateTotal(),
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    const existingBookings = JSON.parse(localStorage.getItem('kaltara-bookings') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('kaltara-bookings', JSON.stringify(existingBookings));

    // Clear booking draft
    if (bookingItem) {
      const draftKey = `booking-draft-${bookingItem.id}`;
      localStorage.removeItem(draftKey);
    }

    setIsProcessing(false);
    setBookingComplete(true);
    setCurrentStep(3);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Memuat informasi booking...</p>
        </div>
      </div>
    );
  }

  if (!bookingItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Item tidak ditemukan</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Kembali ke beranda
          </Link>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Berhasil!</h1>
          <p className="text-gray-600 mb-6">
            Terima kasih! Booking Anda telah dikonfirmasi.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Detail Booking</h3>
            <p className="text-sm text-gray-600">Booking ID: <span className="font-mono font-semibold">{bookingId}</span></p>
            <p className="text-sm text-gray-600">Total: <span className="font-semibold">Rp {calculateTotal().toLocaleString('id-ID')}</span></p>
          </div>

          <div className="space-y-3">
            <Link 
              href="/profile" 
              className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Lihat Booking Saya
            </Link>
            <Link 
              href="/" 
              className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
      {/* Confirmation Modal */}
      {showConfirmModal && bookingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Konfirmasi Booking</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">{bookingItem.type === 'hotel' ? 'Hotel' : 'Destinasi'}:</span>
                <span className="font-medium">{bookingItem.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lokasi:</span>
                <span className="font-medium">{bookingItem.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {bookingItem.type === 'hotel' ? 'Check-in' : 'Tanggal'}:
                </span>
                <span className="font-medium">
                  {new Date(bookingForm.checkIn).toLocaleDateString('id-ID')}
                </span>
              </div>
              {bookingItem.type === 'hotel' && bookingForm.checkOut && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-medium">
                    {new Date(bookingForm.checkOut).toLocaleDateString('id-ID')}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Tamu:</span>
                <span className="font-medium">{bookingForm.guests} orang</span>
              </div>
              {bookingItem.type === 'hotel' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Kamar:</span>
                  <span className="font-medium">{bookingForm.rooms} kamar</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-blue-600">Rp {calculateTotal().toLocaleString('id-ID')}</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmBooking}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Lanjut Bayar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-20 h-1 mx-4 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm font-medium">
            <span className={currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'}>Detail Booking</span>
            <span className={currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}>Pembayaran</span>
            <span className={currentStep >= 3 ? 'text-blue-600' : 'text-gray-500'}>Konfirmasi</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Booking Details */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Detail Booking</h2>
                
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {bookingItem.type === 'hotel' ? 'Check-in' : 'Tanggal Kunjungan'}
                      </label>
                      <input
                        type="date"
                        value={bookingForm.checkIn}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, checkIn: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    {bookingItem.type === 'hotel' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Check-out
                        </label>
                        <input
                          type="date"
                          value={bookingForm.checkOut}
                          min={bookingForm.checkIn || new Date().toISOString().split('T')[0]}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, checkOut: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jumlah Tamu
                      </label>
                      <select
                        value={bookingForm.guests}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {[1,2,3,4,5,6,7,8].map(num => (
                          <option key={num} value={num}>{num} orang</option>
                        ))}
                      </select>
                    </div>
                    {bookingItem.type === 'hotel' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jumlah Kamar
                        </label>
                        <select
                          value={bookingForm.rooms}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, rooms: parseInt(e.target.value) }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {[1,2,3,4,5].map(num => (
                            <option key={num} value={num}>{num} kamar</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permintaan Khusus (Opsional)
                    </label>
                    <textarea
                      value={bookingForm.specialRequests}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contoh: Kamar non-smoking, lantai tinggi, dekat dengan elevator..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Lanjut ke Pembayaran
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informasi Pembayaran</h2>
                
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Kartu
                    </label>
                    <input
                      type="text"
                      value={paymentForm.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Kadaluarsa
                      </label>
                      <input
                        type="text"
                        value={paymentForm.expiryDate}
                        onChange={handleExpiryDateChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={paymentForm.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          if (value.length <= 4) {
                            setPaymentForm(prev => ({ ...prev, cvv: value }));
                          }
                        }}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Pemegang Kartu
                    </label>
                    <input
                      type="text"
                      value={paymentForm.cardHolder}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, cardHolder: e.target.value }))}
                      placeholder="Nama sesuai di kartu"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Penagihan
                    </label>
                    <input
                      type="text"
                      value={paymentForm.billingAddress}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, billingAddress: e.target.value }))}
                      placeholder="Alamat lengkap"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kota
                      </label>
                      <input
                        type="text"
                        value={paymentForm.city}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Nama kota"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kode Pos
                      </label>
                      <input
                        type="text"
                        value={paymentForm.postalCode}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, postalCode: e.target.value }))}
                        placeholder="12345"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner size="sm" />
                        <span>Memproses Pembayaran...</span>
                      </div>
                    ) : (
                      'Bayar Sekarang'
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ringkasan Booking</h3>
            
            {/* Item Details */}
            <div className="border rounded-lg p-4 mb-6">
              <img
                src={bookingItem.image}
                alt={bookingItem.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h4 className="font-semibold text-gray-900 mb-1">{bookingItem.name}</h4>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{bookingItem.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{bookingItem.rating}</span>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {bookingItem.type === 'hotel' ? 'Check-in' : 'Tanggal'}:
                </span>
                <span className="font-medium">
                  {bookingForm.checkIn ? new Date(bookingForm.checkIn).toLocaleDateString('id-ID') : '-'}
                </span>
              </div>
              {bookingItem.type === 'hotel' && bookingForm.checkOut && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-medium">
                    {new Date(bookingForm.checkOut).toLocaleDateString('id-ID')}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tamu:</span>
                <span className="font-medium">{bookingForm.guests} orang</span>
              </div>
              {bookingItem.type === 'hotel' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kamar:</span>
                  <span className="font-medium">{bookingForm.rooms} kamar</span>
                </div>
              )}
              {bookingItem.type === 'hotel' && calculateNights() > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Durasi:</span>
                  <span className="font-medium">{calculateNights()} malam</span>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {bookingItem.type === 'hotel' 
                    ? `${bookingForm.rooms} kamar × ${calculateNights()} malam`
                    : 'Harga aktivitas'
                  }:
                </span>
                <span>
                  Rp {(bookingItem.price * bookingForm.rooms * (bookingItem.type === 'hotel' ? calculateNights() : 1)).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pajak (10%):</span>
                <span>
                  Rp {(bookingItem.price * bookingForm.rooms * (bookingItem.type === 'hotel' ? calculateNights() : 1) * 0.1).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Biaya layanan (5%):</span>
                <span>
                  Rp {(bookingItem.price * bookingForm.rooms * (bookingItem.type === 'hotel' ? calculateNights() : 1) * 0.05).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-blue-600">Rp {calculateTotal().toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
