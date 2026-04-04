"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import autoAnimate from "@formkit/auto-animate";
import Image from "next/image";
import {
	IconX,
	IconChevronLeft,
	IconChevronRight,
	IconExternalLink,
} from "@tabler/icons-react";
import type { Resource } from "@/lib/papers";

interface ResourceGridProps {
	resources: Resource[];
	viewType?: "people" | "resources";
}

const peopleCategories = [
	"All",
	"Anthropic",
	"DeepMind",
	"Google",
	"OpenAI",
	"Meta",
] as const;

const resourceCategories = [
	"All",
	"Resources",
	"Anthropic",
	"DeepMind",
	"Google",
	"OpenAI",
	"Meta",
] as const;

type PeopleCategory = (typeof peopleCategories)[number];
type ResourceCategory = (typeof resourceCategories)[number];

export default function ResourceGrid({
	resources,
	viewType = "resources",
}: ResourceGridProps) {
	const parentRef = useRef<HTMLDivElement>(null);
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [activeFilter, setActiveFilter] = useState<string>("All");
	const [filteredResources, setFilteredResources] =
		useState<Resource[]>(resources);

	// Get appropriate categories based on view type
	const categories =
		viewType === "people" ? peopleCategories : resourceCategories;

	// Touch state for swipe gestures
	const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
	const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
	const minSwipeDistance = 50;

	// Load filter from localStorage on mount
	useEffect(() => {
		const storageKey =
			viewType === "people" ? "people-filter" : "resources-filter";
		const savedFilter = localStorage.getItem(storageKey);
		if (savedFilter && categories.some((cat) => cat === savedFilter)) {
			setActiveFilter(savedFilter);
		}
	}, [viewType, categories]);

	// Save filter to localStorage when it changes
	useEffect(() => {
		localStorage.setItem(`${viewType}-filter`, activeFilter);
	}, [activeFilter, viewType]);

	// Filter resources when category changes
	useEffect(() => {
		if (activeFilter === "All") {
			setFilteredResources(resources);
		} else {
			const filtered = resources.filter(
				(res) => res.category === activeFilter,
			);
			setFilteredResources(filtered);
		}
	}, [activeFilter, resources]);

	// Setup auto-animate
	useEffect(() => {
		if (parentRef.current) {
			autoAnimate(parentRef.current);
		}
	}, []);

	const openLightbox = useCallback((index: number) => {
		setCurrentIndex(index);
		setLightboxOpen(true);
	}, []);

	const closeLightbox = useCallback(() => {
		setLightboxOpen(false);
	}, []);

	const goToNext = useCallback(() => {
		setCurrentIndex((prev) => (prev + 1) % filteredResources.length);
	}, [filteredResources.length]);

	const goToPrev = useCallback(() => {
		setCurrentIndex(
			(prev) =>
				(prev - 1 + filteredResources.length) %
				filteredResources.length,
		);
	}, [filteredResources.length]);

	// Touch event handlers for swipe gestures
	const onTouchStart = useCallback((e: React.TouchEvent) => {
		setTouchEnd({ x: 0, y: 0 });
		setTouchStart({
			x: e.targetTouches[0].clientX,
			y: e.targetTouches[0].clientY,
		});
	}, []);

	const onTouchMove = useCallback((e: React.TouchEvent) => {
		setTouchEnd({
			x: e.targetTouches[0].clientX,
			y: e.targetTouches[0].clientY,
		});
	}, []);

	const onTouchEnd = useCallback(() => {
		if (!touchStart.x || !touchEnd.x) return;

		const distanceX = touchStart.x - touchEnd.x;
		const distanceY = touchStart.y - touchEnd.y;

		// Only handle horizontal swipes (ignore vertical scrolling)
		if (
			Math.abs(distanceX) > Math.abs(distanceY) &&
			Math.abs(distanceX) > minSwipeDistance
		) {
			if (distanceX > 0) {
				goToNext(); // Swipe left -> next
			} else {
				goToPrev(); // Swipe right -> prev
			}
		}
	}, [touchStart, touchEnd, goToNext, goToPrev]);

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!lightboxOpen) return;

			switch (e.key) {
				case "Escape":
					closeLightbox();
					break;
				case "ArrowRight":
					goToNext();
					break;
				case "ArrowLeft":
					goToPrev();
					break;
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [lightboxOpen, closeLightbox, goToNext, goToPrev]);

	// Prevent body scroll when lightbox is open
	useEffect(() => {
		if (lightboxOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [lightboxOpen]);

	const currentResource = filteredResources[currentIndex];
	const hasUrl = !!currentResource?.url;
	const isGif = currentResource?.image.toLowerCase().endsWith(".gif");

	// Calculate counts for each category
	const getCategoryCount = (category: string) => {
		if (category === "All") return resources.length;
		return resources.filter((res) => res.category === category).length;
	};

	const tabs = categories
		.filter(
			(category) => category === "All" || getCategoryCount(category) > 0,
		)
		.map((category) => ({
			id: category,
			label: category,
			count: getCategoryCount(category),
		}));

	return (
		<>
			{/* Ultra-compact Filter tabs - horizontally scrollable */}
			<div className="mb-3 sm:mb-4">
				<div className="scrollbar-hide -mx-2 flex overflow-x-auto px-2 pb-1 sm:-mx-4 sm:px-4">
					<div className="relative flex shrink-0 gap-1 rounded-lg border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-1 shadow-[0_2px_8px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_3px_10px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.1)]">
						{/* Plastic grain texture */}
						<div className="plastic-grain pointer-events-none absolute inset-0 rounded-lg" />

						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveFilter(tab.id)}
								className={`relative shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:px-2 sm:py-1 sm:text-[11px] ${
									activeFilter === tab.id
										? "bg-gradient-to-b from-white to-zinc-200 text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(15,23,42,0.15)] dark:from-zinc-600 dark:to-zinc-700 dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_1px_3px_rgba(0,0,0,0.3)]"
										: "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
								} `}
							>
								<span className="flex items-center justify-center gap-1">
									{tab.label}
									<span
										className={`rounded-full px-1.5 py-0 text-[10px] font-semibold sm:px-1 sm:text-[9px] ${
											activeFilter === tab.id
												? "bg-zinc-100 text-zinc-600 shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)] dark:bg-zinc-500 dark:text-zinc-200"
												: "bg-zinc-200/60 text-zinc-500 dark:bg-zinc-700/60 dark:text-zinc-400"
										} `}
									>
										{tab.count}
									</span>
								</span>
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Masonry Grid */}
			<div
				ref={parentRef}
				className="columns-1 gap-3 space-y-3 sm:gap-4 sm:space-y-4 md:columns-2 md:gap-5 lg:gap-6 lg:space-y-6"
				style={{
					columnFill: "balance",
				}}
			>
				{filteredResources.map((resource, index) => (
					<div
						key={resource._meta.path}
						className="cursor-pointer break-inside-avoid"
						style={{
							animationDelay: `${index * 50}ms`,
						}}
						onClick={() => openLightbox(index)}
					>
						{/* Resource Card - Skeuomorphic */}
						<div className="group relative overflow-hidden rounded-xl border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-2 shadow-[0_8px_20px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(15,23,42,0.25)] dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_10px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] dark:hover:shadow-[0_14px_32px_rgba(0,0,0,0.6)]">
							{/* Plastic grain */}
							<div className="plastic-grain pointer-events-none absolute inset-0 rounded-xl" />

							{/* Image container */}
							<div className="relative overflow-hidden rounded-lg border border-slate-500/45 bg-gradient-to-b from-[#e8edf3] to-[#b9c4d1] shadow-[inset_0_2px_2px_rgba(255,255,255,0.65),inset_0_-3px_6px_rgba(15,23,42,0.22)] dark:border-slate-600/70 dark:from-[#202833] dark:to-[#141b24] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-4px_9px_rgba(0,0,0,0.65)]">
								<Image
									src={`/images/resources/${resource.image}`}
									alt={resource.title}
									width={600}
									height={450}
									className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
									priority={index < 4}
									unoptimized={isGif}
								/>

								{/* Category badge */}
								<div className="absolute left-2 top-2 rounded-full border border-slate-500/45 bg-gradient-to-b from-[#eef3f9]/90 to-[#c3cdda]/90 px-2 py-1 text-[10px] font-medium text-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(15,23,42,0.2)] backdrop-blur-sm dark:border-slate-600/70 dark:from-[#252d38]/90 dark:to-[#151b24]/90 dark:text-zinc-300 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_8px_rgba(0,0,0,0.4)]">
									{resource.category}
								</div>
							</div>

							{/* Title section */}
							<div className="mt-2.5 px-1 pb-1">
								<h3 className="line-clamp-2 text-base font-semibold leading-tight text-zinc-800 dark:text-zinc-200">
									{resource.title}
								</h3>
								{resource.description && (
									<p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
										{resource.description}
									</p>
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			{filteredResources.length === 0 && (
				<div className="flex h-48 items-center justify-center rounded-xl border border-zinc-200 bg-neutral-100/50 dark:border-zinc-800 dark:bg-neutral-900/50 sm:h-64 sm:rounded-2xl">
					<p className="text-sm text-zinc-500 dark:text-zinc-400">
						No {viewType} in this category.
					</p>
				</div>
			)}

			{/* Lightbox */}
			{lightboxOpen && currentResource && (
				<div
					className="animate-fade-in fixed inset-0 z-50 flex touch-pan-y items-center justify-center p-4"
					onClick={closeLightbox}
					onTouchStart={onTouchStart}
					onTouchMove={onTouchMove}
					onTouchEnd={onTouchEnd}
				>
					{/* Backdrop with blur */}
					<div className="absolute inset-0 bg-black/80 backdrop-blur-2xl dark:bg-black/90" />

					{/* Close button — skeuomorphic */}
					<button
						onClick={closeLightbox}
						className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-slate-500/45 bg-gradient-to-b from-[#eef3f9] to-[#c3cdda] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(15,23,42,0.3)] transition-all duration-200 hover:scale-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_4px_8px_rgba(15,23,42,0.2)] active:shadow-[inset_0_2px_4px_rgba(15,23,42,0.3)] dark:border-slate-600/70 dark:from-[#252d38] dark:to-[#151b24] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_8px_rgba(0,0,0,0.5)] sm:right-6 sm:top-6"
						aria-label="Close"
					>
						<IconX
							size={20}
							className="text-zinc-700 dark:text-zinc-300"
						/>
					</button>

					{/* Resource counter — skeuomorphic */}
					<div className="absolute left-4 top-4 z-50 rounded-full border border-slate-500/45 bg-gradient-to-b from-[#eef3f9] to-[#c3cdda] px-4 py-2 text-sm font-medium text-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(15,23,42,0.3)] dark:border-slate-600/70 dark:from-[#252d38] dark:to-[#151b24] dark:text-zinc-300 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_8px_rgba(0,0,0,0.5)] sm:left-6 sm:top-6">
						{currentIndex + 1} / {filteredResources.length}
					</div>

					{/* Navigation buttons — skeuomorphic, hidden on mobile */}
					{filteredResources.length > 1 && (
						<>
							<button
								onClick={(e) => {
									e.stopPropagation();
									goToPrev();
								}}
								className="absolute left-4 top-1/2 z-50 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-500/45 bg-gradient-to-b from-[#eef3f9] to-[#c3cdda] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(15,23,42,0.3)] transition-all duration-200 hover:scale-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_4px_8px_rgba(15,23,42,0.2)] active:shadow-[inset_0_2px_4px_rgba(15,23,42,0.3)] dark:border-slate-600/70 dark:from-[#252d38] dark:to-[#151b24] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_8px_rgba(0,0,0,0.5)] sm:left-8 md:flex"
								aria-label="Previous resource"
							>
								<IconChevronLeft
									size={24}
									className="text-zinc-700 dark:text-zinc-300"
								/>
							</button>
							<button
								onClick={(e) => {
									e.stopPropagation();
									goToNext();
								}}
								className="absolute right-4 top-1/2 z-50 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-500/45 bg-gradient-to-b from-[#eef3f9] to-[#c3cdda] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(15,23,42,0.3)] transition-all duration-200 hover:scale-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_4px_8px_rgba(15,23,42,0.2)] active:shadow-[inset_0_2px_4px_rgba(15,23,42,0.3)] dark:border-slate-600/70 dark:from-[#252d38] dark:to-[#151b24] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_8px_rgba(0,0,0,0.5)] sm:right-8 md:flex"
								aria-label="Next resource"
							>
								<IconChevronRight
									size={24}
									className="text-zinc-700 dark:text-zinc-300"
								/>
							</button>
						</>
					)}

					{/* Main image container — skeuomorphic CRT shell */}
					<div
						className="animate-scale-in relative z-10 max-h-[90vh] max-w-[95vw]"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Outer shell */}
						<div className="relative rounded-2xl border border-slate-500/45 bg-gradient-to-b from-[#1a1f27] via-[#151a22] to-[#0f1318] p-2 shadow-[0_24px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-10px_18px_rgba(0,0,0,0.5)] sm:rounded-[1.6rem] sm:p-3">
							{/* Plastic grain */}
							<div className="plastic-grain pointer-events-none absolute inset-0 rounded-2xl sm:rounded-[1.6rem]" />
							{/* Shell highlight */}
							<div className="pointer-events-none absolute inset-x-5 top-2 h-5 rounded-full bg-white/5 blur-md" />
							{/* Bottom lip */}
							<div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 rounded-b-2xl bg-gradient-to-t from-black/30 to-transparent sm:rounded-b-[1.6rem]" />

							{/* Corner screws */}
							<div className="pointer-events-none absolute left-3 top-3 h-2 w-2 rounded-full border border-white/15 bg-gradient-to-b from-[#556171] to-[#313946] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]" />
							<div className="pointer-events-none absolute right-3 top-3 h-2 w-2 rounded-full border border-white/15 bg-gradient-to-b from-[#556171] to-[#313946] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]" />
							<div className="pointer-events-none absolute bottom-7 left-3 h-2 w-2 rounded-full border border-white/15 bg-gradient-to-b from-[#556171] to-[#313946] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]" />
							<div className="pointer-events-none absolute bottom-7 right-3 h-2 w-2 rounded-full border border-white/15 bg-gradient-to-b from-[#556171] to-[#313946] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]" />

							{/* Inner bezel */}
							<div className="relative rounded-xl border border-slate-600/70 bg-gradient-to-b from-[#202833] to-[#141b24] p-1 shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-4px_9px_rgba(0,0,0,0.65)] sm:rounded-2xl sm:p-1.5">
								{/* CRT screen */}
								<div className="relative overflow-hidden rounded-lg border border-white/15 bg-[#060606] shadow-[inset_0_0_1px_rgba(255,255,255,0.16),inset_0_0_90px_rgba(0,0,0,0.9)] sm:rounded-xl">
									{/* Screen curvature */}
									<div className="pointer-events-none absolute inset-0 z-10 rounded-lg shadow-[inset_0_0_110px_rgba(0,0,0,0.7),inset_0_0_40px_rgba(58,58,58,0.2)]" />
									<div className="pointer-events-none absolute inset-x-10 top-2 z-10 h-8 rounded-full bg-white/5 blur-md" />

									{/* Scanlines */}
									<div
										className="pointer-events-none absolute inset-0 z-10 opacity-[0.08]"
										style={{
											backgroundImage:
												"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
										}}
									/>

									{/* Screen glow */}
									<div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-purple-500/[0.06] via-transparent to-cyan-500/[0.06]" />
									<div className="crt-flicker pointer-events-none absolute inset-0 z-10" />

									{/* Image - reduced height to fit button below */}
									<div className="relative z-[5] flex items-center justify-center p-2 sm:p-4">
										<Image
											src={`/images/resources/${currentResource.image}`}
											alt={currentResource.title}
											width={1400}
											height={1000}
											className="h-auto max-h-[55vh] w-auto max-w-[85vw] rounded object-contain"
											unoptimized={isGif}
											priority
										/>
									</div>
								</div>
							</div>

							{/* Bottom branding strip */}
							<div className="mt-2 flex items-center justify-center gap-2 px-1">
								<div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
								<span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-0.5 font-mono text-[10px] tracking-[0.15em] text-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
									{currentResource.category}
								</span>
								<div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
							</div>

							{/* Resource info */}
							<div className="mt-3 text-center">
								<h3 className="text-lg font-semibold text-white">
									{currentResource.title}
								</h3>
								{currentResource.description && (
									<p className="mt-1 text-sm text-white/70">
										{currentResource.description}
									</p>
								)}
							</div>

							{/* Visit Link Button — Prominent */}
							{hasUrl && (
								<div className="mt-3 flex justify-center">
									<a
										href={currentResource.url}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 rounded-xl border border-slate-500/45 bg-gradient-to-b from-[#eef3f9] to-[#c3cdda] px-6 py-3 font-medium text-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_12px_rgba(15,23,42,0.3)] transition-all duration-200 hover:scale-105 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_6px_20px_rgba(15,23,42,0.35)] active:shadow-[inset_0_2px_4px_rgba(15,23,42,0.3)] dark:border-slate-600/70 dark:from-[#252d38] dark:to-[#151b24] dark:text-zinc-200 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_6px_20px_rgba(0,0,0,0.5)]"
										onClick={(e) => e.stopPropagation()}
									>
										<IconExternalLink
											size={18}
											className="text-violet-600 dark:text-violet-400"
										/>
										<span>Visit Link</span>
									</a>
								</div>
							)}
						</div>
					</div>

					{/* Navigation hints — skeuomorphic pills */}
					<div className="absolute bottom-6 right-6 z-50 hidden rounded-full border border-slate-500/30 bg-gradient-to-b from-[#eef3f9]/90 to-[#c3cdda]/90 px-4 py-2 text-xs text-zinc-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(15,23,42,0.2)] dark:border-slate-600/50 dark:from-[#252d38]/90 dark:to-[#151b24]/90 dark:text-zinc-400 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_3px_6px_rgba(0,0,0,0.4)] sm:block">
						Use &larr; &rarr; to navigate, ESC to close
					</div>

					{/* Mobile swipe hint */}
					<div className="absolute bottom-6 right-6 z-50 block rounded-full border border-slate-500/30 bg-gradient-to-b from-[#eef3f9]/90 to-[#c3cdda]/90 px-4 py-2 text-xs text-zinc-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(15,23,42,0.2)] dark:border-slate-600/50 dark:from-[#252d38]/90 dark:to-[#151b24]/90 dark:text-zinc-400 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_3px_6px_rgba(0,0,0,0.4)] sm:hidden">
						&larr; Swipe to navigate &rarr;
					</div>
				</div>
			)}
		</>
	);
}
