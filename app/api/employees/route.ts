import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    // Note: Redux passes pagination & search params.

    const employees = await prisma.employee.findMany({
      where: search
        ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" } },
              { jobTitle: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      include: {
        department: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        items: employees,
        meta: {
          total: employees.length,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // permissions is JSON string or object
    const permissionsStr = typeof body.permissions === 'object' ? JSON.stringify(body.permissions) : body.permissions;

    const employee = await prisma.employee.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        countryCode: body.countryCode,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        gender: body.gender,
        nationality: body.nationality,
        maritalStatus: body.maritalStatus,
        personalAddress: body.personalAddress,
        emergencyContactName: body.emergencyContactName,
        emergencyContactPhone: body.emergencyContactPhone,
        emergencyContactRelation: body.emergencyContactRelation,
        
        jobTitle: body.jobTitle,
        seniorityLevel: body.seniorityLevel,
        departmentId: body.departmentId || null,
        role: body.role,
        joinDate: body.joinDate ? new Date(body.joinDate) : null,
        probationEndDate: body.probationEndDate ? new Date(body.probationEndDate) : null,
        workLocation: body.workLocation,
        contractType: body.contractType,
        workingHoursFrom: body.workingHoursFrom,
        workingHoursTo: body.workingHoursTo,
        permissions: permissionsStr,

        bankName: body.bankName,
        bankBranch: body.bankBranch,
        accountHolderName: body.accountHolderName,
        iban: body.iban,
        swiftCode: body.swiftCode,
        currency: body.currency,
        salary: body.salary,
        salaryDay: body.salaryDay,

        nationalIdNumber: body.nationalIdNumber,
        nationalIdExpiry: body.nationalIdExpiry ? new Date(body.nationalIdExpiry) : null,
        passportNumber: body.passportNumber,
        passportExpiry: body.passportExpiry ? new Date(body.passportExpiry) : null,
        drivingLicenseNumber: body.drivingLicenseNumber,
        drivingLicenseExpiry: body.drivingLicenseExpiry ? new Date(body.drivingLicenseExpiry) : null,
      },
      include: {
        department: true,
      },
    });

    return NextResponse.json({ success: true, data: employee }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
