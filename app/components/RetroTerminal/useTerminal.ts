"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import allPosts from "@/lib/posts";
import { searchPosts, type SearchResult } from "@/lib/search";
import {
	COMMANDS,
	COMMAND_NAMES,
	SECTIONS,
	generateFullHelp,
	generateQuickHelp,
} from "./commands";
import { findSimilarCommands } from "./animations";

export type TerminalLineType =
	| "input"
	| "output"
	| "error"
	| "system"
	| "search-result"
	| "boot"
	| "loading";

export interface TerminalLine {
	type: TerminalLineType;
	content: string;
	href?: string;
	color?: string;
	isAnimated?: boolean;
}

const STORAGE_KEY = "mi-terminal-state";

/**
 * Custom hook for terminal state management and command execution
 */
export function useTerminal(onClose: () => void) {
	const router = useRouter();
	const { resolvedTheme } = useTheme();
	const isDark = resolvedTheme === "dark";

	const [lines, setLines] = useState<TerminalLine[]>([]);
	const [input, setInput] = useState("");
	const [history, setHistory] = useState<string[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [currentPath, setCurrentPath] = useState("/");
	const [isBooting, setIsBooting] = useState(false);
	const [showInput, setShowInput] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [suggestions, setSuggestions] = useState<string[]>([]);

	const inputRef = useRef<HTMLInputElement>(null);
	const terminalRef = useRef<HTMLDivElement>(null);

	// Load persisted state on mount
	useEffect(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (parsed.history && Array.isArray(parsed.history)) {
					setHistory(parsed.history.slice(-50)); // Keep last 50 commands
				}
				if (parsed.currentPath) {
					setCurrentPath(parsed.currentPath);
				}
			}
		} catch {
			// Ignore localStorage errors
		}
	}, []);

	// Persist state on changes
	useEffect(() => {
		try {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					history,
					currentPath,
					lastAccessed: new Date().toISOString(),
				}),
			);
		} catch {
			// Ignore localStorage errors
		}
	}, [history, currentPath]);

	// Auto-scroll to bottom when lines change
	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, [lines]);

	// Add a line to the terminal output
	const addLine = useCallback((line: TerminalLine) => {
		setLines((prev) => [...prev, line]);
	}, []);

	// Add multiple lines at once (for batch output)
	const addLines = useCallback((newLines: TerminalLine[]) => {
		setLines((prev) => [...prev, ...newLines]);
	}, []);

	// Clear the terminal
	const clearTerminal = useCallback(() => {
		setLines([]);
		setSearchResults([]);
	}, []);

	// Execute a command
	const executeCommand = useCallback(
		(cmd: string) => {
			const trimmedCmd = cmd.trim().toLowerCase();

			// Add input line
			addLine({ type: "input", content: `> ${cmd}` });

			if (!trimmedCmd) return;

			// Add to history
			setHistory((prev) => [...prev.slice(-49), trimmedCmd]);
			setHistoryIndex(-1);
			setSuggestions([]);

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
			switch (trimmedCmd) {
				case "help":
					addLines(
						generateFullHelp().map((content) => ({
							type: "output" as const,
							content,
						})),
					);
					break;

				case "clear":
					clearTerminal();
					break;

				case "exit":
					onClose();
					break;

				case "ls":
				case "dir":
					addLine({ type: "output", content: "Available sections:" });
					addLine({ type: "output", content: "" });
					Object.entries(SECTIONS).forEach(
						([name, { icon, description }]) => {
							addLine({
								type: "output",
								content: `  ${icon}  ${name.padEnd(10)} ${description}`,
							});
						},
					);
					addLine({ type: "output", content: "" });
					addLine({
						type: "output",
						content: 'Use "cd <section>" to navigate',
					});
					break;

				case "pwd":
					const breadcrumb =
						currentPath === "/"
							? "~"
							: currentPath
									.split("/")
									.filter(Boolean)
									.join(" > ");
					addLine({
						type: "output",
						content: `Current location: /${breadcrumb}`,
					});
					break;

				case "home":
					setCurrentPath("/");
					onClose();
					router.push("/");
					break;

				case "blog":
					setCurrentPath("/blog");
					onClose();
					router.push("/blog");
					break;

				case "memories":
					setCurrentPath("/memories");
					onClose();
					router.push("/memories");
					break;

				case "back":
					onClose();
					router.back();
					break;

				default:
					// Handle commands with arguments
					if (trimmedCmd.startsWith("cd ")) {
						const section = trimmedCmd
							.slice(3)
							.trim()
							.toLowerCase();
						if (!section) {
							addLine({
								type: "error",
								content: "Usage: cd <section>",
							});
							addLine({
								type: "output",
								content: "Example: cd blog",
							});
						} else if (SECTIONS[section]) {
							setCurrentPath(SECTIONS[section].path);
							onClose();
							router.push(SECTIONS[section].path);
						} else {
							addLine({
								type: "error",
								content: `Section not found: ${section}`,
							});
							addLine({
								type: "output",
								content: "Available sections:",
							});
							Object.entries(SECTIONS).forEach(
								([name, { icon, description }]) => {
									addLine({
										type: "output",
										content: `  ${icon}  ${name.padEnd(10)} ${description}`,
									});
								},
							);
						}
					} else if (trimmedCmd.startsWith("goto ")) {
						const slug = trimmedCmd.slice(5).trim();
						if (!slug) {
							addLine({
								type: "error",
								content: "Usage: goto <slug>",
							});
							addLine({
								type: "output",
								content: "Example: goto matrix",
							});
						} else {
							const post = allPosts.find(
								(p) => p._meta.path === slug,
							);
							if (post) {
								setCurrentPath(`/blog/${slug}`);
								onClose();
								router.push(`/blog/${slug}`);
							} else {
								addLine({
									type: "error",
									content: `Post not found: ${slug}`,
								});
								addLine({
									type: "output",
									content:
										"Use 'search <query>' to find posts",
								});
							}
						}
					} else if (trimmedCmd.startsWith("search ")) {
						const query = cmd.slice(7).trim();
						if (!query) {
							addLine({
								type: "error",
								content: "Usage: search <query>",
							});
							addLine({
								type: "output",
								content: "Example: search AI",
							});
						} else {
							setIsLoading(true);

							// Simulate loading for better UX (even if fast)
							setTimeout(() => {
								const results = searchPosts(query);
								setSearchResults(results);
								setIsLoading(false);

								if (results.length === 0) {
									addLine({
										type: "output",
										content: `No results found for "${query}"`,
									});
								} else {
									addLine({
										type: "output",
										content: `Found ${results.length} result${results.length === 1 ? "" : "s"} for "${query}":`,
									});
									addLine({ type: "output", content: "" });

									results.forEach(
										({ post, score }, index) => {
											const relevance =
												score >= 80
													? "★★★"
													: score >= 60
														? "★★☆"
														: "★☆☆";
											addLine({
												type: "search-result",
												content: `  [${index + 1}] ${post.title} ${relevance}`,
												href: `/blog/${post._meta.path}`,
											});
											const summary =
												post.summary.slice(0, 60) +
												(post.summary.length > 60
													? "..."
													: "");
											addLine({
												type: "output",
												content: `      ${summary}`,
											});
											addLine({
												type: "output",
												content: "",
											});
										},
									);

									addLine({
										type: "output",
										content:
											"Type a number (1-8) to open a post.",
									});
								}
							}, 300);
						}
					} else if (COMMANDS[trimmedCmd]) {
						const result = COMMANDS[trimmedCmd].action();
						if (result) {
							addLine({ type: "output", content: result });
						}
					} else {
						// Command not found - suggest similar commands
						addLine({
							type: "error",
							content: `Command not found: ${trimmedCmd}`,
						});

						const similar = findSimilarCommands(
							trimmedCmd,
							COMMAND_NAMES,
						);
						if (similar.length > 0) {
							addLine({
								type: "output",
								content: `Did you mean: ${similar.join(", ")}?`,
							});
						}

						addLine({
							type: "output",
							content: 'Type "help" for available commands.',
						});
					}
			}
		},
		[
			addLine,
			addLines,
			clearTerminal,
			onClose,
			router,
			searchResults,
			currentPath,
		],
	);

	// Handle input submission
	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			executeCommand(input);
			setInput("");
			setSuggestions([]);
		},
		[input, executeCommand],
	);

	// Handle input changes with autocomplete
	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setInput(value);

			// Generate suggestions
			if (value.length > 0) {
				const matches = COMMAND_NAMES.filter((cmd) =>
					cmd.toLowerCase().startsWith(value.toLowerCase()),
				);
				setSuggestions(matches.slice(0, 5));
			} else {
				setSuggestions([]);
			}
		},
		[],
	);

	// Handle Tab key for autocomplete
	const handleTabComplete = useCallback(() => {
		if (suggestions.length > 0) {
			setInput(suggestions[0]);
			setSuggestions([]);
		}
	}, [suggestions]);

	// Handle keyboard navigation
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
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
			} else if (e.key === "Tab") {
				e.preventDefault();
				handleTabComplete();
			}
		},
		[history, historyIndex, handleTabComplete],
	);

	// Initialize boot sequence
	const runBootSequence = useCallback(
		async (skipBoot = false) => {
			if (skipBoot) {
				setShowInput(true);
				return;
			}

			setIsBooting(true);
			setShowInput(false);
			clearTerminal();

			// Boot messages
			const bootMessages = [
				"Initializing system...",
				"Loading kernel modules...",
				"Mounting file systems...",
				"Checking security protocols...",
				"Establishing secure connection...",
				"Decrypting welcome sequence...",
			];

			for (const message of bootMessages) {
				addLine({
					type: "boot",
					content: `[${new Date().toLocaleTimeString()}] ${message}`,
					isAnimated: true,
				});
				await new Promise((resolve) => setTimeout(resolve, 150));
			}

			// ASCII art
			await new Promise((resolve) => setTimeout(resolve, 400));

			const artLines = [
				{ text: " __  __  _____", color: "#ff6b6b" },
				{ text: "|  \\  / ||_   _|", color: "#feca57" },
				{ text: "| \\  / |  | |", color: "#48dbfb" },
				{ text: "| |\\/| |  | |", color: "#ff9ff3" },
				{ text: "| |  | | _| |_", color: "#54a0ff" },
				{ text: "|_|  |_||_____|", color: "#5f27cd" },
			];

			for (const line of artLines) {
				addLine({
					type: "system",
					content: line.text,
					color: line.color,
					isAnimated: true,
				});
				await new Promise((resolve) => setTimeout(resolve, 200));
			}

			// Welcome message
			await new Promise((resolve) => setTimeout(resolve, 300));
			addLine({ type: "system", content: "" });
			addLine({
				type: "system",
				content: "Welcome to MI CLI v0.1",
				color: "#10b981",
			});

			// Add quick help instead of just "Type 'help'"
			addLines(
				generateQuickHelp().map((content) => ({
					type: "output" as const,
					content,
				})),
			);

			setIsBooting(false);
			setTimeout(() => setShowInput(true), 200);
		},
		[addLine, addLines, clearTerminal],
	);

	// Navigate to a search result
	const navigateToResult = useCallback(
		(index: number) => {
			const result = searchResults[index];
			if (result) {
				onClose();
				router.push(`/blog/${result.post._meta.path}`);
				setSearchResults([]);
			}
		},
		[searchResults, onClose, router],
	);

	return {
		// State
		lines,
		input,
		history,
		historyIndex,
		searchResults,
		currentPath,
		isBooting,
		showInput,
		isLoading,
		suggestions,
		isDark,

		// Refs
		inputRef,
		terminalRef,

		// Actions
		setInput,
		setHistoryIndex,
		addLine,
		addLines,
		clearTerminal,
		executeCommand,
		handleSubmit,
		handleInputChange,
		handleKeyDown,
		handleTabComplete,
		runBootSequence,
		navigateToResult,
		setSearchResults,
	};
}
