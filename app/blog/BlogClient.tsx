"use client";

import Link from "next/link";
import allPosts from "@/lib/posts";
import { useState } from "react";

type Category = "all" | "blog" | "app";

export default function BlogClient() {
	const [activeTab, setActiveTab] = useState<Category>("all");

	const filteredPosts = allPosts.filter((post) => {
		if (activeTab === "all") return true;
		return post.category === activeTab;
	});

	const blogCount = allPosts.filter((p) => p.category === "blog").length;
	const appCount = allPosts.filter((p) => p.category === "app").length;

	const tabs = [
		{ id: "all" as Category, label: "All", count: allPosts.length },
		{ id: "blog" as Category, label: "Blog", count: blogCount },
		{ id: "app" as Category, label: "App", count: appCount },
	];

	return (
		<>
			<div className="w-full px-3 sm:px-4 lg:max-w-5xl">
				<h1 className="mb-8 text-2xl font-bold tracking-tight">
					Blog & Notes
				</h1>

				{/* Beautiful Tabs */}
				<div className="mb-8">
					<div className="scrollbar-hide -mx-4 flex snap-x snap-mandatory overflow-x-auto px-4 sm:mx-0 sm:justify-center sm:overflow-visible sm:px-0">
						<div className="relative w-full shrink-0 rounded-2xl border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-6px_12px_rgba(71,85,105,0.25)] dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_16px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-6px_14px_rgba(0,0,0,0.5)] sm:inline-flex sm:w-auto sm:rounded-[1.4rem] sm:p-2">
							{/* Plastic grain texture */}
							<div className="plastic-grain pointer-events-none absolute inset-0 rounded-2xl sm:rounded-[1.4rem]" />
							{/* Shell highlight */}
							<div className="pointer-events-none absolute inset-x-4 top-1 h-4 rounded-full bg-white/50 blur-md dark:bg-white/10" />
							<div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 rounded-b-2xl bg-gradient-to-t from-black/15 to-transparent sm:rounded-b-[1.4rem]" />

							{/* Inner bezel */}
							<div className="relative flex w-full rounded-xl border border-slate-500/45 bg-gradient-to-b from-[#e8edf3] to-[#b9c4d1] p-1 shadow-[inset_0_2px_2px_rgba(255,255,255,0.65),inset_0_-3px_6px_rgba(15,23,42,0.22)] dark:border-slate-600/70 dark:from-[#202833] dark:to-[#141b24] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-4px_9px_rgba(0,0,0,0.65)] sm:rounded-2xl sm:p-1.5">
								{tabs.map((tab) => (
									<button
										key={tab.id}
										onClick={() => setActiveTab(tab.id)}
										className={`relative flex-1 snap-center rounded-xl px-2 py-1.5 text-xs font-medium transition-all duration-200 sm:flex-none sm:px-5 sm:py-2.5 sm:text-sm ${
											activeTab === tab.id
												? "bg-gradient-to-b from-white to-zinc-200 text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(15,23,42,0.2)] dark:from-zinc-600 dark:to-zinc-700 dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_2px_6px_rgba(0,0,0,0.4)]"
												: "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
										} `}
									>
										<span className="flex items-center justify-center gap-1 sm:gap-2">
											{tab.label}
											<span
												className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold sm:px-2.5 sm:text-xs ${
													activeTab === tab.id
														? "bg-zinc-100 text-zinc-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] dark:bg-zinc-500 dark:text-zinc-200"
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
				</div>

				<div
					className="relative z-10 space-y-2"
					style={{ minHeight: `${allPosts.length * 60}px` }}
				>
					{filteredPosts.map((post, index) => (
						<Link
							href={"/blog/" + post._meta.path}
							className="group relative block overflow-hidden rounded-xl border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-[3px] shadow-[0_4px_10px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-200 hover:shadow-[0_6px_16px_rgba(15,23,42,0.16),inset_0_1px_0_rgba(255,255,255,0.9)] active:shadow-[inset_0_2px_4px_rgba(15,23,42,0.2)] dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] dark:hover:shadow-[0_6px_18px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)] dark:active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)] sm:rounded-2xl"
							key={post._meta.path}
							style={{ animationDelay: `${index * 40}ms` }}
						>
							{/* Plastic grain */}
							<div className="plastic-grain pointer-events-none absolute inset-0 rounded-xl sm:rounded-2xl" />
							{/* Shell highlight */}
							<div className="pointer-events-none absolute inset-x-6 top-0.5 h-2 rounded-full bg-white/40 blur-sm dark:bg-white/5" />

							{/* Inner bezel */}
							<div className="relative rounded-lg border border-slate-500/35 bg-gradient-to-b from-[#eef2f7] to-[#d0d8e4] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_3px_rgba(15,23,42,0.1)] dark:border-slate-600/60 dark:from-[#1e2630] dark:to-[#141a22] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_4px_rgba(0,0,0,0.4)] sm:rounded-xl">
								{/* Content area with subtle screen glow */}
								<div className="relative rounded-md bg-[#edf2f8] px-4 py-3 dark:bg-[#0a0a0a]">
									{/* Screen curvature vignette */}
									<div className="pointer-events-none absolute inset-0 rounded-md shadow-[inset_0_0_20px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]" />

									<div className="relative z-[5] flex items-center gap-3">
										<h2 className="flex-1 text-sm font-medium text-zinc-900 transition-colors group-hover:text-zinc-950 dark:text-zinc-100 dark:group-hover:text-white sm:text-base">
											{post.title}
										</h2>

										<div className="flex-shrink-0 text-zinc-400 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-zinc-500">
											<svg
												className="h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth={2.5}
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
												/>
											</svg>
										</div>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</>
	);
}
