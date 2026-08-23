/**
 * Proposal domain types — drives the CRM "Proposals Generator" module.
 *
 * Mirrors the Figma "Proposals Generator - Home" frame (2222:7469).
 *
 * Reuses task department metadata for service badges so design stays
 * consistent between Tasks and Proposals.
 */

import {
  TASK_DEPARTMENT_META,
  type TaskDepartmentKey,
} from "@/lib/types/task";
// Type-only import — erased at compile time, so the proposal ↔ proposal-draft
// cycle never exists at runtime.
import type { ProposalDraft as ProposalDraftRef } from "@/lib/types/proposal-draft";

/* ─── Core enums ────────────────────────────────────────────────────── */

export type ProposalMarket = "saudi" | "egypt" | "global";

export type ProposalLanguage = "english" | "arabic" | "both";

export type ProposalFormat = "docx" | "pptx" | "pdf";

/** Status is derived from `expiresAt` + presence of `sentAt`. */
export type ProposalStatus = "drafted" | "active" | "expired";

/** Service categories — alias of task departments. */
export type ProposalService = TaskDepartmentKey;

export const PROPOSAL_SERVICE_META: Record<
  string,
  { label: string; tintBg: string; tintFg: string; solidBg: string; cssVar: string }
> = {
  ...TASK_DEPARTMENT_META,
  web_development: {
    label: "Web Development",
    tintBg: "bg-primary/10",
    tintFg: "text-primary",
    solidBg: "bg-primary",
    cssVar: "var(--primary)",
  },
  mobile_development: {
    label: "Mobile Development",
    tintBg: "bg-purple-10",
    tintFg: "text-purple",
    solidBg: "bg-purple",
    cssVar: "var(--color-purple)",
  },
  ui_ux_design: {
    label: "UI/UX Design",
    tintBg: "bg-success/10",
    tintFg: "text-success",
    solidBg: "bg-success",
    cssVar: "var(--success)",
  },
  branding: {
    label: "Branding",
    tintBg: "bg-warning/10",
    tintFg: "text-warning",
    solidBg: "bg-warning",
    cssVar: "var(--warning)",
  },
  digital_marketing: {
    label: "Digital Marketing",
    tintBg: "bg-destructive/10",
    tintFg: "text-destructive",
    solidBg: "bg-destructive",
    cssVar: "var(--destructive)",
  },
  seo_optimization: {
    label: "SEO Optimization",
    tintBg: "bg-info-10",
    tintFg: "text-info",
    solidBg: "bg-info",
    cssVar: "var(--color-info)",
  },
  custom_software: {
    label: "Custom Software",
    tintBg: "bg-primary/10",
    tintFg: "text-primary",
    solidBg: "bg-primary",
    cssVar: "var(--primary)",
  },
};

export function getProposalServiceMeta(service?: string) {
  if (service && PROPOSAL_SERVICE_META[service]) {
    return PROPOSAL_SERVICE_META[service];
  }
  return (
    PROPOSAL_SERVICE_META["programming"] || {
      label: "General Service",
      tintBg: "bg-primary/10",
      tintFg: "text-primary",
      solidBg: "bg-primary",
      cssVar: "var(--primary)",
    }
  );
}

/* ─── Records ───────────────────────────────────────────────────────── */

export interface ProposalClient {
  id: string;
  name: string;
  avatar?: string;
}

export interface ProposalRecord {
  id: string;
  /** Human-readable code, e.g. "PRP-2040". */
  code: string;
  /** File-style headline shown in the table. */
  headline: string;
  service: ProposalService;
  client: ProposalClient;
  market: ProposalMarket;
  language: ProposalLanguage;
  format: ProposalFormat;
  pages: number;
  /** ISO date (yyyy-mm-dd). */
  createdAt: string;
  /** ISO date (yyyy-mm-dd). */
  expiresAt: string;
  /** ISO date or null. Drives the `active` vs `drafted` distinction. */
  sentAt?: string | null;
}

/**
 * A persisted proposal — the table-facing {@link ProposalRecord} summary
 * plus the full editable {@link ProposalDraft} it was generated from.
 *
 * Storing the draft lets the viewer render the real cover/pages and lets
 * the wizard reopen the proposal for editing. Imported proposals have no
 * draft (they originate from an uploaded file), so `draft` is optional and
 * every consumer must tolerate its absence.
 */
export interface StoredProposal extends ProposalRecord {
  /** One-line subtitle shown on the cover preview. */
  subtitle?: string;
  /** Full editable draft, present for wizard-generated proposals. */
  draft?: ProposalDraftRef;
  /**
   * Which language this stored copy renders. A "both" draft produces two
   * stored proposals — one `"english"` (LTR) and one `"arabic"` (RTL).
   */
  variant?: "english" | "arabic";
}

/* ─── Market metadata ───────────────────────────────────────────────── */

export const PROPOSAL_MARKET_META: Record<
  string,
  {
    label: string;
    flag: string;
    /** Solid bg utility used on stat cards. */
    solidBg: string;
    /** Text against solid bg. */
    solidFg: string;
    /** Tinted bg utility used on badges / pills. */
    tintBg: string;
    /** Text against tinted bg. */
    tintFg: string;
    /** Solid dot utility. */
    dot: string;
  }
