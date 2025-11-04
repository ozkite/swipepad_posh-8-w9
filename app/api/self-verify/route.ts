import { NextRequest, NextResponse } from 'next/server';
import {
  SelfBackendVerifier,
  AllIds,
  DefaultConfigStore,
} from '@selfxyz/core';

// Define your verification requirements (MUST MATCH FRONTEND)
const verification_config = {
  excludedCountries: [],
  ofac: false,
  minimumAge: 18,
};

// Create configuration store
const configStore = new DefaultConfigStore(verification_config);

// Initialize the verifier
// Note: Using 'self-playground' scope and playground endpoint as per Next.js quickstart guide
// The mockPassport flag (3rd argument) should be true for staging/testnet, false for mainnet
const selfBackendVerifier = new SelfBackendVerifier(
  "self-playground", // Scope - often uses a standard one like 'self-playground'
  "https://playground.self.xyz/api/verify", // Verification endpoint
  true, // mockPassport: true for staging/testnet, false for mainnet
  AllIds, // Accept all document types
  configStore,
  'hex' // Address format - adjust if needed (e.g., 'uuid')
);

export async function POST(req: NextRequest) {
  try {
    const { attestationId, proof, publicSignals, userContextData } = await req.json();

    // Validate required fields
    if (!proof || !publicSignals || !attestationId || !userContextData) {
      return NextResponse.json(
        {
          status: 'error',
          result: false,
          message: 'Proof, publicSignals, attestationId and userContextData are required',
        },
        { status: 200 } // Self guide uses 200 even for errors
      );
    }

    console.log('🔍 Starting verification...');
    console.log('📋 Attestation ID:', attestationId);

    // Verify the proof
    const result = await selfBackendVerifier.verify(
      attestationId,
      proof,
      publicSignals,
      userContextData
    );

    console.log('📊 Verification result:', result);

    if (result.isValidDetails.isValid) {
      console.log('✅ Verification successful!');

      return NextResponse.json({
        status: 'success',
        result: true,
        message: 'Identity verification successful',
        credentialSubject: result.discloseOutput,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.log('❌ Verification failed:', result.isValidDetails);

      return NextResponse.json(
        {
          status: 'error',
          result: false,
          message: 'Identity verification failed',
          details: result.isValidDetails,
        },
         { status: 200 } // Self guide uses 200 even for errors
      );
    }
  } catch (error) {
    console.error('💥 Verification error:', error);

    return NextResponse.json(
      {
        status: 'error',
        result: false,
        message: 'Internal verification error',
        error_code: 'UNKNOWN_ERROR',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
       { status: 200 } // Self guide uses 200 even for errors
    );
  }
}

// Optional GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    message: 'Self Protocol verification endpoint for SwipePad',
    scope: "self-playground", // Reflects the configured scope
    status: 'active',
    timestamp: new Date().toISOString(),
  });
}
