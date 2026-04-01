"use client";

import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";
import Image from "next/image";

export default function Navbar() {
	return (
		<nav className="fixed left-0 top-0 z-50 w-full px-3 pb-2 pt-3 sm:px-6 sm:pb-0">
			<div className="relative flex items-center justify-between rounded-2xl border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] px-3 py-1.5 shadow-[0_8px_20px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_10px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] sm:rounded-[1.4rem] sm:px-4 sm:py-2">
				{/* Plastic grain texture */}
				<div className="plastic-grain pointer-events-none absolute inset-0 rounded-2xl sm:rounded-[1.4rem]" />

				{/* Shell highlight */}
				<div className="dark:bg-white/8 pointer-events-none absolute inset-x-8 top-0.5 h-3 rounded-full bg-white/50 blur-md" />

				<div className="relative flex items-center gap-2">
					<Link href="/">
						<div className="relative flex aspect-square h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-slate-500/45 bg-gradient-to-b from-[#eef3f9] to-[#c3cdda] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(15,23,42,0.2)] dark:border-slate-600/70 dark:from-[#252d38] dark:to-[#151b24]">
							<Image
								src="/al.png"
								alt="Ale Home"
								width={24}
								height={24}
								className="object-cover"
								priority
							/>
						</div>
					</Link>
				</div>

				<div className="flex-1" />

				<ThemeSwitch />
			</div>
		</nav>
	);
}
