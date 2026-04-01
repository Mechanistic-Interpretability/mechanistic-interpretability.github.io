import { MDXContent } from "@content-collections/mdx/react";
import Image from "next/image";
import Link from "next/link";
import path from "path";
import React from "react";
import sharp from "sharp";
import { highlight } from "sugar-high";
import { Tweet } from "react-tweet";

async function CustomImage(props: any) {
	const sharpImage = sharp(path.join(process.cwd(), "public", props.src));
	const { width, height } = await sharpImage.metadata();

	const placeholder = await sharpImage.resize(10).toBuffer();
	const base64 = placeholder.toString("base64");
	const blurDataURL = `data:image/png;base64,${base64}`;

	return (
		// Alt text is passed in through props
		// eslint-disable-next-line jsx-a11y/alt-text
		<Image
			{...props}
			placeholder="blur"
			blurDataURL={blurDataURL}
			width={width}
			height={height}
			className="rounded-lg drop-shadow-sm"
			sizes="(max-width: 896px) 100vw, 896px"
		/>
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

function CustomPre({ children }: any) {
	return (
		<div className="not-prose my-4 overflow-hidden rounded-lg border border-slate-500/35 bg-gradient-to-b from-[#e8edf3] to-[#c5cdd8] p-[3px] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_3px_rgba(15,23,42,0.12)] dark:border-slate-600/60 dark:from-[#1a2028] dark:to-[#111720] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-1px_4px_rgba(0,0,0,0.4)]">
			<div className="relative overflow-hidden rounded-md border border-slate-700/25 bg-[#f5f8fc] shadow-[inset_0_0_15px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
				{/* Screen curvature */}
				<div className="pointer-events-none absolute inset-0 z-10 rounded-md shadow-[inset_0_0_25px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]" />
				<pre className="relative z-[5] m-0 overflow-x-auto !bg-transparent p-4 text-sm leading-relaxed">
					{children}
				</pre>
			</div>
		</div>
	);
}

function createHeadingComponent(level: number) {
	return function CustomHeading({
		children,
	}: React.HTMLAttributes<HTMLHeadingElement>) {
		const slug = (children || "")
			.toString()
			.toLowerCase()
			.trim() // remove leading/trailing whitespace
			.replace(/\s+/g, "-") // replace spaces with dashes
			.replace(/[^\w-]+/g, "") // remove all non-word chars
			.replace(/--+/g, "-"); // replace multiple dashes with single dash

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

function TweetGrid({ children }: { children: React.ReactNode }) {
	return (
		<div className="not-prose my-4 grid grid-cols-1 gap-4 md:grid-cols-2">
			{children}
		</div>
	);
}

function CustomTweet({ id }: { id: string }) {
	return (
		<div className="not-prose -mx-4 flex justify-center sm:-mx-8">
			<div className="w-full max-w-[550px]">
				<Tweet id={id} />
			</div>
		</div>
	);
}

export default function CustomMDX({ code }: { code: string }) {
	return (
		<MDXContent
			code={code}
			components={{
				img: CustomImage,
				a: CustomLink,
				code: CustomCode,
				pre: CustomPre,
				h1: createHeadingComponent(1),
				h2: createHeadingComponent(2),
				h3: createHeadingComponent(3),
				h4: createHeadingComponent(4),
				h5: createHeadingComponent(5),
				h6: createHeadingComponent(6),
				Tweet: CustomTweet,
				TweetGrid,
			}}
		/>
	);
}
