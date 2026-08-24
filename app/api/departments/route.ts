import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthedUser, unauthorizedResponse } from "@/lib/auth/require-auth";
import { departmentCreateSchema, safeParse } from "@/lib/validations/server";

export async function GET(request: Request) {
  const auth = getAuthedUser(request);
  if (!auth) return unauthorizedResponse();

  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { employees: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        items: departments,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = getAuthedUser(request);
  if (!auth) return unauthorizedResponse();

  try {
    const rawBody = await request.json();
    const parsed = safeParse(departmentCreateSchema, rawBody);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: parsed.message }, { status: 400 });
    }

    const department = await prisma.department.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
      },
    });

    return NextResponse.json({ success: true, data: department }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
