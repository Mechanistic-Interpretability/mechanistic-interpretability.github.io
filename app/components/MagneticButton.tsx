"use client";

import { useRef, useState, useCallback, ReactNode } from "react";

interface MagneticButtonProps {
	children: ReactNode;
	className?: string;
	onClick?: () => void;
	strength?: number;
	"aria-label"?: string;
	title?: string;
}

export function MagneticButton({
	children,
	className = "",
	onClick,
	strength = 0.3,
	"aria-label": ariaLabel,
	title,
}: MagneticButtonProps) {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [position, setPosition] = useState({ x: 0, y: 0 });

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			if (!buttonRef.current) return;

			const rect = buttonRef.current.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;

			const deltaX = (e.clientX - centerX) * strength;
			const deltaY = (e.clientY - centerY) * strength;

			setPosition({ x: deltaX, y: deltaY });
		},
		[strength],
	);

	const handleMouseLeave = useCallback(() => {
		setPosition({ x: 0, y: 0 });
	}, []);

	return (
		<button
			ref={buttonRef}
			className={className}
			onClick={onClick}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			aria-label={ariaLabel}
			title={title}
			style={{
				transform: `translate(${position.x}px, ${position.y}px)`,
				transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
			}}
		>
			{children}
		</button>
	);
}
