import { NextResponse } from "next/server"
import { projects } from "@/lib/data"

export async function GET() {
  try {
    // Filter for KarmaGap profiles only
    const karmaGapProfiles = projects.filter((project) => project.category === "KarmaGap")

    if (karmaGapProfiles.length === 0) {
      return NextResponse.json({ error: "No profiles found" }, { status: 404 })
    }

    // Select a random profile
    const randomIndex = Math.floor(Math.random() * karmaGapProfiles.length)
    const randomProfile = karmaGapProfiles[randomIndex]

    return NextResponse.json(randomProfile, { status: 200 })
  } catch (error) {
    console.error("Error fetching random profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
