---
name: "LHU Tech Hub"
description: "LHU Blueprint Studio — a dark institutional technology studio where blue structures information and orange drives action."
colors:
  signal-blue: "#2385c1"
  action-orange: "#f37021"
  action-orange-hover: "#ff7b2a"
  blueprint-navy: "#07111d"
  deep-ink: "#050b12"
  navy-surface: "#091725"
  navy-panel: "#0d1b29"
  canvas-light: "#edf4f8"
  body-ink: "#08131f"
  card-light: "#ffffff"
  paper-white: "#f4f8fb"
  muted-on-light: "#526678"
  muted-on-dark: "#9eb1c1"
  copy-on-dark: "#aec0cd"
typography:
  display:
    fontFamily: "Lexend, Be Vietnam Pro, sans-serif"
    fontSize: "clamp(2.3rem, 6.2vw, 4.5rem)"
    fontWeight: 650
    lineHeight: 1.14
    letterSpacing: "-0.012em"
  headline:
    fontFamily: "Lexend, Be Vietnam Pro, sans-serif"
    fontSize: "clamp(2.1rem, 3.8vw, 3.5rem)"
    fontWeight: 650
    lineHeight: 1.16
    letterSpacing: "-0.012em"
  title:
    fontFamily: "Lexend, Be Vietnam Pro, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Be Vietnam Pro, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(0.98rem, 1.1vw, 1.08rem)"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "0.002em"
  label:
    fontFamily: "Be Vietnam Pro, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0.12em"
  micro-label:
    fontFamily: "Be Vietnam Pro, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.65rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0.14em"
rounded:
  compact: "12px"
  control: "14px"
  surface: "16px"
  pill: "999px"
spacing:
  two-xs: "0.5rem"
  xs: "0.75rem"
  sm: "1rem"
  md: "1.25rem"
  lg: "1.5rem"
  xl: "2rem"
  two-xl: "3.5rem"
  shell-gutter: "1rem"
  shell-gutter-compact: "0.625rem"
  section: "clamp(5.5rem, 9vw, 9rem)"
components:
  button-primary:
    backgroundColor: "{colors.action-orange}"
    textColor: "{colors.blueprint-navy}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.8rem 1.25rem"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.action-orange-hover}"
    textColor: "{colors.blueprint-navy}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.8rem 1.25rem"
    height: "52px"
  button-secondary:
    backgroundColor: "rgba(255, 255, 255, 0.07)"
    textColor: "{colors.paper-white}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.8rem 1.25rem"
    height: "52px"
  filter-chip:
    backgroundColor: "transparent"
    textColor: "{colors.copy-on-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem"
    height: "44px"
  filter-chip-active:
    backgroundColor: "#a9d6ef"
    textColor: "{colors.blueprint-navy}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem"
    height: "44px"
  project-card-dark:
    backgroundColor: "{colors.navy-panel}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.surface}"
    padding: "2.5rem"
  contact-field:
    backgroundColor: "transparent"
    textColor: "{colors.paper-white}"
    typography: "{typography.body}"
    rounded: "0px"
    padding: "1rem 0"
  navigation-dark:
    backgroundColor: "rgba(7, 17, 29, 0.92)"
    textColor: "{colors.paper-white}"
    typography: "{typography.label}"
    rounded: "0px"
    padding: "0.75rem 1rem"
  accordion-row:
    backgroundColor: "{colors.navy-panel}"
    textColor: "{colors.paper-white}"
    typography: "{typography.title}"
    rounded: "{rounded.surface}"
    padding: "1.5rem 2rem"
---

# Design System: LHU Tech Hub

## Overview

**Creative North Star: "LHU Blueprint Studio"**

LHU Tech Hub feels like an institutional technology studio after dark: exact enough to signal academic credibility, vivid enough to make student work feel alive. Blueprint grids, measured rules, deep navy planes, technical labels, and large editorial type organize the experience without turning it into a generic software dashboard.

Each section owns a distinct motion signature—cinematic reveal, counting signal, image wipe, sticky project stack, step transition, spotlight accordion, or drifting footer field—but every signature uses the same restrained geometry, blue/orange signal logic, and confident easing. The result should feel authored section by section while remaining unmistakably one LHU system.

The reference lineage is deliberately section-specific: CodeNest Hero, Arceage Stats, Axion About, Projects Catalog, Apex Accordion, Multi-step Quiz, Arceage Contact, and Stark Footer. Treat them as directional precedents for their assigned patterns, not as templates to reproduce or blend wholesale.

