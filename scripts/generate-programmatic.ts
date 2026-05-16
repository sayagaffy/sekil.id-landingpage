/**
 * Programmatic content generation script using Anthropic API.
 *
 * Usage:
 *   npm run content:generate -- --type personality --slug intj
 *   npm run content:generate -- --type career --slug data-scientist
 *   npm run content:generate -- --type major --slug teknik-informatika
 *   npm run content:generate:all:personality
 *   npm run content:generate:all:career
 *   npm run content:generate:all:major
 *
 * All generated files go to content/_drafts/<type>/<slug>.mdx
 * NEVER auto-publish. UNJANI sign-off required before moving to content/<type>/
 */
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { PERSONALITY_TYPES, getPersonalityBySlug } from '../src/data/personality-types';
import { CAREERS, getCareerBySlug } from '../src/data/careers';
import { MAJORS, getMajorBySlug } from '../src/data/majors';

const DRAFT_DIR = join(process.cwd(), 'content', '_drafts');
const PROMPTS_DIR = join(process.cwd(), 'scripts', 'prompts');

type ContentType = 'personality' | 'career' | 'major';

function loadPrompt(filename: string): string {
  const filePath = join(PROMPTS_DIR, filename);
  if (!existsSync(filePath)) {
    throw new Error(`Prompt file not found: ${filePath}`);
  }
  return readFileSync(filePath, 'utf-8');
}

function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

