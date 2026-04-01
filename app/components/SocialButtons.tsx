"use client";
import { socialLinks } from "@/config";
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "./ScrollReveal";

interface SocialButtonsProps {
	show?: boolean;
}

const SocialButtons = ({ show = false }: SocialButtonsProps) => {
	if (!show) return null;

	return (
		<ScrollReveal delay={0.2} direction="up">
			<div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-4">
				{socialLinks.map((link) => {
					const IconComponent = link.icon;
					const isExternal = link.href.startsWith("http");

					return (
						<Link
							key={link.name}
							href={link.href}
							target={isExternal ? "_blank" : undefined}
							rel={isExternal ? "noopener noreferrer" : undefined}
							className="inline-flex items-center gap-1 rounded-lg border border-slate-500/45 bg-gradient-to-b from-[#eef3f9] to-[#c3cdda] px-3 py-1 text-xs font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_3px_rgba(15,23,42,0.2)] transition-all duration-200 hover:scale-105 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_4px_6px_rgba(15,23,42,0.15)] focus:outline-none focus:ring-2 focus:ring-blue-400 active:shadow-[inset_0_2px_4px_rgba(15,23,42,0.2)] dark:border-slate-600/70 dark:from-[#252d38] dark:to-[#151b24] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_8px_rgba(0,0,0,0.4)] md:px-5 md:py-1.5 md:text-sm"
						>
							{link.isImage && link.imageSrc ? (
								<Image
									src={link.imageSrc}
									alt={link.label}
									width={12}
									height={12}
									className="flex-shrink-0 opacity-100 transition-transform duration-200 group-hover:scale-110"
								/>
							) : IconComponent ? (
								<IconComponent
									size={12}
									className="flex-shrink-0 opacity-100 transition-transform duration-200 group-hover:scale-110"
								/>
							) : null}
							{link.label}
						</Link>
					);
				})}
			</div>
		</ScrollReveal>
	);
};

export default SocialButtons;
