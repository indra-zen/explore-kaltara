'use client';

import Skeleton from './ui/Skeleton';

export function DestinationCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Image skeleton */}
      <Skeleton height="200px" className="w-full" />
      
      <div className="p-6">
        {/* Title skeleton */}
        <Skeleton variant="text" className="mb-2" width="80%" />
        
        {/* Location skeleton */}
        <Skeleton variant="text" className="mb-3" width="60%" />
        
        {/* Description skeleton */}
        <Skeleton variant="text" lines={2} className="mb-4" />
        
        {/* Rating and action buttons skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton variant="circular" width="20px" height="20px" />
            <Skeleton variant="text" width="60px" />
          </div>
          <Skeleton variant="circular" width="40px" height="40px" />
        </div>
      </div>
    </div>
  );
}

export function HotelCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Image skeleton */}
      <Skeleton height="200px" className="w-full" />
      
      <div className="p-6">
        {/* Title skeleton */}
        <Skeleton variant="text" className="mb-2" width="75%" />
        
        {/* Location skeleton */}
        <Skeleton variant="text" className="mb-3" width="50%" />
        
        {/* Description skeleton */}
        <Skeleton variant="text" lines={2} className="mb-4" />
        
        {/* Rating and facilities skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Skeleton variant="circular" width="20px" height="20px" />
            <Skeleton variant="text" width="60px" />
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" width="24px" height="24px" />
            ))}
          </div>
        </div>
        
        {/* Price and action button skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton variant="text" width="100px" height="24px" />
            <Skeleton variant="text" width="60px" height="16px" className="mt-1" />
          </div>
          <Skeleton variant="circular" width="40px" height="40px" />
        </div>
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Image skeleton */}
      <Skeleton height="200px" className="w-full" />
      
      <div className="p-6">
        {/* Category skeleton */}
        <Skeleton variant="rectangular" width="80px" height="24px" className="mb-3 rounded-full" />
        
        {/* Title skeleton */}
        <Skeleton variant="text" className="mb-2" width="90%" />
        
        {/* Excerpt skeleton */}
        <Skeleton variant="text" lines={3} className="mb-4" />
        
        {/* Meta info skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Skeleton variant="circular" width="16px" height="16px" />
              <Skeleton variant="text" width="80px" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton variant="circular" width="16px" height="16px" />
              <Skeleton variant="text" width="60px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SkeletonGridProps {
  count?: number;
  type: 'destination' | 'hotel' | 'blog';
}

export function SkeletonGrid({ count = 6, type }: SkeletonGridProps) {
  const SkeletonComponent = {
    destination: DestinationCardSkeleton,
    hotel: HotelCardSkeleton,
    blog: BlogCardSkeleton
  }[type];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </div>
  );
}
