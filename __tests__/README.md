# Design System Test Suite

Comprehensive tests for the skeuomorphic design system optimizations.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run only design system tests
npm test -- design-system.test.tsx
```

## Test Coverage

### 1. **Utility Tests** (`cn()`)

-   ✅ Class name combination
-   ✅ Conditional classes
-   ✅ Undefined handling

### 2. **Venue Color Tests** (`getVenueColor()`)

-   ✅ Correct classes for known venues (NeurIPS, ICML, ICLR, Nature, Science, arXiv)
-   ✅ Default color for unknown venues
-   ✅ Consistent `/20` opacity (regression test for the /15 vs /20 bug)
-   ✅ Dark mode classes included

### 3. **Tailwind Config Tests**

-   ✅ Skeuomorphic color tokens exist (shell, bezel, screen, accent)
-   ✅ Color values are correct
-   ✅ Shadow tokens exist (shell, shell-lg, bezel, button)
-   ✅ Background gradient tokens exist

### 4. **SkeuoShell Component Tests**

-   ✅ Renders children correctly
-   ✅ Applies base shell classes (border, gradient, shadow)
-   ✅ Panel variant with title and screws
-   ✅ Screws rendering
-   ✅ Inner bezel rendering
-   ✅ Plastic grain overlay
-   ✅ Custom className application

### 5. **SkeuoButton Component Tests**

-   ✅ Renders children
-   ✅ Click handling
-   ✅ Focus-visible styles present
-   ✅ Size variations (sm, md)

### 6. **SkeuoCard Component Tests**

-   ✅ Renders children
-   ✅ Selected state styles applied
-   ✅ Hovered state styles applied
-   ✅ Pressed state styles applied
-   ✅ Plastic grain overlay

### 7. **TiltCard Component Tests**

-   ✅ Renders children
-   ✅ Transform style with perspective
-   ✅ Preserve-3d transform style
-   ✅ Scatter rotation based on index
-   ✅ Click event handling
-   ✅ Keyboard accessibility (Enter/Space)
-   ✅ ARIA attributes when clickable
-   ✅ No button role when not clickable
-   ✅ Touch device detection

### 8. **Performance Tests**

-   ✅ RAF throttling for mouse move
-   ✅ RAF cancellation on mouse leave

### 9. **Integration Tests**

-   ✅ Full panel with TiltCard and SkeuoCard
-   ✅ Button inside shell
-   ✅ Terminal-style content area

### 10. **Regression Tests**

-   ✅ Venue color opacity consistency (/20 not /15)
-   ✅ No console errors on render
-   ✅ No crashes on rapid mouse movements
-   ✅ Dark mode class support

### 11. **Accessibility Tests**

-   ✅ Keyboard navigation for buttons
-   ✅ Keyboard navigation for TiltCard
-   ✅ Focus visible styles present

## Test Philosophy

Each test verifies a specific optimization or feature:

1. **Component Structure**: Tests ensure components render correctly with all variants
2. **Theme Tokens**: Tests verify Tailwind config has all necessary tokens
3. **Performance**: Tests confirm RAF throttling works to prevent 60+ setState/sec
4. **Consistency**: Tests prevent regression of the venue color opacity bug
5. **Accessibility**: Tests ensure proper ARIA attributes and keyboard support

## Example Test Output

```
PASS  __tests__/design-system.test.tsx
  cn() utility
    ✓ combines class names correctly
    ✓ handles conditional classes
    ✓ handles undefined values

  getVenueColor()
    ✓ returns correct classes for known venues
    ✓ returns default color for unknown venues
    ✓ has all expected venues defined
    ✓ returns consistent opacity (20 not 15)

  Tailwind Config
    ✓ has skeuomorphic color tokens
    ✓ has shell color values
    ✓ has shadow tokens
    ✓ has background gradient tokens

  SkeuoShell
    ✓ renders children
    ✓ applies correct base classes
    ✓ renders with variant='panel'
    ✓ renders screws when screws prop is true
    ✓ renders inner bezel when hasInnerBezel is true
    ✓ renders plastic grain overlay
    ✓ applies custom className

  ... (more tests)

Test Suites: 1 passed, 1 total
Tests:       50+ passed, 50+ total
```

## Adding New Tests

When adding new skeuomorphic components:

1. Create tests in `__tests__/design-system.test.tsx`
2. Follow the existing patterns
3. Test all variants and states
4. Include regression tests for specific fixes
5. Verify accessibility attributes

Example:

```typescript
describe("NewComponent", () => {
  it("renders correctly", () => {
    render(<NewComponent>Content</NewComponent>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("handles variant prop", () => {
    const { container } = render(
      <NewComponent variant="special">Content</NewComponent>
    );
    expect(container.firstChild).toHaveClass("special-class");
  });
});
```

## Troubleshooting

### Tests failing?

1. **Check imports**: Make sure all new components are exported from their files
2. **Check Tailwind config**: Ensure theme extensions are properly defined
3. **Check Jest config**: Verify test environment is set up correctly
4. **Clear cache**: `npm test -- --clearCache`

### TypeScript errors?

If you see errors about Tailwind config types, use type assertions:

```typescript
const config = tailwindConfig as any;
```

This is acceptable in tests where we just want to verify the structure.
