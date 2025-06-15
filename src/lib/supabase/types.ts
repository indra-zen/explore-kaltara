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
  }
}
