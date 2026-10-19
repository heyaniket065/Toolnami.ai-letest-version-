import { useNavigate } from "@tanstack/react-router";
import {
  Search,
  ArrowRight,
  Clock,
  Heart,
  Sparkles,
  Shuffle,
  CornerDownLeft,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  COMPLETE_TOOLS,
  getToolBySlug,
  searchTools,
  type CompleteTool,
  type ToolCategory,
} from "@/lib/complete-tools";
import { useRecentAndSavedTools } from "@/hooks/use-recent-tools";

const QUICK_CATEGORIES: { id: ToolCategory | "all"; label: string }[] = [
  { id: "all", label: "All (96)" },
  { id: "pdf", label: "PDF" },
  { id: "image", label: "Image" },
  { id: "developer", label: "Developer" },
  { id: "calculator", label: "Calculators" },
  { id: "text", label: "Text" },
  { id: "seo", label: "SEO" },
  { id: "ai", label: "AI" },
  { id: "utility", label: "Utility" },
];

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [catFilter, setCatFilter] = useState<ToolCategory | "all">("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { recentSlugs, savedSlugs } = useRecentAndSavedTools();

  // Global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const results = useMemo(() => {
    if (!value.trim() && catFilter === "all") {
      return COMPLETE_TOOLS.slice(0, 8);
    }
    return searchTools(value, catFilter).slice(0, 12);
  }, [value, catFilter]);

  const recentTools = useMemo(() => {
    return recentSlugs
      .map((s) => getToolBySlug(s))
      .filter((t): t is CompleteTool => Boolean(t))
      .slice(0, 4);
  }, [recentSlugs]);

  const savedTools = useMemo(() => {
    return savedSlugs
      .map((s) => getToolBySlug(s))
      .filter((t): t is CompleteTool => Boolean(t))
      .slice(0, 4);
  }, [savedSlugs]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [value, catFilter]);

  const launchTool = (slug: string) => {
    setOpen(false);
    setValue("");
    navigate({ to: `/tools/${slug}` });
  };

  const launchRandomTool = () => {
    const random = COMPLETE_TOOLS[Math.floor(Math.random() * COMPLETE_TOOLS.length)];
    if (random) launchTool(random.slug);
  };

  const goDirectorySearch = (q: string) => {
    setOpen(false);
    setValue("");
    navigate({ to: "/tools", search: { q: q || undefined, page: 1 } });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search tools (Cmd+K)"
        className="inline-flex h-10 items-center gap-2.5 rounded-full border border-border bg-card px-3.5 text-sm text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95"
      >
        <Search className="size-4 text-primary" />
        <span className="hidden sm:inline text-xs font-medium">Quick search...</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 rounded-md border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden rounded-2xl p-0 sm:max-w-2xl border-border shadow-lift">
          <DialogHeader className="sr-only">
            <DialogTitle>Search ToolNami Command Palette</DialogTitle>
          </DialogHeader>

          {/* Search Input Header */}
          <div className="border-b border-border bg-card p-3.5 sm:p-4">
            <div className="flex items-center gap-3 rounded-xl border border-input bg-background px-3.5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring/30">
              <Search className="size-4 shrink-0 text-primary" />
              <input
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelectedIndex((i) => Math.min(i + 1, Math.max(0, results.length - 1)));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelectedIndex((i) => Math.max(0, i - 1));
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    const picked = results[selectedIndex];
                    if (picked) {
                      launchTool(picked.slug);
                    } else if (value.trim()) {
                      goDirectorySearch(value.trim());
                    }
                  }
                }}
                placeholder="Type any tool name or task (e.g. pdf unlock, pomodoro, jwt, salary)..."
                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {value && (
                <button
                  type="button"
                  onClick={() => setValue("")}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Clear search query"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Bar */}
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {QUICK_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCatFilter(c.id)}
                  className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    catFilter === c.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Body */}
          <div className="max-h-[60vh] overflow-y-auto p-3 sm:p-4 space-y-5">
            {/* Show Saved & Recent when query is empty */}
            {!value.trim() && catFilter === "all" && savedTools.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-1.5 px-1 text-[11px] font-bold uppercase tracking-wider text-rose-500">
                  <Heart className="size-3 fill-rose-500" /> Saved Bookmarks
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {savedTools.map((t) => (
                    <button
                      key={`saved-${t.slug}`}
                      type="button"
                      onClick={() => launchTool(t.slug)}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-2 text-left transition-all hover:border-primary/40 hover:bg-primary-soft/40"
                    >
                      <img
                        src={t.image}
                        alt={t.title}
                        className="h-10 w-14 shrink-0 rounded-lg object-cover border border-border/50"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-bold text-foreground">{t.title}</div>
                        <div className="truncate text-[11px] text-muted-foreground">
                          {t.categoryLabel}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!value.trim() && catFilter === "all" && recentTools.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-1.5 px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <Clock className="size-3 text-primary" /> Recently Used
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recentTools.map((t) => (
                    <button
                      key={`recent-${t.slug}`}
                      type="button"
                      onClick={() => launchTool(t.slug)}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-2 text-left transition-all hover:border-primary/40 hover:bg-primary-soft/40"
                    >
                      <img
                        src={t.image}
                        alt={t.title}
                        className="h-10 w-14 shrink-0 rounded-lg object-cover border border-border/50"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-bold text-foreground">{t.title}</div>
                        <div className="truncate text-[11px] text-muted-foreground">
                          {t.categoryLabel}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Instant Matching Tools */}
            <div>
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="size-3 text-accent" />
                  {value.trim() || catFilter !== "all" ? "Matching Tools" : "Popular Tools"}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Use ↑↓ and Enter to launch
                </span>
              </div>

              {results.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-8 text-center">
                  <p className="text-sm font-semibold text-foreground">
                    No direct tools matched “{value}”
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Try searching by file format (PDF, PNG, JSON, CSV) or browse all 96 tools.
                  </p>
                  <button
                    type="button"
                    onClick={() => goDirectorySearch("")}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                  >
                    Browse Full Directory <ArrowRight className="size-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {results.map((tool, idx) => {
                    const active = idx === selectedIndex;
                    return (
                      <button
                        key={tool.slug}
                        type="button"
                        onMouseEnter={() => setSelectedIndex(idx)}
                        onClick={() => launchTool(tool.slug)}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl border p-2.5 text-left transition-all ${
                          active
                            ? "border-primary/50 bg-primary-soft/60 shadow-sm"
                            : "border-transparent hover:border-border hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={tool.image}
                            alt={tool.title}
                            className="h-11 w-16 shrink-0 rounded-lg object-cover border border-border/60"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-sm font-bold text-foreground">
                                {tool.title}
                              </span>
                              <span className="shrink-0 text-[11px] text-muted-foreground">
                                · {tool.categoryLabel}
                              </span>
                            </div>
                            <p className="truncate text-xs text-muted-foreground mt-0.5">
                              {tool.summary}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-primary">
                          <span className="hidden sm:inline">Open</span>
                          <CornerDownLeft className="size-3.5" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
            <button
              type="button"
              onClick={launchRandomTool}
              className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
            >
              <Shuffle className="size-3.5" /> Launch a Random Tool
            </button>
            <button
              type="button"
              onClick={() => goDirectorySearch(value.trim())}
              className="inline-flex items-center gap-1 font-medium hover:text-foreground"
            >
              View all 96 tools in directory <ArrowRight className="size-3" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
