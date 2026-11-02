import { Link } from "@tanstack/react-router";
import { ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";

const CONSENT_STORAGE_KEY = "toolnami-cookie-consent-v1";

export function WelcomeModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const existing = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!existing) {
        setVisible(true);
      }
    } catch {
      // Ignore storage access errors in restricted frames
    }
  }, []);

  const handleConsent = (choice: "all" | "essential") => {
    try {
      localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({ choice, timestamp: new Date().toISOString() }),
      );
      localStorage.setItem("toolnami-welcome-dismissed", "1");
    } catch {
      // Ignore storage errors
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie and privacy consent notice"
      className="pointer-events-none fixed right-0 bottom-0 left-0 z-40 p-3 sm:p-4"
    >
      <div className="pointer-events-auto mx-auto flex w-full max-w-5xl flex-col gap-4 rounded-2xl border border-border bg-card/95 p-4 shadow-lift backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <ShieldCheck className="size-5" />
          </span>
          <div className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
            <p className="font-semibold text-foreground">
              Privacy &amp; Cookie Notice (GDPR / CCPA Compliant)
            </p>
            <p className="mt-0.5">
              ToolNami processes your files locally in your browser. We and our partners (such as
              Google Analytics &amp; Google AdSense) use cookies to remember preferences, analyze
              traffic, and serve relevant ads. Read our{" "}
              <Link
                to="/privacy-policy"
                className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                to="/terms"
                className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
              >
                Terms &amp; Disclaimer
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleConsent("essential")}
            className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-background px-3.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary cursor-pointer"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={() => handleConsent("all")}
            className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-soft transition-all hover:brightness-110 cursor-pointer"
          >
            Accept All Cookies
          </button>
          <button
            type="button"
            onClick={() => handleConsent("essential")}
            aria-label="Dismiss cookie notice"
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
