"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DemoPreview from "@/components/demo-preview";
import { Project } from "./page";

export default function ProjectContent({ project }: { project: Project }) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(
    !project.demoUrl ? true : false
  );

  const toggleDetails = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/portfolio"
            className="flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </div>

        <div className="bg-card rounded-lg shadow-md overflow-hidden border">
          <div className="p-6">
            {project.demoUrl && (
              <div className="mb-8">
                <DemoPreview
                  repoUrl={project.repoUrl}
                  isPrivate={project.isPrivate ?? false}
                  demoUrl={project.demoUrl}
                  title={project.title}
                />
              </div>
            )}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h1 className="text-3xl font-bold mb-2 md:mb-0">
                {project.title}
              </h1>
              <div className="flex items-center space-x-2">
                {project.featured && <Badge variant="default">Featured</Badge>}
                <Badge variant="outline">{project.language}</Badge>
              </div>
            </div>

            <p className="text-lg mb-8">{project.description}</p>

            <div className="mb-4 flex items-center justify-between">
              <h2
                className={`text-2xl font-semibold ${
                  isDetailsOpen ? "invisible" : "block"
                }`}
              >
                Project Details
              </h2>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDetails}
                aria-expanded={isDetailsOpen}
                className="flex items-center gap-1"
              >
                {isDetailsOpen ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            <AnimatePresence initial={false}>
              {isDetailsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    exit={{ y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Details</h2>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="text-muted-foreground w-24">
                            Owner:
                          </span>
                          <span>{project.owner}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-muted-foreground w-24">
                            Created:
                          </span>
                          <span>
                            {new Date(project.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-muted-foreground w-24">
                            Stars:
                          </span>
                          <span>{project.stars}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-3">Categories</h2>
                      <div className="flex flex-wrap gap-2">
                        {project.category.map((cat) => (
                          <Badge key={cat} variant="secondary">
                            {cat}
                          </Badge>
                        ))}
                      </div>

                      <h2 className="text-xl font-semibold mt-6 mb-3">Tags</h2>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
