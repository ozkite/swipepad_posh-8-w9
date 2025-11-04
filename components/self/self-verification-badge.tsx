'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Shield } from 'lucide-react';

/**
 * Verification Status Badge
 * Shows if user is verified
 */
export default function SelfVerificationBadge() {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Check verification status
    const verification = localStorage.getItem('swipepad_self_verification');
    if (verification) {
      try {
        const data = JSON.parse(verification);
        const isExpired = Date.now() - data.timestamp > 24 * 60 * 60 * 1000; // 24 hours
        setIsVerified(!isExpired);
      } catch (error) {
        console.error('Failed to parse verification:', error);
      }
    }
  }, []);

  if (isVerified) {
    return (
      <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
        <ShieldCheck className="w-4 h-4" />
        <span>Verified</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
      <Shield className="w-4 h-4" />
      <span>Not Verified</span>
    </div>
  );
}
