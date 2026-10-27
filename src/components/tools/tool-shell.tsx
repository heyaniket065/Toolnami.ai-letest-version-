import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronRight,
  ClipboardPaste,
  Copy,
  EyeOff,
  Heart,
  HelpCircle,
  Layers,
  Maximize2,
  Minimize2,
  NotebookPen,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  Workflow,
  BookOpen,
  Cpu,
  Briefcase,
  Lightbulb,
  Star,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Reveal } from "@/components/site/reveal";
import { ToolCard } from "@/components/site/tool-card";
import { LiveToolCard } from "@/components/tools/live-tool-card";
import { ToolReviewsSection } from "@/components/tools/tool-reviews";
import { findLiveTool, type LiveToolSlug, type ToolBadge } from "@/lib/phase1-tools";
import { COMPLETE_TOOLS, getToolBySlug, getLongDescriptionSections } from "@/lib/complete-tools";
import { DEFAULT_CATEGORIES } from "@/lib/tools-data";
import { findWorkflowForTool, useRecentAndSavedTools } from "@/hooks/use-recent-tools";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toolJsonLd, type ToolFaq } from "@/lib/json-ld";

export { toolJsonLd, type ToolFaq };

export type StepItem =
  | string
  | {
      step?: number;
      title: string;
      description: string;
    };

