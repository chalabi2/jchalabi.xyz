"use client";

import dynamic from "next/dynamic";

import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader } from "@react-three/drei";

// Dynamically import ThreeScene to avoid SSR issues
const ThreeScene = dynamic(() => import("@/components/three-scene"), {
  ssr: false,
  loading: () => (
    <Loader
      containerStyles={{
        background: "var(--background)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      barStyles={{
        background: "var(--primary)",
      }}
      innerStyles={{
        background: "var(--background)",
      }}
    />
  ),
});

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with ThreeJS background */}
      <div className="h-screen w-full relative">
        {/* ThreeScene as background */}
        <div className="absolute inset-0 z-0 pointer-events-auto">
          {<ThreeScene />}
        </div>

        {/* Content overlay */}
        <div className="relative z-10 h-full max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 pointer-events-none">
          {/* Right side - Empty space for the 3D model to show */}
          <div className="hidden lg:block"></div>
        </div>

        {/* Attribution tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="absolute bottom-3 right-3 z-20 dark:text-white/50 dark:hover:text-white/80 text-black/50 hover:text-black/80 transition-colors pointer-events-auto">
                <InfoIcon size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="max-w-xs bg-black/80 border-gray-800 text-white/90"
            >
              <div className="text-xs">
                <p>
                  &ldquo;Need Some Space?&rdquo; by{" "}
                  <a
                    href="https://sketchfab.com/norgeotloic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white"
                  >
                    Loïc Norgeot
                  </a>{" "}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
