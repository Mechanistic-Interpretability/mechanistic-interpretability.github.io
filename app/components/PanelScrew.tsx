interface PanelScrewProps {
	position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	size?: "sm" | "md" | "lg";
}

const sizeMap = {
	sm: "h-1.5 w-1.5",
	md: "h-2 w-2",
	lg: "h-2.5 w-2.5",
};

const positionMap = {
	"top-left": "left-3 top-3",
	"top-right": "right-3 top-3",
	"bottom-left": "left-3 bottom-7",
	"bottom-right": "right-3 bottom-7",
};

export function PanelScrew({ position, size = "md" }: PanelScrewProps) {
	return (
		<div
			className={`pointer-events-none absolute ${sizeMap[size]} ${positionMap[position]} rounded-full border border-slate-700/35 bg-gradient-to-b from-[#f3f7fc] to-[#95a3b3] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:border-white/20 dark:from-[#556171] dark:to-[#313946]`}
		/>
	);
}
