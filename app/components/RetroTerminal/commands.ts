"use client";

// Command types
export type CommandHandler = () => string | null;

export interface Command {
	description: string;
	action: CommandHandler;
	usage?: string;
	example?: string;
	category?: "navigation" | "system" | "search" | "info";
}

// Available sections for navigation
export const SECTIONS: Record<
	string,
	{ icon: string; path: string; description: string }
> = {
	home: { icon: "🏠", path: "/", description: "Homepage" },
	blog: { icon: "📝", path: "/blog", description: "Blog posts" },
	memories: { icon: "📸", path: "/memories", description: "Photo memories" },
};

// Command registry
export const COMMANDS: Record<string, Command> = {
	help: {
		description: "Show available commands",
		action: () => null,
		category: "system",
	},
	about: {
		description: "Display information about MI",
		action: () =>
			`This is an independent project focused on mechanistic interpretability. For questions, reach out to allenleexyz@gmail.com.`,
		category: "info",
	},
	blog: {
		description: "Navigate to blog",
		action: () => null,
		category: "navigation",
	},
	memories: {
		description: "Navigate to memories",
		action: () => null,
		category: "navigation",
	},
	search: {
		description: "Search blog posts",
		usage: "search <query>",
		example: "search AI",
		action: () => null,
		category: "search",
	},
	ls: {
		description: "List available sections",
		action: () => null,
		category: "system",
	},
	dir: {
		description: "List available sections (Windows style)",
		action: () => null,
		category: "system",
	},
	cd: {
		description: "Navigate to section",
		usage: "cd <section>",
		example: "cd blog",
		action: () => null,
		category: "navigation",
	},
	pwd: {
		description: "Show current location",
		action: () => null,
		category: "system",
	},
	goto: {
		description: "Go to specific post",
		usage: "goto <slug>",
		example: "goto matrix",
		action: () => null,
		category: "navigation",
	},
	back: {
		description: "Return to previous page",
		action: () => null,
		category: "navigation",
	},
	home: {
		description: "Go to homepage",
		action: () => null,
		category: "navigation",
	},
	clear: {
		description: "Clear terminal",
		action: () => null,
		category: "system",
	},
	exit: {
		description: "Close terminal",
		action: () => null,
		category: "system",
	},
	ai: {
		description: "MI's AI Coming soon",
		action: () => "Coming soon...",
		category: "info",
	},
};

// Most commonly used commands for quick help
export const TOP_COMMANDS = [
	{
		name: "search",
		description: "Find posts by title/content",
		example: "search attention",
	},
	{ name: "cd", description: "Navigate to a section", example: "cd blog" },
	{ name: "ls", description: "List all available sections", example: "ls" },
	{
		name: "goto",
		description: "Open a post directly",
		example: "goto transformers",
	},
	{ name: "clear", description: "Clear the screen", example: "clear" },
	{ name: "exit", description: "Close this terminal", example: "exit" },
] as const;

// Get all command names for autocomplete
export const COMMAND_NAMES = Object.keys(COMMANDS);

// Get commands by category for help display
export function getCommandsByCategory(): Record<string, [string, Command][]> {
	const categories: Record<string, [string, Command][]> = {};

	Object.entries(COMMANDS).forEach(([name, cmd]) => {
		const category = cmd.category || "other";
		if (!categories[category]) {
			categories[category] = [];
		}
		categories[category].push([name, cmd]);
	});

	return categories;
}

// Generate quick help text
export function generateQuickHelp(): string[] {
	const lines: string[] = [
		"",
		"  ┌──────────────────────────────────────────────────────────────┐",
		"  │                    QUICK START GUIDE                         │",
		"  └──────────────────────────────────────────────────────────────┘",
		"",
	];

	TOP_COMMANDS.forEach(({ name, description, example }) => {
		lines.push(`  ${name.padEnd(10)} ${description}`);
		lines.push(`         > ${example}`);
		lines.push("");
	});

	lines.push("  Press Tab to autocomplete commands");
	lines.push("  Type 'help' for full command list");

	return lines;
}

// Generate full help text organized by category
export function generateFullHelp(): string[] {
	const lines: string[] = ["", "Available commands:", ""];
	const categories = getCommandsByCategory();

	const categoryLabels: Record<string, string> = {
		navigation: "Navigation",
		search: "Search",
		system: "System",
		info: "Information",
		other: "Other",
	};

	Object.entries(categories).forEach(([category, commands]) => {
		lines.push(`  [${categoryLabels[category] || category}]`);
		commands.forEach(([name, cmd]) => {
			const usage = cmd.usage ? ` ${cmd.usage}` : "";
			lines.push(`    ${(name + usage).padEnd(25)} ${cmd.description}`);
		});
		lines.push("");
	});

	return lines;
}

// Check if a command exists
export function hasCommand(name: string): boolean {
	return name in COMMANDS;
}

// Get command by name
export function getCommand(name: string): Command | undefined {
	return COMMANDS[name];
}
