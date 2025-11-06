import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  getPostBySlug,
  getAllPosts,
  formatDate,
  calculateReadingTime,
} from "@/lib/mdx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import fs from "fs";
import path from "path";
import { CodeBlock } from "@/components/markdown/CodeBlock";
import { buildOgAndTwitter } from "@/lib/seo";

// This function runs at build time
export async function generateStaticParams() {
  try {
    const posts = getAllPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Helper function to check if a slug is an image file
function isImageFile(slug: string): boolean {
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".svg",
    ".webp",
    ".avif",
    ".ico",
  ];
  return imageExtensions.some((ext) => slug.toLowerCase().endsWith(ext));
}

// This function generates metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;

  if (!resolvedParams?.slug) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  try {
    const { slug } = resolvedParams;

    // If it's an image file, return early with a not found page metadata
    if (isImageFile(slug)) {
      return {
        title: "Not Found",
        description: "The requested resource could not be found.",
      };
    }

    const post = getPostBySlug(slug);

    const pathname = `/blog/${slug}`;
    const og = buildOgAndTwitter(pathname, {
      title: "Blog",
      description: post.frontmatter.title,
      ogImageAlt: post.frontmatter.title,
    });

    return {
      title: "Blog",
      description: post.frontmatter.title,
      ...og,
      openGraph: {
        ...og.openGraph,
        type: "article",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }
}

// The main page component
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  if (!resolvedParams?.slug) {
    notFound();
  }

  try {
    const { slug } = resolvedParams;

    // If it's an image file, return a 404 page
    if (isImageFile(slug)) {
      notFound();
    }

    const post = getPostBySlug(slug);

    if (!post) {
      console.error(`Post not found for slug: ${slug}`);
      notFound();
    }

    // Check if a blog image exists for this post
    const imagePath = `/blog/${post.slug}.jpg`;
    const publicImagePath = path.join(process.cwd(), "public", imagePath);
    const hasImage = fs.existsSync(publicImagePath);

    // Process custom components in MDX content
    const processedContent = processCustomComponents(post.content);

    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link href="/blog" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all posts
              </Link>
            </Button>

            <h1 className="text-4xl font-bold mb-4">
              {post.frontmatter.title}
            </h1>

            <div className="flex items-center text-sm text-muted-foreground mb-6">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="mr-4">{formatDate(post.frontmatter.date)}</span>
              <Clock className="h-4 w-4 mr-1" />
              <span>{calculateReadingTime(post.content)}</span>
              {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                <div className="flex ml-4 space-x-2">
                  {post.frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="h-64 md:h-80 lg:h-96 mb-8 rounded-lg overflow-hidden relative">
              {hasImage ? (
                <Image
                  src={imagePath}
                  alt={post.frontmatter.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-primary/30 to-secondary/30 flex items-center justify-center">
                  <h2 className="text-2xl font-bold text-foreground/70">
                    {post.frontmatter.title}
                  </h2>
                </div>
              )}
            </div>
          </div>

          <article className="prose prose-lg dark:prose-invert max-w-none border-b pb-8 prose-pre:bg-muted prose-pre:p-0">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code: CodeBlock,
              }}
            >
              {processedContent}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Error rendering post page`, error);
    notFound();
  }
}

/**
 * Process custom component syntax in MDX and convert to HTML
 * This allows ReactMarkdown to render our custom components
 */
function processCustomComponents(content: string): string {
  // Process YouTubeEmbed components
  const youtubeRegex =
    /<YouTubeEmbed\s+videoId="([^"]+)"(?:\s+title="([^"]+)")?(?:\s+width="([^"]+)")?(?:\s+height="([^"]+)")?\s*\/>/g;

  return content.replace(
    youtubeRegex,
    (
      match,
      videoId,
      title = "YouTube video player",
      width = "560",
      height = "315"
    ) => {
      return `<div class="relative w-full my-8">
      <div class="relative pb-[56.25%] h-0 overflow-hidden max-w-full">
        <iframe
          class="absolute top-0 left-0 w-full h-full rounded-lg"
          width="${width}"
          height="${height}"
          src="https://www.youtube.com/embed/${videoId}"
          title="${title}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </div>
    </div>`;
    }
  );
}
