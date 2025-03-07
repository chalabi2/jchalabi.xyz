import { compareDesc, format, parseISO } from 'date-fns';


// Define a Post type that matches the structure from contentlayer
type Post = {
  _id: string;
  _raw: {
    flattenedPath: string;
  };
  title: string;
  description: string;
  date: string;
  tags?: string[];
  published: boolean;
  slug: string;
  url: string;
  body: {
    raw: string;
    code: string;
  };
};

export function sortPostsByDate(posts: Post[]) {
  return posts.sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date));
  });
}

export function formatDate(date: string) {
  const parsedDate = parseISO(date);
  return format(parsedDate, 'MMMM dd, yyyy');
}

/**
 * Generate a random color palette for styling
 */
export function getRandomColorPalette() {
  const hue = Math.floor(Math.random() * 360);
  return {
    primary: `hsl(${hue}, 60%, 50%)`,
    secondary: `hsl(${(hue + 120) % 360}, 60%, 50%)`,
    tertiary: `hsl(${(hue + 240) % 360}, 60%, 50%)`,
  };
}

// Calculate reading time based on word count
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
} 