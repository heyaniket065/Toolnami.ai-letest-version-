export type ToolFaq = { q: string; a: string };

export function toolJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  faqs: ToolFaq[];
}) {
  return JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: `${opts.name} — ToolNami`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any (browser-based)",
      url: opts.url,
      description: opts.description,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@type": "Organization", name: "ToolNami" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: opts.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ]);
}
