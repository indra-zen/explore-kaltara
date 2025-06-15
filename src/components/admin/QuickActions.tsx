'use client';

import Link from 'next/link';
import { Plus, Edit, BarChart3, Settings, Download } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    {
      title: 'Add Destination',
      description: 'Create new destination',
      href: '/admin/destinations/new',
      icon: Plus,
      color: 'bg-emerald-600 hover:bg-emerald-700'
    },
    {
      title: 'Add Hotel',
      description: 'Add new hotel listing',
      href: '/admin/hotels/new',
      icon: Plus,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'View Analytics',
      description: 'Detailed analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'Export Data',
      description: 'Download reports',
      href: '#',
      icon: Download,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color} text-white group-hover:scale-105 transition-transform`}>
              <action.icon className="w-5 h-5" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{action.title}</p>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
