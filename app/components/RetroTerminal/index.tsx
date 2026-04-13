"use client";

import { useEffect, useCallback } from "react";
import { TerminalShell } from "./TerminalShell";
import { TerminalContent } from "./TerminalContent";
import { useTerminal } from "./useTerminal";

interface RetroTerminalProps {
	isOpen: boolean;
	onClose: () => void;
	skipBoot?: boolean;
}

export function RetroTerminal({
	isOpen,
	onClose,
	skipBoot = false,
}: RetroTerminalProps) {
	const {
		lines,
		input,
		showInput,
		isDark,
		isLoading,
		suggestions,
		inputRef,
		terminalRef,
		handleSubmit,
		handleInputChange,
		handleKeyDown,
		runBootSequence,
	} = useTerminal(onClose);

	// Run boot sequence when opened
	useEffect(() => {
		if (isOpen) {
			runBootSequence(skipBoot);
		}
	}, [isOpen, runBootSequence, skipBoot]);

	// Focus input when opened
	useEffect(() => {
		if (isOpen && showInput && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen, showInput, inputRef]);

	// Handle keyboard shortcuts (Escape to close)
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

	// Handle click on search result line
	const handleLineClick = useCallback(
		(href: string) => {
			onClose();
			window.location.href = href;
		},
		[onClose],
	);

	// Handle swipe to close on mobile
	const handleTouchStart = useCallback(
		(e: React.TouchEvent) => {
			const touch = e.touches[0];
			const startY = touch.clientY;

			const handleTouchMove = (e: TouchEvent) => {
				const touch = e.touches[0];
				const diff = startY - touch.clientY;

				// If swiping down more than 100px, close
				if (diff < -100) {
					onClose();
					document.removeEventListener("touchmove", handleTouchMove);
				}
			};

			document.addEventListener("touchmove", handleTouchMove);
		},
		[onClose],
	);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity dark:bg-black/60"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Terminal */}
			<div
				role="dialog"
				aria-modal="true"
				aria-label="Retro Terminal"
				onTouchStart={handleTouchStart}
			>
				<TerminalShell>
					<TerminalContent
						lines={lines}
						input={input}
						showInput={showInput}
						isDark={isDark}
						isLoading={isLoading}
						suggestions={suggestions}
						onInputChange={handleInputChange}
						onInputKeyDown={handleKeyDown}
						onSubmit={handleSubmit}
						onLineClick={handleLineClick}
						inputRef={inputRef}
						terminalRef={terminalRef}
					/>
				</TerminalShell>
			</div>
		</div>
	);
}

// Re-export types for external use
export type { TerminalLine, TerminalLineType } from "./useTerminal";
