import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isValid } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date | string | number | undefined, formatStr: string = "PPP") {
  if (!date) return ""
  const d = new Date(date)
  if (!isValid(d)) return ""
  return format(d, formatStr)
}

/**
 * Formats a number as currency
 */
export function formatCurrency(amount: number, currency: string = "USD", locale: string = "en-US") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount)
}

/**
 * Creates a slug from a string
 */
export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Safely access nested object properties
 */
export function getNestedValue(obj: any, path: string) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj)
}

/**
 * Determines card border and accent color dynamically based on employee role title and freelance status.
 * - Head of Department -> Blue (#2563EB)
 * - Team Leader -> Orange (#F97316)
 * - Freelancer -> Green (#00B927)
 */
export function getEmployeeRoleColor(role?: string, isFreelance?: boolean): {
  color: string;
  bg: string;
  borderClass: string;
} {
  const normalized = (role || "").toLowerCase().trim();

  // Check if explicitly freelance or title contains freelance / freelancer / مستقل
  if (isFreelance || normalized.includes("freelance") || normalized.includes("freelancer") || normalized.includes("مستقل")) {
    return {
      color: "#00b927",
      bg: "bg-[#00b927]/10",
      borderClass: "border-[#00b927]",
    };
  }

  // Head of Department check (e.g. "Head of Department", "Head of Programming", "Head", "مدير قسم", "رئيس قسم")
  if (normalized.includes("head") || normalized.includes("مدير قسم") || normalized.includes("رئيس قسم")) {
    return {
      color: "#2563EB",
      bg: "bg-[#2563EB]/10",
      borderClass: "border-[#2563EB]",
    };
  }

  // Team Leader check (e.g. "Team Leader", "Team Lead", "Lead", "قائد فريق")
  if (normalized.includes("leader") || normalized.includes("lead") || normalized.includes("قائد")) {
    return {
      color: "#F97316",
      bg: "bg-[#F97316]/10",
      borderClass: "border-[#F97316]",
    };
  }

  // Default fallback (Blue)
  return {
    color: "#2563EB",
    bg: "bg-[#2563EB]/10",
    borderClass: "border-[#2563EB]",
  };
}
