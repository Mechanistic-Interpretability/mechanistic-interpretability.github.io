"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import { IconSunFilled, IconMoonFilled } from "@tabler/icons-react";
import { MagneticButton } from "./MagneticButton";

export default function ThemeSwitch() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme, resolvedTheme } = useTheme();

	// Only render after client-side hydration to prevent hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	// Memoized callback to prevent re-renders
	const cycleTheme = useCallback(() => {
		// If currently in dark mode (either explicitly or via system), switch to light
		// If currently in light mode (either explicitly or via system), switch to dark
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	}, [resolvedTheme, setTheme]);

	// Memoized icon to prevent re-renders
	const Icon = useMemo(() => {
		if (!mounted) return IconSunFilled;
		return resolvedTheme === "dark" ? IconSunFilled : IconMoonFilled;
	}, [mounted, resolvedTheme]);

	// No theme indicator class needed

	// Don't render anything until mounted to prevent hydration mismatch
	if (!mounted) {
		return <div className="h-8 w-8" />;
	}

	return (
		<MagneticButton
			aria-label="Switch themes"
			onClick={cycleTheme}
			className="relative flex h-8 w-8 items-center justify-center !rounded-full border border-slate-500/45 bg-gradient-to-b from-[#eef3f9] to-[#c3cdda] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_3px_rgba(15,23,42,0.28)] transition-all hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_4px_8px_rgba(15,23,42,0.2)] focus:outline-none dark:border-slate-600/70 dark:from-[#252d38] dark:to-[#151b24] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_8px_rgba(0,0,0,0.5)] dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_10px_rgba(0,0,0,0.5)]"
			strength={0.2}
			title={mounted ? `Current theme: ${theme}` : "Theme switcher"}
		>
			<Icon size={20} />
		</MagneticButton>
	);
}
