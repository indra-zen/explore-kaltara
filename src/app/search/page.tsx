'use client';

import { Suspense } from 'react';
import SearchResultsContent from './SearchResultsContent';
import Header from '@/components/Header';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Mencari...</p>
          </div>
        </div>
      }>
        <SearchResultsContent />
      </Suspense>
    </div>
  );
}
