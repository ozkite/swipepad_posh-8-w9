kimport { NextResponse } from 'next/server';
import builders from '@/data/builders.json';

export async function GET() {
  return NextResponse.json(builders);
}
