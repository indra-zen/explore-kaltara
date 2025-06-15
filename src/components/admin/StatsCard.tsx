'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  description: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType, 
  description 
}: StatsCardProps) {
  const changeColorClass = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }[changeType];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm font-medium ${changeColorClass}`}>
              {change}
            </span>
            <span className="text-sm text-gray-500 ml-1">{description}</span>
          </div>
        </div>
        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-emerald-600" />
        </div>
      </div>
    </div>
  );
}
