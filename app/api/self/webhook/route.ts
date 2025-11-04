import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  
  console.log('Self Verification Webhook Received:', body);
  // TODO: Log to your database for analytics
  
  return new Response('OK', { status: 200 });
}
