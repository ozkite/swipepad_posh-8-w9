// lib/self-protocol/api.ts
export const SELF_PROTOCOL_API_URL = "https://api.self.inc/v1";
export const SELF_APP_ID = process.env.NEXT_PUBLIC_SELF_APP_ID || "your-app-id";

export async function verifySelfProof(proof: string) {
  const res = await fetch(`${SELF_PROTOCOL_API_URL}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ proof, appId: SELF_APP_ID }),
  });
  return res.json();
}
