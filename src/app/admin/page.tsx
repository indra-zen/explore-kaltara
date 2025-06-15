'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  MapPin, 
  Building2, 
  Calendar, 
  Star, 
  Settings,
  BarChart3,
  TrendingUp,
  Activity,
  DollarSign,
  Eye,
  Heart,
  MessageSquare
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import RecentActivity from '@/components/admin/RecentActivity';
import QuickActions from '@/components/admin/QuickActions';
import AnalyticsChart from '@/components/admin/AnalyticsChart';
import AdminService from '@/lib/supabase/admin-service';

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [dashboardLoading, setDashboardLoading] = useState(false);interface Activity {
    id: number;
    type: string;
    message: string;
    user: string;
    timestamp: Date;
  }

  interface MonthlyData {
    month: string;
    visitors: number;
    bookings: number;
  }

  interface TopDestination {
    name: string;
    visits: number;
  }

  const [dashboardData, setDashboardData] = useState<{
    totalUsers: number;
    totalDestinations: number;
    totalHotels: number;
    totalBookings: number;
    totalReviews: number;
    recentActivity: Activity[];
    analytics: {
      monthlyVisitors: MonthlyData[];
      topDestinations: TopDestination[];
      revenue: never[];
    };
  }>({
    totalUsers: 0,
    totalDestinations: 0,
    totalHotels: 0,
    totalBookings: 0,
    totalReviews: 0,
    recentActivity: [],
    analytics: {
      monthlyVisitors: [],
      topDestinations: [],
      revenue: []
    }
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push('/');
      return;
    }

    // Check if user is admin (for demo purposes, we'll use email check)
    if (user && !isAdminUser(user.email)) {
      router.push('/');
      return;
    }

    // Load dashboard data
    loadDashboardData();
  }, [user, isAuthenticated, isLoading, router]);

  const isAdminUser = (email: string) => {
    const adminEmails = ['admin@explorekaltara.com', 'demo@admin.com'];
    return adminEmails.includes(email);
  };  const loadDashboardData = async () => {
    try {
      setDashboardLoading(true);
      
      // Fetch real data from Supabase
      const [stats, recentActivity, analytics] = await Promise.all([
        AdminService.getDashboardStats(),
        AdminService.getRecentActivity(10),
        AdminService.getAnalyticsData()
      ]);

      setDashboardData({
        totalUsers: stats.totalUsers,
        totalDestinations: stats.totalDestinations,
        totalHotels: stats.totalHotels,
        totalBookings: stats.totalBookings,
        totalReviews: stats.totalReviews,
        recentActivity,
        analytics
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      
      // Fallback to mock data if there's an error
      const mockData = {
        totalUsers: 1247,
        totalDestinations: 15,
        totalHotels: 23,
        totalBookings: 89,
        totalReviews: 156,
        recentActivity: [
          {
            id: 1,
            type: 'booking',
            message: 'Booking baru untuk Swiss-Belhotel Tarakan',
            user: 'Ahmad Rizki',
            timestamp: new Date(Date.now() - 2 * 60 * 1000)
          },
          {
            id: 2,
            type: 'review',
            message: 'Review baru untuk Hutan Mangrove Bekantan',
            user: 'Sari Indah',
            timestamp: new Date(Date.now() - 15 * 60 * 1000)
          },
          {
            id: 3,
            type: 'user',
            message: 'User baru mendaftar',
            user: 'Budi Santoso',
            timestamp: new Date(Date.now() - 30 * 60 * 1000)
          },
          {
            id: 4,
            type: 'destination',
            message: 'Destinasi baru ditambahkan: Air Terjun Sekumpul',
            user: 'Admin',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
          }
        ],        analytics: {
          monthlyVisitors: [
            { month: 'Jan', visitors: 2400, bookings: 45 },
            { month: 'Feb', visitors: 3200, bookings: 52 },
            { month: 'Mar', visitors: 2800, bookings: 38 },
            { month: 'Apr', visitors: 4100, bookings: 67 },
            { month: 'May', visitors: 3600, bookings: 58 },
            { month: 'Jun', visitors: 4800, bookings: 89 }
          ],
          topDestinations: [
            { name: 'Hutan Mangrove Bekantan', visits: 1250 },
            { name: 'Pulau Kumala', visits: 980 },
            { name: 'Taman Nasional Kayan Mentarang', visits: 756 },
            { name: 'Air Terjun Tujuh Tingkat', visits: 642 },
            { name: 'Pantai Amal', visits: 523 }
          ],
          revenue: []
        }
      };
      
      setDashboardData(mockData);
    } finally {
      setDashboardLoading(false);
    }
  };
  if (isLoading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (!isAdminUser(user.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Users',
      value: dashboardData.totalUsers.toLocaleString(),
      icon: Users,
      change: '+12%',
      changeType: 'positive' as const,
      description: 'from last month'
    },
    {
      title: 'Destinations',
      value: dashboardData.totalDestinations.toString(),
      icon: MapPin,
      change: '+2',
      changeType: 'positive' as const,
      description: 'new this month'
    },
    {
      title: 'Hotels',
      value: dashboardData.totalHotels.toString(),
      icon: Building2,
      change: '+1',
      changeType: 'positive' as const,
      description: 'new this month'
    },
    {
      title: 'Bookings',
      value: dashboardData.totalBookings.toString(),
      icon: Calendar,
      change: '+23%',
      changeType: 'positive' as const,
      description: 'from last month'
    },
    {
      title: 'Reviews',
      value: dashboardData.totalReviews.toString(),
      icon: Star,
      change: '+8%',
      changeType: 'positive' as const,
      description: 'from last month'
    },
    {
      title: 'Page Views',
      value: '24.8K',
      icon: Eye,
      change: '+18%',
      changeType: 'positive' as const,
      description: 'from last month'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user.name}. Here's what's happening with your tourism platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analytics Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Analytics Overview</h2>
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                  <option>Last 6 months</option>
                  <option>Last 3 months</option>
                  <option>Last month</option>
                </select>
              </div>
              <AnalyticsChart data={dashboardData.analytics.monthlyVisitors} />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <RecentActivity activities={dashboardData.recentActivity} />
            <QuickActions />
          </div>
        </div>

        {/* Top Destinations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Destinations</h2>
          <div className="space-y-4">
            {dashboardData.analytics.topDestinations.map((destination, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-900">{destination.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">{destination.visits} visits</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(destination.visits / dashboardData.analytics.topDestinations[0].visits) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
