"use client";

import { useEffect, useRef } from "react";
import { MDXContent } from "@content-collections/mdx/react";
import Link from "next/link";
import { highlight } from "sugar-high";
import React from "react";
import type { Paper } from "@/lib/papers";

// MDX Helper Components
function CustomImage(props: any) {
	return (
		// eslint-disable-next-line jsx-a11y/alt-text, jsx-a11y/img-redundant-alt
		<img {...props} className="rounded-lg drop-shadow-sm" alt={props.alt} />
	);
}

function CustomLink(props: any) {
	const href = props.href as string;

	if (href.startsWith("/")) {
		return (
			<Link
				{...props}
				className={"gradient-link " + (props.className || "")}
			/>
		);
	}

	if (href.startsWith("#")) {
		return (
			<a
				{...props}
				className={"gradient-link " + (props.className || "")}
			/>
		);
	}

	return (
		<a
			target="_blank"
			{...props}
			className={"gradient-link " + (props.className || "")}
		/>
	);
}

function CustomCode({ children, ...props }: any) {
	const html = highlight(children);
	return <code {...props} dangerouslySetInnerHTML={{ __html: html }} />;
}

function createHeadingComponent(level: number) {
	return function CustomHeading({
		children,
	}: React.HTMLAttributes<HTMLHeadingElement>) {
		const slug = (children || "")
			.toString()
			.toLowerCase()
			.trim()
			.replace(/\s+/g, "-")
			.replace(/[^\w-]+/g, "")
			.replace(/--+/g, "-");

		const Heading = `h${level}` as keyof React.JSX.IntrinsicElements;
		return (
			<Heading id={slug} className="relative w-fit">
				<a
					href={`#${slug}`}
					className="absolute ml-[-1em] h-full w-[calc(100%+1em)] no-underline before:inline-block before:scale-90 before:text-zinc-400 before:opacity-0 before:transition before:content-['#'] hover:before:scale-100 hover:before:opacity-100 before:dark:text-zinc-600"
					aria-hidden
				/>
				{children}
			</Heading>
		);
	};
}

interface PaperDetailProps {
	paper: Paper | null;
	isOpen: boolean;
	onClose: () => void;
}

