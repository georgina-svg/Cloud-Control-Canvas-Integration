# AI Assistant — React Prototype

Functional React prototype of the **AI Assistant** frame from the [Vibe coding experiment (C3 — Canvas)](https://www.figma.com/design/i8Mnz9xfjJyPfZYBzm0Ajq/Vibe-coding-experiment--C3---Canvas?node-id=185-33102) Figma file, built with **Magnetic Dev** design tokens and patterns for styling and accessibility.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview   # serve dist/
```

## What’s included

- **Layout**: Full-screen dark theme with background glow, header, left sidebar, mode switcher (Chat / Canvas / Actions), hero block, chat input with suggestion chips, and footer.
- **Design tokens**: Magnetic-inspired CSS variables in `src/index.css` for colors (`--base-bg-default`, `--brand-text-default`, `--interact-bg-default`, etc.), spacing (`--spacing-100`–`--spacing-900`), and typography.
- **Components**: `Header`, `Sidebar`, `ModeSwitcher`, `HeroSection`, `ChatInput` (with chips), `Footer`, `Button`, and shared icons (no external image URLs).
- **Accessibility**: Semantic HTML, `aria-label` / `aria-current` / `role` where needed, `:focus-visible` styles, and keyboard-friendly controls.

## Stack

- **React 18** + **TypeScript**
- **Vite** for build and dev server
- Plain **CSS** (no Tailwind); tokens and layout classes in `src/index.css`

Design-to-code used **Figma MCP** for the frame and **Magnetic Dev MCP** for token and component guidance.
