export default function PapersLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main
			id="main"
			className="mx-auto flex w-full max-w-[95%] grow flex-col items-center pt-16 lg:max-w-6xl"
		>
			{children}
		</main>
	);
}
