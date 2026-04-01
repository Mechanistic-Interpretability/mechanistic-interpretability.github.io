import { SocialLink } from "./types";
import { IconBook, IconBrandGithub, IconBrandX } from "@tabler/icons-react";

export const socialLinks: SocialLink[] = [
	{
		name: "blog",
		href: "/blog",
		icon: IconBook,
		label: "Blog",
	},
	{
		name: "github",
		href: "https://github.com/allenv0",
		icon: IconBrandGithub,
		label: "Code",
	},
	{
		name: "twitter",
		href: "https://x.com/allenleexyz",
		icon: IconBrandX,
		label: "DMs",
	},
	{
		name: "corner",
		href: "https://www.corner.inc/allenlee",
		isImage: true,
		imageSrc: "/images/corner.png",
		label: "Corner",
	},
];

export const siteConfig = {
	name: "MI",
	description: "Software Developer & Designer",
	centralImage: {
		src: "/images/mi.png",
		alt: "MI",
		width: 320,
		height: 320,
	},
};
