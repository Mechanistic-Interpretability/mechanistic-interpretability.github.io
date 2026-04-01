"use client";
import { Suspense } from "react";
import ProjectCard from "./ProjectCard";
import { ProjectShowcaseSkeleton } from "./ProjectCardSkeleton";
import { featuredProjects } from "@/config";

interface ProjectShowcaseProps {
	show?: boolean;
}

const ProjectShowcaseContent = () => {
	return (
		<div className="mx-auto mt-8 grid w-full grid-cols-1 gap-6 px-4 md:grid-cols-2 md:px-8">
			{featuredProjects.map((project, index) => (
				<ProjectCard
					key={project.name}
					project={[project.name, project]}
					delay={index * 0.1}
				/>
			))}
		</div>
	);
};

const ProjectShowcase = ({ show = false }: ProjectShowcaseProps) => {
	if (!show) return null;

	return (
		<Suspense fallback={<ProjectShowcaseSkeleton />}>
			<ProjectShowcaseContent />
		</Suspense>
	);
};

export default ProjectShowcase;
