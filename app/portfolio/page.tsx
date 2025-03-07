import { Suspense } from "react";
import ProjectsGrid from "@/components/projects-grid";
import ProjectsGridSkeleton from "@/components/projects-grid-skeleton";
import { fetchGitHubProjects } from "@/lib/github";

// Revalidate every 12 hours
export const revalidate = 43200;

export default async function Projects() {
  const projects = await fetchGitHubProjects();

  // Make sure each project uses the repo name as the ID
  const projectsWithNameId = projects.map((project) => ({
    ...project,
    id: project.title || project.title.toLowerCase().replace(/\s+/g, "-"),
  }));

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Portfolio</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Portfolio of projects I&apos;ve worked on both personal and
            professional.
          </p>
        </div>

        {/* Projects Grid with Client-side Filtering */}
        <Suspense fallback={<ProjectsGridSkeleton />}>
          <ProjectsGrid initialProjects={projectsWithNameId} />
        </Suspense>
      </div>
    </div>
  );
}
