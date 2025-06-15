'use client';

import { Calendar, User, Star, MapPin } from 'lucide-react';

interface Activity {
  id: number;
  type: string;
  message: string;
  user: string;
  timestamp: Date;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return Calendar;
      case 'review':
        return Star;
      case 'user':
        return User;
      case 'destination':
        return MapPin;
      default:
        return User;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-100 text-blue-600';
      case 'review':
        return 'bg-yellow-100 text-yellow-600';
      case 'user':
        return 'bg-green-100 text-green-600';
      case 'destination':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          const colorClass = getActivityColor(activity.type);
          
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500">by {activity.user}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
          View all activity
        </button>
      </div>
    </div>
  );
}
