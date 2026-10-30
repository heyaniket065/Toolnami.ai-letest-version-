import { useLocation } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";

import { getToolBySlug } from "@/lib/complete-tools";
import { SITE_GLOBAL_KEYWORDS } from "@/lib/tool-seo-keywords";

const SITE_BASE_URL = "https://toolnami.ai.studio";
const DEFAULT_ROBOTS =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

interface PageSeoMeta {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogImage: string;
}

const STATIC_PAGE_META: Record<string, { title: string; description: string; keywords?: string }> =
  {
    "/": {
      title: "ToolNami — 100 Free Online Tools for PDF, Image, Text, SEO & AI",
      description:
        "ToolNami is a fast, clutter-free platform of 100+ free online tools for PDF, image, text, developer, calculator, SEO, and AI workflows.",
      keywords: SITE_GLOBAL_KEYWORDS.join(", "),
    },
    "/tools": {
      title: "All 100 Online Tools Directory — ToolNami",
      description:
        "Browse the full ToolNami directory of 100 free online tools: PDF, image, text, SEO, calculators, AI, and developer utilities.",
      keywords: [
        ...SITE_GLOBAL_KEYWORDS,
        "online tools directory",
        "all in one web utilities",
        "free pdf image text tools",
      ].join(", "),
    },
    "/about": {
      title: "About ToolNami — Fast, Free Online Tools by Aniket Bhalerao",
      description:
        "Learn the story behind ToolNami, created by Aniket Bhalerao (LuminaLM) to make everyday online PDF, image, text, and developer tools fast and free.",
      keywords: "about toolnami, aniket bhalerao, luminalm, free online tools platform",
    },
    "/contact": {
      title: "Contact ToolNami — Support, Feedback & Partnerships",
      description:
        "Get in touch with the ToolNami team for support, bug reports, tool requests, or partnership inquiries.",
      keywords: "contact toolnami, aniket bhalerao contact, luminalm support, toolnami feedback",
    },
    "/privacy-policy": {
      title: "Privacy Policy — ToolNami",
      description:
        "ToolNami Privacy Policy: Learn how we protect your privacy with client-side browser processing, transparent analytics, and zero file storage.",
      keywords: "toolnami privacy policy, client side tools privacy, secure online tools",
    },
    "/terms": {
      title: "Terms & Conditions — ToolNami",
      description:
        "ToolNami Terms & Conditions: Understand acceptable use, intellectual property, service availability, and limitations of liability.",
      keywords: "toolnami terms and conditions, terms of service, free online tools terms",
    },
    "/auth": {
      title: "Sign In or Create Your ToolNami Account — ToolNami",
      description:
        "Log in or sign up for ToolNami to save favorite tools, sync your preferences, and access your workspace across devices.",
      keywords: "toolnami login, toolnami sign up, save favorite online tools",
    },
    "/reset-password": {
      title: "Reset Your Password — ToolNami",
      description:
        "Choose a new password for your ToolNami account and get straight back to your favorite online tools.",
      keywords: "reset toolnami password, account recovery",
    },
    "/dashboard": {
      title: "Your ToolNami Dashboard — Profile & Saved Tools",
      description:
        "Manage your ToolNami profile, account settings, saved favorite tools, and recent activity in one place.",
      keywords: "toolnami dashboard, saved tools, favorite utilities",
    },
  };

function buildCanonicalUrl(pathname: string): string {
  if (!pathname || pathname === "/") {
    return `${SITE_BASE_URL}/`;
  }
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const clean = normalized.replace(/\/+$/, "");
  return clean ? `${SITE_BASE_URL}${clean}` : `${SITE_BASE_URL}/`;
}

function resolvePageSeo(pathname: string): PageSeoMeta {
  const cleanPath = !pathname || pathname === "/" ? "/" : pathname.replace(/\/+$/, "") || "/";
  const canonicalUrl = buildCanonicalUrl(cleanPath);

  if (cleanPath.startsWith("/tools/")) {
    const slug = cleanPath.replace("/tools/", "").split("/")[0] ?? "";
    const tool = getToolBySlug(slug);
    if (tool) {
      return {
        title: tool.seoTitle || `${tool.title} — Free Online Tool | ToolNami`,
        description: tool.seoDescription || tool.summary,
        keywords: tool.keywords.join(", "),
        canonicalUrl,
        ogImage: tool.image.startsWith("http") ? tool.image : `${SITE_BASE_URL}${tool.image}`,
      };
    }
  }

  const staticMeta = STATIC_PAGE_META[cleanPath] ?? STATIC_PAGE_META["/"]!;
  return {
    title: staticMeta.title,
    description: staticMeta.description,
    keywords: staticMeta.keywords || SITE_GLOBAL_KEYWORDS.join(", "),
    canonicalUrl,
    ogImage: `${SITE_BASE_URL}/assets/tools/3d-pdf-compressor.png`,
  };
}

function upsertMetaTag(attrName: "name" | "property", attrValue: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function Helmet() {
  const location = useLocation();
  const seo = useMemo(() => resolvePageSeo(location.pathname), [location.pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.title = seo.title;

    upsertMetaTag("name", "description", seo.description);
    upsertMetaTag("name", "keywords", seo.keywords);
    upsertMetaTag("name", "robots", DEFAULT_ROBOTS);
    upsertMetaTag("name", "googlebot", DEFAULT_ROBOTS);
    upsertMetaTag("property", "og:title", seo.title);
    upsertMetaTag("property", "og:description", seo.description);
    upsertMetaTag("property", "og:url", seo.canonicalUrl);
    upsertMetaTag("property", "og:image", seo.ogImage);
    upsertMetaTag("name", "twitter:title", seo.title);
    upsertMetaTag("name", "twitter:description", seo.description);
    upsertMetaTag("name", "twitter:image", seo.ogImage);

    // Ensure exactly one self-referencing canonical link in document.head
    const existingCanonicals = Array.from(
      document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]'),
    );
    if (existingCanonicals.length === 0) {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", seo.canonicalUrl);
      document.head.appendChild(link);
    } else {
      existingCanonicals[0]!.setAttribute("href", seo.canonicalUrl);
      for (let i = 1; i < existingCanonicals.length; i++) {
        existingCanonicals[i]!.remove();
      }
    }
  }, [seo]);

  return null;
}
