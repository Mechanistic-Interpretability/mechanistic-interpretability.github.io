"use client";

import { useRouter } from "next/navigation";
import { papers } from "@/lib/papers";
import { SkeuomorphicShell } from "./SkeuomorphicShell";

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

	return (
		<div className="relative w-full max-w-md px-4">
			<SkeuomorphicShell
				showScrews={false}
				style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-slate-400/30 px-4 py-2.5 dark:border-slate-600/30">
					<div className="flex items-center gap-2">
						<div className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-500/45 bg-gradient-to-b from-[#eef3f9] to-[#c3cdda] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(15,23,42,0.15)] dark:border-slate-600/70 dark:from-[#252d38] dark:to-[#151b24] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.4)]">
							<svg
								className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300"
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
						<span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
							Featured
						</span>
					</div>
					<button
						onClick={handleViewAll}
						className="text-xs font-medium text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
					>
						View all →
					</button>
				</div>

				{/* Papers list */}
				<div className="p-3">
					<div className="space-y-2">
						{featuredPapers.map((paper, index) => (
							<div
								key={paper._meta.path}
								className="group cursor-pointer rounded-lg border border-slate-400/30 bg-white/40 p-2.5 transition-all duration-200 hover:border-violet-400/50 hover:bg-white/60 dark:border-slate-600/30 dark:bg-black/20 dark:hover:border-violet-500/40 dark:hover:bg-black/30"
								onClick={() => router.push(`/hub`)}
							>
								<div className="flex items-start gap-2">
									<div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-slate-400/40 bg-slate-100/80 text-xs font-medium text-slate-600 dark:border-slate-600/40 dark:bg-slate-800/80 dark:text-slate-400">
										{index + 1}
									</div>
									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-medium text-slate-800 group-hover:text-violet-700 dark:text-slate-200 dark:group-hover:text-violet-300">
											{paper.title}
										</p>
										<div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
											<span className="truncate">
												{paper.authors[0]}
												{paper.authors.length > 1 &&
													" et al."}
											</span>
											<span>•</span>
											<span className="text-t-xs rounded bg-slate-200/60 px-1.5 py-0.5 font-medium dark:bg-slate-700/60">
												{paper.category}
											</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</SkeuomorphicShell>
		</div>
	);
}
