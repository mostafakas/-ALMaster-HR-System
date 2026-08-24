import { NextResponse } from "next/server";
import { buildClearAuthCookie } from "@/lib/auth/cookies";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.headers.append("Set-Cookie", buildClearAuthCookie());
  return response;
}
