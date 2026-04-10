"use client";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { DesktopIconRow } from "./DesktopIconRow";
import { MobileIconRoll } from "./MobileIconRoll";
import { FeaturedPapers } from "./FeaturedPapers";
import { siteConfig } from "@/config";
import { useIconRow } from "@/context/IconRowContext";

interface HeroSectionProps {
	macPosition: "center" | "top";
	onOrbitingImageClick?: (imageAlt: string) => void;
	onMacClick?: () => void;
	onMacDoubleClick?: () => void;
	onTerminalClick?: () => void;
}

/**
 * HeroSection with rAF throttled parallax for performance
 *
 * Optimizations:
 * - Uses requestAnimationFrame to throttle scroll updates
 * - Cleanup event listeners on unmount
 * - Passive event listeners for better scroll performance
 */
const HeroSection = ({
	macPosition,
	onOrbitingImageClick,
	onMacClick,
	onMacDoubleClick,
	onTerminalClick,
}: HeroSectionProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [parallaxOffset, setParallaxOffset] = useState(0);
	const { isVisible } = useIconRow();

	// Use refs for throttling
	const scrollYRef = useRef(0);
	const rafRef = useRef<number | null>(null);
	const isUpdatingRef = useRef(false);

	// Throttled scroll handler using requestAnimationFrame
	const updateParallax = useCallback(() => {
		const scrollY = scrollYRef.current;
		setParallaxOffset(scrollY * 0.3);
		isUpdatingRef.current = false;
	}, []);

	const handleScroll = useCallback(() => {
		scrollYRef.current = window.scrollY;

		// Only request animation frame if not already pending
		if (!isUpdatingRef.current) {
			isUpdatingRef.current = true;
			rafRef.current = requestAnimationFrame(updateParallax);
		}
	}, [updateParallax]);

	useEffect(() => {
		// Set initial position
		scrollYRef.current = window.scrollY;
		updateParallax();

		// Add scroll listener with passive option for better performance
		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);

			// Cancel any pending animation frame
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, [handleScroll, updateParallax]);

	return (
		<div ref={containerRef} className="relative w-full px-2 py-6">
			<div className="relative z-10">
				<div
					className="relative mx-auto max-w-[14rem] transition-transform duration-100"
					style={{
						transform: `translateY(${parallaxOffset * 0.2}px)`,
					}}
				>
					<button
						onClick={onMacClick}
						onDoubleClick={onMacDoubleClick}
						className="cursor-pointer rounded-lg border-0 bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
						aria-label="Open terminal"
					>
						<Image
							src={siteConfig.centralImage.src}
							alt={siteConfig.centralImage.alt}
							width={siteConfig.centralImage.width}
							height={siteConfig.centralImage.height}
							className="w-full"
							priority
						/>
					</button>
				</div>
			</div>

			<div
				className="flex flex-col items-center gap-4 transition-transform duration-100 sm:gap-6"
				style={{ transform: `translateY(${parallaxOffset * -0.1}px)` }}
			>
				<FeaturedPapers />
				<div
					className={`overflow-hidden transition-all duration-500 ease-in-out ${
						isVisible ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
					}`}
				>
					<DesktopIconRow
						onImageClick={onOrbitingImageClick}
						onTerminalClick={onTerminalClick}
					/>
				</div>
			</div>

			<div
				className={`overflow-hidden transition-all duration-500 ease-in-out ${
					isVisible ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
				}`}
				style={{ transform: `translateY(${parallaxOffset * -0.1}px)` }}
			>
				<MobileIconRoll
					onImageClick={onOrbitingImageClick}
					onTerminalClick={onTerminalClick}
				/>
			</div>

			{macPosition === "top" && (
				<div className="mx-auto max-w-[400px] space-y-2 text-center text-lg md:text-xl lg:text-xl"></div>
			)}
		</div>
	);
};

export default HeroSection;
