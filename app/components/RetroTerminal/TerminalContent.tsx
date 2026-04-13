"use client";

import { useEffect, useRef, useCallback } from "react";
import type { TerminalLine, TerminalLineType } from "./useTerminal";

interface TerminalContentProps {
	lines: TerminalLine[];
	input: string;
	showInput: boolean;
	isDark: boolean;
	isLoading: boolean;
	suggestions: string[];
	onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	onSubmit: (e: React.FormEvent) => void;
	onLineClick?: (href: string) => void;
	inputRef: React.RefObject<HTMLInputElement>;
	terminalRef: React.RefObject<HTMLDivElement>;
}

export function TerminalContent({
	lines,
	input,
	showInput,
	isDark,
	isLoading,
	suggestions,
	onInputChange,
	onInputKeyDown,
	onSubmit,
	onLineClick,
	inputRef,
	terminalRef,
}: TerminalContentProps) {
	// Focus trap for accessibility
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Tab") {
				// Keep focus within the terminal
				const focusableElements = terminalRef.current?.querySelectorAll(
					'input, button, [href], [tabindex]:not([tabindex="-1"])',
				);
				if (!focusableElements || focusableElements.length === 0)
					return;

				const firstElement = focusableElements[0] as HTMLElement;
				const lastElement = focusableElements[
					focusableElements.length - 1
				] as HTMLElement;

				if (e.shiftKey) {
					if (document.activeElement === firstElement) {
						e.preventDefault();
						lastElement.focus();
					}
				} else {
					if (document.activeElement === lastElement) {
						e.preventDefault();
						firstElement.focus();
					}
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [terminalRef]);

	// Handle click on search result lines
	const handleLineClick = useCallback(
		(line: TerminalLine) => {
			if (line.type === "search-result" && line.href && onLineClick) {
				onLineClick(line.href);
			}
		},
		[onLineClick],
	);

	return (
		<>
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
					<div className="h-2 w-2 rounded-full border border-black/20 bg-gradient-to-b from-red-300 to-red-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_1px_2px_rgba(0,0,0,0.45)] sm:h-3 sm:w-3" />
					<div className="h-2 w-2 rounded-full border border-black/20 bg-gradient-to-b from-yellow-300 to-yellow-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_1px_2px_rgba(0,0,0,0.35)] sm:h-3 sm:w-3" />
					<div className="h-2 w-2 rounded-full border border-black/20 bg-gradient-to-b from-green-300 to-green-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_1px_2px_rgba(0,0,0,0.35)] sm:h-3 sm:w-3" />
				</div>
			</div>

			{/* Terminal Content */}
			<div
				ref={terminalRef}
				className="max-h-[60vh] overflow-y-auto p-2 font-mono text-xs sm:max-h-[400px] sm:p-4 sm:text-sm"
				onClick={() => inputRef.current?.focus()}
			>
				{/* Terminal lines */}
				{lines.map((line, index) => (
					<div
						key={index}
						className={`whitespace-pre-wrap leading-relaxed ${getLineClass(
							line.type,
							isDark,
						)} ${line.isAnimated ? "animate-fade-in" : ""}`}
						style={getLineStyle(line, isDark)}
						onClick={() => handleLineClick(line)}
					>
						{line.content}
					</div>
				))}

				{/* Loading indicator */}
				{isLoading && (
					<div className="animate-pulse text-emerald-600 dark:text-emerald-400">
						Searching...
					</div>
				)}

				{/* Input line - only shown after boot */}
				{showInput && (
					<form
						onSubmit={onSubmit}
						className="animate-fade-in flex items-center gap-2"
					>
						<span className="animate-pulse text-cyan-700 dark:text-cyan-400/90">
							{">"}
						</span>
						<input
							ref={inputRef}
							type="text"
							value={input}
							onChange={onInputChange}
							onKeyDown={onInputKeyDown}
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
							aria-label="Terminal input"
						/>
					</form>
				)}

				{/* Command suggestions */}
				{suggestions.length > 0 && showInput && (
					<div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
						<span className="text-slate-400">Suggestions:</span>{" "}
						{suggestions.map((s, i) => (
							<span key={s}>
								<span
									className="cursor-pointer text-cyan-600 hover:underline dark:text-cyan-400"
									onClick={() => {
										if (inputRef.current) {
											inputRef.current.value = s;
											inputRef.current.focus();
										}
									}}
								>
									{s}
								</span>
								{i < suggestions.length - 1 && ", "}
							</span>
						))}
					</div>
				)}
			</div>
		</>
	);
}

function getLineClass(type: TerminalLineType, isDark: boolean): string {
	switch (type) {
		case "input":
			return "text-cyan-700 dark:text-cyan-400/90";
		case "error":
			return "text-red-600 dark:text-red-400/90";
		case "boot":
			return "animate-pulse font-mono text-[10px] text-emerald-600 dark:text-emerald-400/80";
		case "system":
			return "text-purple-700 dark:text-purple-400/90";
		case "search-result":
			return "cursor-pointer text-amber-600 hover:text-amber-700 hover:underline dark:text-yellow-400/90 dark:hover:text-yellow-300/90";
		case "loading":
			return "animate-pulse text-emerald-600 dark:text-emerald-400";
		default:
			return "text-black/80 dark:text-white/80";
	}
}

function getLineStyle(
	line: TerminalLine,
	isDark: boolean,
): React.CSSProperties {
	const baseStyle: React.CSSProperties = {};

	if (line.color) {
		baseStyle.color = line.color;
		baseStyle.textShadow = `0 0 8px ${line.color}66`;
	} else if (line.type === "input") {
		baseStyle.textShadow = isDark ? "0 0 8px rgba(34,211,238,0.4)" : "none";
	} else if (line.type === "boot") {
		baseStyle.textShadow = isDark
			? "0 0 6px rgba(52,211,153,0.5)"
			: "0 0 4px rgba(16,185,129,0.3)";
	} else if (line.type === "system") {
		baseStyle.textShadow = isDark ? "0 0 8px rgba(168,85,247,0.4)" : "none";
	} else if (line.type === "search-result") {
		baseStyle.textShadow = isDark ? "0 0 8px rgba(250,204,21,0.4)" : "none";
	} else if (isDark) {
		baseStyle.textShadow = "0 0 4px rgba(255,255,255,0.2)";
	}

	return baseStyle;
}
