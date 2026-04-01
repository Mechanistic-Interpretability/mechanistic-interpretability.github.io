"use client";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import { Project } from "@/config";
import { TiltCard } from "./TiltCard";
import { ScrollReveal } from "./ScrollReveal";

interface ProjectCardProps {
	project: [string, Project];
	delay?: number;
}

const ProjectCard = ({ project, delay = 0 }: ProjectCardProps) => {
	const [name, data] = project;
	const isGif = data.cover?.endsWith(".gif");

	return (
		<ScrollReveal delay={delay} direction="up">
			<TiltCard className="h-full" glareEnabled={true} tiltAmount={8}>
				<div className="group relative h-full overflow-hidden rounded-2xl border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-6px_12px_rgba(71,85,105,0.25)] transition-all hover:shadow-[0_8px_20px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-6px_12px_rgba(71,85,105,0.25)] dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_16px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-6px_14px_rgba(0,0,0,0.5)] sm:rounded-[1.4rem] sm:p-2">
					{/* Plastic grain texture */}
					<div className="plastic-grain pointer-events-none absolute inset-0 rounded-2xl sm:rounded-[1.4rem]" />
					{/* Shell highlight */}
					<div className="pointer-events-none absolute inset-x-4 top-1 h-4 rounded-full bg-white/50 blur-md dark:bg-white/10" />
					<div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 rounded-b-2xl bg-gradient-to-t from-black/15 to-transparent sm:rounded-b-[1.4rem]" />

					{/* Inner bezel */}
					<div className="relative overflow-hidden rounded-xl border border-slate-500/45 bg-gradient-to-b from-[#e8edf3] to-[#b9c4d1] shadow-[inset_0_2px_2px_rgba(255,255,255,0.65),inset_0_-3px_6px_rgba(15,23,42,0.22)] dark:border-slate-600/70 dark:from-[#202833] dark:to-[#141b24] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),inset_0_-4px_9px_rgba(0,0,0,0.65)] sm:rounded-2xl">
						{/* Screen/content area */}
						<div className="relative overflow-hidden rounded-lg border border-slate-700/30 bg-[#edf2f8] dark:border-white/10 dark:bg-[#0a0a0a]">
							{/* Screen curvature */}
							<div className="pointer-events-none absolute inset-0 z-10 rounded-lg shadow-[inset_0_0_40px_rgba(0,0,0,0.08),inset_0_0_15px_rgba(255,255,255,0.08)] dark:shadow-[inset_0_0_50px_rgba(0,0,0,0.7),inset_0_0_20px_rgba(58,58,58,0.15)]" />

							{data.cover && (
								<div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
									<Image
										src={`/images/projects/${data.cover}`}
										alt={data.coverAlt || name}
										fill
										className="object-cover transition-transform duration-500 group-hover:scale-105"
										unoptimized={isGif}
									/>
								</div>
							)}
							<div className="relative z-[5] p-5">
								<div className="mb-4 flex items-center">
									<div className="mr-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-slate-500/45 bg-gradient-to-b from-[#eef3f9] to-[#c3cdda] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_3px_rgba(15,23,42,0.2)] dark:border-slate-600/70 dark:from-[#252d38] dark:to-[#151b24] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_8px_rgba(0,0,0,0.4)]">
										<Image
											src={
												name === "AirPosture"
													? "/images/projects/Air8.png"
													: name === "YTTL"
														? "/images/projects/ht3.png"
														: "/images/projects/ht3.png"
											}
											alt=""
											width={48}
											height={48}
											className="object-cover"
										/>
									</div>
									<h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
										{name}
									</h3>
								</div>
								<p className="mb-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
									{data.description}
								</p>
								<div className="flex flex-wrap justify-center gap-2">
									{Object.entries(data.links || {}).map(
										([text, href]) => (
											<a
												key={text + href}
												href={href}
												target="_blank"
												rel="noopener noreferrer"
												className={`inline-flex items-center gap-1 rounded-lg border border-slate-500/45 bg-gradient-to-b from-[#eef3f9] to-[#c3cdda] px-3 py-1 text-xs font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_3px_rgba(15,23,42,0.2)] transition-all duration-200 hover:scale-105 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_4px_6px_rgba(15,23,42,0.15)] focus:outline-none focus:ring-2 focus:ring-blue-400 active:shadow-[inset_0_2px_4px_rgba(15,23,42,0.2)] dark:border-slate-600/70 dark:from-[#252d38] dark:to-[#151b24] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_8px_rgba(0,0,0,0.4)] md:px-5 md:py-1.5 md:text-sm ${
													text === "iOS App"
														? "scale-110 text-xs md:text-sm"
														: text ===
															  "iOS Beta Link"
															? "text-[6px] md:text-xs"
															: "text-xs md:text-sm"
												}`}
											>
												{text}
												<IconArrowRight
													className="ml-0.5 transition-transform duration-200 group-hover:translate-x-1"
													size={12}
												/>
											</a>
										),
									)}
									{Object.keys(data.links || {}).length ===
										0 && (
										<span className="inline-flex items-center gap-1 rounded-lg border border-slate-500/45 bg-gradient-to-b from-[#eef3f9] to-[#c3cdda] px-3 py-1 text-[8px] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_3px_rgba(15,23,42,0.2)] dark:border-slate-600/70 dark:from-[#252d38] dark:to-[#151b24] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_8px_rgba(0,0,0,0.4)] md:px-5 md:py-1.5 md:text-xs">
											Coming soon
										</span>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</TiltCard>
		</ScrollReveal>
	);
};

export default ProjectCard;