export function ToolShell({
  title,
  tagline,
  categoryLabel,
  thumbnail,
  badge,
  dynamicUses,
  toolSlug,
  relatedSlugs,
  children,
  about,
  steps,
  benefits,
  faqs,
  seo,
}: {
  title: string;
  tagline: string;
  categoryLabel: string;
  thumbnail?: string;
  badge?: ToolBadge;
  dynamicUses?: string;
  toolSlug?: string;
  relatedSlugs?: LiveToolSlug[];
  children: ReactNode;
  about: string;
  steps: StepItem[];
  benefits: { title: string; body: string }[];
  faqs: ToolFaq[];
  seo: { heading: string; paragraphs: string[] };
}) {
  const badgeToneStyles = badge
    ? {
        trending: "bg-sky-500/15 text-sky-400 border-sky-500/30",
        popular: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        hot: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        new: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        featured: "bg-purple-500/15 text-purple-300 border-purple-500/30",
        fast: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
        top: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
        recommended: "bg-blue-500/15 text-blue-300 border-blue-500/30",
      }[badge.tone]
    : null;

  const { isToolSaved, toggleToolSaved, recordToolVisit, scratchpad, updateScratchpad } =
    useRecentAndSavedTools();
  const favorited = toolSlug ? isToolSaved(toolSlug) : false;
  const [copiedLink, setCopiedLink] = useState(false);
  const [wideMode, setWideMode] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [scratchpadOpen, setScratchpadOpen] = useState(false);

  const resolvedSlug = useMemo(
    () =>
      toolSlug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    [toolSlug, title],
  );

  const longGuide = useMemo(
    () => getLongDescriptionSections(resolvedSlug, title, categoryLabel, about),
    [resolvedSlug, title, categoryLabel, about],
  );

  const activeWorkflow = useMemo(
    () => (resolvedSlug ? findWorkflowForTool(resolvedSlug) : null),
    [resolvedSlug],
  );

  // Record visit in Recently Used Tools
  useEffect(() => {
    if (resolvedSlug) {
      recordToolVisit(resolvedSlug);
    }
  }, [resolvedSlug, recordToolVisit]);

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${title} — ToolNami`,
          text: tagline,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard copy
      }
    }
    if (shareUrl && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      toast.success("Tool link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Compute same-category related tools dynamically
  const dynamicRelatedTools = useMemo(() => {
    if (!toolSlug) return [];
    const current = getToolBySlug(toolSlug);
    if (!current) return [];
    return COMPLETE_TOOLS.filter((t) => t.category === current.category && t.slug !== current.slug)
      .slice(0, 3)
      .map((t) => ({
        id: t.slug,
        title: t.title,
        slug: t.slug,
        description: t.summary,
        thumbnail_url: t.image,
        category_id: t.category,
        featured: t.isFeatured,
        views: t.baseUses,
      }));
  }, [toolSlug]);

  return (
    <div className="page-enter">
      {/* Hero (hidden when Zen Focus mode is active) */}
      {!zenMode ? (
        <section className="surface-hero border-b border-border">
          <div className="mx-auto w-full max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16">
            <Reveal>
              <nav
                aria-label="Breadcrumb"
                className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground"
              >
                <Link to="/" className="transition-colors hover:text-primary">
                  Home
                </Link>
                <ChevronRight className="size-3.5" />
                <Link
                  to="/tools"
                  search={{ page: 1 }}
                  className="transition-colors hover:text-primary"
                >
                  Tools
                </Link>
                <ChevronRight className="size-3.5" />
                <span className="text-foreground">{title}</span>
              </nav>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary shadow-soft">
                  <Sparkles className="size-3.5 text-accent" /> {categoryLabel}
                </span>

                {badge ? (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold shadow-soft ${badgeToneStyles}`}
                  >
                    <span>{badge.icon}</span>
                    <span>{badge.label}</span>
                  </span>
                ) : null}

                {dynamicUses ? (
                  <span
                    suppressHydrationWarning
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-soft"
                  >
                    <span className="inline-block size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <TrendingUp className="size-3.5 text-primary" />
                    <span suppressHydrationWarning>{dynamicUses}</span>
                  </span>
                ) : null}

                {toolSlug && (
                  <button
                    type="button"
                    onClick={() => void toggleToolSaved(toolSlug, title)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-soft transition-all active:scale-95 cursor-pointer ${
                      favorited
                        ? "border-rose-500/40 bg-rose-500/15 text-rose-500 hover:bg-rose-500/25"
                        : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80"
                    }`}
                    title={favorited ? "Remove from saved tools" : "Bookmark this tool"}
                  >
                    <Heart
                      className={`size-3.5 ${favorited ? "fill-rose-500 text-rose-500" : ""}`}
                    />
                    <span>{favorited ? "Saved" : "Save Tool"}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-soft transition-all hover:border-primary/40 hover:text-foreground active:scale-95 cursor-pointer"
                  title="Share or copy link to this tool"
                >
                  {copiedLink ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Share2 className="size-3.5" />
                  )}
                  <span>{copiedLink ? "Copied Link" : "Share"}</span>
                </button>

                <a
                  href="#reviews"
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 shadow-soft transition-all hover:bg-amber-500/20"
                  title="Jump to Verified User Reviews"
                >
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span>4.9 ★ Reviews</span>
                </a>
              </div>

              <h1 className="mt-5 text-3xl font-bold sm:text-5xl">{title}</h1>
              <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
                {tagline}
              </p>
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3.5 py-1.5 text-xs font-medium text-primary">
                <ShieldCheck className="size-3.5" /> Runs entirely in your browser — your files
                never leave your device
              </p>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Custom Tool Banner (Thumbnail) — 3D High Quality Aesthetic Artwork */}
      {thumbnail && !zenMode ? (
        <section className="mx-auto w-full max-w-4xl px-4 pt-8 sm:px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-transparent shadow-lift">
              <img
                src={thumbnail}
                alt={`${title} Official Banner`}
                referrerPolicy="no-referrer"
                width={1200}
                height={750}
                className="aspect-[16/10] w-full h-full object-cover block rounded-3xl"
              />
            </div>
          </Reveal>
        </section>
      ) : null}

      {/* Tool workspace */}
      <section
        className={`mx-auto w-full px-4 py-8 transition-all duration-300 sm:px-6 sm:py-12 ${
          wideMode || zenMode ? "max-w-6xl" : "max-w-3xl"
        }`}
      >
        <Reveal>
          {/* Active Multi-Step Workflow Chain Banner */}
          {activeWorkflow ? (
            <div className="mb-5 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 via-card to-card p-3.5 shadow-soft sm:px-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <Workflow className="size-4" />
                  <span>{activeWorkflow.pipeline.title}</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {activeWorkflow.pipeline.steps.map((step, idx) => {
                    const isCurrent = step.slug === toolSlug;
                    const isDone = idx < activeWorkflow.currentIndex;
                    return (
                      <div key={step.slug} className="flex items-center gap-1.5">
                        <Link
                          to={`/tools/${step.slug}`}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                            isCurrent
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : isDone
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25"
                                : "border border-border bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          }`}
                        >
                          {isDone ? <Check className="size-3" /> : null}
                          <span>{step.actionLabel}</span>
                        </Link>
                        {idx < activeWorkflow.pipeline.steps.length - 1 ? (
                          <ChevronRight className="size-3.5 text-muted-foreground/60" />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          <div className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span className="inline-block size-2 rounded-full bg-emerald-500" />
                <span>{zenMode ? `${title} — Focus Studio` : "Interactive Studio Workspace"}</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setScratchpadOpen((v) => !v)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                    scratchpadOpen || scratchpad.trim().length > 0
                      ? "border-primary/40 bg-primary-soft text-primary"
                      : "border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  title="Open cross-tool scratchpad notes"
                >
                  <NotebookPen className="size-3.5" />
                  <span>Scratchpad</span>
                  {scratchpad.trim().length > 0 ? (
                    <span className="size-1.5 rounded-full bg-primary" />
                  ) : null}
                </button>

                <button
                  type="button"
                  onClick={() => setZenMode((z) => !z)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                    zenMode
                      ? "border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : "border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  title={
                    zenMode
                      ? "Exit distraction-free focus mode"
                      : "Enter distraction-free focus mode"
                  }
                >
                  <EyeOff className="size-3.5" />
                  <span>{zenMode ? "Exit Focus" : "Focus Mode"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWideMode((w) => !w)}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  title={wideMode ? "Switch to standard width" : "Expand workspace width"}
                >
                  {wideMode ? (
                    <>
                      <Minimize2 className="size-3.5" /> Compact View
                    </>
                  ) : (
                    <>
                      <Maximize2 className="size-3.5" /> Expand Studio
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Collapsible Cross-Tool Scratchpad Panel */}
            {scratchpadOpen ? (
              <div className="mb-6 rounded-2xl border border-primary/25 bg-primary-soft/30 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <NotebookPen className="size-3.5" /> Cross-Tool Scratchpad & Clipboard
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Notes, hex codes, JSON snippets, or numbers saved here follow you across all
                      96 tools.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          if (text) {
                            updateScratchpad(scratchpad ? `${scratchpad}\n${text}` : text);
                            toast.success("Pasted clipboard into Scratchpad");
                          }
                        } catch {
                          toast.error("Press Ctrl+V inside the scratchpad box to paste");
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:border-primary/40"
                    >
                      <ClipboardPaste className="size-3" /> Paste
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!scratchpad) return;
                        await navigator.clipboard.writeText(scratchpad);
                        toast.success("Copied scratchpad to clipboard!");
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:border-primary/40"
                    >
                      <Copy className="size-3" /> Copy All
                    </button>
                    {scratchpad ? (
                      <button
                        type="button"
                        onClick={() => {
                          updateScratchpad("");
                          toast.success("Cleared scratchpad");
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-destructive"
                        title="Clear scratchpad"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    ) : null}
                  </div>
                </div>
                <textarea
                  value={scratchpad}
                  onChange={(e) => updateScratchpad(e.target.value)}
                  rows={3}
                  placeholder="Jot down intermediate results, hex colors, EMI calculations, or JSON snippets here..."
                  className="w-full rounded-xl border border-input bg-background p-3 font-mono text-xs text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-ring/20"
                />
              </div>
            ) : null}

            {children}

            {/* Workflow Continuation Footer inside Studio */}
            {activeWorkflow?.nextStep || dynamicRelatedTools[0] ? (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                <span className="text-xs font-medium text-muted-foreground">
                  {activeWorkflow?.nextStep
                    ? `Next step in ${activeWorkflow.pipeline.title}:`
                    : "Need another utility in this category?"}
                </span>
                {activeWorkflow?.nextStep ? (
                  <Link
                    to={`/tools/${activeWorkflow.nextStep.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/25 px-4 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                  >
                    <span>Continue to {activeWorkflow.nextStep.title}</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                ) : dynamicRelatedTools[0] ? (
                  <Link
                    to={`/tools/${dynamicRelatedTools[0].slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary/40 hover:text-primary"
                  >
                    <span>Try {dynamicRelatedTools[0].title} next</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        </Reveal>
      </section>

      {/* About + steps */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-2xl font-bold sm:text-3xl">About this tool</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {about}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="text-2xl font-bold sm:text-3xl">How to use it</h2>
            <ol className="mt-4 space-y-3">
              {steps.map((s, i) => {
                const isObj = typeof s === "object" && s !== null;
                const keyText = isObj ? s.title : s;
                return (
                  <li
                    key={`${keyText}-${i}`}
                    className="flex gap-3 text-sm text-muted-foreground sm:text-base"
                  >
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <div className="pt-0.5">
                      {isObj ? (
                        <>
                          <span className="font-semibold text-foreground">{s.title}: </span>
                          <span>{s.description}</span>
                        </>
                      ) : (
                        <span>{s}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
        <Reveal>
          <h2 className="text-2xl font-bold sm:text-3xl">Why use {title}?</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 70}>
              <div className="h-full rounded-3xl border border-border bg-card p-6 shadow-soft">
                <h3 className="text-base font-bold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Comprehensive Long Description & Technical Architecture Guide */}
      <section className="border-t border-border bg-card/30">
        <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-16 space-y-12">
          {/* 1. Deep-Dive Editorial Overview */}
          <Reveal>
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-soft space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                    <BookOpen className="size-4" /> Complete Guide &amp; Long Description
                  </span>
                  <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl text-foreground">
                    Everything You Need to Know About {title}
                  </h2>
                </div>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  100% Client-Side Verified
                </span>
              </div>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
                {longGuide.overviewParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
                {seo.paragraphs.map((p, idx) => (
                  <p key={`seo-${idx}`}>{p}</p>
                ))}
              </div>

              {/* Under-the-Hood Architecture Highlights */}
              <div className="pt-4">
                <h3 className="text-base font-extrabold text-foreground flex items-center gap-2 mb-4">
                  <Cpu className="size-4 text-primary" /> Under-the-Hood Architecture &amp; Privacy
                  Safeguards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {longGuide.architectureHighlights.map((item, idx) => {
                    const [head, body] = item.split(": ");
                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-border bg-muted/25 p-4 flex items-start gap-3"
                      >
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                          <strong className="text-foreground">{head}:</strong> {body || item}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>

          {/* 2. Industry Use Cases & Technical Specifications Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <Reveal>
                <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2">
                  <Briefcase className="size-5 text-primary" /> Real-World Industry Use Cases
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  How teams and professionals use {title} in daily production workflows:
                </p>
              </Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {longGuide.industryUseCases.map((uc, i) => (
                  <Reveal key={uc.role} delay={i * 50}>
                    <div className="h-full rounded-2xl border border-border bg-card p-5 shadow-soft space-y-2">
                      <div className="text-sm font-bold text-foreground">{uc.role}</div>
                      <p className="text-xs leading-relaxed text-muted-foreground">{uc.scenario}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <Reveal>
                <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-5 text-primary" /> Technical Specifications
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Verified performance and security parameters for {title}:
                </p>
              </Reveal>
              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-soft divide-y divide-border">
                {longGuide.techSpecs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between gap-4 px-4 py-3 text-xs"
                  >
                    <span className="font-semibold text-muted-foreground">{spec.label}</span>
                    <span className="font-bold text-foreground text-right">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Pro Workflow Tips */}
              <div className="rounded-2xl border border-primary/25 bg-primary-soft/25 p-5 space-y-2.5">
                <div className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Lightbulb className="size-4" /> Pro Workflow Tips
                </div>
                <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                  {longGuide.proTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="border-t border-border bg-card/50">
        <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
          <Reveal>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <HelpCircle className="size-4" /> Frequently Asked Questions
            </div>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Got questions? We've got answers
            </h2>
            <Accordion type="single" collapsible className="mt-6 space-y-3">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`item-${i}`}
                  className="rounded-2xl border border-border bg-card px-5 shadow-soft"
                >
                  <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline sm:text-base">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* Verified User Reviews & Star Ratings Section */}
      <ToolReviewsSection toolSlug={resolvedSlug} toolTitle={title} categoryLabel={categoryLabel} />

      {/* Related Tools Section */}
      {relatedSlugs && relatedSlugs.length > 0 ? (
        <section className="border-t border-border bg-card/40">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <Reveal>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                    <Layers className="size-3.5" /> Keep going
                  </span>
                  <h2 className="mt-1.5 text-2xl font-bold sm:text-3xl">
                    Related tools you might need next
                  </h2>
                </div>
                <Link
                  to="/tools"
                  search={{ page: 1 }}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  View all tools <ChevronRight className="size-4" />
                </Link>
              </div>
            </Reveal>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedSlugs.map((slug, i) => {
                const related = findLiveTool(slug);
                if (!related) return null;
                return (
                  <Reveal key={related.slug} delay={i * 70}>
                    <LiveToolCard tool={related} />
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      ) : dynamicRelatedTools.length > 0 ? (
        <section className="border-t border-border bg-card/40">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <Reveal>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                    <Layers className="size-3.5" /> Same Category Utilities
                  </span>
                  <h2 className="mt-1.5 text-2xl font-bold sm:text-3xl">
                    More {categoryLabel} you might need next
                  </h2>
                </div>
                <Link
                  to="/tools"
                  search={{ page: 1 }}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  View all 96 tools <ChevronRight className="size-4" />
                </Link>
              </div>
            </Reveal>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dynamicRelatedTools.map((related, i) => {
                const catObj = DEFAULT_CATEGORIES.find((c) => c.id === related.category_id);
                return (
                  <Reveal key={related.slug} delay={i * 70}>
                    <ToolCard tool={related} category={catObj} />
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
