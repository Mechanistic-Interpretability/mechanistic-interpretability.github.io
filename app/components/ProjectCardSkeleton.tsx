"use client";

export function ProjectCardSkeleton() {
	return (
		<div className="group relative animate-pulse overflow-hidden rounded-2xl border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-1.5 dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] sm:rounded-[1.4rem] sm:p-2">
			<div className="plastic-grain pointer-events-none absolute inset-0 rounded-2xl sm:rounded-[1.4rem]" />
			<div className="pointer-events-none absolute inset-x-4 top-1 h-4 rounded-full bg-white/50 blur-md dark:bg-white/10" />

			{/* Inner bezel */}
			<div className="relative overflow-hidden rounded-xl border border-slate-500/45 bg-gradient-to-b from-[#e8edf3] to-[#b9c4d1] dark:border-slate-600/70 dark:from-[#202833] dark:to-[#141b24] sm:rounded-2xl">
				{/* Screen/content area */}
				<div className="relative overflow-hidden rounded-lg border border-slate-700/30 bg-[#edf2f8] dark:border-white/10 dark:bg-[#0a0a0a]">
					{/* Cover image skeleton */}
					<div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-zinc-800">
						<div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800" />
					</div>
					<div className="relative z-[5] p-5">
						<div className="mb-4 flex items-center">
							{/* Icon skeleton */}
							<div className="mr-4 h-12 w-12 overflow-hidden rounded-lg bg-gray-200 dark:bg-zinc-800" />
							{/* Title skeleton */}
							<div className="h-6 w-32 rounded bg-gray-200 dark:bg-zinc-800" />
						</div>
						{/* Description skeleton */}
						<div className="mb-4 space-y-2">
							<div className="h-4 w-full rounded bg-gray-200 dark:bg-zinc-800" />
							<div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-zinc-800" />
						</div>
						{/* Button skeleton */}
						<div className="flex flex-wrap justify-center gap-2">
							<div className="h-8 w-24 rounded-lg bg-gray-200 dark:bg-zinc-800" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function ProjectShowcaseSkeleton() {
	return (
		<div className="mx-auto mt-8 grid w-full grid-cols-1 gap-6 px-4 md:grid-cols-2 md:px-8">
			<ProjectCardSkeleton />
			<ProjectCardSkeleton />
		</div>
	);
}
