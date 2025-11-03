import type { Project } from "@/types";

// Import your JSON files
import celoBuildersRaw from '@/public/100_celo_talent_100_profiles.json';
import karmaGapRaw from '@/public/100_celo_karmagap_json_.json';

// Fisher-Yates shuffle – unbiased, in-place
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function mapProfile(raw: any, category: string): Project {
  return {
    id: raw.Name || 'unknown',
    name: raw.Name || 'Untitled',
    category,
    description: raw.Description && raw.Description !== 'N/A' ? raw.Description.trim() : '',
    imageUrl: raw["Profile Image URL"] && raw["Profile Image URL"] !== 'N/A'
  ? raw["Profile Image URL"].trim().replace(/\s+$/, '')
  : '/placeholder.svg',
    raised: 0,
    goal: 10000,
    backers: 0,
    location: '',
    impact: '',
    verified: true,
    farcaster: raw.Farcaster && raw.Farcaster !== 'N/A' ? raw.Farcaster.trim() : undefined,
    github: raw.GitHub && raw.GitHub !== 'N/A' ? raw.GitHub.trim() : undefined,
    linkedin: raw.LinkedIn && raw.LinkedIn !== 'N/A' ? raw.LinkedIn.trim() : undefined,
    wallet_address: raw.wallet_address && raw.wallet_address !== 'N/A' ? raw.wallet_address.trim() : undefined,
  };
}

const celoBuilders = (celoBuildersRaw as any[]).map(p => mapProfile(p, 'Celo Builders'));
const karmaGapProjects = (karmaGapRaw as any[]).map(p => mapProfile(p, 'KarmaGap'));
export const allProjects = [...celoBuilders, ...karmaGapProjects];

export const categories = [
  "Celo Builders",
  "KarmaGap",
  "Regeneration",
  "Climate",
  "Education",
  "Wildlife",
  "Health",
  "Community",
  "Technology",
  "Arts & Culture",
];

export function getRandomProfiles(category: string) {
  return allProjects.filter(p => p.category === category);
}

// Export empty arrays for compatibility (not used, but prevents errors)
export const projects = allProjects;
