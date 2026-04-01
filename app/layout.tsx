import "./globals.css";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import mergeMetadata from "@/lib/mergeMetadata";
import { ThemeProvider } from "next-themes";
import { CustomCursor } from "@/components/CustomCursor";
import { ClientLayout } from "@/components/ClientLayout";

export const metadata = mergeMetadata();

export const viewport = {
	themeColor: "#2563eb",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

const IoskeleyMono = localFont({
	src: [
		{
			path: "../public/TTF/IoskeleyMono-Light.ttf",
			weight: "300",
			style: "normal",
		},
		{
			path: "../public/TTF/IoskeleyMono-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../public/TTF/IoskeleyMono-Medium.ttf",
			weight: "500",
			style: "normal",
		},
		{
			path: "../public/TTF/IoskeleyMono-SemiBold.ttf",
			weight: "600",
			style: "normal",
		},
		{
			path: "../public/TTF/IoskeleyMono-Bold.ttf",
			weight: "700",
			style: "normal",
		},
		{
			path: "../public/TTF/IoskeleyMono-ExtraBold.ttf",
			weight: "800",
			style: "normal",
		},
		{
			path: "../public/TTF/IoskeleyMono-LightItalic.ttf",
			weight: "300",
			style: "italic",
		},
		{
			path: "../public/TTF/IoskeleyMono-Italic.ttf",
			weight: "400",
			style: "italic",
		},
		{
			path: "../public/TTF/IoskeleyMono-MediumItalic.ttf",
			weight: "500",
			style: "italic",
		},
		{
			path: "../public/TTF/IoskeleyMono-SemiBoldItalic.ttf",
			weight: "600",
			style: "italic",
		},
		{
			path: "../public/TTF/IoskeleyMono-BoldItalic.ttf",
			weight: "700",
			style: "italic",
		},
		{
			path: "../public/TTF/IoskeleyMono-ExtraBoldItalic.ttf",
			weight: "800",
			style: "italic",
		},
	],
	variable: "--font-ioskeley-mono",
	display: "swap",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${IoskeleyMono.variable} scroll-smooth [scrollbar-gutter:stable]`}
			style={{ fontFamily: "var(--font-ioskeley-mono), monospace" }}
		>
			<body className="relative flex min-h-screen max-w-full flex-col items-center gap-6 px-3 pb-6 dark:bg-dark-base sm:gap-8 sm:px-4 sm:pb-8 lg:mx-auto lg:max-w-7xl lg:flex-row">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem={true}
					disableTransitionOnChange={true}
					storageKey="app-theme"
				>
					<ClientLayout>
						<main
							id="main"
							className="relative mx-auto flex w-full max-w-[90%] grow flex-col items-center justify-center px-2 lg:max-w-[60%]"
						>
							{children}
						</main>
					</ClientLayout>
				</ThemeProvider>

				<Analytics />
				<SpeedInsights />
				<CustomCursor />
			</body>
		</html>
	);
}
