import { supabase } from './client';
import type { Database } from './types';

type Tables = Database['public']['Tables'];
type Profile = Tables['profiles']['Row'];
type Destination = Tables['destinations']['Row'];
type Hotel = Tables['hotels']['Row'];
type Booking = Tables['bookings']['Row'];
type Review = Tables['reviews']['Row'];
type ActivityLog = Tables['activity_logs']['Row'];

// Admin Dashboard Service
export class AdminService {
  
  // Dashboard Statistics
  static async getDashboardStats() {
    try {
      const [
        usersResult,
        destinationsResult,
        hotelsResult,
        bookingsResult,
        reviewsResult
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('destinations').select('id', { count: 'exact' }),
        supabase.from('hotels').select('id', { count: 'exact' }),
        supabase.from('bookings').select('id', { count: 'exact' }),
        supabase.from('reviews').select('id', { count: 'exact' })
      ]);

      return {
        totalUsers: usersResult.count || 0,
        totalDestinations: destinationsResult.count || 0,
        totalHotels: hotelsResult.count || 0,
        totalBookings: bookingsResult.count || 0,
        totalReviews: reviewsResult.count || 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Recent Activity
  static async getRecentActivity(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          id,
          action,
          description,
          created_at,
          profiles!activity_logs_user_id_fkey(name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;      return data?.map(log => ({
        id: log.id,
        type: log.action,
        message: log.description,
        user: (log.profiles as any)?.name || (log.profiles as any)?.email || 'Unknown User',
        timestamp: new Date(log.created_at)
      })) || [];
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  // Analytics Data
  static async getAnalyticsData() {
    try {
      // Get monthly bookings data
      const { data: monthlyBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('created_at, total_amount')
        .gte('created_at', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at');

      if (bookingsError) throw bookingsError;

      // Process monthly data
      const monthlyData = this.processMonthlyData(monthlyBookings || []);

      // Get top destinations
      const { data: topDestinations, error: destinationsError } = await supabase
        .from('destinations')
        .select('name, review_count')
        .order('review_count', { ascending: false })
        .limit(5);

      if (destinationsError) throw destinationsError;

      return {
        monthlyVisitors: monthlyData,
        topDestinations: topDestinations?.map(dest => ({
          name: dest.name,
          visits: dest.review_count || 0
        })) || [],
        revenue: []
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  }

  private static processMonthlyData(bookings: any[]) {
    const monthlyStats = new Map();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    // Initialize months
    months.forEach(month => {
      monthlyStats.set(month, { visitors: 0, bookings: 0 });
    });

    // Process bookings
    bookings.forEach(booking => {
      const date = new Date(booking.created_at);
      const month = months[date.getMonth()];
      if (monthlyStats.has(month)) {
        const stats = monthlyStats.get(month);
        stats.bookings += 1;
        stats.visitors += 1; // Assume 1 visitor per booking for now
      }
    });

    return months.map(month => ({
      month,
      ...monthlyStats.get(month)
    }));
  }

  // Users Management
  static async getUsers(page = 1, limit = 20, search = '') {
    try {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Destinations Management
  static async getDestinations(page = 1, limit = 20, search = '', category = '') {
    try {
      let query = supabase
        .from('destinations')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`);
      }

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Error fetching destinations:', error);
      throw error;
    }
  }

  // Hotels Management
  static async getHotels(page = 1, limit = 20, search = '', city = '') {
    try {
      let query = supabase
        .from('hotels')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`);
      }

      if (city) {
        query = query.eq('city', city);
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Error fetching hotels:', error);
      throw error;
    }
  }

  // Bookings Management
  static async getBookings(page = 1, limit = 20, status = '') {
    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          profiles!bookings_user_id_fkey(name, email),
          hotels(name),
          destinations(name)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  // Reviews Management
  static async getReviews(page = 1, limit = 20, status = '') {
    try {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          profiles!reviews_user_id_fkey(name, email),
          hotels(name),
          destinations(name)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  // Update review status
  static async updateReviewStatus(reviewId: string, status: 'approved' | 'rejected', adminNotes?: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({ 
          status, 
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;

      // Log the activity
      await this.logActivity(
        'review_moderation',
        'review',
        reviewId,
        `Review ${status} by admin`,
        { status, admin_notes: adminNotes }
      );

      return data;
    } catch (error) {
      console.error('Error updating review status:', error);
      throw error;
    }
  }

  // Update booking status
  static async updateBookingStatus(bookingId: string, status: string) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;

      // Log the activity
      await this.logActivity(
        'booking_update',
        'booking',
        bookingId,
        `Booking status updated to ${status}`,
        { status }
      );

      return data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  // Log admin activity
  static async logActivity(
    action: string,
    entityType: string,
    entityId: string,
    description: string,
    metadata: any = {}
  ) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          action,
          entity_type: entityType,
          entity_id: entityId,
          description,
          metadata
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }
}

export default AdminService;
