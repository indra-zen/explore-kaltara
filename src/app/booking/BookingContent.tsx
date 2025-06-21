'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, MapPin, Users, Clock, CreditCard, Check, ArrowLeft, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PublicDataService } from '@/lib/supabase/public-service';
import type { Hotel, Destination } from '@/lib/supabase/types';
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

function BookingContent() {
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
    const loadBookingItem = async () => {
      const itemId = searchParams.get('item');
      const type = searchParams.get('type') as 'hotel' | 'destination';

      if (!itemId || !type) {
        router.push('/');
        return;
      }

      setIsLoading(true);
      
      try {
        let item: BookingItem | null = null;

        if (type === 'hotel') {
          const result = await PublicDataService.getHotelById(itemId);
          const hotel = result.data;
          
          if (hotel) {
            item = {
              id: hotel.id,
              type: 'hotel',
              name: hotel.name,
              location: hotel.location,
              image: hotel.featured_image || (hotel.images && hotel.images[0]) || '/images/hutan-mangrove-bekantan-1.jpg',
              rating: hotel.rating || 4.5,
              price: hotel.price_per_night || 800000,
              description: hotel.description || 'Hotel yang nyaman untuk menginap.'
            };
          }
        } else if (type === 'destination') {
          const result = await PublicDataService.getDestinationById(itemId);
          const destination = result.data;
          
          if (destination) {
            // For destinations, create a reasonable price based on category
            let price = 50000; // Base price
            if (destination.price_range === 'expensive') price = 150000;
            else if (destination.price_range === 'mid-range') price = 100000;
            else if (destination.price_range === 'budget') price = 50000;
            else if (destination.price_range === 'free') price = 0;
            
            item = {
              id: destination.id,
              type: 'destination',
              name: destination.name,
              location: destination.location,
              image: destination.featured_image || (destination.images && destination.images[0]) || '/images/hutan-mangrove-bekantan-1.jpg',
              rating: destination.rating || 4.5,
              price: price,
              description: destination.description || 'Destinasi wisata yang menarik untuk dikunjungi.'
            };
          }
        }

        if (!item) {
          console.error('Item not found:', { itemId, type });
          router.push('/?error=item_not_found');
          return;
        }

        setBookingItem(item);
        
        // Populate form with URL parameters
        const checkIn = searchParams.get('checkIn');
        const checkOut = searchParams.get('checkOut');
        const guests = searchParams.get('guests');
        
        if (checkIn || checkOut || guests) {
          setBookingForm(prev => ({
            ...prev,
            checkIn: checkIn || prev.checkIn,
            checkOut: checkOut || prev.checkOut,
            guests: guests ? parseInt(guests) : prev.guests
          }));
        }
        
      } catch (error) {
        console.error('Error loading booking item:', error);
        router.push('/?error=loading_failed');
      } finally {
        setIsLoading(false);
      }
    };

    loadBookingItem();
  }, [searchParams, router]);

  // Load and save booking draft - with SSR safety
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const itemId = searchParams.get('item');
    const draftKey = `booking-draft-${itemId}`;
    
    // Check if we have URL parameters for the form
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    const guestsParam = searchParams.get('guests');
    const hasUrlParams = checkInParam || checkOutParam || guestsParam;
    
    try {
      const savedDraft = localStorage.getItem(draftKey);
      
      if (savedDraft && !hasUrlParams) {
        // Only load draft if we don't have URL parameters
        const draft = JSON.parse(savedDraft);
        setBookingForm(prev => ({...prev, ...draft.bookingForm}));
        setPaymentForm(prev => ({...prev, ...draft.paymentForm}));
        setCurrentStep(draft.currentStep || 1);
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  }, [searchParams]);

  // Auto-save draft - with SSR safety
  useEffect(() => {
    if (typeof window === 'undefined' || !bookingItem) return;
    
    const draftKey = `booking-draft-${bookingItem.id}`;
    const draft = {
      bookingForm,
      paymentForm,
      currentStep,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem(draftKey, JSON.stringify(draft));
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }, [bookingForm, paymentForm, currentStep, bookingItem]);

  const handleBookingFormChange = (field: keyof BookingForm, value: string | number) => {
    setBookingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentFormChange = (field: keyof PaymentForm, value: string) => {
    setPaymentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  const validateBookingForm = () => {
    const { checkIn, checkOut } = bookingForm;
    
    if (!checkIn || !checkOut) {
      alert('Tanggal check-in dan check-out harus diisi');
      return false;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      alert('Tanggal check-in tidak boleh kurang dari hari ini');
      return false;
    }

    if (checkOutDate <= checkInDate) {
      alert('Tanggal check-out harus setelah tanggal check-in');
      return false;
    }

    return true;
  };

  const validatePaymentForm = () => {
    const { cardNumber, expiryDate, cvv, cardHolder, billingAddress, city, postalCode } = paymentForm;

    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      alert('Nomor kartu kredit harus 16 digit');
      return false;
    }

    if (!expiryDate || expiryDate.length < 5) {
      alert('Tanggal kedaluwarsa kartu harus diisi (MM/YY)');
      return false;
    }

    if (!cvv || cvv.length < 3) {
      alert('CVV harus 3 digit');
      return false;
    }

    if (!cardHolder.trim()) {
      alert('Nama pemegang kartu harus diisi');
      return false;
    }

    if (!billingAddress.trim()) {
      alert('Alamat tagihan harus diisi');
      return false;
    }

    if (!city.trim()) {
      alert('Kota harus diisi');
      return false;
    }

    if (!postalCode.trim()) {
      alert('Kode pos harus diisi');
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateBookingForm()) return;
    if (currentStep === 2 && !validatePaymentForm()) return;
    
    if (currentStep === 2) {
      setShowConfirmModal(true);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const confirmBooking = () => {
    setShowConfirmModal(false);
    processBooking();
  };

  const processBooking = async () => {
    if (!isAuthenticated || !user) {
      alert('Anda harus login terlebih dahulu');
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare booking data for database
      // Import AdminService for creating the booking
      const AdminService = (await import('@/lib/supabase/admin-service')).default;
      
      // bookingItem.id is already the correct database ID (UUID)
      // since we loaded it from the database using PublicDataService
      let destinationId: string | undefined;
      let hotelId: string | undefined;

      if (bookingItem?.type === 'destination') {
        destinationId = bookingItem.id;
      } else if (bookingItem?.type === 'hotel') {
        hotelId = bookingItem.id;
      }

      const bookingData = {
        user_id: user.id,
        booking_type: bookingItem?.type as 'destination' | 'hotel',
        destination_id: destinationId,
        hotel_id: hotelId,
        check_in_date: bookingForm.checkIn,
        check_out_date: bookingForm.checkOut,
        guests: bookingForm.guests,
        rooms: bookingForm.rooms || 1,
        total_amount: calculateTotal(),
        currency: 'IDR',
        status: 'pending' as const,
        payment_status: 'pending' as const,
        payment_method: 'Xendit',
        notes: bookingForm.specialRequests || undefined,
        contact_name: user.name || paymentForm.cardHolder || 'Guest',
        contact_email: user.email || '',
        contact_phone: undefined
      };

      // Create booking first
      const { data: dbBooking, error: dbError } = await AdminService.createBooking(bookingData);
      
      if (dbError) {
        console.error('Database save failed:', dbError);
        alert('Failed to create booking. Please try again.');
        return;
      }

      if (!dbBooking?.id) {
        alert('Failed to create booking. Please try again.');
        return;
      }

      // Create Xendit payment
      const paymentResponse = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: dbBooking.id,
          amount: calculateTotal(),
          currency: 'IDR',
          customerEmail: user.email,
          customerName: paymentForm.cardHolder || user.name || 'Guest',
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentData.success) {
        throw new Error(paymentData.error || 'Failed to create payment');
      }

      // Redirect to Xendit payment page
      window.location.href = paymentData.payment.invoice_url;

    } catch (error) {
      console.error('Booking failed:', error);
      alert('Terjadi kesalahan saat memproses booking. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    if (!bookingItem) return 0;
    
    const basePrice = bookingItem.price;
    const { checkIn, checkOut, guests, rooms } = bookingForm;
    
    if (!checkIn || !checkOut) return basePrice;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let subtotal = 0;
    if (bookingItem.type === 'hotel') {
      subtotal = basePrice * nights * rooms;
    } else {
      subtotal = basePrice * guests;
    }
    
    const tax = subtotal * 0.11; // 11% tax
    const serviceFee = subtotal * 0.05; // 5% service fee
    
    return subtotal + tax + serviceFee;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!bookingItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item tidak ditemukan</h2>
          <p className="text-gray-600 mb-4">Item yang Anda cari tidak tersedia</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Berhasil!</h2>
          <p className="text-gray-600 mb-4">
            Booking ID: <span className="font-mono text-blue-600">{bookingId}</span>
          </p>
          <p className="text-gray-600 mb-6">
            Terima kasih telah memesan {bookingItem.name}. Konfirmasi booking akan dikirim ke email Anda.
          </p>
          <div className="space-y-3">
            <Link 
              href="/profile" 
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lihat Booking Saya
            </Link>
            <Link 
              href="/" 
              className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Booking {bookingItem.name}</h1>
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-8 h-1 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Detail Booking</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={bookingForm.checkIn}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => handleBookingFormChange('checkIn', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={bookingForm.checkOut}
                      min={bookingForm.checkIn || new Date().toISOString().split('T')[0]}
                      onChange={(e) => handleBookingFormChange('checkOut', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      Jumlah Tamu
                    </label>
                    <select
                      value={bookingForm.guests}
                      onChange={(e) => handleBookingFormChange('guests', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} Tamu</option>
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
                        onChange={(e) => handleBookingFormChange('rooms', parseInt(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>{num} Kamar</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permintaan Khusus (Opsional)
                  </label>
                  <textarea
                    value={bookingForm.specialRequests}
                    onChange={(e) => handleBookingFormChange('specialRequests', e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Kamar lantai tinggi, tempat tidur twin, dll..."
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  <CreditCard className="w-5 h-5 inline mr-2" />
                  Informasi Pembayaran
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Kartu Kredit
                    </label>
                    <input
                      type="text"
                      value={paymentForm.cardNumber}
                      onChange={(e) => handlePaymentFormChange('cardNumber', formatCardNumber(e.target.value))}
                      maxLength={19}
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Kedaluwarsa
                    </label>
                    <input
                      type="text"
                      value={paymentForm.expiryDate}
                      onChange={(e) => handlePaymentFormChange('expiryDate', formatExpiryDate(e.target.value))}
                      maxLength={5}
                      placeholder="MM/YY"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={paymentForm.cvv}
                      onChange={(e) => handlePaymentFormChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                      maxLength={3}
                      placeholder="123"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Pemegang Kartu
                    </label>
                    <input
                      type="text"
                      value={paymentForm.cardHolder}
                      onChange={(e) => handlePaymentFormChange('cardHolder', e.target.value)}
                      placeholder="Nama sesuai kartu"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Tagihan
                    </label>
                    <input
                      type="text"
                      value={paymentForm.billingAddress}
                      onChange={(e) => handlePaymentFormChange('billingAddress', e.target.value)}
                      placeholder="Alamat lengkap"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kota
                    </label>
                    <input
                      type="text"
                      value={paymentForm.city}
                      onChange={(e) => handlePaymentFormChange('city', e.target.value)}
                      placeholder="Kota"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kode Pos
                    </label>
                    <input
                      type="text"
                      value={paymentForm.postalCode}
                      onChange={(e) => handlePaymentFormChange('postalCode', e.target.value.replace(/\D/g, '').slice(0, 5))}
                      placeholder="12345"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Sebelumnya
                </button>
              )}
              <button
                onClick={nextStep}
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {currentStep === 2 ? 'Bayar Sekarang' : 'Selanjutnya'}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Pesanan</h3>
              
              {/* Item Details */}
              <div className="flex space-x-3 mb-4">
                <img 
                  src={bookingItem.image} 
                  alt={bookingItem.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{bookingItem.name}</h4>
                  <p className="text-gray-600 text-xs flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {bookingItem.location}
                  </p>
                  <div className="flex items-center mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600 ml-1">{bookingItem.rating}</span>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              {bookingForm.checkIn && bookingForm.checkOut && (
                <div className="border-t pt-4 mb-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span>{new Date(bookingForm.checkIn).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span>{new Date(bookingForm.checkOut).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tamu:</span>
                      <span>{bookingForm.guests} orang</span>
                    </div>
                    {bookingItem.type === 'hotel' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kamar:</span>
                        <span>{bookingForm.rooms} kamar</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="border-t pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{formatCurrency(calculateTotal() * 0.862)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pajak (11%):</span>
                    <span>{formatCurrency(calculateTotal() * 0.095)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya Layanan (5%):</span>
                    <span>{formatCurrency(calculateTotal() * 0.043)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Konfirmasi Pembayaran</h3>
            <p className="text-gray-600 mb-6">
              Pastikan semua informasi sudah benar. Anda akan diarahkan ke halaman pembayaran Xendit untuk menyelesaikan transaksi.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={confirmBooking}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Modal */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
            <LoadingSpinner />
            <h3 className="text-lg font-bold text-gray-900 mt-4 mb-2">Menyiapkan Pembayaran</h3>
            <p className="text-gray-600">Mohon tunggu, kami sedang menyiapkan halaman pembayaran Anda...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
