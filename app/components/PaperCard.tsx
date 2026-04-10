"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { Paper } from "@/lib/papers";

interface PaperCardProps {
	paper: Paper;
	isSelected: boolean;
	onClick: () => void;
	index: number;
}

export function PaperCard({
	paper,
	isSelected,
	onClick,
	index,
}: PaperCardProps) {
	const [isHovered, setIsHovered] = useState(false);
	const [isPressed, setIsPressed] = useState(false);
	const [transform, setTransform] = useState("");
	const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
	const cardRef = useRef<HTMLDivElement>(null);

	// Random slight rotation for scattered paper effect (-3 to +3 degrees)
	const baseRotation = useRef(((index % 7) - 3) * 0.8);

	// Detect touch device
	const [isTouchDevice, setIsTouchDevice] = useState(false);

	useEffect(() => {
		setIsTouchDevice(
			"ontouchstart" in window || navigator.maxTouchPoints > 0,
		);
	}, []);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!cardRef.current || isTouchDevice) return;

			const rect = cardRef.current.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;

			const mouseX = e.clientX - centerX;
			const mouseY = e.clientY - centerY;

			const rotateX = (mouseY / (rect.height / 2)) * -8;
			const rotateY = (mouseX / (rect.width / 2)) * 8;

			setTransform(
				`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02) rotate(${baseRotation.current}deg)`,
			);

			const glareX = ((e.clientX - rect.left) / rect.width) * 100;
			const glareY = ((e.clientY - rect.top) / rect.height) * 100;
			setGlarePosition({ x: glareX, y: glareY });
		},
		[isTouchDevice],
	);

	const handleTouchStart = useCallback(() => {
		setIsPressed(true);
	}, []);

	const handleTouchEnd = useCallback(() => {
		setIsPressed(false);
	}, []);

	const handleMouseEnter = () => {
		if (!isTouchDevice) {
			setIsHovered(true);
		}
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
		setIsPressed(false);
		setTransform(
			`perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) rotate(${baseRotation.current}deg)`,
		);
	};

	// Get venue badge color
	const getVenueColor = (venue: string) => {
		const venueColors: Record<string, string> = {
			NeurIPS:
				"bg-amber-500/15 text-amber-700 border-amber-500/25 dark:bg-amber-500/15 dark:text-amber-300",
			ICML: "bg-blue-500/15 text-blue-700 border-blue-500/25 dark:bg-blue-500/15 dark:text-blue-300",
			ICLR: "bg-purple-500/15 text-purple-700 border-purple-500/25 dark:bg-purple-500/15 dark:text-purple-300",
			Nature: "bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:bg-emerald-500/15 dark:text-emerald-300",
			Science:
				"bg-red-500/15 text-red-700 border-red-500/25 dark:bg-red-500/15 dark:text-red-300",
			arXiv: "bg-slate-500/15 text-slate-700 border-slate-500/25 dark:bg-slate-500/15 dark:text-slate-300",
		};
		return (
			venueColors[venue] ||
			"bg-violet-500/15 text-violet-700 border-violet-500/25 dark:bg-violet-500/15 dark:text-violet-300"
		);
	};

	// Mobile-optimized transform - reduce or disable 3D effects
	const mobileTransform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(${isPressed ? 0.98 : 1}, ${isPressed ? 0.98 : 1}, 1) rotate(${baseRotation.current}deg)`;

	return (
		<div
			ref={cardRef}
			className="paper-card-wrapper relative cursor-pointer touch-manipulation"
			style={{
				transform: transform || mobileTransform,
				transformStyle: "preserve-3d",
				transition: isHovered
					? "transform 0.1s ease-out"
					: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
				zIndex: isHovered ? 10 : 1,
			}}
			onMouseMove={handleMouseMove}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
			onClick={onClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick();
				}
			}}
			role="button"
			tabIndex={0}
			aria-pressed={isSelected}
		>
			{/* Paper Card - Mobile-optimized */}
			<div
				className={`paper-card relative overflow-hidden rounded-xl border border-slate-500/35 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-1.5 shadow-[0_4px_12px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300 dark:border-slate-500/60 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_6px_16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] ${
					isSelected
						? "border-violet-500/60 shadow-[0_4px_20px_rgba(139,92,246,0.3)]"
						: ""
				} ${
					isPressed
						? "shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
						: isHovered
							? "shadow-[0_8px_24px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
							: ""
				}`}
			>
				{/* Plastic grain - reduced opacity on mobile */}
				<div className="plastic-grain dark:opacity-8 pointer-events-none absolute inset-0 rounded-xl opacity-10" />

				{/* Content area - Mobile optimized with better touch targets */}
				<div className="relative flex h-full flex-col overflow-hidden rounded-lg border border-slate-500/35 bg-gradient-to-b from-[#e8edf3] to-[#b9c4d1] p-2.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(15,23,42,0.15)] dark:border-slate-600/60 dark:from-[#202833] dark:to-[#141b24] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),inset_0_-2px_6px_rgba(0,0,0,0.5)] sm:p-3 md:p-4">
					{/* Paper fiber effect */}
					<div
						className="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
						}}
					/>

					{/* Venue badge - compact for mobile */}
					<div className="mb-1.5 flex items-center justify-between sm:mb-2">
						<span
							className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider sm:text-xs ${getVenueColor(paper.venue)}`}
						>
							{paper.venue}
						</span>
						<span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
							{paper.year}
						</span>
					</div>

					{/* Title - reduced line clamp for mobile */}
					<h3 className="mb-1 line-clamp-3 text-sm font-bold leading-tight text-slate-900 dark:text-slate-100 sm:mb-1.5 sm:text-base">
						{paper.title}
					</h3>

					{/* Authors - more compact */}
					<p className="mb-auto line-clamp-2 text-[11px] italic text-slate-600 dark:text-slate-400 sm:text-xs">
						{paper.authors.slice(0, 2).join(", ")}
						{paper.authors.length > 2 && " et al."}
					</p>

					{/* Category indicator - compact */}
					<div className="mt-1.5 flex items-center gap-1.5 sm:mt-2">
						<div className="h-1.5 w-1.5 rounded-full bg-violet-500 sm:h-2 sm:w-2" />
						<span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
							{paper.category}
						</span>
					</div>

					{/* URL Link Section - Mobile optimized button with better touch target */}
					<div className="mt-auto pt-1.5 sm:pt-2">
						{paper.url ? (
							<a
								href={paper.url}
								target="_blank"
								rel="noopener noreferrer"
								onClick={(e) => e.stopPropagation()}
								className="group relative inline-flex min-h-[36px] items-center gap-1.5 overflow-hidden rounded-lg border border-slate-500/35 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] px-2.5 py-1.5 shadow-[0_1px_4px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(71,85,105,0.12)] transition-all duration-200 hover:shadow-[0_2px_8px_rgba(15,23,42,0.15),inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_2px_rgba(71,85,105,0.15)] active:shadow-[inset_0_1px_2px_rgba(15,23,42,0.12)] dark:border-slate-500/60 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_2px_6px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.25)] dark:hover:shadow-[0_3px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.3)]"
							>
								{/* Plastic grain texture */}
								<div className="plastic-grain pointer-events-none absolute inset-0 rounded-lg opacity-10" />
								{/* Inner bezel */}
								<div className="absolute inset-0.5 rounded-md border border-slate-500/20 bg-gradient-to-b from-[#e8edf3] to-[#c8d0db] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] dark:border-slate-600/35 dark:from-[#2a313b] dark:to-[#1e242d] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]" />
								{/* Content */}
								<span className="relative z-10 flex items-center gap-1 font-mono text-[10px] font-semibold text-slate-500 transition-colors group-hover:text-violet-600 dark:text-slate-400 dark:group-hover:text-violet-400 sm:text-xs">
									<svg
										className="h-3 w-3 sm:h-3.5 sm:w-3.5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
										/>
									</svg>
									<span className="truncate">Link</span>
								</span>
							</a>
						) : (
							<div className="group relative inline-flex min-h-[36px] items-center gap-1.5 overflow-hidden rounded-lg border border-slate-400/25 bg-gradient-to-b from-[#e8edf3] to-[#c8d0db] px-2.5 py-1.5 opacity-70 shadow-[0_1px_4px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.7)] dark:border-slate-600/35 dark:from-[#2a313b] dark:to-[#1e242d] dark:shadow-[0_1px_4px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.04)]">
								{/* Plastic grain texture */}
								<div className="plastic-grain pointer-events-none absolute inset-0 rounded-lg opacity-10" />
								<span className="relative z-10 flex items-center gap-1 font-mono text-[10px] font-semibold text-slate-400 dark:text-slate-500 sm:text-xs">
									<svg
										className="h-3 w-3 sm:h-3.5 sm:w-3.5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<span>No URL</span>
								</span>
							</div>
						)}
					</div>

					{/* Selected indicator */}
					{isSelected && (
						<div className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-violet-500 shadow-[0_0_6px_rgba(139,92,246,0.6)] sm:right-2 sm:top-2 sm:h-2 sm:w-2" />
					)}
				</div>

				{/* Glare effect on hover - disabled on touch */}
				{isHovered && !isTouchDevice && (
					<div
						className="pointer-events-none absolute inset-0"
						style={{
							background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.2) 0%, transparent 60%)`,
							transition: "background 0.1s ease-out",
						}}
					/>
				)}

				{/* Corner fold effect - smaller on mobile */}
				<div className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 overflow-hidden sm:h-5 sm:w-5">
					<div
						className="absolute bottom-0 right-0 h-[80%] w-[80%] bg-gradient-to-tl from-slate-300/30 to-transparent dark:from-slate-700/30"
						style={{
							clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
						}}
					/>
				</div>
			</div>
		</div>
	);
}
