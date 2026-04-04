"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { PaperCard } from "@/components/PaperCard";
import PaperDetail from "@/components/PaperDetail";
import allPapers, { type Paper } from "@/lib/papers";

interface GroupedPapers {
	[category: string]: Paper[];
}

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
	const [selectedPaperPath, setSelectedPaperPath] = useState<string | null>(
		null,
	);
	const [activeCategory, setActiveCategory] = useState<Category>("All");
	const [searchQuery, setSearchQuery] = useState("");
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [displayCount, setDisplayCount] = useState(12);
	const inputRef = useRef<HTMLInputElement>(null);

	// Get selected paper data
	const selectedPaper = useMemo(() => {
		if (!selectedPaperPath) return null;
		return (
			allPapers.find((paper) => paper._meta.path === selectedPaperPath) ||
			null
		);
	}, [selectedPaperPath]);

	// Filter papers based on category and search
	const filteredPapers = useMemo(() => {
		let papers = allPapers;

		// Filter by category
		if (activeCategory !== "All") {
			papers = papers.filter(
				(paper) => paper.category === activeCategory,
			);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			papers = papers.filter(
				(paper) =>
					paper.title.toLowerCase().includes(query) ||
					paper.authors.some((author) =>
						author.toLowerCase().includes(query),
					) ||
					paper.venue.toLowerCase().includes(query) ||
					paper.abstract.toLowerCase().includes(query),
			);
		}

		return papers;
	}, [activeCategory, searchQuery]);

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

	return (
		<>
			<div className="mx-auto w-full max-w-6xl px-4 pt-8">
				{/* Research Desk Panel */}
				<div className="relative overflow-hidden rounded-2xl border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-6px_12px_rgba(71,85,105,0.25)] dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_16px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-6px_14px_rgba(0,0,0,0.5)] sm:rounded-[1.4rem] sm:p-2">
					{/* Plastic grain */}
					<div className="plastic-grain pointer-events-none absolute inset-0 rounded-2xl sm:rounded-[1.4rem]" />
					{/* Shell highlight */}
					<div className="pointer-events-none absolute inset-x-6 top-1 h-4 rounded-full bg-white/50 blur-md dark:bg-white/10" />

					{/* Inner bezel */}
					<div className="relative overflow-hidden rounded-xl border border-slate-500/45 bg-gradient-to-b from-[#e8edf3] to-[#b9c4d1] shadow-[inset_0_2px_2px_rgba(255,255,255,0.65),inset_0_-3px_6px_rgba(15,23,42,0.22)] dark:border-slate-600/70 dark:from-[#202833] dark:to-[#141b24] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-4px_9px_rgba(0,0,0,0.65)] sm:rounded-2xl">
						{/* Content area */}
						<div className="relative overflow-hidden rounded-xl bg-[#edf2f8] p-4 dark:bg-[#0a0a0a]">
							{/* Screen curvature */}
							<div className="pointer-events-none absolute inset-0 z-10 rounded-xl shadow-[inset_0_0_40px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]" />

							{/* Header with title */}
							<div className="mb-6 flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-500/45 bg-gradient-to-b from-[#eef3f9] to-[#c3cdda] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_3px_rgba(15,23,42,0.2)] dark:border-slate-600/70 dark:from-[#252d38] dark:to-[#151b24] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_8px_rgba(0,0,0,0.4)]">
										<svg
											className="h-4 w-4 text-slate-700 dark:text-slate-300"
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
									<h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
										Research Papers
									</h2>
								</div>
								<span className="font-mono text-xs text-slate-500 dark:text-slate-400">
									{filteredPapers.length} papers
								</span>
							</div>

							{/* Terminal-style search bar */}
							<div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-400/50 bg-white/60 px-3 py-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] dark:border-slate-600/50 dark:bg-black/40 dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]">
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
									placeholder="Search papers by title, author, venue... (Cmd+K)"
									className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none dark:text-slate-300 dark:placeholder-slate-500"
								/>
								{searchQuery && (
									<button
										onClick={() => setSearchQuery("")}
										className="font-mono text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
									>
										[ESC]
									</button>
								)}
							</div>

							{/* Category tabs - terminal style */}
							<div className="mb-6 flex flex-wrap items-center gap-2 border-b border-slate-400/30 pb-3 dark:border-slate-600/30">
								<span className="mr-2 font-mono text-xs text-slate-500 dark:text-slate-400">
									&gt; filter:
								</span>
								{categories.map((category) => (
									<button
										key={category}
										onClick={() =>
											setActiveCategory(category)
										}
										className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
											activeCategory === category
												? "border-violet-500/50 bg-violet-500/20 text-violet-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:text-violet-300"
												: "border-slate-400/30 bg-slate-100/50 text-slate-600 hover:border-violet-400/40 hover:bg-violet-50/30 dark:border-slate-600/30 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:border-violet-500/30 dark:hover:bg-violet-900/20"
										}`}
									>
										{category}
									</button>
								))}
							</div>

							{/* Papers grid - scattered desk layout */}
							<div className="relative min-h-[400px]">
								{filteredPapers.length > 0 ? (
									<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
										{filteredPapers
											.slice(0, displayCount)
											.map((paper, index) => (
												<PaperCard
													key={paper._meta.path}
													paper={paper}
													isSelected={
														selectedPaperPath ===
														paper._meta.path
													}
													onClick={() =>
														handlePaperClick(
															paper._meta.path,
														)
													}
													index={index}
												/>
											))}
									</div>
								) : (
									<div className="flex h-64 flex-col items-center justify-center text-slate-400 dark:text-slate-600">
										<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
											<svg
												className="h-8 w-8"
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
										{/* Load More button */}
										{filteredPapers.length >
											displayCount && (
											<div className="mt-8 flex justify-center">
												<button
													onClick={() =>
														setDisplayCount(
															(prev) =>
																Math.min(
																	prev + 12,
																	filteredPapers.length,
																),
														)
													}
													className="group relative overflow-hidden rounded-lg border border-violet-500/50 bg-violet-500/20 px-6 py-3 text-sm font-medium text-violet-700 transition-all duration-200 hover:border-violet-600 hover:bg-violet-500/30 dark:border-violet-500/40 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:border-violet-400 dark:hover:bg-violet-900/40"
												>
													<span className="relative z-10 flex items-center gap-2">
														<span>
															Load more (
															{filteredPapers.length -
																displayCount}{" "}
															remaining)
														</span>
														<svg
															className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
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
										<p className="text-center text-lg">
											No papers found
										</p>
										<p className="text-center text-sm">
											Try adjusting your search or filter
										</p>
									</div>
								)}
							</div>
						</div>
						{/* End content area */}
					</div>
					{/* End inner bezel */}
				</div>
			</div>

			{/* Paper Detail Drawer */}
			<PaperDetail
				paper={selectedPaper}
				isOpen={isDetailOpen}
				onClose={handleCloseDetail}
			/>
		</>
	);
}
