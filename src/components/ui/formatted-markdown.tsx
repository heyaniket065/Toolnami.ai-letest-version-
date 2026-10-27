import React, { type ReactNode, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Copy, Check } from "lucide-react";

interface FormattedMarkdownProps {
  content: string;
  className?: string;
  onLinkClick?: () => void;
}

/**
 * Fast, linear-time inline markdown parser without lookbehinds or catastrophic backtracking.
 * Supports:
 * - Markdown links: [Label](url)
 * - Bold: **text**
 * - Inline code: `code`
 * - Italic: *text* or _text_
 * - Strikethrough: ~~text~~
 */
function parseInlineFormatting(
  text: string,
  onLinkClick?: () => void,
  keyPrefix: string = "in",
  depth: number = 0,
): ReactNode[] {
  if (!text) return [];
  if (depth > 2 || text.length > 4000) {
    return [<span key={`${keyPrefix}-plain`}>{text}</span>];
  }

  // Linear-time regex without lookbehinds
  const tokenRegex =
    /(\[([^\][\n]+)\]\(([^)\s]+)\)|\*\*([^*\n]+)\*\*|`([^`\n]+)`|~~([^~\n]+)~~|\*([^*\n]+)\*)/g;

  const elements: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = tokenRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      elements.push(
        <span key={`${keyPrefix}-t-${idx++}`}>{text.substring(lastIndex, matchIndex)}</span>,
      );
    }

    const fullMatch = match[0];
    const linkText = match[2];
    const linkHref = match[3];
    const boldDouble = match[4];
    const codeText = match[5];
    const strikeText = match[6];
    const italicSingle = match[7];

    if (linkHref && linkText) {
      const isInternal = linkHref.startsWith("/") || linkHref.startsWith("#");
      if (isInternal) {
        elements.push(
          <Link
            key={`${keyPrefix}-lnk-${idx++}`}
            to={linkHref}
            onClick={onLinkClick}
            className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-2 decoration-primary/40 hover:text-primary hover:decoration-primary transition-colors cursor-pointer"
          >
            <span>{linkText.replace(/^\*\*|\*\*$/g, "")}</span>
          </Link>,
        );
      } else {
        elements.push(
          <a
            key={`${keyPrefix}-ext-${idx++}`}
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onLinkClick}
            className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-2 decoration-primary/40 hover:text-primary hover:decoration-primary transition-colors cursor-pointer"
          >
            <span>{linkText.replace(/^\*\*|\*\*$/g, "")}</span>
            <ExternalLink className="size-3 inline opacity-70" />
          </a>,
        );
      }
    } else if (boldDouble !== undefined) {
      elements.push(
        <strong
          key={`${keyPrefix}-b-${idx++}`}
          className="font-bold text-foreground tracking-tight"
        >
          {parseInlineFormatting(boldDouble, onLinkClick, `${keyPrefix}-sb-${idx}`, depth + 1)}
        </strong>,
      );
    } else if (codeText !== undefined) {
      elements.push(
        <code
          key={`${keyPrefix}-c-${idx++}`}
          className="px-1.5 py-0.5 rounded-md bg-muted font-mono text-[12px] sm:text-[13px] text-primary font-semibold border border-border/60 break-all"
        >
          {codeText}
        </code>,
      );
    } else if (strikeText !== undefined) {
      elements.push(
        <del key={`${keyPrefix}-d-${idx++}`} className="line-through text-muted-foreground">
          {strikeText}
        </del>,
      );
    } else if (italicSingle !== undefined) {
      elements.push(
        <em key={`${keyPrefix}-i-${idx++}`} className="italic text-foreground/90 font-medium">
          {italicSingle}
        </em>,
      );
    } else {
      elements.push(<span key={`${keyPrefix}-r-${idx++}`}>{fullMatch}</span>);
    }

    lastIndex = matchIndex + fullMatch.length;
  }

  if (lastIndex < text.length) {
    elements.push(<span key={`${keyPrefix}-end`}>{text.substring(lastIndex)}</span>);
  }

  return elements;
}

function CodeBlockView({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-border bg-slate-950 text-slate-100 shadow-sm">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
        <span className="uppercase font-bold text-primary">{lang || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-slate-300 hover:text-white font-sans font-semibold text-[11px]"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 text-xs sm:text-[13px] font-mono leading-relaxed overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function isHorizontalRule(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length < 3 || trimmed.length > 40) return false;
  return /^[-*_]+$/.test(trimmed.replace(/\s+/g, ""));
}

export const FormattedMarkdown = React.memo(function FormattedMarkdown({
  content,
  className = "",
  onLinkClick,
}: FormattedMarkdownProps) {
  const linkClickRef = useRef(onLinkClick);
  linkClickRef.current = onLinkClick;

  const renderedBlocks = useMemo(() => {
    if (!content) return null;

    const handleLink = () => {
      linkClickRef.current?.();
    };

    const normalized = content.replace(/\r\n/g, "\n");
    const rawLines = normalized.split("\n");

    const blocks: ReactNode[] = [];
    let currentList: { type: "ol" | "ul"; items: { num?: string; text: string }[] } | null = null;
    let inCodeBlock = false;
    let codeLang = "";
    let codeLines: string[] = [];

    const flushList = (blockIdx: number) => {
      if (!currentList) return;
      if (currentList.type === "ol") {
        blocks.push(
          <ol
            key={`list-${blockIdx}`}
            className="my-2.5 space-y-1.5 pl-5 list-decimal text-foreground/90 text-sm leading-relaxed"
          >
            {currentList.items.map((item, i) => (
              <li key={`li-${i}`} className="pl-1">
                {parseInlineFormatting(item.text, handleLink, `ol-${blockIdx}-${i}`)}
              </li>
            ))}
          </ol>,
        );
      } else {
        blocks.push(
          <ul
            key={`list-${blockIdx}`}
            className="my-2.5 space-y-1.5 pl-5 list-disc text-foreground/90 text-sm leading-relaxed"
          >
            {currentList.items.map((item, i) => (
              <li key={`li-${i}`} className="pl-1">
                {parseInlineFormatting(item.text, handleLink, `ul-${blockIdx}-${i}`)}
              </li>
            ))}
          </ul>,
        );
      }
      currentList = null;
    };

    let blockCounter = 0;

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];

      // Fenced code blocks: ```lang
      if (line.trimStart().startsWith("```")) {
        if (!inCodeBlock) {
          flushList(blockCounter++);
          inCodeBlock = true;
          codeLang = line.trimStart().slice(3).trim();
          codeLines = [];
        } else {
          inCodeBlock = false;
          blocks.push(
            <CodeBlockView
              key={`code-${blockCounter++}`}
              lang={codeLang}
              code={codeLines.join("\n")}
            />,
          );
          codeLang = "";
          codeLines = [];
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      const trimmedEnd = line.trimEnd();

      // Safe O(1) horizontal divider check
      if (isHorizontalRule(trimmedEnd)) {
        flushList(blockCounter++);
        blocks.push(<hr key={`hr-${blockCounter++}`} className="my-3 border-t border-border/70" />);
        continue;
      }

      // Headings: #, ##, ###
      const headingMatch = trimmedEnd.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        flushList(blockCounter++);
        const level = headingMatch[1].length;
        let rawTitle = headingMatch[2].trim();
        if (rawTitle.startsWith("**") && rawTitle.endsWith("**") && rawTitle.length > 4) {
          rawTitle = rawTitle.slice(2, -2).trim();
        }
        const titleNodes = parseInlineFormatting(rawTitle, handleLink, `h-${blockCounter}`);

        if (level === 1) {
          blocks.push(
            <h1
              key={`h1-${blockCounter++}`}
              className="mt-4 mb-2 text-lg sm:text-xl font-black tracking-tight text-foreground border-b border-border/60 pb-1.5"
            >
              {titleNodes}
            </h1>,
          );
        } else if (level === 2) {
          blocks.push(
            <h2
              key={`h2-${blockCounter++}`}
              className="mt-3.5 mb-1.5 text-base sm:text-lg font-extrabold tracking-tight text-foreground"
            >
              {titleNodes}
            </h2>,
          );
        } else {
          blocks.push(
            <h3
              key={`h3-${blockCounter++}`}
              className="mt-3 mb-1 text-sm sm:text-base font-bold tracking-tight text-foreground flex items-center gap-1.5"
            >
              <span className="inline-block w-1.5 h-3.5 bg-primary rounded-full shrink-0" />
              <span>{titleNodes}</span>
            </h3>,
          );
        }
        continue;
      }

      // Numbered list: 1. Item
      const olMatch = trimmedEnd.match(/^\s*(\d+)[.)]\s+(.*)$/);
      if (olMatch) {
        if (!currentList || currentList.type !== "ol") {
          flushList(blockCounter++);
          currentList = { type: "ol", items: [] };
        }
        currentList.items.push({ num: olMatch[1], text: olMatch[2] });
        continue;
      }

      // Bullet list: - Item or * Item
      const ulMatch = trimmedEnd.match(/^\s*[-*•]\s+(.*)$/);
      if (ulMatch) {
        if (!currentList || currentList.type !== "ul") {
          flushList(blockCounter++);
          currentList = { type: "ul", items: [] };
        }
        currentList.items.push({ text: ulMatch[1] });
        continue;
      }

      // Blockquote: > text
      const quoteMatch = trimmedEnd.match(/^>\s*(.*)$/);
      if (quoteMatch) {
        flushList(blockCounter++);
        blocks.push(
          <blockquote
            key={`quote-${blockCounter++}`}
            className="my-2 pl-3.5 py-1.5 border-l-4 border-primary/70 bg-muted/40 rounded-r-xl text-foreground/90 italic text-xs sm:text-sm"
          >
            {parseInlineFormatting(quoteMatch[1], handleLink, `quote-${blockCounter}`)}
          </blockquote>,
        );
        continue;
      }

      if (trimmedEnd.trim() === "") {
        flushList(blockCounter++);
        continue;
      }

      flushList(blockCounter++);
      blocks.push(
        <p
          key={`p-${blockCounter++}`}
          className="my-1.5 text-sm leading-relaxed text-foreground/90 break-words"
        >
          {parseInlineFormatting(trimmedEnd, handleLink, `p-${blockCounter}`)}
        </p>,
      );
    }

    if (inCodeBlock && codeLines.length > 0) {
      blocks.push(
        <CodeBlockView
          key={`code-end-${blockCounter++}`}
          lang={codeLang}
          code={codeLines.join("\n")}
        />,
      );
    }

    flushList(blockCounter++);
    return blocks;
  }, [content]);

  return (
    <div
      className={`formatted-content space-y-1 font-sans text-foreground select-text overflow-hidden ${className}`}
    >
      {renderedBlocks}
    </div>
  );
});
