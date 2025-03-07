import { fetchGitHubProjects } from "@/lib/github";
import { NextResponse } from "next/server";

// Revalidate every 12 hours
export const revalidate = 43200;

export async function GET() {
  try {
    const projects = await fetchGitHubProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
} 