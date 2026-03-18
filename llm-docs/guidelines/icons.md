# Icons

Reference: Magnetic Design System Foundations > Icons

## Approach

Magnetic uses **Phosphor icons** with `weight="bold"` as its icon library. The style prioritizes function over form — clean, rounded stroke caps and corners for a friendly, approachable feel.

- Use icons in moderation — too many icons in one screen become visual noise
- Each icon should stand alone to convey meaning
- Limit to 2–3 functional icon styles in a single workflow
- Icons require at least **3:1 contrast ratio** for accessibility
- Status icons must use at least two identifiers (color + shape) to be distinguishable

## Import

```tsx
import { GearSixIcon } from '@phosphor-icons/react';
```

All general-purpose icons come from `@phosphor-icons/react`. Always use `weight="bold"`.

**CDS-specific icons** (CiscoLogo, CDSStatusIcon) come from `@ciscodesignsystems/cds-react-icons`:

```tsx
import { CDSStatusIcon, CiscoLogo } from '@ciscodesignsystems/cds-react-icons';
```

**Never** import from `@ciscodesignsystems/cds-react-cisco-logo` or `@ciscodesignsystems/cds-react-logos` — these packages do NOT exist.

## Approved Icon List

Only use icons from this verified list. Append `Icon` to each name for the React import (e.g. `ArrowDown` → `ArrowDownIcon`).

**Navigation & actions**
ArrowDown, ArrowUp, ArrowLeft, ArrowRight, ArrowSquareOut, ArrowsClockwise, CaretDoubleLeft, CaretDoubleRight, CaretDown, CaretLeft, CaretRight, CaretUp, DotsThree, DotsThreeVertical, DotsSix, FunnelSimple, MagnifyingGlass, Minus, Plus, Sort, SortDown, SortUp, X

**Status & feedback**
Check, CheckCircle, Info, Lightning, Prohibit, Warning, XCircle

**UI & layout**
Bell, BookOpen, CalendarBlank, Clock, Copy, DownloadSimple, Eye, EyeSlash, File, FileDotted, FileCss, Folder, FolderOpen, GearSix, Link, List, ListBullets, ListChecks, Lock, LockOpen, MagicWand, Paperclip, PencilSimple, Printer, Question, Refresh, SignOut, Stack, Trash, TrashSimple, UploadSimple

**People & identity**
IdentificationCard, Key, User, Users

**Devices & infrastructure**
Cloud, Cpu, Database, Desktop, Globe, HardDrive, Monitor, Network, WifiHigh, WifiLow, WifiMedium, WifiNone, WifiSlash, WifiLightning, WifiX

**Data & content**
Brain, ChartBar, ChartLine, Code, Cube, Package, Tag, Terminal

**Branding & illustration**
Building, Buildings, Leaf, Magnet, MapTrifold, PaintBrush, RocketLaunch, ShieldCheck, Shield

**Trends**
TrendDown, TrendUp

## Navigation Icons

CDSNav uses its own built-in icon set via the `icon` string prop — NOT Phosphor icons. See the nav.md considerations for valid icon names.

## Status Icons

Use `CDSStatusIcon` from `@ciscodesignsystems/cds-react-icons` for status indicators:

```tsx
<CDSStatusIcon size={18} status="positive" />
<CDSStatusIcon size={18} status="warning" />
<CDSStatusIcon size={18} status="negative" />
<CDSStatusIcon size={18} status="neutral" />
```

Status icons pair color and shape for accessibility. Use them in tables and health cards — never use colored dots or custom badges for status.

## Common sizing

- Toolbar/action icons: `size={20}` or `size={24}`
- Header utility icons: `size={24}` with `weight="bold"`
- Card category icons: `size={32}`

## Don't

- **Never guess icon names** — only use names from the approved list above. If none fits, pick the closest match or omit the icon entirely
- Don't use `ServerIcon` — it does not exist in `@phosphor-icons/react`; use `HardDriveIcon`, `DatabaseIcon`, or `MonitorIcon` instead
- Don't use more than 2–3 icon styles in one view
- Don't use icons without sufficient contrast (3:1 minimum)
- Don't use Phosphor icons for CDSNav — use the built-in `icon` string prop
- Don't import CiscoLogo from any package other than `@ciscodesignsystems/cds-react-icons`
