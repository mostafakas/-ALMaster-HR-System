import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    if (body.permissions && typeof body.permissions === 'object') {
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
      where: { id: params.id },
      data: body,
      include: { department: true },
    });
    return NextResponse.json({ success: true, data: employee });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.employee.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "Employee deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
