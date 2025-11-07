export type RouteMeta = {
  title?: string;
  description?: string;
  ogImageAlt?: string;
};

export const defaultMeta = {
  title: "Joseph Chalabi",
  siteName: "jchalabi.xyz",
  description: "Portfolio website showcasing my projects and skills",
  url:
    (process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") as string) ||
    "https://jchalabi.xyz",
  locale: "en_US",
  keywords:
    "software engineer, portfolio, web development, react, typescript, blockchain, ai",
  ogImagePath: "/og-image.png",
} as const;

// Route-specific metadata for common pages in this app
export const routeMeta: Record<string, RouteMeta> = {
  "/": {
    description: defaultMeta.description,
    ogImageAlt: "Home",
  },
  "/blog": {
    title: "Blog",
    description:
      "Thoughts, tutorials, and insights on web development, blockchain, AI and memes.",
    ogImageAlt: "Blog",
  },
  "/portfolio": {
    title: "Portfolio",
    description: "Selected projects and case studies.",
    ogImageAlt: "Portfolio",
  },
  "/contact": {
    title: "Contact",
    description: "Get in touch with Joseph.",
    ogImageAlt: "Contact",
  },
};

export function getMetaForPath(pathname: string): RouteMeta {
  if (routeMeta[pathname]) return routeMeta[pathname];

  // Blog posts: /blog/[slug]
  if (pathname.startsWith("/blog/") && pathname !== "/blog") {
    const slug = pathname.split("/")[2];
    const blogTitle = slug
      ?.split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      title: "Blog",
      description: blogTitle ?? "Blog post",
      ogImageAlt: blogTitle ?? "Blog Post",
    };
  }

  // Portfolio details: /portfolio/[id]
  if (pathname.startsWith("/portfolio/") && pathname !== "/portfolio") {
    return {
      title: "Project",
      description: "Project details and write-up",
      ogImageAlt: "Project Details",
    };
  }

  return {};
}

export function buildOgAndTwitter(pathname: string, meta: RouteMeta) {
  const siteUrl = defaultMeta.url;
  const canonical = `${siteUrl}${pathname}`;
  
  const title = meta.title ?? defaultMeta.title;
  const description = meta.description ?? defaultMeta.description;
  
  const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;
  const ogImageAlt = meta.ogImageAlt ?? meta.title ?? defaultMeta.title;

  return {
    alternates: { canonical },
    openGraph: {
      type: "website" as const,
      url: canonical,
      siteName: defaultMeta.siteName,
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
      locale: defaultMeta.locale,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [ogImageUrl],
    },
  };
}


