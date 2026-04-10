"use client";

import { PanelScrew } from "./PanelScrew";
import { cn } from "@/lib/utils";

// ============================================================================
// SKEUOMORPHIC DESIGN SYSTEM - Shared Primitives
// Replaces: SkeuomorphicPanel, SkeuomorphicShell, RetroDesktop shell logic
// ============================================================================

interface SkeuoShellProps {
	children: React.ReactNode;
	className?: string;
	/** Visual variant of the shell */
	variant?: "default" | "panel" | "terminal" | "button" | "card";
	/** Size affects padding and border radius */
	size?: "sm" | "md" | "lg" | "xl";
	/** Show corner screws */
	screws?: boolean;
	screwSize?: "sm" | "md" | "lg";
	/** Show inner bezel container */
	hasInnerBezel?: boolean;
	innerClassName?: string;
	/** Show plastic grain texture overlay */
	hasGrain?: boolean;
	/** Show highlight/glow effects */
	hasHighlight?: boolean;
	/** Additional surface effects */
	hasLip?: boolean;
	/** For panels: show power LED */
	powerLed?: boolean;
	/** For panels: title text */
	title?: string;
}

const sizeClasses = {
	sm: "rounded-lg p-1",
	md: "rounded-xl p-1.5 sm:rounded-2xl sm:p-2",
	lg: "rounded-2xl p-2 sm:rounded-[1.4rem] sm:p-3",
	xl: "rounded-2xl p-2 sm:rounded-[1.6rem] sm:p-3",
};

const innerSizeClasses = {
	sm: "rounded-md",
	md: "rounded-lg sm:rounded-xl",
	lg: "rounded-xl sm:rounded-2xl",
	xl: "rounded-xl sm:rounded-2xl",
};

/**
 * Unified Skeuomorphic Shell Component
 *
 * This single component replaces SkeuomorphicPanel and SkeuomorphicShell
 * with a composable, variant-based API.
 *
 * @example
 * // As a panel (with screws, title, power LED)
 * <SkeuoShell variant="panel" screws title="DISPLAY" powerLed>
 *   <Content />
 * </SkeuoShell>
 *
 * // As a simple shell
 * <SkeuoShell hasInnerBezel>
 *   <Content />
 * </SkeuoShell>
 *
 * // As a button
 * <SkeuoShell variant="button" size="sm">
 *   <span>Click me</span>
 * </SkeuoShell>
 *
 * // As a card
 * <SkeuoShell variant="card" hasInnerBezel>
 *   <CardContent />
 * </SkeuoShell>
 */
