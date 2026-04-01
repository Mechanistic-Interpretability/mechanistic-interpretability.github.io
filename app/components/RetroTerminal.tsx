"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import allPosts from "@/lib/posts";

interface TerminalLine {
	type: "input" | "output" | "error" | "system" | "search-result" | "boot";
	content: string;
	href?: string;
	color?: string;
	isAnimated?: boolean;
}

interface SearchResult {
	post: (typeof allPosts)[0];
	score: number;
}

interface RetroTerminalProps {
	isOpen: boolean;
	onClose: () => void;
}

// Search function for blog posts
function searchPosts(query: string): SearchResult[] {
	if (!query.trim()) return [];

	const queryLower = query.toLowerCase();

	return allPosts
		.map((post) => {
			const titleLower = post.title.toLowerCase();
			const summaryLower = post.summary.toLowerCase();

			let score = 0;

			// Exact title match (highest priority)
			if (titleLower === queryLower) score += 100;
			// Title starts with query
			else if (titleLower.startsWith(queryLower)) score += 80;
			// Title contains query
			else if (titleLower.includes(queryLower)) score += 60;

			// Summary contains query
			if (summaryLower.includes(queryLower)) score += 40;

			// Fuzzy match for title
			if (score === 0) {
				let textIndex = 0;
				let fuzzyScore = 0;
				for (const char of queryLower) {
					const foundIndex = titleLower.indexOf(char, textIndex);
					if (foundIndex === -1) {
						fuzzyScore = 0;
						break;
					}
					fuzzyScore += 10;
					textIndex = foundIndex + 1;
				}
				score += fuzzyScore;
			}

			return { post, score };
		})
		.filter(({ score }) => score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, 8);
}

// Available sections for navigation
const SECTIONS: Record<
	string,
	{ icon: string; path: string; description: string }
> = {
	home: { icon: "🏠", path: "/", description: "Homepage" },
	blog: { icon: "📝", path: "/blog", description: "Blog posts" },
	memories: { icon: "📸", path: "/memories", description: "Photo memories" },
};

const COMMANDS: Record<
	string,
	{ description: string; action: () => string | null }
> = {
	help: {
		description: "Show available commands",
		action: () => null,
	},
	about: {
		description: "Display information about MI",
		action: () =>
			`This is an independent project focused on mechanistic interpretability. For questions, reach out to allenleexyz@gmail.com.`,
	},
	blog: {
		description: "Navigate to blog",
		action: () => null,
	},
	memories: {
		description: "Navigate to memories",
		action: () => null,
	},
	search: {
		description: "Search blog posts (usage: search <query>)",
		action: () => null,
	},
	ls: {
		description: "List available sections",
		action: () => null,
	},
	dir: {
		description: "List available sections (Windows style)",
		action: () => null,
	},
	cd: {
		description: "Navigate to section (usage: cd <section>)",
		action: () => null,
	},
	pwd: {
		description: "Show current location",
		action: () => null,
	},
	goto: {
		description: "Go to specific post (usage: goto <slug>)",
		action: () => null,
	},
	back: {
		description: "Return to previous page",
		action: () => null,
	},
	home: {
		description: "Go to homepage",
		action: () => null,
	},
	clear: {
		description: "Clear terminal",
		action: () => null,
	},
	exit: {
		description: "Close terminal",
		action: () => null,
	},
	ai: {
		description: "MI's AI Coming soon",
		action: () => "Coming soon...",
	},
};

// Rainbow-colored ASCII art for "MI"
const WELCOME_ART_LINES = [
	{ text: " __  __  _____", color: "#ff6b6b" },
	{ text: "|  \\  / ||_   _|", color: "#feca57" },
	{ text: "| \\  / |  | |", color: "#48dbfb" },
	{ text: "| |\\/| |  | |", color: "#ff9ff3" },
	{ text: "| |  | | _| |_", color: "#54a0ff" },
	{ text: "|_|  |_||_____|", color: "#5f27cd" },
];

// Boot sequence messages for cyber-terminal effect
const BOOT_SEQUENCE = [
	{ content: "Initializing system...", delay: 100 },
	{ content: "Loading kernel modules...", delay: 150 },
	{ content: "Mounting file systems...", delay: 120 },
	{ content: "Checking security protocols...", delay: 180 },
	{ content: "Establishing secure connection...", delay: 200 },
	{ content: "Decrypting welcome sequence...", delay: 250 },
];

