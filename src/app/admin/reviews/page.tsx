'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminService } from '@/lib/supabase/admin-service';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ReviewRecord {
  id: string;
  user_id: string;
  destination_id?: string;
  hotel_id?: string;
  review_type: 'destination' | 'hotel';
  rating: number;
  comment: string;
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

const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 3.5) return 'text-yellow-600';
  if (rating >= 2.5) return 'text-orange-600';
  return 'text-red-600';
};

const getRatingStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let stars = '';
  
  for (let i = 0; i < fullStars; i++) {
    stars += '⭐';
  }
  if (hasHalfStar) {
    stars += '⭐'; // Using full star for simplicity
  }
  
  return stars || '⭐'; // At least one star
};

export default function AdminReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'destination' | 'hotel'>('all');
  const [ratingFilter, setRatingFilter] = useState<'all' | '1' | '2' | '3' | '4' | '5'>('all');

  useEffect(() => {
    if (user) {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await AdminService.getReviews();
      setReviews(result.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
      // Fallback to empty array if real data fails
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const typeMatch = filter === 'all' || review.review_type === filter;
    const ratingMatch = ratingFilter === 'all' || Math.floor(review.rating).toString() === ratingFilter;
    return typeMatch && ratingMatch;
  });

  const stats = {
    total: reviews.length,
    averageRating: reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0,
    byRating: {
      5: reviews.filter(r => Math.floor(r.rating) === 5).length,
      4: reviews.filter(r => Math.floor(r.rating) === 4).length,
      3: reviews.filter(r => Math.floor(r.rating) === 3).length,
      2: reviews.filter(r => Math.floor(r.rating) === 2).length,
      1: reviews.filter(r => Math.floor(r.rating) === 1).length,
    },
    destinations: reviews.filter(r => r.review_type === 'destination').length,
    hotels: reviews.filter(r => r.review_type === 'hotel').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
        <p className="mt-2 text-gray-600">
          Monitor and manage all destination and hotel reviews
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="text-2xl mr-3">📝</div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="text-2xl mr-3">⭐</div>
            <div>
              <p className="text-sm font-medium text-gray-500">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.averageRating.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🏞️</div>
            <div>
              <p className="text-sm font-medium text-gray-500">Destination Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.destinations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🏨</div>
            <div>
              <p className="text-sm font-medium text-gray-500">Hotel Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.hotels}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Rating Distribution</h3>
        <div className="grid grid-cols-5 gap-4">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="text-center">
              <div className="text-lg font-semibold">{getRatingStars(rating)}</div>
              <div className="text-2xl font-bold text-gray-900">{stats.byRating[rating as keyof typeof stats.byRating]}</div>
              <div className="text-sm text-gray-500">{rating} Star{rating !== 1 ? 's' : ''}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Review Type
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
              Rating
            </label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value as any)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="text-red-400 mr-3">❌</div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error Loading Reviews</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={fetchReviews}
                className="mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reviewer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-4xl mb-2">📝</div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {filter !== 'all' || ratingFilter !== 'all' 
                        ? 'Try adjusting your filters to see more results.'
                        : 'No reviews have been submitted yet.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-lg mr-2">
                          {review.review_type === 'destination' ? '🏞️' : '🏨'}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {review.review_type === 'destination' 
                              ? review.destinations?.name || 'Unknown Destination'
                              : review.hotels?.name || 'Unknown Hotel'}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {review.review_type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-lg mr-2">👤</div>
                        <div className="text-sm text-gray-900">
                          {review.profiles?.email || 'Unknown User'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${getRatingColor(review.rating)}`}>
                          {getRatingStars(review.rating)} {review.rating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={review.comment}>
                        {review.comment}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      {filteredReviews.length > 0 && (
        <div className="bg-gray-50 px-4 py-3 border-t text-sm text-gray-500">
          Showing {filteredReviews.length} of {reviews.length} reviews
          {filteredReviews.length > 0 && (
            <span className="ml-4">
              Average rating: {(filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1)} ⭐
            </span>
          )}
        </div>
      )}
    </div>
  );
}
