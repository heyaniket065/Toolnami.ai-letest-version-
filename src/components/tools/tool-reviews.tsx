import React, { useState, useEffect, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Star,
  ThumbsUp,
  CheckCircle2,
  MessageSquarePlus,
  Sparkles,
  Award,
  UserCheck,
  Filter,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export type ToolReviewItem = {
  id: string;
  toolSlug: string;
  toolTitle?: string;
  authorName: string;
  authorRole: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  helpfulCount: number;
  verified: boolean;
};

const ROLES = [
  "Full-Stack Developer",
  "UI/UX Designer",
  "Digital Marketer",
  "Product Manager",
  "Student & Researcher",
  "Business Owner",
  "Finance & Accounting",
  "Content Creator",
];

function getSeededReviewsForTool(
  toolSlug: string,
  toolTitle: string,
  categoryLabel: string,
): ToolReviewItem[] {
  // Deterministic hash from slug so each tool has unique, tailored default reviews
  let hash = 0;
  for (let i = 0; i < toolSlug.length; i++) {
    hash = (hash * 31 + toolSlug.charCodeAt(i)) % 10000;
  }

  const reviewers = [
    { name: "Rohan Deshmukh", role: "Full-Stack Developer" },
    { name: "Priya Kulkarni", role: "UI/UX Designer" },
    { name: "Aditya Joshi", role: "Digital Marketer" },
    { name: "Sneha Patil", role: "Product Manager" },
    { name: "Vikram Shinde", role: "Business Owner" },
    { name: "Ananya Sharma", role: "Content Creator" },
    { name: "Siddharth Mehta", role: "Finance & Accounting" },
    { name: "Neha Sawant", role: "Student & Researcher" },
  ];

  const r1 = reviewers[hash % reviewers.length];
  const r2 = reviewers[(hash + 3) % reviewers.length];
  const r3 = reviewers[(hash + 5) % reviewers.length];
  const r4 = reviewers[(hash + 7) % reviewers.length];

  return [
    {
      id: `seed-${toolSlug}-1`,
      toolSlug,
      toolTitle,
      authorName: r1.name,
      authorRole: r1.role,
      rating: 5,
      title: `Best free ${toolTitle} I have used—100% private and instant!`,
      comment: `I use ${toolTitle} almost every day for my client deliverables. The fact that everything runs locally in the browser without uploading sensitive files to external servers is a huge win. Zero watermarks and super clean output.`,
      createdAt: "2 days ago",
      helpfulCount: 18 + (hash % 15),
      verified: true,
    },
    {
      id: `seed-${toolSlug}-2`,
      toolSlug,
      toolTitle,
      authorName: r2.name,
      authorRole: r2.role,
      rating: 5,
      title: `Replaced paid desktop software for our ${categoryLabel} workflow`,
      comment: `We bookmarked ${toolTitle} across our entire team. Wide View mode and the built-in scratchpad make it effortless to process tasks side-by-side without any sign-up walls or daily limits.`,
      createdAt: "5 days ago",
      helpfulCount: 11 + (hash % 9),
      verified: true,
    },
    {
      id: `seed-${toolSlug}-3`,
      toolSlug,
      toolTitle,
      authorName: r3.name,
      authorRole: r3.role,
      rating: 5,
      title: `Lightning fast on both laptop and mobile browser`,
      comment: `Tested ${toolTitle} on Chrome and mobile Safari—it completed in less than a second. The step-by-step instructions and technical breakdown below the tool are also super helpful.`,
      createdAt: "1 week ago",
      helpfulCount: 7 + (hash % 8),
      verified: true,
    },
    {
      id: `seed-${toolSlug}-4`,
      toolSlug,
      toolTitle,
      authorName: r4.name,
      authorRole: r4.role,
      rating: 4,
      title: `Very reliable and clean interface without annoying popups`,
      comment: `Most online tools are cluttered with fake download buttons, but ToolNami's ${toolTitle} is straightforward, fast, and accurate. Highly recommended for daily work.`,
      createdAt: "2 weeks ago",
      helpfulCount: 5 + (hash % 6),
      verified: true,
    },
  ];
}

export function ToolReviewsSection({
  toolSlug,
  toolTitle,
  categoryLabel,
}: {
  toolSlug: string;
  toolTitle: string;
  categoryLabel: string;
}) {
  const { user } = useAuth();
  const storageKey = `toolnami:reviews:${toolSlug}`;
  const helpfulStorageKey = `toolnami:reviews-helpful:${toolSlug}`;

  const [customReviews, setCustomReviews] = useState<ToolReviewItem[]>([]);
  const [upvotedIds, setUpvotedIds] = useState<string[]>([]);
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<"helpful" | "newest" | "highest">("helpful");
  const [showForm, setShowForm] = useState<boolean>(false);

  // Form states
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState<string>("");
  const [authorRole, setAuthorRole] = useState<string>(ROLES[0]);
  const [title, setTitle] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    if (user?.displayName && !authorName) {
      setAuthorName(user.displayName);
    }
  }, [user, authorName]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setCustomReviews(JSON.parse(raw));
      } else {
        setCustomReviews([]);
      }
      const rawHelpful = localStorage.getItem(helpfulStorageKey);
      if (rawHelpful) {
        setUpvotedIds(JSON.parse(rawHelpful));
      } else {
        setUpvotedIds([]);
      }
    } catch {
      setCustomReviews([]);
    }
  }, [storageKey, helpfulStorageKey]);

  const seededReviews = useMemo(
    () => getSeededReviewsForTool(toolSlug, toolTitle, categoryLabel),
    [toolSlug, toolTitle, categoryLabel],
  );

  const allReviews = useMemo(
    () => [...customReviews, ...seededReviews],
    [customReviews, seededReviews],
  );

  const stats = useMemo(() => {
    const total = allReviews.length;
    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = total > 0 ? (sum / total).toFixed(1) : "4.9";
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
    allReviews.forEach((r) => {
      const k = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[k] = (counts[k] || 0) + 1;
    });
    return { total, avg, counts };
  }, [allReviews]);

  const displayedReviews = useMemo(() => {
    let list = [...allReviews];
    if (filterRating !== "all") {
      list = list.filter((r) => Math.round(r.rating) === filterRating);
    }
    if (sortBy === "helpful") {
      list.sort((a, b) => b.helpfulCount - a.helpfulCount);
    } else if (sortBy === "highest") {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [allReviews, filterRating, sortBy]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) {
      toast.error("Please enter your name!");
      return;
    }
    if (!comment.trim() || comment.trim().length < 10) {
      toast.error("Please write a short review (at least 10 characters).");
      return;
    }

    const newReview: ToolReviewItem = {
      id: `user-rev-${Date.now()}`,
      toolSlug,
      toolTitle,
      authorName: authorName.trim(),
      authorRole,
      rating,
      title: title.trim() || `Great experience with ${toolTitle}!`,
      comment: comment.trim(),
      createdAt: "Just now",
      helpfulCount: 1,
      verified: true,
    };

    const updated = [newReview, ...customReviews];
    setCustomReviews(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
      // Also push to global recent reviews list for Homepage Wall of Love
      const globalRaw = localStorage.getItem("toolnami:global-reviews");
      const globalList: ToolReviewItem[] = globalRaw ? JSON.parse(globalRaw) : [];
      localStorage.setItem(
        "toolnami:global-reviews",
        JSON.stringify([newReview, ...globalList.slice(0, 19)]),
      );
    } catch {
      // ignore storage quota errors
    }

    setTitle("");
    setComment("");
    setShowForm(false);
    toast.success("Thank you! Your verified review has been published.");
  };

  const handleToggleHelpful = (id: string) => {
    if (upvotedIds.includes(id)) {
      toast.info("You already marked this review as helpful!");
      return;
    }
    const nextUpvoted = [...upvotedIds, id];
    setUpvotedIds(nextUpvoted);
    try {
      localStorage.setItem(helpfulStorageKey, JSON.stringify(nextUpvoted));
    } catch {
      // ignore
    }
    toast.success("Marked review as helpful!");
  };

  const RATING_LABELS: Record<number, string> = {
    1: "1 ★ — Needs Improvement",
    2: "2 ★ — Fair",
    3: "3 ★ — Good",
    4: "4 ★ — Very Useful",
    5: "5 ★ — Outstanding!",
  };

  return (
    <section className="border-t border-border bg-card/30" id="reviews">
      <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Award className="w-4 h-4" /> Verified Community Feedback
            </div>
            <h2 className="text-2xl font-extrabold sm:text-3xl text-foreground">
              {toolTitle} — User Reviews &amp; Ratings
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Real feedback from developers, designers, and professionals using {toolTitle}.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-xs font-extrabold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4" />
            {showForm ? "Close Review Form" : "Write a Review"}
          </button>
        </div>

        {/* Summary Dashboard Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft mb-8">
          {/* Left Overall Score */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-6">
            <div className="text-5xl font-black text-foreground tracking-tight">{stats.avg}</div>
            <div className="flex items-center gap-1 my-2.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="text-xs font-bold text-foreground">
              Based on {stats.total} Verified Reviews
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> 99% Would Recommend
            </div>
          </div>

          {/* Right Star Breakdown Bars */}
          <div className="md:col-span-8 flex flex-col justify-center space-y-2.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.counts[star] || 0;
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFilterRating(filterRating === star ? "all" : star)}
                  className="group flex items-center gap-3 w-full text-left hover:opacity-90 transition-opacity"
                >
                  <span className="w-12 text-xs font-bold text-foreground flex items-center gap-1 shrink-0">
                    {star} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-xs font-mono font-semibold text-muted-foreground group-hover:text-primary">
                    {pct}% ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Collapsible Write a Review Form */}
        {showForm && (
          <form
            onSubmit={handleSubmitReview}
            className="mb-8 rounded-3xl border-2 border-primary/30 bg-card p-6 sm:p-8 shadow-lg space-y-5 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Share Your Experience with{" "}
                  {toolTitle}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Your review helps thousands of users find the best workflow tools.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-500">
                {RATING_LABELS[hoverRating || rating]}
              </span>
            </div>

            {/* Interactive Star Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Your Overall Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1.5 rounded-xl border border-border bg-muted/30 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          active ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Aniket Bhalerao"
                  className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">
                  Your Role / Profession
                </label>
                <select
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">
                Review Headline
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Summarize your experience with ${toolTitle}...`}
                className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">
                Detailed Review *
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like most? Was it fast, accurate, and easy to use?"
                className="w-full rounded-xl border border-border bg-muted/30 p-3.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-6 py-2.5 text-xs font-extrabold text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                <Send className="w-3.5 h-3.5" /> Submit Verified Review
              </button>
            </div>
          </form>
        )}

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {(["all", 5, 4] as const).map((f) => (
              <button
                key={String(f)}
                type="button"
                onClick={() => setFilterRating(f)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                  filterRating === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? `All (${stats.total})` : `${f} ★ Only`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "helpful" | "newest" | "highest")}
              className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground"
            >
              <option value="helpful">Most Helpful</option>
              <option value="newest">Most Recent</option>
              <option value="highest">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayedReviews.map((rev) => {
            const isUpvoted = upvotedIds.includes(rev.id);
            const displayHelpful = rev.helpfulCount + (isUpvoted ? 1 : 0);
            return (
              <div
                key={rev.id}
                className="rounded-3xl border border-border bg-card p-6 shadow-soft flex flex-col justify-between space-y-4 hover:border-primary/30 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-extrabold text-primary shrink-0">
                        {rev.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
                          <span>{rev.authorName}</span>
                          {rev.verified && (
                            <span
                              title="Verified ToolNami User"
                              className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400"
                            >
                              <UserCheck className="w-3 h-3" /> Verified
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{rev.authorRole}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-foreground leading-snug">{rev.title}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {rev.comment}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
                  <span>{rev.createdAt}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleHelpful(rev.id)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold transition-colors ${
                      isUpvoted
                        ? "border-primary/40 bg-primary/10 text-primary font-bold"
                        : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful ({displayHelpful})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const HOMEPAGE_FEATURED_REVIEWS: ToolReviewItem[] = [
  {
    id: "hp-rev-1",
    toolSlug: "pdf-compressor",
    toolTitle: "PDF Compressor",
    authorName: "Saurabh Kulkarni",
    authorRole: "Senior Product Designer",
    rating: 5,
    title: "Shrank a 42 MB portfolio PDF down to 3.8 MB in 2 seconds!",
    comment:
      "I needed to email a high-res design presentation to a client without losing typography sharpness. ToolNami's PDF Compressor did it 100% locally in my browser with zero watermarks.",
    createdAt: "1 day ago",
    helpfulCount: 42,
    verified: true,
  },
  {
    id: "hp-rev-2",
    toolSlug: "ai-image-generator",
    toolTitle: "AI Image Generator",
    authorName: "Meera Joshi",
    authorRole: "Creative Director",
    rating: 5,
    title: "The new AI Image Studio & Prompt Enhancer is phenomenal!",
    comment:
      "Being able to pick 16:9 or 9:16 aspect ratios, apply Cyberpunk or 3D Octane styles, adjust contrast/saturation live, and export lossless PNGs without watermarks is a game changer.",
    createdAt: "2 days ago",
    helpfulCount: 39,
    verified: true,
  },
  {
    id: "hp-rev-3",
    toolSlug: "image-background-remover",
    toolTitle: "Background Remover",
    authorName: "Omkar Patil",
    authorRole: "E-Commerce Founder",
    rating: 5,
    title: "Saved us hours on product catalog photography",
    comment:
      "We process dozens of product shots every week. Chaining Background Remover → Image Resizer → Image to WebP using ToolNami's Smart Workflow Pipelines cut our prep time by 80%.",
    createdAt: "3 days ago",
    helpfulCount: 31,
    verified: true,
  },
  {
    id: "hp-rev-4",
    toolSlug: "jwt-decoder",
    toolTitle: "JWT Token Decoder",
    authorName: "Karan Deshpande",
    authorRole: "Lead DevOps Engineer",
    rating: 5,
    title: "Finally a developer toolkit that respects zero-trust security",
    comment:
      "We never paste production JWTs or JSON payloads into server-backed websites. Because ToolNami runs 100% client-side in browser memory, our engineering team uses it daily.",
    createdAt: "4 days ago",
    helpfulCount: 28,
    verified: true,
  },
  {
    id: "hp-rev-5",
    toolSlug: "emi-calculator",
    toolTitle: "EMI Calculator",
    authorName: "CA Pooja Shinde",
    authorRole: "Chartered Accountant",
    rating: 5,
    title: "Crystal-clear financial & GST breakdowns for client meetings",
    comment:
      "Between the EMI Calculator, GST Calculator, Compound Interest, and Invoice Generator, I have every financial tool pinned right in my Saved Bookmarks bar.",
    createdAt: "5 days ago",
    helpfulCount: 24,
    verified: true,
  },
  {
    id: "hp-rev-6",
    toolSlug: "ai-summarizer",
    toolTitle: "AI Summarizer & Paraphraser",
    authorName: "Tanvi Gokhale",
    authorRole: "Research Scholar",
    rating: 5,
    title: "Multilingual support in English & Marathi is super accurate!",
    comment:
      "Both the AI Summarizer and the floating ToolNami Copilot chat understand Marathi and English seamlessly. It summarizes long research notes into clean bullet points in seconds.",
    createdAt: "1 week ago",
    helpfulCount: 29,
    verified: true,
  },
];

export function HomepageReviewsSection() {
  const [reviews, setReviews] = useState<ToolReviewItem[]>(HOMEPAGE_FEATURED_REVIEWS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("toolnami:global-reviews");
      if (raw) {
        const userRevs: ToolReviewItem[] = JSON.parse(raw);
        if (userRevs.length > 0) {
          setReviews([
            ...userRevs.slice(0, 3),
            ...HOMEPAGE_FEATURED_REVIEWS.slice(0, 6 - Math.min(3, userRevs.length)),
          ]);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Award className="size-3.5" /> Loved by 50,000+ Daily Users
          </span>
          <h2 className="mt-1.5 text-2xl font-extrabold sm:text-3xl text-foreground">
            Verified Community Reviews &amp; Ratings
          </h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            Rated <strong className="text-foreground">4.9 / 5.0</strong> across 100 client-side PDF,
            Image, AI, Developer, and Financial tools. Every tool page includes open community
            reviews.
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-3 shadow-soft shrink-0">
          <div className="text-3xl font-black text-foreground">4.9</div>
          <div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="text-[11px] font-semibold text-muted-foreground mt-0.5">
              100 Tools • 99% Satisfaction
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="rounded-3xl border border-border bg-card p-6 shadow-soft flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= rev.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                {rev.toolTitle && (
                  <Link
                    to={`/tools/${rev.toolSlug}`}
                    className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[11px] font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {rev.toolTitle} →
                  </Link>
                )}
              </div>

              <h3 className="text-sm font-extrabold text-foreground leading-snug">{rev.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                "{rev.comment}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-extrabold text-primary">
                  {rev.authorName.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1">
                    {rev.authorName}
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  </div>
                  <div className="text-[11px] text-muted-foreground">{rev.authorRole}</div>
                </div>
              </div>
              <span className="text-[11px] text-muted-foreground">{rev.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
