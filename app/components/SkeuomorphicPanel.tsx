import { PanelScrew } from "./PanelScrew";

interface SkeuomorphicPanelProps {
	children: React.ReactNode;
	className?: string;
	title?: string;
	screws?: boolean;
	powerLed?: boolean;
}

export function SkeuomorphicPanel({
	children,
	className = "",
	title,
	screws = true,
	powerLed = false,
}: SkeuomorphicPanelProps) {
	return (
		<div className={`relative ${className}`}>
			{/* Outer shell */}
			<div className="relative rounded-2xl border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-2 shadow-[0_24px_50px_rgba(15,23,42,0.28),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-10px_18px_rgba(71,85,105,0.25)] dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_12px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-8px_16px_rgba(0,0,0,0.4)] sm:rounded-[1.6rem] sm:p-3">
				{/* Plastic grain texture */}
				<div className="plastic-grain pointer-events-none absolute inset-0 rounded-2xl sm:rounded-[1.6rem]" />

				{/* Shell highlight and lip */}
				<div className="pointer-events-none absolute inset-x-5 top-2 h-5 rounded-full bg-white/60 blur-md dark:bg-white/10" />
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 rounded-b-2xl bg-gradient-to-t from-black/20 to-transparent sm:rounded-b-[1.6rem]" />

				{/* Edge chamfer highlight — top edge */}
				<div className="pointer-events-none absolute inset-x-4 top-0 h-px rounded-full bg-white/40 dark:bg-white/5" />
				{/* Edge chamfer highlight — left edge */}
				<div className="pointer-events-none absolute inset-y-4 left-0 w-px rounded-full bg-white/30 dark:bg-white/5" />

				{/* Corner screws */}
				{screws && (
					<>
						<PanelScrew position="top-left" />
						<PanelScrew position="top-right" />
						<PanelScrew position="bottom-left" />
						<PanelScrew position="bottom-right" />
					</>
				)}

				{/* Power LED */}
				{powerLed && (
					<div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
						<div className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.6),0_0_8px_rgba(52,211,153,0.3)] dark:bg-emerald-500 dark:shadow-[0_0_6px_rgba(52,211,153,0.8),0_0_12px_rgba(52,211,153,0.4)]" />
					</div>
				)}

				{/* Inner bezel */}
				<div className="relative rounded-xl border border-slate-500/45 bg-gradient-to-b from-[#e8edf3] to-[#b9c4d1] p-1 shadow-[inset_0_2px_2px_rgba(255,255,255,0.65),inset_0_-3px_6px_rgba(15,23,42,0.22)] dark:border-slate-600/70 dark:from-[#202833] dark:to-[#141b24] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-4px_9px_rgba(0,0,0,0.65)] sm:rounded-2xl sm:p-1.5">
					{/* Content area */}
					<div className="relative overflow-hidden rounded-lg border border-slate-700/40 bg-[#edf2f8] shadow-[inset_0_0_1px_rgba(255,255,255,0.85),inset_0_0_70px_rgba(30,41,59,0.13)] dark:border-white/15 dark:bg-[#060606] dark:shadow-[inset_0_0_1px_rgba(255,255,255,0.16),inset_0_0_90px_rgba(0,0,0,0.9)] sm:rounded-xl">
						{/* Screen curvature effect */}
						<div className="pointer-events-none absolute inset-0 z-10 rounded-lg shadow-[inset_0_0_95px_rgba(0,0,0,0.14),inset_0_0_30px_rgba(255,255,255,0.12)] dark:shadow-[inset_0_0_110px_rgba(0,0,0,0.9),inset_0_0_40px_rgba(58,58,58,0.25)]" />
						<div className="pointer-events-none absolute inset-x-10 top-2 z-10 h-10 rounded-full bg-white/35 blur-md dark:bg-cyan-100/5" />

						{/* Screen glow */}
						<div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-purple-500/[0.04] via-transparent to-cyan-500/[0.04] dark:from-purple-500/10 dark:to-cyan-500/10" />

						{/* Scanlines (subtle on content areas) */}
						<div
							className="pointer-events-none absolute inset-0 z-10 opacity-[0.03] dark:opacity-[0.08]"
							style={{
								backgroundImage:
									"repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 6px)",
							}}
						/>

						{/* Content */}
						<div className="relative z-[5]">{children}</div>
					</div>
				</div>

				{/* Bottom branding strip */}
				<div className="mt-2 flex items-center justify-center gap-2 px-1">
					<div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/20 to-transparent dark:via-white/20" />
					<span className="rounded-full border border-black/15 bg-black/[0.04] px-3 py-0.5 text-[10px] tracking-[0.25em] text-black/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-white/15 dark:bg-white/[0.04] dark:text-white/45 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
						{title ? title.toUpperCase() : ""}
					</span>
					<div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/20 to-transparent dark:via-white/20" />
				</div>
			</div>
		</div>
	);
}
