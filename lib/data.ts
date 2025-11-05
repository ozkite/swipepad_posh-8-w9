import { shuffleArray } from "./shuffle"
import celoBuilders from "../data/profiles/celo_builders.json"
import karmaGapProfiles from "../data/profiles/karmagap.json"

export interface Project {
  id: string
  name: string
  description: string
  category: string
  imageUrl: string
  website?: string
  twitter?: string
  discord?: string
  linkedin?: string
  farcaster?: string
  github?: string
  fundingGoal?: number
  fundingCurrent?: number
  likes?: number
  comments?: number
  walletAddress?: string
  isBookmarked?: boolean
  userHasLiked?: boolean
  userHasCommented?: boolean
  reportCount?: number
  boostAmount?: number
}

const celoBuilderProjects: Project[] = celoBuilders
  .filter((builder: any) => {
    const hasValidName = builder.Name && builder.Name.trim().length > 0 && builder.Name !== "N/A"
    return hasValidName
  })
  .map((builder: any, index: number) => ({
    id: `celo-builder-${index + 1}`,
    name: builder.Name,
    description: builder.Description || `Building on Celo blockchain - ${builder.Name}`,
    category: "Builders",
    imageUrl:
      builder["Profile Image URL"] && builder["Profile Image URL"] !== "N/A"
        ? builder["Profile Image URL"]
        : `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(builder.Name)}`,
    website: builder.Description && builder.Description.startsWith("http") ? builder.Description : undefined,
    linkedin: builder.LinkedIn && builder.LinkedIn !== "N/A" ? builder.LinkedIn : undefined,
    farcaster: builder.Farcaster && builder.Farcaster !== "N/A" ? builder.Farcaster : undefined,
    github: builder.GitHub && builder.GitHub !== "N/A" ? builder.GitHub : undefined,
    fundingGoal: Math.floor(Math.random() * 100000) + 10000,
    fundingCurrent: Math.floor(Math.random() * 50000) + 5000,
    likes: Math.floor(Math.random() * 500) + 10,
    comments: Math.floor(Math.random() * 100) + 1,
    walletAddress: builder.wallet_address,
    isBookmarked: false,
    userHasLiked: false,
    userHasCommented: false,
    reportCount: 0,
    boostAmount: 0,
  }))

const karmaGapProjects: Project[] = karmaGapProfiles
  .filter((profile: any) => {
    const hasValidName = profile.Name && profile.Name.trim().length > 0 && profile.Name !== "N/A"
    return hasValidName
  })
  .map((profile: any, index: number) => ({
    id: `karmagap-${index + 1}`,
    name: profile.Name,
    description: profile.Description || `A project from Projects - ${profile.Name}`,
    category: "Projects",
    imageUrl:
      profile["Profile Image URL"] && profile["Profile Image URL"] !== "N/A"
        ? profile["Profile Image URL"]
        : `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(profile.Name)}`,
    website: profile.Description && profile.Description.startsWith("http") ? profile.Description : undefined,
    linkedin: profile.LinkedIn && profile.LinkedIn !== "N/A" ? profile.LinkedIn : undefined,
    farcaster: profile.Farcaster && profile.Farcaster !== "N/A" ? profile.Farcaster : undefined,
    github: profile.GitHub && profile.GitHub !== "N/A" ? profile.GitHub : undefined,
    fundingGoal: Math.floor(Math.random() * 100000) + 10000,
    fundingCurrent: Math.floor(Math.random() * 50000) + 5000,
    likes: Math.floor(Math.random() * 500) + 10,
    comments: Math.floor(Math.random() * 100) + 1,
    walletAddress: profile.wallet_address,
    isBookmarked: false,
    userHasLiked: false,
    userHasCommented: false,
    reportCount: 0,
    boostAmount: 0,
  }))

export const projects: Project[] = [...celoBuilderProjects, ...karmaGapProjects]

export const categories = ["Projects", "Builders"]

export { shuffleArray }

export function getRandomProfiles(category?: string): Project[] {
  let filtered = projects
  if (category) {
    filtered = projects.filter((project) => project.category === category)
  }
  return shuffleArray(filtered)
}

export function getRandomProfile(category?: string): Project | null {
  const filtered = category ? projects.filter((project) => project.category === category) : projects
  if (filtered.length === 0) return null
  return filtered[Math.floor(Math.random() * filtered.length)]
}
