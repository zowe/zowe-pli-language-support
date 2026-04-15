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
 * Transforms every scripts/builtins/html/<NAME>.html into a JSDoc markdown
 * file at scripts/builtins/md/<NAME>.jsdoc.md.
 *
 * Handled direct children of <div class="body">:
 *   <p class="shortdesc">          → JSDoc top description paragraph
 *   <div class="syntaxdiagram">    → ignored
 *   <dl class="parml">             → @param {TODO} name description (flat inline)
 *   <p> / <p class="">             → additional description paragraph
 *   <div class="p">                → ignored when only syntaxdiagram inside;
 *                                    otherwise rendered as description
 *   <ul> / <ol>                    → markdown list
 *   <div class="example">          → markdown code block (with optional title)
 *   <div class="note"> / "note note"> → description paragraph
 *   <section class="section">      → bold heading + content
 *   <pre class="codeblock|pre">    → markdown code block
 *   <div class="lines">            → markdown code block
 *   <div class="tablenoborder">    → markdown table
 *   <div class="abstract">         → description paragraph (like shortdesc)
 *   <div class="linklist relinfo"> → ignored (navigation links)
 *   <dl> (no parml)                → bold-term: description lines
 *
 * Any other body-level element stops the script with an error.
 *
 * Inline transformation (everywhere):
 *   <span class="ph synph"><span class="ph var">X</span></span>  →  `X`
 *   All remaining tags stripped; entities decoded; whitespace normalised.
 *
 * Usage:  npx tsx scripts/build-builtin-jsdocs.mts
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { resolve, dirname, basename, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const IN_DIR = resolve(__dirname, "builtins/html");
const OUT_DIR = resolve(__dirname, "builtins/md");

// ── HTML utilities ────────────────────────────────────────────────────────────

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) =>
      String.fromCharCode(parseInt(n, 16)),
    );
}

function stripAllTags(s: string): string {
  return s.replace(/<[^>]+>/g, "");
}

/**
 * Process inline HTML into plain text:
 * 1. <span class="ph synph"><span class="ph var">X</span></span>  →  `X`
 * 2. Strip all other HTML tags.
 * 3. Decode entities.
 * 4. Normalise whitespace to a single space.
 */
function processInline(html: string): string {
  let result = html.replace(
    /<span\b[^>]*class="(?=[^"]*\bph\b)(?=[^"]*\bsynph\b)[^"]*"[^>]*>\s*<span\b[^>]*class="(?=[^"]*\bph\b)(?=[^"]*\bvar\b)[^"]*"[^>]*>([\s\S]*?)<\/span>\s*<\/span>/g,
    (_, inner) => `\`${stripAllTags(inner).trim()}\``,
  );
  result = stripAllTags(result);
  result = decodeEntities(result);
  result = result.replace(/\s+/g, " ").trim();
  return result;
}

// ── Minimal HTML element parser ───────────────────────────────────────────────

interface HtmlElement {
  tag: string;
  classes: string[];
  innerHTML: string;
  outerHTML: string;
  /** Position of the opening '<' in the parent string */
  startIndex: number;
  /** Position just after the closing '>' */
  endIndex: number;
}

const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

/**
 * HTML block-level elements. Only these cause a "split" in renderMixed /
 * renderListItemContent / renderSection / renderExample. Inline elements
 * (span, em, a, code, var, sup …) stay in the text flow so processInline
 * can apply the synph→backtick transformation on them in context.
 */
const BLOCK_TAGS = new Set([
  "address", "article", "aside", "blockquote", "dd", "details", "dialog",
  "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form",
  "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "li",
  "main", "nav", "ol", "p", "pre", "section", "summary", "table",
  "tbody", "td", "tfoot", "th", "thead", "tr", "ul",
]);

