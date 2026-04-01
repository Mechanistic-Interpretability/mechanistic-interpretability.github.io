"use client";
import Link from "next/link";
import Image from "next/image";
import {
	IconBrandGithub,
	IconBrandX,
	IconMail,
	IconBrandInstagram,
	IconBook,
	IconHeadphones,
} from "@tabler/icons-react";

interface HyperlinkButtonsProps {
	show?: boolean;
}

const HyperlinkButtons = ({ show = false }: HyperlinkButtonsProps) => {
	if (!show) return null;

	const links = [
		{
			name: "github",
			href: "https://github.com/allenv0",
			icon: IconBrandGithub,
			label: "GitHub",
		},
		{
			name: "twitter",
			href: "https://x.com/allenleexyz",
			icon: IconBrandX,
			label: "Twitter",
		},
		{
			name: "instagram",
			href: "https://www.instagram.com/allen.35mm/",
			icon: IconBrandInstagram,
			label: "Instagram",
		},
		{
			name: "corner",
			href: "https://www.corner.inc/allenlee",
			icon: null,
			isImage: true,
			imageSrc: "/images/corner.png",
			label: "Corner",
		},
		{
			name: "airposture",
			href: "/blog/air",
			icon: IconHeadphones,
			label: "AirPosture",
		},
		{
			name: "blog",
			href: "/blog",
			icon: IconBook,
			label: "Blog",
		},
		{
			name: "email",
			href: "mailto:allenleexyz@gmail.com",
			icon: IconMail,
			label: "Email",
		},
	];

	return (
		<div className="animate-fade-in fixed left-4 top-1/2 z-20 flex -translate-y-1/2 transform flex-col gap-3">
			{links.map((link) => {
				const IconComponent = link.icon;
				const isExternal =
					link.href.startsWith("http") ||
					link.href.startsWith("mailto:");

				return (
					<Link
						key={link.name}
						href={link.href}
						target={isExternal ? "_blank" : undefined}
						rel={isExternal ? "noopener noreferrer" : undefined}
						className="inline-flex items-center gap-2 rounded-lg border border-slate-500/45 bg-gradient-to-b from-[#eef3f9] to-[#c3cdda] px-3 py-2 text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_3px_rgba(15,23,42,0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_4px_6px_rgba(15,23,42,0.15)] focus:outline-none focus:ring-2 focus:ring-blue-400 active:shadow-[inset_0_2px_4px_rgba(15,23,42,0.2)] dark:border-slate-600/70 dark:from-[#252d38] dark:to-[#151b24] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_8px_rgba(0,0,0,0.4)] md:px-4 md:py-2.5 md:text-base"
						title={link.label}
					>
						{link.isImage && link.imageSrc ? (
							<Image
								src={link.imageSrc}
								alt={link.label}
								width={18}
								height={18}
								className="flex-shrink-0 opacity-100"
							/>
						) : IconComponent ? (
							<IconComponent
								size={18}
								className="flex-shrink-0 opacity-100"
							/>
						) : null}
						<span className="hidden md:inline">{link.label}</span>
					</Link>
				);
			})}
		</div>
	);
};

export default HyperlinkButtons;
