'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminService from '@/lib/supabase/admin-service';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AdminLayout from '@/components/admin/AdminLayout';
import { ConfirmDialog, StatusUpdateModal, BulkActionModal, Toast } from '@/components/admin/AdminModals';

interface BookingRecord {
  id: string;
  user_id: string;
  destination_id?: string;
  hotel_id?: string;
  booking_type: 'destination' | 'hotel';
  check_in_date: string;
  check_out_date: string;
  guests: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    email: string;
  };
  destinations?: {
    name: string;
  };
  hotels?: {
    name: string;
  };
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800'
};

const statusEmojis = {
  pending: '⏳',
  confirmed: '✅',
  cancelled: '❌',
  completed: '🎉'
};

export default function AdminBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'destination' | 'hotel'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all');

  // CRUD operation states
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<BookingRecord | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' | 'warning' } | null>(null);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await AdminService.getBookings();
      setBookings(result.data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      // Only set error for actual connection/auth errors, not empty data
      const errorMessage = err instanceof Error ? err.message : 'Failed to load bookings';
      if (errorMessage.includes('auth') || errorMessage.includes('connection') || errorMessage.includes('network')) {
        setError('Failed to load bookings. Please check your connection and try again.');
      } else {
        // For other errors, still show the UI but with empty data
        setError(null);
      }
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const typeMatch = filter === 'all' || booking.booking_type === filter;
    const statusMatch = statusFilter === 'all' || booking.status === statusFilter;
    return typeMatch && statusMatch;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    totalRevenue: bookings
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + b.total_amount, 0)
  };

  // CRUD Operations
  const handleSelectBooking = (bookingId: string) => {
    setSelectedBookings(prev =>
      prev.includes(bookingId)
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const handleSelectAll = () => {
    setSelectedBookings(
      selectedBookings.length === filteredBookings.length
        ? []
        : filteredBookings.map(booking => booking.id)
    );
  };

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      setActionLoading(true);
      await AdminService.updateBooking(bookingId, { status: status as any });
      await fetchBookings(); // Refresh data
      setToast({ message: 'Booking status updated successfully!', variant: 'success' });
      setShowStatusModal(false);
      setCurrentBooking(null);
    } catch (error) {
      console.error('Error updating booking status:', error);
      setToast({ message: 'Failed to update booking status', variant: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      setActionLoading(true);
      await AdminService.deleteBooking(bookingId);
      await fetchBookings(); // Refresh data
      setToast({ message: 'Booking deleted successfully!', variant: 'success' });
      setShowDeleteDialog(false);
      setCurrentBooking(null);
    } catch (error) {
      console.error('Error deleting booking:', error);
      setToast({ message: 'Failed to delete booking', variant: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkAction = async (action: string) => {
    try {
      setActionLoading(true);

      if (action === 'delete') {
        await AdminService.bulkDeleteBookings(selectedBookings);
        setToast({ message: `${selectedBookings.length} bookings deleted successfully!`, variant: 'success' });
      } else {
        await AdminService.bulkUpdateBookingStatus(selectedBookings, action);
        setToast({ message: `${selectedBookings.length} bookings updated to ${action}!`, variant: 'success' });
      }

      await fetchBookings(); // Refresh data
      setSelectedBookings([]);
      setShowBulkModal(false);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      setToast({ message: 'Failed to perform bulk action', variant: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-green-100 text-green-800' },
    { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  const bulkActions = [
    { value: 'confirmed', label: 'Mark as Confirmed', variant: 'success' as const },
    { value: 'completed', label: 'Mark as Completed', variant: 'success' as const },
    { value: 'cancelled', label: 'Mark as Cancelled', variant: 'warning' as const },
    { value: 'delete', label: 'Delete Selected', variant: 'danger' as const }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
          <p className="mt-2 text-gray-600">
            Monitor and manage all destination and hotel bookings
          </p>
        </div>      {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="text-2xl mr-3">📅</div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="text-2xl mr-3">⏳</div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="text-2xl mr-3">✅</div>
              <div>
                <p className="text-sm font-medium text-gray-500">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="text-2xl mr-3">❌</div>
              <div>
                <p className="text-sm font-medium text-gray-500">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🎉</div>
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="text-2xl mr-3">💰</div>
              <div>
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Booking Type
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="destination">Destinations</option>
                <option value="hotel">Hotels</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>      {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="text-red-400 mr-3">❌</div>
              <div>
                <h3 className="text-sm font-medium text-red-800">Error Loading Bookings</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={fetchBookings}
                  className="mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Table */}
        <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
          {/* Bulk Actions */}
          {selectedBookings.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-blue-800">
                    {selectedBookings.length} booking{selectedBookings.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowBulkModal(true)}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Bulk Actions
                  </button>
                  <button
                    onClick={() => setSelectedBookings([])}
                    className="text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>          </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead><tbody className="bg-white divide-y divide-gray-200">{filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center">
                  <div className="text-4xl mb-2">📅</div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {filter !== 'all' || statusFilter !== 'all'
                      ? 'Try adjusting your filters to see more results.'
                      : 'No bookings have been made yet.'}
                  </p>
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => {
                const statusEmoji = statusEmojis[booking.status];
                return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedBookings.includes(booking.id)}
                        onChange={() => handleSelectBooking(booking.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-lg mr-2">📍</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.booking_type === 'destination'
                              ? booking.destinations?.name || 'Unknown Destination'
                              : booking.hotels?.name || 'Unknown Hotel'}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {booking.booking_type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-lg mr-2">👤</div>
                        <div className="text-sm text-gray-900">
                          {booking.profiles?.email || 'Unknown User'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>Check-in: {new Date(booking.check_in_date).toLocaleDateString()}</div>
                        <div>Check-out: {new Date(booking.check_out_date).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${booking.total_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                        <span className="mr-1">{statusEmoji}</span>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setCurrentBooking(booking);
                            setShowStatusModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Update Status"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => {
                            setCurrentBooking(booking);
                            setShowDeleteDialog(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Booking"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        {filteredBookings.length > 0 && (
          <div className="bg-gray-50 px-4 py-3 border-t text-sm text-gray-500">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        )}

        {/* Modals */}      {/* Modals */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          title="Delete Booking"
          message={`Are you sure you want to delete this booking? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          onConfirm={() => currentBooking && handleDeleteBooking(currentBooking.id)}
          onCancel={() => {
            setShowDeleteDialog(false);
            setCurrentBooking(null);
          }}
          loading={actionLoading}
        />

        <StatusUpdateModal
          isOpen={showStatusModal}
          title="Update Booking Status"
          currentStatus={currentBooking?.status || ''}
          statusOptions={statusOptions}
          onUpdate={(status) => currentBooking && handleUpdateStatus(currentBooking.id, status)}
          onCancel={() => {
            setShowStatusModal(false);
            setCurrentBooking(null);
          }}
          loading={actionLoading}
        />

        <BulkActionModal
          isOpen={showBulkModal}
          title="Bulk Actions"
          selectedCount={selectedBookings.length}
          actions={bulkActions}
          onAction={handleBulkAction}
          onCancel={() => setShowBulkModal(false)}
          loading={actionLoading}
        />

        <Toast
          message={toast?.message || ''}
          variant={toast?.variant || 'success'}
          isVisible={!!toast} onClose={() => setToast(null)}
        />
      </div>
    </AdminLayout>
  );
}
