'use client';

import { useState, useEffect } from 'react';
import AdminService from '@/lib/supabase/admin-service';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
  loading = false
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantClasses = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${variantClasses[variant]}`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

interface StatusUpdateModalProps {
  isOpen: boolean;
  title: string;
  currentStatus: string;
  statusOptions: { value: string; label: string; color: string }[];
  onUpdate: (status: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function StatusUpdateModal({
  isOpen,
  title,
  currentStatus,
  statusOptions,
  onUpdate,
  onCancel,
  loading = false
}: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        
        <div className="space-y-3">
          {statusOptions.map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                value={option.value}
                checked={selectedStatus === option.value}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${option.color}`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onUpdate(selectedStatus)}
            disabled={loading || selectedStatus === currentStatus}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface BulkActionModalProps {
  isOpen: boolean;
  title: string;
  selectedCount: number;
  actions: { value: string; label: string; variant: 'danger' | 'warning' | 'success' }[];
  onAction: (action: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function BulkActionModal({
  isOpen,
  title,
  selectedCount,
  actions,
  onAction,
  onCancel,
  loading = false
}: BulkActionModalProps) {
  const [selectedAction, setSelectedAction] = useState('');

  if (!isOpen) return null;

  const actionVariants = {
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    success: 'bg-green-100 text-green-800'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">
          {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
        </p>
        
        <div className="space-y-2">
          {actions.map((action) => (
            <label key={action.value} className="flex items-center">
              <input
                type="radio"
                value={action.value}
                checked={selectedAction === action.value}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${actionVariants[action.variant]}`}>
                {action.label}
              </span>
            </label>
          ))}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onAction(selectedAction)}
            disabled={loading || !selectedAction}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Apply Action'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Toast({ 
  message, 
  variant = 'success', 
  isVisible, 
  onClose 
}: { 
  message: string; 
  variant?: 'success' | 'error' | 'warning'; 
  isVisible: boolean; 
  onClose: () => void; 
}) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const variantClasses = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black'
  };

  const emoji = {
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${variantClasses[variant]}`}>
        <span>{emoji[variant]}</span>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-current hover:opacity-75"
        >
          ×
        </button>
      </div>
    </div>
  );
}
