# Design System Document: The Resonating Thread

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Luthier"**

This design system is built to transform a mobile interface into a precision instrument. To move beyond a standard utility app, we embrace a high-end editorial aesthetic that mimics the focused atmosphere of a dimly lit recording studio or a luthier’s workshop.

The system breaks away from "template" layouts by using **intentional asymmetry** and **tonal depth**. Instead of rigid, boxed grids, we use breathing room and varying typographic scales to guide the eye. We treat the screen not as a flat pane of glass, but as a resonant chamber where elements are layered, organic, and tactile.

---

## 2. Colors: The Amber Glow
The palette is rooted in deep, light-absorbing charcoals to minimize eye strain, punctuated by warm, high-chroma accents that evoke the vibration of bronze strings and polished wood.

### Surface Palette
- **Base Surface:** `#131313` (Surface/Background). The foundation.
- **The "No-Line" Rule:** Sectioning must **never** be achieved with 1px solid borders. Boundaries are defined solely through background shifts. For example, a track list sitting on `surface` should be contained within a `surface-container-low` (`#1c1b1b`) area.
- **Surface Hierarchy:** Use the `surface-container` tiers to create "nested" depth. 
    - *Lowest (`#0e0e0e`):* Use for background "wells" or recessed content.
    - *Highest (`#353534`):* Use for active, interactive elements that need to feel closest to the user.

### Accents & Soul
- **Primary (Amber):** `#ffb95f`. Used for "active vibration"—tempo indicators, record buttons, and primary CTAs.
- **Secondary (Wood/Copper):** `#ffb693`. Used for secondary interactions and tonal variety.
- **The "Glass & Gradient" Rule:** To avoid a flat look, floating playback controls or overlays must use **Glassmorphism**. Apply `surface-container` colors at 70% opacity with a `20px` backdrop blur. 
- **Signature Textures:** For high-impact areas (Hero headers, Song Titles), use a subtle linear gradient from `primary` (#ffb95f) to `primary-container` (#ca8100) at a 135-degree angle to simulate the shimmer of a string.

---

## 3. Typography: Editorial Precision
The typography uses a dual-sans-serif approach to balance character with extreme legibility.

- **Display & Headlines (Manrope):** A modern, geometric sans with a technical edge.
    - **Display-LG (3.5rem):** Reserved for singular focus points (e.g., a BPM count or a Song Title in "Perform" mode).
    - **Headline-MD (1.75rem):** Used for section headers like "Library" or "Recent Recordings."
- **Body & Labels (Inter):** A neutral, high-legibility face for utility.
    - **Body-MD (0.875rem):** For lyrics or technical notes.
    - **Label-SM (0.6875rem):** For metadata (Key, Time Sig, Date). This should always use `on-surface-variant` (`#dbc2b0`) to remain discrete.

**Hierarchy Note:** Use extreme contrast. Pair a `Display-LG` headline with a `Label-SM` sub-caption. The massive size difference creates an "Editorial" feel that feels custom and premium.

---

## 4. Elevation & Depth: Tonal Layering
We reject the standard "drop shadow." In this system, depth is a result of light and material, not artificial fuzz.

- **The Layering Principle:** Stack containers to create hierarchy. A `surface-container-highest` card should sit atop a `surface-container-low` section. This creates a soft, natural lift.
- **Ambient Shadows:** If a floating action button (FAB) or menu requires a shadow, it must be highly diffused. 
    - *Specs:* Blur: `32px`, Spread: `-4px`, Color: `rgba(0, 0, 0, 0.4)`. 
- **The "Ghost Border" Fallback:** If accessibility requires a stroke (e.g., a focused input), use the `outline-variant` (`#554336`) at **15% opacity**. It should be felt, not seen.
- **Organic Vibration:** Any feedback (tap, hold) should use a subtle "string vibration" animation—a quick, dampened micro-oscillation (X-axis) rather than a standard material ripple.

---

## 5. Components: The Musician's Kit

### Buttons
- **Primary:** Filled with `primary` (`#ffb95f`). Text in `on-primary` (`#472a00`). Shape: `xl` (`0.75rem`) roundedness.
- **Tertiary:** No background. Text in `primary`. For "Cancel" or "Back" actions.

### Cards & Lists
- **Strict Rule:** **No divider lines.** Separate song list items using `16px` of vertical white space or by alternating background tiers slightly (e.g., `surface` to `surface-container-low`).
- **Interactive Cards:** Use `surface-container-high` (`#2a2a2a`) with a `0.75rem` radius. On press, scale down to `98%` to simulate physical pressure.

### The "Tuning" Input
- **Text Inputs:** Use `surface-container-lowest` as the field background. The active state is signaled by an `amber` (primary) cursor and a soft `primary` glow (using the Glassmorphism rule), never a heavy border.

### Relevant Custom Components
- **The Metronome Ribbon:** A horizontal, edge-to-edge scrollable area using `surface-container-highest` with a single `primary` vertical line for the beat marker.
- **Waveform Seekbar:** Instead of a line, use thin vertical bars of varying heights using `secondary` (`#ffb693`) to visualize audio energy.

---

## 6. Do's and Don'ts

### Do
- **Do** use large amounts of negative space. This is a tool for focus.
- **Do** use "Manrope" for numbers and data points—it feels like a professional gauge.
- **Do** use "vibrating" transitions. When a panel opens, it should have a slight elastic overshoot.

### Don'ts
- **Don't** use pure white (`#FFFFFF`). It breaks the intimacy of the dark environment. Use `on-surface` (`#e5e2e1`).
- **Don't** use 1px dividers. If you feel the need for a line, increase the padding instead.
- **Don't** use standard Material or iOS icons. Use linear, 1.5pt weight custom icons with rounded terminals to match the "string" feel.
- **Don't** use sharp corners. Everything should have at least a `sm` (`0.125rem`) radius to feel like a handled instrument.

---