import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  Gauge,
  Heart,
  Search,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Trash2,
  Wallet,
  Workflow,
  ChevronRight,
  Wand2,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Reveal } from "@/components/site/reveal";
import { CategoryIcon, ToolCard, ToolCardSkeleton } from "@/components/site/tool-card";
import { LiveToolCard } from "@/components/tools/live-tool-card";
import { HomepageReviewsSection } from "@/components/tools/tool-reviews";
import { LIVE_TOOLS } from "@/lib/phase1-tools";
import { COMPLETE_TOOLS, getToolBySlug, type CompleteTool } from "@/lib/complete-tools";
import {
  ALL_CATALOGUE_TOOLS,
  CATEGORY_TOOL_COUNTS,
  categoriesQuery,
  featuredToolsQuery,
  type ToolCategory,
} from "@/lib/tools-data";
import { useRecentAndSavedTools, WORKFLOW_PIPELINES } from "@/hooks/use-recent-tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ToolNami — Fast, Free Online Tools for Everyday Work" },
      {
        name: "description",
        content:
          "ToolNami is a clean, fast platform of 96+ free online tools: merge PDFs, compress images, convert units, format code, and more — no installs, no clutter.",
      },
      {
        name: "keywords",
        content:
          "toolnami, free online tools, pdf compressor online, merge pdf free, image compressor, photo size reducer in kb, jpg to pdf, word to pdf, qr code generator, json formatter, emi calculator, gst calculator, ai writer, ai image generator",
      },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { property: "og:site_name", content: "ToolNami" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://toolnami.ai.studio/" },
      { property: "og:title", content: "ToolNami — Fast, Free Online Tools for Everyday Work" },
      {
        property: "og:description",
        content:
          "One bright, uncluttered home for the everyday tools you keep searching for. 100% free, fast, and browser-based.",
      },
      { property: "og:image", content: "/assets/tools/3d-pdf-compressor.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Instgram136" },
      { name: "twitter:creator", content: "@Instgram136" },
      { name: "twitter:title", content: "ToolNami — Fast, Free Online Tools for Everyday Work" },
      {
        name: "twitter:description",
        content:
          "One bright, uncluttered home for the everyday tools you keep searching for. 100% free, fast, and browser-based.",
      },
      { name: "twitter:image", content: "/assets/tools/3d-pdf-compressor.png" },
    ],
    links: [{ rel: "canonical", href: "https://toolnami.ai.studio/" }],
  }),
  component: Home,
});

const TRUST = [
  {
    Icon: Gauge,
    title: "Instant results",
    body: "Tools open and run in your browser — no uploads to wait on, no processing queues.",
  },
  {
    Icon: ShieldCheck,
    title: "Private by design",
    body: "We collect as little as possible and process your files locally wherever we can.",
  },
  {
    Icon: Wallet,
    title: "Free to use",
    body: "The everyday essentials stay free — no signup wall before you can get work done.",
  },
];

const QUICK_LAUNCH_PILLS = [
  { label: "PDF Unlock", slug: "pdf-unlock" },
  { label: "Word to PDF", slug: "word-to-pdf" },
  { label: "Image Upscaler", slug: "image-upscaler" },
  { label: "Pomodoro Timer", slug: "pomodoro-timer" },
  { label: "JWT Decoder", slug: "jwt-decoder" },
  { label: "Salary Calculator", slug: "salary-calculator" },
];

