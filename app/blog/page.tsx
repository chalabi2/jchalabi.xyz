import type { Metadata } from "next";
import { buildOgAndTwitter, getMetaForPath } from "@/lib/seo";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllPosts, formatDate, calculateReadingTime } from "@/lib/mdx";
import Image from "next/image";

export default function Blog() {
  const posts = getAllPosts();
  const featuredPost = posts.length > 0 ? posts[0] : null; // Use the most recent post as featured

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thoughts, tutorials, and insights on web development, blockchain, AI
            and memes.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost ? (
          <div className="mb-16">
            <div className="bg-card rounded-lg overflow-hidden border border-border shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-primary/10 to-primary/5">
                    <Image
                      src={`/blog/${featuredPost.slug}.jpg`}
                      alt={featuredPost.frontmatter.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full mr-3">
                      Featured
                    </span>
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="mr-3">
                      {formatDate(featuredPost.frontmatter.date)}
                    </span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{calculateReadingTime(featuredPost.content)}</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">
                    {featuredPost.frontmatter.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {featuredPost.frontmatter.description}
                  </p>
                  <Button asChild>
                    <Link href={`/blog/${featuredPost.slug}`}>
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-16 text-center">
            <div className="bg-card rounded-lg p-8 border border-border shadow-md">
              <h2 className="text-2xl font-bold mb-4">No posts yet</h2>
              <p className="text-muted-foreground mb-6">
                Check back soon for new content!
              </p>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        {posts.length > 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(1).map((post) => {
              return (
                <div
                  key={post.slug}
                  className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-all hover:shadow-md"
                >
                  <div className="relative h-48">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-primary/10 to-primary/5">
                      <Image
                        src={`/blog/${post.slug}.jpg`}
                        alt={post.frontmatter.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      {post.frontmatter.tags &&
                        post.frontmatter.tags.length > 0 && (
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full mr-3">
                            {post.frontmatter.tags[0]}
                          </span>
                        )}
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="mr-3">
                        {formatDate(post.frontmatter.date)}
                      </span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{calculateReadingTime(post.content)}</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2">
                      {post.frontmatter.title}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {post.frontmatter.description}
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        Read More
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export const metadata: Metadata = (() => {
  const pathname = "/blog";
  const meta = getMetaForPath(pathname);
  const og = buildOgAndTwitter(pathname, meta);
  return {
    title: meta.title ?? "Blog",
    description: meta.description,
    ...og,
  };
})();
