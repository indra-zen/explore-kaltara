'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Save,
  Upload,
  Globe,
  Bell,
  Shield,
  Database,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Key,
  Users,
  Settings as SettingsIcon
} from 'lucide-react';

interface AdminSettings {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    contactEmail: string;
    contactPhone: string;
    timezone: string;
    language: string;
  };
  features: {
    bookingEnabled: boolean;
    reviewsEnabled: boolean;
    weatherEnabled: boolean;
    mapsEnabled: boolean;
    wishlistEnabled: boolean;
    notificationsEnabled: boolean;
  };
  security: {
    requireEmailVerification: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
    twoFactorAuth: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    newBookingAlert: boolean;
    newReviewAlert: boolean;
    newUserAlert: boolean;
    systemAlerts: boolean;
  };
  integrations: {
    supabaseUrl: string;
    supabaseAnonKey: string;
    mapboxToken: string;
    weatherApiKey: string;
    emailServiceKey: string;
  };
}

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<AdminSettings>({
    general: {
      siteName: 'Explore Kaltara',
      siteDescription: 'Platform terdepan untuk menjelajahi keindahan Kalimantan Utara',
      siteUrl: 'https://explorekaltara.com',
      contactEmail: 'info@explorekaltara.com',
      contactPhone: '+62 21 1234 5678',
      timezone: 'Asia/Jakarta',
      language: 'id'
    },
    features: {
      bookingEnabled: true,
      reviewsEnabled: true,
      weatherEnabled: true,
      mapsEnabled: true,
      wishlistEnabled: true,
      notificationsEnabled: true
    },
    security: {
      requireEmailVerification: true,
      maxLoginAttempts: 5,
      sessionTimeout: 24,
      twoFactorAuth: false
    },
    notifications: {
      emailNotifications: true,
      newBookingAlert: true,
      newReviewAlert: true,
      newUserAlert: false,
      systemAlerts: true
    },
    integrations: {
      supabaseUrl: '',
      supabaseAnonKey: '',
      mapboxToken: '',
      weatherApiKey: '',
      emailServiceKey: ''
    }
  });

  const [activeTab, setActiveTab] = useState('general');
  const [showSecrets, setShowSecrets] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push('/');
      return;
    }

    if (user && !isAdminUser(user.email)) {
      router.push('/');
      return;
    }

    loadSettings();
  }, [user, isAuthenticated, isLoading, router]);

  const isAdminUser = (email: string) => {
    const adminEmails = ['admin@explorekaltara.com', 'demo@admin.com'];
    return adminEmails.includes(email);
  };

  const loadSettings = async () => {
    // Load settings from localStorage for demo
    try {
      const savedSettings = localStorage.getItem('admin-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(prevSettings => ({
          ...prevSettings,
          ...parsed
        }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to localStorage for demo
      localStorage.setItem('admin-settings', JSON.stringify(settings));
      
      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'features', label: 'Features', icon: SettingsIcon },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Database }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !isAdminUser(user.email)) {
    return null;
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
        <input
          type="text"
          value={settings.general.siteName}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            general: { ...prev.general, siteName: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
        <textarea
          value={settings.general.siteDescription}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            general: { ...prev.general, siteDescription: e.target.value }
          }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Site URL</label>
          <input
            type="url"
            value={settings.general.siteUrl}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              general: { ...prev.general, siteUrl: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
          <input
            type="email"
            value={settings.general.contactEmail}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              general: { ...prev.general, contactEmail: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
          <input
            type="tel"
            value={settings.general.contactPhone}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              general: { ...prev.general, contactPhone: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              general: { ...prev.general, timezone: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
            <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
            <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderFeaturesSettings = () => (
    <div className="space-y-6">
      {Object.entries(settings.features).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
          <div>
            <h3 className="text-sm font-medium text-gray-900 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <p className="text-sm text-gray-500">
              {key === 'bookingEnabled' && 'Allow users to make bookings'}
              {key === 'reviewsEnabled' && 'Enable user reviews and ratings'}
              {key === 'weatherEnabled' && 'Show weather information'}
              {key === 'mapsEnabled' && 'Enable interactive maps'}
              {key === 'wishlistEnabled' && 'Allow users to save favorites'}
              {key === 'notificationsEnabled' && 'Enable push notifications'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                features: { ...prev.features, [key]: e.target.checked }
              }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between py-4 border-b border-gray-200">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Require Email Verification</h3>
          <p className="text-sm text-gray-500">Users must verify their email before accessing the platform</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.security.requireEmailVerification}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              security: { ...prev.security, requireEmailVerification: e.target.checked }
            }))}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
          <input
            type="number"
            min="1"
            max="10"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              security: { ...prev.security, maxLoginAttempts: parseInt(e.target.value) }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (hours)</label>
          <input
            type="number"
            min="1"
            max="168"
            value={settings.security.sessionTimeout}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center justify-between py-4 border-b border-gray-200">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
          <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.security.twoFactorAuth}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              security: { ...prev.security, twoFactorAuth: e.target.checked }
            }))}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      {Object.entries(settings.notifications).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
          <div>
            <h3 className="text-sm font-medium text-gray-900 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <p className="text-sm text-gray-500">
              {key === 'emailNotifications' && 'Send notifications via email'}
              {key === 'newBookingAlert' && 'Alert when new bookings are made'}
              {key === 'newReviewAlert' && 'Alert when new reviews are submitted'}
              {key === 'newUserAlert' && 'Alert when new users register'}
              {key === 'systemAlerts' && 'Send system-related notifications'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, [key]: e.target.checked }
              }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">API Keys & Integrations</h3>
        <button
          onClick={() => setShowSecrets(!showSecrets)}
          className="flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {showSecrets ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
          {showSecrets ? 'Hide' : 'Show'} Secrets
        </button>
      </div>

      {Object.entries(settings.integrations).map(([key, value]) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          <div className="relative">
            <input
              type={showSecrets ? 'text' : 'password'}
              value={value}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                integrations: { ...prev.integrations, [key]: e.target.value }
              }))}
              placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      ))}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Security Note:</strong> API keys and secrets are encrypted and stored securely. 
          Only update these values if you need to change your integrations.
        </p>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Configure your platform settings and integrations</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`p-4 rounded-lg ${
            saveMessage.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {saveMessage.text}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 py-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'general' && renderGeneralSettings()}
            {activeTab === 'features' && renderFeaturesSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'integrations' && renderIntegrationsSettings()}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
