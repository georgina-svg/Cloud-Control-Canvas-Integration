# Welcome Page Pattern

Reference: Magnetic Design System Foundations > Page Templates

## Overview

A welcome page is a **pre-authenticated landing page** — shown before the user signs in. It has no UI shell (no CDSHeader, CDSNav). Instead it centers content on a full-viewport background and presents a hero section, a feature grid, and a footer.

**Use when**: the product's entry point needs to introduce the tool and prompt sign-in.
**Don't use when**: the user is already authenticated — use one of the app-layout page templates instead.

---

## Anatomy

1. **Page background** — full-viewport dark/neutral surface (`data-cds-theme-experimental-component="page-glow"`)
2. **Hero section** — centered column: eyebrow label, product title, description, primary CTA button
3. **Feature grid** — responsive wrapping grid of icon + title + description cards
4. **Footer** — brand name + optional legal links

---

## Hero section

- Center all hero content horizontally and vertically
- Order: eyebrow label → title → body text → CTA button
- Eyebrow label: small uppercase text describing the product's value proposition
- Title: `CDSHeading size="primary"`
- Body: 1–3 sentences, max ~600px wide
- CTA: single `CDSButton variant="secondary"` (e.g. "Sign In")
- Vertical padding: ~80px top, ~64px bottom

---

## Feature grid

- Use `CDSFlex direction="horizontal" wrap gap={16}` so cards reflow at smaller viewports
- Each card: `flexBasis: '220px', flexGrow: 1` — fills available space, minimum ~220px wide
- Card interior: `CDSFlex direction="vertical" gap={12}` → icon → `CDSHeading size="sub-section"` → `CDSText`
- Icons: Phosphor icons at `size={28}`
- Aim for 4 columns at full width, wrapping to fewer columns at narrower viewports

---

## Best practices

- Keep description text concise — 1–2 sentences per feature card
- Use the page-glow background rather than a raw background color
- Don't add CDSHeader or CDSNav — the page is intentionally shell-free
- Limit the hero body copy to ~600px max-width to preserve line length readability
- Put the footer inside the page-glow wrapper so it stays on the dark background

---

## Code pattern

```tsx
import { BookOpenIcon, BrainIcon, KeyIcon, RocketIcon, ShieldIcon } from '@phosphor-icons/react';
import { CDSButton } from '@ciscodesignsystems/cds-react-button';
import { CDSContainer } from '@ciscodesignsystems/cds-react-container';
import { CDSFlex } from '@ciscodesignsystems/cds-react-flex';
import { CDSFooter } from '@ciscodesignsystems/cds-react-footer';
import { CDSHeading } from '@ciscodesignsystems/cds-react-heading';
import { CDSLink } from '@ciscodesignsystems/cds-react-link';
import { CDSText } from '@ciscodesignsystems/cds-react-text';

const FEATURES = [
  {
    icon: <ShieldIcon size={28} />,
    title: 'Single Sign-On',
    description: 'Centralized authentication with automatic user provisioning.',
  },
  {
    icon: <RocketIcon size={28} />,
    title: 'Self-Service Onboarding',
    description: 'Register tools in minutes with a guided activation flow.',
  },
  {
    icon: <KeyIcon size={28} />,
    title: 'Secrets & Config',
    description: 'Encrypted KV store for credentials — zero setup required.',
  },
  {
    icon: <BrainIcon size={28} />,
    title: 'Model Proxy',
    description: 'Cloud LLM access for every tool — no cloud credentials needed.',
  },
  {
    icon: <BookOpenIcon size={28} />,
    title: 'API Documentation',
    description: 'Searchable REST API docs with Postman export for every endpoint.',
  },
  // ...more features
];

<div data-cds-theme-experimental-component="page-glow">
  {/* Hero */}
  <CDSFlex
    direction="vertical"
    gap={24}
    align="center"
    style={{ padding: '80px 24px 64px', textAlign: 'center' }}>
    <CDSFlex direction="vertical" gap={12} align="center" style={{ maxWidth: '600px' }}>
      <CDSHeading size="primary">Product Name</CDSHeading>
      <CDSText style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '12px' }}>
        Your product tagline here
      </CDSText>
      <CDSText>
        A short description of the product's value — shared services your tools plug into
        instead of rebuilding from scratch.
      </CDSText>
    </CDSFlex>
    <CDSButton variant="secondary">Sign In</CDSButton>
  </CDSFlex>

  {/* Feature grid */}
  <CDSFlex
    direction="horizontal"
    gap={16}
    wrap
    style={{ padding: '0 24px 64px', maxWidth: '1280px', margin: '0 auto' }}>
    {FEATURES.map((feature) => (
      <CDSContainer
        key={feature.title}
        data-cds-theme-experimental-component="container"
        style={{ flexBasis: '220px', flexGrow: 1 }}>
        <CDSFlex direction="vertical" gap={12}>
          {feature.icon}
          <CDSHeading size="sub-section">{feature.title}</CDSHeading>
          <CDSText>{feature.description}</CDSText>
        </CDSFlex>
      </CDSContainer>
    ))}
  </CDSFlex>

  {/* Footer */}
  <CDSFooter
    brandName="Cisco Systems, Inc."
    rightSlot={
      <CDSFlex gap={16}>
        <CDSLink href="#0" target="_self" size="sm">Privacy policy</CDSLink>
        <CDSLink href="#0" target="_self" size="sm">Terms of service</CDSLink>
      </CDSFlex>
    }
  />
</div>
```

---

## Don't

- Don't wrap in CDSHeader + CDSNav — this is a pre-auth shell-free page
- Don't use `layout: 'centered'` in story parameters — use `layout: 'fullscreen'`
- Don't make hero body copy wider than ~600px
- Don't use `CDSButton variant="primary"` for the sign-in CTA — use `"secondary"` on the dark background
