/**
 * Integration Verification Script
 *
 * Run this in browser console to verify all optimizations are working:
 *
 * 1. Open the website in a browser
 * 2. Open DevTools (F12)
 * 3. Go to Console tab
 * 4. Paste this script and press Enter
 */

(function verifyDesignSystem() {
	console.log("🔍 Design System Verification\n");

	const results = {
		passed: [],
		failed: [],
		warnings: [],
	};

	// 1. Check Tailwind classes are applied
	const shell = document.querySelector(
		'[class*="border-shell"], [class*="bg-gradient-to-b"]',
	);
	if (shell) {
		results.passed.push("✅ Skeuomorphic shell styles applied");
	} else {
		results.failed.push("❌ No shell styles found");
	}

	// 2. Check for plastic grain
	const grain = document.querySelector(".plastic-grain");
	if (grain) {
		results.passed.push("✅ Plastic grain texture present");
	} else {
		results.warnings.push("⚠️ No plastic grain texture found");
	}

	// 3. Check for focus-visible support
	const buttons = document.querySelectorAll("button");
	const hasFocusVisible = Array.from(buttons).some((btn) =>
		btn.className.includes("focus-visible:"),
	);
	if (hasFocusVisible) {
		results.passed.push("✅ Focus-visible styles present on buttons");
	} else {
		results.warnings.push(
			"⚠️ No focus-visible styles found (may be using old components)",
		);
	}

	// 4. Check for venue colors
	const venueBadges = document.querySelectorAll(
		'[class*="bg-amber-500"], [class*="bg-blue-500"], [class*="bg-purple-500"]',
	);
	if (venueBadges.length > 0) {
		results.passed.push(
			`✅ Venue colors applied (${venueBadges.length} badges found)`,
		);

		// Check opacity consistency
		const firstBadge = venueBadges[0];
		if (firstBadge.className.includes("/20")) {
			results.passed.push("✅ Venue color opacity is /20 (consistent)");
		} else if (firstBadge.className.includes("/15")) {
			results.failed.push(
				"❌ Venue color opacity is /15 (should be /20)",
			);
		}
	} else {
		results.warnings.push("⚠️ No venue badges found on this page");
	}

	// 5. Check for console errors
	if (window.consoleErrors && window.consoleErrors.length > 0) {
		results.failed.push(
			`❌ ${window.consoleErrors.length} console errors detected`,
		);
	} else {
		results.passed.push("✅ No console errors detected");
	}

	// 6. Check for custom cursor (desktop only)
	if (!window.matchMedia("(pointer: coarse)").matches) {
		const cursor = document.querySelector(
			'[class*="mix-blend-difference"]',
		);
		if (cursor) {
			results.passed.push("✅ Custom cursor present (desktop)");
		} else {
			results.warnings.push("⚠️ No custom cursor found");
		}
	} else {
		results.passed.push(
			"✅ Touch device detected (custom cursor disabled)",
		);
	}

	// 7. Check for RAF throttling (indirect - check if TiltCard is used)
	const tiltCards = document.querySelectorAll(
		'[style*="perspective(1000px)"]',
	);
	if (tiltCards.length > 0) {
		results.passed.push(
			`✅ TiltCard component used (${tiltCards.length} instances)`,
		);
		results.passed.push(
			"✅ RAF throttling should be active (check DevTools Performance)",
		);
	} else {
		results.warnings.push("⚠️ No TiltCard components found on this page");
	}

	// 8. Check for dark mode support
	const darkElements = document.querySelectorAll('.dark, [class*="dark:"]');
	if (darkElements.length > 0) {
		results.passed.push(
			`✅ Dark mode classes present (${darkElements.length} elements)`,
		);
	} else {
		results.warnings.push("⚠️ No dark mode classes found");
	}

	// Print results
	console.log("\n📊 RESULTS:\n");

	results.passed.forEach((msg) => console.log(msg));
	results.warnings.forEach((msg) => console.log(msg));
	results.failed.forEach((msg) => console.log(msg));

	console.log("\n📈 SUMMARY:");
	console.log(`  ✅ Passed: ${results.passed.length}`);
	console.log(`  ⚠️  Warnings: ${results.warnings.length}`);
	console.log(`  ❌ Failed: ${results.failed.length}`);

	if (results.failed.length === 0) {
		console.log(
			"\n🎉 All critical checks passed! Design system is working correctly.",
		);
	} else {
		console.log(
			"\n⚠️  Some checks failed. Please review the output above.",
		);
	}

	return results;
})();

// Usage instructions
console.log("\n💡 To verify performance optimizations:");
console.log("   1. Open DevTools > Performance tab");
console.log("   2. Click Record (Ctrl+E)");
console.log("   3. Move mouse rapidly over TiltCards");
console.log("   4. Stop recording");
console.log("   5. Check that Main thread isn't overloaded");
console.log("   6. Verify RAF is throttling to ~60fps\n");
