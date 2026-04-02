"use client";

import { useState, useEffect } from "react";
import { PanelScrew } from "./PanelScrew";

interface CRTTypographyProps {
	text: string;
	speed?: number;
	className?: string;
	autoDisappear?: boolean;
	disappearDelay?: number;
}

export function CRTTypography({
	text,
	speed = 80,
	className = "",
	autoDisappear = true,
	disappearDelay = 3000,
}: CRTTypographyProps) {
	const [displayText, setDisplayText] = useState("");
	const [showCursor, setShowCursor] = useState(true);
	const [isTypingComplete, setIsTypingComplete] = useState(false);
	const [opacity, setOpacity] = useState(1);
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		let currentIndex = 0;
		const interval = setInterval(() => {
			if (currentIndex <= text.length) {
				setDisplayText(text.slice(0, currentIndex));
				currentIndex++;
			} else {
				clearInterval(interval);
				setIsTypingComplete(true);
			}
		}, speed);

		return () => clearInterval(interval);
	}, [text, speed]);

	useEffect(() => {
		const cursorInterval = setInterval(() => {
			setShowCursor((prev) => !prev);
		}, 530);

		return () => clearInterval(cursorInterval);
	}, []);

	// Auto-disappear effect
	useEffect(() => {
		if (!autoDisappear || !isTypingComplete) return;

		// Start fade out after disappearDelay
		const fadeTimer = setTimeout(() => {
			setOpacity(0);
		}, disappearDelay);

		// Remove from DOM after fade animation
		const hideTimer = setTimeout(() => {
			setIsVisible(false);
		}, disappearDelay + 800);

		return () => {
			clearTimeout(fadeTimer);
			clearTimeout(hideTimer);
		};
	}, [autoDisappear, isTypingComplete, disappearDelay]);

	if (!isVisible) return null;

	return (
		<div
			className={`relative hidden w-full max-w-lg transition-opacity duration-700 ease-out lg:block ${className}`}
			style={{ opacity }}
		>
			{/* Main panel container - matches DesktopIconRow style */}
			<div
				className="relative overflow-hidden rounded-2xl border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d8dfe8] to-[#a6b2bf] shadow-[0_16px_28px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-6px_12px_rgba(71,85,105,0.24)] dark:border-slate-500/70 dark:from-[#3a4350] dark:via-[#2a313a] dark:to-[#1a2028] dark:shadow-[0_20px_36px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-6px_12px_rgba(0,0,0,0.45)]"
				style={{
					minHeight: "4.5rem",
					marginBottom: "0.5rem",
				}}
			>
				{/* Surface details */}
				<div className="plastic-grain pointer-events-none absolute inset-0 rounded-2xl" />
				<div className="pointer-events-none absolute inset-x-6 top-1.5 h-4 rounded-full bg-white/50 blur-md dark:bg-white/10" />
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/15 to-transparent" />
				<PanelScrew position="top-left" />
				<PanelScrew position="top-right" />

				{/* Screen/display area - Light mode matches RetroTerminal design */}
				<div
					className="relative m-1 flex items-center justify-center overflow-hidden rounded-xl border border-slate-500/45 bg-[#edf2f8] shadow-[inset_0_0_1px_rgba(255,255,255,0.85),inset_0_0_30px_rgba(30,41,59,0.08)] dark:border-slate-600/70 dark:bg-gradient-to-b dark:from-[#1a2028] dark:to-[#0f1419] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.15)]"
					style={{
						height: "4.5rem",
						minHeight: "4.5rem",
						maxHeight: "4.5rem",
						paddingLeft: "1.5rem",
						paddingRight: "1.5rem",
					}}
				>
					{/* Screen scanlines and effects - lighter in light mode */}
					<div className="screen-scanlines absolute inset-0 opacity-[0.03] dark:opacity-30" />
					<div className="crt-flicker absolute inset-0 opacity-10 dark:opacity-20" />

					{/* Light mode screen curvature */}
					<div className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_0_60px_rgba(0,0,0,0.06),inset_0_0_20px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_0_30px_rgba(0,0,0,0.4)]" />

					{/* Text content - colors matching RetroTerminal light mode */}
					<div className="relative z-10 flex items-center">
						<h1 className="font-mono text-xl font-semibold tracking-wide text-emerald-700 drop-shadow-[0_0_6px_rgba(16,185,129,0.3)] dark:text-emerald-400 dark:drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]">
							{displayText}
							<span
								className={`ml-0.5 inline-block transition-opacity duration-100 ${showCursor ? "opacity-100" : "opacity-0"}`}
							>
								▮
							</span>
						</h1>
					</div>
				</div>
			</div>
		</div>
	);
}
