'use client';
import { useState, useEffect } from 'react';
import { SelfAppBuilder, SelfQRcodeWrapper } from '@selfxyz/qrcode';
import { ethers } from 'ethers';

export default function SelfKYC({ walletAddress }: { walletAddress: string }) {
  const [selfApp, setSelfApp] = useState<any>(null);

  useEffect(() => {
    if (!walletAddress) return;

    try {
      const app = new SelfAppBuilder({
        version: 2,
        appName: 'SwipePad',
        scope: 'swipepad-kyc',
        endpoint: 'https://playground.self.xyz',
        userId: walletAddress,
        userIdType: 'hex',
        endpointType: 'staging_https',
        disclosures: {
          minimumAge: 18,
          nationality: true,
        },
        logoBase64: 'https://swipepad.xyz/logo.png', // optional branded logo
      }).build();

      setSelfApp(app);
    } catch (err) {
      console.error('Failed to init Self KYC:', err);
    }
  }, [walletAddress]);

  const handleSuccess = () => {
    console.log('✅ KYC verified for:', walletAddress);
    // Optional: call your backend to mark user as verified
  };

  if (!selfApp) return <div className="text-center py-4">Loading KYC...</div>;

  return (
    <div className="flex flex-col items-center p-6 border rounded-lg max-w-md mx-auto bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Verify Your Identity</h3>
      <SelfQRcodeWrapper
        selfApp={selfApp}
        onSuccess={handleSuccess}
        onError={(err) => console.error('KYC failed:', err)}
      />
      <p className="mt-3 text-sm text-gray-600 text-center">
        Scan with the <strong>Self app</strong> (iOS/Android) to complete verification.
      </p>
    </div>
  );
}
