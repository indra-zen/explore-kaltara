export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          phone: string | null
          avatar_url: string | null
          location: string | null
          preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          phone?: string | null
          avatar_url?: string | null
          location?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          avatar_url?: string | null
          location?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      destinations: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          category: 'nature' | 'culture' | 'history' | 'entertainment' | 'adventure'
          location: string
          city: string
          latitude: number | null
          longitude: number | null
          images: string[]
          featured_image: string | null
          rating: number
          review_count: number
          price_range: 'free' | 'budget' | 'mid-range' | 'expensive'
          facilities: string[]
          opening_hours: Json | null
          contact_info: Json | null
          is_featured: boolean
          status: 'active' | 'inactive' | 'pending'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          category?: 'nature' | 'culture' | 'history' | 'entertainment' | 'adventure'
          location: string
          city: string
          latitude?: number | null
          longitude?: number | null
          images?: string[]
          featured_image?: string | null
          rating?: number
          review_count?: number
          price_range?: 'free' | 'budget' | 'mid-range' | 'expensive'
          facilities?: string[]
          opening_hours?: Json | null
          contact_info?: Json | null
          is_featured?: boolean
          status?: 'active' | 'inactive' | 'pending'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          category?: 'nature' | 'culture' | 'history' | 'entertainment' | 'adventure'
          location?: string
          city?: string
          latitude?: number | null
          longitude?: number | null
          images?: string[]
          featured_image?: string | null
          rating?: number
          review_count?: number
          price_range?: 'free' | 'budget' | 'mid-range' | 'expensive'
          facilities?: string[]
          opening_hours?: Json | null
          contact_info?: Json | null
          is_featured?: boolean
          status?: 'active' | 'inactive' | 'pending'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      hotels: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          star_rating: number
          location: string
          city: string
          latitude: number | null
          longitude: number | null
          images: string[]
          featured_image: string | null
          rating: number
          review_count: number
          price_per_night: number | null
          currency: string
          amenities: string[]
          room_types: Json
          contact_info: Json | null
          policies: Json | null
          is_featured: boolean
          status: 'active' | 'inactive' | 'pending'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          star_rating?: number
          location: string
          city: string
          latitude?: number | null
          longitude?: number | null
          images?: string[]
          featured_image?: string | null
          rating?: number
          review_count?: number
          price_per_night?: number | null
          currency?: string
          amenities?: string[]
          room_types?: Json
          contact_info?: Json | null
          policies?: Json | null
          is_featured?: boolean
          status?: 'active' | 'inactive' | 'pending'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          star_rating?: number
          location?: string
          city?: string
          latitude?: number | null
          longitude?: number | null
          images?: string[]
          featured_image?: string | null
          rating?: number
          review_count?: number
          price_per_night?: number | null
          currency?: string
          amenities?: string[]
          room_types?: Json
          contact_info?: Json | null
          policies?: Json | null
          is_featured?: boolean
          status?: 'active' | 'inactive' | 'pending'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
          guests: number
          rooms: number
          total_amount: number
          currency: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
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
          guests?: number
          rooms?: number
          total_amount: number
          currency?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
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
          guests?: number
          rooms?: number
          total_amount?: number
          currency?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method?: string | null
          notes?: string | null
          contact_name?: string
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_hotel_id_fkey"
            columns: ["hotel_id"]
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_destination_id_fkey"
            columns: ["destination_id"]
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          booking_id: string | null
          hotel_id: string | null
          destination_id: string | null
          rating: number
          title: string | null
          comment: string | null
          images: string[]
          status: 'pending' | 'approved' | 'rejected'
          is_verified: boolean
          helpful_votes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          booking_id?: string | null
          hotel_id?: string | null
          destination_id?: string | null
          rating: number
          title?: string | null
          comment?: string | null
          images?: string[]
          status?: 'pending' | 'approved' | 'rejected'
          is_verified?: boolean
          helpful_votes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          booking_id?: string | null
          hotel_id?: string | null
          destination_id?: string | null
          rating?: number
          title?: string | null
          comment?: string | null
          images?: string[]
          status?: 'pending' | 'approved' | 'rejected'
          is_verified?: boolean
          helpful_votes?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_hotel_id_fkey"
            columns: ["hotel_id"]
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_destination_id_fkey"
            columns: ["destination_id"]
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          }
        ]
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          description: string
          metadata: Json
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
          metadata?: Json
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
          metadata?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
