"use client";

// Animation utilities for terminal effects

// Characters for glitch effects
export const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#@$%&~";

// Rainbow colors for ASCII art
export const WELCOME_ART_LINES = [
	{ text: " __  __  _____", color: "#ff6b6b" },
	{ text: "|  \\  / ||_   _|", color: "#feca57" },
	{ text: "| \\  / |  | |", color: "#48dbfb" },
	{ text: "| |\\/| |  | |", color: "#ff9ff3" },
	{ text: "| |  | | _| |_", color: "#54a0ff" },
	{ text: "|_|  |_||_____|", color: "#5f27cd" },
] as const;

// Boot sequence configuration
export const BOOT_SEQUENCE = [
	{ content: "Initializing system...", delay: 100 },
	{ content: "Loading kernel modules...", delay: 150 },
	{ content: "Mounting file systems...", delay: 120 },
	{ content: "Checking security protocols...", delay: 180 },
	{ content: "Establishing secure connection...", delay: 200 },
	{ content: "Decrypting welcome sequence...", delay: 250 },
] as const;

/**
 * Animated typewriter effect with optional glitch
 */
export async function typeWriterEffect(
	text: string,
	element: HTMLElement | null,
	baseDelay = 30,
	glitchProbability = 0.15,
): Promise<void> {
	if (!element) return;

	const chars = text.split("");
	let currentText = "";

	for (let i = 0; i < chars.length; i++) {
		// Random delay variation for natural typing
		const delay = baseDelay + Math.random() * 20;

		// Glitch effect before showing correct character
		if (Math.random() < glitchProbability) {
			const glitchChar =
				GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
			element.textContent = currentText + glitchChar;
			await new Promise((resolve) => setTimeout(resolve, delay * 0.5));
		}

		currentText += chars[i];
		element.textContent = currentText;
		await new Promise((resolve) => setTimeout(resolve, delay));
	}
}

/**
 * Matrix decode effect for text reveal
 */
export async function decodeEffect(
	targetText: string,
	element: HTMLElement | null,
	duration = 800,
): Promise<void> {
	if (!element) return;

	const chars = targetText.split("");
	const steps = 12;
	const stepDuration = duration / steps;

	for (let step = 0; step <= steps; step++) {
		const progress = step / steps;
		const revealedCount = Math.floor(progress * chars.length);

		let displayText = "";
		for (let i = 0; i < chars.length; i++) {
			if (i < revealedCount) {
				displayText += chars[i];
			} else if (chars[i] === " ") {
				displayText += " ";
			} else {
				displayText +=
					GLITCH_CHARS[
						Math.floor(Math.random() * GLITCH_CHARS.length)
					];
			}
		}

		element.textContent = displayText;
		await new Promise((resolve) => setTimeout(resolve, stepDuration));
	}

	element.textContent = targetText;
}

/**
 * Calculate Levenshtein distance between two strings
 * Used for command suggestion matching
 */
export function levenshteinDistance(a: string, b: string): number {
	const matrix: number[][] = [];

	for (let i = 0; i <= b.length; i++) {
		matrix[i] = [i];
	}

	for (let j = 0; j <= a.length; j++) {
		matrix[0][j] = j;
	}

	for (let i = 1; i <= b.length; i++) {
		for (let j = 1; j <= a.length; j++) {
			if (b.charAt(i - 1) === a.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(
					matrix[i - 1][j - 1] + 1,
					Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1),
				);
			}
		}
	}

	return matrix[b.length][a.length];
}

/**
 * Find similar commands based on Levenshtein distance
 */
export function findSimilarCommands(
	input: string,
	availableCommands: string[],
	maxDistance = 2,
	maxSuggestions = 3,
): string[] {
	const distances = availableCommands.map((cmd) => ({
		cmd,
		distance: levenshteinDistance(input.toLowerCase(), cmd.toLowerCase()),
	}));

	return distances
		.filter(({ distance }) => distance > 0 && distance <= maxDistance)
		.sort((a, b) => a.distance - b.distance)
		.slice(0, maxSuggestions)
		.map(({ cmd }) => cmd);
}
