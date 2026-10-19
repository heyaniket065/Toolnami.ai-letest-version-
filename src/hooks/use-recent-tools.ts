import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

const RECENT_STORAGE_KEY = "toolnami:recent-tools";
const GUEST_FAV_STORAGE_KEY = "toolnami:guest-favorites";
const SCRATCHPAD_STORAGE_KEY = "toolnami:scratchpad-notes";
const SYNC_EVENT = "toolnami:tools-storage-sync";

export type WorkflowStep = {
  slug: string;
  title: string;
  actionLabel: string;
};

export type WorkflowPipeline = {
  id: string;
  title: string;
  badge: string;
  description: string;
  accent: string;
  steps: WorkflowStep[];
};

export const WORKFLOW_PIPELINES: WorkflowPipeline[] = [
  {
    id: "pdf-publishing",
    title: "PDF Document Delivery Pipeline",
    badge: "Document Ops",
    description:
      "Combine multiple chapters or scans, shrink file size for email, and lock with a password.",
    accent: "from-blue-600/15 via-indigo-500/10 to-transparent border-blue-500/30",
    steps: [
      { slug: "pdf-merge", title: "PDF Merge", actionLabel: "1. Combine Files" },
      { slug: "pdf-compressor", title: "PDF Compressor", actionLabel: "2. Shrink Size" },
      { slug: "pdf-protect", title: "Protect PDF", actionLabel: "3. Add Password" },
    ],
  },
  {
    id: "web-image-prep",
    title: "Web Performance Image Pipeline",
    badge: "Frontend Assets",
    description:
      "Resize high-res graphics to exact dimensions, compress losslessly, and convert to next-gen WebP.",
    accent: "from-emerald-600/15 via-teal-500/10 to-transparent border-emerald-500/30",
    steps: [
      { slug: "image-resizer", title: "Image Resizer", actionLabel: "1. Resize Dimensions" },
      { slug: "image-compressor", title: "Image Compressor", actionLabel: "2. Optimize Bytes" },
      { slug: "image-to-webp", title: "Image to WebP", actionLabel: "3. Export WebP" },
    ],
  },
  {
    id: "seo-launchpad",
    title: "Full-Stack SEO Launch Checklist",
    badge: "Growth & SEO",
    description:
      "Craft high-CTR titles, generate HTML meta & Open Graph social cards, and build your XML sitemap.",
    accent: "from-amber-500/15 via-orange-500/10 to-transparent border-amber-500/30",
    steps: [
      { slug: "ai-title-generator", title: "AI Title Generator", actionLabel: "1. Craft Headline" },
      { slug: "meta-tag-generator", title: "Meta Tag Generator", actionLabel: "2. Meta Tags" },
      {
        slug: "open-graph-generator",
        title: "Open Graph Generator",
        actionLabel: "3. Social Card",
      },
      { slug: "sitemap-generator", title: "Sitemap Generator", actionLabel: "4. XML Sitemap" },
    ],
  },
  {
    id: "dev-data-pipeline",
    title: "Developer Data & API Inspector",
    badge: "Engineering",
    description:
      "Convert spreadsheet exports to JSON, format and validate payloads, and inspect JWT auth tokens.",
    accent: "from-violet-600/15 via-purple-500/10 to-transparent border-violet-500/30",
    steps: [
      { slug: "csv-to-json", title: "CSV to JSON", actionLabel: "1. Parse CSV" },
      { slug: "json-formatter", title: "JSON Formatter", actionLabel: "2. Validate & Prettify" },
      { slug: "jwt-decoder", title: "JWT Decoder", actionLabel: "3. Inspect Token" },
    ],
  },
];

export function findWorkflowForTool(slug: string): {
  pipeline: WorkflowPipeline;
  currentIndex: number;
  prevStep: WorkflowStep | null;
  nextStep: WorkflowStep | null;
} | null {
  for (const pipeline of WORKFLOW_PIPELINES) {
    const idx = pipeline.steps.findIndex((s) => s.slug === slug);
    if (idx !== -1) {
      return {
        pipeline,
        currentIndex: idx,
        prevStep: idx > 0 ? pipeline.steps[idx - 1] : null,
        nextStep: idx < pipeline.steps.length - 1 ? pipeline.steps[idx + 1] : null,
      };
    }
  }
  return null;
}

function readStorageArray(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeStorageArray(key: string, items: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT));
  } catch {
    // Ignore storage quota errors
  }
}

