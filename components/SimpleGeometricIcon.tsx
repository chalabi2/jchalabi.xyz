"use client";

import React, { useState, useEffect, useRef } from "react";

interface SimpleGeometricIconProps {
  seed: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export default function SimpleGeometricIcon({
  seed,
  width = "100%",
  height = "100%",
  className = "",
  style = {},
}: SimpleGeometricIconProps) {
  const [svgContent, setSvgContent] = useState("");
  const [mounted, setMounted] = useState(false);
  const [fallbackColor, setFallbackColor] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate SVG when mounted or seed changes
  useEffect(() => {
    if (!mounted || !seed) return;

    try {
      // Simple hash function for deterministic randomness
      const hashCode = (str: string): number => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
      };

      // Get a deterministic random number between 0 and 1
      const getRandom = (str: string, salt = 0): number => {
        return Math.abs((hashCode(str + salt) % 1000) / 1000);
      };

      // Get a random integer between min and max (inclusive)
      const getRandomInt = (
        str: string,
        min: number,
        max: number,
        salt = 0
      ): number => {
        return Math.floor(getRandom(str, salt) * (max - min + 1)) + min;
      };

      // Get actual computed colors from CSS variables
      const getComputedColor = (cssVar: string): string => {
        // Default colors in case we can't get computed values
        const defaultColors = {
          primary: "#7c3aed",
          secondary: "#e2e8f0",
          accent: "#f59e0b",
          chart1: "#3b82f6",
          chart2: "#10b981",
          chart3: "#ef4444",
          chart4: "#8b5cf6",
          chart5: "#f97316",
          card: "#ffffff",
          cardDark: "#1e293b",
        };

        if (typeof window === "undefined" || !containerRef.current) {
          // If we're server-side or container not mounted yet, use default colors
          const colorKey = cssVar
            .replace("var(--", "")
            .replace(")", "") as keyof typeof defaultColors;
          return defaultColors[colorKey] || "#7c3aed";
        }

        // Get the computed style
        const computedStyle = getComputedStyle(document.documentElement);
        const varName = cssVar.replace("var(", "").replace(")", "");
        const color = computedStyle.getPropertyValue(varName).trim();

        return color || defaultColors.primary;
      };

      // Theme colors - using computed values
      const themeColors = [
        getComputedColor("var(--primary)"),
        getComputedColor("var(--secondary)"),
        getComputedColor("var(--accent)"),
        getComputedColor("var(--chart-1)"),
        getComputedColor("var(--chart-2)"),
        getComputedColor("var(--chart-3)"),
        getComputedColor("var(--chart-4)"),
        getComputedColor("var(--chart-5)"),
      ];

      // Get a random theme color
      const getThemeColor = (str: string, salt = 0): string => {
        const index = Math.floor(getRandom(str, salt) * themeColors.length);
        return themeColors[index];
      };

      // Generate background color
      const bgColor = getComputedColor("var(--card)");

      // Decide which pattern type to generate
      const patternType = getRandomInt(seed, 1, 4, 0);

      let shapes = "";

      switch (patternType) {
        case 1: // Triangles pattern
          const triangleCount = getRandomInt(seed, 3, 8, 1);
          for (let i = 0; i < triangleCount; i++) {
            const size = getRandomInt(seed, 15, 40, i + 2);
            const x = getRandomInt(seed, 0, 100, i + 3);
            const y = getRandomInt(seed, 0, 100, i + 4);
            const rotation = getRandomInt(seed, 0, 360, i + 5);
            const color = getThemeColor(seed, i + 6);
            const opacity = 0.3 + getRandom(seed, i + 7) * 0.5;

            shapes += `<polygon 
              points="${x},${y} ${x + size},${y + size} ${x - size},${y + size}"
              transform="rotate(${rotation}, ${x}, ${y})"
              fill="${color}" 
              opacity="${opacity}" />`;
          }
          break;

        case 2: // Circles and rings
          const circleCount = getRandomInt(seed, 3, 7, 1);
          for (let i = 0; i < circleCount; i++) {
            const radius = getRandomInt(seed, 5, 25, i + 2);
            const x = getRandomInt(seed, 0, 100, i + 3);
            const y = getRandomInt(seed, 0, 100, i + 4);
            const color = getThemeColor(seed, i + 5);
            const opacity = 0.3 + getRandom(seed, i + 6) * 0.5;
            const strokeWidth = getRandomInt(seed, 0, 5, i + 7);

            if (strokeWidth > 0) {
              // Ring
              shapes += `<circle 
                cx="${x}" cy="${y}" r="${radius}"
                fill="none" 
                stroke="${color}" 
                stroke-width="${strokeWidth}"
                opacity="${opacity}" />`;
            } else {
              // Filled circle
              shapes += `<circle 
                cx="${x}" cy="${y}" r="${radius}"
                fill="${color}" 
                opacity="${opacity}" />`;
            }
          }
          break;

        case 3: // Rectangles and lines
          const rectCount = getRandomInt(seed, 3, 8, 1);
          for (let i = 0; i < rectCount; i++) {
            const width = getRandomInt(seed, 5, 40, i + 2);
            const height = getRandomInt(seed, 5, 40, i + 3);
            const x = getRandomInt(seed, 0, 100, i + 4);
            const y = getRandomInt(seed, 0, 100, i + 5);
            const rotation = getRandomInt(seed, 0, 90, i + 6);
            const color = getThemeColor(seed, i + 7);
            const opacity = 0.3 + getRandom(seed, i + 8) * 0.5;
            const isLine = getRandom(seed, i + 9) > 0.7;

            if (isLine) {
              // Line
              const x2 = getRandomInt(seed, 0, 100, i + 10);
              const y2 = getRandomInt(seed, 0, 100, i + 11);
              const strokeWidth = getRandomInt(seed, 1, 3, i + 12);

              shapes += `<line 
                x1="${x}" y1="${y}" x2="${x2}" y2="${y2}"
                stroke="${color}" 
                stroke-width="${strokeWidth}"
                opacity="${opacity}" />`;
            } else {
              // Rectangle
              shapes += `<rect 
                x="${x}" y="${y}" width="${width}" height="${height}"
                transform="rotate(${rotation}, ${x + width / 2}, ${
                y + height / 2
              })"
                fill="${color}" 
                opacity="${opacity}" />`;
            }
          }
          break;

        case 4: // Abstract geometric composition
          // Add some diagonal lines
          const lineCount = getRandomInt(seed, 2, 5, 1);
          for (let i = 0; i < lineCount; i++) {
            const x1 = getRandomInt(seed, 0, 100, i + 2);
            const y1 = getRandomInt(seed, 0, 100, i + 3);
            const x2 = getRandomInt(seed, 0, 100, i + 4);
            const y2 = getRandomInt(seed, 0, 100, i + 5);
            const color = getThemeColor(seed, i + 6);
            const opacity = 0.3 + getRandom(seed, i + 7) * 0.5;
            const strokeWidth = getRandomInt(seed, 1, 4, i + 8);

            shapes += `<line 
              x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
              stroke="${color}" 
              stroke-width="${strokeWidth}"
              opacity="${opacity}" />`;
          }

          // Add some polygons
          const polyCount = getRandomInt(seed, 1, 3, 9);
          for (let i = 0; i < polyCount; i++) {
            const points = [];
            const pointCount = getRandomInt(seed, 3, 6, i + 10);
            const centerX = getRandomInt(seed, 20, 80, i + 11);
            const centerY = getRandomInt(seed, 20, 80, i + 12);
            const radius = getRandomInt(seed, 10, 30, i + 13);

            for (let j = 0; j < pointCount; j++) {
              const angle = (j / pointCount) * 2 * Math.PI;
              const r = radius * (0.7 + getRandom(seed, i + j + 14) * 0.3);
              const x = centerX + r * Math.cos(angle);
              const y = centerY + r * Math.sin(angle);
              points.push(`${x},${y}`);
            }

            const color = getThemeColor(seed, i + 15);
            const opacity = 0.3 + getRandom(seed, i + 16) * 0.5;

            shapes += `<polygon 
              points="${points.join(" ")}"
              fill="${color}" 
              opacity="${opacity}" />`;
          }

          // Add some circles
          const smallCircleCount = getRandomInt(seed, 2, 5, 17);
          for (let i = 0; i < smallCircleCount; i++) {
            const radius = getRandomInt(seed, 2, 8, i + 18);
            const x = getRandomInt(seed, 0, 100, i + 19);
            const y = getRandomInt(seed, 0, 100, i + 20);
            const color = getThemeColor(seed, i + 21);
            const opacity = 0.4 + getRandom(seed, i + 22) * 0.6;

            shapes += `<circle 
              cx="${x}" cy="${y}" r="${radius}"
              fill="${color}" 
              opacity="${opacity}" />`;
          }
          break;
      }

      // Create the SVG with proper XML declaration and encoding
      const svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <rect width="100" height="100" fill="${bgColor}" />
          ${shapes}
        </svg>
      `;

      // Properly encode the SVG for use in a data URL
      const encodedSvg = btoa(unescape(encodeURIComponent(svg)));
      setSvgContent(`data:image/svg+xml;base64,${encodedSvg}`);
      setFallbackColor(""); // Clear fallback if SVG generation succeeds
    } catch (error) {
      console.error("Error generating pattern:", error);
      // Fallback to a solid color from theme
      if (typeof window !== "undefined" && containerRef.current) {
        const computedStyle = getComputedStyle(document.documentElement);
        const primaryColor = computedStyle.getPropertyValue("--primary").trim();
        setFallbackColor(primaryColor || "#7c3aed");
      } else {
        setFallbackColor("#7c3aed"); // Default fallback
      }
      setSvgContent("");
    }
  }, [seed, mounted]);

  return (
    <div
      ref={containerRef}
      id={`geometric-icon-${seed}`}
      className={className}
      style={{
        width,
        height,
        backgroundImage: svgContent ? `url(${svgContent})` : "none",
        backgroundColor: fallbackColor || undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...style,
      }}
    />
  );
}
