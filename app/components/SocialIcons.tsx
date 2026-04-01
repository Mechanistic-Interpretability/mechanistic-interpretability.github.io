import clsx from "clsx";
import {
	IconMail,
	IconBrandTwitter,
	IconBrandTwitterFilled,
	IconMailFilled,
	IconBrandReddit,
} from "@tabler/icons-react";

const social = [
	{
		Icon: IconMail,
		IconFilled: IconMailFilled,
		label: "Email MI",
		href: "mailto:a@allenleee.com",
		color: "text-red-600 dark:text-red-400",
	},
	{
		Icon: IconBrandReddit,
		IconFilled: IconBrandReddit,
		label: "Visit MI on Reddit",
		href: "https://www.reddit.com/user/allenleev0",
		color: "text-orange-600 dark:text-orange-400",
	},
	{
		Icon: IconMail,
		IconFilled: IconMailFilled,
		label: "Email MI",
		href: "mailto:a@allenleee.com",
		color: "text-red-600 dark:text-red-400",
	},
];

export default function SocialIcons() {
	return social.map(({ href, Icon, IconFilled, label, color }) => (
		<a
			href={href}
			key={href}
			className="group relative h-11 w-11 rounded-md p-2 transition ease-in-out hover:bg-zinc-300/50 dark:hover:bg-zinc-700/50"
			title={label}
			target="_blank"
		>
			<Icon
				size={28}
				className="absolute transition ease-in-out group-hover:opacity-0"
			/>
			<IconFilled
				size={28}
				className={clsx(
					"absolute opacity-0 transition ease-in-out group-hover:opacity-100",
					color,
				)}
			/>
		</a>
	));
}