**Key Characteristics:**

- Dark institutional surfaces anchored by navy, never featureless black.
- LHU blue communicates structure, information, and technological signal.
- LHU orange marks action, emphasis, progress, and decisive moments.
- Clear, open Lexend display type is paired with highly readable Be Vietnam Pro body copy.
- Blueprint grids, hairline rules, indices, and circular instruments provide the recurring technical grammar.
- Motion varies by section, remains purposeful, and collapses cleanly under reduced-motion preferences.

## Colors

The palette combines cool institutional blues with a single warm action signal, using pale blue-gray canvases only where a light surface improves reading density.

### Primary

- **LHU Signal Blue** (`signal-blue`): identifies icons, technical markers, informational states, active structure, and cool atmospheric light.

### Secondary

- **LHU Action Orange** (`action-orange`): reserved for primary calls to action, progress, selected emphasis, directional icons, and the warm half of the signal line.
- **Action Orange Lift** (`action-orange-hover`): the brighter hover state for primary controls; it is a state, not an additional accent.

### Neutral

- **Blueprint Navy** (`blueprint-navy`): the default dark canvas for the hero, contact area, navigation, modal, and institutional anchors.
- **Deep Ink** (`deep-ink`): the deepest footer and media-well surface.
- **Navy Surface** (`navy-surface`): separates dark content sections from the main canvas.
- **Navy Panel** (`navy-panel`): supports cards and translucent navigation controls.
- **Blueprint Paper** (`canvas-light`): the light-mode page canvas.
- **Body Ink** (`body-ink`): primary text on light surfaces.
- **Card White** (`card-light`): light-mode cards and structured content containers.
- **Paper White** (`paper-white`): primary text on dark surfaces.
- **Muted Slate** (`muted-on-light`): secondary copy on light surfaces.
- **Muted Mist** (`muted-on-dark`): secondary copy and inactive labels on dark surfaces.
- **Drafting Copy** (`copy-on-dark`): long-form explanatory copy on dark content sections.

Borders are one-pixel translucent hairlines: dark surfaces use cool white at roughly 8–16% opacity, while light surfaces use body ink at 12% opacity.

**The Signal and Action Rule.** Blue explains where the user is; orange tells the user what to do next. Do not give both accents equal visual weight inside one component.

**The Dark Anchor Rule.** In Dark mode, major narrative anchors stay on Blueprint Navy, Navy Surface, or Deep Ink so media, metrics, and orange actions retain contrast and authority. The Hero retains its existing treatment in both modes; content below it follows the selected theme.

### Light content mode

The public sections below the Hero, shared academic content, the academic closing CTA, and product dialogs use a complete light palette. Scope these roles with `.public-content`, including the portalled dialog, rather than changing brand primitives, the Hero, navigation, or admin styles. Dark-mode component values remain the baseline described below.

- Use Blueprint Paper for the page, white for cards and contact, `#f7fbfd` for quiet reading sections, and `#e1ebf1` for gallery/media wells and the footer.
- Use Body Ink and Muted Slate for text. Public blue `#17638f` and public orange `#aa430d` support readable small labels and icons on light surfaces; keep the original bright orange primary button and legacy logo colors.
- Use `#718698` for input and choice boundaries, public blue for keyboard focus, and restrained blue-gray shadows for elevated cards. Contact feedback uses `#b13c26` for errors and `#1d7048` for success, with text/icon cues.
- Preserve typography, spacing, mission justification, CMS content, image colors, filtering, quiz state and contact submission behavior. Dark overlays are localized to photo captions and dialog backdrops, not whole light sections. Third-party embeds control their own internal theme.
- Preserve the section-specific motions. Counters and the faculty image wipe respect reduced-motion preferences alongside the existing MotionConfig and CSS fallbacks.

Run `node scripts/check-public-theme.mjs` for palette, generated utility and scope checks. These are static checks; desktop/mobile screenshots and interaction testing require a connected browser.

## Typography

**Display Font:** Lexend (with Be Vietnam Pro and sans-serif fallbacks)  
**Body Font:** Be Vietnam Pro (with system sans-serif fallbacks)

**Character:** Lexend gives headings an open, contemporary technology-and-education voice with stable Vietnamese diacritics at large sizes. Be Vietnam Pro keeps long copy calm and readable across CMS-driven paragraphs, labels, forms, and controls.

### Hierarchy

