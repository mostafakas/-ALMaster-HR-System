import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth/jwt";
import { buildAuthCookie } from "@/lib/auth/cookies";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/auth/rate-limit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const ip = getClientIp(req);
    const rateLimitKey = `login:${ip}:${String(email).toLowerCase()}`;
    const rl = checkRateLimit(rateLimitKey);
    if (rl.limited) {
      return NextResponse.json(
        { message: "Too many login attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds ?? 60) } }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    resetRateLimit(rateLimitKey);

    // Generate token
    const token = signToken({ userId: user.id });

    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      accessToken: token,
      user: userWithoutPassword,
    });
    // Also set an httpOnly cookie (defense-in-depth / used by middleware for
    // page-level redirects). The client still gets accessToken in the JSON
    // body for the existing Authorization-header flow, so nothing else in
    // the frontend needs to change.
    response.headers.append("Set-Cookie", buildAuthCookie(token));
    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