export function SkeuoShell({
	children,
	className,
	variant = "default",
	size = "lg",
	screws = false,
	screwSize = "md",
	hasInnerBezel = false,
	innerClassName,
	hasGrain = true,
	hasHighlight = true,
	hasLip = true,
	powerLed = false,
	title,
}: SkeuoShellProps) {
	const isPanel = variant === "panel";
	const isTerminal = variant === "terminal";
	const isButton = variant === "button";
	const isCard = variant === "card";
	const showScrews = screws || isPanel;
	const showTitle = title && isPanel;

	return (
		<div className={cn("relative", className)}>
			{/* Outer Shell */}
			<div
				className={cn(
					// Base shell styling using Tailwind theme tokens
					"relative border border-shell-border dark:border-slate-500/70",
					"bg-gradient-to-b from-shell-from via-shell-via to-shell-to",
					"dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27]",
					// Shadow
					isButton
						? "shadow-button dark:shadow-button-dark"
						: isCard
							? "shadow-[0_6px_16px_rgba(15,23,42,0.15),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)]"
							: isTerminal
								? "shadow-shell-lg dark:shadow-shell-dark-lg"
								: "shadow-shell dark:shadow-shell-dark",
					sizeClasses[size],
					// Interactive states
					isButton &&
						"cursor-pointer transition-all duration-200 hover:shadow-button-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 dark:hover:shadow-button-dark-hover",
					isCard && "transition-all duration-300",
				)}
			>
				{/* Plastic Grain Texture */}
				{hasGrain && (
					<div
						className={cn(
							"plastic-grain pointer-events-none absolute inset-0",
							sizeClasses[size].split(" ")[0], // Get border-radius from size
						)}
					/>
				)}

				{/* Shell Highlight - Top reflection */}
				{hasHighlight && !isButton && (
					<div
						className={cn(
							"pointer-events-none absolute rounded-full bg-white/60 blur-md dark:bg-white/10",
							size === "sm" && "inset-x-4 top-1 h-3",
							size === "md" && "inset-x-5 top-1.5 h-4",
							size === "lg" && "inset-x-6 top-2 h-5",
							size === "xl" && "inset-x-6 top-2 h-5",
						)}
					/>
				)}

				{/* Bottom Lip Shadow */}
				{hasLip && !isButton && (
					<div
						className={cn(
							"pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/20 to-transparent dark:from-black/30",
							size === "sm" && "h-4 rounded-b-lg",
							size === "md" &&
								"h-6 rounded-b-xl sm:rounded-b-2xl",
							size === "lg" &&
								"h-8 rounded-b-2xl sm:rounded-b-[1.4rem]",
							size === "xl" &&
								"h-8 rounded-b-2xl sm:rounded-b-[1.6rem]",
						)}
					/>
				)}

				{/* Corner Screws */}
				{showScrews && (
					<>
						<PanelScrew position="top-left" size={screwSize} />
						<PanelScrew position="top-right" size={screwSize} />
						{!isPanel && (
							<>
								<PanelScrew
									position="bottom-left"
									size={screwSize}
								/>
								<PanelScrew
									position="bottom-right"
									size={screwSize}
								/>
							</>
						)}
					</>
				)}

				{/* Power LED (panel variant only) */}
				{powerLed && isPanel && (
					<div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
						<div className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.6),0_0_8px_rgba(52,211,153,0.3)] dark:bg-emerald-500 dark:shadow-[0_0_6px_rgba(52,211,153,0.8),0_0_12px_rgba(52,211,153,0.4)]" />
					</div>
				)}

				{/* Inner Bezel */}
				{hasInnerBezel ? (
					<div
						className={cn(
							// Inner bezel styling
							"relative border border-bezel-border dark:border-slate-600/70",
							"bg-gradient-to-b from-bezel-from to-bezel-to",
							"dark:from-[#212833] dark:to-[#131922]",
							"shadow-bezel dark:shadow-bezel-dark",
							innerSizeClasses[size],
							// Button variant has different inner styling
							isButton && "m-0 rounded-md border-slate-500/25",
							!isButton && "m-1 p-1 sm:m-1.5 sm:p-1.5",
							innerClassName,
						)}
					>
						{children}
					</div>
				) : (
					children
				)}

				{/* Bottom Title Strip (panel variant only) */}
				{showTitle && (
					<div className="mt-2 flex items-center justify-center gap-2 px-1">
						<div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/20 to-transparent dark:via-white/20" />
						<span className="rounded-full border border-black/15 bg-black/[0.04] px-3 py-0.5 text-[10px] tracking-[0.25em] text-black/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-white/15 dark:bg-white/[0.04] dark:text-white/45 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
							{title.toUpperCase()}
						</span>
						<div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/20 to-transparent dark:via-white/20" />
					</div>
				)}
			</div>
		</div>
	);
}

// ============================================================================
// Specialized Variants (Convenience Exports)
// ============================================================================

/**
 * Pre-configured Panel variant with screws, title, and optional power LED
 */
export function SkeuoPanel({
	children,
	className,
	title,
	screws = true,
	powerLed = false,
	size = "xl",
}: Omit<SkeuoShellProps, "variant" | "hasInnerBezel"> & {
	title: string;
}) {
	return (
		<SkeuoShell
			variant="panel"
			size={size}
			screws={screws}
			powerLed={powerLed}
			title={title}
			hasInnerBezel
			className={className}
		>
			{children}
		</SkeuoShell>
	);
}

/**
 * Pre-configured Button variant
 */
interface SkeuoButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	size?: "sm" | "md";
	variant?: "default" | "ghost";
}

export function SkeuoButton({
	children,
	className,
	size = "md",
	variant = "default",
	...props
}: SkeuoButtonProps) {
	return (
		<button
			className={cn(
				// Reset
				"relative inline-flex items-center justify-center",
				// Size
				size === "sm" && "h-7 gap-1 px-2 py-1 text-[10px]",
				size === "md" &&
					"h-8 gap-1.5 px-2.5 py-1.5 text-xs sm:h-9 sm:px-3 sm:py-2",
				// Base styling
				"overflow-hidden rounded-lg border border-shell-border dark:border-slate-500/70",
				"bg-gradient-to-b from-shell-from via-shell-via to-shell-to",
				"dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27]",
				variant === "default" &&
					"shadow-button dark:shadow-button-dark",
				// Interactive states
				"transition-all duration-200",
				variant === "default" &&
					"hover:shadow-button-hover dark:hover:shadow-button-dark-hover",
				"focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50",
				"active:shadow-[inset_0_1px_2px_rgba(15,23,42,0.15)]",
				className,
			)}
			{...props}
		>
			{/* Plastic grain */}
			<div className="plastic-grain pointer-events-none absolute inset-0 rounded-lg opacity-50" />

			{/* Inner bezel frame */}
			<div className="absolute inset-0.5 rounded-md border border-slate-500/25 bg-gradient-to-b from-bezel-from to-bezel-to shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] dark:border-slate-600/40 dark:from-[#2a313b] dark:to-[#1e242d] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" />

			{/* Content */}
			<span className="relative z-10 flex items-center gap-1 font-medium">
				{children}
			</span>
		</button>
	);
}

