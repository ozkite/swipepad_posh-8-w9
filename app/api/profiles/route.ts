// app/api/profiles/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Load both JSONs from private `data/` folder
    const celoBuilders = (await import("../../../data/profiles/celo_builders.json")).default;
    const karmagap = (await import("../../../data/profiles/karmagap.json")).default;

    // Combine and return
    const allProfiles = [
      ...celoBuilders.map((p: any) => ({ ...p, category: "Celo Builders" })),
      ...karmagap.map((p: any) => ({ ...p, category: "KarmaGap" })),
    ];

    return NextResponse.json(allProfiles, {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate", // cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Failed to load profiles:", error);
    return NextResponse.json({ error: "Failed to load profiles" }, { status: 500 });
  }
}
