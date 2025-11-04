export const SELF_CONFIG = {
  appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || "SwipePad",
  scope: process.env.NEXT_PUBLIC_SELF_SCOPE || "swipepad-main",
  endpoint: process.env.NEXT_PUBLIC_SELF_ENDPOINT || "",
  logoBase64: "https://swipepad.xyz/logo.png", // Replace with actual SwipePad logo URL if available

  // Verification requirements - MUST MATCH BACKEND
  verificationConfig: {
    minimumAge: 18,
    ofac: false,
    excludedCountries: [],
  },

  // What users will reveal
  disclosures: {
    nationality: true,
    gender: true,
    name: false,
    date_of_birth: false,
    passport_number: false,
    expiry_date: false,
  },
};

export const getVerificationEndpoint = () => {
  const endpoint = process.env.NEXT_PUBLIC_SELF_ENDPOINT;
  if (!endpoint) {
    console.warn('NEXT_PUBLIC_SELF_ENDPOINT not set');
    return '';
  }
  return `${endpoint}/api/self-verify`;
};
