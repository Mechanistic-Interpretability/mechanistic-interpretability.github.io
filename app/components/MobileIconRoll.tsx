"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { orbitingImages } from "@/config";

interface MobileIconRollProps {
	onImageClick?: (imageAlt: string) => void;
	onTerminalClick?: () => void;
}

export function MobileIconRoll({
	onImageClick,
	onTerminalClick,
}: MobileIconRollProps) {
	const [scrollProgress, setScrollProgress] = useState(0);

	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	const handleIconClick = (alt: string) => {
		if (alt === "Finder") {
			window.open("https://x.com/allenleexyz", "_blank");
		} else if (alt === "TT") {
			router.push("/hub");
		} else if (alt === "YouTube") {
			window.open(
				"https://www.youtube.com/playlist?list=PLVKInMnQd_D3dMw9WfDvZLJzUEDpAWnug",
				"_blank",
			);
		} else if (alt === "Terminal") {
			window.open(
				"https://scholar.google.com.tw/scholar?hl=en&as_sdt=0,5&as_vis=1&q=%22mechanistic+interpretability%22&scisbd=1",
				"_blank",
			);
		} else {
			onImageClick?.(alt);
		}
	};

	// Track scroll progress
	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		const handleScroll = () => {
			const progress =
				container.scrollLeft /
				(container.scrollWidth - container.clientWidth || 1);
			setScrollProgress(progress);
		};

		container.addEventListener("scroll", handleScroll);
		handleScroll();
		window.addEventListener("resize", handleScroll);

		return () => {
			container.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleScroll);
		};
	}, []);

	return (
		<div className="relative mx-auto w-full max-w-xs sm:hidden">
			{/* Icon row container */}
			<div
				className="relative overflow-hidden rounded-xl border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d8dfe8] to-[#a6b2bf] shadow-[0_12px_20px_rgba(15,23,42,0.15),inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-4px_8px_rgba(71,85,105,0.2)] dark:border-slate-500/70 dark:from-[#3a4350] dark:via-[#2a313a] dark:to-[#1a2028] dark:shadow-[0_14px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-4px_8px_rgba(0,0,0,0.4)]"
				style={{
					minHeight: "4.55rem",
					marginTop: "0.75rem",
					marginBottom: "0.5rem",
				}}
			>
				{/* Gradient fade overlay inside container */}
				<div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-6 bg-gradient-to-r from-white/40 to-transparent dark:from-black/30" />
				<div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-6 bg-gradient-to-l from-white/40 to-transparent dark:from-black/30" />
				{/* Plastic grain */}
				<div className="plastic-grain pointer-events-none absolute inset-0 rounded-xl" />
				{/* Shell highlight */}
				<div className="pointer-events-none absolute inset-x-4 top-1 h-3 rounded-full bg-white/50 blur-md dark:bg-white/10" />
				{/* Bottom lip */}
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 rounded-b-xl bg-gradient-to-t from-black/15 to-transparent" />
				{/* Corner screws */}
				<div className="pointer-events-none absolute left-2 top-2 h-1.5 w-1.5 rounded-full border border-slate-700/35 bg-gradient-to-b from-[#f3f7fc] to-[#95a3b3] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:border-white/20 dark:from-[#556171] dark:to-[#313946]" />
				<div className="pointer-events-none absolute right-2 top-2 h-1.5 w-1.5 rounded-full border border-slate-700/35 bg-gradient-to-b from-[#f3f7fc] to-[#95a3b3] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:border-white/20 dark:from-[#556171] dark:to-[#313946]" />

				{/* Icons row */}
				<div
					ref={scrollContainerRef}
					className="scrollbar-hide relative m-0.5 flex items-center justify-center gap-5 overflow-x-auto overflow-y-hidden rounded-lg border border-slate-500/45 bg-gradient-to-b from-[#e8edf3] to-[#bac5d2] shadow-[inset_0_2px_2px_rgba(255,255,255,0.65),inset_0_-2px_4px_rgba(15,23,42,0.2)] dark:border-slate-600/70 dark:from-[#212833] dark:to-[#131922] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-3px_6px_rgba(0,0,0,0.65)]"
					style={{
						WebkitOverflowScrolling: "touch",
						scrollSnapType: "x proximity",
						height: "4.55rem",
						minHeight: "4.55rem",
						maxHeight: "4.55rem",
						paddingTop: "0.65rem",
						paddingBottom: "0.65rem",
						paddingLeft: "1.3rem",
						paddingRight: "1.3rem",
					}}
				>
					{(() => {
						// TT (Blog), YouTube, Terminal, Finder (ale-dev)
						const desiredOrder = [
							"TT",
							"YouTube",
							"Terminal",
							"Finder",
						];

						const imageMap = new Map(
							orbitingImages.map((item) => [item.alt, item]),
						);

						const items = desiredOrder
							.map((alt) => {
								if (alt === "Terminal") {
									return (
										<MobileIconItem
											key="Terminal"
											image="/images/gs.png"
											alt="Terminal"
											onClick={() =>
												handleIconClick("Terminal")
											}
										/>
									);
								}
								if (alt === "YouTube") {
									return (
										<MobileIconItem
											key="YouTube"
											image="/images/yt.png"
											alt="YouTube"
											onClick={() =>
												handleIconClick("YouTube")
											}
										/>
									);
								}
								if (alt === "Finder") {
									return (
										<MobileIconItem
											key="Finder"
											image="/images/ale-dev.png"
											alt="Finder"
											onClick={() =>
												handleIconClick("Finder")
											}
										/>
									);
								}
								if (imageMap.has(alt)) {
									const item = imageMap.get(alt)!;
									return (
										<MobileIconItem
											key={item.alt}
											image={item.image}
											alt={item.alt}
											onClick={() =>
												handleIconClick(item.alt)
											}
										/>
									);
								}
								return null;
							})
							.filter(Boolean);

						return items;
					})()}
				</div>

				{/* Scroll progress indicator */}
				<div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10">
					<div
						className="h-full bg-gradient-to-r from-[#8f6df2] to-[#6b84ff] transition-all duration-300"
						style={{ width: `${scrollProgress * 100}%` }}
					/>
				</div>
			</div>
		</div>
	);
}

