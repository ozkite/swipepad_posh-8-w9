export const SELF_CONFIG = {
  appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || "Swipepad",
  scope: process.env.NEXT_PUBLIC_SELF_SCOPE || "swipepad-identity",
  endpoint: process.env.NEXT_PUBLIC_SELF_ENDPOINT || "",
  logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png",
  
  // Verification requirements - MUST MATCH BACKEND
  verificationConfig: {
    minimumAge: 18,
    ofac: false,
    excludedCountries: [],
  },
  
  // What users will reveal
  disclosures: {
    nationality: true,
    gender: false, // Set to true if you want gender
    name: false,
    date_of_birth: false,
    passport_number: false,
    expiry_date: false,
  },
};

export const getVerificationEndpoint = () => {
  const endpoint = process.env.NEXT_PUBLIC_SELF_ENDPOINT;
  if (!endpoint) {
    console.error('❌ NEXT_PUBLIC_SELF_ENDPOINT not set in .env.local');
    return '';
  }
  return `${endpoint}/api/self-verify`;
};

export const QR_SIZES = {
  small: 200,
  medium: 280,
  large: 350,
};
