"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollRevealProps {
	children: ReactNode;
	className?: string;
	delay?: number;
	direction?: "up" | "down" | "left" | "right";
	duration?: number;
	threshold?: number;
}

export function ScrollReveal({
	children,
	className = "",
	delay = 0,
	direction = "up",
	duration = 0.6,
	threshold = 0.1,
}: ScrollRevealProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.unobserve(entry.target);
				}
			},
			{ threshold },
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => {
			if (ref.current) {
				observer.unobserve(ref.current);
			}
		};
	}, [threshold]);

	const getInitialTransform = () => {
		switch (direction) {
			case "up":
				return "translateY(30px)";
			case "down":
				return "translateY(-30px)";
			case "left":
				return "translateX(30px)";
			case "right":
				return "translateX(-30px)";
			default:
				return "translateY(30px)";
		}
	};

	return (
		<div
			ref={ref}
			className={className}
			style={{
				opacity: isVisible ? 1 : 0,
				transform: isVisible
					? "translate(0, 0)"
					: getInitialTransform(),
				transition: `opacity ${duration}s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s, transform ${duration}s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`,
			}}
		>
			{children}
		</div>
	);
}
