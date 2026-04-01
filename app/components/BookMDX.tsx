import { MDXContent } from "@content-collections/mdx/react";
import Link from "next/link";
import { highlight } from "sugar-high";
import React from "react";

function CustomImage(props: any) {
	return (
		// eslint-disable-next-line jsx-a11y/alt-text, jsx-a11y/img-redundant-alt
		<img {...props} className="rounded-lg drop-shadow-sm" alt={props.alt} />
	);
}

function CustomLink(props: any) {
	const href = props.href as string;

	if (href.startsWith("/")) {
		return (
			<Link
				{...props}
				className={"gradient-link " + (props.className || "")}
			/>
		);
	}

	if (href.startsWith("#")) {
		return (
			<a
				{...props}
				className={"gradient-link " + (props.className || "")}
			/>
		);
	}

	return (
		<a
			target="_blank"
			{...props}
			className={"gradient-link " + (props.className || "")}
		/>
	);
}

function CustomCode({ children, ...props }: any) {
	const html = highlight(children);
	return <code {...props} dangerouslySetInnerHTML={{ __html: html }} />;
}

function createHeadingComponent(level: number) {
	return function CustomHeading({
		children,
	}: React.HTMLAttributes<HTMLHeadingElement>) {
		const slug = (children || "")
			.toString()
			.toLowerCase()
			.trim()
			.replace(/\s+/g, "-")
			.replace(/[^\w-]+/g, "")
			.replace(/--+/g, "-");

		const Heading = `h${level}` as keyof React.JSX.IntrinsicElements;
		return (
			<Heading id={slug} className="relative w-fit">
				<a
					href={`#${slug}`}
					className="absolute ml-[-1em] h-full w-[calc(100%+1em)] no-underline before:inline-block before:scale-90 before:text-zinc-400 before:opacity-0 before:transition before:content-['#'] hover:before:scale-100 hover:before:opacity-100 before:dark:text-zinc-600"
					aria-hidden
				/>
				{children}
			</Heading>
		);
	};
}

export default function BookMDX({ code }: { code: string }) {
	return (
		<MDXContent
			code={code}
			components={{
				img: CustomImage,
				a: CustomLink,
				code: CustomCode,
				h1: createHeadingComponent(1),
				h2: createHeadingComponent(2),
				h3: createHeadingComponent(3),
				h4: createHeadingComponent(4),
				h5: createHeadingComponent(5),
				h6: createHeadingComponent(6),
			}}
		/>
	);
}
