import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsGridSkeleton() {
  // Create an array of 6 items to represent loading projects
  const skeletonProjects = Array(6).fill(null);

  return (
    <div className="space-y-8">
      {/* Filter Bar Skeleton */}
      <div className="bg-background/60 backdrop-blur-md sticky top-16 z-10 py-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex-1 w-full">
            <Skeleton className="h-10 w-full max-w-md" />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>

        {/* Filter Pills Skeleton */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>

      {/* Projects Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skeletonProjects.map((_, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader className="flex-none">
              <div className="flex justify-between items-start">
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-5 w-24" />
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              {/* Description skeleton */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />

              {/* Tags skeleton */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>

              {/* Categories skeleton */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>

              {/* Stars skeleton */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-8" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex space-x-4">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-5" />
              </div>
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
