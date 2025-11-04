'use client';

import React from 'react';
import SelfQRLive from './self-qr-live';
import type { SelfQRProps } from '@/lib/self/self-types';

/**
 * Inline QR Code Component
 * Use this to embed QR code directly in your page
 */
export default function SelfQRInline({
  onVerificationSuccess,
  onVerificationError,
  userId,
  size = 'medium',
  className = '',
}: SelfQRProps) {
  return (
    <div className={`bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 ${className}`}>
      <SelfQRLive
        onVerificationSuccess={onVerificationSuccess}
        onVerificationError={onVerificationError}
        userId={userId}
        size={size}
        showInstructions={true}
      />
    </div>
  );
}
