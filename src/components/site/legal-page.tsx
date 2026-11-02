import { ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/site/reveal";
import { FormattedMarkdown } from "@/components/ui/formatted-markdown";

export function LegalPage({
  fallbackTitle,
  fallbackBody,
}: {
  pageName: string;
  fallbackTitle: string;
  fallbackBody: string;
}) {
  const title = fallbackTitle || "Legal Document";

  return (
    <div className="page-enter">
      <section className="surface-hero border-b border-border">
        <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary">
            <ShieldCheck className="size-3.5" /> Official Legal &amp; Policy Notice
          </span>
          <h1 className="mt-5 text-3xl font-bold sm:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated October 2026 · Compliant with Google AdSense Program Policies, GDPR &amp;
            CCPA Standards
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <Reveal>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-10">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <FormattedMarkdown content={fallbackBody} />
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
