#!/usr/bin/env npx tsx
/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

/**
 * Scrapes all child pages of the IBM Docs PL/I built-in functions index page
 * via the IBM Docs content API, extracts the <article role="article"> element
 * from each, and writes them to:
 *   scripts/builtins/html/<NAME>.html
 * where <NAME> is derived from the page's <h1 class="topictitle1"> element.
 *
 * Usage:  npx tsx scripts/fetch-builtin-functions.mts
 */

import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Configuration ─────────────────────────────────────────────────────────────

/** IBM Docs content API base URL (must end with "/"). */
const CONTENT_API_BASE =
  "https://www.ibm.com/docs/api/v1/content/SSY2V3_6.1/";

/** Path within CONTENT_API_BASE for the index/summary page. */
const INDEX_PATH = "lrm/plilrmbuiltindescriptions.html";

const OUT_DIR = resolve(__dirname, "builtins/html");

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "en-US,en;q=0.9",
};

/** Polite delay between requests (ms). */
const DELAY_MS = 150;

// ── HTTP ──────────────────────────────────────────────────────────────────────

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: FETCH_HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

// ── HTML helpers ──────────────────────────────────────────────────────────────

/** Strip all XML/HTML tags and decode common entities. */
function stripTags(s: string): string {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

/**
 * Extract text content of the first <h1 class="topictitle1"> element.
 * Returns null if not found.
 */
function extractTopicTitle(html: string): string | null {
  const match =
    /<h1[^>]*\bclass="[^"]*\btopictitle1\b[^"]*"[^>]*>([\s\S]*?)<\/h1>/i.exec(
      html,
    );
  if (!match) return null;
  return stripTags(match[1])
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract the full <article role="article"> element (including its outer tag).
 * Handles nested <article> elements via depth counting.
 * Returns null if not found.
 */
function extractArticle(html: string): string | null {
  const openRe = /<article\b[^>]*\brole="article"[^>]*>/i.exec(html);
  if (!openRe) return null;

  const outerStart = openRe.index;
  let pos = outerStart + openRe[0].length;
  let depth = 1;

  while (pos < html.length && depth > 0) {
    const nextOpen = html.indexOf("<article", pos);
    const nextClose = html.indexOf("</article>", pos);

    if (nextClose === -1) return null; // malformed HTML

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen + "<article".length;
    } else {
      depth--;
      pos = nextClose + "</article>".length;
    }
  }

  return depth === 0 ? html.slice(outerStart, pos) : null;
}

// ── Link extraction ───────────────────────────────────────────────────────────

/**
 * Extract child-topic content-API URLs from <li class="ulchildlink"> elements.
 * Resolves relative hrefs against the URL of the page they appear on.
 */
function extractChildLinks(html: string, pageUrl: string): string[] {
  const seen = new Set<string>();
  const baseDir = pageUrl.substring(0, pageUrl.lastIndexOf("/") + 1);

  const liRe =
    /<li[^>]*\bclass="[^"]*\bulchildlink\b[^"]*"[^>]*>[\s\S]*?<a\s+href="([^"]+)"/gi;
  let m: RegExpExecArray | null;

  while ((m = liRe.exec(html)) !== null) {
    const href = m[1].trim();
    if (!href || href.startsWith("http") || href.startsWith("//")) continue;
    if (href.startsWith("?") || href.startsWith("#")) continue;
    try {
      const resolved = new URL(href, baseDir).toString();
      seen.add(resolved.split("?")[0]); // strip any query string
    } catch {
      continue;
    }
  }

  return [...seen];
}

// ── Filename helpers ──────────────────────────────────────────────────────────

/**
 * Convert a topic title into a safe filename (no path separators or
 * shell-special characters; runs of whitespace collapsed to underscores).
 */
function toFilename(title: string): string {
  return title
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });

  const indexUrl = `${CONTENT_API_BASE}${INDEX_PATH}?lang=en`;
  console.log(`Fetching index page:`);
  console.log(`  ${indexUrl}\n`);

  const indexHtml = await fetchHtml(indexUrl);
  const childLinks = extractChildLinks(indexHtml, indexUrl);

  if (childLinks.length === 0) {
    console.error(
      'No <li class="ulchildlink"> links found on the index page.\n' +
        "The page structure may have changed.",
    );
    process.exit(1);
  }

  console.log(`Found ${childLinks.length} child pages.\n`);

  let saved = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < childLinks.length; i++) {
    const rawUrl = childLinks[i];
    const url = `${rawUrl}?lang=en`;
    process.stdout.write(
      `[${String(i + 1).padStart(3)}/${childLinks.length}] ${rawUrl} … `,
    );

    try {
      const html = await fetchHtml(url);

      const title = extractTopicTitle(html);
      if (!title) {
        console.log("SKIP (no <h1 class=topictitle1> found)");
        skipped++;
        continue;
      }

      const article = extractArticle(html);
      if (!article) {
        console.log(`SKIP (no <article role=article> found) — "${title}"`);
        skipped++;
        continue;
      }

      const filename = toFilename(title) + ".html";
      const outPath = resolve(OUT_DIR, filename);
      writeFileSync(outPath, article, "utf-8");
      console.log(`"${title}"`);
      saved++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`ERROR: ${msg}`);
      failed++;
    }

    if (i < childLinks.length - 1) {
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }

  console.log(
    `\n${"─".repeat(72)}\n` +
      `Saved: ${saved}  Skipped: ${skipped}  Failed: ${failed}\n` +
      `Output directory: ${OUT_DIR}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