// Glitch characters for matrix effect
const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#@$%&~";

export function RetroTerminal({ isOpen, onClose }: RetroTerminalProps) {
	const [lines, setLines] = useState<TerminalLine[]>([]);
	const [input, setInput] = useState("");
	const [history, setHistory] = useState<string[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [currentPath, setCurrentPath] = useState("/");
	const [isBooting, setIsBooting] = useState(false);
	const [showInput, setShowInput] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const terminalRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const { resolvedTheme } = useTheme();
	const isDark = resolvedTheme === "dark";

	// Animated typewriter effect for boot sequence
	const typeWriterEffect = useCallback(
		async (
			text: string,
			element: HTMLElement | null,
			baseDelay: number = 30,
			glitchProbability: number = 0.15,
		) => {
			if (!element) return;

			const chars = text.split("");
			let currentText = "";

			for (let i = 0; i < chars.length; i++) {
				// Random delay variation for natural typing
				const delay = baseDelay + Math.random() * 20;

				// Glitch effect before showing correct character
				if (Math.random() < glitchProbability) {
					const glitchChar =
						GLITCH_CHARS[
							Math.floor(Math.random() * GLITCH_CHARS.length)
						];
					element.textContent = currentText + glitchChar;
					await new Promise((resolve) =>
						setTimeout(resolve, delay * 0.5),
					);
				}

				currentText += chars[i];
				element.textContent = currentText;
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		},
		[],
	);

	// Matrix decode effect for ASCII art
	const decodeEffect = useCallback(
		async (
			targetText: string,
			element: HTMLElement | null,
			duration: number = 800,
		) => {
			if (!element) return;

			const chars = targetText.split("");
			const steps = 12;
			const stepDuration = duration / steps;

			for (let step = 0; step <= steps; step++) {
				const progress = step / steps;
				const revealedCount = Math.floor(progress * chars.length);

				let displayText = "";
				for (let i = 0; i < chars.length; i++) {
					if (i < revealedCount) {
						displayText += chars[i];
					} else if (chars[i] === " ") {
						displayText += " ";
					} else {
						displayText +=
							GLITCH_CHARS[
								Math.floor(Math.random() * GLITCH_CHARS.length)
							];
					}
				}

				element.textContent = displayText;
				await new Promise((resolve) =>
					setTimeout(resolve, stepDuration),
				);
			}

			element.textContent = targetText;
		},
		[],
	);

	// Initialize welcome message with animation
	useEffect(() => {
		if (!isOpen) {
			// Reset state when closed
			if (lines.length > 0) {
				setLines([]);
				setShowInput(false);
				setIsBooting(false);
			}
			return;
		}

		if (lines.length > 0 || isBooting) return;

		const runBootSequence = async () => {
			setIsBooting(true);
			setShowInput(false);

			// Add initial boot lines
			const bootLines: TerminalLine[] = [];

			// Phase 1: Boot messages with typewriter effect
			for (let i = 0; i < BOOT_SEQUENCE.length; i++) {
				const boot = BOOT_SEQUENCE[i];
				await new Promise((resolve) => setTimeout(resolve, boot.delay));

				bootLines.push({
					type: "boot",
					content: `[${new Date().toLocaleTimeString()}] ${boot.content}`,
					isAnimated: true,
				});
				setLines([...bootLines]);
			}

			// Phase 2: Pause before ASCII art
			await new Promise((resolve) => setTimeout(resolve, 400));

			// Phase 3: Add ASCII art lines with matrix decode effect
			const artLines: TerminalLine[] = [...bootLines];

			for (const line of WELCOME_ART_LINES) {
				artLines.push({
					type: "system",
					content: line.text,
					color: line.color,
					isAnimated: true,
				});
				setLines([...artLines]);
				await new Promise((resolve) => setTimeout(resolve, 200));
			}

			// Phase 4: System ready message
			await new Promise((resolve) => setTimeout(resolve, 300));

			const finalLines: TerminalLine[] = [
				...artLines,
				{ type: "system", content: "" },
				{
					type: "system",
					content: "Welcome to MI CLI v0.1",
					color: "#10b981",
				},
				{
					type: "system",
					content: 'Type "help" for available commands.',
				},
				{ type: "system", content: "" },
			];

			setLines(finalLines);
			setIsBooting(false);

			// Show input after a brief delay
			await new Promise((resolve) => setTimeout(resolve, 200));
			setShowInput(true);
		};

		runBootSequence();
	}, [isOpen, lines.length, isBooting]);

	// Auto-scroll to bottom
	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, [lines]);

	// Focus input when opened
	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	// Handle keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) return;

			if (e.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	const executeCommand = useCallback(
		(cmd: string) => {
			const trimmedCmd = cmd.trim().toLowerCase();

			// Add input line
			setLines((prev) => [
				...prev,
				{ type: "input", content: `> ${cmd}` },
			]);

			if (!trimmedCmd) return;

			// Add to history
			setHistory((prev) => [...prev, trimmedCmd]);
			setHistoryIndex(-1);

			// Check if it's a number selection for search results
			const num = parseInt(trimmedCmd, 10);
			if (!isNaN(num) && num > 0 && num <= searchResults.length) {
				const selected = searchResults[num - 1];
				if (selected) {
					onClose();
					router.push(`/blog/${selected.post._meta.path}`);
					setSearchResults([]);
					return;
				}
			}

			// Handle commands
			if (trimmedCmd === "help") {
				const helpText = Object.entries(COMMANDS)
					.map(
						([name, { description }]) =>
							`  ${name.padEnd(12)} ${description}`,
					)
					.join("\n");
				setLines((prev) => [
					...prev,
					{ type: "output", content: "Available commands:" },
					{ type: "output", content: helpText },
				]);
			} else if (trimmedCmd === "ls" || trimmedCmd === "dir") {
				// List available sections
				const sectionLines = [
					{ type: "output" as const, content: "Available sections:" },
					{ type: "output" as const, content: "" },
					...Object.entries(SECTIONS).map(
						([name, { icon, description }]) => ({
							type: "output" as const,
							content: `  ${icon}  ${name.padEnd(10)} ${description}`,
						}),
					),
					{ type: "output" as const, content: "" },
					{
						type: "output" as const,
						content: 'Use "cd <section>" to navigate',
					},
				];
				setLines((prev) => [...prev, ...sectionLines]);
			} else if (trimmedCmd.startsWith("cd ")) {
				// Change directory
				const section = trimmedCmd.slice(3).trim().toLowerCase();
				if (!section) {
					setLines((prev) => [
						...prev,
						{ type: "error", content: "Usage: cd <section>" },
						{ type: "output", content: "Available sections:" },
						...Object.entries(SECTIONS).map(
							([name, { icon, description }]) => ({
								type: "output" as const,
								content: `  ${icon}  ${name.padEnd(10)} ${description}`,
							}),
						),
					]);
				} else if (SECTIONS[section]) {
					setCurrentPath(SECTIONS[section].path);
					onClose();
					router.push(SECTIONS[section].path);
				} else {
					setLines((prev) => [
						...prev,
						{
							type: "error",
							content: `Section not found: ${section}`,
						},
						{ type: "output", content: "Available sections:" },
						...Object.entries(SECTIONS).map(
							([name, { icon, description }]) => ({
								type: "output" as const,
								content: `  ${icon}  ${name.padEnd(10)} ${description}`,
							}),
						),
					]);
				}
			} else if (trimmedCmd === "cd") {
				setLines((prev) => [
					...prev,
					{ type: "error", content: "Usage: cd <section>" },
					{ type: "output", content: "Example: cd blog" },
				]);
			} else if (trimmedCmd === "pwd") {
				// Show current path
				const breadcrumb =
					currentPath === "/"
						? "~"
						: currentPath.split("/").filter(Boolean).join(" > ");
				setLines((prev) => [
					...prev,
					{
						type: "output",
						content: `Current location: /${breadcrumb}`,
					},
				]);
			} else if (trimmedCmd.startsWith("goto ")) {
				// Go to specific blog post
				const slug = trimmedCmd.slice(5).trim();
				if (!slug) {
					setLines((prev) => [
						...prev,
						{ type: "error", content: "Usage: goto <slug>" },
						{ type: "output", content: "Example: goto matrix" },
					]);
				} else {
					const post = allPosts.find((p) => p._meta.path === slug);
					if (post) {
						setCurrentPath(`/blog/${slug}`);
						onClose();
						router.push(`/blog/${slug}`);
					} else {
						setLines((prev) => [
							...prev,
							{
								type: "error",
								content: `Post not found: ${slug}`,
							},
							{
								type: "output",
								content: "Use 'search <query>' to find posts",
							},
						]);
					}
				}
			} else if (trimmedCmd === "goto") {
				setLines((prev) => [
					...prev,
					{ type: "error", content: "Usage: goto <slug>" },
					{ type: "output", content: "Example: goto matrix" },
				]);
			} else if (trimmedCmd === "back") {
				// Navigate back
				onClose();
				router.back();
			} else if (trimmedCmd === "home") {
				// Go to homepage
				setCurrentPath("/");
				onClose();
				router.push("/");
			} else if (trimmedCmd === "clear") {
				setLines([]);
				setSearchResults([]);
			} else if (trimmedCmd === "exit") {
				onClose();
			} else if (trimmedCmd === "blog") {
				onClose();
				router.push("/blog");
			} else if (trimmedCmd === "memories") {
				onClose();
				router.push("/memories");
			} else if (
				trimmedCmd.startsWith("search ") ||
				trimmedCmd === "search"
			) {
				const query = cmd.slice(6).trim();
				if (!query) {
					setLines((prev) => [
						...prev,
						{ type: "error", content: "Usage: search <query>" },
						{ type: "output", content: "Example: search AI" },
					]);
				} else {
					const results = searchPosts(query);
					setSearchResults(results);

					if (results.length === 0) {
						setLines((prev) => [
							...prev,
							{
								type: "output",
								content: `No results found for "${query}"`,
							},
						]);
					} else {
						const resultLines: TerminalLine[] = [
							{
								type: "output",
								content: `Found ${results.length} result${results.length === 1 ? "" : "s"} for "${query}":`,
							},
							{ type: "output", content: "" },
						];

						results.forEach(({ post, score }, index) => {
							const relevance =
								score >= 80
									? "★★★"
									: score >= 60
										? "★★☆"
										: "★☆☆";
							resultLines.push({
								type: "search-result",
								content: `  [${index + 1}] ${post.title} ${relevance}`,
								href: `/blog/${post._meta.path}`,
							});
							resultLines.push({
								type: "output",
								content: `      ${post.summary.slice(0, 60)}${post.summary.length > 60 ? "..." : ""}`,
							});
							resultLines.push({ type: "output", content: "" });
						});

						resultLines.push({
							type: "output",
							content: "Type a number (1-8) to open a post.",
						});
						setLines((prev) => [...prev, ...resultLines]);
					}
				}
			} else if (COMMANDS[trimmedCmd]) {
				const result = COMMANDS[trimmedCmd].action();
				if (result) {
					setLines((prev) => [
						...prev,
						{ type: "output", content: result },
					]);
				}
			} else {
				setLines((prev) => [
					...prev,
					{
						type: "error",
						content: `Command not found: ${trimmedCmd}`,
					},
					{
						type: "error",
						content: 'Type "help" for available commands.',
					},
				]);
			}
		},
		[onClose, router, searchResults, currentPath],
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		executeCommand(input);
		setInput("");
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowUp") {
			e.preventDefault();
			if (historyIndex < history.length - 1) {
				const newIndex = historyIndex + 1;
				setHistoryIndex(newIndex);
				setInput(history[history.length - 1 - newIndex] || "");
			}
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			if (historyIndex > 0) {
				const newIndex = historyIndex - 1;
				setHistoryIndex(newIndex);
				setInput(history[history.length - 1 - newIndex] || "");
			} else if (historyIndex === 0) {
				setHistoryIndex(-1);
				setInput("");
			}
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity dark:bg-black/60"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Terminal Container */}
			<div
				className="animate-fade-in relative max-h-[90vh] w-full max-w-full overflow-y-auto sm:max-h-none sm:max-w-3xl"
				role="dialog"
				aria-modal="true"
				aria-label="Retro Terminal"
			>
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

							{/* Terminal Header */}
							<div className="flex items-center justify-between border-b border-slate-500/45 bg-gradient-to-b from-[#eaf0f6] to-[#c5d0dc] px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] dark:border-white/15 dark:bg-gradient-to-b dark:from-[#232a33] dark:to-[#141920] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:px-4 sm:py-2">
								<div className="flex items-center gap-2">
									{/* Classic rainbow logo */}
									<div className="flex h-2 w-2 items-center justify-center overflow-hidden rounded-full sm:h-3 sm:w-3">
										<div
											className="h-full w-full"
											style={{
												background:
													"conic-gradient(from 0deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #ff6b6b)",
												opacity: 0.8,
											}}
										/>
									</div>
									<span className="ml-1.5 text-[10px] font-medium tracking-wide text-black/60 dark:text-white/60 sm:ml-2 sm:text-xs">
										MI
									</span>
								</div>

								{/* Window controls */}
								<div className="flex items-center gap-1.5">
									<button
										onClick={onClose}
										className="group relative h-2 w-2 rounded-full border border-black/20 bg-gradient-to-b from-red-300 to-red-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_1px_2px_rgba(0,0,0,0.45)] transition-all hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_0_8px_rgba(239,68,68,0.55)] hover:brightness-110 sm:h-3 sm:w-3"
										aria-label="Close terminal"
									>
										<span className="absolute inset-0 flex items-center justify-center text-[5px] font-bold text-black/0 transition-all group-hover:text-black/60 sm:text-[6px]">
											×
										</span>
									</button>
									<div className="h-2 w-2 rounded-full border border-black/20 bg-gradient-to-b from-yellow-300 to-yellow-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_1px_2px_rgba(0,0,0,0.35)] sm:h-3 sm:w-3" />
									<div className="h-2 w-2 rounded-full border border-black/20 bg-gradient-to-b from-green-300 to-green-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_1px_2px_rgba(0,0,0,0.35)] sm:h-3 sm:w-3" />
								</div>
							</div>

							{/* Terminal Content */}
							<div
								ref={terminalRef}
								className="h-[50vh] overflow-y-auto p-2 font-mono text-xs sm:h-[400px] sm:p-4 sm:text-sm"
								onClick={() => inputRef.current?.focus()}
							>
								{/* Terminal lines */}
								{lines.map((line, index) => (
									<div
										key={index}
										className={`whitespace-pre-wrap leading-relaxed ${
											line.type === "input"
												? "text-cyan-700 dark:text-cyan-400/90"
												: line.type === "error"
													? "text-red-600 dark:text-red-400/90"
													: line.type === "boot"
														? "animate-pulse font-mono text-[10px] text-emerald-600 dark:text-emerald-400/80"
														: line.type === "system"
															? line.color
																? ""
																: "text-purple-700 dark:text-purple-400/90"
															: line.type ===
																  "search-result"
																? "cursor-pointer text-amber-600 hover:text-amber-700 hover:underline dark:text-yellow-400/90 dark:hover:text-yellow-300/90"
																: "text-black/80 dark:text-white/80"
										} ${line.isAnimated ? "animate-fade-in" : ""}`}
										style={{
											color: line.color || undefined,
											textShadow: line.color
												? `0 0 8px ${line.color}66`
												: line.type === "input"
													? isDark
														? "0 0 8px rgba(34,211,238,0.4)"
														: "none"
													: line.type === "boot"
														? isDark
															? "0 0 6px rgba(52,211,153,0.5)"
															: "0 0 4px rgba(16,185,129,0.3)"
														: line.type === "system"
															? isDark
																? "0 0 8px rgba(168,85,247,0.4)"
																: "none"
															: line.type ===
																  "search-result"
																? isDark
																	? "0 0 8px rgba(250,204,21,0.4)"
																	: "none"
																: isDark
																	? "0 0 4px rgba(255,255,255,0.2)"
																	: "none",
										}}
										onClick={() => {
											if (
												line.type === "search-result" &&
												line.href
											) {
												onClose();
												router.push(line.href);
											}
										}}
									>
										{line.content}
									</div>
								))}

								{/* Input line - only shown after boot */}
								{showInput && (
									<form
										onSubmit={handleSubmit}
										className="animate-fade-in flex items-center gap-2"
									>
										<span className="animate-pulse text-cyan-700 dark:text-cyan-400/90">
											{">"}
										</span>
										<input
											ref={inputRef}
											type="text"
											value={input}
											onChange={(e) =>
												setInput(e.target.value)
											}
											onKeyDown={handleKeyDown}
											className="flex-1 bg-transparent text-black/90 outline-none dark:text-white/90"
											style={{
												textShadow: isDark
													? "0 0 4px rgba(255,255,255,0.3)"
													: "none",
												caretColor: isDark
													? "rgba(34,211,238,0.9)"
													: "rgba(21,128,135,0.9)",
											}}
											placeholder=""
											autoComplete="off"
											autoCorrect="off"
											autoCapitalize="off"
											spellCheck="false"
										/>
									</form>
								)}
							</div>
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
		</div>
	);
}
