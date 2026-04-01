"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

interface Heading {
	id: string;
	text: string;
	level: number;
}

/** The RetroDesktop shell's inner overflow-auto div is the real scroll container. */
function getScrollContainer(): HTMLElement | null {
	return document.getElementById("retro-scroll");
}

export default function TableOfContents() {
	const [headings, setHeadings] = useState<Heading[]>([]);
	const [activeId, setActiveId] = useState<string>("");
	const pathname = usePathname();
	const observerRef = useRef<IntersectionObserver | null>(null);
	const scrollContainerRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		// Get scroll container after mount
		scrollContainerRef.current = getScrollContainer();

		// Extract headings from the DOM
		const headingElements = Array.from(
			document.querySelectorAll(".prose h2, .prose h3"),
		);

		const extractedHeadings = headingElements
			.map((heading) => ({
				id: heading.id,
				text: heading.textContent || "",
				level: parseInt(heading.tagName.charAt(1)),
			}))
			.filter((heading) => heading.id); // Filter out headings without IDs

		setHeadings(extractedHeadings);

		// Set up Intersection Observer for active section highlighting
		observerRef.current = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
					}
				});
			},
			{
				root: scrollContainerRef.current, // Use the real scroll container as root
				rootMargin: "-100px 0px -66%",
				threshold: 0,
			},
		);

		headingElements.forEach((heading) => {
			if (heading.id && observerRef.current) {
				observerRef.current.observe(heading);
			}
		});

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [pathname]); // Re-run when pathname changes

	// Don't render if no headings found
	if (headings.length === 0) {
		return null;
	}

	const handleClick = (
		e: React.MouseEvent<HTMLAnchorElement>,
		id: string,
	) => {
		e.preventDefault();
		const element = document.getElementById(id);
		const scrollContainer =
			scrollContainerRef.current || getScrollContainer();

		if (element) {
			// Fallback to window scroll if no scroll container found
			if (!scrollContainer) {
				const offset = 100;
				const elementPosition =
					element.getBoundingClientRect().top + window.scrollY;
				const offsetPosition = elementPosition - offset;

				window.scrollTo({
					top: offsetPosition,
					behavior: "smooth",
				});
				setActiveId(id);
				return;
			}

			const offset = 100; // Offset for sticky title bar
			const containerRect = scrollContainer.getBoundingClientRect();
			const elementRect = element.getBoundingClientRect();

			// Calculate position relative to the scroll container
			const elementTop =
				elementRect.top - containerRect.top + scrollContainer.scrollTop;
			const offsetPosition = elementTop - offset;

			scrollContainer.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
			setActiveId(id);
		}
	};

	return (
		<nav
			className="scrollbar-hide pointer-events-none fixed bottom-0 left-0 top-24 hidden w-56 overflow-y-auto px-6 lg:block"
			aria-label="Table of contents"
		>
			<div className="pointer-events-auto sticky top-24">
				<h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-800 dark:text-zinc-400">
					On this page
				</h2>
				<ul className="space-y-2 border-l border-zinc-200 text-sm dark:border-zinc-700">
					{headings.map((heading) => (
						<li
							key={heading.id}
							className={heading.level === 3 ? "ml-4" : ""}
							style={{
								marginLeft: heading.level === 3 ? "1rem" : "0",
							}}
						>
							<a
								href={`#${heading.id}`}
								onClick={(e) => handleClick(e, heading.id)}
								className={`-ml-px block border-l-2 py-1 pl-4 transition-colors duration-200 ${
									activeId === heading.id
										? "border-blue-500 font-medium text-blue-600 dark:text-blue-400"
										: "border-transparent text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
								}`}
							>
								{heading.text}
							</a>
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
}
