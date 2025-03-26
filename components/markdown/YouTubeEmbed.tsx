import React from "react";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  width?: number;
  height?: number;
}

/**
 * A responsive YouTube video embed component for MDX files
 *
 * Example usage in MDX:
 * <YouTubeEmbed videoId="lxslnp-ZEMw" />
 */
export function YouTubeEmbed({
  videoId,
  title = "YouTube video player",
  width = 560,
  height = 315,
}: YouTubeEmbedProps): React.ReactElement {
  return (
    <div className="relative w-full my-8">
      <div className="relative pb-[56.25%] h-0 overflow-hidden max-w-full">
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          width={width}
          height={height}
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default YouTubeEmbed;
