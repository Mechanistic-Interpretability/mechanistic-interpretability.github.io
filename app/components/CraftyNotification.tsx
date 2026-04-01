"use client";

import { useEffect, useState, useCallback } from "react";

interface CraftyNotificationProps {
	show: boolean;
	onHide: () => void;
}

export function CraftyNotification({ show, onHide }: CraftyNotificationProps) {
	const [phase, setPhase] = useState<"enter" | "typing" | "idle" | "exit">(
		"enter",
	);
	const [typedText, setTypedText] = useState("");
	const [progress, setProgress] = useState(0);
	const fullText = "Email Copied!";

	const reset = useCallback(() => {
		setPhase("enter");
		setTypedText("");
		setProgress(0);
	}, []);

	useEffect(() => {
		if (!show) {
			reset();
			return;
		}

		// Phase 1: entrance bounce
		const enterTimer = setTimeout(() => setPhase("typing"), 350);

		return () => clearTimeout(enterTimer);
	}, [show, reset]);

	// Typing animation
	useEffect(() => {
		if (phase !== "typing") return;

		if (typedText.length < fullText.length) {
			const timer = setTimeout(() => {
				setTypedText(fullText.slice(0, typedText.length + 1));
			}, 60);
			return () => clearTimeout(timer);
		} else {
			setPhase("idle");
		}
	}, [phase, typedText, fullText]);

	// Progress bar + auto-dismiss
	useEffect(() => {
		if (phase !== "idle") return;

		const startTime = Date.now();
		const duration = 2200;
		let raf: number;

		const tick = () => {
			const elapsed = Date.now() - startTime;
			const p = Math.min(elapsed / duration, 1);
			setProgress(p);

			if (p < 1) {
				raf = requestAnimationFrame(tick);
			} else {
				setPhase("exit");
				setTimeout(onHide, 400);
			}
		};

		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [phase, onHide]);

	if (!show) return null;

	const shellScale =
		phase === "enter"
			? "scale-0 opacity-0"
			: phase === "exit"
				? "scale-90 opacity-0"
				: "scale-100 opacity-100";

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/40"
				onClick={onHide}
			/>

			{/* Popup shell */}
			<div
				className={`relative w-72 transform transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] sm:w-80 ${shellScale}`}
			>
				{/* Outer shell */}
				<div className="relative rounded-2xl border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-2 shadow-[0_24px_50px_rgba(15,23,42,0.3),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-10px_18px_rgba(71,85,105,0.25)] dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_28px_56px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-10px_20px_rgba(0,0,0,0.5)] sm:rounded-[1.6rem] sm:p-3">
					{/* Plastic grain texture */}
					<div className="plastic-grain pointer-events-none absolute inset-0 rounded-2xl sm:rounded-[1.6rem]" />

					{/* Shell highlight */}
					<div className="pointer-events-none absolute inset-x-5 top-2 h-5 rounded-full bg-white/60 blur-md dark:bg-white/10" />
					<div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 rounded-b-2xl bg-gradient-to-t from-black/20 to-transparent sm:rounded-b-[1.6rem]" />

					{/* Inner bezel */}
					<div className="relative rounded-xl border border-slate-500/45 bg-gradient-to-b from-[#e8edf3] to-[#b9c4d1] p-1 shadow-[inset_0_2px_2px_rgba(255,255,255,0.65),inset_0_-3px_6px_rgba(15,23,42,0.22)] dark:border-slate-600/70 dark:from-[#202833] dark:to-[#141b24] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-4px_9px_rgba(0,0,0,0.65)] sm:rounded-2xl sm:p-1.5">
						{/* CRT screen */}
						<div className="relative overflow-hidden rounded-lg border border-slate-700/40 bg-[#edf2f8] shadow-[inset_0_0_1px_rgba(255,255,255,0.85),inset_0_0_70px_rgba(30,41,59,0.13)] dark:border-white/15 dark:bg-[#060606] dark:shadow-[inset_0_0_1px_rgba(255,255,255,0.16),inset_0_0_90px_rgba(0,0,0,0.9)] sm:rounded-xl">
							{/* Screen curvature */}
							<div className="pointer-events-none absolute inset-0 z-10 rounded-lg shadow-[inset_0_0_60px_rgba(0,0,0,0.12),inset_0_0_20px_rgba(255,255,255,0.1)] dark:shadow-[inset_0_0_70px_rgba(0,0,0,0.9),inset_0_0_25px_rgba(58,58,58,0.2)]" />

							{/* Scanlines */}
							<div
								className="pointer-events-none absolute inset-0 z-10 opacity-[0.04] dark:opacity-[0.1]"
								style={{
									backgroundImage:
										"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
								}}
							/>

							{/* Screen glow */}
							<div className="dark:from-purple-500/8 dark:to-cyan-500/8 pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-purple-500/[0.03] via-transparent to-cyan-500/[0.03]" />
							<div className="crt-flicker pointer-events-none absolute inset-0 z-10" />

							{/* Header bar */}
							<div className="flex items-center gap-2 border-b border-slate-500/45 bg-gradient-to-b from-[#eaf0f6] to-[#c5d0dc] px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] dark:border-white/15 dark:bg-gradient-to-b dark:from-[#232a33] dark:to-[#141920] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:px-4 sm:py-2">
								<div className="flex items-center gap-1.5">
									<div className="h-2.5 w-2.5 rounded-full border border-black/20 bg-gradient-to-b from-green-300 to-green-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_1px_2px_rgba(0,0,0,0.35)]" />
								</div>
								<span className="text-[9px] font-medium tracking-wide text-black/50 dark:text-white/40 sm:text-[10px]">
									SYSTEM
								</span>
							</div>

							{/* Content */}
							<div className="relative z-[5] flex flex-col items-center px-4 py-6 sm:px-6 sm:py-8">
								{/* Checkmark icon */}
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-green-500/30 bg-gradient-to-b from-green-200/60 to-green-400/30 shadow-[0_4px_12px_rgba(34,197,94,0.2),inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-green-500/40 dark:from-green-800/40 dark:to-green-900/30 dark:shadow-[0_4px_12px_rgba(34,197,94,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]">
									<svg
										className="h-6 w-6 text-green-600 dark:text-green-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2.5}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M5 13l4 4L19 7"
											style={{
												strokeDasharray: 24,
												strokeDashoffset:
													phase === "typing" ||
													phase === "idle"
														? 0
														: 24,
												transition:
													"stroke-dashoffset 0.4s ease 0.1s",
											}}
										/>
									</svg>
								</div>

								{/* Typing text */}
								<h3 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-100 sm:text-xl">
									{typedText}
									{(phase === "typing" ||
										typedText.length < fullText.length) && (
										<span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-zinc-900 dark:bg-zinc-100 sm:h-6" />
									)}
								</h3>

								{/* Email address */}
								<p className="font-mono text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
									allenleexyz@gmail.com
								</p>
							</div>

							{/* Progress bar */}
							<div className="h-1 bg-black/5 dark:bg-white/5">
								<div
									className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-none"
									style={{ width: `${progress * 100}%` }}
								/>
							</div>
						</div>
					</div>

					{/* Bottom branding strip */}
					<div className="mt-2 flex items-center justify-center gap-2 px-1">
						<div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/20 to-transparent dark:via-white/20" />
						<span className="rounded-full border border-black/15 bg-black/[0.04] px-3 py-0.5 text-[10px] tracking-[0.25em] text-black/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-white/15 dark:bg-white/[0.04] dark:text-white/45 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
							COPIED
						</span>
						<div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/20 to-transparent dark:via-white/20" />
					</div>
				</div>
			</div>
		</div>
	);
}
