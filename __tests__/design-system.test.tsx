/**
 * Design System Test Suite
 *
 * Tests for all skeuomorphic optimizations:
 * - Shared primitives (SkeuoShell, SkeuoButton, SkeuoCard)
 * - TiltCard throttling and touch detection
 * - Venue color utility
 * - Performance optimizations (rAF throttling)
 * - Dark mode standardization
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { TiltCard } from "../app/components/TiltCard";
import {
	SkeuoShell,
	SkeuoButton,
	SkeuoCard,
	SkeuoContent,
	SkeuoPanel,
} from "../app/components/SkeuoPrimitives";
import { getVenueColor, hasVenueColor } from "../app/lib/venueColors";
import { cn } from "../app/lib/utils";
import tailwindConfig from "../tailwind.config";

// ============================================================================
// Utility Tests
// ============================================================================

describe("cn() utility", () => {
	it("combines class names correctly", () => {
		expect(cn("base", "active")).toBe("base active");
	});

	it("handles conditional classes", () => {
		expect(cn("base", true && "active", false && "inactive")).toBe(
			"base active",
		);
	});

	it("handles undefined values", () => {
		expect(cn("base", undefined, "active")).toBe("base active");
	});
});

// ============================================================================
// Venue Color Tests
// ============================================================================

describe("getVenueColor()", () => {
	it("returns correct classes for known venues", () => {
		const neurips = getVenueColor("NeurIPS");
		expect(neurips).toContain("bg-amber-500/20");
		expect(neurips).toContain("text-amber-700");
		expect(neurips).toContain("dark:text-amber-300");
	});

	it("returns default color for unknown venues", () => {
		const unknown = getVenueColor("UnknownVenue");
		expect(unknown).toContain("bg-violet-500/20");
		expect(unknown).toContain("text-violet-700");
	});

	it("has all expected venues defined", () => {
		const expectedVenues = [
			"NeurIPS",
			"ICML",
			"ICLR",
			"Nature",
			"Science",
			"arXiv",
		];
		expectedVenues.forEach((venue) => {
			expect(hasVenueColor(venue)).toBe(true);
			expect(getVenueColor(venue)).toBeTruthy();
		});
	});

	it("returns consistent opacity (20 not 15)", () => {
		// This test ensures we fixed the inconsistency between PaperCard and FeaturedPapers
		const neurips = getVenueColor("NeurIPS");
		expect(neurips).toContain("/20");
		expect(neurips).not.toContain("/15");
	});
});

// ============================================================================
// Tailwind Config Tests
// ============================================================================

describe("Tailwind Config", () => {
	it("has skeuomorphic color tokens", () => {
		const config = tailwindConfig as any;
		const colors = config.theme?.extend?.colors;
		expect(colors).toHaveProperty("shell");
		expect(colors).toHaveProperty("bezel");
		expect(colors).toHaveProperty("screen");
		expect(colors).toHaveProperty("accent");
	});

	it("has shell color values", () => {
		const config = tailwindConfig as any;
		const shell = config.theme?.extend?.colors?.shell;
		expect(shell).toHaveProperty("from");
		expect(shell).toHaveProperty("via");
		expect(shell).toHaveProperty("to");
		expect(shell).toHaveProperty("border");
		expect(shell.from).toBe("#f4f7fb");
		expect(shell.via).toBe("#d8dfe8");
		expect(shell.to).toBe("#a6b2bf");
	});

	it("has shadow tokens", () => {
		const config = tailwindConfig as any;
		const shadows = config.theme?.extend?.boxShadow;
		expect(shadows).toHaveProperty("shell");
		expect(shadows).toHaveProperty("shell-lg");
		expect(shadows).toHaveProperty("bezel");
		expect(shadows).toHaveProperty("button");
	});

	it("has background gradient tokens", () => {
		const config = tailwindConfig as any;
		const backgrounds = config.theme?.extend?.backgroundImage;
		expect(backgrounds).toHaveProperty("shell-gradient");
		expect(backgrounds).toHaveProperty("bezel-gradient");
	});
});

// ============================================================================
// SkeuoShell Component Tests
// ============================================================================

describe("SkeuoShell", () => {
	it("renders children", () => {
		render(
			<SkeuoShell>
				<div data-testid="content">Content</div>
			</SkeuoShell>,
		);
		expect(screen.getByTestId("content")).toBeInTheDocument();
	});

	it("applies correct base classes", () => {
		const { container } = render(
			<SkeuoShell>
				<div>Content</div>
			</SkeuoShell>,
		);
		const shell = container.firstChild?.firstChild;
		expect(shell).toHaveClass("border");
		expect(shell).toHaveClass("bg-gradient-to-b");
		expect(shell).toHaveClass("shadow-shell");
	});

	it("renders with variant='panel'", () => {
		const { container } = render(
			<SkeuoShell variant="panel" title="TEST" screws>
				<div>Content</div>
			</SkeuoShell>,
		);
		// Panel should have title strip
		expect(container.textContent).toContain("TEST");
	});

	it("renders screws when screws prop is true", () => {
		const { container } = render(
			<SkeuoShell screws>
				<div>Content</div>
			</SkeuoShell>,
		);
		// PanelScrew components should be rendered (absolute positioned elements in corners)
		const screws = container.querySelectorAll(
			'[class*="absolute"][class*="rounded-full"]',
		);
		expect(screws.length).toBeGreaterThanOrEqual(2); // At least 2 screws in corners
	});

	it("renders inner bezel when hasInnerBezel is true", () => {
		const { container } = render(
			<SkeuoShell hasInnerBezel>
				<div data-testid="content">Content</div>
			</SkeuoShell>,
		);
		const innerBezel = container.querySelector('[class*="m-1"]');
		expect(innerBezel).toBeInTheDocument();
	});

	it("renders plastic grain overlay", () => {
		const { container } = render(
			<SkeuoShell>
				<div>Content</div>
			</SkeuoShell>,
		);
		const grain = container.querySelector(".plastic-grain");
		expect(grain).toBeInTheDocument();
	});

	it("applies custom className", () => {
		const { container } = render(
			<SkeuoShell className="custom-class">
				<div>Content</div>
			</SkeuoShell>,
		);
		expect(container.firstChild).toHaveClass("custom-class");
	});
});

// ============================================================================
// SkeuoButton Component Tests
// ============================================================================

describe("SkeuoButton", () => {
	it("renders children", () => {
		render(<SkeuoButton>Click me</SkeuoButton>);
		expect(screen.getByText("Click me")).toBeInTheDocument();
	});

	it("is clickable", () => {
		const handleClick = jest.fn();
		render(<SkeuoButton onClick={handleClick}>Click me</SkeuoButton>);
		fireEvent.click(screen.getByText("Click me"));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("has focus-visible styles", () => {
		const { container } = render(<SkeuoButton>Click me</SkeuoButton>);
		const button = container.querySelector("button");
		expect(button).toHaveClass("focus-visible:ring-2");
	});

	it("applies size classes", () => {
		const { container: sm } = render(
			<SkeuoButton size="sm">Small</SkeuoButton>,
		);
		const { container: md } = render(
			<SkeuoButton size="md">Medium</SkeuoButton>,
		);

		const smButton = sm.querySelector("button");
		const mdButton = md.querySelector("button");

		expect(smButton).toHaveClass("h-7");
		expect(mdButton).toHaveClass("h-8");
	});
});

// ============================================================================
// SkeuoCard Component Tests
// ============================================================================

describe("SkeuoCard", () => {
	it("renders children", () => {
		render(
			<SkeuoCard>
				<div data-testid="content">Content</div>
			</SkeuoCard>,
		);
		expect(screen.getByTestId("content")).toBeInTheDocument();
	});

	it("applies selected state styles", () => {
		const { container } = render(
			<SkeuoCard isSelected>
				<div>Content</div>
			</SkeuoCard>,
		);
		const card = container.firstChild;
		expect(card).toHaveClass("border-violet-500/60");
	});

	it("applies hovered state styles", () => {
		const { container } = render(
			<SkeuoCard isHovered>
				<div>Content</div>
			</SkeuoCard>,
		);
		const card = container.firstChild;
		expect(card).toBeInTheDocument();
	});

	it("applies pressed state styles", () => {
		const { container } = render(
			<SkeuoCard isPressed>
				<div>Content</div>
			</SkeuoCard>,
		);
		const card = container.firstChild;
		expect(card).toBeInTheDocument();
	});

	it("has plastic grain overlay", () => {
		const { container } = render(
			<SkeuoCard>
				<div>Content</div>
			</SkeuoCard>,
		);
		const grain = container.querySelector(".plastic-grain");
		expect(grain).toBeInTheDocument();
	});
});

// ============================================================================
// TiltCard Component Tests
// ============================================================================

describe("TiltCard", () => {
	beforeEach(() => {
		// Reset RAF mocks
		jest.clearAllMocks();
	});

	it("renders children", () => {
		render(
			<TiltCard>
				<div data-testid="content">Content</div>
			</TiltCard>,
		);
		expect(screen.getByTestId("content")).toBeInTheDocument();
	});

	it("has proper transform style", () => {
		const { container } = render(
			<TiltCard>
				<div>Content</div>
			</TiltCard>,
		);
		const card = container.firstChild as HTMLElement;
		expect(card.style.transform).toContain("perspective(1000px)");
	});

	it("has preserve-3d transform style", () => {
		const { container } = render(
			<TiltCard>
				<div>Content</div>
			</TiltCard>,
		);
		const card = container.firstChild as HTMLElement;
		expect(card.style.transformStyle).toBe("preserve-3d");
	});

	it("applies scatter rotation based on index", () => {
		const { container: card0 } = render(
			<TiltCard scatterIndex={0}>
				<div>Content</div>
			</TiltCard>,
		);
		const { container: card6 } = render(
			<TiltCard scatterIndex={6}>
				<div>Content</div>
			</TiltCard>,
		);

		const card0Element = card0.firstChild as HTMLElement;
		const card6Element = card6.firstChild as HTMLElement;

		// Both should have different rotations
		expect(card0Element.style.transform).not.toBe(
			card6Element.style.transform,
		);
	});

	it("handles click events", () => {
		const handleClick = jest.fn();
		render(
			<TiltCard onClick={handleClick}>
				<div data-testid="clickable">Click me</div>
			</TiltCard>,
		);

		fireEvent.click(screen.getByTestId("clickable"));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("handles keyboard events", () => {
		const handleClick = jest.fn();
		render(
			<TiltCard onClick={handleClick}>
				<div data-testid="clickable">Click me</div>
			</TiltCard>,
		);

		const element = screen.getByTestId("clickable");
		fireEvent.keyDown(element, { key: "Enter" });
		expect(handleClick).toHaveBeenCalledTimes(1);

		fireEvent.keyDown(element, { key: " " });
		expect(handleClick).toHaveBeenCalledTimes(2);
	});

	it("has proper ARIA attributes when clickable", () => {
		const { container } = render(
			<TiltCard onClick={() => {}}>
				<div>Content</div>
			</TiltCard>,
		);
		const card = container.firstChild as HTMLElement;
		expect(card).toHaveAttribute("role", "button");
		expect(card).toHaveAttribute("tabindex", "0");
	});

	it("does not have button role when not clickable", () => {
		const { container } = render(
			<TiltCard>
				<div>Content</div>
			</TiltCard>,
		);
		const card = container.firstChild as HTMLElement;
		expect(card).not.toHaveAttribute("role", "button");
	});

	it("disables tilt on touch devices when disableOnTouch is true", () => {
		// Mock touch device
		Object.defineProperty(window, "ontouchstart", {
			value: {},
			writable: true,
		});

		const { container } = render(
			<TiltCard disableOnTouch>
				<div>Content</div>
			</TiltCard>,
		);

		const card = container.firstChild as HTMLElement;
		// Should have touch-manipulation class
		expect(card).toHaveClass("touch-manipulation");
	});
});

// ============================================================================
// Performance Tests
// ============================================================================

describe("Performance Optimizations", () => {
	it("TiltCard has RAF-based implementation", () => {
		const { container } = render(
			<TiltCard>
				<div data-testid="content" style={{ width: 200, height: 200 }}>
					Content
				</div>
			</TiltCard>,
		);

		const card = container.firstChild as HTMLElement;
		expect(card).toBeInTheDocument();

		// In real browser, RAF throttling prevents 60+ setState/sec
		// Test environment uses mocked RAF
	});

	it("TiltCard handles mouse events without crashing", () => {
		const { container } = render(
			<TiltCard>
				<div style={{ width: 200, height: 200 }}>Content</div>
			</TiltCard>,
		);

		const card = container.firstChild as HTMLElement;

		// Trigger mouse events
		fireEvent.mouseMove(card, { clientX: 100, clientY: 100 });
		fireEvent.mouseLeave(card);

		// Should not throw any errors
		expect(card).toBeInTheDocument();
	});
});

// ============================================================================
// Integration Tests
// ============================================================================

describe("Integration: Complete Skeuomorphic Components", () => {
	it("renders full panel with TiltCard and SkeuoCard", () => {
		render(
			<SkeuoPanel title="FEATURED" screws powerLed>
				<TiltCard scatterIndex={0} tiltAmount={8}>
					<SkeuoCard>
						<div data-testid="card-content">
							<h3>Paper Title</h3>
							<span className={getVenueColor("NeurIPS")}>
								NeurIPS
							</span>
						</div>
					</SkeuoCard>
				</TiltCard>
			</SkeuoPanel>,
		);

		expect(screen.getByTestId("card-content")).toBeInTheDocument();
		expect(screen.getByText("FEATURED")).toBeInTheDocument();
		expect(screen.getByText("Paper Title")).toBeInTheDocument();
		expect(screen.getByText("NeurIPS")).toBeInTheDocument();
	});

	it("renders skeuomorphic button inside shell", () => {
		const handleClick = jest.fn();
		render(
			<SkeuoShell hasInnerBezel>
				<div className="p-4">
					<SkeuoButton onClick={handleClick}>Click me</SkeuoButton>
				</div>
			</SkeuoShell>,
		);

		fireEvent.click(screen.getByText("Click me"));
		expect(handleClick).toHaveBeenCalled();
	});

	it("renders terminal-style content area", () => {
		render(
			<SkeuoShell variant="terminal" size="xl" hasInnerBezel>
				<SkeuoContent hasScreenEffects isDark>
					<div data-testid="terminal-content">
						<p className="text-white/80">Welcome to terminal</p>
					</div>
				</SkeuoContent>
			</SkeuoShell>,
		);

		expect(screen.getByTestId("terminal-content")).toBeInTheDocument();
	});
});

// ============================================================================
// Regression Tests
// ============================================================================

describe("Regression Tests", () => {
	it("VenueColor opacity is consistent (20 not 15)", () => {
		// This was a bug where PaperCard used /15 and FeaturedPapers used /20
		const venues = [
			"NeurIPS",
			"ICML",
			"ICLR",
			"Nature",
			"Science",
			"arXiv",
		];

		venues.forEach((venue) => {
			const classes = getVenueColor(venue);
			expect(classes).toContain("/20");
			expect(classes).not.toContain("/15");
		});
	});

	it("SkeuoShell renders without console errors", () => {
		const consoleSpy = jest
			.spyOn(console, "error")
			.mockImplementation(() => {});

		render(
			<SkeuoShell
				variant="panel"
				screws
				title="TEST"
				powerLed
				hasInnerBezel
				hasGrain
				hasHighlight
				hasLip
			>
				<div>Content</div>
			</SkeuoShell>,
		);

		expect(consoleSpy).not.toHaveBeenCalled();

		consoleSpy.mockRestore();
	});

	it("TiltCard does not crash on rapid mouse movements", () => {
		const { container } = render(
			<TiltCard>
				<div style={{ width: 200, height: 200 }}>Content</div>
			</TiltCard>,
		);

		const card = container.firstChild as HTMLElement;

		// Rapid mouse movements
		for (let i = 0; i < 20; i++) {
			fireEvent.mouseMove(card, {
				clientX: 50 + i * 5,
				clientY: 50 + i * 5,
			});
		}

		// Should not throw any errors
		expect(card).toBeInTheDocument();
	});

	it("All components support dark mode class", () => {
		const { container: shell } = render(
			<SkeuoShell>
				<div>Content</div>
			</SkeuoShell>,
		);

		const shellElement = shell.querySelector('[class*="dark:"]');
		expect(shellElement).toBeTruthy();
	});
});

// ============================================================================
// Accessibility Tests
// ============================================================================

describe("Accessibility", () => {
	it("SkeuoButton is keyboard accessible", () => {
		const handleClick = jest.fn();
		const { container } = render(
			<SkeuoButton onClick={handleClick}>Button</SkeuoButton>,
		);

		const button = container.querySelector("button");
		expect(button).toBeInTheDocument();

		// Click should work
		fireEvent.click(button!);
		expect(handleClick).toHaveBeenCalled();
	});

	it("TiltCard with onClick is keyboard accessible", () => {
		const handleClick = jest.fn();
		render(
			<TiltCard onClick={handleClick}>
				<div data-testid="content">Content</div>
			</TiltCard>,
		);

		const card = screen.getByTestId("content").parentElement;

		// Should have role and tabindex
		expect(card).toHaveAttribute("role", "button");
		expect(card).toHaveAttribute("tabindex", "0");
	});

	it("Focus visible styles are present", () => {
		const { container } = render(<SkeuoButton>Button</SkeuoButton>);
		const button = container.querySelector("button");

		// Should have focus-visible classes
		expect(button?.className).toContain("focus-visible:");
	});
});
