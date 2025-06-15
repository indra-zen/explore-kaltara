export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          favorite_locations: string[] | null
          interests: string[] | null
          travel_style: 'budget' | 'mid-range' | 'luxury' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          favorite_locations?: string[] | null
          interests?: string[] | null
          travel_style?: 'budget' | 'mid-range' | 'luxury' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          favorite_locations?: string[] | null
          interests?: string[] | null
          travel_style?: 'budget' | 'mid-range' | 'luxury' | null
          created_at?: string
          updated_at?: string
        }
      }
      destinations: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          category: 'nature' | 'culture' | 'history' | 'entertainment' | 'adventure' | null
          location: string
          city: string
          latitude: number | null
          longitude: number | null
          images: string[] | null
          featured_image: string | null
          rating: number | null
          review_count: number | null
          price_range: 'free' | 'budget' | 'mid-range' | 'expensive' | null
          facilities: string[] | null
          opening_hours: any | null
          contact_info: any | null
          is_featured: boolean | null
          status: 'active' | 'inactive' | 'pending' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          category?: 'nature' | 'culture' | 'history' | 'entertainment' | 'adventure' | null
          location: string
          city: string
          latitude?: number | null
          longitude?: number | null
          images?: string[] | null
          featured_image?: string | null
          rating?: number | null
          review_count?: number | null
          price_range?: 'free' | 'budget' | 'mid-range' | 'expensive' | null
          facilities?: string[] | null
          opening_hours?: any | null
          contact_info?: any | null
          is_featured?: boolean | null
          status?: 'active' | 'inactive' | 'pending' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          category?: 'nature' | 'culture' | 'history' | 'entertainment' | 'adventure' | null
          location?: string
          city?: string
          latitude?: number | null
          longitude?: number | null
          images?: string[] | null
          featured_image?: string | null
          rating?: number | null
          review_count?: number | null
          price_range?: 'free' | 'budget' | 'mid-range' | 'expensive' | null
          facilities?: string[] | null
          opening_hours?: any | null
          contact_info?: any | null
          is_featured?: boolean | null
          status?: 'active' | 'inactive' | 'pending' | null
          created_at?: string
          updated_at?: string
        }
      }
      hotels: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          star_rating: number | null
          location: string
          city: string
          latitude: number | null
          longitude: number | null
          images: string[] | null
          featured_image: string | null
          rating: number | null
          review_count: number | null
          price_per_night: number | null
          currency: string | null
          amenities: string[] | null
          room_types: any | null
          contact_info: any | null
          policies: any | null
          is_featured: boolean | null
          status: 'active' | 'inactive' | 'pending' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          star_rating?: number | null
          location: string
          city: string
          latitude?: number | null
          longitude?: number | null
          images?: string[] | null
          featured_image?: string | null
          rating?: number | null
          review_count?: number | null
          price_per_night?: number | null
          currency?: string | null
          amenities?: string[] | null
          room_types?: any | null
          contact_info?: any | null
          policies?: any | null
          is_featured?: boolean | null
          status?: 'active' | 'inactive' | 'pending' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          star_rating?: number | null
          location?: string
          city?: string
          latitude?: number | null
          longitude?: number | null
          images?: string[] | null
          featured_image?: string | null
          rating?: number | null
          review_count?: number | null
          price_per_night?: number | null
          currency?: string | null
          amenities?: string[] | null
          room_types?: any | null
          contact_info?: any | null
          policies?: any | null
          is_featured?: boolean | null
          status?: 'active' | 'inactive' | 'pending' | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          hotel_id: string | null
          destination_id: string | null
          booking_type: 'hotel' | 'destination' | 'package'
          check_in_date: string | null
          check_out_date: string | null
          guests: number | null
          rooms: number | null
          total_amount: number
          currency: string | null
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded' | null
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | null
          payment_method: string | null
          notes: string | null
          contact_name: string
          contact_email: string
          contact_phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          hotel_id?: string | null
          destination_id?: string | null
          booking_type: 'hotel' | 'destination' | 'package'
          check_in_date?: string | null
          check_out_date?: string | null
          guests?: number | null
          rooms?: number | null
          total_amount: number
          currency?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded' | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | null
          payment_method?: string | null
          notes?: string | null
          contact_name: string
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          hotel_id?: string | null
          destination_id?: string | null
          booking_type?: 'hotel' | 'destination' | 'package'
          check_in_date?: string | null
          check_out_date?: string | null
          guests?: number | null
          rooms?: number | null
          total_amount?: number
          currency?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded' | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded' | null
          payment_method?: string | null
          notes?: string | null
          contact_name?: string
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          hotel_id: string | null
          destination_id: string | null
          booking_id: string | null
          review_type: 'hotel' | 'destination'
          rating: number
          title: string | null
          content: string
          images: string[] | null
          helpful_count: number | null
          status: 'pending' | 'approved' | 'rejected' | null
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          hotel_id?: string | null
          destination_id?: string | null
          booking_id?: string | null
          review_type: 'hotel' | 'destination'
          rating: number
          title?: string | null
          content: string
          images?: string[] | null
          helpful_count?: number | null
          status?: 'pending' | 'approved' | 'rejected' | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          hotel_id?: string | null
          destination_id?: string | null
          booking_id?: string | null
          review_type?: 'hotel' | 'destination'
          rating?: number
          title?: string | null
          content?: string
          images?: string[] | null
          helpful_count?: number | null
          status?: 'pending' | 'approved' | 'rejected' | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          description: string
          metadata: any | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          description: string
          metadata?: any | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          description?: string
          metadata?: any | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never    }
  }
}

// Exported types for easier use in components
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Destination = Database['public']['Tables']['destinations']['Row'];
export type Hotel = Database['public']['Tables']['hotels']['Row'];
export type Booking = Database['public']['Tables']['bookings']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type ActivityLog = Database['public']['Tables']['activity_logs']['Row'];

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type DestinationInsert = Database['public']['Tables']['destinations']['Insert'];
export type HotelInsert = Database['public']['Tables']['hotels']['Insert'];
export type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
export type ActivityLogInsert = Database['public']['Tables']['activity_logs']['Insert'];

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type DestinationUpdate = Database['public']['Tables']['destinations']['Update'];
export type HotelUpdate = Database['public']['Tables']['hotels']['Update'];
export type BookingUpdate = Database['public']['Tables']['bookings']['Update'];
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update'];
export type ActivityLogUpdate = Database['public']['Tables']['activity_logs']['Update'];
