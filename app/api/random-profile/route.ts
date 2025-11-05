import { NextResponse } from "next/server"
import { projects } from "@/lib/data"

export async function GET() {
  try {
    const karmaGapProfiles = projects.filter((project) => project.category === "Projects")

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
