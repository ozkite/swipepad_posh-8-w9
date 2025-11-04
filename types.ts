kexport interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  raised: number;
  goal: number;
  backers: number;
  location: string;
  impact: string;
  verified: boolean;
  farcaster?: string;
  github?: string;
  linkedin?: string;
  wallet_address?: string;
}
