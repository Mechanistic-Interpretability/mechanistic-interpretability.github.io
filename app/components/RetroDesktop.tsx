"use client";
import { useRouter } from "next/navigation";
import ThemeSwitch from "./ThemeSwitch";

interface RetroDesktopProps {
	children: React.ReactNode;
	onClose?: () => void;
}

/**
 * RetroDesktop - CRT Monitor Frame Container
 *
 * Refactored to use Tailwind dark: prefix consistently
 * Previously used isDark conditional logic, now uses CSS dark mode
 */
export function RetroDesktop({ children, onClose }: RetroDesktopProps) {
	const router = useRouter();

	return (
		<div className="retro-desktop-shell group fixed inset-0 z-40 overflow-hidden">
			{/* Outer shell with plastic texture */}
			<div className="absolute inset-0 rounded-lg bg-gradient-to-b from-[#e8e4dc] via-[#d4cfc4] to-[#b8b0a2] transition-all duration-500 dark:from-[#2a2a35] dark:via-[#1e1e26] dark:to-[#121218]">
				{/* Plastic grain texture overlay */}
				<div className="plastic-grain pointer-events-none absolute inset-0" />

				{/* Shell highlight - top reflection */}
				<div className="absolute inset-x-6 top-2 h-6 rounded-full bg-white/30 opacity-50 blur-md" />

				{/* Bottom lip shadow */}
				<div className="absolute inset-x-0 bottom-0 h-10 rounded-b-lg bg-gradient-to-t from-black/15 to-transparent" />

				{/* Left edge highlight */}
				<div className="absolute inset-y-6 left-0 w-px rounded-full bg-white/25" />

				{/* Right edge shadow */}
				<div className="absolute inset-y-6 right-0 w-px rounded-full bg-black/15" />
			</div>

			{/* Inner bezel frame */}
			<div className="absolute inset-1 rounded-md bg-gradient-to-b from-[#c9c4ba] to-[#a8a196] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.2)] transition-all duration-300 dark:from-[#1a1a22] dark:to-[#0f0f14] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),inset_0_-2px_4px_rgba(255,255,255,0.05)]">
				{/* Bezel highlight */}
				<div className="absolute inset-x-2 top-1 h-px rounded-full bg-white/40" />
			</div>

			{/* Main CRT screen area */}
			<div className="absolute inset-2 overflow-hidden rounded bg-[#f0ede6] shadow-[inset_0_0_60px_rgba(0,0,0,0.08),inset_0_0_10px_rgba(255,255,255,0.9)] transition-all duration-300 dark:bg-[#050508] dark:shadow-[inset_0_0_80px_rgba(0,0,0,0.95),inset_0_0_20px_rgba(255,255,255,0.03)]">
				{/* Screen scanlines */}
				<div className="screen-scanlines pointer-events-none absolute inset-0 z-20" />

				{/* CRT curvature effect */}
				<div className="screen-curvature pointer-events-none absolute inset-0 z-20" />

				{/* Screen glow */}
				<div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 dark:from-purple-900/20 dark:to-cyan-900/20" />

				{/* Glass reflection streak */}
				<div className="glass-reflection pointer-events-none absolute inset-x-12 top-2 z-20 h-16 rounded-full opacity-30 blur-sm" />

				{/* External glow */}
				<div className="pointer-events-none absolute -inset-1 -z-10 rounded-lg bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 opacity-50 blur-xl" />

				{/* Content container */}
				<div
					id="retro-scroll"
					className="relative z-0 h-full w-full overflow-auto"
				>
					{/* Window title bar */}
					<div className="sticky top-0 z-30 flex items-center justify-between border-b border-black/10 bg-gradient-to-b from-[#e8e4dc] to-[#d4cfc4] px-3 py-2 dark:border-white/10 dark:from-[#1a1a22] dark:to-[#121218]">
						{/* Left side - Traffic light buttons + Theme switch */}
						<div className="flex items-center gap-2">
							{/* Close button */}
							<button
								onClick={onClose}
								className="h-3 w-3 rounded-full border border-black/20 bg-gradient-to-b from-red-300 to-red-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_1px_2px_rgba(0,0,0,0.35)] transition-all duration-200 hover:shadow-[0_0_12px_rgba(239,68,68,0.5)] hover:brightness-110 dark:border-black/30 dark:from-red-400 dark:to-red-700 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_1px_2px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_0_12px_rgba(239,68,68,0.6)]"
								aria-label="Close"
							/>

							{/* Minimize button */}
							<button
								onClick={() => router.push("/")}
								className="h-3 w-3 rounded-full border border-black/20 bg-gradient-to-b from-yellow-300 to-yellow-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_1px_2px_rgba(0,0,0,0.35)] transition-all duration-200 hover:shadow-[0_0_12px_rgba(234,179,8,0.5)] hover:brightness-110 dark:border-black/30 dark:from-yellow-400 dark:to-yellow-600 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_1px_2px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_0_12px_rgba(234,179,8,0.6)]"
								aria-label="Go to homepage"
							/>

							{/* Maximize button */}
							<button
								onClick={() => router.push("/")}
								className="h-3 w-3 rounded-full border border-black/20 bg-gradient-to-b from-green-300 to-green-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_1px_2px_rgba(0,0,0,0.35)] transition-all duration-200 hover:shadow-[0_0_12px_rgba(34,197,94,0.5)] hover:brightness-110 dark:border-black/30 dark:from-green-400 dark:to-green-700 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_1px_2px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_0_12px_rgba(34,197,94,0.6)]"
								aria-label="Go to homepage"
							/>
						</div>

						{/* Window title */}
						<div className="flex items-center gap-2"></div>

						{/* Right side - Theme switch */}
						<ThemeSwitch />
					</div>

					{/* Main content */}
					{children}
				</div>
			</div>

			{/* Bottom branding strip */}
			<div className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2">
				<div className="flex items-center gap-3">
					<div className="h-px w-12 bg-gradient-to-r from-transparent via-black/20 to-transparent dark:via-white/20" />
					<span className="rounded-full border border-black/15 bg-black/[0.04] px-3 py-0.5 text-[10px] tracking-[0.25em] text-black/40 dark:border-white/15 dark:bg-white/5 dark:text-white/40">
						SF
					</span>
					<div className="h-px w-12 bg-gradient-to-r from-transparent via-black/20 to-transparent dark:via-white/20" />
				</div>
			</div>

			{/* CRT flicker effect */}
			<div className="crt-flicker pointer-events-none absolute inset-0 z-30" />
		</div>
	);
}
