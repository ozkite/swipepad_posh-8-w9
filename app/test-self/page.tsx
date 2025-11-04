'use client';

import { useState } from 'react';
import SelfQRModal from '@/components/self/self-qr-modal';
import SelfQRInline from '@/components/self/self-qr-inline';
import SelfVerificationBadge from '@/components/self/self-verification-badge';

export default function TestSelfPage() {
  const [showModal, setShowModal] = useState(false);
  const [verificationData, setVerificationData] = useState<any>(null);

  const handleVerificationSuccess = (data: any) => {
    console.log('✅ Verification successful!', data);
    setVerificationData(data);
    alert('Identity verified successfully!');
  };

  const handleVerificationError = (error: string) => {
    console.error('❌ Verification error:', error);
    alert(`Verification error: ${error}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Self Protocol Test
        </h1>

        <div className="flex justify-center mb-8">
          <SelfVerificationBadge />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Modal QR Code</h2>
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
            >
              Open QR Modal
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Status</h2>
            <p className="text-gray-600">
              {verificationData ? '✅ Verified!' : '⏳ Not verified'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Inline QR Code
          </h2>
          <SelfQRInline
            onVerificationSuccess={handleVerificationSuccess}
            onVerificationError={handleVerificationError}
            size="medium"
          />
        </div>

        <SelfQRModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onVerificationSuccess={handleVerificationSuccess}
          onVerificationError={handleVerificationError}
          size="medium"
        />
      </div>
    </div>
  );
}
