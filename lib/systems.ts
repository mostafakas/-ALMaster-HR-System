import {
  IdCard,
  Database,
  Banknote,
  Contact,
  type LucideIcon,
} from "lucide-react";

export type SystemId = "hr" | "pm" | "crm" | "finances";

/** Backwards-compatible alias — the CRM module was renamed in the URL
 * layer to "client-relations-management" but the internal SystemId
 * stays as "crm" so existing localStorage entries continue to resolve. */

export interface SystemDefinition {
  id: SystemId;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
  href: string;
  devOnly?: boolean;
}

export const SYSTEMS: SystemDefinition[] = [
  {
    id: "hr",
    name: "Human Resources (HR) System",
    shortName: "Human Resources (HR) System",
    description: "Manage, Track your Employees, Departments",
    icon: IdCard,
    href: "/human-resources",
    devOnly: true,
  },
  {
    id: "pm",
    name: "Project Management (PM) System",
    shortName: "Project Management (PM) System",
    description: "Manage, Track your Projects, Tasks.",
    icon: Database,
    href: "/project-management",
    devOnly: true,
  },
  {
    id: "crm",
    name: "Client Relations Management",
    shortName: "Client Relations Management",
    description: "Manage proposals, clients, and customer relations.",
    icon: Contact,
    href: "/client-relations-management",
    devOnly: false,
  },
  {
    id: "finances",
    name: "Finances Management System",
    shortName: "Finances Management System",
    description: "Manage company finances.",
    icon: Banknote,
    href: "/finances-management",
    devOnly: true,
  },
];

export function areDevSystemsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_ALL_SYSTEMS === "true";
}

export function isSystemEnabled(systemOrId: SystemDefinition | SystemId): boolean {
  if (areDevSystemsEnabled()) return true;
  const sys =
    typeof systemOrId === "string"
      ? SYSTEMS.find((s) => s.id === systemOrId)
      : systemOrId;
  return sys ? !sys.devOnly : false;
}

export function getAvailableSystems(): SystemDefinition[] {
  if (areDevSystemsEnabled()) {
    return SYSTEMS;
  }
  return SYSTEMS.filter((s) => !s.devOnly);
}

export function getSystemById(id: SystemId): SystemDefinition {
  const available = getAvailableSystems();
  return (
    available.find((s) => s.id === id) ??
    SYSTEMS.find((s) => s.id === id) ??
    available[0] ??
    SYSTEMS[0]
  );
}

export function getSystemByPath(pathname: string): SystemDefinition | null {
  return (
    SYSTEMS.find((s) => pathname.startsWith(s.href)) ?? null
  );
}

