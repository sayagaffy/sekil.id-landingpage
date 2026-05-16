import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

const CONTENT_ROOTS = [
  'content/blog',
  'content/panduan',
  'content/kepribadian',
  'content/karier',
  'content/jurusan',
];

const FORBIDDEN_PATTERNS = [
  /\b(diagnosis|kelainan|gangguan kepribadian)\b/i,
  /\b(100%|pasti sukses|dijamin sukses|tidak akan pernah gagal)\b/i,
  /\b(harus minum obat|berhenti dari obat|terapi pasti)\b/i,
];

const REQUIRED_DISCLAIMER_PATTERNS = [
  /bukan diagnosis/i,
  /bukan pengganti konsultasi profesional/i,
  /hasil ini bersifat deskriptif/i,
];

const MIN_WORD_COUNT = 800;
const MAX_WORD_COUNT = 3500;

interface ValidationError {
  file: string;
  message: string;
  severity: 'error' | 'warning';
}

const errors: ValidationError[] = [];

function walkFiles(dir: string): string[] {
  const files: string[] = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const path = join(dir, entry);
      const stat = statSync(path);
      if (stat.isDirectory()) files.push(...walkFiles(path));
      else if (entry.endsWith('.mdx')) files.push(path);
    }
  } catch {
    // Folder belum ada — skip
  }
  return files;
}

function validateFile(filepath: string): void {
  const raw = readFileSync(filepath, 'utf-8');
  const { data: frontmatter, content } = matter(raw);
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  const requiredFields = ['title', 'description', 'publishedAt', 'author'];
  for (const field of requiredFields) {
    if (!frontmatter[field]) {
      errors.push({ file: filepath, message: `Missing frontmatter: ${field}`, severity: 'error' });
    }
  }

  if (wordCount < MIN_WORD_COUNT) {
    errors.push({
      file: filepath,
      message: `Word count ${wordCount} < min ${MIN_WORD_COUNT}`,
      severity: 'error',
    });
  }
  if (wordCount > MAX_WORD_COUNT) {
    errors.push({
      file: filepath,
      message: `Word count ${wordCount} > max ${MAX_WORD_COUNT}`,
      severity: 'warning',
    });
  }

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(content)) {
      errors.push({
        file: filepath,
        message: `Forbidden pattern match: ${pattern}`,
        severity: 'error',
      });
    }
  }

  const isYMYL = /\b(kepribadian|psikologi|asesmen|burnout|mental)\b/i.test(content);
  if (isYMYL) {
    const hasDisclaimer = REQUIRED_DISCLAIMER_PATTERNS.some((p) => p.test(content));
    if (!hasDisclaimer) {
      errors.push({
        file: filepath,
        message: 'YMYL content missing required disclaimer',
        severity: 'error',
      });
    }
  }
}

function main(): void {
  const allFiles = CONTENT_ROOTS.flatMap(walkFiles);
  console.log(`Validating ${allFiles.length} content files...`);
  allFiles.forEach(validateFile);

  const errCount = errors.filter((e) => e.severity === 'error').length;
  const warnCount = errors.filter((e) => e.severity === 'warning').length;

  if (errors.length === 0) {
    console.log('All content valid');
    process.exit(0);
  }

  console.log(`\n${errCount} error(s), ${warnCount} warning(s):\n`);
  for (const e of errors) {
    const icon = e.severity === 'error' ? 'ERROR' : 'WARN';
    console.log(`[${icon}] ${e.file}: ${e.message}`);
  }

  if (errCount > 0) process.exit(1);
}

main();
