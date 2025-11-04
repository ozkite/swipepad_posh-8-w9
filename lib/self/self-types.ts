export interface SelfVerificationData {
  verified: boolean;
  timestamp: number;
  nationality?: string;
  gender?: string;
  minimumAge?: number;
  userId?: string;
}

export interface SelfVerificationResult {
  status: 'success' | 'error';
  result: boolean;
  message?: string;
  credentialSubject?: any;
  timestamp?: string;
}

export interface SelfQRProps {
  onVerificationSuccess?: (data: SelfVerificationData) => void;
  onVerificationError?: (error: string) => void;
  userId?: string;
  className?: string;
  showInstructions?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export type VerificationStatus = 'idle' | 'loading' | 'verifying' | 'success' | 'error';
