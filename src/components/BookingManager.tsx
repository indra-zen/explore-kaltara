'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, CreditCard, Check, AlertCircle, Eye, Download, Star } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface DatabaseBooking {
  id: string;
  user_id: string;
  booking_type: 'hotel' | 'destination';
  destination_id?: string;
  hotel_id?: string;
  check_in_date: string;
  check_out_date?: string;
  guests: number;
  rooms?: number;
  total_amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string;
  payment_id?: string;
  notes?: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
}

interface Booking {
  id: string;
  userId: string;
  item: {
    id: string;
    type: 'hotel' | 'destination';
    name: string;
    location: string;
    image: string;
    rating: number;
    price: number;
  };
  details: {
    checkIn: string;
    checkOut?: string;
    guests: number;
    rooms?: number;
    specialRequests: string;
  };
  payment: {
    method: string;
    status: string;
    id?: string;
  };
  total: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  createdAt: string;
}

export default function BookingManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadBookingsFromDatabase();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadBookingsFromDatabase = async () => {
    try {
      setIsLoading(true);
      
      // Import AdminService dynamically to avoid server-side issues
      const AdminService = (await import('@/lib/supabase/admin-service')).default;
      
      // Get all bookings and filter by user
      const { data: allBookings } = await AdminService.getBookings(1, 100);
      
      if (!allBookings) {
        setBookings([]);
        return;
      }
      
      // Filter bookings for current user and transform to UI format
      const userBookings = allBookings
        .filter((booking: any) => booking.user_id === user?.id)
        .map((dbBooking: any) => transformDatabaseBooking(dbBooking));
      
      setBookings(userBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setNotification({ message: 'Failed to load bookings', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const transformDatabaseBooking = (dbBooking: any): Booking => {
    // Get item name and details
    const itemName = dbBooking.hotels?.name || dbBooking.destinations?.name || 'Unknown Item';
    const itemLocation = dbBooking.hotels?.location || dbBooking.destinations?.location || 'Unknown Location';
    const itemImage = dbBooking.hotels?.featured_image || dbBooking.destinations?.featured_image || '/images/hutan-mangrove-bekantan-1.jpg';
    const itemRating = dbBooking.hotels?.rating || dbBooking.destinations?.rating || 4.5;
    const itemPrice = dbBooking.hotels?.price_per_night || getPriceFromRange(dbBooking.destinations?.price_range) || 0;

    return {
      id: dbBooking.id,
      userId: dbBooking.user_id,
      item: {
        id: dbBooking.hotel_id || dbBooking.destination_id || '',
        type: dbBooking.booking_type,
        name: itemName,
        location: itemLocation,
        image: itemImage,
        rating: itemRating,
        price: itemPrice,
      },
      details: {
        checkIn: dbBooking.check_in_date,
        checkOut: dbBooking.check_out_date || undefined,
        guests: dbBooking.guests,
        rooms: dbBooking.rooms || undefined,
        specialRequests: dbBooking.notes || '',
      },
      payment: {
        method: dbBooking.payment_method,
        status: dbBooking.payment_status,
        id: dbBooking.payment_id || undefined,
      },
      total: dbBooking.total_amount,
      status: dbBooking.status,
      createdAt: dbBooking.created_at,
    };
  };

  // Legacy function to load from localStorage (keep as fallback)
  const loadBookingsFromLocalStorage = () => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }
    
    try {
      const savedBookings = localStorage.getItem('kaltara-bookings');
      if (savedBookings) {
        let bookings = JSON.parse(savedBookings);
        
        // Migrate old booking structure to new structure
        bookings = bookings.map((booking: any) => {
          // Check if booking uses old structure
          if (booking.bookingDetails && !booking.details) {
            return {
              ...booking,
              details: booking.bookingDetails,
              payment: booking.paymentDetails || {},
              total: booking.totalAmount || booking.total || 0
            };
          }
          
          // Ensure all required fields exist
          return {
            ...booking,
            details: booking.details || {},
            payment: booking.payment || {},
            total: booking.total || 0
          };
        });
        
        // Save migrated bookings back to localStorage
        localStorage.setItem('kaltara-bookings', JSON.stringify(bookings));
        setBookings(bookings);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    // Ensure booking has required properties
    if (!booking || !booking.id || !booking.item) {
      return false;
    }
    return filter === 'all' || booking.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'completed':
        return <Check className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadBookingDetails = (booking: Booking) => {
    // Ensure booking.details exists before accessing its properties
    if (!booking.details) {
      alert('Data booking tidak lengkap. Tidak dapat mengunduh detail.');
      return;
    }

    // Create a more detailed receipt text format
    const receiptText = `
EXPLORE KALTARA - BOOKING RECEIPT
================================

Booking ID: ${booking.id}
Tanggal Booking: ${formatDate(booking.createdAt)}
Status: ${booking.status.toUpperCase()}

DETAIL PEMESANAN:
${booking.item.type === 'hotel' ? 'HOTEL' : 'DESTINASI'}: ${booking.item.name}
Lokasi: ${booking.item.location}
Rating: ${booking.item.rating} ⭐

${booking.item.type === 'hotel' ? `
Check-in: ${formatDate(booking.details.checkIn)}
Check-out: ${booking.details.checkOut ? formatDate(booking.details.checkOut) : 'N/A'}
Jumlah Malam: ${calculateNights(booking.details.checkIn, booking.details.checkOut)}
Kamar: ${booking.details.rooms || 1}
` : `
Tanggal Kunjungan: ${formatDate(booking.details.checkIn)}
`}
Tamu: ${booking.details.guests} orang
Permintaan Khusus: ${booking.details.specialRequests || 'Tidak ada'}

DETAIL PEMBAYARAN:
Metode Pembayaran: ${booking.payment?.method || 'N/A'}
Status Pembayaran: ${booking.payment?.status || 'N/A'}
Payment ID: ${booking.payment?.id || 'N/A'}

TOTAL PEMBAYARAN: Rp ${booking.total.toLocaleString('id-ID')}

Terima kasih telah menggunakan layanan Explore Kaltara!
    `;

    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(receiptText);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `booking-receipt-${booking.id}.txt`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const cancelBooking = (bookingId: string) => {
    if (confirm('Apakah Anda yakin ingin membatalkan booking ini?')) {
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' as const }
          : booking
      );
      setBookings(updatedBookings);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('kaltara-bookings', JSON.stringify(updatedBookings));
      }
      
      // Show notification
      setNotification({
        message: 'Booking berhasil dibatalkan',
        type: 'success'
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const calculateNights = (checkIn: string, checkOut?: string) => {
    if (!checkOut || !checkIn) return 1;
    try {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      console.error('Error calculating nights:', error);
      return 1;
    }
  };

  const getPriceFromRange = (priceRange: string | undefined): number => {
    if (!priceRange) return 0;
    
    // Convert price range to estimated numeric value
    switch (priceRange.toLowerCase()) {
      case 'free':
        return 0;
      case 'budget':
        return 50000; // 50k IDR
      case 'mid-range':
        return 150000; // 150k IDR
      case 'expensive':
        return 500000; // 500k IDR
      default:
        return 0;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Notification */}
      {notification && (
        <div className={`mb-4 p-4 rounded-lg ${
          notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <AlertCircle className="w-4 h-4 mr-2" />
            )}
            {notification.message}
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0 flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-emerald-600" />
          Booking Saya ({bookings.length})
        </h2>
        
        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="all">Semua Status</option>
          <option value="confirmed">Dikonfirmasi</option>
          <option value="pending">Menunggu</option>
          <option value="completed">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'Belum ada booking' : `Tidak ada booking dengan status "${filter}"`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? 'Mulai jelajahi destinasi dan hotel untuk membuat booking pertama Anda.'
              : 'Coba ubah filter atau buat booking baru.'
            }
          </p>
          <Link 
            href="/destinations" 
            className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>Jelajahi Destinasi</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Booking Image & Details */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Image */}
                    <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      <img
                        src={booking.item.image}
                        alt={booking.item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">{booking.item.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{booking.item.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span>{booking.item.rating}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </span>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">
                            {booking.item.type === 'hotel' ? 'Check-in' : 'Tanggal Kunjungan'}
                          </p>
                          <p className="font-medium">
                            {booking.details?.checkIn ? formatDate(booking.details.checkIn) : 'N/A'}
                          </p>
                        </div>
                        {booking.details?.checkOut && (
                          <div>
                            <p className="text-gray-500">Check-out</p>
                            <p className="font-medium">{formatDate(booking.details.checkOut)}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-500">Tamu</p>
                          <p className="font-medium">{booking.details?.guests || 1} orang</p>
                        </div>
                      </div>

                      {booking.details?.specialRequests && (
                        <div className="mt-3">
                          <p className="text-gray-500 text-sm">Permintaan Khusus:</p>
                          <p className="text-sm text-gray-700">{booking.details.specialRequests}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Booking Summary & Actions */}
                <div className="lg:w-64 border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-6">
                  <div className="text-center lg:text-right mb-4">
                    <p className="text-sm text-gray-500 mb-1">Booking ID</p>
                    <p className="font-mono text-sm font-semibold">{booking.id}</p>
                  </div>

                  <div className="text-center lg:text-right mb-4">
                    <p className="text-sm text-gray-500 mb-1">Total Pembayaran</p>
                    <p className="text-lg font-bold text-emerald-600">
                      Rp {booking.total.toLocaleString('id-ID')}
                    </p>
                    {booking.item.type === 'hotel' && booking.details?.checkOut && booking.details?.checkIn && (
                      <p className="text-xs text-gray-500">
                        {calculateNights(booking.details.checkIn, booking.details.checkOut)} malam
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => downloadBookingDetails(booking)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    
                    {booking.status === 'confirmed' && (
                      <>
                        <Link 
                          href={`/${booking.item.type === 'hotel' ? 'hotels' : 'destinations'}/${booking.item.id}`}
                          className="block w-full text-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Lihat Detail
                        </Link>
                        <button
                          onClick={() => cancelBooking(booking.id)}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>Batalkan</span>
                        </button>
                      </>
                    )}
                    
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>Batalkan</span>
                      </button>
                    )}
                  </div>

                  <div className="mt-4 text-xs text-gray-500 text-center lg:text-right">
                    Dibuat {formatDate(booking.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
