# AlMaster System — Agent Rules

## ⛔ CRITICAL: UI FREEZE — NEVER CHANGE VISUAL VALUES

This project has a locked design system. You MUST NOT modify any of these without explicit written approval from the user:

- Any pixel or spacing value (`px`, `rem`, `em`, `%`, `gap`, `padding`, `margin`, `width`, `height`)
- Any color value (hex literal, CSS variable reference, or Tailwind color class)
- Any typography value (`font-size`, `font-weight`, `line-height`, `letter-spacing`)
- Any border property (`border-radius`, `border-width`, `border-color`)
- Any visual effect (`shadow`, `opacity`, `blur`, `backdrop-filter`, `transition`)
- Any Tailwind class that controls appearance

**Allowed exceptions:**
1. The user explicitly instructs "change X to Y" for a specific value
2. You are fixing a compile/type error that has no visual effect
3. You are implementing a brand-new Figma node the user just provided

When implementing Figma designs: use exact pixel values from Figma — never round or "improve" them.

---

## Design System Tokens (Read-Only Reference)

All semantic tokens are defined in `app/globals.css` (:root block). Use token names in code, never hardcode hex values.

### Color Tokens (CSS Variables)
| Token | Value | Usage |
|-------|-------|-------|
| `--primary` / `primary` | `#0047FF` | Buttons, active states, links |
| `--background` | `#FFFFFF` | Page background |
| `--foreground` | `#343434` | Primary text |
| `--secondary` | `#EDF2F7` | Input fields, card backgrounds |
| `--muted` | `#F8FAFC` | Panel backgrounds, hover tints |
| `--muted-foreground` | `#707070` | Secondary/placeholder text |
| `--success` | `#00B927` | Online status, working state |
| `--warning` | `#F38328` | Meeting state, orange accents |
| `--destructive` | `#F55050` | Error, high priority, IDLE |
| `--border` | `#EDF2F7` | All borders and dividers |

### Extended Palette (NOT semantic — use only where Figma specifies)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-purple` | `#9359FF` | AI/Purple accents |
| `--color-info` | `#08A1BC` | Info states |
| `--color-pink` | `#FF4B91` | Break state |

### Role Border Colors (HR Dashboard)
| Role | Color | Token |
|------|-------|-------|
| Head of Department | `#2563EB` | `blue-600` |
| Team Leader | `#F97316` | `orange-500` |
| Freelancer | `#00B927` | `--success` |
| Default | `#2563EB` | `blue-600` |

### Typography Scale (from `components/ui/typography.tsx`)
| Variant | Size | Line Height | Usage |
|---------|------|-------------|-------|
| `display` | 20px (`text-2xl`) | 20px | Dashboard main headers |
| `h1` | 18px (`text-xl`) | 24px | Profile names, heavy headers |
| `h2` | 18px (`text-xl`) | 20px | Section headers (Tasks, Logs) |
| `body` | 14px (`text-md`) | 20px | Standard body text |
| `bodyMuted` | 14px (`text-md`) | 20px | Secondary body text |
| `small` | 12px (`text-sm`) | 20px | Metadata, dates |
| `label` | 12px (`text-sm`) | 14px | Status badges |
| `xs` | 10px (`text-xs`) | 20px | Smallest labels |
| `tiny` | 9px (`text-tiny`) | 14px | Grid micro-labels |

Always use `<Typography variant="...">` — never write raw `text-[12px]` inline unless implementing a Figma spec directly.

### Spacing Scale
| Value | Usage |
|-------|-------|
| `gap-2` / 8px | Icon gaps, tight spacing |
| `gap-3` / 12px | Card padding, element spacing |
| `gap-4` / 16px | Panel padding, section gaps |
| `gap-5` / 20px | Large gaps |
| `gap-6` / 24px | Major section spacing |
| `p-8` / 32px | Panel top/bottom padding |

### Border Radius Scale (base radius = 0.75rem = 12px)
| Class | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | ~7px | Mini elements |
| `rounded-md` | ~10px | Badges |
| `rounded-lg` | 12px | Buttons, inputs, small cards |
| `rounded-xl` | ~17px | Dropdowns |
| `rounded-2xl` | ~22px | Large cards, modals |
| `rounded-3xl` | ~26px | Major panels |

### Status/Metric Colors (employee-card.tsx)
| Status | Background | Text |
|--------|-----------|------|
| Working | `bg-[#00b927]/10` | `text-[#00b927]` |
| Meeting | `bg-[#f38328]/10` | `text-[#f38328]` |
| Break | `bg-[#707070]/10` | `text-[#707070]` |
| IDLE | `bg-[#f55050]/10` | `text-[#f55050]` |

---

## Component Rules

- Use **shadcn** components and **react-hook-form** for all forms
- Use the `<Typography>` component for all text — not raw `<p>` or `<span>` with inline size classes
- All `Select` fields controlled via react-hook-form must have a non-`undefined` `defaultValue` (use `""` as fallback)
- Read `node_modules/next/dist/docs/` before writing Next.js-specific APIs
- Heed deprecation notices for Next.js 15+
