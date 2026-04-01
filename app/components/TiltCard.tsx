"use client";

import { useRef, useState, useCallback, ReactNode } from "react";

interface TiltCardProps {
	children: ReactNode;
	className?: string;
	tiltAmount?: number;
	glareEnabled?: boolean;
	scale?: number;
}

export function TiltCard({
	children,
	className = "",
	tiltAmount = 10,
	glareEnabled = true,
	scale = 1.02,
}: TiltCardProps) {
	const cardRef = useRef<HTMLDivElement>(null);
	const [transform, setTransform] = useState("");
	const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
	const [isHovered, setIsHovered] = useState(false);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!cardRef.current) return;

			const rect = cardRef.current.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;

			const mouseX = e.clientX - centerX;
			const mouseY = e.clientY - centerY;

			const rotateX = (mouseY / (rect.height / 2)) * -tiltAmount;
			const rotateY = (mouseX / (rect.width / 2)) * tiltAmount;

			setTransform(
				`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
			);

			// Calculate glare position
			const glareX = ((e.clientX - rect.left) / rect.width) * 100;
			const glareY = ((e.clientY - rect.top) / rect.height) * 100;
			setGlarePosition({ x: glareX, y: glareY });
		},
		[tiltAmount, scale],
	);

	const handleMouseEnter = useCallback(() => {
		setIsHovered(true);
	}, []);

	const handleMouseLeave = useCallback(() => {
		setIsHovered(false);
		setTransform("");
	}, []);

	return (
		<div
			ref={cardRef}
			className={`relative ${className}`}
			onMouseMove={handleMouseMove}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			style={{
				transform:
					transform ||
					"perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
				transformStyle: "preserve-3d",
				transition: isHovered
					? "transform 0.1s ease-out"
					: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
			}}
		>
			{children}
			{glareEnabled && (
				<div
					className="rounded-inherit pointer-events-none absolute inset-0 overflow-hidden"
					style={{
						background: isHovered
							? `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)`
							: "none",
						transition: "background 0.1s ease-out",
						borderRadius: "inherit",
					}}
				/>
			)}
		</div>
	);
}
