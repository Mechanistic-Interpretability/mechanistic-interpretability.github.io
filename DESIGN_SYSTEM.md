# Skeuomorphic Design System

A comprehensive design system for the Mechanistic Interpretability blog, featuring a retro-CRT terminal aesthetic with consistent skeuomorphic styling.

## Overview

-   **Philosophy**: Skeuomorphic/retro-CRT terminal aesthetic
-   **Stack**: Next.js 15 + React 19 + Tailwind CSS 3.4 + CSS Custom Properties
-   **Font**: Custom IoskeleyMono (monospace)
-   **Theme**: next-themes with class-based dark mode

## Quick Start

```tsx
import { SkeuoShell, SkeuoButton, SkeuoCard, SkeuoContent } from "@/components/SkeuoPrimitives";
import { TiltCard } from "@/components/TiltCard";
import { getVenueColor } from "@/lib/venueColors";

// Basic shell
<SkeuoShell>
  <Content />
</SkeuoShell>

// Panel with screws and title
<SkeuoShell variant="panel" screws title="DISPLAY" powerLed hasInnerBezel>
  <Content />
</SkeuoShell>

// Button
<SkeuoButton>Click me</SkeuoButton>

// Card with tilt effect
<TiltCard tiltAmount={10} glareEnabled scatterIndex={0}>
  <SkeuoCard>
    <Content />
  </SkeuoCard>
</TiltCard>

// Venue badge
<span className={`badge ${getVenueColor("NeurIPS")}`}>NeurIPS</span>
```

## Components

### SkeuoShell

The foundation component for all skeuomorphic containers.

#### Props

| Prop            | Type                                                       | Default     | Description                            |
| --------------- | ---------------------------------------------------------- | ----------- | -------------------------------------- |
| `variant`       | `"default" \| "panel" \| "terminal" \| "button" \| "card"` | `"default"` | Visual style variant                   |
| `size`          | `"sm" \| "md" \| "lg" \| "xl"`                             | `"lg"`      | Size affects padding and border radius |
| `screws`        | `boolean`                                                  | `false`     | Show corner screws                     |
| `screwSize`     | `"sm" \| "md" \| "lg"`                                     | `"md"`      | Size of corner screws                  |
| `hasInnerBezel` | `boolean`                                                  | `false`     | Show inner bezel container             |
| `hasGrain`      | `boolean`                                                  | `true`      | Show plastic grain texture             |
| `hasHighlight`  | `boolean`                                                  | `true`      | Show highlight/glow effects            |
| `hasLip`        | `boolean`                                                  | `true`      | Show bottom lip shadow                 |
| `powerLed`      | `boolean`                                                  | `false`     | Show power LED (panel only)            |
| `title`         | `string`                                                   | -           | Title text (panel only)                |

#### Variants

```tsx
// Default shell
<SkeuoShell>Content</SkeuoShell>

// Panel - with screws, title, branding strip
<SkeuoShell variant="panel" screws title="DISPLAY">
  Content
</SkeuoShell>

// Terminal - larger, more prominent
<SkeuoShell variant="terminal" size="xl" hasInnerBezel>
  Content
</SkeuoShell>

// Button - smaller, interactive
<SkeuoShell variant="button" size="sm">
  Click me
</SkeuoShell>

// Card - medium size, for content cards
<SkeuoShell variant="card" hasInnerBezel>
  Content
</SkeuoShell>
```

### SkeuoButton

Pre-configured button with skeuomorphic styling.

```tsx
<SkeuoButton size="md" variant="default" onClick={handleClick}>
	Click me
</SkeuoButton>
```

### SkeuoCard

Card component with selection/hover states.

```tsx
<SkeuoCard isSelected={isSelected} isHovered={isHovered} isPressed={isPressed}>
	Content
</SkeuoCard>
```

### SkeuoContent

Content area with optional screen effects.

```tsx
<SkeuoContent hasScreenEffects isDark>
	Terminal content
</SkeuoContent>
```

### TiltCard

Wrapper component that adds 3D tilt and glare effects.

```tsx
<TiltCard
	tiltAmount={10} // Degrees of tilt
	glareEnabled={true} // Show glare effect
	scale={1.02} // Scale on hover
	scatterIndex={0} // For scattered rotation (-3 to +3 deg)
	disableOnTouch={true} // Disable on touch devices
	onClick={handleClick}
>
	<SkeuoCard>Content</SkeuoCard>
</TiltCard>
```

## Theme Tokens

### Tailwind Config Extensions

```js
// tailwind.config.ts
colors: {
  shell: {
    from: '#f4f7fb',
    via: '#d8dfe8',
    to: '#a6b2bf',
    border: 'rgba(100, 116, 139, 0.45)',
  },
  bezel: {
    from: '#e8edf3',
    to: '#bac5d2',
    border: 'rgba(100, 116, 139, 0.45)',
  },
  screen: {
    light: '#edf2f8',
    dark: '#060606',
  },
  accent: {
    violet: '#8b5cf6',
    'violet-light': '#a78bfa',
    sky: '#38bdf8',
    'sky-light': '#7dd3fc',
  },
},
boxShadow: {
  shell: '0 16px 28px rgba(15, 23, 42, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.85), inset 0 -6px 12px rgba(71, 85, 105, 0.24)',
  'shell-lg': '0 24px 50px rgba(15, 23, 42, 0.28), ...',
  'shell-dark': '0 20px 36px rgba(0, 0, 0, 0.5), ...',
  bezel: 'inset 0 2px 2px rgba(255, 255, 255, 0.65), ...',
  button: '0 2px 6px rgba(15, 23, 42, 0.15), ...',
  // ...etc
},
```

