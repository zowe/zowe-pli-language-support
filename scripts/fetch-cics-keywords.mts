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
 * Scrapes CICS TS command reference pages from the IBM Docs content API
 * for multiple product versions, extracts syntax diagram keywords, and writes:
 *   scripts/CICS.json  – sorted JSON array of all unique keywords
 *   scripts/CICS.md    – Markdown table per source: page title (linked) + keywords
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Source definitions ────────────────────────────────────────────────────────

interface Source {
  /** Public IBM Docs URL shown in the section heading */
  publicIndexUrl: string;
  /** IBM Docs content API base (must end with "/") */
  contentApiBase: string;
  /** Path within contentApiBase for the index/summary page */
  indexPath: string;
}

const SOURCES: Source[] = [
  {
    publicIndexUrl:
      "https://www.ibm.com/docs/en/cics-ts/5.6.0?topic=development-cics-command-summary",
    contentApiBase: "https://www.ibm.com/docs/api/v1/content/SSGMCP_5.6.0/",
    indexPath: "reference-applications/commands-api/dfhp4_commandsummary.html",
  },
  // {
  //   publicIndexUrl:
  //     "https://www.ibm.com/docs/en/cics-ts/5.6.0?topic=programming-system-commands",
  //   contentApiBase: "https://www.ibm.com/docs/api/v1/content/SSGMCP_5.6.0/",
  //   indexPath: "reference-system-programming/commands-spi/dfha81j.html",
  // },
];

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "en-US,en;q=0.9",
};

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
 * Extract the first <h1> text, falling back to <title>.
 * Newlines are collapsed to a single space so titles are safe in MD table cells.
 */
function extractTitle(html: string): string {
  const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
  const raw = h1
    ? stripTags(h1[1])
    : (/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? "");
  return raw
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ── Link extraction ───────────────────────────────────────────────────────────

/**
 * Returns all unique absolute content-API URLs linked from `html` that
 * stay within `contentApiBase`. The index page itself is excluded.
 */
function extractSubpageUrls(
  html: string,
  pageContentUrl: string,
  contentApiBase: string,
  indexPath: string,
): string[] {
  const seen = new Set<string>();
  const base = pageContentUrl.split("?")[0];
  const baseDir = base.substring(0, base.lastIndexOf("/") + 1);
  const indexKey = `${contentApiBase}${indexPath}`;

  const hrefRe = /href="([^"#]+)"/g;
  let m: RegExpExecArray | null;

  while ((m = hrefRe.exec(html)) !== null) {
    const raw = m[1].trim();
    if (!raw || raw.startsWith("http") || raw.startsWith("//")) continue;
    if (raw.startsWith("?") || raw.startsWith("#")) continue;

    let resolved: string;
    try {
      resolved = new URL(raw, baseDir).toString();
    } catch {
      continue;
    }

    const key = resolved.split("?")[0];
    if (key.startsWith(contentApiBase) && key !== indexKey && !seen.has(key)) {
      seen.add(key);
    }
  }

  return [...seen];
}

// ── Keyword extraction ────────────────────────────────────────────────────────

/**
 * Finds every <svg class="… syntaxdiagram …"> element, then within it finds
 * every <text class="… syntaxkwd …"> and collects /\b(\w+)\b/g words.
 * Nested <svg> elements are handled via a depth-counting walk.
 */
function extractKeywords(html: string): string[] {
  const words = new Set<string>();
  const svgOpenRe = /<svg(\s[^>]*)>/gi;
  let svgM: RegExpExecArray | null;

  while ((svgM = svgOpenRe.exec(html)) !== null) {
    if (!(svgM[1] ?? "").includes("syntaxdiagram")) continue;

    const contentStart = svgM.index + svgM[0].length;
    let depth = 1;
    let pos = contentStart;

    while (pos < html.length && depth > 0) {
      const nextOpen = html.indexOf("<svg", pos);
      const nextClose = html.indexOf("</svg>", pos);
      if (nextClose === -1) break;
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        pos = nextOpen + 4;
      } else {
        depth--;
        pos = nextClose + 6;
      }
    }

    const svgContent = html.slice(contentStart, pos);
    const textRe = /<text(\s[^>]*)>([\s\S]*?)<\/text>/gi;
    let textM: RegExpExecArray | null;

    while ((textM = textRe.exec(svgContent)) !== null) {
      if (!(textM[1] ?? "").includes("syntaxkwd")) continue;
      const ws = stripTags(textM[2]).match(/\b(\w+)\b/g);
      if (ws) ws.forEach((w) => words.add(w));
    }
  }

  return [...words].sort();
}

// ── Per-source scraping ───────────────────────────────────────────────────────

interface PageResult {
  contentUrl: string;
  title: string;
  keywords: string[];
}

