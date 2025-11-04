export interface SelfVerificationData {
  verified: boolean;
  timestamp: number;
  nationality?: string;
  gender?: string;
  minimumAge?: number;
}

export interface SelfVerificationResult {
  status: 'success' | 'error';
  result: boolean;
  message?: string;
  credentialSubject?: any;
  timestamp?: string;
}

export interface SelfVerificationProps {
  onVerificationSuccess: (data: SelfVerificationData) => void;
  onVerificationError: (error: string) => void;
  onClose?: () => void;
}
