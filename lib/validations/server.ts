import { z } from "zod";

/**
 * Server-side validation used inside the API routes themselves.
 *
 * These are deliberately SEPARATE from lib/validations/employee.ts and
 * lib/validations/department.ts, which are the *frontend form* schemas
 * (built around the Figma tab layout and, in the department case, contain
 * fields like `color`/`iconFile`/`headIds` that don't even exist on the
 * Prisma Department model). Re-using those directly server-side would
 * either reject legitimate API payloads (e.g. employeeSchema requires
 * departmentId, but Prisma's Employee.departmentId is optional) or demand
 * fields the database doesn't have.
 *
 * These schemas mirror prisma/schema.prisma exactly: required fields match
 * the required (non-`?`) columns, everything else is optional. They exist so
 * every request that reaches Prisma has actually been shape-checked first
 * (previously the route handlers passed `body` straight through).
 */

export const employeeCreateSchema = z.object({
  fullName: z.string().min(2, "fullName is required (min 2 chars)"),
  email: z.string().email("A valid email is required"),
  phoneNumber: z.string().optional().nullable(),
  countryCode: z.string().optional().nullable(),
  birthDate: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  maritalStatus: z.string().optional().nullable(),
  personalAddress: z.string().optional().nullable(),
  emergencyContactName: z.string().optional().nullable(),
  emergencyContactPhone: z.string().optional().nullable(),
  emergencyContactRelation: z.string().optional().nullable(),

  jobTitle: z.string().min(1, "jobTitle is required"),
  seniorityLevel: z.string().min(1, "seniorityLevel is required"),
  departmentId: z.string().optional().nullable(),
  role: z.string().min(1, "role is required"),
  joinDate: z.string().optional().nullable(),
  probationEndDate: z.string().optional().nullable(),
  workLocation: z.string().optional().nullable(),
  contractType: z.string().optional().nullable(),
  workingHoursFrom: z.string().optional().nullable(),
  workingHoursTo: z.string().optional().nullable(),
  permissions: z.union([z.string(), z.record(z.string(), z.any())]).optional().nullable(),

  bankName: z.string().optional().nullable(),
  bankBranch: z.string().optional().nullable(),
  accountHolderName: z.string().optional().nullable(),
  iban: z.string().optional().nullable(),
  swiftCode: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  salary: z.string().optional().nullable(),
  salaryDay: z.string().optional().nullable(),

  nationalIdNumber: z.string().optional().nullable(),
  nationalIdExpiry: z.string().optional().nullable(),
  passportNumber: z.string().optional().nullable(),
  passportExpiry: z.string().optional().nullable(),
  drivingLicenseNumber: z.string().optional().nullable(),
  drivingLicenseExpiry: z.string().optional().nullable(),
  nationalIdFrontFile: z.string().optional().nullable(),
  nationalIdBackFile: z.string().optional().nullable(),
  passportFile: z.string().optional().nullable(),
  contractFile: z.string().optional().nullable(),
});

// PATCH allows partial updates, but every field must still match its type
// if present — this is also what closes the previous mass-assignment gap
// (unknown keys like `id`, `userId`, `createdAt` are stripped by default
// with zod's `.parse`, since they're not declared on the schema).
export const employeeUpdateSchema = employeeCreateSchema.partial();

export const departmentCreateSchema = z.object({
  name: z.string().min(2, "name must be at least 2 characters").max(60),
  description: z.string().max(500).optional().nullable(),
});

export const departmentUpdateSchema = departmentCreateSchema.partial();

/**
 * Runs a zod schema and returns either the parsed data or a formatted
 * error string, so route handlers can do:
 *
 *   const result = safeParse(employeeCreateSchema, body);
 *   if (!result.success) return NextResponse.json({ success: false, message: result.message }, { status: 400 });
 */
export function safeParse<T extends z.ZodTypeAny>(schema: T, data: unknown) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true as const, data: result.data as z.infer<T> };
  }
  const message = result.error.issues
    .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("; ");
  return { success: false as const, message };
}
