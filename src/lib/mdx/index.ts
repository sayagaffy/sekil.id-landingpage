import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  modifiedAt: string;
  author: string;
  authorCredential?: string;
  reviewedBy?: string;
  category: string;
  tags: string[];
  featured?: boolean;
  coverImage?: string | null;
  readingTime: string;
}

function parseFrontmatter(slug: string): { meta: PostMeta; content: string } | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  const meta: PostMeta = {
    slug,
    title: data.title ?? slug,
    description: data.description ?? '',
    publishedAt: data.publishedAt ?? '',
    modifiedAt: data.modifiedAt ?? data.publishedAt ?? '',
    author: data.author ?? 'Tim Sekil.id',
    authorCredential: data.authorCredential,
    reviewedBy: data.reviewedBy,
    category: data.category ?? 'Umum',
    tags: data.tags ?? [],
    featured: data.featured ?? false,
    coverImage: data.coverImage ?? null,
    readingTime: `${Math.ceil(stats.minutes)} menit baca`,
  };

  return { meta, content };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));
  const posts = files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const result = parseFrontmatter(slug);
      return result?.meta ?? null;
    })
    .filter((m): m is PostMeta => m !== null)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return posts;
}

export function getPostBySlug(slug: string): { meta: PostMeta; content: string } | null {
  return parseFrontmatter(slug);
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getRelatedPosts(
  currentSlug: string,
  category: string,
  limit = 3,
): PostMeta[] {
  return getAllPosts()
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, limit);
}