/**
 * Pre-configured Card variant with tilt support
 */
interface SkeuoCardProps {
	children: React.ReactNode;
	className?: string;
	isSelected?: boolean;
	isHovered?: boolean;
	isPressed?: boolean;
}

export function SkeuoCard({
	children,
	className,
	isSelected = false,
	isHovered = false,
	isPressed = false,
}: SkeuoCardProps) {
	return (
		<div
			className={cn(
				// Base card styling
				"relative overflow-hidden rounded-xl border border-slate-500/35 bg-gradient-to-b from-shell-from via-shell-via to-shell-to p-1.5",
				"shadow-[0_4px_12px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]",
				"dark:border-slate-500/60 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_6px_16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]",
				"transition-all duration-300",
				// States
				isSelected &&
					"border-violet-500/60 shadow-[0_4px_20px_rgba(139,92,246,0.3)]",
				isPressed &&
					"shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]",
				isHovered &&
					!isPressed &&
					"shadow-[0_8px_24px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]",
				className,
			)}
		>
			{/* Plastic grain - reduced opacity */}
			<div className="plastic-grain dark:opacity-8 pointer-events-none absolute inset-0 rounded-xl opacity-10" />

			{/* Content area with inner bezel */}
			<div
				className={cn(
					"relative flex h-full flex-col overflow-hidden rounded-lg border border-slate-500/35",
					"bg-gradient-to-b from-bezel-from to-bezel-to",
					"dark:border-slate-600/60 dark:from-[#202833] dark:to-[#141b24]",
					"p-2.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(15,23,42,0.15)]",
					"dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),inset_0_-2px_6px_rgba(0,0,0,0.5)]",
					"sm:rounded-xl sm:p-3 md:p-4",
				)}
			>
				{children}
			</div>
		</div>
	);
}

/**
 * Content area for inside shells/cards (simulates a screen/bezel interior)
 */
interface SkeuoContentProps {
	children: React.ReactNode;
	className?: string;
	/** Show screen effects (scanlines, curvature, glow) */
	hasScreenEffects?: boolean;
	/** Is this a dark screen area (for terminal/content) */
	isDark?: boolean;
}

export function SkeuoContent({
	children,
	className,
	hasScreenEffects = false,
	isDark = false,
}: SkeuoContentProps) {
	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-lg",
				isDark
					? "border border-slate-700/40 bg-[#060606] dark:border-white/15"
					: "border border-slate-500/35 bg-gradient-to-b from-bezel-from to-bezel-to dark:border-slate-600/60 dark:from-[#202833] dark:to-[#141b24]",
				"p-2.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(15,23,42,0.15)]",
				"dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),inset_0_-2px_6px_rgba(0,0,0,0.5)]",
				"sm:rounded-xl sm:p-3",
				className,
			)}
		>
			{/* Screen effects */}
			{hasScreenEffects && (
				<>
					{/* Screen curvature */}
					<div className="pointer-events-none absolute inset-0 z-10 rounded-lg shadow-[inset_0_0_95px_rgba(0,0,0,0.14),inset_0_0_30px_rgba(255,255,255,0.12)] dark:shadow-[inset_0_0_110px_rgba(0,0,0,0.9),inset_0_0_40px_rgba(58,58,58,0.25)]" />

					{/* Top highlight */}
					<div className="pointer-events-none absolute inset-x-10 top-2 z-10 h-10 rounded-full bg-white/35 blur-md dark:bg-cyan-100/5" />

					{/* Scanlines */}
					<div
						className="pointer-events-none absolute inset-0 z-10 opacity-[0.03] dark:opacity-[0.08]"
						style={{
							backgroundImage:
								"repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 6px)",
						}}
					/>

					{/* Screen glow */}
					<div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-purple-500/[0.04] via-transparent to-cyan-500/[0.04] dark:from-purple-500/10 dark:to-cyan-500/10" />
				</>
			)}

			{/* Content */}
			<div className="relative z-[5]">{children}</div>
		</div>
	);
}
