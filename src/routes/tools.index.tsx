import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowUpDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  LayoutGrid,
  List,
  Search,
  SearchX,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

import { CategoryIcon, ToolCard, ToolCardSkeleton } from "@/components/site/tool-card";
import { Reveal } from "@/components/site/reveal";
import { LiveToolCard } from "@/components/tools/live-tool-card";
import { matchLiveTools } from "@/lib/phase1-tools";
import {
  CATEGORY_TOOL_COUNTS,
  TOOLS_PER_PAGE,
  categoriesQuery,
  toolsPageQuery,
  type ToolCategory,
  type ToolSortOption,
} from "@/lib/tools-data";
import { useRecentAndSavedTools } from "@/hooks/use-recent-tools";

type ToolsSearch = { q?: string | undefined; category?: string | undefined; page: number };

export const Route = createFileRoute("/tools/")({
  validateSearch: (search: Record<string, unknown>): ToolsSearch => ({
    q: typeof search["q"] === "string" && search["q"] ? search["q"] : undefined,
    category:
      typeof search["category"] === "string" && search["category"] ? search["category"] : undefined,
    page: Math.max(1, Number(search["page"]) || 1),
  }),
  head: () => ({
    meta: [
      { title: "All 96 Online Tools Directory — ToolNami" },
      {
        name: "description",
        content:
          "Browse the full ToolNami directory of 96+ free online tools: PDF, image, text, SEO, calculators, AI, and developer utilities.",
      },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { property: "og:site_name", content: "ToolNami" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://toolnami.com/tools" },
      { property: "og:title", content: "All 96 Online Tools Directory — ToolNami" },
      {
        property: "og:description",
        content: "Search and filter 96+ free online tools in one clean directory.",
      },
      { property: "og:image", content: "/assets/tools/3d-pdf-compressor.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Instgram136" },
      { name: "twitter:creator", content: "@Instgram136" },
      { name: "twitter:title", content: "All 96 Online Tools Directory — ToolNami" },
      {
        name: "twitter:description",
        content: "Search and filter 96+ free online tools in one clean directory.",
      },
      { name: "twitter:image", content: "/assets/tools/3d-pdf-compressor.png" },
    ],
    links: [{ rel: "canonical", href: "https://toolnami.com/tools" }],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  const { q, category, page } = Route.useSearch();
  const navigate = useNavigate({ from: "/tools" });
  const [term, setTerm] = useState(q ?? "");
  const [sortBy, setSortBy] = useState<ToolSortOption>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [onlySaved, setOnlySaved] = useState(false);

  const { savedSlugs, isToolSaved, toggleToolSaved } = useRecentAndSavedTools();

  useEffect(() => {
    setTerm(q ?? "");
  }, [q]);

  const { data: categories = [] } = useQuery(categoriesQuery);
  const activeCategory = categories.find((c: ToolCategory) => c.slug === category);

  const { data, isPending, isError } = useQuery(
    toolsPageQuery({
      search: q ?? "",
      categoryId: activeCategory?.id ?? null,
      page,
      sort: sortBy,
      onlySlugs: onlySaved ? savedSlugs : null,
    }),
  );

  const liveTools = matchLiveTools(q ?? "");
  const showLive = !category && !onlySaved && page === 1 && liveTools.length > 0;

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / TOOLS_PER_PAGE));

  const setSearch = (next: Partial<ToolsSearch>) => {
    navigate({
      search: (prev) => ({ ...prev, page: 1, ...next }),
      resetScroll: false,
    });
  };

  return (
    <div className="page-enter">
      <section className="surface-hero border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary">
              <LayoutGrid className="size-3.5" /> Complete Tool Directory (
              {CATEGORY_TOOL_COUNTS.all} Tools)
            </span>
            <h1 className="mt-5 text-3xl font-bold sm:text-5xl">
              Every ToolNami tool in one place
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Search by keyword, filter by category, sort by popularity, or switch between 3D Grid
              and Compact List views.
            </p>
          </Reveal>

          <Reveal delay={90}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSearch({ q: term.trim() || undefined });
              }}
              role="search"
              aria-label="Directory tool search"
              className="mt-8 flex max-w-2xl items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-soft focus-within:border-primary/40 focus-within:shadow-lift"
            >
              <label htmlFor="directory-search-input" className="sr-only">
                Search tools by name or description
              </label>
              <Search className="ml-2 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                id="directory-search-input"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search 96+ tools by name, format, or keyword…"
                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:text-base"
              />
              {term ? (
                <button
                  type="button"
                  onClick={() => {
                    setTerm("");
                    setSearch({ q: undefined });
                  }}
                  aria-label="Clear search"
                  className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
                >
                  <X className="size-4" />
                </button>
              ) : null}
              <button
                type="submit"
                aria-label="Submit search"
                className="inline-flex h-11 shrink-0 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-95"
              >
                Search
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {showLive ? (
        <section className="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground">
                  <Zap className="size-3" /> Flagship Studio
                </span>
                <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Featured Live Tools</h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
                  High-demand utilities that run 100% locally in your browser.
                </p>
              </div>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {liveTools.map((tool, i) => (
              <Reveal key={tool.slug} delay={Math.min(i * 60, 240)} className="h-full">
                <LiveToolCard tool={tool} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Category & Saved Filter Bar */}
        <div role="group" aria-label="Filter tools by category" className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setOnlySaved(false);
              setSearch({ category: undefined });
            }}
            aria-pressed={!category && !onlySaved}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
              !category && !onlySaved
                ? "border-primary bg-primary text-primary-foreground shadow-soft"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
            }`}
          >
            <span>All tools</span>
            <span className="text-xs opacity-75">({CATEGORY_TOOL_COUNTS.all})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOnlySaved((prev) => !prev);
              setSearch({ page: 1 });
            }}
            aria-pressed={onlySaved}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
              onlySaved
                ? "border-rose-500 bg-rose-500 text-white shadow-soft"
                : "border-border bg-card text-muted-foreground hover:border-rose-500/40 hover:text-rose-500"
            }`}
          >
            <Heart className={`size-3.5 ${onlySaved ? "fill-white" : ""}`} />
            <span>Saved</span>
            <span className="text-xs opacity-80">({savedSlugs.length})</span>
          </button>

          {categories.map((c: ToolCategory) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setOnlySaved(false);
                setSearch({ category: c.slug });
              }}
              aria-pressed={category === c.slug && !onlySaved}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                category === c.slug && !onlySaved
                  ? "border-primary bg-primary text-primary-foreground shadow-soft"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
              }`}
            >
              <CategoryIcon name={c.icon} className="size-4" />
              <span>{c.name}</span>
              <span className="text-xs opacity-75">({CATEGORY_TOOL_COUNTS[c.id] || 0})</span>
            </button>
          ))}
        </div>

        {/* Status Bar + Sort & View Mode Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {isPending
              ? "Loading tools…"
              : `Showing ${total} tool${total === 1 ? "" : "s"}${q ? ` for “${q}”` : ""}${
                  activeCategory ? ` in ${activeCategory.name}` : ""
                }${onlySaved ? " in Saved Bookmarks" : ""}`}
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Sort Select */}
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <ArrowUpDown className="size-3.5 text-primary" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as ToolSortOption)}
                aria-label="Sort tools"
                className="bg-transparent font-semibold text-foreground outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="popular">Most Popular</option>
                <option value="az">Alphabetical (A–Z)</option>
              </select>
            </div>

            {/* Grid vs Compact List Toggle */}
            <div
              role="group"
              aria-label="Toggle directory view mode"
              className="inline-flex items-center rounded-xl border border-border bg-card p-1"
            >
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="size-3.5" /> Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="size-3.5" /> List
              </button>
            </div>
          </div>
        </div>

        {isError ? (
          <div className="mt-10 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
            <h2 className="text-lg font-semibold">We couldn't load the tools</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Please check your connection and refresh the page.
            </p>
          </div>
        ) : isPending ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ToolCardSkeleton key={i} />
            ))}
          </div>
        ) : total === 0 ? (
          <div className="mt-10 rounded-2xl border border-border bg-card p-12 text-center shadow-soft">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <SearchX className="size-6" />
            </span>
            <h2 className="mt-5 text-lg font-semibold">
              {onlySaved ? "No saved bookmarks yet" : "No tools matched your search"}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              {onlySaved
                ? "Click the heart icon on any tool card to bookmark your favorite utilities for instant access."
                : "Try a different keyword or clear the filters to browse the full directory."}
            </p>
            <button
              type="button"
              onClick={() => {
                setTerm("");
                setOnlySaved(false);
                navigate({ search: { page: 1 } });
              }}
              className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-95"
            >
              Reset filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.tools.map((tool, i) => (
              <Reveal key={tool.id} delay={Math.min(i * 60, 240)} className="h-full">
                <ToolCard
                  tool={tool}
                  category={categories.find((c: ToolCategory) => c.id === tool.category_id)}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {data.tools.map((tool) => {
              const cat = categories.find((c: ToolCategory) => c.id === tool.category_id);
              const saved = isToolSaved(tool.slug);
              return (
                <div
                  key={`list-${tool.id}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-3.5 shadow-soft transition-all hover:border-primary/40 hover:shadow-lift"
                >
                  <Link
                    to={`/tools/${tool.slug}`}
                    className="flex items-center gap-4 min-w-0 flex-1"
                  >
                    <img
                      src={tool.thumbnail_url || `/assets/tools/${tool.slug}.png`}
                      alt={tool.title}
                      className="h-16 w-24 shrink-0 rounded-xl object-cover border border-border/60"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {tool.title}
                        </h3>
                        {cat && (
                          <span className="text-xs font-medium text-muted-foreground">
                            · {cat.name}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                        {tool.description}
                      </p>
                    </div>
                  </Link>

                  <div className="flex items-center justify-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => void toggleToolSaved(tool.slug, tool.title)}
                      aria-label={saved ? "Remove from saved" : "Save tool"}
                      className={`inline-flex size-9 items-center justify-center rounded-xl border transition-colors cursor-pointer ${
                        saved
                          ? "border-rose-500/40 bg-rose-500/15 text-rose-500"
                          : "border-border bg-background text-muted-foreground hover:text-rose-500"
                      }`}
                    >
                      <Heart className={`size-4 ${saved ? "fill-rose-500" : ""}`} />
                    </button>
                    <Link
                      to={`/tools/${tool.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-all hover:brightness-110"
                    >
                      Open Tool <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && !isPending ? <Pagination page={page} totalPages={totalPages} /> : null}
      </section>
    </div>
  );
}

function pageNumbers(page: number, totalPages: number): (number | "gap")[] {
  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  const list = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  list.forEach((p, i) => {
    if (i > 0 && p - (list[i - 1] as number) > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const base =
    "inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-xl border px-3 text-sm font-medium transition-all";

  return (
    <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <Link
        to="/tools"
        search={(prev) => ({ ...prev, page: Math.max(1, page - 1) })}
        resetScroll={false}
        disabled={page === 1}
        aria-disabled={page === 1}
        className={`${base} border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary aria-disabled:pointer-events-none aria-disabled:opacity-40`}
      >
        <ChevronLeft className="size-4" /> Previous
      </Link>

      {pageNumbers(page, totalPages).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={p}
            to="/tools"
            search={(prev) => ({ ...prev, page: p })}
            resetScroll={false}
            aria-current={p === page ? "page" : undefined}
            className={`${base} ${
              p === page
                ? "border-primary bg-primary text-primary-foreground shadow-soft"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
            }`}
          >
            {p}
          </Link>
        ),
      )}

      <Link
        to="/tools"
        search={(prev) => ({ ...prev, page: Math.min(totalPages, page + 1) })}
        resetScroll={false}
        disabled={page === totalPages}
        aria-disabled={page === totalPages}
        className={`${base} border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary aria-disabled:pointer-events-none aria-disabled:opacity-40`}
      >
        Next <ChevronRight className="size-4" />
      </Link>
    </nav>
  );
}
