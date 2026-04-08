"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useCallback } from "react";
import { papers } from "@/lib/papers";

interface FeaturedPapersProps {
	limit?: number;
}

export function FeaturedPapers({ limit = 3 }: FeaturedPapersProps) {
	const router = useRouter();

	// Get papers sorted by date (most recent first), limited to specified count
	const featuredPapers = papers
		.sort((a, b) => {
			// Sort by date if available, otherwise fall back to order
			const dateA = a.date ? new Date(a.date).getTime() : 0;
			const dateB = b.date ? new Date(b.date).getTime() : 0;
			if (dateA && dateB) {
				return dateB - dateA; // Most recent first
			}
			// Fall back to order if no dates
			return (b.order || 0) - (a.order || 0);
		})
		.slice(0, limit);

	const handleViewAll = () => {
		router.push("/hub");
	};

	// Get venue badge color - same as PaperCard
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
		<div className="relative w-full max-w-md px-4 sm:max-w-lg md:max-w-md lg:max-w-lg">
			{/* Skeuomorphic Shell Container - same as hub */}
			<div className="relative overflow-hidden rounded-xl border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-1 shadow-[0_12px_28px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-6px_12px_rgba(71,85,105,0.25)] dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_16px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-6px_14px_rgba(0,0,0,0.5)] sm:rounded-2xl sm:p-1.5">
				{/* Plastic grain */}
				<div className="plastic-grain pointer-events-none absolute inset-0 rounded-xl sm:rounded-2xl" />
				{/* Shell highlight */}
				<div className="pointer-events-none absolute inset-x-6 top-1 h-4 rounded-full bg-white/50 blur-md dark:bg-white/10" />

				{/* Inner bezel - same as hub */}
				<div className="relative overflow-hidden rounded-lg border border-slate-500/45 bg-gradient-to-b from-[#e8edf3] to-[#b9c4d1] shadow-[inset_0_2px_2px_rgba(255,255,255,0.65),inset_0_-3px_6px_rgba(15,23,42,0.22)] dark:border-slate-600/70 dark:from-[#202833] dark:to-[#141b24] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-4px_9px_rgba(0,0,0,0.65)] sm:rounded-xl">
					{/* Content area */}
					<div className="relative bg-[#edf2f8] p-2 dark:bg-[#0a0a0a] sm:p-3">
						{/* Screen curvature */}
						<div className="pointer-events-none absolute inset-0 z-10 rounded-lg shadow-[inset_0_0_40px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_0_50px_rgba(0,0,0,0.6)] sm:rounded-xl" />

						{/* Header */}
						<div className="mb-2 flex items-center justify-between border-b border-slate-400/30 px-2 py-2 dark:border-slate-600/30 sm:mb-3 sm:px-3 sm:py-2.5">
							<div className="flex items-center gap-2 sm:gap-3">
								{/* Icon container - hub style */}
								<div className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-500/45 bg-gradient-to-b from-[#eef3f9] to-[#c3cdda] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_3px_rgba(15,23,42,0.2)] dark:border-slate-600/70 dark:from-[#252d38] dark:to-[#151b24] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_8px_rgba(0,0,0,0.4)] sm:h-8 sm:w-8 sm:rounded-lg">
									<svg
										className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300 sm:h-4 sm:w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
								</div>
								<span className="text-sm font-bold text-slate-900 dark:text-slate-100 sm:text-base">
									Featured
								</span>
							</div>
							{/* Skeuomorphic View all button - hub style */}
							<button
								onClick={handleViewAll}
								className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-lg border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] px-2.5 py-1.5 shadow-[0_2px_6px_rgba(15,23,42,0.15),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(71,85,105,0.15)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(15,23,42,0.2),inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(71,85,105,0.2)] active:shadow-[inset_0_2px_4px_rgba(15,23,42,0.15)] dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_3px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-2px_4px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-2px_4px_rgba(0,0,0,0.35)] sm:gap-2 sm:px-3 sm:py-2"
							>
								{/* Plastic grain texture */}
								<div className="plastic-grain pointer-events-none absolute inset-0 rounded-lg opacity-50" />
								{/* Inner bezel */}
								<div className="absolute inset-1 rounded-md border border-slate-500/25 bg-gradient-to-b from-[#e8edf3] to-[#c8d0db] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] dark:border-slate-600/40 dark:from-[#2a313b] dark:to-[#1e242d] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" />
								{/* Content */}
								<span className="relative z-10 flex items-center gap-1 text-[10px] font-semibold text-slate-600 transition-colors group-hover:text-violet-600 dark:text-slate-300 dark:group-hover:text-violet-400 sm:text-xs">
									<span>View all</span>
									<svg
										className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</span>
							</button>
						</div>

						{/* Papers Cards */}
						<div className="space-y-2 sm:space-y-3">
							{featuredPapers.map((paper, index) => (
								<FeaturedCard
									key={paper._meta.path}
									paper={paper}
									index={index}
									getVenueColor={getVenueColor}
									onClick={() => router.push(`/hub`)}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// Individual card component with 3D tilt effect
interface FeaturedCardProps {
	paper: (typeof papers)[0];
	index: number;
	getVenueColor: (venue: string) => string;
	onClick: () => void;
}

function FeaturedCard({
	paper,
	index,
	getVenueColor,
	onClick,
}: FeaturedCardProps) {
	const [isHovered, setIsHovered] = useState(false);
	const [transform, setTransform] = useState("");
	const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
	const cardRef = useRef<HTMLDivElement>(null);

	// Random slight rotation for scattered effect (-2 to +2 degrees)
	const baseRotation = useRef(((index % 5) - 2) * 0.6);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!cardRef.current) return;

			const rect = cardRef.current.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;

			const mouseX = e.clientX - centerX;
			const mouseY = e.clientY - centerY;

			const rotateX = (mouseY / (rect.height / 2)) * -6;
			const rotateY = (mouseX / (rect.width / 2)) * 6;

			setTransform(
				`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02) rotate(${baseRotation.current}deg)`,
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
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick();
				}
			}}
		>
			{/* Paper Card - Same skeuomorphic style as hub */}
			<div
				className={`relative overflow-hidden rounded-lg border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-1.5 shadow-[0_6px_16px_rgba(15,23,42,0.15),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300 dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_8px_20px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)] sm:rounded-xl sm:p-2 ${
					isHovered
						? "shadow-[0_10px_28px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_28px_rgba(0,0,0,0.55)]"
						: ""
				}`}
			>
				{/* Plastic grain */}
				<div className="plastic-grain pointer-events-none absolute inset-0 rounded-lg sm:rounded-xl" />

				{/* Content area - same as hub inner bezel */}
				<div className="relative flex flex-col gap-2 overflow-hidden rounded-md border border-slate-500/45 bg-gradient-to-b from-[#e8edf3] to-[#b9c4d1] p-2.5 shadow-[inset_0_2px_2px_rgba(255,255,255,0.65),inset_0_-3px_6px_rgba(15,23,42,0.22)] dark:border-slate-600/70 dark:from-[#202833] dark:to-[#141b24] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-4px_9px_rgba(0,0,0,0.65)] sm:gap-3 sm:rounded-lg sm:p-3 md:p-4">
					{/* Paper fiber effect */}
					<div
						className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
						}}
					/>

					{/* Top row: Venue badge & Year */}
					<div className="flex items-center justify-between">
						<span
							className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-bold tracking-wider sm:px-2 sm:py-1 sm:text-xs ${getVenueColor(
								paper.venue,
							)}`}
						>
							{paper.venue}
						</span>
						<span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
							{paper.year}
						</span>
					</div>

					{/* Title */}
					<h3 className="line-clamp-2 text-xs font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-sm">
						{paper.title}
					</h3>

					{/* Authors */}
					<p className="line-clamp-1 text-[10px] italic text-slate-600 dark:text-slate-400 sm:text-xs">
						{paper.authors.slice(0, 2).join(", ")}
						{paper.authors.length > 2 && " et al."}
					</p>

					{/* Category indicator with link button */}
					<div className="mt-1 flex items-center justify-between sm:mt-2">
						<div className="flex items-center gap-1.5">
							<div className="h-1.5 w-1.5 rounded-full bg-violet-500 sm:h-2 sm:w-2" />
							<span className="text-[9px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:text-[10px]">
								{paper.category}
							</span>
						</div>

						{/* Link button */}
						{paper.url && (
							<a
								href={paper.url}
								target="_blank"
								rel="noopener noreferrer"
								onClick={(e) => e.stopPropagation()}
								className="group/link relative inline-flex items-center gap-1 overflow-hidden rounded-md border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] px-1.5 py-1 shadow-[0_1px_3px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(71,85,105,0.12)] transition-all duration-200 hover:shadow-[0_2px_6px_rgba(15,23,42,0.15),inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_2px_rgba(71,85,105,0.15)] dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_2px_6px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_2px_rgba(0,0,0,0.25)]"
							>
								<div className="plastic-grain pointer-events-none absolute inset-0 rounded-md opacity-50" />
								<span className="relative z-10 flex items-center gap-1">
									<svg
										className="h-3 w-3 text-slate-500 transition-colors group-hover/link:text-violet-600 dark:text-slate-400 dark:group-hover/link:text-violet-400 sm:h-3.5 sm:w-3.5"
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
									<span className="text-[9px] font-medium text-slate-600 transition-colors group-hover/link:text-violet-600 dark:text-slate-400 dark:group-hover/link:text-violet-400 sm:text-[10px]">
										Link
									</span>
								</span>
							</a>
						)}
					</div>
				</div>

				{/* Glare effect on hover */}
				{isHovered && (
					<div
						className="pointer-events-none absolute inset-0 rounded-lg sm:rounded-xl"
						style={{
							background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.2) 0%, transparent 60%)`,
							transition: "background 0.1s ease-out",
						}}
					/>
				)}

				{/* Corner fold effect */}
				<div className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 overflow-hidden sm:h-5 sm:w-5">
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
