"use client";

import { RetroDesktop } from "@/components/RetroDesktop";

export function ClientLayout({ children }: { children: React.ReactNode }) {
	const handleClose = () => {
		window.location.href = "/";
	};

	const handleMinimize = () => {
		console.log("Window minimized");
	};

	return (
		<RetroDesktop onClose={handleClose} onMinimize={handleMinimize}>
			{children}
		</RetroDesktop>
	);
}