function nextElement(html: string, from: number): HtmlElement | null {
  let pos = from;

  while (pos < html.length) {
    const lt = html.indexOf("<", pos);
    if (lt === -1) return null;

    if (html.startsWith("<!--", lt)) {
      const end = html.indexOf("-->", lt + 4);
      pos = end === -1 ? html.length : end + 3;
      continue;
    }

    const nextChar = html[lt + 1] ?? "";
    if (nextChar === "/" || nextChar === "!" || nextChar === "?") {
      pos = lt + 1;
      continue;
    }
    if (!/[a-zA-Z]/.test(nextChar)) {
      pos = lt + 1;
      continue;
    }

    const gt = html.indexOf(">", lt);
    if (gt === -1) return null;

    const openTag = html.slice(lt, gt + 1);
    const tagNameMatch = /^<([a-zA-Z][a-zA-Z0-9:-]*)/i.exec(openTag);
    if (!tagNameMatch) { pos = lt + 1; continue; }

    const tag = tagNameMatch[1].toLowerCase();
    const classMatch = /\bclass="([^"]*)"/i.exec(openTag);
    const classes = classMatch ? classMatch[1].split(/\s+/).filter(Boolean) : [];

    if (openTag.endsWith("/>") || VOID_TAGS.has(tag)) {
      return { tag, classes, innerHTML: "", outerHTML: openTag, startIndex: lt, endIndex: gt + 1 };
    }

    const openStr = `<${tag}`;
    const closeStr = `</${tag}>`;
    let depth = 1;
    let p = gt + 1;

    while (p < html.length && depth > 0) {
      const nextOpen = html.indexOf(openStr, p);
      const nextClose = html.indexOf(closeStr, p);
      if (nextClose === -1) break;
      if (nextOpen !== -1 && nextOpen < nextClose) {
        const afterChar = html[nextOpen + openStr.length];
        if (!afterChar || /[\s>\/]/.test(afterChar)) depth++;
        p = nextOpen + openStr.length;
      } else {
        depth--;
        p = nextClose + closeStr.length;
      }
    }

    if (depth !== 0) { pos = lt + 1; continue; }

    const innerHTML = html.slice(gt + 1, p - closeStr.length);
    const outerHTML = html.slice(lt, p);
    return { tag, classes, innerHTML, outerHTML, startIndex: lt, endIndex: p };
  }

  return null;
}

function getDirectChildren(html: string): HtmlElement[] {
  const children: HtmlElement[] = [];
  let pos = 0;
  while (pos < html.length) {
    const el = nextElement(html, pos);
    if (!el) break;
    children.push(el);
    pos = el.endIndex;
  }
  return children;
}

// ── Body extraction ───────────────────────────────────────────────────────────

function extractBodyContent(articleHtml: string): string {
  const root = nextElement(articleHtml, 0);
  if (!root || root.tag !== "article") throw new Error("No <article> root element found.");

  let pos = 0;
  while (pos < root.innerHTML.length) {
    const child = nextElement(root.innerHTML, pos);
    if (!child) break;
    if (child.tag === "div" && child.classes.includes("body")) return child.innerHTML;
    pos = child.endIndex;
  }

  throw new Error("No <div class='body'> found inside <article>.");
}

// ── Block renderers ───────────────────────────────────────────────────────────

/** Render a <pre> element as a fenced markdown code block. */
function renderPre(innerHTML: string): string {
  const code = decodeEntities(stripAllTags(innerHTML))
    .replace(/^\n+/, "")
    .replace(/\n+$/, "");
  return `\`\`\`\n${code}\n\`\`\``;
}

/** Render a <div class="lines"> as a fenced markdown code block. */
function renderLines(innerHTML: string): string {
  const text = decodeEntities(stripAllTags(innerHTML)).trim();
  return `\`\`\`\n${text}\n\`\`\``;
}

/** Render a single <li> innerHTML, including nested lists, as a string. */
function renderListItemContent(innerHTML: string): string {
  const parts: string[] = [];
  let pos = 0;
  let lastEnd = 0;

  while (pos < innerHTML.length) {
    const el = nextElement(innerHTML, pos);
    if (!el) {
      const text = processInline(innerHTML.slice(lastEnd));
      if (text) parts.push(text);
      break;
    }

    // Inline elements stay in text flow so processInline can handle synph/var
    if (!BLOCK_TAGS.has(el.tag)) {
      pos = el.endIndex;
      continue;
    }

    const textBefore = processInline(innerHTML.slice(lastEnd, el.startIndex));
    if (textBefore) parts.push(textBefore);
    lastEnd = el.endIndex;
    pos = el.endIndex;

    if (el.tag === "ul" || el.tag === "ol") {
      parts.push("\n" + renderList(el, 1));
    } else if (el.tag === "div" && el.classes.includes("image")) {
      // skip images
    } else {
      const md = elementToMarkdown(el);
      if (md) parts.push(md);
    }
  }

  return parts.join(" ").trim();
}

