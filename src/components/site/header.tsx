import { Link } from "@tanstack/react-router";
import {
  Calculator,
  ChevronDown,
  Code,
  FileText,
  Heart,
  Image,
  Menu,
  Search as SearchIcon,
  Sparkles,
  Type,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Logo } from "./logo";
import { SearchDialog } from "./search-dialog";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { useRecentAndSavedTools } from "@/hooks/use-recent-tools";
import { CATEGORY_TOOL_COUNTS, DEFAULT_CATEGORIES } from "@/lib/tools-data";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Tools", to: "/tools" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

const CATEGORY_ICONS: Record<string, typeof FileText> = {
  pdf: FileText,
  image: Image,
  text: Type,
  developer: Code,
  seo: SearchIcon,
  calculator: Calculator,
  utility: Wrench,
  ai: Sparkles,
};

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const catMenuRef = useRef<HTMLDivElement>(null);
  const { savedSlugs } = useRecentAndSavedTools();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (catMenuRef.current && !catMenuRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl shadow-soft"
          : "border-b border-transparent bg-background/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-primary bg-primary-soft" }}
            className="relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-primary hover:bg-primary-soft/70"
          >
            Home
          </Link>

          <Link
            to="/tools"
            search={{ page: 1 }}
            activeProps={{ className: "text-primary bg-primary-soft" }}
            className="relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-primary hover:bg-primary-soft/70"
          >
            All Tools
          </Link>

          {/* Categories Mega-Menu Dropdown */}
          <div ref={catMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setCatOpen((v) => !v)}
              aria-expanded={catOpen}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                catOpen
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:bg-primary-soft/70 hover:text-primary"
              }`}
            >
              Categories
              <ChevronDown
                className={`size-3.5 transition-transform duration-200 ${
                  catOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {catOpen ? (
              <div className="absolute left-1/2 top-full mt-2.5 w-[540px] -translate-x-1/2 rounded-3xl border border-border bg-card/98 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                <div className="mb-3 flex items-center justify-between px-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Browse by Category ({CATEGORY_TOOL_COUNTS.all || 96} Tools)
                  </span>
                  <Link
                    to="/tools"
                    search={{ page: 1 }}
                    onClick={() => setCatOpen(false)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View full directory →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {DEFAULT_CATEGORIES.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.id] || Wrench;
                    const count = CATEGORY_TOOL_COUNTS[cat.id] ?? 0;
                    return (
                      <Link
                        key={cat.id}
                        to="/tools"
                        search={{ cat: cat.id, page: 1 }}
                        onClick={() => setCatOpen(false)}
                        className="group flex items-start gap-3 rounded-2xl p-2.5 transition-colors hover:bg-primary-soft/60"
                      >
                        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary-soft text-primary transition-transform group-hover:scale-105">
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                              {cat.name}
                            </span>
                            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                              {count}
                            </span>
                          </div>
                          <p className="line-clamp-1 text-xs text-muted-foreground mt-0.5">
                            {cat.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <Link
            to="/about"
            activeProps={{ className: "text-primary bg-primary-soft" }}
            className="relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-primary hover:bg-primary-soft/70"
          >
            About
          </Link>

          <Link
            to="/contact"
            activeProps={{ className: "text-primary bg-primary-soft" }}
            className="relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-primary hover:bg-primary-soft/70"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <SearchDialog />
          {savedSlugs.length > 0 ? (
            <Link
              to="/tools"
              search={{ saved: true, page: 1 }}
              title="Your saved tools"
              className="hidden sm:inline-flex h-10 items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-all hover:bg-rose-500/20"
            >
              <Heart className="size-3.5 fill-rose-500 text-rose-500" />
              <span>{savedSlugs.length}</span>
            </Link>
          ) : null}
          <ThemeToggle />
          <Link
            to="/tools"
            search={{ page: 1 }}
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all duration-300 hover:shadow-lift hover:brightness-110 active:scale-95 lg:inline-flex"
          >
            Explore Tools
          </Link>
          <UserMenu />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:text-primary md:hidden"
          >
            {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-border bg-background/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          open ? "max-h-[32rem] border-b" : "max-h-0"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4" aria-label="Mobile">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-primary bg-primary-soft" }}
              className="rounded-xl px-4 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-primary-soft hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <div className="my-2 border-t border-border pt-2">
            <p className="px-4 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Quick Categories
            </p>
            <div className="mt-1 grid grid-cols-2 gap-1.5 px-2">
              {DEFAULT_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  to="/tools"
                  search={{ cat: cat.id, page: 1 }}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-3 py-2 text-xs font-semibold text-foreground hover:border-primary/40 hover:text-primary"
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {CATEGORY_TOOL_COUNTS[cat.id] ?? 0}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <Link
            to="/tools"
            search={{ page: 1 }}
            onClick={() => setOpen(false)}
            className="mt-2 rounded-xl bg-primary px-4 py-3 text-center text-base font-semibold text-primary-foreground"
          >
            Explore All {CATEGORY_TOOL_COUNTS.all || 96} Tools
          </Link>
        </nav>
      </div>
    </header>
  );
}