interface MobileIconItemProps {
	image: string;
	alt: string;
	onClick: () => void;
}

function MobileIconItem({ image, alt, onClick }: MobileIconItemProps) {
	return (
		<div
			style={{
				width: "3.9rem",
				flexShrink: 0,
				display: "flex",
				flexDirection: "column",
				gap: "0.325rem",
				alignItems: "center",
				scrollSnapAlign: "start",
			}}
		>
			<div
				className="relative overflow-hidden rounded-lg border border-slate-500/45 bg-gradient-to-b from-[#eef3f9] to-[#c3cdda] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_3px_rgba(15,23,42,0.28)] transition-all duration-300 hover:scale-105 hover:border-sky-400/70 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_4px_10px_rgba(56,189,248,0.22)] dark:border-slate-600/70 dark:from-[#252d38] dark:to-[#151b24] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_8px_rgba(0,0,0,0.5)] dark:hover:border-sky-400/60"
				style={{
					width: "3.9rem",
					height: "3.9rem",
					position: "relative",
				}}
			>
				<div className="plastic-grain pointer-events-none absolute inset-0 z-[1] rounded-lg" />
				<div className="pointer-events-none absolute inset-x-1.5 top-0.5 z-[2] h-1 rounded-full bg-white/45 blur-sm dark:bg-white/10" />
				<Image
					src={image}
					alt={alt}
					fill
					className="pointer-events-none object-cover p-1.5 transition-transform duration-300 hover:scale-105"
					sizes="64px"
					priority
				/>
				<button
					onClick={onClick}
					className="absolute inset-0 z-10 rounded-lg"
					aria-label={alt}
				/>
			</div>
		</div>
	);
}
