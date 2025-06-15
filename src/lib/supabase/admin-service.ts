import { supabase } from './client';
import type { Database } from './database.types';

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
          user_id
        `)
        .order('created_at', { ascending: false })
        .limit(limit);      if (error) throw error;
      
      // Get user profiles separately to avoid complex joins
      const userIds = data?.map(log => log.user_id).filter(Boolean) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      return data?.map(log => {
        const profile = profileMap.get(log.user_id);
        return {
          id: log.id,
          type: log.action,
          message: log.description,
          user: profile?.name || profile?.email || 'Unknown User',
          timestamp: new Date(log.created_at)
        };
      }) || [];
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

      if (bookingsError) throw bookingsError;      // Process monthly data
      const monthlyData = AdminService.processMonthlyData(monthlyBookings || []);

      // Get top destinations
      const { data: topDestinations, error: destinationsError } = await supabase
        .from('destinations')
        .select('name, review_count')
        .order('review_count', { ascending: false })
        .limit(5);

      if (destinationsError) throw destinationsError;      return {
        overview: {
          totalPageViews: monthlyData.reduce((sum: number, month: any) => sum + month.visitors, 0),
          uniqueVisitors: monthlyData.reduce((sum: number, month: any) => sum + Math.floor(month.visitors * 0.7), 0),
          bounceRate: 42.3,
          avgSessionDuration: '3m 24s'
        },
        traffic: monthlyData.map((month: any) => ({
          month: month.month,
          visitors: month.visitors,
          bookings: month.bookings
        })),
        monthlyVisitors: monthlyData,
        topDestinations: topDestinations?.map(dest => ({
          name: dest.name,
          visits: dest.review_count || 0
        })) || [],
        topPages: [
          { page: '/destinations', views: 8945, uniqueViews: 6234 },
          { page: '/hotels', views: 7823, uniqueViews: 5456 },
          { page: '/destinations/hutan-mangrove-bekantan', views: 6721, uniqueViews: 4893 },
          { page: '/trip-planner', views: 5432, uniqueViews: 3876 },
          { page: '/weather', views: 4321, uniqueViews: 3021 }
        ],
        referrers: [
          { source: 'Google', visits: 7890, percentage: 63.4 },
          { source: 'Facebook', visits: 2341, percentage: 18.8 },
          { source: 'Direct', visits: 1234, percentage: 9.9 },
          { source: 'Instagram', visits: 567, percentage: 4.6 },
          { source: 'Other', visits: 424, percentage: 3.4 }
        ],
        devices: [
          { device: 'Mobile', percentage: 68.2, sessions: 8503 },
          { device: 'Desktop', percentage: 24.7, sessions: 3082 },
          { device: 'Tablet', percentage: 7.1, sessions: 885 }
        ],
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
  }  // Bookings Management
  static async getBookings(page = 1, limit = 20, status = '') {
    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          profiles(name, email),
          hotels(name),
          destinations(name)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;      return {
        data: data || [],
        count: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }  static async createBooking(bookingData: {
    user_id: string;
    destination_id?: string;
    hotel_id?: string;
    booking_type: 'destination' | 'hotel' | 'package';
    check_in_date?: string | null;
    check_out_date?: string | null;
    guests?: number;
    rooms?: number;
    total_amount: number;
    currency?: string;
    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
    payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
    payment_method?: string;
    notes?: string;
    contact_name: string;
    contact_email: string;
    contact_phone?: string;
  }) {
    try {
      const { data, error } = await supabase        .from('bookings')
        .insert([{
          user_id: bookingData.user_id,
          destination_id: bookingData.destination_id || null,
          hotel_id: bookingData.hotel_id || null,
          booking_type: bookingData.booking_type,
          check_in_date: bookingData.check_in_date || null,
          check_out_date: bookingData.check_out_date || null,
          guests: bookingData.guests || 1,
          rooms: bookingData.rooms || 1,
          total_amount: bookingData.total_amount,
          currency: bookingData.currency || 'IDR',
          status: bookingData.status || 'confirmed',
          payment_status: bookingData.payment_status || 'paid',
          payment_method: bookingData.payment_method || 'credit_card',
          notes: bookingData.notes || null,
          contact_name: bookingData.contact_name,
          contact_email: bookingData.contact_email,
          contact_phone: bookingData.contact_phone || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating booking:', error);
      return { data: null, error };
    }
  }

  // Reviews Management
  static async getReviews(page = 1, limit = 20, status = '') {
    try {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          profiles(name, email),
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

  // ==========================
  // DESTINATIONS CRUD OPERATIONS
  // ==========================
  static async createDestination(destinationData: {
    name: string;
    slug?: string;
    description?: string;
    category: 'nature' | 'culture' | 'history' | 'entertainment' | 'adventure';
    location: string;
    city: string;
    latitude?: number;
    longitude?: number;
    images?: string[];
    featured_image?: string;
    rating?: number;
    price_range: 'free' | 'budget' | 'mid-range' | 'expensive';
    facilities?: string[];
    opening_hours?: any;
    contact_info?: any;
    is_featured?: boolean;
    status?: 'active' | 'inactive' | 'pending';
  }) {
    try {
      // Generate slug if not provided
      const slug = destinationData.slug || destinationData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const dataToInsert = {
        ...destinationData,
        slug,
        description: destinationData.description || '',
        rating: destinationData.rating || 0,
        review_count: 0,
        images: destinationData.images || [],
        facilities: destinationData.facilities || [],
        is_featured: destinationData.is_featured || false,
        status: destinationData.status || 'active'
      };

      const { data, error } = await supabase
        .from('destinations')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;

      await this.logActivity(
        'create',
        'destination',
        data.id,
        `Created destination: ${destinationData.name}`,
        destinationData
      );

      return data;
    } catch (error) {
      console.error('Error creating destination:', error);
      throw error;
    }
  }
  static async updateDestination(id: string, destinationData: Partial<{
    name: string;
    slug: string;
    description: string;
    category: 'nature' | 'culture' | 'history' | 'entertainment' | 'adventure';
    location: string;
    city: string;
    latitude: number;
    longitude: number;
    images: string[];
    featured_image: string;
    rating: number;
    review_count: number;
    price_range: 'free' | 'budget' | 'mid-range' | 'expensive';
    facilities: string[];
    opening_hours: any;
    contact_info: any;
    is_featured: boolean;
    status: 'active' | 'inactive' | 'pending';
  }>) {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .update(destinationData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await this.logActivity(
        'update',
        'destination',
        id,
        `Updated destination: ${destinationData.name || 'Unknown'}`,
        destinationData
      );

      return data;
    } catch (error) {
      console.error('Error updating destination:', error);
      throw error;
    }
  }

  static async deleteDestination(id: string) {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await this.logActivity(
        'delete',
        'destination',
        id,
        `Deleted destination: ${data.name}`,
        { deleted_destination: data }
      );

      return data;
    } catch (error) {
      console.error('Error deleting destination:', error);
      throw error;
    }
  }

  // ==========================
  // HOTELS CRUD OPERATIONS
  // ==========================
  static async createHotel(hotelData: {
    name: string;
    slug?: string;
    description?: string;
    star_rating?: number;
    location: string;
    city: string;
    latitude?: number;
    longitude?: number;
    images?: string[];
    featured_image?: string;
    rating?: number;
    price_per_night?: number;
    currency?: string;
    amenities?: string[];
    room_types?: any;
    contact_info?: any;
    policies?: any;
    is_featured?: boolean;
    status?: 'active' | 'inactive' | 'pending';
  }) {
    try {
      // Generate slug if not provided
      const slug = hotelData.slug || hotelData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const dataToInsert = {
        ...hotelData,
        slug,
        star_rating: hotelData.star_rating || 3,
        rating: hotelData.rating || 0,
        review_count: 0,
        currency: hotelData.currency || 'USD',
        amenities: hotelData.amenities || [],
        room_types: hotelData.room_types || [],
        is_featured: hotelData.is_featured || false,
        status: hotelData.status || 'active'
      };

      const { data, error } = await supabase
        .from('hotels')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;

      await this.logActivity(
        'create',
        'hotel',
        data.id,
        `Created hotel: ${hotelData.name}`,
        hotelData
      );

      return data;
    } catch (error) {
      console.error('Error creating hotel:', error);
      throw error;
    }
  }
  static async updateHotel(id: string, hotelData: Partial<{
    name: string;
    slug: string;
    description: string;
    star_rating: number;
    location: string;
    city: string;
    latitude: number;
    longitude: number;
    images: string[];
    featured_image: string;
    rating: number;
    review_count: number;
    price_per_night: number;
    currency: string;
    amenities: string[];
    room_types: any;
    contact_info: any;
    policies: any;
    is_featured: boolean;
    status: 'active' | 'inactive' | 'pending';
  }>) {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .update(hotelData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await this.logActivity(
        'update',
        'hotel',
        id,
        `Updated hotel: ${hotelData.name || 'Unknown'}`,
        hotelData
      );

      return data;
    } catch (error) {
      console.error('Error updating hotel:', error);
      throw error;
    }
  }

  static async deleteHotel(id: string) {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await this.logActivity(
        'delete',
        'hotel',
        id,
        `Deleted hotel: ${data.name}`,
        { deleted_hotel: data }
      );

      return data;
    } catch (error) {
      console.error('Error deleting hotel:', error);
      throw error;
    }
  }

  // ==========================
  // BOOKINGS CRUD OPERATIONS
  // ==========================

  static async updateBooking(id: string, bookingData: Partial<{
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    check_in_date: string;
    check_out_date: string;
    guests: number;
    total_amount: number;
    notes: string;
  }>) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(bookingData)
        .eq('id', id)
        .select(`
          *,
          profiles(name, email),
          hotels(name),
          destinations(name)
        `)
        .single();

      if (error) throw error;

      await this.logActivity(
        'update',
        'booking',
        id,
        `Updated booking status to: ${bookingData.status || 'modified'}`,
        bookingData
      );

      return data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  static async deleteBooking(id: string) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id)
        .select(`
          *,
          profiles(name, email),
          hotels(name),
          destinations(name)
        `)
        .single();

      if (error) throw error;

      await this.logActivity(
        'delete',
        'booking',
        id,
        `Deleted booking`,
        { deleted_booking: data }
      );

      return data;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  // ==========================
  // REVIEWS CRUD OPERATIONS
  // ==========================

  static async updateReview(id: string, reviewData: Partial<{
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_notes: string;
  }>) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update(reviewData)
        .eq('id', id)
        .select(`
          *,
          profiles(name, email),
          hotels(name),
          destinations(name)
        `)
        .single();

      if (error) throw error;

      await this.logActivity(
        'update',
        'review',
        id,
        `Updated review status to: ${reviewData.status || 'modified'}`,
        reviewData
      );

      return data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  static async deleteReview(id: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)
        .select(`
          *,
          profiles(name, email),
          hotels(name),
          destinations(name)
        `)
        .single();

      if (error) throw error;

      await this.logActivity(
        'delete',
        'review',
        id,
        `Deleted review`,
        { deleted_review: data }
      );

      return data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
  // ==========================
  // USER MANAGEMENT OPERATIONS
  // ==========================

  static async createUser(userData: {
    email: string;
    password: string;
    name: string;
    avatar_url?: string;
    favorite_locations?: string[];
    interests?: string[];
    travel_style?: 'budget' | 'mid-range' | 'luxury';
    is_admin?: boolean;
  }) {
    try {
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      });

      if (authError) throw authError;

      // Create profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: userData.name,
          avatar_url: userData.avatar_url,
          favorite_locations: userData.favorite_locations || [],
          interests: userData.interests || [],
          travel_style: userData.travel_style || 'mid-range',
          is_admin: userData.is_admin || false
        })
        .select()
        .single();

      if (error) throw error;

      await this.logActivity(
        'create',
        'user',
        authData.user.id,
        `Created new user: ${userData.name}`,
        { user_data: userData }
      );

      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async updateUserProfile(id: string, profileData: Partial<{
    name: string;
    avatar_url: string;
    favorite_locations: string[];
    interests: string[];
    travel_style: 'budget' | 'mid-range' | 'luxury';
    is_admin: boolean;
  }>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await this.logActivity(
        'update',
        'user',
        id,
        `Updated user profile: ${profileData.name || 'Unknown'}`,
        profileData
      );

      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  static async deleteUser(id: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await this.logActivity(
        'delete',
        'user',
        id,
        `Deleted user profile: ${data.name}`,
        { deleted_user: data }
      );

      return data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // ==========================
  // BULK OPERATIONS
  // ==========================

  static async bulkUpdateBookingStatus(bookingIds: string[], status: string) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .in('id', bookingIds)
        .select();

      if (error) throw error;

      await this.logActivity(
        'bulk_update',
        'booking',
        bookingIds.join(','),
        `Bulk updated ${bookingIds.length} bookings to status: ${status}`,
        { booking_ids: bookingIds, new_status: status }
      );

      return data;
    } catch (error) {
      console.error('Error bulk updating bookings:', error);
      throw error;
    }
  }

  static async bulkDeleteBookings(bookingIds: string[]) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .delete()
        .in('id', bookingIds)
        .select();

      if (error) throw error;

      await this.logActivity(
        'bulk_delete',
        'booking',
        bookingIds.join(','),
        `Bulk deleted ${bookingIds.length} bookings`,
        { deleted_booking_ids: bookingIds }
      );

      return data;
    } catch (error) {
      console.error('Error bulk deleting bookings:', error);
      throw error;
    }
  }

  static async bulkApproveReviews(reviewIds: string[]) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({ status: 'approved' })
        .in('id', reviewIds)
        .select();

      if (error) throw error;

      await this.logActivity(
        'bulk_approve',
        'review',
        reviewIds.join(','),
        `Bulk approved ${reviewIds.length} reviews`,
        { approved_review_ids: reviewIds }
      );

      return data;
    } catch (error) {
      console.error('Error bulk approving reviews:', error);
      throw error;
    }
  }  // Log admin activity
  static async logActivity(
    action: string,
    entityType: string,
    entityId: string,
    description: string,
    metadata: any = {}
  ) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('No authenticated user found for activity logging');
        return;
      }

      // Prepare the log data - handle both TEXT and UUID entity_id types
      const logData = {
        user_id: user.id,
        action,
        entity_type: entityType,
        entity_id: entityId, // This will work for both TEXT and UUID columns
        description,
        metadata: metadata || {}
      };

      console.log('Attempting to log activity:', logData);

      const { error } = await supabase
        .from('activity_logs')
        .insert(logData);

      if (error) {
        console.error('Database error in logActivity:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        // Don't throw - just log the error so the main operation continues
        return;
      }

      console.log('Activity logged successfully');
    } catch (error) {
      console.error('Error logging activity:', error);
      // Don't throw the error to prevent it from breaking the main operation
    }
  }

  // Helper methods for booking foreign key resolution
  static async findDestinationBySlug(slug: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('id')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error finding destination by slug:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Error in findDestinationBySlug:', error);
      return null;
    }
  }

  static async findHotelBySlug(slug: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('id')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error finding hotel by slug:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Error in findHotelBySlug:', error);
      return null;
    }
  }
}

export default AdminService;