### CSS Custom Properties (globals.css)

```css
:root {
  --shell-bg-from: #f4f7fb;
  --shell-bg-via: #d8dfe8;
  --shell-bg-to: #a6b2bf;
  --shell-border: rgba(100, 116, 139, 0.45);
  --shell-shadow: ...;

  --inner-bg-from: #e8edf3;
  --inner-bg-to: #bac5d2;
  --inner-border: rgba(100, 116, 139, 0.45);
  --inner-shadow: ...;
}

.dark {
  --shell-bg-from: #3a4350;
  --shell-bg-via: #2a313a;
  --shell-bg-to: #1a2028;
  /* ...etc
}
```

## Utilities

### getVenueColor(venue: string): string

Returns Tailwind classes for venue badges.

```tsx
import { getVenueColor } from "@/lib/venueColors";

<span className={`badge ${getVenueColor("NeurIPS")}`}>NeurIPS</span>;
```

**Supported Venues:**

-   NeurIPS, ICML, ICLR, Nature, Science, arXiv

### cn(...inputs): string

Combines class names using clsx.

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base", isActive && "active", className)} />;
```

## Performance Optimizations

### CustomCursor

-   Uses `requestAnimationFrame` to throttle updates to 60fps
-   CSS transforms for GPU acceleration
-   Passive event listeners for better scroll performance
-   Automatically disabled on touch devices

### HeroSection Parallax

-   `requestAnimationFrame` throttling
-   Passive scroll listeners
-   Transform-only animations

### TiltCard

-   rAF throttled mouse move
-   CSS transforms (no layout thrashing)
-   Touch device detection

## Accessibility

### Focus Visible

All interactive elements have `focus-visible` styles:

```css
/* SkeuoButton example */
<SkeuoButton className="focus-visible:ring-2 focus-visible:ring-violet-500/50" />
```

### Reduced Motion

Respects `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
	.animate-* {
		animation: none !important;
	}
}
```

## Migration Guide

### From SkeuomorphicPanel

**Before:**

```tsx
<SkeuomorphicPanel title="DISPLAY" screws powerLed>
	<Content />
</SkeuomorphicPanel>
```

**After:**

```tsx
<SkeuoShell variant="panel" screws title="DISPLAY" powerLed hasInnerBezel>
	<SkeuoContent>
		<Content />
	</SkeuoContent>
</SkeuoShell>
```

### From SkeuomorphicShell

**Before:**

```tsx
<SkeuomorphicShell showScrews hasInnerBezel>
	<Content />
</SkeuomorphicShell>
```

**After:**

```tsx
<SkeuoShell screws hasInnerBezel>
	<Content />
</SkeuoShell>
```

### From Inline Tilt Logic

**Before:**

```tsx
const [transform, setTransform] = useState("");
const handleMouseMove = (e) => {
	/* 40 lines */
};
return (
	<div onMouseMove={handleMouseMove} style={{ transform }}>
		<Card />
	</div>
);
```

**After:**

```tsx
<TiltCard tiltAmount={10} scatterIndex={index}>
	<SkeuoCard>
		<Content />
	</SkeuoCard>
</TiltCard>
```

### From Inline getVenueColor

**Before:**

```tsx
const getVenueColor = (venue) => {
	const colors = { NeurIPS: "...", ICML: "..." };
	return colors[venue] || "...";
};
```

**After:**

```tsx
import { getVenueColor } from "@/lib/venueColors";
// Just use getVenueColor(venue)
```

## Best Practices

1. **Use the primitives**: Always prefer `SkeuoShell` over inline class strings
2. **Consistent sizing**: Use `size` prop instead of custom padding
3. **Theme consistency**: Use theme tokens, avoid hardcoded colors
4. **Performance**: Use `TiltCard` instead of duplicating tilt logic
5. **Accessibility**: Include focus-visible styles on custom buttons
6. **Dark mode**: Use `dark:` prefix, avoid isDark conditionals

## File Structure

```
app/
├── components/
│   ├── SkeuoPrimitives.tsx    # Shell, Button, Card, Content
│   ├── TiltCard.tsx           # 3D tilt + glare
│   └── PanelScrew.tsx         # Screw component
├── lib/
│   ├── utils.ts               # cn() helper
│   └── venueColors.ts         # getVenueColor()
└── globals.css                # Theme tokens, animations

tailwind.config.ts              # Extended theme tokens
```

## Browser Support

-   Chrome 90+
-   Firefox 88+
-   Safari 14+
-   Edge 90+

Requires CSS Custom Properties and Tailwind CSS 3.4+.

## Credits

Design system created for the Mechanistic Interpretability blog.
Maintained with craft and care.
