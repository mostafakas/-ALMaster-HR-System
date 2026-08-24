import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthedUser, unauthorizedResponse } from "@/lib/auth/require-auth";
import { departmentUpdateSchema, safeParse } from "@/lib/validations/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthedUser(request);
  if (!auth) return unauthorizedResponse();

  try {
    const { id } = await params;
    const department = await prisma.department.findUnique({
      where: { id },
    });
    if (!department) {
      return NextResponse.json({ success: false, message: "Department not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: department });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthedUser(request);
  if (!auth) return unauthorizedResponse();

  try {
    const { id } = await params;
    const rawBody = await request.json();
    const parsed = safeParse(departmentUpdateSchema, rawBody);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: parsed.message }, { status: 400 });
    }

    const department = await prisma.department.update({
      where: { id },
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
      },
    });
    return NextResponse.json({ success: true, data: department });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ success: false, message: "Department not found" }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthedUser(request);
  if (!auth) return unauthorizedResponse();

  try {
    const { id } = await params;

    const employeeCount = await prisma.employee.count({ where: { departmentId: id } });
    if (employeeCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete: ${employeeCount} employee(s) are still assigned to this department. Reassign them first.`,
          employeeCount,
        },
        { status: 409 }
      );
    }

    await prisma.department.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: "Department deleted" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ success: false, message: "Department not found" }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
