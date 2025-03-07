import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  getPostBySlug,
  getAllPosts,
  formatDate,
  calculateReadingTime,
} from "@/lib/mdx";
import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/markdown/CodeBlock";
import SimpleGeometricIcon from "@/components/SimpleGeometricIcon";

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
}) {
  if (!params) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  try {
    // Get the post data
    const { slug } = await params;

    // If it's an image file, return early with a not found page metadata
    if (isImageFile(slug)) {
      return {
        title: "Not Found",
        description: "The requested resource could not be found.",
      };
    }

    const post = getPostBySlug(slug);

    return {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
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
  if (!params) {
    notFound();
  }

  try {
    // Get the post data
    const { slug } = await params;

    // If it's an image file, return a 404 page
    if (isImageFile(slug)) {
      notFound();
    }

    const post = getPostBySlug(slug);

    if (!post) {
      console.error(`Post not found for slug: ${slug}`);
      notFound();
    }

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

            <div className="h-64 md:h-80 lg:h-96 mb-8 rounded-lg overflow-hidden">
              <SimpleGeometricIcon
                seed={post.frontmatter.title}
                className="w-full h-full"
              />
            </div>
          </div>

          <article className="prose prose-lg dark:prose-invert max-w-none border-b pb-8">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeBlock,
              }}
            >
              {post.content}
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
