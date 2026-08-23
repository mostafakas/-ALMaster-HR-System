# Design System — AlMaster HR Dashboard
> **Status:** 🔒 LOCKED — Do NOT change any value without explicit user approval.
> **Version:** 2.0 | **Source of truth:** `app/globals.css` + `components/ui/typography.tsx`

---

## 1. Color Tokens

All colors are defined as CSS custom properties in `app/globals.css` inside `:root {}`.
**Use the token name in code — never paste a raw hex value.**

### Semantic Tokens (shadcn-compatible)

| Token (CSS var) | Tailwind Class | Hex Value | Usage |
|----------------|---------------|-----------|-------|
| `--background` | `bg-background` | `#FFFFFF` | Page/app background |
| `--foreground` | `text-foreground` | `#343434` | All primary text |
| `--card` | `bg-card` | `#FFFFFF` | Card backgrounds |
| `--card-foreground` | `text-card-foreground` | `#343434` | Card text |
| `--primary` | `bg-primary` / `text-primary` | `#0047FF` | Buttons, active nav, links |
| `--primary-foreground` | `text-primary-foreground` | `#FFFFFF` | Text on primary bg |
| `--secondary` | `bg-secondary` | `#EDF2F7` | Input fields, card fills |
| `--secondary-foreground` | `text-secondary-foreground` | `#343434` | Text on secondary bg |
| `--muted` | `bg-muted` | `#F8FAFC` | Panel bg, hover tints |
| `--muted-foreground` | `text-muted-foreground` | `#707070` | Secondary / placeholder text |
| `--accent` | `bg-accent` | `#F8FAFC` | Accent tints |
| `--accent-foreground` | `text-accent-foreground` | `#0047FF` | Text on accent |
| `--border` | `border-border` | `#EDF2F7` | All borders & dividers |
| `--input` | — | `#EDF2F7` | Input border color |
| `--ring` | — | `#0047FF` | Focus rings |
| `--success` | `bg-success` / `text-success` | `#00B927` | Online, Working, Available |
| `--success-foreground` | `text-success-foreground` | `#FFFFFF` | Text on success bg |
| `--warning` | `bg-warning` / `text-warning` | `#F38328` | Meeting, In-Progress |
| `--warning-foreground` | `text-warning-foreground` | `#FFFFFF` | Text on warning bg |
| `--destructive` | `bg-destructive` / `text-destructive` | `#F55050` | Error, High Priority |
| `--destructive-foreground` | `text-destructive-foreground` | `#FFFFFF` | Text on destructive bg |

### Alpha Variants (tint backgrounds)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary-10` | `#0047FF1A` | Primary tint badge bg |
| `--color-primary-5` | `#0047FF0D` | Subtle primary tint |
| `--color-success-10` | `#00B9271A` | Success tint badge bg |
| `--color-success-5` | `#00B9270D` | Subtle success tint |
| `--color-warning-10` | `#F383281A` | Warning tint badge bg |
| `--color-warning-5` | `#F383280D` | Subtle warning tint |
| `--color-destructive-10` | `#F550501A` | Destructive tint badge bg |
| `--color-destructive-5` | `#F550500D` | Subtle destructive tint |
| `--color-purple-10` | `#9359FF1A` | AI/Purple tint badge bg |
| `--color-purple-5` | `#9359FF0D` | Subtle purple tint |
| `--color-info-10` | `#08A1BC1A` | Info tint badge bg |

### Extended Palette (non-semantic, Figma-direct only)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-purple` | `#9359FF` | AI department accent |
| `--color-info` | `#08A1BC` | Info state |
| `--color-pink` | `#FF4B91` | Break status |
| `--color-pink-10` | `#FF4B911A` | Break tint badge |
| `--color-indigo` | `#8A2BE2` | Indigo accent |
| `--color-ai` | `#AA00FF` | AI feature accent |
| `--color-saudi` | `#006C35` | Saudi market flag |
| `--color-egypt` | `#FF2B2B` | Egypt market flag |
| `--color-border-light` | `#F7F7F7` | Light divider lines |
| `--color-text-disabled` | `#B0B0B0` | Disabled text |
| `--color-drafted` | `#707070` | Draft state |

---

## 2. Typography

**Always use the `<Typography>` component** from `components/ui/typography.tsx`. Never write inline `text-[12px]` unless implementing a raw Figma spec.

```tsx
import { Typography } from "@/components/ui/typography";
<Typography variant="h2">Section Title</Typography>
<Typography variant="small" tabular>03:20:28</Typography>
```

### Variant Reference

| Variant | Font Size | Line Height | Weight | Usage |
|---------|-----------|-------------|--------|-------|
| `display` | 20px (`text-2xl`) | 20px | Bold | Dashboard main header |
| `h1` | 18px (`text-xl`) | 24px | Bold | Profile names, heavy sub-headers |
| `h2` | 18px (`text-xl`) | 20px | Bold | Section headers (Tasks, Activity Logs) |
| `body` | 14px (`text-md`) | 20px | Bold | Standard body / label text |
| `bodyMuted` | 14px (`text-md`) | 20px | Bold | Secondary body text |
| `small` | 12px (`text-sm`) | 20px | Bold | Metadata, dates, descriptions |
| `label` | 12px (`text-sm`) | 14px | Bold | Status badges (compact) |
| `xs` | 10px (`text-xs`) | 20px | Bold | Smallest interface labels |
| `tiny` | 9px (`text-tiny`) | 14px | Bold | Grid micro-labels |

