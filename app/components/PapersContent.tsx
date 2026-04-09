"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { PaperCard } from "@/components/PaperCard";
import PaperDetail from "@/components/PaperDetail";
import ResourceGrid from "@/components/ResourceGrid";
import { ViewToggle } from "@/components/ViewToggle";
import { papers, people, resources } from "@/lib/papers";

const categories = [
	"All",
	"Anthropic",
	"DeepMind",
	"Google",
	"OpenAI",
	"Meta",
] as const;
type Category = (typeof categories)[number];

export function PapersContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const viewParam = searchParams.get("view");

	// View state - default to papers unless view=people or view=resources
	const [activeView, setActiveView] = useState<
		"papers" | "people" | "resources"
	>(
		viewParam === "people"
			? "people"
			: viewParam === "resources"
				? "resources"
				: "papers",
	);

	// Papers state
	const [selectedPaperPath, setSelectedPaperPath] = useState<string | null>(
		null,
	);
	const [activeCategory, setActiveCategory] = useState<Category>("All");
	const [searchQuery, setSearchQuery] = useState("");
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [displayCount, setDisplayCount] = useState(12);
	const inputRef = useRef<HTMLInputElement>(null);

	// Update view when URL changes
	useEffect(() => {
		let newView: "papers" | "people" | "resources" = "papers";
		if (viewParam === "people") newView = "people";
		else if (viewParam === "resources") newView = "resources";

		if (newView !== activeView) {
			setActiveView(newView);
		}
	}, [viewParam, activeView]);

	// Handle view change with URL update
	const handleViewChange = useCallback(
		(view: "papers" | "people" | "resources") => {
			setActiveView(view);
			const params = new URLSearchParams(searchParams);
			if (view === "people") {
				params.set("view", "people");
			} else if (view === "resources") {
				params.set("view", "resources");
			} else {
				params.delete("view");
			}
			router.push(`/hub?${params.toString()}`, { scroll: false });
		},
		[searchParams, router],
	);

	// Redirect to first available tab if current view has no content
	useEffect(() => {
		const hasPapers = papers.length > 0;
		const hasPeople = people.length > 0;
		const hasResources = resources.length > 0;

		// Check if current view is empty
		const currentViewEmpty =
			(activeView === "papers" && !hasPapers) ||
			(activeView === "people" && !hasPeople) ||
			(activeView === "resources" && !hasResources);

		if (currentViewEmpty) {
			// Find first available view
			if (hasPapers) {
				handleViewChange("papers");
			} else if (hasPeople) {
				handleViewChange("people");
			} else if (hasResources) {
				handleViewChange("resources");
			}
		}
	}, [
		activeView,
		papers.length,
		people.length,
		resources.length,
		handleViewChange,
	]);

	// Get selected paper data
	const selectedPaper = useMemo(() => {
		if (!selectedPaperPath) return null;
		return (
			papers.find((paper) => paper._meta.path === selectedPaperPath) ||
			null
		);
	}, [selectedPaperPath]);

	// Filter papers based on category and search
	const filteredPapers = useMemo(() => {
		let result = papers;

		// Filter by category
		if (activeCategory !== "All") {
			result = result.filter(
				(paper) => paper.category === activeCategory,
			);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(paper) =>
					paper.title.toLowerCase().includes(query) ||
					paper.authors.some((author) =>
						author.toLowerCase().includes(query),
					) ||
					paper.venue.toLowerCase().includes(query) ||
					paper.abstract.toLowerCase().includes(query),
			);
		}

		return result;
	}, [activeCategory, searchQuery]);

	// Calculate counts for each category
	const getCategoryCount = (category: string) => {
		if (category === "All") return papers.length;
		return papers.filter((paper) => paper.category === category).length;
	};

	const paperCategoryTabs = categories
		.filter(
			(category) => category === "All" || getCategoryCount(category) > 0,
		)
		.map((category) => ({
			id: category,
			label: category,
			count: getCategoryCount(category),
		}));

	// Handle paper selection
	const handlePaperClick = useCallback((path: string) => {
		setSelectedPaperPath(path);
		setIsDetailOpen(true);
	}, []);

	// Close detail drawer
	const handleCloseDetail = useCallback(() => {
		setIsDetailOpen(false);
		setTimeout(() => setSelectedPaperPath(null), 300);
	}, []);

	// Reset display count when filters change
	useEffect(() => {
		setDisplayCount(12);
	}, [activeCategory, searchQuery]);

	// Handle keyboard shortcut for search focus
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				inputRef.current?.focus();
			}
			if (e.key === "Escape" && isDetailOpen) {
				handleCloseDetail();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isDetailOpen, handleCloseDetail]);

	// Get page title based on active view
	const getPageTitle = () => {
		switch (activeView) {
			case "papers":
				return "Mechanistic Interpretability";
			case "people":
				return "People";
			case "resources":
				return "Resources";
			default:
				return "MI Hub";
		}
	};

	return (
		<>
			<div className="mx-auto w-full max-w-6xl px-2 pt-4 sm:px-4 sm:pt-8">
				{/* MI Hub Panel */}
				<div className="relative overflow-hidden rounded-xl border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-1 shadow-[0_12px_28px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-6px_12px_rgba(71,85,105,0.25)] dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_16px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-6px_14px_rgba(0,0,0,0.5)] sm:rounded-2xl sm:p-1.5 md:rounded-[1.4rem] md:p-2">
					{/* Plastic grain */}
					<div className="plastic-grain pointer-events-none absolute inset-0 rounded-2xl sm:rounded-[1.4rem]" />
					{/* Shell highlight */}
					<div className="pointer-events-none absolute inset-x-6 top-1 h-4 rounded-full bg-white/50 blur-md dark:bg-white/10" />

					{/* Inner bezel */}
					<div className="relative overflow-hidden rounded-lg border border-slate-500/45 bg-gradient-to-b from-[#e8edf3] to-[#b9c4d1] shadow-[inset_0_2px_2px_rgba(255,255,255,0.65),inset_0_-3px_6px_rgba(15,23,42,0.22)] dark:border-slate-600/70 dark:from-[#202833] dark:to-[#141b24] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-4px_9px_rgba(0,0,0,0.65)] sm:rounded-xl md:rounded-2xl">
						{/* Content area */}
						<div className="relative overflow-hidden rounded-lg bg-[#edf2f8] p-2 dark:bg-[#0a0a0a] sm:p-3 md:p-4">
							{/* Screen curvature */}
							<div className="pointer-events-none absolute inset-0 z-10 rounded-xl shadow-[inset_0_0_40px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]" />

							{/* Header with view toggle */}
							<div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
								<div className="flex items-center gap-2 sm:gap-3">
									{/* Icon container - skeuomorphic card style */}
									<div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-md border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-0.5 shadow-[0_3px_6px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_3px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] sm:h-8 sm:w-8">
										{/* Plastic grain texture */}
										<div className="plastic-grain pointer-events-none absolute inset-0 rounded-md" />
										{/* Inner bezel frame */}
										<div className="absolute inset-0.5 overflow-hidden rounded-sm border border-slate-500/45 bg-gradient-to-b from-[#e8edf3] to-[#b9c4d1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] dark:border-slate-600/70 dark:from-[#202833] dark:to-[#141b24] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
											<Image
												src="/images/mi2.png"
												alt="MI"
												fill
												className="object-contain p-0.5"
												sizes="32px"
												priority
											/>
										</div>
									</div>
									<h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-xl">
										{getPageTitle()}
									</h2>
								</div>
								<ViewToggle
									activeView={activeView}
									onViewChange={handleViewChange}
									paperCount={papers.length}
									peopleCount={people.length}
									resourceCount={resources.length}
								/>
							</div>

							{/* Papers View */}
							{activeView === "papers" && (
								<>
									{/* Search bar */}
									<div className="mb-3 flex items-center gap-2 rounded-lg border border-slate-400/50 bg-white/60 px-2 py-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] dark:border-slate-600/50 dark:bg-black/40 dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] sm:mb-4 sm:px-3 sm:py-2">
										<span className="font-mono text-xs text-violet-600 dark:text-violet-400">
											&gt;
										</span>
										<input
											ref={inputRef}
											type="text"
											value={searchQuery}
											onChange={(e) =>
												setSearchQuery(e.target.value)
											}
											placeholder="Search papers..."
											className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none dark:text-slate-300 dark:placeholder-slate-500"
										/>
										{searchQuery && (
											<button
												onClick={() =>
													setSearchQuery("")
												}
												className="font-mono text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
											>
												[ESC]
											</button>
										)}
									</div>

									{/* Ultra-compact Filter tabs - horizontally scrollable */}
									<div className="mb-3 sm:mb-4">
										<div className="scrollbar-hide -mx-2 flex overflow-x-auto px-2 pb-1 sm:-mx-4 sm:px-4">
											<div className="relative flex shrink-0 gap-1 rounded-lg border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-1 shadow-[0_2px_8px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_3px_10px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.1)]">
												{/* Plastic grain texture */}
												<div className="plastic-grain pointer-events-none absolute inset-0 rounded-lg" />

												{paperCategoryTabs.map(
													(tab) => (
														<button
															key={tab.id}
															onClick={() =>
																setActiveCategory(
																	tab.id as Category,
																)
															}
															className={`relative shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:px-2 sm:py-1 sm:text-[11px] ${
																activeCategory ===
																tab.id
																	? "bg-gradient-to-b from-white to-zinc-200 text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(15,23,42,0.15)] dark:from-zinc-600 dark:to-zinc-700 dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_1px_3px_rgba(0,0,0,0.3)]"
																	: "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
															} `}
														>
															<span className="flex items-center justify-center gap-1">
																{tab.label}
																<span
																	className={`rounded-full px-1.5 py-0 text-[10px] font-semibold sm:px-1 sm:text-[9px] ${
																		activeCategory ===
																		tab.id
																			? "bg-zinc-100 text-zinc-600 shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)] dark:bg-zinc-500 dark:text-zinc-200"
																			: "bg-zinc-200/60 text-zinc-500 dark:bg-zinc-700/60 dark:text-zinc-400"
																	} `}
																>
																	{tab.count}
																</span>
															</span>
														</button>
													),
												)}
											</div>
										</div>
									</div>

									{/* Papers grid - scattered desk layout */}
									<div className="relative min-h-[300px] sm:min-h-[400px]">
										{filteredPapers.length > 0 ? (
											<div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:gap-6">
												{filteredPapers
													.slice(0, displayCount)
													.map((paper, index) => (
														<PaperCard
															key={
																paper._meta.path
															}
															paper={paper}
															isSelected={
																selectedPaperPath ===
																paper._meta.path
															}
															onClick={() =>
																handlePaperClick(
																	paper._meta
																		.path,
																)
															}
															index={index}
														/>
													))}
											</div>
										) : (
											<div className="flex h-48 flex-col items-center justify-center text-slate-400 dark:text-slate-600 sm:h-64">
												<div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 sm:mb-4 sm:h-16 sm:w-16">
													<svg
														className="h-6 w-6 sm:h-8 sm:w-8"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={1.5}
															d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
														/>
													</svg>
												</div>
												<p className="text-center text-base sm:text-lg">
													No papers found
												</p>
												<p className="text-center text-xs sm:text-sm">
													Try adjusting your search or
													filter
												</p>
											</div>
										)}
									</div>

									{/* Load More button */}
									{filteredPapers.length > displayCount && (
										<div className="mt-4 flex justify-center sm:mt-8">
											<button
												onClick={() =>
													setDisplayCount((prev) =>
														Math.min(
															prev + 12,
															filteredPapers.length,
														),
													)
												}
												className="group relative overflow-hidden rounded-lg border border-violet-500/50 bg-violet-500/20 px-4 py-2 text-xs font-medium text-violet-700 transition-all duration-200 hover:border-violet-600 hover:bg-violet-500/30 dark:border-violet-500/40 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:border-violet-400 dark:hover:bg-violet-900/40 sm:px-6 sm:py-3 sm:text-sm"
											>
												<span className="relative z-10 flex items-center gap-2">
													<span>
														Load more ({" "}
														{filteredPapers.length -
															displayCount}{" "}
														remaining)
													</span>
													<svg
														className="h-3 w-3 transition-transform duration-200 group-hover:translate-y-0.5 sm:h-4 sm:w-4"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M19 9l-7 7-7-7"
														/>
													</svg>
												</span>
											</button>
										</div>
									)}
								</>
							)}

							{/* People View */}
							{activeView === "people" && (
								<div className="relative min-h-[400px]">
									<ResourceGrid
										resources={people}
										viewType="people"
									/>
								</div>
							)}

							{/* Resources View */}
							{activeView === "resources" && (
								<div className="relative min-h-[400px]">
									<ResourceGrid
										resources={resources}
										viewType="resources"
									/>
								</div>
							)}
						</div>
						{/* End content area */}
					</div>
					{/* End inner bezel */}
				</div>
			</div>

			{/* Paper Detail Drawer - only for papers view */}
			{activeView === "papers" && (
				<PaperDetail
					paper={selectedPaper}
					isOpen={isDetailOpen}
					onClose={handleCloseDetail}
				/>
			)}
		</>
	);
}
