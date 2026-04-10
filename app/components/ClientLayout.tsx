"use client";

import { RetroDesktop } from "@/components/RetroDesktop";
import { IconRowProvider, useIconRow } from "@/context/IconRowContext";
import { useEffect, useCallback } from "react";

function KeyboardHandler() {
	const { toggle } = useIconRow();

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key.toLowerCase() === "k" && event.metaKey) {
				event.preventDefault();
				toggle();
			}
		},
		[toggle],
	);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	return null;
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
	const handleClose = () => {
		window.location.href = "/";
	};

	return (
		<IconRowProvider>
			<KeyboardHandler />
			<RetroDesktop onClose={handleClose}>{children}</RetroDesktop>
		</IconRowProvider>
	);
}
