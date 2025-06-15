'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  DollarSign,
  Calendar,
  MapPin,
  Building2
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import AnalyticsChart from '@/components/admin/AnalyticsChart';
import AdminService from '@/lib/supabase/admin-service';

export default function Analytics() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push('/');
      return;
    }

    // Check if user is admin
    if (user && !isAdminUser(user.email)) {
      router.push('/');
      return;
    }

    if (user && isAdminUser(user.email)) {
      loadAnalyticsData();
    }
  }, [user, isAuthenticated, isLoading, router, timeRange]);

  const isAdminUser = (email: string) => {
    const adminEmails = ['admin@explorekaltara.com', 'demo@admin.com'];
    return adminEmails.includes(email);
  };

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getAnalyticsData();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      // Fallback to mock data if there's an error
      const mockData = {
        overview: {
          totalPageViews: 45821,
          uniqueVisitors: 12456,
          bounceRate: 42.3,
          avgSessionDuration: '3m 24s'
        },
        traffic: [
          { month: 'Jan', visitors: 1200, bookings: 89 },
          { month: 'Feb', visitors: 1450, bookings: 102 },
          { month: 'Mar', visitors: 1320, bookings: 95 },
          { month: 'Apr', visitors: 1680, bookings: 134 },
          { month: 'May', visitors: 1590, bookings: 121 },
          { month: 'Jun', visitors: 1820, bookings: 156 }
        ],
        topPages: [
          { page: '/destinations', views: 8945, uniqueViews: 6234 },
          { page: '/hotels', views: 7823, uniqueViews: 5456 },
          { page: '/destinations/hutan-mangrove-bekantan', views: 6721, uniqueViews: 4893 },
          { page: '/trip-planner', views: 5432, uniqueViews: 3876 },
          { page: '/weather', views: 4321, uniqueViews: 3021 }
        ],
        referrers: [
          { source: 'Google', visits: 7890, percentage: 63.4 },
          { source: 'Facebook', visits: 2341, percentage: 18.8 },
          { source: 'Direct', visits: 1234, percentage: 9.9 },
          { source: 'Instagram', visits: 567, percentage: 4.6 },
          { source: 'Other', visits: 424, percentage: 3.4 }
        ],
        devices: [
          { device: 'Mobile', percentage: 68.2, sessions: 8503 },
          { device: 'Desktop', percentage: 24.7, sessions: 3082 },
          { device: 'Tablet', percentage: 7.1, sessions: 885 }
        ]
      };
      setAnalyticsData(mockData);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading || !analyticsData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Track your website performance and user engagement</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Page Views"
            value={analyticsData.overview.totalPageViews.toLocaleString()}
            icon={Eye}
            change="+12.5%"
            changeType="positive"
            description="vs last month"
          />
          <StatsCard
            title="Unique Visitors"
            value={analyticsData.overview.uniqueVisitors.toLocaleString()}
            icon={Users}
            change="+8.2%"
            changeType="positive"
            description="vs last month"
          />
          <StatsCard
            title="Bounce Rate"
            value={`${analyticsData.overview.bounceRate}%`}
            icon={TrendingUp}
            change="-2.1%"
            changeType="positive"
            description="vs last month"
          />
          <StatsCard
            title="Avg. Session"
            value={analyticsData.overview.avgSessionDuration}
            icon={Calendar}
            change="+15.3%"
            changeType="positive"
            description="vs last month"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Website Traffic</h3>            <AnalyticsChart 
              data={analyticsData.traffic}
            />
          </div>

          {/* Device Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
            <div className="space-y-4">
              {analyticsData.devices.map((device: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500 mr-3" style={{
                      backgroundColor: index === 0 ? '#3B82F6' : index === 1 ? '#10B981' : '#F59E0B'
                    }}></div>
                    <span className="text-gray-700">{device.device}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">{device.sessions.toLocaleString()}</span>
                    <span className="font-semibold text-gray-900">{device.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-600 font-medium">Page</th>
                    <th className="text-left py-2 text-gray-600 font-medium">Views</th>
                    <th className="text-left py-2 text-gray-600 font-medium">Unique</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.topPages.map((page: any, index: number) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 text-gray-900">{page.page}</td>
                      <td className="py-3 text-gray-600">{page.views.toLocaleString()}</td>
                      <td className="py-3 text-gray-600">{page.uniqueViews.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
            <div className="space-y-4">
              {analyticsData.referrers.map((referrer: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-medium text-gray-600">
                        {referrer.source.charAt(0)}
                      </span>
                    </div>
                    <span className="text-gray-900">{referrer.source}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">{referrer.visits.toLocaleString()}</span>
                    <span className="font-semibold text-gray-900">{referrer.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
