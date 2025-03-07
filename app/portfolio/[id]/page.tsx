import { notFound } from "next/navigation";
import { fetchGitHubProjects } from "@/lib/github";
import ProjectContent from "./project-content";

// Revalidate every 12 hours
export const revalidate = 43200;

export type Project = {
  id: string;
  title: string;
  description: string;
  language: string;
  owner: string;
  date: string;
  stars: number;
  repoUrl: string;
  demoUrl?: string;
  category: string[];
  tags: string[];
  featured: boolean;
  isPrivate?: boolean;
};

export async function generateStaticParams() {
  const projects = await fetchGitHubProjects();

  return projects.map((project) => ({
    id: project.title || project.title.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export default async function ProjectPage(props: {
  params: Promise<{ id: string }>;
}) {
  const projects = await fetchGitHubProjects();

  // Use a temporary variable for the id to avoid direct access
  const { id } = await props.params;

  const project = projects.find(
    (p) => p.title === id || p.title.toLowerCase().replace(/\s+/g, "-") === id
  );

  if (!project) {
    notFound();
  }

  return <ProjectContent project={project} />;
}
