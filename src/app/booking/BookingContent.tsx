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

interface ContactForm {
  fullName: string;
  phone: string;
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
  const [contactForm, setContactForm] = useState<ContactForm>({
    fullName: '',
    phone: ''
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
        setContactForm(prev => ({...prev, ...draft.contactForm}));
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
      contactForm,
      currentStep,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem(draftKey, JSON.stringify(draft));
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }, [bookingForm, contactForm, currentStep, bookingItem]);

  const handleBookingFormChange = (field: keyof BookingForm, value: string | number) => {
    setBookingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactFormChange = (field: keyof ContactForm, value: string) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
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

  const validateContactForm = () => {
    const { fullName, phone } = contactForm;

    if (!fullName.trim()) {
      alert('Nama lengkap harus diisi');
      return false;
    }

    if (!phone.trim()) {
      alert('Nomor telepon harus diisi');
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateBookingForm()) return;
    if (currentStep === 2 && !validateContactForm()) return;
    
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
    let createdBooking: any = null;
    let AdminService: any = null;

    try {
      // Prepare booking data for database
      // Import AdminService for creating the booking
      AdminService = (await import('@/lib/supabase/admin-service')).default;
      
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
        contact_name: user.name || contactForm.fullName || 'Guest',
        contact_email: user.email || '',
        contact_phone: undefined
      };

      // Create booking first
      console.log('Creating booking with data:', bookingData);
      const { data: dbBooking, error: dbError } = await AdminService.createBooking(bookingData);
      
      console.log('Booking creation result:', { dbBooking, dbError });
      
      if (dbError) {
        console.error('Database save failed:', dbError);
        alert('Failed to create booking. Please try again.');
        return;
      }

      if (!dbBooking?.id) {
        console.error('No booking ID returned:', dbBooking);
        alert('Failed to create booking. Please try again.');
        return;
      }

      // Store the created booking for potential cleanup
      createdBooking = dbBooking;
      
      console.log('Booking created successfully with ID:', dbBooking.id);

      // Wait a moment to ensure database consistency
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create Xendit payment with booking details
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
          customerName: contactForm.fullName || user.name || 'Guest',
          // Include booking details to avoid database query issues
          bookingDetails: {
            ...dbBooking,
            itemName: bookingItem?.name || 'Unknown Item',
            itemType: bookingItem?.type || 'unknown'
          }
        }),
      });

      const paymentData = await paymentResponse.json();

      console.log('Payment response:', paymentData);

      if (!paymentData.success) {
        const errorMsg = paymentData.details || paymentData.error || 'Failed to create payment';
        throw new Error(errorMsg);
      }

      console.log('Payment created successfully, redirecting to:', paymentData.payment.invoice_url);

      // Redirect to Xendit payment page
      window.location.href = paymentData.payment.invoice_url;

    } catch (error) {
      console.error('Booking failed:', error);
      
      // If we created a booking but payment failed, clean up the booking
      if (createdBooking?.id && AdminService) {
        try {
          console.log('Cleaning up failed booking:', createdBooking.id);
          await AdminService.deleteBooking(createdBooking.id);
        } catch (cleanupError) {
          console.error('Failed to cleanup booking:', cleanupError);
        }
      }
      
      // Show more specific error message to user
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Terjadi kesalahan saat memproses booking: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateSubtotal = () => {
    if (!bookingItem) return 0;
    
    const basePrice = bookingItem.price;
    const { checkIn, checkOut, guests, rooms } = bookingForm;
    
    if (!checkIn || !checkOut) return basePrice;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (bookingItem.type === 'hotel') {
      return basePrice * nights * rooms;
    } else {
      return basePrice * guests;
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
                  <Check className="w-5 h-5 inline mr-2" />
                  Konfirmasi & Pembayaran
                </h2>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-blue-800">Pembayaran melalui Xendit</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Anda akan diarahkan ke halaman pembayaran Xendit yang aman. Pilih metode pembayaran favorit Anda:
                      </p>
                      <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
                        <li>Transfer Bank (BCA, Mandiri, BNI, BRI)</li>
                        <li>E-wallet (OVO, DANA, LinkAja, ShopeePay)</li>
                        <li>Kartu Kredit/Debit</li>
                        <li>Virtual Account</li>
                        <li>Retail (Alfamart, Indomaret)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Informasi Kontak</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={contactForm.fullName}
                          onChange={(e) => handleContactFormChange('fullName', e.target.value)}
                          placeholder="Nama sesuai identitas"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          readOnly
                          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nomor Telepon
                        </label>
                        <input
                          type="tel"
                          value={contactForm.phone}
                          onChange={(e) => handleContactFormChange('phone', e.target.value)}
                          placeholder="08xxxxxxxxxx"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
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