function Home() {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [activeShelf, setActiveShelf] = useState<string>("pdf");

  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: featured, isPending } = useQuery(featuredToolsQuery);
  const { recentSlugs, savedSlugs, clearRecentTools } = useRecentAndSavedTools();

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/tools", search: { q: term.trim() || undefined, page: 1 } });
  };

  const launchRandom = () => {
    const random = COMPLETE_TOOLS[Math.floor(Math.random() * COMPLETE_TOOLS.length)];
    if (random) {
      navigate({ to: `/tools/${random.slug}` });
    }
  };

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

  const shelfTools = useMemo(() => {
    return ALL_CATALOGUE_TOOLS.filter((t) => t.category_id === activeShelf).slice(0, 6);
  }, [activeShelf]);

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="surface-hero relative overflow-hidden border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-primary shadow-soft">
              <Sparkles className="size-3.5 text-accent" /> 96+ Professional Client-Side Tools •
              100% Free
            </span>
          </Reveal>

          <Reveal delay={70}>
            <h1 className="mx-auto mt-6 max-w-3xl text-4xl leading-[1.08] font-bold sm:text-6xl">
              Every small online task,{" "}
              <span className="text-gradient-brand">solved in seconds</span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              ToolNami collects the tools you keep googling — PDF, image, text, SEO, calculators,
              and developer utilities — into one fast, clean, and private workspace.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <form
              onSubmit={search}
              role="search"
              aria-label="Sitewide tool search"
              className="mx-auto mt-9 flex w-full max-w-xl items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-soft transition-all focus-within:border-primary/40 focus-within:shadow-lift"
            >
              <label htmlFor="home-search-input" className="sr-only">
                Search tools
              </label>
              <Search className="ml-2 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                id="home-search-input"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search 96+ tools (or press ⌘K anywhere)..."
                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:text-base"
              />
              <button
                type="submit"
                aria-label="Submit search query"
                className="inline-flex h-11 shrink-0 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-95 sm:px-5"
              >
                Search
              </button>
            </form>

            {/* Quick-Launch Task Pills */}
            <div className="mx-auto mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Try:</span>
              {QUICK_LAUNCH_PILLS.map((item) => (
                <Link
                  key={item.slug}
                  to={`/tools/${item.slug}`}
                  className="rounded-lg border border-border/80 bg-card/80 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/tools"
                search={{ page: 1 }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift active:scale-95 sm:w-auto"
              >
                Explore All 96 Tools <ArrowRight className="size-4" />
              </Link>
              <button
                type="button"
                onClick={launchRandom}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold transition-all hover:border-primary/40 hover:text-primary active:scale-95 sm:w-auto cursor-pointer"
              >
                <Shuffle className="size-4 text-primary" /> Surprise Me
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Personal Quick-Access Hub (Saved Bookmarks & Recently Used) */}
      {(savedTools.length > 0 || recentTools.length > 0) && (
        <section className="border-b border-border bg-card/40">
          <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-2">
              {savedTools.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500">
                      <Heart className="size-3.5 fill-rose-500" /> Your Saved Bookmarks
                    </span>
                    <Link
                      to="/tools"
                      search={{ page: 1 }}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Manage all →
                    </Link>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {savedTools.map((t) => (
                      <Link
                        key={`home-saved-${t.slug}`}
                        to={`/tools/${t.slug}`}
                        className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40"
                      >
                        <img
                          src={t.image}
                          alt={t.title}
                          className="h-12 w-18 shrink-0 rounded-xl object-cover border border-border/50"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-bold text-foreground group-hover:text-primary">
                            {t.title}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            {t.categoryLabel}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {recentTools.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <Clock className="size-3.5 text-primary" /> Continue Where You Left Off
                    </span>
                    <button
                      type="button"
                      onClick={clearRecentTools}
                      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-destructive cursor-pointer"
                    >
                      <Trash2 className="size-3" /> Clear
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {recentTools.map((t) => (
                      <Link
                        key={`home-recent-${t.slug}`}
                        to={`/tools/${t.slug}`}
                        className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40"
                      >
                        <img
                          src={t.image}
                          alt={t.title}
                          className="h-12 w-18 shrink-0 rounded-xl object-cover border border-border/50"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-bold text-foreground group-hover:text-primary">
                            {t.title}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            {t.categoryLabel}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Popular Tools — built-in ToolNami tools */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground">
                <Sparkles className="size-3" /> Flagship Studio
              </span>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Most Used Flagship Tools</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
                Our flagship utilities run instantly in your browser — nothing to install, nothing
                uploaded.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LIVE_TOOLS.map((tool, i) => (
            <Reveal key={tool.slug} delay={Math.min(i * 70, 280)} className="h-full">
              <LiveToolCard tool={tool} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Smart Multi-Step Workflow Pipelines */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                <Workflow className="size-3.5" /> Multi-Tool Chains
              </span>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Smart Workflow Pipelines</h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
                Chain multiple utilities together in a guided sequence — complete with a built-in
                progress bar and cross-tool scratchpad.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {WORKFLOW_PIPELINES.map((pipeline, idx) => (
            <Reveal key={pipeline.id} delay={idx * 60}>
              <div
                className={`flex h-full flex-col justify-between rounded-3xl border bg-gradient-to-br p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift ${pipeline.accent}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full border border-border bg-background/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                      {pipeline.badge}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {pipeline.steps.length}-Step Chain
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-foreground">{pipeline.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {pipeline.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-1.5">
                    {pipeline.steps.map((step, sIdx) => (
                      <div key={step.slug} className="flex items-center gap-1.5">
                        <Link
                          to={`/tools/${step.slug}`}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-colors hover:border-primary/50 hover:text-primary"
                        >
                          <span>{step.actionLabel}</span>
                        </Link>
                        {sIdx < pipeline.steps.length - 1 ? (
                          <ChevronRight className="size-3.5 text-muted-foreground/60" />
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                  <span className="text-xs font-medium text-muted-foreground">
                    Starts with{" "}
                    <strong className="text-foreground">{pipeline.steps[0].title}</strong>
                  </span>
                  <Link
                    to={`/tools/${pipeline.steps[0].slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-soft transition-all hover:brightness-110"
                  >
                    <span>Launch Pipeline</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Interactive Category Showcase Tabs */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Explore by Category</h2>
              <p className="mt-2 max-w-lg text-sm text-muted-foreground sm:text-base">
                Switch between specialized tool suites to preview our 3D studio utilities.
              </p>
            </div>
            <Link
              to="/tools"
              search={{ category: activeShelf, page: 1 }}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              See all in category
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div
            role="tablist"
            aria-label="Category preview tabs"
            className="mt-6 flex flex-wrap gap-2"
          >
            {categories.map((c: ToolCategory) => {
              const active = activeShelf === c.slug;
              const count = CATEGORY_TOOL_COUNTS[c.id] || 0;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveShelf(c.slug)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-soft"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <CategoryIcon name={c.icon} className="size-4" />
                  <span>{c.name}</span>
                  <span
                    className={`text-[11px] ${
                      active ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shelfTools.map((tool, i) => (
            <Reveal key={tool.id} delay={Math.min(i * 60, 240)} className="h-full">
              <ToolCard
                tool={tool}
                category={categories.find((c: ToolCategory) => c.id === tool.category_id)}
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured tools */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Trending right now</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
                Community favorites across PDF, image, and developer workflows.
              </p>
            </div>
            <Link
              to="/tools"
              search={{ page: 1 }}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              View all 100 tools
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isPending
            ? Array.from({ length: 6 }).map((_, i) => <ToolCardSkeleton key={i} />)
            : (featured ?? []).map((tool, i) => (
                <Reveal key={tool.id} delay={Math.min(i * 70, 280)} className="h-full">
                  <ToolCard
                    tool={tool}
                    category={categories.find((c: ToolCategory) => c.id === tool.category_id)}
                  />
                </Reveal>
              ))}
        </div>
      </section>

      {/* AI Creative & Productivity Studio Spotlight */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-10 shadow-soft">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-primary">
                  <Wand2 className="size-3.5" /> New Flagship AI Suite
                </span>
                <h2 className="mt-2.5 text-2xl font-extrabold sm:text-3xl text-foreground">
                  AI Image Generation, Summarizer, Code &amp; Writing Studio
                </h2>
                <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground sm:text-base">
                  Create high-resolution 4K AI art, summarize research in English/Marathi/Hindi,
                  generate production code, and draft high-converting emails—all in one place.
                </p>
              </div>
              <Link
                to="/tools/ai-image-generator"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-xs sm:text-sm font-extrabold text-primary-foreground shadow-md hover:bg-primary/90 transition-all shrink-0"
              >
                <Sparkles className="size-4 text-amber-300" />
                Launch AI Image Studio →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  slug: "ai-image-generator",
                  title: "AI Image Generator",
                  badge: "🎨 8 Art Styles",
                  desc: "Text-to-image studio with 1:1, 16:9, 9:16 ratios, prompt enhancer & color grading.",
                  img: "/assets/tools/ai-image-generator.png",
                },
                {
                  slug: "ai-summarizer",
                  title: "AI Summarizer & Paraphraser",
                  badge: "⚡ TL;DR & Notes",
                  desc: "Condense long articles into executive bullets in English, मराठी, & हिंदी.",
                  img: "/assets/tools/ai-summarizer.png",
                },
                {
                  slug: "ai-code-assistant",
                  title: "AI Code Generator",
                  badge: "💻 Dev Copilot",
                  desc: "Generate, debug, and explain TypeScript, Python, React, and SQL queries.",
                  img: "/assets/tools/ai-code-assistant.png",
                },
                {
                  slug: "ai-email-writer",
                  title: "AI Email & Letter Pro",
                  badge: "✉️ Outreach",
                  desc: "Draft polished cold emails, client proposals, and job cover letters.",
                  img: "/assets/tools/ai-email-writer.png",
                },
              ].map((item) => (
                <Link
                  key={item.slug}
                  to={`/tools/${item.slug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-border bg-card/90 p-4 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/50"
                >
                  <div>
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-muted mb-3">
                      <img
                        src={item.img}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary mb-1.5">
                      {item.badge}
                    </span>
                    <h3 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs font-bold text-primary">
                    <span>Open Studio</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Categories Grid */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Reveal>
            <h2 className="text-2xl font-bold sm:text-3xl">Browse all 8 tool suites</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
              Pick a category shelf and see every specialized utility inside it.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c: ToolCategory, i: number) => (
              <Reveal key={c.id} delay={Math.min(i * 50, 250)} className="h-full">
                <Link
                  to="/tools"
                  search={{ category: c.slug, page: 1 }}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary transition-transform duration-300 group-hover:scale-110">
                      <CategoryIcon name={c.icon} className="size-5" />
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {CATEGORY_TOOL_COUNTS[c.id] || 0} tools
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold group-hover:text-primary transition-colors">
                    {c.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                    {c.description}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Community Reviews & Ratings Section */}
      <HomepageReviewsSection />

      {/* Trust / value */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <h2 className="max-w-lg text-2xl font-bold sm:text-3xl">
            Built to be the tools tab you actually keep open
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {TRUST.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 80} className="h-full">
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Explore all CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-6 sm:px-6">
        <Reveal>
          <div className="surface-hero relative overflow-hidden rounded-3xl border border-border p-8 text-center shadow-soft sm:p-14">
            <h2 className="mx-auto max-w-xl text-2xl font-bold sm:text-4xl">
              The whole toolbox is one tap away
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground sm:text-base">
              Search the full directory of 100 tools, filter by category, or press ⌘K from anywhere.
            </p>
            <Link
              to="/tools"
              search={{ page: 1 }}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift active:scale-95"
            >
              Explore All 100 Tools <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
