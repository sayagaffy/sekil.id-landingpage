#!/usr/bin/env node
/**
 * Content validation guard — npm run content:validate
 *
 * Scans src/ + content/ + public/ + scripts/migrate-to-sanity.mjs and exits 1 on [FAIL] violations.
 * Prints [WARN] for soft issues that need founder review.
 *
 * Rules:
 *   A  Rendered tokens      __NEEDS_*  in string literals         → FAIL
 *   B  Bracket placeholders [Placeholder / [Nama / [Founder …    → FAIL
 *   C  Ghost numbers        62.400, 62,000, 2.000+ responden …   → FAIL
 *   D  Fixed duration       duration:'N menit' (non-canonical)   → FAIL
 *   E  Study claims done    dikalibrasi / pilot testing …        → WARN
 *   F  Title issues         double-brand or >60 chars            → WARN
 *   G  Sitemap dead link    sitemap-programmatic.xml             → FAIL
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

let failCount = 0;
let warnCount = 0;

function fail(file, lineNum, snippet) {
  const loc = lineNum === '—' ? file : `${file}:${lineNum}`;
  console.error(`[FAIL] ${loc}`);
  console.error(`       ${snippet.trim().slice(0, 120)}`);
  failCount++;
}

function warn(file, lineNum, snippet) {
  const loc = lineNum === '—' ? file : `${file}:${lineNum}`;
  console.warn(`[WARN] ${loc}`);
  console.warn(`       ${snippet.trim().slice(0, 120)}`);
  warnCount++;
}

// ─── File walker ──────────────────────────────────────────────────────────────

function* walkFiles(dir, exts) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      const skip = ['node_modules', '.next', '.git', '.cache', 'out'];
      if (skip.includes(entry.name)) continue;
      yield* walkFiles(full, exts);
    } else if (exts.some((e) => entry.name.endsWith(e))) {
      yield full;
    }
  }
}

// ─── Comment-stripping helpers ────────────────────────────────────────────────

/**
 * Return the portion of a line that precedes any unquoted // comment.
 */
function stripLineComment(line) {
  let inSingle = false, inDouble = false, inTemplate = false;
  for (let i = 0; i < line.length - 1; i++) {
    const ch = line[i];
    if (ch === '\\') { i++; continue; }
    if (ch === "'" && !inDouble && !inTemplate) { inSingle = !inSingle; continue; }
    if (ch === '"' && !inSingle && !inTemplate) { inDouble = !inDouble; continue; }
    if (ch === '`' && !inSingle && !inDouble) { inTemplate = !inTemplate; continue; }
    if (ch === '/' && line[i + 1] === '/' && !inSingle && !inDouble && !inTemplate) {
      return line.slice(0, i);
    }
  }
  return line;
}

/**
 * Return true if `token` appears inside a quoted string in `text`
 * (text should already have line-comment suffix stripped).
 */
function tokenInString(text, token) {
  let inSingle = false, inDouble = false, inTemplate = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '\\') { i++; continue; }
    if (ch === "'" && !inDouble && !inTemplate) { inSingle = !inSingle; continue; }
    if (ch === '"' && !inSingle && !inTemplate) { inDouble = !inDouble; continue; }
    if (ch === '`' && !inSingle && !inDouble) { inTemplate = !inTemplate; continue; }
    if ((inSingle || inDouble || inTemplate) && text.startsWith(token, i)) return true;
  }
  return false;
}

// ─── A: Rendered tokens ───────────────────────────────────────────────────────

const TOKENS = [
  '__NEEDS_REAL_VALUE__',
  '__NEEDS_FOUNDER_CONFIRM__',
  '__NEEDS_KEYWORD_VERIFY__',
];

