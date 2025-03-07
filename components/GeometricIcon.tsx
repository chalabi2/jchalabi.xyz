"use client";

import { useState, useEffect } from "react";

interface GeometricIconProps {
  seed: string;
  size?: number;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

interface ColorPalette {
  primary: string;
  secondary: string;
  accent1: string;
  accent2: string;
  background: string;
}

export default function GeometricIcon({
  seed,
  size = 200,
  width = "100%",
  height = "100%",
  className = "",
  style = {},
}: GeometricIconProps) {
  const [svgContent, setSvgContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("GeometricIcon: Generating icon for seed:", seed);

    // Generate a deterministic random number based on the seed
    const seedRandom = (seed: string, index: number = 0): number => {
      const str = seed + index.toString();
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
      }
      return (hash & 0x7fffffff) / 0x7fffffff; // Normalize to 0-1
    };

    // Generate a color palette based on the seed
    const generatePalette = (seed: string): ColorPalette => {
      const hue = Math.floor(seedRandom(seed, 1) * 360);
      const saturation = 60 + Math.floor(seedRandom(seed, 2) * 20);
      const lightness = 50 + Math.floor(seedRandom(seed, 3) * 10);

      return {
        primary: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        secondary: `hsl(${(hue + 180) % 360}, ${saturation}%, ${lightness}%)`,
        accent1: `hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness}%)`,
        accent2: `hsl(${(hue + 240) % 360}, ${saturation}%, ${lightness}%)`,
        background: `hsl(${hue}, ${saturation / 3}%, 95%)`,
      };
    };

    try {
      // Generate a geometric pattern
      const generatePattern = (seed: string, size: number) => {
        const palette = generatePalette(seed);
        const patternType = Math.floor(seedRandom(seed, 4) * 5); // 5 different pattern types

        let svg = "";

        switch (patternType) {
          case 0: // Triangles
            svg = generateTriangles(seed, size, palette);
            break;
          case 1: // Circles
            svg = generateCircles(seed, size, palette);
            break;
          case 2: // Hexagons
            svg = generateHexagons(seed, size, palette);
            break;
          case 3: // Lines
            svg = generateLines(seed, size, palette);
            break;
          case 4: // Waves
            svg = generateWaves(seed, size, palette);
            break;
          default:
            svg = generateTriangles(seed, size, palette);
        }

        // Create a simple background without filters that might cause issues
        const background = `<rect width="${size}" height="${size}" fill="${palette.background}" />`;

        return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
          ${background}
          ${svg}
        </svg>`;
      };

      // Generate triangles pattern
      const generateTriangles = (
        seed: string,
        size: number,
        palette: ColorPalette
      ) => {
        const numTriangles = 5 + Math.floor(seedRandom(seed, 5) * 10);
        let triangles = "";

        for (let i = 0; i < numTriangles; i++) {
          const x1 = seedRandom(seed, i * 3) * size;
          const y1 = seedRandom(seed, i * 3 + 1) * size;
          const x2 = seedRandom(seed, i * 3 + 2) * size;
          const y2 = seedRandom(seed, i * 3 + 3) * size;
          const x3 = seedRandom(seed, i * 3 + 4) * size;
          const y3 = seedRandom(seed, i * 3 + 5) * size;

          const colorIndex = i % 4;
          const color =
            colorIndex === 0
              ? palette.primary
              : colorIndex === 1
              ? palette.secondary
              : colorIndex === 2
              ? palette.accent1
              : palette.accent2;

          const opacity = 0.3 + seedRandom(seed, i * 7) * 0.7;

          triangles += `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="${color}" opacity="${opacity}" />`;
        }

        return triangles;
      };

      // Generate circles pattern
      const generateCircles = (
        seed: string,
        size: number,
        palette: ColorPalette
      ) => {
        const numCircles = 5 + Math.floor(seedRandom(seed, 5) * 10);
        let circles = "";

        for (let i = 0; i < numCircles; i++) {
          const cx = seedRandom(seed, i * 2) * size;
          const cy = seedRandom(seed, i * 2 + 1) * size;
          const r = 10 + seedRandom(seed, i * 2 + 2) * (size / 4);

          const colorIndex = i % 4;
          const color =
            colorIndex === 0
              ? palette.primary
              : colorIndex === 1
              ? palette.secondary
              : colorIndex === 2
              ? palette.accent1
              : palette.accent2;

          const opacity = 0.3 + seedRandom(seed, i * 7) * 0.7;

          circles += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${opacity}" />`;
        }

        return circles;
      };

      // Generate hexagons pattern
      const generateHexagons = (
        seed: string,
        size: number,
        palette: ColorPalette
      ) => {
        const hexSize = 20 + Math.floor(seedRandom(seed, 5) * 30);
        const numRows = Math.ceil(size / (hexSize * 1.5));
        const numCols = Math.ceil(size / (hexSize * Math.sqrt(3)));
        let hexagons = "";

        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numCols; col++) {
            const offset = row % 2 === 0 ? 0 : (hexSize * Math.sqrt(3)) / 2;
            const cx = col * hexSize * Math.sqrt(3) + offset;
            const cy = row * hexSize * 1.5;

            if (seedRandom(`${seed}-${row}-${col}`, 0) > 0.3) {
              // 70% chance to draw a hexagon
              const colorIndex = (row + col) % 4;
              const color =
                colorIndex === 0
                  ? palette.primary
                  : colorIndex === 1
                  ? palette.secondary
                  : colorIndex === 2
                  ? palette.accent1
                  : palette.accent2;

              const opacity =
                0.3 + seedRandom(`${seed}-${row}-${col}`, 1) * 0.7;

              // Generate hexagon points
              let points = "";
              for (let i = 0; i < 6; i++) {
                const angle = (i * 60 * Math.PI) / 180;
                const x = cx + hexSize * Math.cos(angle);
                const y = cy + hexSize * Math.sin(angle);
                points += `${x},${y} `;
              }

              hexagons += `<polygon points="${points}" fill="${color}" opacity="${opacity}" />`;
            }
          }
        }