function ensureDir(dir: string): void {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function draftPath(type: ContentType, slug: string): string {
  const typeDirMap: Record<ContentType, string> = {
    personality: 'kepribadian',
    career: 'karier',
    major: 'jurusan',
  };
  return join(DRAFT_DIR, typeDirMap[type], `${slug}.mdx`);
}

function getPersonalityVars(slug: string): Record<string, string> | null {
  const p = getPersonalityBySlug(slug);
  if (!p) return null;
  return {
    SLUG: p.slug,
    CODE: p.code,
    NAME: p.name,
    TAGLINE: p.tagline,
    TYPE: p.type === 'mbti' ? 'MBTI' : 'Holland Code',
    DESCRIPTION_SEED: p.description,
    CORE_TRAITS: p.coreTraits.join('; '),
    STRENGTHS: p.strengths.join('; '),
    CHALLENGES: p.challenges.join('; '),
    RELATED_CAREERS: p.commonCareers.join(', '),
    RELATED_MAJORS: p.commonMajors.join(', '),
    PRIMARY_KEYWORD: p.primaryKeyword,
    SEO_DESCRIPTION: p.seoDescription,
    TODAY: new Date().toISOString().split('T')[0],
  };
}

function getCareerVars(slug: string): Record<string, string> | null {
  const c = getCareerBySlug(slug);
  if (!c) return null;
  return {
    SLUG: c.slug,
    NAME: c.name,
    CATEGORY: c.category,
    DESCRIPTION_SEED: c.description,
    SALARY_MIN: `Rp ${(c.salaryRange.min / 1000000).toFixed(0)} juta`,
    SALARY_MAX: `Rp ${(c.salaryRange.max / 1000000).toFixed(0)} juta`,
    EDUCATION_LEVEL: c.educationLevel,
    GROWTH_OUTLOOK: c.growthOutlook,
    REQUIRED_SKILLS: c.requiredSkills.join('; '),
    HOLLAND_CODES: c.hollandCodes.join(', '),
    RELATED_MAJORS: c.relatedMajors.join(', '),
    RELATED_PERSONALITIES: c.commonPersonalities.join(', '),
    PRIMARY_KEYWORD: c.primaryKeyword,
    SEO_DESCRIPTION: c.seoDescription,
    TODAY: new Date().toISOString().split('T')[0],
  };
}

function getMajorVars(slug: string): Record<string, string> | null {
  const m = getMajorBySlug(slug);
  if (!m) return null;
  return {
    SLUG: m.slug,
    NAME: m.name,
    SHORT_NAME: m.shortName,
    FACULTY: m.faculty,
    DESCRIPTION_SEED: m.description,
    DURATION: m.typicalDuration,
    HOLLAND_CODES: m.hollandCodes.join(', '),
    CAREER_PATHS: m.careerPaths.join(', '),
    TOP_UNIVERSITIES: m.topUniversitiesIndonesia.map((u) => u.name).join('; '),
    RELATED_PERSONALITIES: m.commonPersonalities.join(', '),
    PRIMARY_KEYWORD: m.primaryKeyword,
    SEO_DESCRIPTION: m.seoDescription,
    TODAY: new Date().toISOString().split('T')[0],
  };
}

async function generateOne(
  client: Anthropic,
  type: ContentType,
  slug: string,
  dryRun = false,
): Promise<void> {
  const systemPromptFile = `${type}-system.txt`;
  const userPromptFile = `${type}-user.txt`;

  let vars: Record<string, string> | null = null;
  if (type === 'personality') vars = getPersonalityVars(slug);
  else if (type === 'career') vars = getCareerVars(slug);
  else vars = getMajorVars(slug);

  if (!vars) {
    console.error(`[SKIP] Unknown ${type} slug: ${slug}`);
    return;
  }

  const outPath = draftPath(type, slug);
  if (existsSync(outPath)) {
    console.log(`[SKIP] Draft already exists: ${outPath}`);
    return;
  }

  const systemPrompt = fillTemplate(loadPrompt(systemPromptFile), vars);
  const userPrompt = fillTemplate(loadPrompt(userPromptFile), vars);

  if (dryRun) {
    console.log(`[DRY-RUN] Would generate: ${outPath}`);
    console.log('--- SYSTEM ---\n', systemPrompt.slice(0, 200), '...');
    return;
  }

  console.log(`[GEN] ${type}/${slug} → ${outPath}`);

  const message = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 4096,
    temperature: 0.3,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error(`Unexpected response type: ${content.type}`);
  }

  const mdxContent = content.text;
  ensureDir(join(DRAFT_DIR, type === 'personality' ? 'kepribadian' : type === 'career' ? 'karier' : 'jurusan'));
  writeFileSync(outPath, mdxContent, 'utf-8');

  console.log(`[DONE] ${outPath} (${mdxContent.length} chars)`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  const typeIdx = args.indexOf('--type');
  const slugIdx = args.indexOf('--slug');
  const allIdx = args.indexOf('--all');
  const dryRun = args.includes('--dry-run');

  const typeArg = typeIdx !== -1 ? (args[typeIdx + 1] as ContentType) : undefined;
  const slugArg = slugIdx !== -1 ? args[slugIdx + 1] : undefined;
  const allArg = allIdx !== -1 || args.includes('all');

  if (!typeArg) {
    console.error('Usage: tsx scripts/generate-programmatic.ts --type <personality|career|major> [--slug <slug>] [--all] [--dry-run]');
    process.exit(1);
  }

  if (!['personality', 'career', 'major'].includes(typeArg)) {
    console.error(`Invalid type: ${typeArg}. Must be personality, career, or major.`);
    process.exit(1);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey && !dryRun) {
    console.error('ANTHROPIC_API_KEY is not set. Add it to .env.local.');
    process.exit(1);
  }

  const client = new Anthropic({ apiKey: apiKey ?? 'placeholder' });

  if (allArg) {
    const slugs =
      typeArg === 'personality'
        ? PERSONALITY_TYPES.map((p) => p.slug)
        : typeArg === 'career'
          ? CAREERS.map((c) => c.slug)
          : MAJORS.map((m) => m.slug);

    console.log(`Generating ${slugs.length} ${typeArg} drafts...`);
    for (const slug of slugs) {
      await generateOne(client, typeArg, slug, dryRun);
      // Rate limit: 1 req/sec to avoid API rate limiting
      if (!dryRun) await new Promise((r) => setTimeout(r, 1000));
    }
  } else if (slugArg) {
    await generateOne(client, typeArg, slugArg, dryRun);
  } else {
    console.error('Provide --slug <slug> or --all');
    process.exit(1);
  }

  console.log('\nDone. Review generated drafts in content/_drafts/ before publishing.');
  console.log('Run: npm run content:validate -- --include-drafts');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
