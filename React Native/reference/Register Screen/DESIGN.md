---
name: InsightO Core
colors:
  surface: '#141218'
  surface-dim: '#141218'
  surface-bright: '#3b383e'
  surface-container-lowest: '#0f0d13'
  surface-container-low: '#1d1b20'
  surface-container: '#211f24'
  surface-container-high: '#2b292f'
  surface-container-highest: '#36343a'
  on-surface: '#e6e0e9'
  on-surface-variant: '#cbc4d2'
  inverse-surface: '#e6e0e9'
  inverse-on-surface: '#322f35'
  outline: '#948e9c'
  outline-variant: '#494551'
  surface-tint: '#cfbcff'
  primary: '#cfbcff'
  on-primary: '#381e72'
  primary-container: '#6750a4'
  on-primary-container: '#e0d2ff'
  inverse-primary: '#6750a4'
  secondary: '#cdc0e9'
  on-secondary: '#342b4b'
  secondary-container: '#4d4465'
  on-secondary-container: '#bfb2da'
  tertiary: '#e7c365'
  on-tertiary: '#3e2e00'
  tertiary-container: '#c9a74d'
  on-tertiary-container: '#503d00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbcff'
  on-primary-fixed: '#22005d'
  on-primary-fixed-variant: '#4f378a'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#cdc0e9'
  on-secondary-fixed: '#1f1635'
  on-secondary-fixed-variant: '#4b4263'
  tertiary-fixed: '#ffdf93'
  tertiary-fixed-dim: '#e7c365'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#141218'
  on-background: '#e6e0e9'
  surface-variant: '#36343a'
typography:
  display:
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1:
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h2:
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  h3:
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  xxl: 4rem
  gutter: 1.5rem
  margin: 2rem
---

## Brand & Style

This design system is engineered for a high-end enterprise AI environment where clarity meets cutting-edge intelligence. The visual narrative balances the reliability of traditional "Enterprise-grade" software with the ethereal, forward-thinking nature of Artificial Intelligence. 

The aesthetic leverages **Glassmorphism** and **Minimalism** to create a multi-layered workspace. Translucent surfaces and subtle glows suggest depth and data processing, while a strict adherence to grid structures ensures the platform remains grounded and secure. The user experience should feel like stepping into a high-tech command center—calm, focused, and powerful.

## Colors

The palette is optimized for long-form professional use in a dark environment. The foundation is a deep navy-to-black gradient that reduces eye fatigue and allows primary actions to stand out.

- **Primary Indigo:** Used for brand-critical actions and active states. 
- **Surface Strategy:** Surfaces use a slightly lighter slate than the background to create hierarchy through tonal shifting rather than heavy shadows.
- **Accent Glows:** Purple glows are used sparingly to highlight AI-driven insights or "intelligent" features, distinguishing them from standard CRUD operations.
- **Borders:** Thin, low-contrast slate borders define the structure without cluttering the visual field.

## Typography

The design system utilizes **Inter** exclusively to ensure maximum legibility across complex data density. 

- **Hierarchy:** Use bold weights for headers to contrast against the dark background. 
- **Readability:** Body text should primarily use the `text_secondary` color to soften the contrast against the deep navy background, while titles use `text_primary`.
- **Data Labels:** Small, all-caps labels with slight letter spacing are used for table headers and metadata to maintain an organized, "instrument-panel" feel.

## Layout & Spacing

This design system employs a **12-column fluid grid** system. Content is housed in "containers" that adapt to the viewport width while maintaining consistent gutters.

- **Desktop:** 2rem side margins and 1.5rem gutters. Sidebars are typically fixed at 280px.
- **Tablet:** Side margins reduce to 1.5rem. Complex data tables may transition to horizontal scrolling cards.
- **Mobile:** The grid collapses to 1 column with 1rem margins.
- **Pattern Overlay:** A subtle geometric grid pattern (1px stroke, 40px intervals, 5% opacity) should be applied to the base background layer to provide a sense of scale and precision.

## Elevation & Depth

Depth is created through a combination of **Glassmorphism** and **Ambient Glows** rather than traditional shadows.

- **Layer 0 (Background):** Solid `#020617` with a subtle geometric grid.
- **Layer 1 (Surfaces/Cards):** `#0f172a` with a 1px border of `#1e293b`.
- **Layer 2 (Modals/Popovers):** Semi-transparent `#0f172a` (80% opacity) with a `blur(12px)` backdrop filter.
- **AI-Features:** Elements containing AI insights receive an underlying ambient glow of `#9333ea` at 10% opacity to denote "intelligence" within the layer.

## Shapes

The shape language is "Soft-Modern," utilizing significant corner rounding to offset the coldness of the dark palette and technical subject matter.

- **Standard Elements:** Buttons, inputs, and small cards use `0.5rem`.
- **Large Containers:** Main content areas and dashboards use `1rem`.
- **Promotional/AI Sections:** Large hero cards or AI chat interfaces use `1.5rem` for a more approachable, fluid feel.

## Components

### Buttons
- **Primary:** Solid indigo (`#4f46e5`) with white text. Apply an external glow (`box-shadow`) of the primary color at 40% opacity on hover.
- **Secondary:** Transparent background with a 1px `#1e293b` border.
- **Ghost:** No border or background, text-only until hover.

### Input Fields
- **High-Contrast Styling:** Background is a darker `#020617` to recessed within the surface. Borders are `#1e293b`, turning `#4f46e5` on focus with a subtle indigo outer glow.
- **Labels:** Always positioned above the field in `label-md` style.

### Cards
- **Standard:** Solid surface color with a thin border. 
- **Glass Card:** Used for floating overlays. Includes backdrop blur and a slightly brighter top-left border to simulate a light source.

### Chips & Badges
- **Success:** Emerald green text on a 10% opacity emerald background. Fully rounded (pill).
- **AI-Tag:** Purple text with a subtle `blur` background and purple border.

### Progress Indicators
- Linear bars should use a gradient from `#4f46e5` to `#9333ea` to represent active AI processing or "intelligent" completion.