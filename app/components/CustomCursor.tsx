"use client";

import { useEffect, useState, useCallback } from "react";

interface CursorPosition {
	x: number;
	y: number;
}

export function CustomCursor() {
	const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
	const [isHovering, setIsHovering] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [cursorColor, setCursorColor] = useState("rgba(59, 130, 246, 0.5)");

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			setPosition({ x: e.clientX, y: e.clientY });
			if (!isVisible) setIsVisible(true);
		},
		[isVisible],
	);

	const handleMouseEnter = useCallback(() => {
		setIsVisible(true);
	}, []);

	const handleMouseLeave = useCallback(() => {
		setIsVisible(false);
	}, []);

	useEffect(() => {
		// Only show custom cursor on desktop
		if (window.matchMedia("(pointer: coarse)").matches) {
			return;
		}

		window.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseenter", handleMouseEnter);
		document.addEventListener("mouseleave", handleMouseLeave);

		// Track hoverable elements
		const handleElementHover = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const isClickable =
				target.tagName === "A" ||
				target.tagName === "BUTTON" ||
				target.closest("a") ||
				target.closest("button") ||
				target.classList.contains("cursor-pointer") ||
				target.closest("[role='button']");

			if (isClickable) {
				setIsHovering(true);
				// Change color based on context
				if (target.closest("[data-cursor-accent='purple']")) {
					setCursorColor("rgba(139, 92, 246, 0.6)");
				} else if (target.closest("[data-cursor-accent='cyan']")) {
					setCursorColor("rgba(6, 182, 212, 0.6)");
				} else {
					setCursorColor("rgba(59, 130, 246, 0.5)");
				}
			} else {
				setIsHovering(false);
				setCursorColor("rgba(59, 130, 246, 0.5)");
			}
		};

		document.addEventListener("mouseover", handleElementHover);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseenter", handleMouseEnter);
			document.removeEventListener("mouseleave", handleMouseLeave);
			document.removeEventListener("mouseover", handleElementHover);
		};
	}, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

	// Don't render on touch devices
	if (
		typeof window !== "undefined" &&
		window.matchMedia("(pointer: coarse)").matches
	) {
		return null;
	}

	return (
		<>
			{/* Main cursor dot */}
			<div
				className="pointer-events-none fixed z-[9999] mix-blend-difference"
				style={{
					left: position.x,
					top: position.y,
					transform: "translate(-50%, -50%)",
					width: isHovering ? "40px" : "12px",
					height: isHovering ? "40px" : "12px",
					backgroundColor: isHovering ? cursorColor : "white",
					borderRadius: "50%",
					opacity: isVisible ? 1 : 0,
					transition:
						"width 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease, opacity 0.2s ease",
				}}
			/>
			{/* Trailing cursor */}
			<div
				className="pointer-events-none fixed z-[9998]"
				style={{
					left: position.x,
					top: position.y,
					transform: "translate(-50%, -50%)",
					width: isHovering ? "60px" : "24px",
					height: isHovering ? "60px" : "24px",
					border: `2px solid ${cursorColor}`,
					borderRadius: "50%",
					opacity: isVisible ? 0.5 : 0,
					transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
				}}
			/>
			<style jsx global>{`
				@media (pointer: fine) {
					* {
						cursor: none !important;
					}
				}
			`}</style>
		</>
	);
}
