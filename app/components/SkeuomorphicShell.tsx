import { PanelScrew } from "./PanelScrew";

interface SkeuomorphicShellProps {
	children: React.ReactNode;
	className?: string;
	showScrews?: boolean;
	screwSize?: "sm" | "md" | "lg";
	variant?: "default" | "inner";
	innerClassName?: string;
	hasInnerBezel?: boolean;
	style?: React.CSSProperties;
}

export function SkeuomorphicShell({
	children,
	className = "",
	showScrews = true,
	screwSize = "md",
	variant = "default",
	innerClassName = "",
	hasInnerBezel = true,
	style,
}: SkeuomorphicShellProps) {
	if (variant === "inner") {
		return (
			<div
				className={`m-1 overflow-hidden rounded-xl border border-slate-500/45 bg-gradient-to-b from-[#e8edf3] to-[#bac5d2] shadow-[inset_0_2px_2px_rgba(255,255,255,0.65),inset_0_-3px_6px_rgba(15,23,42,0.2)] dark:border-slate-600/70 dark:from-[#212833] dark:to-[#131922] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-4px_9px_rgba(0,0,0,0.65)] ${innerClassName}`}
			>
				{children}
			</div>
		);
	}

	return (
		<div
			className={`relative overflow-hidden rounded-2xl border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d8dfe8] to-[#a6b2bf] shadow-[0_16px_28px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-6px_12px_rgba(71,85,105,0.24)] dark:border-slate-500/70 dark:from-[#3a4350] dark:via-[#2a313a] dark:to-[#1a2028] dark:shadow-[0_20px_36px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-6px_12px_rgba(0,0,0,0.45)] ${className}`}
			style={style}
		>
			{/* Surface details */}
			<div className="plastic-grain pointer-events-none absolute inset-0 rounded-2xl" />
			<div className="pointer-events-none absolute inset-x-6 top-1.5 h-4 rounded-full bg-white/50 blur-md dark:bg-white/10" />
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/15 to-transparent" />

			{showScrews && (
				<>
					<PanelScrew position="top-left" size={screwSize} />
					<PanelScrew position="top-right" size={screwSize} />
				</>
			)}

			{hasInnerBezel ? (
				<div
					className={`m-1 overflow-hidden rounded-xl border border-slate-500/45 bg-gradient-to-b from-[#e8edf3] to-[#bac5d2] shadow-[inset_0_2px_2px_rgba(255,255,255,0.65),inset_0_-3px_6px_rgba(15,23,42,0.2)] dark:border-slate-600/70 dark:from-[#212833] dark:to-[#131922] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-4px_9px_rgba(0,0,0,0.65)] ${innerClassName}`}
				>
					{children}
				</div>
			) : (
				children
			)}
		</div>
	);
}
