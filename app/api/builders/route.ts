import { NextResponse } from 'next/server';
import builders from '@/data/builders.json'; // Adjust path if needed

export async function GET() {
  // Example: Return all builders
  return NextResponse.json(builders);
}
