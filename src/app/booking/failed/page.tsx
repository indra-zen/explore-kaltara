'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

function FailedContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          We couldn&apos;t process your payment. Please try again or contact support if the problem persists.
        </p>
        
        {bookingId && (
          <p className="text-sm text-gray-500 mb-6">
            Booking ID: <span className="font-mono">{bookingId}</span>
          </p>
        )}
        
        <div className="space-y-3">
          <Link
            href={`/booking?item=${bookingId}&type=hotel`}
            className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Payment Again
          </Link>
          <Link
            href="/"
            className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailed() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <FailedContent />
    </Suspense>
  );
}
