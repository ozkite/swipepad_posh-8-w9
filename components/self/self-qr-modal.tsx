'use client';

import React from 'react';
import { X } from 'lucide-react';
import SelfQRLive from './self-qr-live';
import type { SelfQRProps } from '@/lib/self/self-types';

interface SelfQRModalProps extends SelfQRProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

/**
 * Modal wrapper for Self QR Code
 * Use this to show QR code in a modal/popup
 */
export default function SelfQRModal({
  isOpen,
  onClose,
  title = 'Identity Verification',
  onVerificationSuccess,
  onVerificationError,
  userId,
  size = 'medium',
}: SelfQRModalProps) {
  if (!isOpen) return null;

  const handleSuccess = (data: any) => {
    onVerificationSuccess?.(data);
    // Auto-close modal after 2 seconds on success
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <SelfQRLive
            onVerificationSuccess={handleSuccess}
            onVerificationError={onVerificationError}
            userId={userId}
            size={size}
            showInstructions={true}
          />
        </div>
      </div>
    </div>
  );
}
