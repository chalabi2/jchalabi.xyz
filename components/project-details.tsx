"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectDetailsProps {
  owner: string;
  date: string;
  stars: number;
}

export default function ProjectDetails({
  owner,
  date,
  stars,
}: ProjectDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Details</h2>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-2 overflow-hidden"
          >
            <div className="flex items-center">
              <span className="text-muted-foreground w-24">Owner:</span>
              <span>{owner}</span>
            </div>
            <div className="flex items-center">
              <span className="text-muted-foreground w-24">Created:</span>
              <span>{new Date(date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <span className="text-muted-foreground w-24">Stars:</span>
              <span>{stars}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
        aria-label={isOpen ? "Collapse details" : "Expand details"}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>
    </div>
  );
}
