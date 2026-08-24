import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth/jwt";
import { buildAuthCookie } from "@/lib/auth/cookies";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // SECURITY FIX: `role` is intentionally NOT read from the request body.
    // Previously a caller could POST { role: "Admin" } and self-assign any
    // role on signup. Self-registration always gets the lowest privilege
    // role; granting anything higher must happen afterwards through an
    // authenticated admin action (e.g. editing the Employee record), not at
    // signup time.
    const { email, password, fullName, avatarUrl } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const ip = getClientIp(req);
    const rl = checkRateLimit(`register:${ip}`);
    if (rl.limited) {
      return NextResponse.json(
        { message: "Too many attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds ?? 60) } }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Deliberately generic — avoids confirming to an anonymous caller
      // whether a given email is already registered (user enumeration).
      return NextResponse.json(
        { message: "Unable to complete registration with the provided details." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user — role is always the default; see note above.
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: "Default",
        avatarUrl,
      },
    });

    // Generate token
    const token = signToken({ userId: user.id });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      accessToken: token,
      user: userWithoutPassword,
    });
    response.headers.append("Set-Cookie", buildAuthCookie(token));
    return response;
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
