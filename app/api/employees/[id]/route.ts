import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthedUser, unauthorizedResponse } from "@/lib/auth/require-auth";
import { employeeUpdateSchema, safeParse } from "@/lib/validations/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthedUser(request);
  if (!auth) return unauthorizedResponse();

  try {
    const { id } = await params;
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: { department: true },
    });
    if (!employee) {
      return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: employee });
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
    const parsed = safeParse(employeeUpdateSchema, rawBody);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: parsed.message }, { status: 400 });
    }
    // Build an explicit whitelist of updatable fields instead of spreading
    // the raw body into Prisma — this is what closes the mass-assignment
    // gap (a caller can no longer set arbitrary columns that aren't part
    // of employeeUpdateSchema, e.g. id/createdAt/userId).
    const body: Record<string, any> = { ...parsed.data };

    if (body.permissions && typeof body.permissions === "object") {
      body.permissions = JSON.stringify(body.permissions);
    }

    if (body.birthDate) body.birthDate = new Date(body.birthDate);
    if (body.joinDate) body.joinDate = new Date(body.joinDate);
    if (body.probationEndDate) body.probationEndDate = new Date(body.probationEndDate);
    if (body.nationalIdExpiry) body.nationalIdExpiry = new Date(body.nationalIdExpiry);
    if (body.passportExpiry) body.passportExpiry = new Date(body.passportExpiry);
    if (body.drivingLicenseExpiry) body.drivingLicenseExpiry = new Date(body.drivingLicenseExpiry);

    // Convert empty string for departmentId to null
    if (body.departmentId === "") {
      body.departmentId = null;
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: body,
      include: { department: true },
    });
    return NextResponse.json({ success: true, data: employee });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 });
    }
    if (error?.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "An employee with this email already exists." },
        { status: 409 }
      );
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
    await prisma.employee.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: "Employee deleted" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
