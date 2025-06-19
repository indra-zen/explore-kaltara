import { supabase } from './client';
import type { Destination, Hotel } from './types';

export class PublicDataService {
  // Destinations
  static async getDestinations(options?: {
    search?: string;
    category?: string;
    location?: string;
    minRating?: number;
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = supabase
        .from('destinations')
        .select('*')
        .eq('status', 'active');

      // Apply filters
      if (options?.search) {
        query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%,location.ilike.%${options.search}%`);
      }

      if (options?.category && options.category !== 'all') {
        query = query.eq('category', options.category);
      }

      if (options?.location && options.location !== 'all') {
        query = query.eq('city', options.location);
      }

      if (options?.minRating) {
        query = query.gte('rating', options.minRating);
      }

      // Add pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
      }

      // Order by featured first, then by rating
      query = query.order('is_featured', { ascending: false })
                   .order('rating', { ascending: false })
                   .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching destinations:', error);
        // Fallback to JSON data if database fails
        const jsonData = await import('@/data/destinations.json');
        return { data: jsonData.default, error: null, fromFallback: true };
      }

      return { data: data || [], error: null, fromFallback: false };
    } catch (error) {
      console.error('Error in getDestinations:', error);
      // Fallback to JSON data
      const jsonData = await import('@/data/destinations.json');
      return { data: jsonData.default, error: null, fromFallback: true };
    }
  }

  static async getDestinationBySlug(slug: string) {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

      if (error) {
        console.error('Error fetching destination:', error);
        // Fallback to JSON data
        const jsonData = await import('@/data/destinations.json');
        const destination = jsonData.default.find(d => d.id === slug);
        return { data: destination || null, error: null, fromFallback: true };
      }

      return { data, error: null, fromFallback: false };
    } catch (error) {
      console.error('Error in getDestinationBySlug:', error);
      // Fallback to JSON data
      const jsonData = await import('@/data/destinations.json');
      const destination = jsonData.default.find(d => d.id === slug);
      return { data: destination || null, error: null, fromFallback: true };
    }
  }

  // Hotels
  static async getHotels(options?: {
    search?: string;
    location?: string;
    minRating?: number;
    maxPrice?: number;
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = supabase
        .from('hotels')
        .select('*')
        .eq('status', 'active');

      // Apply filters
      if (options?.search) {
        query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%,location.ilike.%${options.search}%`);
      }

      if (options?.location && options.location !== 'all') {
        query = query.eq('city', options.location);
      }

      if (options?.minRating) {
        query = query.gte('rating', options.minRating);
      }

      if (options?.maxPrice) {
        query = query.lte('price_per_night', options.maxPrice);
      }

      // Add pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
      }

      // Order by featured first, then by rating
      query = query.order('is_featured', { ascending: false })
                   .order('rating', { ascending: false })
                   .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching hotels:', error);
        // Fallback to JSON data if database fails
        const jsonData = await import('@/data/hotels.json');
        return { data: jsonData.default, error: null, fromFallback: true };
      }

      return { data: data || [], error: null, fromFallback: false };
    } catch (error) {
      console.error('Error in getHotels:', error);
      // Fallback to JSON data
      const jsonData = await import('@/data/hotels.json');
      return { data: jsonData.default, error: null, fromFallback: true };
    }
  }

  static async getHotelBySlug(slug: string) {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

      if (error) {
        console.error('Error fetching hotel:', error);
        // Fallback to JSON data
        const jsonData = await import('@/data/hotels.json');
        const hotel = jsonData.default.find(h => h.id === slug);
        return { data: hotel || null, error: null, fromFallback: true };
      }

      return { data, error: null, fromFallback: false };
    } catch (error) {
      console.error('Error in getHotelBySlug:', error);
      // Fallback to JSON data
      const jsonData = await import('@/data/hotels.json');
      const hotel = jsonData.default.find(h => h.id === slug);
      return { data: hotel || null, error: null, fromFallback: true };
    }
  }

  // Get featured destinations for homepage
  static async getFeaturedDestinations(limit = 3) {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('status', 'active')
        .eq('is_featured', true)
        .order('rating', { ascending: false })
        .limit(limit);

      if (error || !data || data.length === 0) {
        // Fallback to JSON data
        const jsonData = await import('@/data/destinations.json');
        return { data: jsonData.default.slice(0, limit), error: null, fromFallback: true };
      }

      return { data, error: null, fromFallback: false };
    } catch (error) {
      console.error('Error in getFeaturedDestinations:', error);
      // Fallback to JSON data
      const jsonData = await import('@/data/destinations.json');
      return { data: jsonData.default.slice(0, limit), error: null, fromFallback: true };
    }
  }

  // Get featured hotels for homepage
  static async getFeaturedHotels(limit = 3) {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('status', 'active')
        .eq('is_featured', true)
        .order('rating', { ascending: false })
        .limit(limit);

      if (error || !data || data.length === 0) {
        // Fallback to JSON data
        const jsonData = await import('@/data/hotels.json');
        return { data: jsonData.default.slice(0, limit), error: null, fromFallback: true };
      }

      return { data, error: null, fromFallback: false };
    } catch (error) {
      console.error('Error in getFeaturedHotels:', error);
      // Fallback to JSON data
      const jsonData = await import('@/data/hotels.json');
      return { data: jsonData.default.slice(0, limit), error: null, fromFallback: true };
    }
  }
}