- **Display** (650, fluid 2.3rem–4.5rem scale, 1.14 line-height): hero statements only; keep the measure near 17 characters so Vietnamese syllables and diacritics remain intact.
- **Headline** (650, fluid 2.1rem–3.5rem scale, 1.16 line-height): primary section titles; balance wrapping and keep the measure near 22 characters.
- **Title** (700, 1.5rem baseline, 1.25 line-height): card titles, accordion labels, and local content anchors.
- **Body** (400, fluid 0.98rem–1.08rem, 1.82 line-height): explanatory copy with a maximum measure of roughly 62–68 characters.
- **Label** (700, 0.75rem, 0.12em tracking): metadata, progress, categories, and utility labels; uppercase is used for short technical markers only.
- **Micro label** (700, 0.65rem, 0.14em tracking): orbit markers, compact product tags, and other nonessential technical annotations only.

**The Two-Voice Rule.** Lexend carries hierarchy and identity; Be Vietnam Pro carries reading and interaction. Do not introduce a third display or body family, and never compress Vietnamese display lines below the established line-height.

**The Alignment Rule.** Long-form prose and the full mission quotation use inter-word justification from `640px` upward to create a calm editorial edge. Headings, labels, controls, and short descriptions remain left-aligned; compact mobile prose also stays left-aligned to avoid stretched word spaces. The final line of justified content remains naturally left-aligned.

## Layout

All primary content aligns to a centered shell capped at `80rem`. The desktop shell leaves `1rem` at each viewport edge; below `768px`, it leaves `0.625rem`. Standard sections use fluid vertical padding from `5.5rem` to `9rem`, falling back to `5rem` on compact screens.

The system begins with one-column reading flow, then introduces two-column compositions at `768px` and broader asymmetric grids at `1024px`. Hero, introduction, quiz, contact, and mission sections deliberately use unequal columns to create editorial tension. The mission section uses a compact `0.4fr` label rail and a dominant `1.6fr` reading column so the long statement owns the composition without leaving a dead central gutter. Dense collections use hairline-divided grids, while feature work may use a sticky stack; neither should be replaced by a generic equal-card wall.

Section intros pair a bounded display headline with a 62–68-character explanation aligned to the opposite edge on medium screens. Responsive changes preserve reading order: imagery and secondary panels stack below the primary message, navigation becomes a clipped vertical sheet, and horizontal chips remain scrollable rather than shrinking below touch size.

## Elevation & Depth

Depth is tonal first and shadow second. Navy steps, translucent hairlines, media wells, blueprint grids, vignettes, and restrained blur establish the primary hierarchy; shadows appear on floating controls, sticky project cards, the scrolled navigation, and the modal where physical separation is meaningful.

### Shadow Vocabulary

- **Action Glow** (`0 14px 36px -18px rgba(243, 112, 33, 0.95)`): rests under the orange primary action; expands to `0 20px 42px -18px rgba(243, 112, 33, 0.95)` on hover.
- **Navigation Float** (`0 16px 40px -28px rgba(0, 0, 0, 0.9)`): appears only after the fixed header leaves the hero origin.
- **Project Lift** (`0 28px 80px -42px rgba(0, 0, 0, 0.95)`): supports the featured sticky project stack.
- **Dialog Lift** (`0 32px 120px -30px rgba(0, 0, 0, 0.95)`): isolates the product modal above its blurred ink backdrop.

**The Tonal-First Rule.** Separate ordinary surfaces with navy steps and hairline borders; reserve strong shadows for controls or layers that genuinely move above the page.

## Shapes

The shape language is softly engineered. Compact controls and small navigation items use `12px` corners; primary buttons use the distinctive `14px` action radius; cards, media frames, accordions, quiz panels, and dialogs use `16px`. Pills and circular instruments use fully rounded geometry only for filters, tags, icon actions, status nodes, and radar motifs.

Most large silhouettes stay rectangular and structural. One-pixel borders, divided rows, clipped image reveals, and the 3px blue/orange signal line prevent the rounded surfaces from becoming playful bubbles. Avoid mixing several corner sizes inside one component unless the inner element has a clearly different role, such as a circular action inside a rectangular card.

## Components

Component motion follows the shared emphasized easing (`cubic-bezier(0.22, 1, 0.36, 1)`). State changes generally complete in `180–400ms`; section reveals take `550–900ms`; timeline growth may reach `1.1s`. Every animation must have a meaningful reduced-motion result.

