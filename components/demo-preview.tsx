"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Github, Loader2, Lock } from "lucide-react";

interface DemoPreviewProps {
  repoUrl: string;
  title: string;
  demoUrl: string;
  isPrivate: boolean;
}

export default function DemoPreview({
  demoUrl,
  title,
  repoUrl,
  isPrivate,
}: DemoPreviewProps) {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [screenshotLoading, setScreenshotLoading] = useState(true);
  const [screenshotError, setScreenshotError] = useState(false);

  // Use a more reliable screenshot service
  // We're using Microlink which is a popular service for generating screenshots
  const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(
    demoUrl
  )}&screenshot=true&meta=false&embed=screenshot.url`;

  // Alternative screenshot URL using a different service as fallback
  const fallbackScreenshotUrl = `https://image.thum.io/get/width/1200/crop/800/viewportWidth/1200/png/${encodeURIComponent(
    demoUrl
  )}`;

  // Reset error state when changing tabs
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setIframeError(false);
        setIframeLoading(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <Tabs defaultValue="iframe" className="w-full">
      <div className="flex justify-between items-center mb-2">
        <TabsList>
          <TabsTrigger value="iframe">Live Preview</TabsTrigger>
          <TabsTrigger value="screenshot">Screenshot</TabsTrigger>
        </TabsList>
        <div className="flex flex-wrap gap-4">
          {isPrivate ? (
            <Button disabled className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Private Repository (Coming Soon!)
            </Button>
          ) : (
            <Button asChild>
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          )}

          {demoUrl && (
            <Button variant="outline" asChild>
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Visit App
              </a>
            </Button>
          )}
        </div>
      </div>

      <TabsContent value="iframe" className="mt-0">
        <div className="relative w-full h-[400px] border rounded-lg overflow-hidden bg-background">
          {iframeLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          <iframe
            src={demoUrl}
            className={`absolute inset-0 w-full h-full ${
              iframeError ? "hidden" : ""
            }`}
            title={`${title} demo`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-forms"
            onLoad={() => setIframeLoading(false)}
            onError={() => {
              setIframeLoading(false);
              setIframeError(true);
            }}
          />

          {iframeError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <p className="text-muted-foreground mb-2">
                The live preview couldn&apos;t be loaded due to security
                restrictions.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Many websites prevent embedding in iframes for security reasons.
                Try the screenshot view or visit the site directly.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const tab = document.querySelector(
                    '[data-value="screenshot"]'
                  ) as HTMLElement;
                  if (tab) tab.click();
                }}
              >
                View Screenshot Instead
              </Button>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="screenshot" className="mt-0">
        <div className="relative w-full h-[400px] border rounded-lg overflow-hidden bg-background">
          {screenshotLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          <img
            src={screenshotUrl}
            alt={`Screenshot of ${title} demo`}
            className={`w-full h-full object-contain ${
              screenshotError ? "hidden" : ""
            }`}
            onLoad={() => setScreenshotLoading(false)}
            onError={() => {
              // Try fallback screenshot service
              const fallbackImg = new Image();
              fallbackImg.onload = () => {
                const imgElement = document.querySelector(
                  "[data-screenshot-img]"
                ) as HTMLImageElement;
                if (imgElement) {
                  imgElement.src = fallbackScreenshotUrl;
                  setScreenshotLoading(false);
                }
              };
              fallbackImg.onerror = () => {
                setScreenshotLoading(false);
                setScreenshotError(true);
              };
              fallbackImg.src = fallbackScreenshotUrl;
            }}
            data-screenshot-img
          />

          {screenshotError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <p className="text-muted-foreground mb-2">
                Couldn&apos;t load a screenshot of the demo.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                The screenshot service might be temporarily unavailable.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(demoUrl, "_blank")}
              >
                Open Demo in New Tab
              </Button>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