function readScratchpad(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(SCRATCHPAD_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function useRecentAndSavedTools() {
  const { user, favorites, isFavorite, toggleFavorite } = useAuth();
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [guestFavSlugs, setGuestFavSlugs] = useState<string[]>([]);
  const [scratchpad, setScratchpad] = useState<string>("");

  const syncFromStorage = useCallback(() => {
    setRecentSlugs(readStorageArray(RECENT_STORAGE_KEY));
    setGuestFavSlugs(readStorageArray(GUEST_FAV_STORAGE_KEY));
    setScratchpad(readScratchpad());
  }, []);

  useEffect(() => {
    syncFromStorage();
    const onStorage = () => syncFromStorage();
    window.addEventListener("storage", onStorage);
    window.addEventListener(SYNC_EVENT, onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(SYNC_EVENT, onStorage);
    };
  }, [syncFromStorage]);

  const recordToolVisit = useCallback((slug: string) => {
    if (!slug || typeof window === "undefined") return;
    const current = readStorageArray(RECENT_STORAGE_KEY);
    const updated = [slug, ...current.filter((s) => s !== slug)].slice(0, 8);
    writeStorageArray(RECENT_STORAGE_KEY, updated);
  }, []);

  const clearRecentTools = useCallback(() => {
    writeStorageArray(RECENT_STORAGE_KEY, []);
    toast.success("Cleared recently used tools");
  }, []);

  const updateScratchpad = useCallback((text: string) => {
    setScratchpad(text);
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(SCRATCHPAD_STORAGE_KEY, text);
      window.dispatchEvent(new CustomEvent(SYNC_EVENT));
    } catch {
      // Ignore storage quota errors
    }
  }, []);

  const isToolSaved = useCallback(
    (slug: string): boolean => {
      if (user) {
        return isFavorite(slug) || guestFavSlugs.includes(slug);
      }
      return guestFavSlugs.includes(slug);
    },
    [user, isFavorite, guestFavSlugs],
  );

  const toggleToolSaved = useCallback(
    async (slug: string, title: string) => {
      if (user) {
        await toggleFavorite(slug, title);
        return;
      }
      const current = readStorageArray(GUEST_FAV_STORAGE_KEY);
      if (current.includes(slug)) {
        const next = current.filter((s) => s !== slug);
        writeStorageArray(GUEST_FAV_STORAGE_KEY, next);
        toast.success(`Removed ${title} from saved tools`);
      } else {
        const next = [slug, ...current];
        writeStorageArray(GUEST_FAV_STORAGE_KEY, next);
        toast.success(`Saved ${title} to your quick-access bookmarks!`);
      }
    },
    [user, toggleFavorite],
  );

  const allSavedSlugs = Array.from(
    new Set([...favorites.map((f) => f.toolSlug), ...guestFavSlugs]),
  );

  const exportWorkspaceData = useCallback(() => {
    if (typeof window === "undefined") return;
    const payload = {
      app: "ToolNami",
      exportedAt: new Date().toISOString(),
      savedTools: allSavedSlugs,
      recentTools: recentSlugs,
      scratchpad: readScratchpad(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `toolnami-workspace-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported ToolNami workspace backup!");
  }, [allSavedSlugs, recentSlugs]);

  const importWorkspaceData = useCallback(
    (jsonText: string) => {
      try {
        const parsed = JSON.parse(jsonText);
        if (Array.isArray(parsed.savedTools)) {
          const merged = Array.from(
            new Set([
              ...parsed.savedTools.filter((s: unknown) => typeof s === "string"),
              ...readStorageArray(GUEST_FAV_STORAGE_KEY),
            ]),
          );
          writeStorageArray(GUEST_FAV_STORAGE_KEY, merged);
        }
        if (Array.isArray(parsed.recentTools)) {
          const mergedRecents = Array.from(
            new Set([
              ...parsed.recentTools.filter((s: unknown) => typeof s === "string"),
              ...readStorageArray(RECENT_STORAGE_KEY),
            ]),
          ).slice(0, 8);
          writeStorageArray(RECENT_STORAGE_KEY, mergedRecents);
        }
        if (typeof parsed.scratchpad === "string") {
          updateScratchpad(parsed.scratchpad);
        }
        toast.success("Workspace bookmarks, history, and scratchpad restored!");
      } catch {
        toast.error("Invalid workspace backup JSON file.");
      }
    },
    [updateScratchpad],
  );

  return {
    recentSlugs,
    savedSlugs: allSavedSlugs,
    scratchpad,
    recordToolVisit,
    clearRecentTools,
    updateScratchpad,
    isToolSaved,
    toggleToolSaved,
    exportWorkspaceData,
    importWorkspaceData,
  };
}