The Hero title uses a `720ms` blur-and-rise reveal without `clip-path`; text clipping is prohibited on Vietnamese display copy because it can cut accent and descender overhangs. The reveal resolves immediately when reduced motion is requested.

### Buttons

- **Shape:** gently squared action control (`14px`) with a `52px` minimum height, balanced inline padding, and 700 weight.
- **Primary:** Action Orange with Blueprint Navy text and a low warm glow; it rises `2px` and brightens on hover.
- **Secondary:** translucent dark glass with a cool hairline border; hover adds a blue wash and the same `2px` lift.
- **Focus / Disabled:** the global focus indicator is a 3px orange outline offset by 4px; disabled submit controls retain shape and use reduced opacity with a prohibited cursor.

### Chips

- **Style:** filter chips are full pills with a `44px` minimum touch height, compact label typography, and optional leading icon.
- **State:** inactive chips use a translucent border and muted dark-surface copy; the active chip becomes pale signal blue with Blueprint Navy text and travels through a spring-backed selection layer.

### Cards / Containers

- **Corner Style:** structural surfaces use `16px` corners with clipped media and content.
- **Background:** cards use the current semantic card surface; featured projects use Navy Panel and media uses Deep Ink.
- **Shadow Strategy:** ordinary cards have a shallow ambient shadow or no shadow; featured sticky cards use Project Lift.
- **Border:** one-pixel semantic or translucent white hairlines provide the primary edge.
- **Internal Padding:** compact cards begin at `1.25rem`; content-rich cards scale through `1.5rem`, `2rem`, and `2.5rem`.

### Inputs / Fields

- **Style:** contact fields are transparent with a single bottom hairline, zero corner radius, white input text, and `1rem` vertical padding.
- **Focus:** the bottom line shifts to Signal Blue while the global orange focus outline remains available for keyboard navigation.
- **Error / Disabled:** error copy uses a warm coral and success copy uses a cool green; submit buttons communicate disabled state through opacity without shifting layout.

### Navigation

The navigation is fixed above the hero. At rest it is transparent; after `24px` of scroll it becomes a 92%-opaque Blueprint Navy bar with blur, a bottom hairline, and Navigation Float. Desktop links use compact rounded hover wells. Below `1024px`, links move into a full-width clipped sheet while theme and menu controls preserve `44px` touch targets.

The brand mark is the compact legacy wordmark: orange `LHU` followed by blue `TECH HUB`, with no badge or enclosing tile.

### Footer

The footer is a compact information close, not a second hero. It uses the legacy wordmark once, then groups the university name and address, navigation, and social links. The final copyright row is separated by one hairline; never repeat the brand as an oversized display wordmark.

### Accordion and Quiz Choices

Accordion rows use a restrained card surface, blue icon, circular chevron control, and a pointer-following blue spotlight; expansion reveals copy without moving the visual anchor. Quiz choices use full-width `12px` controls, a minimum height of `64px`, a selection circle, blue hover border, and an orange directional cue. These are interaction surfaces, not decorative cards.

## Do's and Don'ts

### Do:

- **Do** keep the public experience dark-led while preserving the implemented light semantic canvas and card mode.
- **Do** use Signal Blue for structure and information, then reserve Action Orange for decisions, progress, and directional emphasis.
- **Do** give each major section one legible motion signature while keeping the shared easing, restraint, and reduced-motion fallback.
- **Do** align new sections to the `80rem` shell, the established section rhythm, and the responsive reading order.
- **Do** preserve visible focus, touch targets of at least `44px`, CMS empty states, and readable contrast on every surface.
- **Do** set long mission or vision statements in Be Vietnam Pro at `1.25rem–1.9rem`, around `64ch`, with `1.62` line-height; reserve Lexend for the short section label.

### Don't:

- **Don't** flatten the page into repeated equal cards; alternate editorial splits, ruled grids, stacked projects, timelines, and focused interaction panels.
- **Don't** use blue and orange as interchangeable decoration or give them equal emphasis inside one component.
- **Don't** introduce a third typeface, over-tighten display tracking, compress Vietnamese line-height, or set long copy in the display face.
- **Don't** use large shadows as a default border substitute; ordinary depth comes from tone, hairlines, grids, and media wells.
- **Don't** autoplay ornamental motion when reduced motion is requested, or add movement that competes with reading and form completion.
- **Don't** enlarge the footer wordmark into a display headline or wrap the legacy LHU wordmark in a badge.
