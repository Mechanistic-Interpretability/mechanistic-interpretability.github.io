"use client";

import { IconFileText, IconUser, IconBookmark } from "@tabler/icons-react";

interface ViewToggleProps {
	activeView: "papers" | "people" | "resources";
	onViewChange: (view: "papers" | "people" | "resources") => void;
	paperCount: number;
	peopleCount: number;
	resourceCount: number;
}

export function ViewToggle({
	activeView,
	onViewChange,
	paperCount,
	peopleCount,
	resourceCount,
}: ViewToggleProps) {
	// Only show tabs that have content
	const showPapers = paperCount > 0;
	const showPeople = peopleCount > 0;
	const showResources = resourceCount > 0;

	// If no tabs would be shown, show all (edge case)
	const hasAnyContent = showPapers || showPeople || showResources;

	return (
		<div className="relative inline-flex rounded-xl border border-slate-500/35 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-1 shadow-[0_3px_10px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-slate-500/60 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] sm:rounded-2xl sm:p-1.5">
			{/* Plastic grain texture */}
			<div className="plastic-grain pointer-events-none absolute inset-0 rounded-xl opacity-10" />

			{/* Papers Button - Only show if has content */}
			{(showPapers || !hasAnyContent) && (
				<button
					onClick={() => onViewChange("papers")}
					className={`relative flex min-h-[40px] items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-200 active:scale-95 sm:min-h-[44px] sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm ${
						activeView === "papers"
							? "bg-gradient-to-b from-white to-zinc-200 text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_3px_rgba(15,23,42,0.15)] dark:from-zinc-600 dark:to-zinc-700 dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.3)]"
							: "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
					}`}
				>
					<IconFileText
						size={16}
						className={`sm:h-[18px] sm:w-[18px] ${
							activeView === "papers"
								? "text-violet-600 dark:text-violet-400"
								: "text-zinc-500 dark:text-zinc-500"
						}`}
					/>
					<span className="hidden sm:inline">Papers</span>
					<span
						className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold sm:text-xs ${
							activeView === "papers"
								? "bg-zinc-100 text-zinc-600 shadow-[inset_0_1px_1px_rgba(0,0,0,0.08)] dark:bg-zinc-500 dark:text-zinc-200"
								: "bg-zinc-200/60 text-zinc-500 dark:bg-zinc-700/60 dark:text-zinc-400"
						}`}
					>
						{paperCount}
					</span>
				</button>
			)}

			{/* People Button - Only show if has content */}
			{(showPeople || !hasAnyContent) && (
				<button
					onClick={() => onViewChange("people")}
					className={`relative flex min-h-[40px] items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-200 active:scale-95 sm:min-h-[44px] sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm ${
						activeView === "people"
							? "bg-gradient-to-b from-white to-zinc-200 text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_3px_rgba(15,23,42,0.15)] dark:from-zinc-600 dark:to-zinc-700 dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.3)]"
							: "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
					}`}
				>
					<IconUser
						size={16}
						className={`sm:h-[18px] sm:w-[18px] ${
							activeView === "people"
								? "text-violet-600 dark:text-violet-400"
								: "text-zinc-500 dark:text-zinc-500"
						}`}
					/>
					<span className="hidden sm:inline">People</span>
					<span
						className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold sm:text-xs ${
							activeView === "people"
								? "bg-zinc-100 text-zinc-600 shadow-[inset_0_1px_1px_rgba(0,0,0,0.08)] dark:bg-zinc-500 dark:text-zinc-200"
								: "bg-zinc-200/60 text-zinc-500 dark:bg-zinc-700/60 dark:text-zinc-400"
						}`}
					>
						{peopleCount}
					</span>
				</button>
			)}

			{/* Resources Button - Only show if has content */}
			{(showResources || !hasAnyContent) && (
				<button
					onClick={() => onViewChange("resources")}
					className={`relative flex min-h-[40px] items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-200 active:scale-95 sm:min-h-[44px] sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm ${
						activeView === "resources"
							? "bg-gradient-to-b from-white to-zinc-200 text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_3px_rgba(15,23,42,0.15)] dark:from-zinc-600 dark:to-zinc-700 dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.3)]"
							: "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
					}`}
				>
					<IconBookmark
						size={16}
						className={`sm:h-[18px] sm:w-[18px] ${
							activeView === "resources"
								? "text-violet-600 dark:text-violet-400"
								: "text-zinc-500 dark:text-zinc-500"
						}`}
					/>
					<span className="hidden sm:inline">Resources</span>
					<span
						className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold sm:text-xs ${
							activeView === "resources"
								? "bg-zinc-100 text-zinc-600 shadow-[inset_0_1px_1px_rgba(0,0,0,0.08)] dark:bg-zinc-500 dark:text-zinc-200"
								: "bg-zinc-200/60 text-zinc-500 dark:bg-zinc-700/60 dark:text-zinc-400"
						}`}
					>
						{resourceCount}
					</span>
				</button>
			)}
		</div>
	);
}
