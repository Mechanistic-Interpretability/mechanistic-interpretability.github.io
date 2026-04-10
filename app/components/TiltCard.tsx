"use client";

import { useRef, useState, useCallback, useEffect, ReactNode } from "react";

interface TiltCardProps {
	children: ReactNode;
	className?: string;
	tiltAmount?: number;
	glareEnabled?: boolean;
	scale?: number;
	/** Index for scattered rotation effect (-3 to +3 degrees) */
	scatterIndex?: number;
	/** Disable tilt on touch devices */
	disableOnTouch?: boolean;
	/** Called when card is clicked */
	onClick?: () => void;
	/** Card is in pressed state (for touch feedback) */
	isPressed?: boolean;
}

/**
 * Enhanced TiltCard - Single source for 3D tilt + glare effects
 *
 * Replaces tilt logic previously duplicated in:
 * - PaperCard.tsx
 * - FeaturedPapers.tsx (PaperCard component)
 * - FeaturedPapers.tsx (ResourceCard component)
 *
 * Features:
 * - 3D tilt on hover
 * - Glare effect
 * - Touch device detection
 * - Optional scattered rotation
 * - Smooth transitions
 */
export function TiltCard({
	children,
	className = "",
	tiltAmount = 10,
	glareEnabled = true,
	scale = 1.02,
	scatterIndex,
	disableOnTouch = true,
	onClick,
	isPressed = false,
}: TiltCardProps) {
	const cardRef = useRef<HTMLDivElement>(null);
	const [transform, setTransform] = useState("");
	const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
	const [isHovered, setIsHovered] = useState(false);
	const [isTouchDevice, setIsTouchDevice] = useState(false);
	const rafRef = useRef<number | null>(null);
	const mousePositionRef = useRef({ x: 0, y: 0 });

	// Calculate scattered rotation based on index
	const baseRotation = useRef(
		scatterIndex !== undefined ? ((scatterIndex % 7) - 3) * 0.8 : 0,
	);

	// Detect touch device on mount
	useEffect(() => {
		const isTouch =
			"ontouchstart" in window || navigator.maxTouchPoints > 0;
		setIsTouchDevice(isTouch && disableOnTouch);
	}, [disableOnTouch]);

	// Throttled mouse move handler using requestAnimationFrame
	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!cardRef.current || isTouchDevice) return;

			// Store mouse position
			mousePositionRef.current = { x: e.clientX, y: e.clientY };

			// Cancel any pending frame
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}

			// Schedule update on next frame
			rafRef.current = requestAnimationFrame(() => {
				if (!cardRef.current) return;

				const rect = cardRef.current.getBoundingClientRect();
				const centerX = rect.left + rect.width / 2;
				const centerY = rect.top + rect.height / 2;

				const mouseX = mousePositionRef.current.x - centerX;
				const mouseY = mousePositionRef.current.y - centerY;

				const rotateX = (mouseY / (rect.height / 2)) * -tiltAmount;
				const rotateY = (mouseX / (rect.width / 2)) * tiltAmount;

				setTransform(
					`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale}) rotate(${baseRotation.current}deg)`,
				);

				// Calculate glare position
				const glareX =
					((mousePositionRef.current.x - rect.left) / rect.width) *
					100;
				const glareY =
					((mousePositionRef.current.y - rect.top) / rect.height) *
					100;
				setGlarePosition({ x: glareX, y: glareY });
			});
		},
		[tiltAmount, scale, isTouchDevice],
	);

	const handleMouseEnter = useCallback(() => {
		if (!isTouchDevice) {
			setIsHovered(true);
		}
	}, [isTouchDevice]);

	const handleMouseLeave = useCallback(() => {
		setIsHovered(false);
		// Cancel any pending animation frame
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}
		setTransform(
			`perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) rotate(${baseRotation.current}deg)`,
		);
	}, []);

	// Handle click
	const handleClick = useCallback(() => {
		onClick?.();
	}, [onClick]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, []);

	// Determine final transform based on state
	const finalTransform = isTouchDevice
		? `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(${isPressed ? 0.98 : 1}, ${isPressed ? 0.98 : 1}, 1) rotate(${baseRotation.current}deg)`
		: transform ||
			`perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) rotate(${baseRotation.current}deg)`;

	return (
		<div
			ref={cardRef}
			className={`relative cursor-pointer touch-manipulation ${className}`}
			style={{
				transform: finalTransform,
				transformStyle: "preserve-3d",
				transition: isHovered
					? "transform 0.1s ease-out"
					: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
				zIndex: isHovered ? 10 : 1,
			}}
			onMouseMove={handleMouseMove}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onClick={handleClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					handleClick();
				}
			}}
			role={onClick ? "button" : undefined}
			tabIndex={onClick ? 0 : undefined}
		>
			{children}
			{glareEnabled && isHovered && !isTouchDevice && (
				<div
					className="pointer-events-none absolute inset-0"
					style={{
						background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.2) 0%, transparent 60%)`,
						transition: "background 0.1s ease-out",
						borderRadius: "inherit",
					}}
				/>
			)}
		</div>
	);
}
