'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; // Ensure lucide-react is installed if using this icon
import { getUniversalLink } from '@selfxyz/core';
import { SelfQRcodeWrapper, SelfAppBuilder, type SelfApp } from '@selfxyz/qrcode';
import { ethers } from 'ethers';
import { SELF_CONFIG, getVerificationEndpoint } from '@/lib/selfConfig'; // Updated import path
import type { SelfVerificationProps } from '@/lib/selfTypes'; // Updated import path

export default function SelfVerificationModal({
  onVerificationSuccess,
  onVerificationError,
  onClose,
}: SelfVerificationProps) {
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const [universalLink, setUniversalLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userId] = useState(ethers.ZeroAddress); // Consider using actual wallet address if available

  useEffect(() => {
    try {
      const endpoint = getVerificationEndpoint();

      if (!endpoint) {
        throw new Error('Verification endpoint not configured. Please set NEXT_PUBLIC_SELF_ENDPOINT');
      }

      const app = new SelfAppBuilder({
        version: 2,
        appName: SELF_CONFIG.appName,
        scope: SELF_CONFIG.scope,
        endpoint: endpoint,
        logoBase64: SELF_CONFIG.logoBase64,
        userId: userId,
        endpointType: 'staging_https' as const,
        userIdType: 'hex',
        userDefinedData: 'SwipePad Profile/Project Verification',
        disclosures: {
          ...SELF_CONFIG.verificationConfig,
          ...SELF_CONFIG.disclosures,
        },
      }).build();

      setSelfApp(app);
      setUniversalLink(getUniversalLink(app));
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize Self app:', error);
      onVerificationError(
        error instanceof Error ? error.message : 'Failed to initialize verification system'
      );
      setIsLoading(false);
    }
  }, [userId, onVerificationError]);

  const handleSuccessfulVerification = () => {
    console.log('✅ Identity verification successful!');
    onVerificationSuccess({
      verified: true,
      timestamp: Date.now(),
      minimumAge: SELF_CONFIG.verificationConfig.minimumAge,
    });
  };

  const handleVerificationError = () => {
    console.error('❌ Identity verification failed');
    onVerificationError('Identity verification failed. Please try again.');
  };

  const openSelfApp = () => {
    if (universalLink) {
      window.open(universalLink, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Verify Your Identity</h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete identity verification for SwipePad
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Initializing verification...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {selfApp ? (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Desktop:</strong> Scan the QR code with the Self app
                    </p>
                    <p className="text-sm text-blue-800 mt-1 md:hidden">
                      <strong>Mobile:</strong> Tap the button below to open the Self app
                    </p>
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center">
                    <SelfQRcodeWrapper
                      selfApp={selfApp}
                      onSuccess={handleSuccessfulVerification}
                      onError={handleVerificationError}
                    />
                  </div>

                  {/* Mobile Universal Link Button */}
                  <div className="md:hidden">
                    <button
                      onClick={openSelfApp}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Open Self App</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Requirements */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Verification Requirements:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Must be 18 years or older</li>
                      <li>• Valid passport or ID document</li>
                      <li>• Privacy-preserving zero-knowledge proof</li>
                      <li>• No personal data stored on our servers</li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 font-medium">
                      Failed to initialize verification system
                    </p>
                    <p className="text-red-500 text-sm mt-1">
                      Please check your environment configuration
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
            <p className="text-xs text-center text-gray-600">
              Powered by{' '}
              <a
                href="https://self.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Self Protocol
              </a>{' '}
              - Decentralized Identity Verification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
