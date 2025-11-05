'use client';

import { useState } from 'react';
import SelfQRInline from '@/components/self/self-qr-inline';

export default function TestSelfPage() {
  const [verified, setVerified] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          SwipePad Identity Verification
        </h1>
        
        {!verified ? (
          <SelfQRInline
            onVerificationSuccess={(data) => {
              console.log('Verified!', data);
              setVerified(true);
              alert('Identity verified successfully!');
            }}
            onVerificationError={(err) => {
              console.error('Error:', err);
              alert(`Error: ${err}`);
            }}
            size="medium"
          />
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-2">✅ Verified!</h2>
            <p className="text-green-600">Your identity has been successfully verified.</p>
          </div>
        )}
      </div>
    </div>
  );
}
