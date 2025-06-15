'use client';

import { useState } from 'react';

interface ChartData {
  month: string;
  visitors: number;
  bookings: number;
}

interface AnalyticsChartProps {
  data: ChartData[];
}

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  const [activeMetric, setActiveMetric] = useState<'visitors' | 'bookings'>('visitors');

  const maxValue = Math.max(...data.map(d => d[activeMetric]));

  return (
    <div>
      {/* Metric Toggle */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveMetric('visitors')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeMetric === 'visitors'
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Visitors
        </button>
        <button
          onClick={() => setActiveMetric('bookings')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeMetric === 'bookings'
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Bookings
        </button>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        {data.map((item, index) => {
          const value = item[activeMetric];
          const percentage = (value / maxValue) * 100;
          
          return (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-12 text-sm font-medium text-gray-600">
                {item.month}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="w-16 text-right">
                <span className="text-sm font-semibold text-gray-900">
                  {value.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {data.reduce((sum, item) => sum + item.visitors, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Visitors</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {data.reduce((sum, item) => sum + item.bookings, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Bookings</p>
          </div>
        </div>
      </div>
    </div>
  );
}
