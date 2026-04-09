"use client";

import { RetroDesktop } from "@/components/RetroDesktop";
import { IconRowProvider, useIconRow } from "@/context/IconRowContext";
import { useEffect, useCallback } from "react";

function KeyboardHandler() {
	const { toggle, isVisible } = useIconRow();

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key.toLowerCase() === "k" && event.metaKey) {
				event.preventDefault();
				toggle();
				console.log(
					"Cmd+K pressed, toggling visibility to:",
					!isVisible,
				);
			}
		},
		[toggle, isVisible],
	);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		console.log("Keyboard listener attached");
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			console.log("Keyboard listener removed");
		};
	}, [handleKeyDown]);

	return null;
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
	const handleClose = () => {
		window.location.href = "/";
	};

	const handleMinimize = () => {
		console.log("Window minimized");
	};

	return (
		<IconRowProvider>
			<KeyboardHandler />
			<RetroDesktop onClose={handleClose} onMinimize={handleMinimize}>
				{children}
			</RetroDesktop>
		</IconRowProvider>
	);
}
