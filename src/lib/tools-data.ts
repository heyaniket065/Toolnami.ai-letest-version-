import { supabase } from "@/integrations/supabase/client";
import { COMPLETE_TOOLS } from "./complete-tools";

export type ToolCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
};

export type Tool = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  category_id: string | null;
  featured: boolean;
  views: number;
};

export type ToolSortOption = "popular" | "featured" | "az";

export const TOOLS_PER_PAGE = 12;

export const DEFAULT_CATEGORIES: ToolCategory[] = [
  {
    id: "pdf",
    name: "PDF Tools",
    slug: "pdf",
    icon: "FileText",
    description: "Compress, merge, split, unlock, and convert PDF documents",
  },
  {
    id: "image",
    name: "Image Tools",
    slug: "image",
    icon: "Image",
    description: "Compress, resize, upscale, convert, and edit images",
  },
  {
    id: "text",
    name: "Text Tools",
    slug: "text",
    icon: "Type",
    description: "Word counters, diff checkers, case converters, and formatters",
  },
  {
    id: "developer",
    name: "Developer Tools",
    slug: "developer",
    icon: "Code",
    description: "JSON, CSV, Markdown, JWT, Cron, UUID, and code formatters",
  },
  {
    id: "seo",
    name: "SEO Tools",
    slug: "seo",
    icon: "Search",
    description: "Meta tags, Open Graph, sitemaps, and robots.txt generators",
  },
  {
    id: "calculator",
    name: "Calculators",
    slug: "calculator",
    icon: "Calculator",
    description: "EMI, salary, compound interest, GST, BMI, and invoice tools",
  },
  {
    id: "utility",
    name: "Utility Tools",
    slug: "utility",
    icon: "Wrench",
    description: "Pomodoro timer, stopwatch, speed test, unit, and currency tools",
  },
  {
    id: "ai",
    name: "AI Tools",
    slug: "ai",
    icon: "Sparkles",
    description: "AI blog, content, headline, hashtag, and caption generation",
  },
];

export const ALL_CATALOGUE_TOOLS: Tool[] = COMPLETE_TOOLS.map((t, index) => ({
  id: t.slug,
  title: t.title,
  slug: t.slug,
  description: t.summary,
  thumbnail_url: t.image,
  category_id: t.category,
  featured: t.isFeatured || t.badge.tone === "featured" || index < 12,
  views: t.baseUses,
}));

export const CATEGORY_TOOL_COUNTS: Record<string, number> = ALL_CATALOGUE_TOOLS.reduce(
  (acc, tool) => {
    const cat = tool.category_id || "other";
    acc[cat] = (acc[cat] || 0) + 1;
    acc.all = (acc.all || 0) + 1;
    return acc;
  },
  { all: 0 } as Record<string, number>,
);

export const categoriesQuery = {
  queryKey: ["tool-categories"],
  queryFn: async (): Promise<ToolCategory[]> => {
    return DEFAULT_CATEGORIES;
  },
  staleTime: 5 * 60 * 1000,
};

export const featuredToolsQuery = {
  queryKey: ["tools", "featured"],
  queryFn: async (): Promise<Tool[]> => {
    return ALL_CATALOGUE_TOOLS.filter((t) => t.featured).slice(0, 6);
  },
  staleTime: 60 * 1000,
};

export function toolsPageQuery(params: {
  search: string;
  categoryId: string | null;
  page: number;
  sort?: ToolSortOption;
  onlySlugs?: string[] | null;
}) {
  const { search, categoryId, page, sort = "featured", onlySlugs = null } = params;
  return {
    queryKey: ["tools", "list", search, categoryId, page, sort, onlySlugs?.join(",") ?? "all"],
    queryFn: async (): Promise<{ tools: Tool[]; total: number }> => {
      const targetCat = categoryId
        ? categoryId
            .toLowerCase()
            .replace(/^cat-/, "")
            .replace(/-tools$/, "")
            .trim()
        : null;

      let filtered = [...ALL_CATALOGUE_TOOLS];

      if (onlySlugs) {
        const set = new Set(onlySlugs);
        filtered = filtered.filter((t) => set.has(t.slug));
      }

      if (targetCat) {
        filtered = filtered.filter((t) => {
          const tCat = (t.category_id || "")
            .toLowerCase()
            .replace(/^cat-/, "")
            .replace(/-tools$/, "");
          return tCat === targetCat;
        });
      }

      if (search.trim()) {
        const s = search.trim().toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.title.toLowerCase().includes(s) ||
            t.slug.toLowerCase().includes(s) ||
            (t.description && t.description.toLowerCase().includes(s)),
        );
      }

      filtered.sort((a, b) => {
        if (sort === "popular") {
          return (b.views || 0) - (a.views || 0);
        }
        if (sort === "az") {
          return a.title.localeCompare(b.title);
        }
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.title.localeCompare(b.title);
      });

      const total = filtered.length;
      const from = (page - 1) * TOOLS_PER_PAGE;
      const paginated = filtered.slice(from, from + TOOLS_PER_PAGE);

      return { tools: paginated, total };
    },
    staleTime: 30 * 1000,
  };
}

export function pageContentQuery(pageName: string) {
  return {
    queryKey: ["page-content", pageName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_content")
        .select("page_name, title, content, updated_at")
        .eq("page_name", pageName)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  };
}
