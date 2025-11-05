import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..', '..');

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(projectRoot, 'data', 'projects.json'); // Adjust path if needed
    const fileContents = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(fileContents);

    // Optional: Add server-side filtering, processing, or rate limiting here
    // Example: Filter based on a query parameter
    // const { category } = request.nextUrl.searchParams;
    // if (category) {
    //   jsonData = jsonData.filter(item => item.category === category);
    // }

    return NextResponse.json(jsonData);

  } catch (error) {
    console.error("Error reading project data:", error);
    return NextResponse.json(
      { error: "Failed to load project data" },
      { status: 500 }
    );
  }
}