Props:
- `tabular` — adds `tabular-nums` for timer/numeric values
- `as` — override rendered HTML tag (`as="h3"`, `as="span"`, etc.)

### Font Families
- **Regular:** `Janna LT` (variable: `--font-janna-regular`)
- **Bold:** `Janna LT Bold` (variable: `--font-janna-bold`)
- **Mono:** Geist Mono (variable: `--font-geist-mono`)

---

## 3. Spacing Scale

All spacing uses Tailwind defaults. The project uses these consistently:

| Tailwind | px | Usage |
|----------|----|-------|
| `gap-1` / `p-1` | 4px | Micro spacing inside badges |
| `gap-2` / `p-2` | 8px | Icon gaps, tight internal spacing |
| `gap-3` / `p-3` | 12px | Card internal padding, element gaps |
| `gap-4` / `p-4` | 16px | Panel padding, standard section gaps |
| `gap-5` / `p-5` | 20px | Large spacing |
| `gap-6` / `p-6` | 24px | Major section separation |
| `p-8` | 32px | Panel top/bottom padding |

---

## 4. Border Radius

Base radius token: `--radius: 0.75rem` (12px). All `rounded-*` classes scale from this.

| Tailwind Class | Approx px | Usage |
|---------------|-----------|-------|
| `rounded` | ~4px | Tiny pill shapes |
| `rounded-md` | ~10px | Badges, small chips |
| `rounded-lg` | 12px | Buttons, inputs, small cards |
| `rounded-xl` | ~17px | Dropdowns, medium cards |
| `rounded-2xl` | ~22px | Large cards, sections |
| `rounded-3xl` | ~26px | Modal panels |
| `rounded-full` | 9999px | Avatar circles, status dots |

---

## 5. Shadow & Effect System

| Class / Value | Usage |
|--------------|-------|
| `shadow-sm` | Subtle card elevation |
| `shadow-md` | Active panel |
| `shadow-lg shadow-primary/20` | Active button glow |
| `transition-all duration-300` | Standard state transitions |
| `hover:bg-muted` | Button / row hover |
| `ring-2 ring-white/10` | Avatar rings |
| `backdrop-blur-sm` | Modal backdrop |

---

## 6. Component-Level Token Usage

### Employee Card (`employee-card.tsx`)

| Element | Token / Value |
|---------|--------------|
| Card background | `bg-card` |
| Working metric bg | `bg-[#00b927]/10` |
| Working metric text | `text-[#00b927]` |
| Meeting metric bg | `bg-[#f38328]/10` |
| Meeting metric text | `text-[#f38328]` |
| Break metric bg | `bg-[#707070]/10` |
| Break metric text | `text-[#707070]` |
| IDLE metric bg | `bg-[#f55050]/10` |
| IDLE metric text | `text-[#f55050]` |
| Timer font | `tabular-nums` bold 12px |
| Action icons (active) | `bg-primary/10 text-primary` |
| Action icons (inactive) | `bg-muted text-muted-foreground` |

### Status Badges

| Status | bg class | text class |
|--------|---------|-----------|
| Online | `bg-success/10` | `text-success` |
| Meeting | `bg-warning/10` | `text-warning` |
| Break | `bg-[#FF4B91]/10` | `text-[#FF4B91]` |
| IDLE | `bg-destructive/10` | `text-destructive` |
| Offline | `bg-muted` | `text-muted-foreground` |

### Sidebar Navigation (`sidebar-nav.tsx`)

| State | bg | text |
|-------|----|------|
| Inactive | `bg-muted` | `text-foreground` |
| Active | `bg-primary` | `text-primary-foreground` |
| Tracking active | `bg-success` | `text-success-foreground` |
| Logout | — | `text-destructive` |

### Department Accent Colors (employee-grid.tsx)

| Department | Accent hex |
|-----------|-----------|
| Graphic Design | `#00B927` |
| Sales | `#F55050` |
| AI / Tech | `#AA00FF` |

---

## 7. Icon Sizing Standard

| Size | Tailwind | Usage |
|------|----------|-------|
| 14px | `size-3.5` | Inline text icons |
| 16px | `size-4` | Badge icons |
| 20px | `size-5` | Action bar icons |
| 24px | `size-6` | Sidebar nav icons |
| 36px | `size-9` | Department icon tiles |

---

## 8. Layer Architecture

```
globals.css
└── :root { semantic CSS vars }        ← Single source of truth for all hex values
└── @theme inline { Tailwind mapping } ← Maps CSS vars → Tailwind classes

components/ui/typography.tsx
└── <Typography variant="...">        ← Single source of truth for all text styles

AGENTS.md (this file's enforcement)
└── ⛔ Never hardcode hex or px values ← Rule that governs all future changes
```

---

## 9. Change Protocol

> If you need to change a UI value (color, spacing, font size):
> 1. Propose the change in a plan **first** — do NOT apply it
> 2. Wait for explicit user approval
> 3. Update `globals.css` / `typography.tsx` **first**, then update components
> 4. Commit immediately with a descriptive message

---

*Design System Version: 2.0 | Last Updated: 2026-08-02 | Source: globals.css + typography.tsx*
