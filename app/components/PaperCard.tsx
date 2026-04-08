"use client";

import { useState, useRef, useCallback } from "react";
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
	const [transform, setTransform] = useState("");
	const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
	const cardRef = useRef<HTMLDivElement>(null);

	// Random slight rotation for scattered paper effect (-3 to +3 degrees)
	const baseRotation = useRef(((index % 7) - 3) * 0.8);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!cardRef.current) return;

			const rect = cardRef.current.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;

			const mouseX = e.clientX - centerX;
			const mouseY = e.clientY - centerY;

			const rotateX = (mouseY / (rect.height / 2)) * -8;
			const rotateY = (mouseX / (rect.width / 2)) * 8;

			setTransform(
				`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05) rotate(${baseRotation.current}deg)`,
			);

			const glareX = ((e.clientX - rect.left) / rect.width) * 100;
			const glareY = ((e.clientY - rect.top) / rect.height) * 100;
			setGlarePosition({ x: glareX, y: glareY });
		},
		[],
	);

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
		setTransform(
			`perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) rotate(${baseRotation.current}deg)`,
		);
	};

	// Get venue badge color
	const getVenueColor = (venue: string) => {
		const venueColors: Record<string, string> = {
			NeurIPS:
				"bg-amber-500/20 text-amber-700 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300",
			ICML: "bg-blue-500/20 text-blue-700 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-300",
			ICLR: "bg-purple-500/20 text-purple-700 border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-300",
			Nature: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300",
			Science:
				"bg-red-500/20 text-red-700 border-red-500/30 dark:bg-red-500/20 dark:text-red-300",
			arXiv: "bg-slate-500/20 text-slate-700 border-slate-500/30 dark:bg-slate-500/20 dark:text-slate-300",
		};
		return (
			venueColors[venue] ||
			"bg-violet-500/20 text-violet-700 border-violet-500/30 dark:bg-violet-500/20 dark:text-violet-300"
		);
	};

	return (
		<div
			ref={cardRef}
			className="paper-card-wrapper relative cursor-pointer touch-manipulation"
			style={{
				transform:
					transform ||
					`perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) rotate(${baseRotation.current}deg)`,
				transformStyle: "preserve-3d",
				transition: isHovered
					? "transform 0.15s ease-out"
					: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
				zIndex: isHovered ? 10 : 1,
			}}
			onMouseMove={handleMouseMove}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
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
			{/* Paper Card - Skeuomorphic like ResourceGrid */}
			<div
				className={`paper-card relative overflow-hidden rounded-xl border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-2 shadow-[0_8px_20px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300 dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_10px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] ${
					isSelected
						? "border-violet-500/70 shadow-[0_8px_30px_rgba(139,92,246,0.4)]"
						: ""
				} ${
					isHovered
						? "shadow-[0_12px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
						: ""
				}`}
			>
				{/* Plastic grain */}
				<div className="plastic-grain pointer-events-none absolute inset-0 rounded-xl" />

				{/* Content area - Styled like ResourceGrid image container */}
				<div className="relative flex h-full flex-col overflow-hidden rounded-lg border border-slate-500/45 bg-gradient-to-b from-[#e8edf3] to-[#b9c4d1] p-4 shadow-[inset_0_2px_2px_rgba(255,255,255,0.65),inset_0_-3px_6px_rgba(15,23,42,0.22)] dark:border-slate-600/70 dark:from-[#202833] dark:to-[#141b24] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-4px_9px_rgba(0,0,0,0.65)] sm:p-6 md:p-8">
					{/* Paper fiber effect */}
					<div
						className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
						}}
					/>

					{/* Venue badge */}
					<div className="mb-3 flex items-center justify-between sm:mb-4 md:mb-6">
						<span
							className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold tracking-wider sm:px-3 sm:py-1 md:px-4 md:py-1.5 ${getVenueColor(paper.venue)}`}
						>
							{paper.venue}
						</span>
						<span className="font-mono text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
							{paper.year}
						</span>
					</div>

					{/* Title */}
					<h3 className="mb-2 line-clamp-4 text-sm font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-base">
						{paper.title}
					</h3>

					{/* Authors */}
					<p className="mb-auto line-clamp-3 text-xs italic text-slate-600 dark:text-slate-400">
						{paper.authors.slice(0, 2).join(", ")}
						{paper.authors.length > 2 && " et al."}
					</p>

					{/* Category indicator */}
					<div className="mt-3 flex items-center gap-2 sm:mt-4">
						<div className="h-2 w-2 rounded-full bg-violet-500" />
						<span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
							{paper.category}
						</span>
					</div>

					{/* URL Link Section - Skeuomorphic Button */}
					<div className="mt-auto pt-3">
						{paper.url ? (
							<a
								href={paper.url}
								target="_blank"
								rel="noopener noreferrer"
								onClick={(e) => e.stopPropagation()}
								className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] px-3 py-2 shadow-[0_2px_6px_rgba(15,23,42,0.15),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(71,85,105,0.15)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(15,23,42,0.2),inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(71,85,105,0.2)] active:shadow-[inset_0_2px_4px_rgba(15,23,42,0.15)] dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_3px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-2px_4px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-2px_4px_rgba(0,0,0,0.35)]"
							>
								{/* Plastic grain texture */}
								<div className="plastic-grain pointer-events-none absolute inset-0 rounded-lg" />
								{/* Inner bezel */}
								<div className="absolute inset-1 rounded-md border border-slate-500/25 bg-gradient-to-b from-[#e8edf3] to-[#c8d0db] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] dark:border-slate-600/40 dark:from-[#2a313b] dark:to-[#1e242d] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" />
								{/* Content */}
								<span className="relative z-10 flex items-center gap-1.5 font-mono text-[10px] font-semibold text-slate-500 transition-colors group-hover:text-violet-600 dark:text-slate-400 dark:group-hover:text-violet-400">
									<svg
										className="h-3.5 w-3.5"
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
							<div className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg border border-slate-400/35 bg-gradient-to-b from-[#e8edf3] to-[#c8d0db] px-3 py-2 opacity-70 shadow-[0_2px_6px_rgba(15,23,42,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-slate-600/40 dark:from-[#2a313b] dark:to-[#1e242d] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]">
								{/* Plastic grain texture */}
								<div className="plastic-grain pointer-events-none absolute inset-0 rounded-lg" />
								<span className="relative z-10 flex items-center gap-1.5 font-mono text-[10px] font-semibold text-slate-400 dark:text-slate-500">
									<svg
										className="h-3.5 w-3.5"
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
						<div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
					)}
				</div>

				{/* Glare effect on hover */}
				{isHovered && (
					<div
						className="pointer-events-none absolute inset-0"
						style={{
							background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.25) 0%, transparent 60%)`,
							transition: "background 0.1s ease-out",
						}}
					/>
				)}

				{/* Corner fold effect */}
				<div className="pointer-events-none absolute bottom-0 right-0 h-6 w-6 overflow-hidden">
					<div
						className="absolute bottom-0 right-0 h-[85%] w-[85%] bg-gradient-to-tl from-slate-300/40 to-transparent dark:from-slate-700/40"
						style={{
							clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
						}}
					/>
				</div>
			</div>
		</div>
	);
}
