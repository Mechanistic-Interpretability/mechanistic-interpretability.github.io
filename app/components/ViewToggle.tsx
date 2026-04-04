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
		<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			{/* View Toggle - Skeuomorphic */}
			<div className="relative inline-flex rounded-2xl border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-1.5 shadow-[0_8px_20px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_10px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]">
				{/* Plastic grain texture */}
				<div className="plastic-grain pointer-events-none absolute inset-0 rounded-2xl" />

				{/* Papers Button - Only show if has content */}
				{(showPapers || !hasAnyContent) && (
					<button
						onClick={() => onViewChange("papers")}
						className={`relative flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 sm:rounded-2xl sm:px-4 sm:py-3 ${
							activeView === "papers"
								? "bg-gradient-to-b from-white to-zinc-200 text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(15,23,42,0.2)] dark:from-zinc-600 dark:to-zinc-700 dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_2px_6px_rgba(0,0,0,0.4)]"
								: "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
						}`}
					>
						<IconFileText
							size={18}
							className={
								activeView === "papers"
									? "text-violet-600 dark:text-violet-400"
									: "text-zinc-500 dark:text-zinc-500"
							}
						/>
						<span className="hidden sm:inline">Papers</span>
						<span className="sm:hidden">Papers</span>
						<span
							className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
								activeView === "papers"
									? "bg-zinc-100 text-zinc-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] dark:bg-zinc-500 dark:text-zinc-200"
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
						className={`relative flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 sm:rounded-2xl sm:px-4 sm:py-3 ${
							activeView === "people"
								? "bg-gradient-to-b from-white to-zinc-200 text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(15,23,42,0.2)] dark:from-zinc-600 dark:to-zinc-700 dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_2px_6px_rgba(0,0,0,0.4)]"
								: "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
						}`}
					>
						<IconUser
							size={18}
							className={
								activeView === "people"
									? "text-violet-600 dark:text-violet-400"
									: "text-zinc-500 dark:text-zinc-500"
							}
						/>
						<span className="hidden sm:inline">People</span>
						<span className="sm:hidden">People</span>
						<span
							className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
								activeView === "people"
									? "bg-zinc-100 text-zinc-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] dark:bg-zinc-500 dark:text-zinc-200"
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
						className={`relative flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 sm:rounded-2xl sm:px-4 sm:py-3 ${
							activeView === "resources"
								? "bg-gradient-to-b from-white to-zinc-200 text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(15,23,42,0.2)] dark:from-zinc-600 dark:to-zinc-700 dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_2px_6px_rgba(0,0,0,0.4)]"
								: "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
						}`}
					>
						<IconBookmark
							size={18}
							className={
								activeView === "resources"
									? "text-violet-600 dark:text-violet-400"
									: "text-zinc-500 dark:text-zinc-500"
							}
						/>
						<span className="hidden sm:inline">Resources</span>
						<span className="sm:hidden">Resources</span>
						<span
							className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
								activeView === "resources"
									? "bg-zinc-100 text-zinc-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] dark:bg-zinc-500 dark:text-zinc-200"
									: "bg-zinc-200/60 text-zinc-500 dark:bg-zinc-700/60 dark:text-zinc-400"
							}`}
						>
							{resourceCount}
						</span>
					</button>
				)}
			</div>
		</div>
	);
}
