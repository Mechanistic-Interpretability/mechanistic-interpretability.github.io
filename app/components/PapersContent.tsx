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
	"Apollo",
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
				return "MI";
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
			<div className="mx-auto w-full max-w-6xl px-3 pt-3 sm:px-4 sm:pt-6 md:px-6 lg:px-8">
				{/* MI Hub Panel */}
				<div className="relative overflow-hidden rounded-2xl border border-slate-500/35 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-1.5 shadow-[0_8px_20px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-4px_8px_rgba(71,85,105,0.2)] dark:border-slate-500/60 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_12px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-4px_10px_rgba(0,0,0,0.4)] sm:rounded-2xl sm:p-1.5 md:rounded-[1.4rem] md:p-2">
					{/* Plastic grain */}
					<div className="plastic-grain pointer-events-none absolute inset-0 rounded-2xl sm:rounded-[1.4rem]" />
					{/* Shell highlight */}
					<div className="pointer-events-none absolute inset-x-6 top-1 h-4 rounded-full bg-white/50 blur-md dark:bg-white/10" />

					{/* Inner bezel */}
					<div className="relative overflow-hidden rounded-xl border border-slate-500/35 bg-gradient-to-b from-[#e8edf3] to-[#b9c4d1] shadow-[inset_0_2px_2px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(15,23,42,0.18)] dark:border-slate-600/60 dark:from-[#202833] dark:to-[#141b24] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),inset_0_-2px_6px_rgba(0,0,0,0.5)] sm:rounded-xl md:rounded-2xl">
						{/* Content area */}
						<div className="relative overflow-hidden rounded-xl bg-[#edf2f8] p-2.5 dark:bg-[#0a0a0a] sm:p-3 md:p-4">
							{/* Screen curvature */}
							<div className="pointer-events-none absolute inset-0 z-10 rounded-xl shadow-[inset_0_0_40px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]" />

							{/* Header with view toggle */}
							<div className="mb-3 flex flex-col gap-2.5 sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
								<div className="flex items-center gap-2">
									{/* Icon container - skeuomorphic card style */}
									<div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-slate-500/35 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-0.5 shadow-[0_2px_6px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-slate-500/60 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_3px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] sm:h-9 sm:w-9">
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
									<h2 className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg md:text-xl">
										{getPageTitle()}
									</h2>
								</div>
								<div className="flex justify-start sm:justify-end">
									<ViewToggle
										activeView={activeView}
										onViewChange={handleViewChange}
										paperCount={papers.length}
										peopleCount={people.length}
										resourceCount={resources.length}
									/>
								</div>
							</div>

							{/* Papers View */}
							{activeView === "papers" && (
								<>
									{/* Search bar - optimized for mobile */}
									<div className="mb-2.5 flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-400/40 bg-white/70 px-3 py-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] dark:border-slate-600/40 dark:bg-black/30 dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] sm:mb-4 sm:rounded-lg sm:px-3 sm:py-2">
										<span className="font-mono text-sm text-violet-600 dark:text-violet-400 sm:text-xs">
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
											className="flex-1 bg-transparent text-base text-slate-700 placeholder-slate-400 focus:outline-none dark:text-slate-300 dark:placeholder-slate-500 sm:text-sm"
										/>
										{searchQuery && (
											<button
												onClick={() =>
													setSearchQuery("")
												}
												className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200/60 font-mono text-xs text-slate-500 transition-colors hover:bg-slate-300/60 hover:text-slate-700 dark:bg-slate-700/60 dark:text-slate-400 dark:hover:bg-slate-600/60 dark:hover:text-slate-200"
												aria-label="Clear search"
											>
												<svg
													className="h-3.5 w-3.5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													strokeWidth={2}
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
											</button>
										)}
									</div>

									{/* Filter tabs - optimized for mobile touch */}
									<div className="mb-2.5 sm:mb-4">
										<div className="scrollbar-hide -mx-2 flex overflow-x-auto px-2 pb-1 sm:-mx-4 sm:px-4">
											<div className="relative flex shrink-0 gap-1 rounded-xl border border-slate-500/35 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-1 shadow-[0_2px_6px_rgba(15,23,42,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-slate-500/60 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]">
												{/* Plastic grain texture */}
												<div className="plastic-grain pointer-events-none absolute inset-0 rounded-xl" />

												{paperCategoryTabs.map(
													(tab) => (
														<button
															key={tab.id}
															onClick={() =>
																setActiveCategory(
																	tab.id as Category,
																)
															}
															className={`relative min-h-[36px] shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 active:scale-95 sm:min-h-[32px] sm:px-2.5 sm:py-1.5 sm:text-xs ${
																activeCategory ===
																tab.id
																	? "bg-gradient-to-b from-white to-zinc-200 text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(15,23,42,0.15)] dark:from-zinc-600 dark:to-zinc-700 dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_1px_2px_rgba(0,0,0,0.25)]"
																	: "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
															} `}
														>
															<span className="flex items-center justify-center gap-1.5">
																<span className="whitespace-nowrap">
																	{tab.label}
																</span>
																<span
																	className={`rounded-full px-1.5 py-0.5 text-xs font-semibold sm:text-[10px] ${
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

									{/* Papers grid - optimized for mobile */}
									<div className="relative min-h-[250px] sm:min-h-[350px]">
										{filteredPapers.length > 0 ? (
											<div className="grid grid-cols-1 gap-2.5 sm:gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-5">
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
											<div className="flex h-40 flex-col items-center justify-center text-slate-400 dark:text-slate-600 sm:h-56">
												<div className="mb-2.5 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 sm:mb-3 sm:h-14 sm:w-14">
													<svg
														className="h-5 w-5 sm:h-6 sm:w-6"
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
												<p className="text-center text-base font-medium sm:text-lg">
													No papers found
												</p>
												<p className="text-center text-sm text-slate-500 dark:text-slate-500 sm:text-base">
													Try adjusting your search or
													filter
												</p>
											</div>
										)}
									</div>

									{/* Load More button - optimized for mobile */}
									{filteredPapers.length > displayCount && (
										<div className="mt-3 flex justify-center sm:mt-6">
											<button
												onClick={() =>
													setDisplayCount((prev) =>
														Math.min(
															prev + 12,
															filteredPapers.length,
														),
													)
												}
												className="group relative overflow-hidden rounded-xl border border-violet-500/40 bg-violet-500/15 px-5 py-3 text-sm font-medium text-violet-700 transition-all duration-200 hover:border-violet-600 hover:bg-violet-500/25 active:scale-95 dark:border-violet-500/30 dark:bg-violet-900/20 dark:text-violet-300 dark:hover:border-violet-400 dark:hover:bg-violet-900/30 sm:px-6 sm:py-3.5 sm:text-base"
											>
												<span className="relative z-10 flex items-center gap-2">
													<span>
														Load more ({" "}
														{filteredPapers.length -
															displayCount}{" "}
														remaining)
													</span>
													<svg
														className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5 sm:h-4 sm:w-4"
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
