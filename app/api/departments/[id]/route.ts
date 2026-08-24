import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
  try {
    const { id } = await params;
    const body = await request.json();

    const department = await prisma.department.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
      },
    });
    return NextResponse.json({ success: true, data: department });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.department.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: "Department deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