function checkTokens(filePath, lines) {
  const rel = relative(ROOT, filePath).replace(/\\/g, '/');
  let inBlock = false;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];

    // Block comment tracking
    if (!inBlock && raw.includes('/*')) inBlock = true;
    if (inBlock) {
      if (raw.includes('*/')) inBlock = false;
      continue;
    }
    if (raw.trim().startsWith('//')) continue; // full-line comment

    for (const token of TOKENS) {
      if (!raw.includes(token)) continue;
      const stripped = stripLineComment(raw);
      if (tokenInString(stripped, token)) {
        fail(rel, i + 1, raw);
      }
    }
  }
}

// ─── B: Bracket placeholders ─────────────────────────────────────────────────

const PLACEHOLDER_RE = /\[Placeholder|\[Nama\b|\[Founder\b|\[CTO\b|\[Head of\b|\[Sales\b|\[B One\b|\[UNJANI Acad/;

function checkPlaceholders(filePath, lines) {
  const rel = relative(ROOT, filePath).replace(/\\/g, '/');
  let inBlock = false;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (!inBlock && raw.includes('/*')) inBlock = true;
    if (inBlock) { if (raw.includes('*/')) inBlock = false; continue; }
    if (raw.trim().startsWith('//') || raw.trim().startsWith('*')) continue;
    const stripped = stripLineComment(raw);
    if (PLACEHOLDER_RE.test(stripped)) {
      fail(rel, i + 1, raw);
    }
  }
}

// ─── C: Ghost numbers ────────────────────────────────────────────────────────

const GHOST_RE = [
  /62[,.]400/,
  /62[,.]000/,
  /2[,.]000\+\s*responden/,
  /340\s*sekolah/i,
  /18\s*provinsi/i,
  // Sanity seed heroMeta fake institutional-reach labels:
  /label:\s*['"]SEKOLAH['"]/,
  /label:\s*['"]PROVINSI['"]/,
];

function checkGhostNumbers(filePath, lines) {
  const rel = relative(ROOT, filePath).replace(/\\/g, '/');
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (raw.trim().startsWith('//')) continue;
    const stripped = stripLineComment(raw);
    for (const re of GHOST_RE) {
      if (re.test(stripped)) {
        fail(rel, i + 1, raw);
      }
    }
  }
}

// ─── D: Fixed-duration product entries ───────────────────────────────────────
// Only in products.ts and solutions.ts — blog body allowed.
// Canonical phrase: 'mulai dari 15 menit, bervariasi per peserta'

const DURATION_FIX_RE = /(?:duration|value)\s*:\s*'(\d+)\s*menit'/;

function checkDuration(filePath, lines) {
  const rel = relative(ROOT, filePath).replace(/\\/g, '/');
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (raw.trim().startsWith('//')) continue;
    if (!DURATION_FIX_RE.test(raw)) continue;
    // Canonical phrase is safe
    if (raw.includes('mulai dari')) continue;
    fail(rel, i + 1, raw);
  }
}

// ─── E: Completed study claims (WARN) ────────────────────────────────────────

const STUDY_RULES = [
  { re: /\bdikalibrasi\b/, neg: null, label: 'dikalibrasi (completed claim)' },
  {
    re: /\bpilot testing\b/,
    neg: /rencana|direncanakan|sedang|Roadmap/i,
    label: 'pilot testing (completed?)',
  },
  {
    re: /\bbenchmarking norma\b/,
    neg: /sedang|disiapkan|Roadmap/i,
    label: 'benchmarking norma (completed?)',
  },
  {
    re: /\btervalidasi\b/,
    neg: /dalam proses|akademik selama|akademik yang/,
    label: 'tervalidasi (completed claim? — check context)',
  },
];

function checkStudyClaims(filePath, lines) {
  const rel = relative(ROOT, filePath).replace(/\\/g, '/');
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (raw.trim().startsWith('//')) continue;
    const stripped = stripLineComment(raw);
    for (const { re, neg, label } of STUDY_RULES) {
      if (!re.test(stripped)) continue;
      if (neg && neg.test(stripped)) continue;
      warn(rel, i + 1, `[${label}]  ${raw}`);
    }
  }
}

// ─── F: Title double-brand / length (WARN) ───────────────────────────────────

const TITLE_RE = /\btitle\s*:\s*['"`]([^'"`\n]+)['"`]/;

function checkTitles(filePath, lines) {
  const rel = relative(ROOT, filePath).replace(/\\/g, '/');
  // Only check page.tsx (not layout.tsx which sets the template)
  if (!rel.endsWith('/page.tsx') && !rel.endsWith('page.tsx')) return;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (raw.trim().startsWith('//')) continue;
    const m = TITLE_RE.exec(raw);
    if (!m) continue;
    const title = m[1];
    if (/Sekil\.id/i.test(title)) {
      warn(rel, i + 1, `title contains "Sekil.id" — template adds it, may double-brand: "${title}"`);
    }
    if (title.length > 60) {
      warn(rel, i + 1, `title ${title.length} chars (>60): "${title.slice(0, 60)}…"`);
    }
  }
}

// ─── G: Sitemap dead link ─────────────────────────────────────────────────────

function checkSitemap(filePath) {
  const rel = relative(ROOT, filePath).replace(/\\/g, '/');
  const content = readFileSync(filePath, 'utf8');
  if (content.includes('sitemap-programmatic.xml')) {
    fail(rel, '—', `references sitemap-programmatic.xml (known 404 — remove this entry)`);
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

console.log('▶ content:validate\n');

const TS_EXTS = ['.ts', '.tsx', '.mjs'];
const SRC = join(ROOT, 'src');
const CONTENT = join(ROOT, 'content');
const PUBLIC = join(ROOT, 'public');

// A + B + C: all src source files
for (const file of walkFiles(SRC, TS_EXTS)) {
  const lines = readFileSync(file, 'utf8').split('\n');
  checkTokens(file, lines);
  checkPlaceholders(file, lines);
  checkGhostNumbers(file, lines);
}

// B + C: MDX content
for (const file of walkFiles(CONTENT, ['.mdx'])) {
  const lines = readFileSync(file, 'utf8').split('\n');
  checkPlaceholders(file, lines);
  checkGhostNumbers(file, lines);
}

// D: fixed duration — only these two data files
for (const file of [
  join(SRC, 'data', 'products.ts'),
  join(SRC, 'data', 'solutions.ts'),
]) {
  if (existsSync(file)) {
    checkDuration(file, readFileSync(file, 'utf8').split('\n'));
  }
}

// E: study claims — methodology + products only
for (const file of [
  join(SRC, 'data', 'methodology.ts'),
  join(SRC, 'data', 'products.ts'),
]) {
  if (existsSync(file)) {
    checkStudyClaims(file, readFileSync(file, 'utf8').split('\n'));
  }
}

// F: titles — page.tsx files only
for (const file of walkFiles(join(SRC, 'app'), ['.tsx'])) {
  checkTitles(file, readFileSync(file, 'utf8').split('\n'));
}

// G: sitemap
for (const file of walkFiles(PUBLIC, ['.xml'])) {
  if (file.includes('sitemap')) checkSitemap(file);
}

// A + B + C + E: Sanity seed script — must stay clean of ghost data and study claims
const MIGRATE_SCRIPT = join(ROOT, 'scripts', 'migrate-to-sanity.mjs');
if (existsSync(MIGRATE_SCRIPT)) {
  const migrateLines = readFileSync(MIGRATE_SCRIPT, 'utf8').split('\n');
  checkTokens(MIGRATE_SCRIPT, migrateLines);
  checkPlaceholders(MIGRATE_SCRIPT, migrateLines);
  checkGhostNumbers(MIGRATE_SCRIPT, migrateLines);
  checkStudyClaims(MIGRATE_SCRIPT, migrateLines);
}

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(64)}`);
console.log(`Result: ${failCount} fail, ${warnCount} warn`);
if (failCount > 0) {
  console.error('\n✗ content:validate FAILED — resolve all [FAIL] items before merge.');
  process.exit(1);
} else {
  console.log('\n✓ content:validate passed' + (warnCount ? ' (review warnings above).' : '.'));
  process.exit(0);
}
