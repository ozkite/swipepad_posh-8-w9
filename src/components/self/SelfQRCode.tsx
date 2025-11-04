'use client';
import { useState, useEffect } from 'react';
import { SelfAppBuilder, SelfQRcodeWrapper } from '@selfxyz/qrcode';

export default function SelfQRCode() {
  const [selfApp, setSelfApp] = useState<any>(null);

  useEffect(() => {
    try {
      const app = new SelfAppBuilder({
        version: 2,
        appName: 'SwipePad',                    // ← Your app name
        scope: 'swipepad-main',                // ← Your scope
        endpoint: 'https://playground.self.xyz', // ← Staging endpoint
        userId: 'demo-user',                   // ← Can be wallet address later
        userIdType: 'uuid',
        endpointType: 'staging_https',
        disclosures: {
          minimumAge: 18,
          nationality: true,
        },
      }).build();

      setSelfApp(app);
    } catch (err) {
      console.error('Self QR init failed:', err);
    }
  }, []);

  if (!selfApp) return <div>Loading QR...</div>;

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="font-bold mb-2">Verify with Self</h3>
      <SelfQRcodeWrapper
        selfApp={selfApp}
        onSuccess={() => console.log('✅ Verified!')}
        onError={(err) => console.error('❌ Error:', err)}
      />
    </div>
  );
}
