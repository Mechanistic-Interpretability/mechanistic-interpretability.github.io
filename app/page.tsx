"use client";
import { useState } from "react";
import HeroSection from "./components/HeroSection";
import { CraftyNotification } from "./components/CraftyNotification";
import { CoNotification } from "./components/CoNotification";
import { RetroTerminal } from "./components/RetroTerminal";

export default function Page() {
	const [showEmailNotification, setShowEmailNotification] = useState(false);
	const [showCoNotification, setShowCoNotification] = useState(false);
	const [showTerminal, setShowTerminal] = useState(false);

	const handleOrbitingImageClick = (imageAlt: string) => {
		if (imageAlt === "Air8") {
			window.open("/blog/air", "_blank");
		} else if (imageAlt === "AL") {
			window.open("https://www.instagram.com/allen.35mm/", "_blank");
		} else if (imageAlt === "Corner") {
			window.open("https://www.corner.inc/allenlee", "_blank");
		} else if (imageAlt === "TT") {
			window.location.href = "/blog";
		} else if (imageAlt === "GitHub") {
			window.open("https://github.com/allenv0", "_blank");
		} else if (imageAlt === "Ale Dev") {
			window.open("https://x.com/allenleexyz", "_blank");
		} else if (imageAlt === "Finder") {
			window.open("https://x.com/allenleexyz", "_blank");
		} else if (imageAlt === "LAM") {
			const copyEmail = async () => {
				try {
					await navigator.clipboard.writeText(
						"allenleexyz@gmail.com",
					);
					setShowEmailNotification(true);
				} catch (err) {
					const textArea = document.createElement("textarea");
					textArea.value = "allenleexyz@gmail.com";
					document.body.appendChild(textArea);
					textArea.select();
					document.execCommand("copy");
					document.body.removeChild(textArea);
					setShowEmailNotification(true);
				}
			};
			copyEmail();
		} else if (imageAlt === "Lemotsh") {
			window.open(
				"https://www.youtube.com/watch?v=UL-sRoVO7dY",
				"_blank",
			);
		} else if (imageAlt === "Co") {
			setShowCoNotification(true);
		}
	};

	return (
		<>
			<HeroSection
				macPosition="center"
				onOrbitingImageClick={handleOrbitingImageClick}
				onMacClick={() => setShowTerminal(true)}
				onMacDoubleClick={() => setShowTerminal(true)}
				onTerminalClick={() => setShowTerminal(true)}
			/>
			<CraftyNotification
				show={showEmailNotification}
				onHide={() => setShowEmailNotification(false)}
			/>
			<CoNotification
				show={showCoNotification}
				onHide={() => setShowCoNotification(false)}
			/>
			<RetroTerminal
				isOpen={showTerminal}
				onClose={() => setShowTerminal(false)}
			/>
		</>
	);
}