> = {
  saudi: {
    label: "Saudi Arabia",
    flag: "🇸🇦",
    solidBg: "bg-success",
    solidFg: "text-success-foreground",
    tintBg: "bg-success/10",
    tintFg: "text-success",
    dot: "bg-success",
  },
  egypt: {
    label: "Egypt",
    flag: "🇪🇬",
    solidBg: "bg-destructive",
    solidFg: "text-destructive-foreground",
    tintBg: "bg-destructive/10",
    tintFg: "text-destructive",
    dot: "bg-destructive",
  },
  global: {
    label: "Global",
    flag: "🌐",
    solidBg: "bg-primary",
    solidFg: "text-primary-foreground",
    tintBg: "bg-primary/10",
    tintFg: "text-primary",
    dot: "bg-primary",
  },
  gulf: {
    label: "Gulf Region",
    flag: "🇦🇪",
    solidBg: "bg-success",
    solidFg: "text-success-foreground",
    tintBg: "bg-success/10",
    tintFg: "text-success",
    dot: "bg-success",
  },
  international: {
    label: "International",
    flag: "🌐",
    solidBg: "bg-primary",
    solidFg: "text-primary-foreground",
    tintBg: "bg-primary/10",
    tintFg: "text-primary",
    dot: "bg-primary",
  },
};

export function getProposalMarketMeta(market?: string) {
  if (market && PROPOSAL_MARKET_META[market]) {
    return PROPOSAL_MARKET_META[market];
  }
  return PROPOSAL_MARKET_META["saudi"];
}

/* ─── Language metadata ─────────────────────────────────────────────── */

export const PROPOSAL_LANGUAGE_META: Record<
  string,
  { label: string; dot: string; fg: string }
> = {
  english: {
    label: "English",
    dot: "bg-success",
    fg: "text-success",
  },
  en: {
    label: "English",
    dot: "bg-success",
    fg: "text-success",
  },
  arabic: {
    label: "Arabic",
    dot: "bg-success",
    fg: "text-success",
  },
  ar: {
    label: "Arabic",
    dot: "bg-success",
    fg: "text-success",
  },
  both: {
    label: "Both",
    dot: "bg-primary",
    fg: "text-primary",
  },
};

export function getProposalLanguageMeta(lang?: string) {
  if (lang && PROPOSAL_LANGUAGE_META[lang]) {
    return PROPOSAL_LANGUAGE_META[lang];
  }
  return PROPOSAL_LANGUAGE_META["english"];
}

/* ─── Format metadata ───────────────────────────────────────────────── */

export const PROPOSAL_FORMAT_META: Record<
  string,
  { label: string; iconBg: string; iconFg: string }
> = {
  docx: {
    label: "A4",
    iconBg: "bg-primary/10",
    iconFg: "text-primary",
  },
  a4: {
    label: "A4",
    iconBg: "bg-primary/10",
    iconFg: "text-primary",
  },
  portrait: {
    label: "A4 Portrait",
    iconBg: "bg-primary/10",
    iconFg: "text-primary",
  },
  pptx: {
    label: "Powerpoint",
    iconBg: "bg-warning/10",
    iconFg: "text-warning",
  },
  powerpoint: {
    label: "Powerpoint",
    iconBg: "bg-warning/10",
    iconFg: "text-warning",
  },
  presentation: {
    label: "Powerpoint",
    iconBg: "bg-warning/10",
    iconFg: "text-warning",
  },
  landscape: {
    label: "Powerpoint",
    iconBg: "bg-warning/10",
    iconFg: "text-warning",
  },
  pdf: {
    label: "PDF",
    iconBg: "bg-destructive/10",
    iconFg: "text-destructive",
  },
};

export function getProposalFormatMeta(format?: string) {
  if (format && PROPOSAL_FORMAT_META[format]) {
    return PROPOSAL_FORMAT_META[format];
  }
  return PROPOSAL_FORMAT_META["pptx"];
}

/* ─── Helpers ───────────────────────────────────────────────────────── */

export function getProposalStatus(
  record: ProposalRecord,
  now: Date = new Date(),
): ProposalStatus {
  if (!record.sentAt) return "drafted";
  const expires = new Date(record.expiresAt);
  if (Number.isNaN(expires.getTime())) return "active";
  return expires.getTime() < now.getTime() ? "expired" : "active";
}

export const PROPOSAL_STATUS_META: Record<
  string,
  { label: string; tintBg: string; tintFg: string; dot: string }
> = {
  drafted: {
    label: "Drafted",
    tintBg: "bg-muted",
    tintFg: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  draft: {
    label: "Draft",
    tintBg: "bg-muted",
    tintFg: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  active: {
    label: "Active",
    tintBg: "bg-primary/10",
    tintFg: "text-primary",
    dot: "bg-primary",
  },
  sent: {
    label: "Sent",
    tintBg: "bg-primary/10",
    tintFg: "text-primary",
    dot: "bg-primary",
  },
  in_review: {
    label: "In Review",
    tintBg: "bg-warning/10",
    tintFg: "text-warning",
    dot: "bg-warning",
  },
  accepted: {
    label: "Accepted",
    tintBg: "bg-success/10",
    tintFg: "text-success",
    dot: "bg-success",
  },
  expired: {
    label: "Expired",
    tintBg: "bg-destructive/10",
    tintFg: "text-destructive",
    dot: "bg-destructive",
  },
  rejected: {
    label: "Rejected",
    tintBg: "bg-destructive/10",
    tintFg: "text-destructive",
    dot: "bg-destructive",
  },
};

export function getProposalStatusMeta(status?: string) {
  if (status && PROPOSAL_STATUS_META[status]) {
    return PROPOSAL_STATUS_META[status];
  }
  return PROPOSAL_STATUS_META["drafted"];
}
