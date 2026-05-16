import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export type ProgrammaticContentType = 'kepribadian' | 'karier' | 'jurusan';

export interface ProgrammaticMeta {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  modifiedAt: string;
  author: string;
  authorCredential?: string;
  reviewedBy?: string;
  tags: string[];
  readingTime: string;
}

export interface ProgrammaticContent {
  meta: ProgrammaticMeta;
  content: string;
}

export function getProgrammaticContent(
  type: ProgrammaticContentType,
  slug: string,
): ProgrammaticContent | null {
  const filePath = path.join(process.cwd(), 'content', type, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  const meta: ProgrammaticMeta = {
    slug,
    title: data.title ?? slug,
    description: data.description ?? '',
    publishedAt: data.publishedAt ?? '',
    modifiedAt: data.modifiedAt ?? data.publishedAt ?? '',
    author: data.author ?? 'Tim Sekil.id',
    authorCredential: data.authorCredential,
    reviewedBy: data.reviewedBy,
    tags: data.tags ?? [],
    readingTime: `${Math.ceil(stats.minutes)} menit baca`,
  };

  return { meta, content };
}