export default function PaperDetail({
	paper,
	isOpen,
	onClose,
}: PaperDetailProps) {
	const drawerRef = useRef<HTMLDivElement>(null);

	// Handle click outside to close
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				drawerRef.current &&
				!drawerRef.current.contains(e.target as Node)
			) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			// Prevent body scroll when drawer is open
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.body.style.overflow = "";
		};
	}, [isOpen, onClose]);

	if (!paper) return null;

	// Get venue badge color
	const getVenueColor = (venue: string) => {
		const venueColors: Record<string, string> = {
			NeurIPS:
				"bg-amber-500/20 text-amber-700 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300",
			ICML: "bg-blue-500/20 text-blue-700 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-300",
			ICLR: "bg-purple-500/20 text-purple-700 border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-300",
			CVPR: "bg-pink-500/20 text-pink-700 border-pink-500/30 dark:bg-pink-500/20 dark:text-pink-300",
			NAACL: "bg-cyan-500/20 text-cyan-700 border-cyan-500/30 dark:bg-cyan-500/20 dark:text-cyan-300",
			Nature: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300",
			Science:
				"bg-red-500/20 text-red-700 border-red-500/30 dark:bg-red-500/20 dark:text-red-300",
			arXiv: "bg-slate-500/20 text-slate-700 border-slate-500/30 dark:bg-slate-500/20 dark:text-slate-300",
		};
		return (
			venueColors[venue] ||
			"bg-violet-500/20 text-violet-700 border-violet-500/30 dark:bg-violet-500/20 dark:text-violet-300"
		);
	};

	return (
		<>
			{/* Backdrop overlay */}
			<div
				className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 dark:bg-black/80 ${
					isOpen ? "opacity-100" : "pointer-events-none opacity-0"
				}`}
			/>

			{/* Drawer panel */}
			<div
				ref={drawerRef}
				className={`fixed right-0 top-0 z-50 h-full w-full max-w-2xl transform transition-transform duration-300 ease-out ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				{/* Outer shell */}
				<div className="h-full overflow-hidden rounded-l-2xl border-l border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-2 shadow-[-12px_0_28px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-6px_12px_rgba(71,85,105,0.25)] dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[-16px_0_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-6px_14px_rgba(0,0,0,0.5)] sm:rounded-l-[1.4rem] sm:p-3">
					{/* Plastic grain */}
					<div className="plastic-grain pointer-events-none absolute inset-0 rounded-l-2xl sm:rounded-l-[1.4rem]" />

					{/* Close button */}
					<button
						onClick={onClose}
						className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-slate-500/45 bg-gradient-to-b from-[#eef3f9] to-[#c3cdda] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_3px_rgba(15,23,42,0.2)] transition-all hover:scale-110 dark:border-slate-600/70 dark:from-[#252d38] dark:to-[#151b24] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_8px_rgba(0,0,0,0.4)]"
					>
						<svg
							className="h-5 w-5 text-slate-700 dark:text-slate-300"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>

					{/* Inner bezel */}
					<div className="relative h-full overflow-hidden rounded-xl border border-slate-500/45 bg-gradient-to-b from-[#e8edf3] to-[#b9c4d1] shadow-[inset_0_2px_2px_rgba(255,255,255,0.65),inset_0_-3px_6px_rgba(15,23,42,0.22)] dark:border-slate-600/70 dark:from-[#202833] dark:to-[#141b24] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-4px_9px_rgba(0,0,0,0.65)] sm:rounded-2xl">
						{/* Content area with scroll */}
						<div className="relative h-full overflow-y-auto overflow-x-hidden bg-[#edf2f8] dark:bg-[#0a0a0a]">
							{/* Top shadow overlay for depth */}
							<div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black/5 to-transparent dark:from-black/20" />

							{/* Bottom shadow overlay for depth */}
							<div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-black/5 to-transparent dark:from-black/20" />

							<div className="relative z-0 p-6">
								{/* Paper header */}
								<div className="mb-6">
									{/* Venue and year badges */}
									<div className="mb-3 flex items-center gap-2">
										<span
											className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold tracking-wider ${getVenueColor(
												paper.venue,
											)}`}
										>
											{paper.venue}
										</span>
										<span className="font-mono text-xs text-violet-600 dark:text-violet-400">
											{paper.year}
										</span>
									</div>

									{/* Title */}
									<h2 className="mb-4 text-2xl font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
										{paper.title}
									</h2>

									{/* Authors */}
									<div className="mb-4">
										<p className="text-sm font-medium text-violet-600 dark:text-violet-400">
											Authors
										</p>
										<p className="text-sm italic text-slate-600 dark:text-slate-400">
											{paper.authors.join(", ")}
										</p>
									</div>

									{/* Category */}
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 rounded-full bg-violet-500" />
										<span className="text-xs font-medium uppercase tracking-wider text-violet-600 dark:text-violet-400">
											{paper.category}
										</span>
									</div>
								</div>

								{/* Abstract section */}
								<div className="mb-6 rounded-xl border border-slate-400/30 bg-white/60 p-4 dark:border-slate-600/30 dark:bg-slate-800/40">
									<h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
										Abstract
									</h3>
									<p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
										{paper.abstract}
									</p>
								</div>

								{/* URL Section */}
								<div className="mb-6">
									<h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
										URL
									</h3>
									<div className="flex items-center gap-2 rounded-lg border border-slate-400/50 bg-slate-100/80 px-3 py-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] dark:border-slate-600/50 dark:bg-slate-800/60 dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]">
										<span className="font-mono text-xs text-violet-600 dark:text-violet-400">
											🔗
										</span>
										{paper.url ? (
											<a
												href={paper.url}
												target="_blank"
												rel="noopener noreferrer"
												className="flex-1 truncate font-mono text-xs text-slate-600 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
											>
												{paper.url}
											</a>
										) : (
											<span className="flex-1 truncate font-mono text-xs text-slate-400 dark:text-slate-500">
												No URL available
											</span>
										)}
										{paper.url && (
											<a
												href={paper.url}
												target="_blank"
												rel="noopener noreferrer"
												className="ml-2 inline-flex items-center rounded-md border border-violet-400/40 bg-white px-2 py-0.5 text-[10px] font-medium text-violet-600 transition-all hover:border-violet-500/60 hover:bg-violet-50 dark:border-violet-500/30 dark:bg-slate-700 dark:text-violet-400 dark:hover:border-violet-400/50 dark:hover:bg-violet-900/30"
											>
												<svg
													className="mr-1 h-3 w-3"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
													/>
												</svg>
												Open
											</a>
										)}
									</div>
								</div>

								{/* MDX Content */}
								{paper.mdx && (
									<div className="prose prose-zinc max-w-none dark:prose-invert">
										<MDXContent
											code={paper.mdx}
											components={{
												img: CustomImage,
												a: CustomLink,
												code: CustomCode,
												h1: createHeadingComponent(1),
												h2: createHeadingComponent(2),
												h3: createHeadingComponent(3),
												h4: createHeadingComponent(4),
												h5: createHeadingComponent(5),
												h6: createHeadingComponent(6),
											}}
										/>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
