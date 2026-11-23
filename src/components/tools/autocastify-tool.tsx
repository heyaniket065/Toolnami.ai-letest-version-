import {
  ArrowUpRight,
  Check,
  Copy,
  FolderSync,
  Sparkles,
  Tags,
  FileText,
  Youtube,
  Zap,
  ShieldCheck,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AUTOCASTIFY_URL = "https://autocastify.ai.studio";

const FEATURES = [
  {
    icon: FolderSync,
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    title: "Google Drive to YouTube Auto-Posting",
    description:
      "Connect any Google Drive folder and let AutoCastify automatically detect, upload, and publish your videos straight to YouTube — zero manual downloading or re-uploading.",
  },
  {
    icon: Sparkles,
    accent: "bg-primary/10 text-primary border-primary/20",
    title: "AI High-CTR Titles & Hooks",
    description:
      "Automatically crafts click-worthy, search-friendly YouTube video and Shorts titles tailored to your niche and audience intent.",
  },
  {
    icon: FileText,
    accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    title: "Smart Descriptions & Formatting",
    description:
      "Generates complete, structured YouTube descriptions with keyword-rich summaries, calls-to-action, and clean formatting for every upload.",
  },
  {
    icon: Tags,
    accent: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    title: "YouTube SEO Tags & Metadata",
    description:
      "Researches and injects relevant YouTube tags, hashtags, and ranking keywords so your videos surface faster in YouTube Search and Suggested feeds.",
  },
];

const PIPELINE_STEPS = [
  {
    step: "01",
    title: "Drop Videos in Google Drive",
    detail: "Place your finished YouTube videos or Shorts inside your connected Drive folder.",
  },
  {
    step: "02",
    title: "AI Writes Title, Description & SEO",
    detail:
      "AutoCastify analyzes your topic and prepares optimized titles, descriptions, and tags.",
  },
  {
    step: "03",
    title: "Auto-Publish to YouTube",
    detail:
      "Videos post automatically to your YouTube channel on schedule — completely hands-free.",
  },
];

export function AutoCastifyTool() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(AUTOCASTIFY_URL);
      setCopied(true);
      toast.success("AutoCastify link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Cover Hero Card */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        {/* Visual Cover Banner */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-muted/40 border-b border-border">
          <img
            src="/assets/tools/3d-autocastify.jpg"
            alt="AutoCastify — Automated Google Drive to YouTube Publishing & AI SEO Studio"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/15 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-300 backdrop-blur-md">
                <Youtube className="size-3.5" /> YouTube AI Automation
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 backdrop-blur-md">
                <FolderSync className="size-3.5" /> Google Drive Auto-Post
              </span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-md shadow-xs">
              Official Partner Tool • LuminaLM
            </span>
          </div>
        </div>

        {/* Cover Content & Launch Controls */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl space-y-2.5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Sparkles className="size-3.5" /> All-in-One YouTube Creator Automation
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Launch AutoCastify Studio
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                Automate your entire YouTube publishing workflow in one place. Generate high-ranking
                titles, SEO descriptions, and tags with AI — and automatically upload videos
                directly from your Google Drive folders to your YouTube channel.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <a
                href={AUTOCASTIFY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary to-primary/90 px-7 py-4 text-sm sm:text-base font-bold text-primary-foreground shadow-lift transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]"
              >
                <span>Open AutoCastify</span>
                <ArrowUpRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5 text-emerald-500" />
                    <span>Copied autocastify.ai.studio</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5 text-muted-foreground" />
                    <span>Copy Link: autocastify.ai.studio</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Trust Highlights */}
          <div className="mt-6 pt-6 border-t border-border/70 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-3.5 py-2.5 border border-border/60">
              <Zap className="size-4 text-amber-500 shrink-0" />
              <span>Instant AI Titles, Descriptions & Tags</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-3.5 py-2.5 border border-border/60">
              <Clock className="size-4 text-primary shrink-0" />
              <span>Hands-Free Drive Folder Auto-Publishing</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-3.5 py-2.5 border border-border/60">
              <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
              <span>Built for Creators, Agencies & Shorts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FEATURES.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.title}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:border-primary/40 hover:shadow-lift"
            >
              <div
                className={`mb-3.5 inline-flex size-10 items-center justify-center rounded-xl border ${feat.accent}`}
              >
                <Icon className="size-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">{feat.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {feat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* 3-Step Automation Flow */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              End-to-End Automation
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-foreground mt-0.5">
              How AutoCastify Automates Your YouTube Channel
            </h3>
          </div>
          <a
            href={AUTOCASTIFY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <span>Try it live</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PIPELINE_STEPS.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-border/80 bg-muted/30 p-4 flex flex-col gap-2"
            >
              <span className="inline-flex w-fit items-center rounded-lg bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold text-primary">
                STEP {item.step}
              </span>
              <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
              <p className="text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
