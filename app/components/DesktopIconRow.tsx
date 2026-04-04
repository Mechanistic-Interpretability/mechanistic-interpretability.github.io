"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { orbitingImages } from "@/config";
import { PanelScrew } from "./PanelScrew";

interface DesktopIconRowProps {
	onImageClick?: (imageAlt: string) => void;
	onTerminalClick?: () => void;
}

export function DesktopIconRow({
	onImageClick,
	onTerminalClick,
}: DesktopIconRowProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const [scrollProgress, setScrollProgress] = useState(0);

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
		<div className="relative hidden w-full max-w-md px-4 md:block">
			{/* Icon row container */}
			<div
				className="relative overflow-hidden rounded-2xl border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d8dfe8] to-[#a6b2bf] shadow-[0_16px_28px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-6px_12px_rgba(71,85,105,0.24)] dark:border-slate-500/70 dark:from-[#3a4350] dark:via-[#2a313a] dark:to-[#1a2028] dark:shadow-[0_20px_36px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-6px_12px_rgba(0,0,0,0.45)]"
				style={{
					minHeight: "5.2rem",
					marginTop: "0.25rem",
					marginBottom: "0.75rem",
				}}
			>
				{/* Surface details */}
				<div className="plastic-grain pointer-events-none absolute inset-0 rounded-2xl" />
				<div className="pointer-events-none absolute inset-x-6 top-1.5 h-4 rounded-full bg-white/50 blur-md dark:bg-white/10" />
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/15 to-transparent" />
				<PanelScrew position="top-left" />
				<PanelScrew position="top-right" />

				{/* Icons row */}
				<div
					ref={scrollContainerRef}
					className="scrollbar-hide relative m-1 flex items-center justify-center gap-6 overflow-x-auto overflow-y-hidden rounded-xl border border-slate-500/45 bg-gradient-to-b from-[#e8edf3] to-[#bac5d2] shadow-[inset_0_2px_2px_rgba(255,255,255,0.65),inset_0_-3px_6px_rgba(15,23,42,0.2)] dark:border-slate-600/70 dark:from-[#212833] dark:to-[#131922] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-4px_9px_rgba(0,0,0,0.65)]"
					style={{
						height: "5.2rem",
						minHeight: "5.2rem",
						maxHeight: "5.2rem",
						paddingTop: "1rem",
						paddingBottom: "1rem",
						paddingLeft: "2rem",
						paddingRight: "2rem",
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

						// Create a map for quick lookup
						const imageMap = new Map(
							orbitingImages.map((item) => [item.alt, item]),
						);

						// Return items in the desired order
						const items = desiredOrder
							.map((alt) => {
								if (alt === "Terminal") {
									return (
										<DesktopIconItem
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
										<DesktopIconItem
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
										<DesktopIconItem
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
										<DesktopIconItem
											key={alt}
											image={item.image}
											alt={alt}
											onClick={() => handleIconClick(alt)}
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

interface DesktopIconItemProps {
	image: string;
	alt: string;
	onClick: () => void;
}

function DesktopIconItem({ image, alt, onClick }: DesktopIconItemProps) {
	return (
		<div
			style={{
				width: "4.55rem",
				flexShrink: 0,
				display: "flex",
				flexDirection: "column",
				gap: "0.5rem",
				alignItems: "center",
			}}
		>
			<div
				className="relative overflow-hidden rounded-xl border border-slate-500/45 bg-gradient-to-b from-[#eef3f9] to-[#c3cdda] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_3px_rgba(15,23,42,0.28)] transition-all duration-300 hover:scale-105 hover:border-sky-400/70 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_8px_16px_rgba(56,189,248,0.22)] dark:border-slate-600/70 dark:from-[#252d38] dark:to-[#151b24] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_8px_rgba(0,0,0,0.5)] dark:hover:border-sky-400/60"
				style={{
					width: "4.55rem",
					height: "4.55rem",
					position: "relative",
				}}
			>
				<div className="plastic-grain pointer-events-none absolute inset-0 z-[1] rounded-xl" />
				<div className="pointer-events-none absolute inset-x-2 top-0.5 z-[2] h-1.5 rounded-full bg-white/45 blur-sm dark:bg-white/10" />
				<Image
					src={image}
					alt={alt}
					fill
					className="object-cover p-2 transition-transform duration-300 hover:scale-105"
					sizes="80px"
					priority
				/>
				<button
					onClick={onClick}
					className="absolute inset-0 z-10 rounded-xl"
					aria-label={alt}
				/>
			</div>
		</div>
	);
}