/** Render a <ul> or <ol> element as a markdown list (supports nesting). */
function renderList(el: HtmlElement, depth: number = 0): string {
  const ordered = el.tag === "ol";
  const indent = "  ".repeat(depth);
  const lines: string[] = [];
  let itemNum = 0;

  let pos = 0;
  while (pos < el.innerHTML.length) {
    const child = nextElement(el.innerHTML, pos);
    if (!child) break;
    pos = child.endIndex;
    if (child.tag !== "li") continue;

    const content = renderListItemContent(child.innerHTML);
    const prefix = ordered ? `${++itemNum}.` : "-";
    const contentLines = content.split("\n");
    lines.push(`${indent}${prefix} ${contentLines[0]}`);
    for (const extra of contentLines.slice(1)) lines.push(extra);
  }

  return lines.join("\n");
}

/** Escape pipe characters in a markdown table cell. */
function tableCell(html: string): string {
  return processInline(html).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

/**
 * Render a <table> or <div class="tablenoborder"> as a markdown table.
 * Returns empty string if the table has no usable content.
 */
function renderTable(el: HtmlElement): string {
  // Unwrap tablenoborder → find the inner <table>
  let tableEl = el;
  if (el.tag !== "table") {
    let pos = 0;
    while (pos < el.innerHTML.length) {
      const child = nextElement(el.innerHTML, pos);
      if (!child) break;
      if (child.tag === "table") { tableEl = child; break; }
      pos = child.endIndex;
    }
    if (tableEl === el) return ""; // no <table> found
  }

  const headers: string[] = [];
  const rows: string[][] = [];

  for (const section of getDirectChildren(tableEl.innerHTML)) {
    if (section.tag === "colgroup" || section.tag === "caption") continue;

    const isHead = section.tag === "thead";
    const rowEls = section.tag === "tr"
      ? [section]
      : getDirectChildren(section.innerHTML).filter(c => c.tag === "tr");

    for (const tr of rowEls) {
      const cells = getDirectChildren(tr.innerHTML).filter(c => c.tag === "td" || c.tag === "th");
      const row = cells.map(c => tableCell(c.innerHTML));
      if (row.length === 0) continue;
      if (isHead || cells.some(c => c.tag === "th")) {
        if (headers.length === 0) headers.push(...row);
        else rows.push(row);
      } else {
        rows.push(row);
      }
    }
  }

  if (headers.length === 0 && rows.length === 0) return "";

  const hdrs = headers.length > 0 ? headers : (rows.shift() ?? []);
  const sep = hdrs.map(() => "---");
  return [
    `| ${hdrs.join(" | ")} |`,
    `| ${sep.join(" | ")} |`,
    ...rows.map(r => `| ${r.join(" | ")} |`),
  ].join("\n");
}

/**
 * Render a <div class="example"> as markdown.
 * Extracts the optional <h2> title and any <pre> code blocks.
 */
function renderExample(innerHTML: string): string {
  const parts: string[] = [];
  let pos = 0;
  let lastEnd = 0;

  while (pos < innerHTML.length) {
    const el = nextElement(innerHTML, pos);
    if (!el) {
      const text = processInline(innerHTML.slice(lastEnd));
      if (text) parts.push(text);
      break;
    }

    // Inline elements stay in text flow
    if (!BLOCK_TAGS.has(el.tag)) {
      pos = el.endIndex;
      continue;
    }

    const textBefore = processInline(innerHTML.slice(lastEnd, el.startIndex));
    if (textBefore) parts.push(textBefore);
    lastEnd = el.endIndex;
    pos = el.endIndex;

    if (el.tag === "h2") {
      const title = processInline(el.innerHTML);
      if (title) parts.push(`**${title}**`);
    } else if (el.tag === "pre") {
      parts.push(renderPre(el.innerHTML));
    } else if (el.tag === "div" && el.classes.includes("lines")) {
      parts.push(renderLines(el.innerHTML));
    } else if (el.tag === "div" && el.classes.includes("image")) {
      // skip
    } else {
      const md = elementToMarkdown(el);
      if (md) parts.push(md);
    }
  }
  return parts.join("\n\n");
}

/**
 * Render a <section class="section"> as markdown.
 * The <h2 class="sectiontitle"> becomes a bold heading; the rest is rendered
 * via renderMixed.
 */
function renderSection(innerHTML: string): string {
  const parts: string[] = [];
  let pos = 0;
  let lastEnd = 0;

  while (pos < innerHTML.length) {
    const el = nextElement(innerHTML, pos);
    if (!el) {
      const text = processInline(innerHTML.slice(lastEnd));
      if (text) parts.push(text);
      break;
    }

    // Inline elements stay in text flow
    if (!BLOCK_TAGS.has(el.tag)) {
      pos = el.endIndex;
      continue;
    }

    const textBefore = processInline(innerHTML.slice(lastEnd, el.startIndex));
    if (textBefore) parts.push(textBefore);
    lastEnd = el.endIndex;
    pos = el.endIndex;

    if (el.tag === "h2") {
      const title = processInline(el.innerHTML);
      if (title) parts.push(`**${title}**`);
    } else {
      const md = elementToMarkdown(el);
      if (md) parts.push(md);
    }
  }
  return parts.filter(Boolean).join("\n\n");
}

/**
 * Render a plain <dl> (no parml class) as a list of `**term**: description` lines.
 */
function renderDl(innerHTML: string): string {
  const lines: string[] = [];
  let pendingDt: string | null = null;
  let pos = 0;

  while (pos < innerHTML.length) {
    const el = nextElement(innerHTML, pos);
    if (!el) break;
    pos = el.endIndex;
    if (el.tag === "dt") {
      pendingDt = processInline(el.innerHTML);
    } else if (el.tag === "dd" && pendingDt !== null) {
      lines.push(`**${pendingDt}**: ${processInline(el.innerHTML)}`);
      pendingDt = null;
    }
  }
  return lines.join("\n");
}

/**
 * Convert a single HtmlElement to its markdown representation.
 * Returns null for elements that should be silently skipped.
 * Used both at the body level and recursively inside renderMixed.
 */
function elementToMarkdown(el: HtmlElement): string | null {
  // ── skip ──────────────────────────────────────────────────────────────────
  if (el.tag === "div" && el.classes.includes("syntaxdiagram")) return null;
  if (el.tag === "div" && el.classes.includes("image")) return null;
  if (el.tag === "div" && el.classes.includes("linklist")) return null;
  if (el.tag === "br") return null;
  if (el.tag === "img") return null;

  // ── <div class="p"> ───────────────────────────────────────────────────────
  if (el.tag === "div" && el.classes.includes("p")) {
    return renderMixed(el.innerHTML);
  }

  // ── lists ─────────────────────────────────────────────────────────────────
  if (el.tag === "ul" || el.tag === "ol") return renderList(el);

  // ── code blocks ───────────────────────────────────────────────────────────
  if (el.tag === "pre") return renderPre(el.innerHTML);
  if (el.tag === "div" && el.classes.includes("lines")) return renderLines(el.innerHTML);

  // ── tables ────────────────────────────────────────────────────────────────
  if (el.tag === "div" && el.classes.includes("tablenoborder")) return renderTable(el);
  if (el.tag === "table") return renderTable(el);

  // ── examples ─────────────────────────────────────────────────────────────
  if (el.tag === "div" && el.classes.includes("example")) return renderExample(el.innerHTML);

  // ── sections ─────────────────────────────────────────────────────────────
  if (el.tag === "section" && el.classes.includes("section")) return renderSection(el.innerHTML);

  // ── notes (flat inline) ───────────────────────────────────────────────────
  if (el.tag === "div" && el.classes.some(c => c === "note")) {
    return processInline(el.innerHTML);
  }

  // ── definition list (no parml) ────────────────────────────────────────────
  if (el.tag === "dl" && !el.classes.includes("parml")) return renderDl(el.innerHTML);

  // ── abstract (like shortdesc) ─────────────────────────────────────────────
  if (el.tag === "div" && el.classes.includes("abstract")) return processInline(el.innerHTML);

  // ── plain paragraph ───────────────────────────────────────────────────────
  if (el.tag === "p") return renderMixed(el.innerHTML);

  // ── fallback: inline extraction ───────────────────────────────────────────
  const text = processInline(el.innerHTML);
  return text || null;
}

/**
 * Render mixed HTML content (text nodes interleaved with block elements)
 * to markdown. Syntaxdiagram divs and image divs inside are silently removed.
 * Returns null when the result is empty (e.g. div.p that only wrapped a syntax diagram).
 */
function renderMixed(html: string): string | null {
  const parts: string[] = [];
  let pos = 0;
  let lastEnd = 0;

  while (pos < html.length) {
    const el = nextElement(html, pos);
    if (!el) {
      const text = processInline(html.slice(lastEnd));
      if (text) parts.push(text);
      break;
    }

    // Inline elements stay in text flow so processInline handles synph/var in context
    if (!BLOCK_TAGS.has(el.tag)) {
      pos = el.endIndex;
      continue;
    }

    // Text node before this block element
    const textBefore = processInline(html.slice(lastEnd, el.startIndex));
    if (textBefore) parts.push(textBefore);

    lastEnd = el.endIndex;
    pos = el.endIndex;

    const md = elementToMarkdown(el);
    if (md !== null) parts.push(md);
  }

  const joined = parts.filter(Boolean).join("\n\n");
  return joined || null;
}

// ── Known-element guard (body level) ─────────────────────────────────────────

/** Classes on <div> that are explicitly handled at the body level. */
const HANDLED_DIV_CLASSES = new Set([
  "p", "example", "note", "lines", "tablenoborder",
  "abstract", "linklist", "syntaxdiagram", "image",
]);

/** Tags (non-div) that are explicitly handled at the body level. */
const HANDLED_TAGS = new Set(["ul", "ol", "pre", "table", "dl", "section", "br", "img"]);

function isKnownBodyElement(el: HtmlElement): boolean {
  if (el.tag === "div") return el.classes.some(c => HANDLED_DIV_CLASSES.has(c));
  return HANDLED_TAGS.has(el.tag);
}

// ── Parameter extraction ──────────────────────────────────────────────────────

interface Param {
  name: string;
  description: string;
}

function extractParams(dlInnerHtml: string): Param[] {
  const params: Param[] = [];
  let pendingName: string | null = null;
  let pos = 0;

  while (pos < dlInnerHtml.length) {
    const el = nextElement(dlInnerHtml, pos);
    if (!el) break;
    pos = el.endIndex;
    if (el.tag === "dt") {
      pendingName = processInline(el.innerHTML);
    } else if (el.tag === "dd" && pendingName !== null) {
      const description = renderMixed(el.innerHTML) ?? processInline(el.innerHTML);
      params.push({ name: pendingName, description });
      pendingName = null;
    }
  }

  return params;
}

// ── JSDoc line wrapper ────────────────────────────────────────────────────────

/**
 * Prepend a leading space to `line` and, if the result exceeds `maxLen`,
 * split it into multiple lines each starting with the appropriate JSDoc
 * prefix. Breaks only at whitespace or after a period.
 */
function wrapJsDocLine(line: string, maxLen: number): string[] {
  const full = " " + line;
  if (full.length <= maxLen) return [full];

  // Extract the prefix (whitespace + "*" + whitespace) for first and continuation lines.
  const prefixMatch = /^(\s+\*\s*)/.exec(full);
  if (!prefixMatch) return [full]; // e.g. " /**" — unlikely to need wrapping

  const firstPrefix = prefixMatch[1];
  // @param continuation gets 2 extra spaces so wrapped text is clearly indented.
  const contPrefix = /\* @param/.test(full)
    ? firstPrefix.replace(/\s+$/, "") + "   "
    : firstPrefix;

  let content = full.slice(firstPrefix.length);
  const result: string[] = [];
  let isFirst = true;

  while (content.length > 0) {
    const prefix = isFirst ? firstPrefix : contPrefix;
    isFirst = false;
    const available = maxLen - prefix.length;

    if (available <= 0 || content.length <= available) {
      result.push(prefix + content);
      break;
    }

    // Find the last break opportunity within `available` chars:
    // prefer a space (word boundary), then a position right after a period.
    let bp = -1;
    for (let i = available; i >= 1; i--) {
      if (content[i] === " ") { bp = i; break; }
    }
    if (bp < 0) {
      for (let i = available; i >= 1; i--) {
        if (content[i - 1] === ".") { bp = i; break; }
      }
    }
    if (bp <= 0) bp = available; // no good break point — force it

    result.push(prefix + content.slice(0, bp).trimEnd());
    content = content.slice(bp).trimStart();
  }

  return result.length > 0 ? result : [full];
}

// ── File transformation ───────────────────────────────────────────────────────

function transformFile(htmlPath: string): string {
  const html = readFileSync(htmlPath, "utf-8");
  const filename = basename(htmlPath);

  const bodyContent = extractBodyContent(html);
  const children = getDirectChildren(bodyContent);

  const descriptions: string[] = [];
  const params: Param[] = [];

  for (const child of children) {
    // <p class="shortdesc">
    if (child.tag === "p" && child.classes.includes("shortdesc")) {
      const text = processInline(child.innerHTML);
      if (text) descriptions.push(text);
      continue;
    }

    // <div class="syntaxdiagram"> – always skip
    if (child.tag === "div" && child.classes.includes("syntaxdiagram")) continue;

    // <dl class="parml"> – parameter list
    if (child.tag === "dl" && child.classes.includes("parml")) {
      params.push(...extractParams(child.innerHTML));
      continue;
    }

    // <p> or <p class=""> – additional description
    if (child.tag === "p" && child.classes.length === 0) {
      const text = processInline(child.innerHTML);
      if (text) descriptions.push(text);
      continue;
    }

    // All other elements: known → render (null = skip silently); unknown → error
    if (isKnownBodyElement(child)) {
      const md = elementToMarkdown(child);
      if (md) descriptions.push(md);
      continue;
    }

    throw new Error(
      `Unhandled element in ${filename}: ` +
        `<${child.tag}${child.classes.length ? ` class="${child.classes.join(" ")}"` : ""}>\n` +
        child.outerHTML.slice(0, 500) +
        (child.outerHTML.length > 500 ? "\n…" : ""),
    );
  }

  // ── Assemble JSDoc block ──────────────────────────────────────────────────
  const lines: string[] = ["/**"];

  for (let i = 0; i < descriptions.length; i++) {
    if (i > 0) lines.push(" *");
    for (const line of descriptions[i].split("\n")) {
      lines.push(` * ${line}`);
    }
  }

  if (params.length > 0) {
    if (descriptions.length > 0) lines.push(" *");
    for (const { name, description } of params) {
      const descLines = description.split("\n");
      lines.push(` * @param {TODO} ${name} ${descLines[0]}`);
      for (const extra of descLines.slice(1)) {
        lines.push(extra.trim() === "" ? " *" : ` *   ${extra}`);
      }
    }
  }

  lines.push(" */");

  // ── Escape backticks first so wrap widths are accurate, then wrap ────────
  // Un-escaping temporarily is used to detect ``` code-fence markers.
  const escapedLines = lines.map(l => l.replace(/`/g, "\\`"));
  const wrapped: string[] = [];
  let inCode = false;

  for (const line of escapedLines) {
    const isFence =
      line.replace(/\\`/g, "`").trimEnd().endsWith("```") &&
      /\*\s/.test(line);
    if (isFence) inCode = !inCode;

    if (isFence || inCode) {
      wrapped.push(" " + line);
    } else {
      wrapped.push(...wrapJsDocLine(line, 68));
    }
  }

  return wrapped.join("\n") + "\n";
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main(): void {
  mkdirSync(OUT_DIR, { recursive: true });

  const files = readdirSync(IN_DIR)
    .filter((f) => f.endsWith(".html"))
    .sort();

  console.log(`Transforming ${files.length} HTML files → ${OUT_DIR}\n`);

  let ok = 0;

  for (const file of files) {
    const inPath = resolve(IN_DIR, file);
    const outName = basename(file, extname(file)) + ".jsdoc.md";
    const outPath = resolve(OUT_DIR, outName);

    const md = transformFile(inPath);
    writeFileSync(outPath, md, "utf-8");
    console.log(`  ✓ ${file}`);
    ok++;
  }

  console.log(`\n${"─".repeat(72)}\nDone. ${ok}/${files.length} transformed → ${OUT_DIR}`);
}

try {
  main();
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`\n${"─".repeat(72)}\nScript stopped:\n${msg}`);
  process.exit(1);
}
