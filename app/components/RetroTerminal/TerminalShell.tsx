"use client";

interface TerminalShellProps {
	children: React.ReactNode;
}

export function TerminalShell({ children }: TerminalShellProps) {
	return (
		<div className="animate-fade-in relative max-h-[90vh] w-full max-w-full overflow-y-auto sm:max-h-none sm:max-w-3xl">
			{/* Skeuomorphic terminal shell */}
			<div className="relative rounded-2xl border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-2 shadow-[0_24px_50px_rgba(15,23,42,0.28),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-10px_18px_rgba(71,85,105,0.25)] dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_28px_56px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-10px_20px_rgba(0,0,0,0.5)] sm:rounded-[1.6rem] sm:p-3">
				<div className="plastic-grain pointer-events-none absolute inset-0 rounded-2xl sm:rounded-[1.6rem]" />

				{/* Shell highlight and lip */}
				<div className="pointer-events-none absolute inset-x-5 top-2 h-5 rounded-full bg-white/60 blur-md dark:bg-white/10" />
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 rounded-b-2xl bg-gradient-to-t from-black/20 to-transparent sm:rounded-b-[1.6rem]" />

				{/* Inner bezel with deeper edge */}
				<div className="relative rounded-xl border border-slate-500/45 bg-gradient-to-b from-[#e8edf3] to-[#b9c4d1] p-1 shadow-[inset_0_2px_2px_rgba(255,255,255,0.65),inset_0_-3px_6px_rgba(15,23,42,0.22)] dark:border-slate-600/70 dark:from-[#202833] dark:to-[#141b24] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-4px_9px_rgba(0,0,0,0.65)] sm:rounded-2xl sm:p-1.5">
					{/* CRT Screen Container */}
					<div className="relative overflow-hidden rounded-lg border border-slate-700/40 bg-[#edf2f8] shadow-[inset_0_0_1px_rgba(255,255,255,0.85),inset_0_0_70px_rgba(30,41,59,0.13)] dark:border-white/15 dark:bg-[#060606] dark:shadow-[inset_0_0_1px_rgba(255,255,255,0.16),inset_0_0_90px_rgba(0,0,0,0.9)] sm:rounded-xl">
						{/* Screen curvature effect */}
						<div className="pointer-events-none absolute inset-0 z-10 rounded-lg shadow-[inset_0_0_95px_rgba(0,0,0,0.14),inset_0_0_30px_rgba(255,255,255,0.12)] dark:shadow-[inset_0_0_110px_rgba(0,0,0,0.9),inset_0_0_40px_rgba(58,58,58,0.25)]" />
						<div className="pointer-events-none absolute inset-x-10 top-2 z-10 h-10 rounded-full bg-white/35 blur-md dark:bg-cyan-100/5" />

						{/* Scanlines */}
						<div
							className="pointer-events-none absolute inset-0 z-10 opacity-[0.05] dark:opacity-[0.12]"
							style={{
								backgroundImage:
									"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
							}}
						/>

						{/* Screen glow */}
						<div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-purple-500/[0.04] via-transparent to-cyan-500/[0.04] dark:from-purple-500/10 dark:to-cyan-500/10" />
						<div className="crt-flicker pointer-events-none absolute inset-0 z-10" />

						{children}
					</div>
				</div>

				{/* Bottom branding */}
				<div className="mt-2 flex items-center justify-center gap-2 px-1">
					<div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/20 to-transparent dark:via-white/20" />
					<span className="rounded-full border border-black/15 bg-black/[0.04] px-3 py-0.5 text-[10px] tracking-[0.25em] text-black/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-white/15 dark:bg-white/[0.04] dark:text-white/45 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
						MI
					</span>
					<div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/20 to-transparent dark:via-white/20" />
				</div>
			</div>

			{/* External glow effect */}
			<div className="pointer-events-none absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-b from-purple-500/[0.08] via-transparent to-cyan-500/[0.08] blur-xl dark:from-purple-500/10 dark:to-cyan-500/10" />
		</div>
	);
}
