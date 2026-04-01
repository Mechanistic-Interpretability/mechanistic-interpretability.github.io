"use client";

import { ReactNode } from "react";

interface HandDrawnBorderProps {
	children: ReactNode;
	className?: string;
	intensity?: "light" | "medium" | "heavy";
}

export function HandDrawnBorder({
	children,
	className = "",
	intensity = "medium",
}: HandDrawnBorderProps) {
	const intensityClasses = {
		light: "border-2",
		medium: "border-[3px]",
		heavy: "border-4",
	};

	return (
		<div className={`relative ${className}`}>
			{/* Hand-drawn effect using multiple border layers */}
			<div
				className={`absolute -inset-[2px] rounded-[inherit] ${intensityClasses[intensity]} border-purple-500/20`}
				style={{
					borderRadius: "inherit",
					transform: "rotate(0.5deg)",
				}}
			/>
			<div
				className={`absolute -inset-[2px] rounded-[inherit] ${intensityClasses[intensity]} border-cyan-500/20`}
				style={{
					borderRadius: "inherit",
					transform: "rotate(-0.5deg)",
				}}
			/>
			<div className="relative">{children}</div>
		</div>
	);
}
