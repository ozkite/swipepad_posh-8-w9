'use client';

import React, { useState, useEffect } from 'react';
import { getUniversalLink } from '@selfxyz/core';
import { SelfQRcodeWrapper, SelfAppBuilder, type SelfApp } from '@selfxyz/qrcode';
import { ethers } from 'ethers';
import { SELF_CONFIG, getVerificationEndpoint, QR_SIZES } from '@/lib/self/self-config';
import type { SelfQRProps, VerificationStatus } from '@/lib/self/self-types';
import { Loader2, CheckCircle2, AlertCircle, Smartphone, Monitor } from 'lucide-react';

/**
 * Self Protocol Live QR Code Component
 * 
 * This component displays a live, working QR code for identity verification.
 * Users scan it with the Self app to verify their identity.
 * 
 * @param onVerificationSuccess - Callback when verification succeeds
 * @param onVerificationError - Callback when verification fails
 * @param userId - Optional user ID (defaults to zero address)
 * @param className - Additional CSS classes
 * @param showInstructions - Show/hide user instructions
 * @param size - QR code size: 'small' | 'medium' | 'large'
 */
export default function SelfQRLive({
  onVerificationSuccess,
  onVerificationError,
  userId,
  className = '',
  showInstructions = true,
  size = 'medium',
}: SelfQRProps) {
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const [universalLink, setUniversalLink] = useState('');
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [error, setError] = useState<string>('');
  const [userIdAddress] = useState(userId || ethers.ZeroAddress);

  useEffect(() => {
    initializeSelfApp();
  }, [userIdAddress]);

  const initializeSelfApp = async () => {
    try {
      setStatus('loading');
      setError('');

      const endpoint = getVerificationEndpoint();
      
      if (!endpoint) {
        throw new Error('Verification endpoint not configured. Set NEXT_PUBLIC_SELF_ENDPOINT in .env.local');
      }

      console.log('🔧 Initializing Self Protocol...');
      console.log('📍 Endpoint:', endpoint);

      const app = new SelfAppBuilder({
        version: 2,
        appName: SELF_CONFIG.appName,
        scope: SELF_CONFIG.scope,
        endpoint: endpoint,
        logoBase64: SELF_CONFIG.logoBase64,
        userId: userIdAddress,
        endpointType: 'staging_https',
        userIdType: 'hex',
        userDefinedData: 'Swipepad Identity Verification',
        disclosures: {
          ...SELF_CONFIG.verificationConfig,
          ...SELF_CONFIG.disclosures,
        },
      }).build();

      setSelfApp(app);
      setUniversalLink(getUniversalLink(app));
      setStatus('idle');
      
      console.log('✅ Self Protocol initialized successfully');
    } catch (err) {
      console.error('❌ Failed to initialize Self Protocol:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setStatus('error');
      onVerificationError?.(errorMessage);
    }
  };

  const handleVerificationSuccess = () => {
    console.log('✅ Identity verification successful!');
    setStatus('success');
    
    const verificationData = {
      verified: true,
      timestamp: Date.now(),
      userId: userIdAddress,
      minimumAge: SELF_CONFIG.verificationConfig.minimumAge,
    };
    
    // Save to localStorage
    localStorage.setItem('swipepad_self_verification', JSON.stringify(verificationData));
    
    onVerificationSuccess?.(verificationData);
  };

  const handleVerificationError = () => {
    console.error('❌ Identity verification failed');
    const errorMsg = 'Verification failed. Please try again.';
    setError(errorMsg);
    setStatus('error');
    onVerificationError?.(errorMsg);
  };

  const openSelfApp = () => {
    if (universalLink) {
      window.open(universalLink, '_blank');
    }
  };

  const qrSize = QR_SIZES[size];

  // Loading State
  if (status === 'loading') {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Initializing verification...</p>
        <p className="text-gray-500 text-sm mt-2">Please wait</p>
      </div>
    );
  }

  // Error State
  if (status === 'error') {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 text-center mb-2">
            Configuration Error
          </h3>
          <p className="text-red-700 text-sm text-center mb-4">{error}</p>
          <button
            onClick={initializeSelfApp}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Success State
  if (status === 'success') {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-900 text-center mb-2">
            Verification Successful!
          </h3>
          <p className="text-green-700 text-center">
            Your identity has been verified. You can now access all features.
          </p>
        </div>
      </div>
    );
  }

  // Main QR Code Display
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {showInstructions && (
        <div className="mb-6 text-center max-w-md">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Verify Your Identity
          </h3>
          <p className="text-gray-600 mb-4">
            Scan the QR code with the Self app to complete verification
          </p>
        </div>
      )}

      {/* QR Code Container */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
        {selfApp ? (
          <div className="space-y-4">
            {/* Instructions Badge */}
            <div className="flex gap-2 justify-center mb-4">
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                <Monitor className="w-4 h-4" />
                <span>Desktop: Scan QR</span>
              </div>
              <div className="md:hidden flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                <Smartphone className="w-4 h-4" />
                <span>Mobile: Tap button</span>
              </div>
            </div>

            {/* Live QR Code */}
            <div className="flex justify-center">
              <SelfQRcodeWrapper
                selfApp={selfApp}
                onSuccess={handleVerificationSuccess}
                onError={handleVerificationError}
              />
            </div>

            {/* Mobile Universal Link Button */}
            <div className="md:hidden">
              <button
                onClick={openSelfApp}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                <Smartphone className="w-5 h-5" />
                <span>Open Self App</span>
              </button>
            </div>

            {/* Requirements */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-2">
                ✓ Requirements:
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Age 18+ verified</li>
                <li>• Valid passport/ID</li>
                <li>• Privacy-preserving ZK proof</li>
                <li>• No data stored</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center" style={{ width: qrSize, height: qrSize }}>
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Powered by{' '}
          <a
            href="https://self.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Self Protocol
          </a>
        </p>
      </div>
    </div>
  );
}