        return hexagons;
      };

      // Generate lines pattern
      const generateLines = (
        seed: string,
        size: number,
        palette: ColorPalette
      ) => {
        const numLines = 10 + Math.floor(seedRandom(seed, 5) * 20);
        let lines = "";

        for (let i = 0; i < numLines; i++) {
          const x1 = seedRandom(seed, i * 4) * size;
          const y1 = seedRandom(seed, i * 4 + 1) * size;
          const x2 = seedRandom(seed, i * 4 + 2) * size;
          const y2 = seedRandom(seed, i * 4 + 3) * size;

          const colorIndex = i % 4;
          const color =
            colorIndex === 0
              ? palette.primary
              : colorIndex === 1
              ? palette.secondary
              : colorIndex === 2
              ? palette.accent1
              : palette.accent2;

          const strokeWidth = 1 + seedRandom(seed, i * 5) * 10;
          const opacity = 0.3 + seedRandom(seed, i * 7) * 0.7;

          lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${strokeWidth}" opacity="${opacity}" />`;
        }

        return lines;
      };

      // Generate waves pattern
      const generateWaves = (
        seed: string,
        size: number,
        palette: ColorPalette
      ) => {
        const numWaves = 3 + Math.floor(seedRandom(seed, 5) * 5);
        let waves = "";

        for (let i = 0; i < numWaves; i++) {
          const startY = (i / numWaves) * size;
          const amplitude = 10 + seedRandom(seed, i * 2) * 40;
          const frequency = 1 + seedRandom(seed, i * 2 + 1) * 5;

          let path = `M 0 ${startY}`;

          for (let x = 0; x <= size; x += 10) {
            const y =
              startY + Math.sin(((x * frequency) / size) * Math.PI) * amplitude;
            path += ` L ${x} ${y}`;
          }

          path += ` L ${size} ${size} L 0 ${size} Z`;

          const colorIndex = i % 4;
          const color =
            colorIndex === 0
              ? palette.primary
              : colorIndex === 1
              ? palette.secondary
              : colorIndex === 2
              ? palette.accent1
              : palette.accent2;

          const opacity = 0.2 + seedRandom(seed, i * 3) * 0.4;

          waves += `<path d="${path}" fill="${color}" opacity="${opacity}" />`;
        }

        return waves;
      };

      // Generate the SVG content
      const svg = generatePattern(seed || "default", size);
      const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
      console.log("GeometricIcon: Generated data URL length:", dataUrl.length);
      setSvgContent(dataUrl);
    } catch (error) {
      console.error("GeometricIcon: Error generating pattern:", error);
      // Create a simple fallback
      const fallbackSvg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" fill="#3498db"/></svg>`;
      setSvgContent(
        `data:image/svg+xml;utf8,${encodeURIComponent(fallbackSvg)}`
      );
    } finally {
      setIsLoading(false);
    }
  }, [seed, size]);

  // If we're still loading, show a colored placeholder
  if (isLoading) {
    return (
      <div
        className={`${className} flex items-center justify-center`}
        style={{
          width,
          height,
          backgroundColor: "#e2e8f0",
          ...style,
        }}
      >
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        backgroundImage: `url(${svgContent})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width,
        height,
        ...style,
      }}
    />
  );
}
