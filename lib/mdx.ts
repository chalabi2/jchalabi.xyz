import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compareDesc, format } from 'date-fns';

// Define the Post type
export type Post = {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    date: string;
    tags?: string[];
    published?: boolean;
  };
  content: string;
  compiledSource?: React.ReactElement;
};

const postsDirectory = path.join(process.cwd(), 'content/posts');

// Get all post slugs
export function getPostSlugs() {
  return fs.readdirSync(postsDirectory).filter(file => 
    file.endsWith('.mdx') || file.endsWith('.md')
  );
}

// Get post by slug
export function getPostBySlug(slug: string): Post {
  try {
    const realSlug = slug.replace(/\.mdx$|\.md$/, '');
    
    // Try with .mdx extension first
    let filePath = path.join(postsDirectory, `${realSlug}.mdx`);
    
    // If .mdx file doesn't exist, try .md extension
    if (!fs.existsSync(filePath)) {
      filePath = path.join(postsDirectory, `${realSlug}.md`);
      
      // If neither exists, throw an error
      if (!fs.existsSync(filePath)) {
        throw new Error(`Post not found: ${realSlug}`);
      }
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Validate required frontmatter fields
    if (!data.title) {
      console.warn(`Post ${realSlug} is missing a title`);
    }
    
    if (!data.date) {
      console.warn(`Post ${realSlug} is missing a date`);
    }
    
    const post = {
      slug: realSlug,
      frontmatter: {
        title: data.title || 'Untitled',
        description: data.description || '',
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        tags: Array.isArray(data.tags) ? data.tags : [],
        published: data.published !== false, // Default to true if not specified
      },
      content,
    };
    
    return post;
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    // Return a fallback post
    return {
      slug,
      frontmatter: {
        title: 'Post Not Found',
        description: 'The requested post could not be found.',
        date: new Date().toISOString(),
        tags: [],
        published: false,
      },
      content: '# Post Not Found\n\nThe requested post could not be found.',
    };
  }
}

// Get all posts
export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map(slug => getPostBySlug(slug))
    .filter(post => post.frontmatter.published !== false);
  
  // Sort posts by date in descending order
  return posts.sort((a, b) => 
    compareDesc(
      new Date(a.frontmatter.date),
      new Date(b.frontmatter.date)
    )
  );
}

// Format date
export function formatDate(date: string) {
  try {
    return format(new Date(date), "MMMM dd, yyyy");
  } catch (error) {
    console.error(`Error formatting date: ${date}`, error);
    return "Invalid date";
  }
}

// Calculate reading time
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
} 