async function scrapeSource(
  source: Source,
  allKeywords: Set<string>,
): Promise<PageResult[]> {
  const { publicIndexUrl, contentApiBase, indexPath } = source;
  const indexUrl = `${contentApiBase}${indexPath}?lang=en`;

  console.log(`\n${"─".repeat(72)}`);
  console.log(`Source : ${publicIndexUrl}`);
  console.log(`Content: ${indexUrl}`);

  const indexHtml = await fetchHtml(indexUrl);
  const subpageUrls = extractSubpageUrls(
    indexHtml,
    indexUrl,
    contentApiBase,
    indexPath,
  );
  console.log(`Found ${subpageUrls.length} linked pages.\n`);

  const pages: PageResult[] = [];

  for (let i = 0; i < subpageUrls.length; i++) {
    const rawUrl = subpageUrls[i];
    const url = rawUrl.includes("?") ? rawUrl : `${rawUrl}?lang=en`;
    process.stdout.write(
      `[${String(i + 1).padStart(3)}/${subpageUrls.length}] ${rawUrl} … `,
    );

    try {
      const html = await fetchHtml(url);
      const title = extractTitle(html) || rawUrl;
      const keywords = extractKeywords(html);
      keywords.forEach((k) => allKeywords.add(k));
      pages.push({ contentUrl: rawUrl, title, keywords });
      console.log(`"${title}" → ${keywords.length} kw`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`ERROR: ${msg}`);
      pages.push({ contentUrl: rawUrl, title: rawUrl, keywords: [] });
    }

    await new Promise((r) => setTimeout(r, 120));
  }

  return pages;
}

// ── Main ──────────────────────────────────────────────────────────────────────

/**
 * Extracts all-uppercase words from the part of a page title that precedes
 * the first "(" (or the entire title if there is no parenthesis).
 * E.g. "ALLOCATE (APPC)" → ["ALLOCATE"]
 *      "GDS CONNECT PROCESS" → ["GDS", "CONNECT", "PROCESS"]
 *      "RECEIVE (non-z/OS default)" → ["RECEIVE"]
 */
function controlWordsFromTitle(title: string): string[] {
  const prefix = title.split("(")[0];
  return prefix.match(/\b[A-Z][A-Z0-9]*\b/g) ?? [];
}

async function main(): Promise<void> {
  const allKeywords = new Set<string>();
  const sourceResults: Array<{ source: Source; pages: PageResult[] }> = [];

  for (const source of SOURCES) {
    const pages = await scrapeSource(source, allKeywords);
    sourceResults.push({ source, pages });
  }

  // ── CICS.json ──────────────────────────────────────────────────────────────
  // control: all-caps words from page titles (before first "("), sorted & deduped
  const controlSet = new Set<string>();
  for (const { pages } of sourceResults) {
    for (const { title } of pages) {
      controlWordsFromTitle(title).forEach((w) => controlSet.add(w));
    }
  }

  // storage: every keyword found in syntax diagrams that is not a control word
  const storageSet = new Set<string>();
  for (const kw of allKeywords) {
    if (!controlSet.has(kw)) storageSet.add(kw);
  }

  const output = {
    control: [...controlSet].sort(),
    storage: [...storageSet].sort(),
  };

  const jsonPath = resolve(__dirname, "cics-keywords.json");
  writeFileSync(jsonPath, JSON.stringify(output, null, 2) + "\n", "utf-8");
  console.log(
    `\n${"─".repeat(72)}\nWrote ${output.control.length} control + ${output.storage.length} storage keywords → ${jsonPath}`,
  );

  // ── CICS.md ────────────────────────────────────────────────────────────────
  const mdPath = resolve(__dirname, "../docs/CICS-KEYWORDS.md");
  const mdLines: string[] = ["# CICS Command Keywords", ""];

  for (const { source, pages } of sourceResults) {
    mdLines.push(
      `## Source: [${source.publicIndexUrl}](${source.publicIndexUrl})`,
      "",
    );
    mdLines.push("| Page | Keywords |");
    mdLines.push("| ---- | -------- |");

    for (const { contentUrl, title, keywords } of pages) {
      // Collapse whitespace/newlines and escape pipe chars for table safety
      const safeTitle = title
        .replace(/[\r\n\s]+/g, " ")
        .trim()
        .replace(/\|/g, "\\|");
      const titleLink = `[${safeTitle}](${contentUrl})`;
      const kwCell = keywords.join(", ").replace(/\|/g, "\\|");
      mdLines.push(`| ${titleLink} | ${kwCell} |`);
    }

    mdLines.push("");
  }

  writeFileSync(mdPath, mdLines.join("\n") + "\n", "utf-8");

  const totalPages = sourceResults.reduce((s, r) => s + r.pages.length, 0);
  console.log(
    `Wrote ${totalPages} rows (${sourceResults.length} sources) → ${mdPath}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
