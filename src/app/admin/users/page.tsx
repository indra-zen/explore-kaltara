'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminService from '@/lib/supabase/admin-service';
import { UserModal, ConfirmDialog, Toast } from '@/components/admin/AdminModals';
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Download,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  favorite_locations?: string[];
  interests?: string[];
  travel_style?: 'budget' | 'mid-range' | 'luxury';
  is_admin?: boolean;
}

export default function UsersPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin' | 'moderator'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalCount: 0
  });

  // CRUD operation states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' | 'warning' } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Don't do anything while still loading auth state
    if (isLoading) {
      setAuthChecked(false);
      return;
    }

    // Mark that we've checked authentication
    setAuthChecked(true);

    // If not authenticated after loading is complete, redirect
    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }

    // Check if user is admin
    if (!isAdminUser(user.email)) {
      router.push('/');
      return;
    }

    // If user is admin, load data
    loadUsers();
  }, [isLoading, isAuthenticated, user, router]); // Added router to dependencies

  const isAdminUser = (email: string | null | undefined): boolean => {
    if (!email) return false;
    const adminEmails = ['admin@explorekaltara.com', 'demo@admin.com'];
    return adminEmails.includes(email);
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await AdminService.getUsers();
      console.log('Fetched users:', result.data);
      // Dynamically assign is_admin based on email
      const adminEmails = ['admin@explorekaltara.com', 'demo@admin.com'];
      const usersWithRole = (result.data || []).map(u => ({
        ...u,
        is_admin: adminEmails.includes(u.email)
      }));
      setUsers(usersWithRole);
    } catch (err) {
      console.error('Error fetching users:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load users';
      if (errorMessage.includes('auth') || errorMessage.includes('connection') || errorMessage.includes('network')) {
        setError('Failed to load users. Please check your connection and try again.');
      } else {
        setError(null);
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // const filteredUsers = users.filter(user => {
  //   const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        user.email.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesRole = filterRole === 'all' || 
  //                      (filterRole === 'admin' && user.is_admin) ||
  //                      (filterRole === 'user' && !user.is_admin);
  //   return matchesSearch && matchesRole;
  // });
  const filteredUsers = users.filter(user => {
    const name = user.name || '';
    const email = user.email || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' ||
      (filterRole === 'admin' && user.is_admin) ||
      (filterRole === 'user' && !user.is_admin);
    return matchesSearch && matchesRole;
  });

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleCreateUser = () => {
    setCurrentUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setCurrentUser(user);
    setShowDeleteDialog(true);
  };

  const handleSaveUser = async (userData: any) => {
    try {
      setActionLoading(true);

      if (currentUser) {
        // Update existing user
        const updatedUser = await AdminService.updateUserProfile(currentUser.id, userData);
        setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updatedUser } : u));
        setToast({ message: 'User updated successfully!', variant: 'success' });
      } else {
        // Create new user
        const newUser = await AdminService.createUser(userData);
        setUsers(prev => [...prev, newUser]);
        setToast({ message: 'User created successfully!', variant: 'success' });
      }

      setShowUserModal(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      setToast({
        message: error instanceof Error ? error.message : 'Failed to save user',
        variant: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDeleteUser = async () => {
    if (!currentUser) return;

    try {
      setActionLoading(true);
      await AdminService.deleteUser(currentUser.id);
      setUsers(prev => prev.filter(u => u.id !== currentUser.id));
      setToast({ message: 'User deleted successfully!', variant: 'success' });
      setShowDeleteDialog(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      setToast({
        message: error instanceof Error ? error.message : 'Failed to delete user',
        variant: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setActionLoading(true);
      await Promise.all(selectedUsers.map(id => AdminService.deleteUser(id)));
      setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
      setSelectedUsers([]);
      setToast({ message: `${selectedUsers.length} users deleted successfully!`, variant: 'success' });
    } catch (error) {
      console.error('Error bulk deleting users:', error);
      setToast({
        message: error instanceof Error ? error.message : 'Failed to delete users',
        variant: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };
  if (isLoading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isLoading ? 'Checking authentication...' : 'Loading users...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !isAdminUser(user.email)) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
            <p className="text-gray-600 mt-1">Manage and monitor all platform users</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button
              onClick={handleCreateUser}
              className="flex items-center px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadUsers}
              className="mt-2 text-red-700 hover:text-red-800 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Users ({filteredUsers.length})
              </h2>
              {selectedUsers.length > 0 && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {selectedUsers.length} selected
                  </span>
                  <button
                    onClick={handleBulkDelete}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete Selected
                  </button>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">
                {searchTerm ? 'No users found matching your search.' : 'No users found.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreateUser}
                  className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Create your first user
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((userItem) => (
                    <tr key={userItem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(userItem.id)}
                          onChange={() => handleSelectUser(userItem.id)}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            {userItem.avatar_url ? (
                              <img src={userItem.avatar_url} alt={userItem.name} className="w-10 h-10 rounded-full" />
                            ) : (
                              <span className="text-emerald-600 font-medium">
                                {userItem.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{userItem.name}</div>
                            <div className="text-sm text-gray-500">{userItem.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${userItem.is_admin ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                          {userItem.is_admin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(userItem.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div>Travel Style: {userItem.travel_style || 'Not specified'}</div>
                        <div>Interests: {userItem.interests?.length || 0}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditUser(userItem)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(userItem)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <UserModal
        isOpen={showUserModal}
        user={currentUser}
        onSave={handleSaveUser}
        onCancel={() => {
          setShowUserModal(false);
          setCurrentUser(null);
        }}
        loading={actionLoading}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete User"
        message={`Are you sure you want to delete "${currentUser?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDeleteUser}
        onCancel={() => {
          setShowDeleteDialog(false);
          setCurrentUser(null);
        }}
        loading={actionLoading}
        variant="danger"
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </AdminLayout>
  );
}
