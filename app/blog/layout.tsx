export default function BlogLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main
			id="main"
			className="mx-auto flex w-full max-w-[92%] grow flex-col items-center pt-16 lg:max-w-5xl xl:max-w-6xl"
		>
			{children}
		</main>
	);
}
