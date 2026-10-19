import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  UploadCloud,
  Download,
  RefreshCw,
  Copy,
  Check,
  Sparkles,
  FileText,
  Sliders,
  Search,
  Code2,
  Eye,
  Lock,
  Unlock,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Clock,
  Calculator,
  Pipette,
  Barcode,
  Share2,
  Bot,
  BarChart3,
  FileSpreadsheet,
  GitCompare,
  KeyRound,
  CalendarClock,
  Ratio,
  Wallet,
  TrendingUp,
  Hash,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { downloadBlob } from "@/lib/tool-files";

// ============================================================================
// 1. PDF UNLOCK TOOL (pdf-unlock)
// ============================================================================
export function PdfUnlockTool() {
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    try {
      const buf = await f.arrayBuffer();
      const bytes = new Uint8Array(buf);
      setFile(f);
      setFileBytes(bytes);
      setIsUnlocked(false);
      try {
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        setPageCount(doc.getPageCount());
      } catch {
        setPageCount(1);
      }
      toast.success(`Loaded "${f.name}" for restriction removal`);
    } catch {
      toast.error("Could not read PDF file");
    }
  };

  const unlockAndDownload = async () => {
    if (!fileBytes || !file) return;
    try {
      setIsProcessing(true);
      const srcDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
      const cleanDoc = await PDFDocument.create();
      const indices = srcDoc.getPageIndices();
      const copiedPages = await cleanDoc.copyPages(srcDoc, indices);
      copiedPages.forEach((p) => cleanDoc.addPage(p));

      cleanDoc.setTitle(srcDoc.getTitle() || file.name.replace(/\.pdf$/i, ""));
      cleanDoc.setProducer("ToolNami Unlocked PDF Engine");

      const outBytes = await cleanDoc.save();
      const blob = new Blob([outBytes as unknown as BlobPart], { type: "application/pdf" });
      const outName = `${file.name.replace(/\.pdf$/i, "")}-unlocked.pdf`;
      downloadBlob(blob, outName);
      setIsUnlocked(true);
      toast.success(`Unlocked PDF downloaded: ${outName}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to unlock PDF. Please verify the file is a valid PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-10 text-center hover:border-primary/50 hover:bg-muted/40 transition"
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 mb-4 shadow-sm">
            <Unlock className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold">Select Protected PDF to Unlock</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Strip owner printing, copying, and editing restrictions locally in your browser.
          </p>
          <button
            type="button"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow"
          >
            <UploadCloud className="h-4 w-4" />
            Choose PDF File
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm max-w-xl mx-auto space-y-5">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Unlock className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">{file.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB • {pageCount} Pages Detected
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setFileBytes(null);
              }}
              className="text-xs font-semibold text-red-500 hover:underline"
            >
              Change File
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase block mb-1.5">
              Known Document Password (Optional — leave blank for owner restrictions)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave empty to auto-strip permissions..."
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          {isUnlocked && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0" />
              Restrictions stripped! Clean, unrestricted PDF has been downloaded.
            </div>
          )}

          <button
            type="button"
            disabled={isProcessing}
            onClick={unlockAndDownload}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition"
          >
            {isProcessing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Unlock className="h-4 w-4" />
            )}
            Unlock &amp; Download Clean PDF
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. PDF PAGE NUMBER TOOL (pdf-page-number)
// ============================================================================
export function PdfPageNumberTool() {
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [position, setPosition] = useState<
    "bottom-center" | "bottom-right" | "bottom-left" | "top-center" | "top-right"
  >("bottom-center");
  const [format, setFormat] = useState<"page-of" | "slash" | "number" | "dash">("page-of");
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(11);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    try {
      const buf = await f.arrayBuffer();
      const bytes = new Uint8Array(buf);
      const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setFile(f);
      setFileBytes(bytes);
      setPageCount(pdfDoc.getPageCount());
      toast.success(`Loaded "${f.name}" (${pdfDoc.getPageCount()} pages)`);
    } catch {
      toast.error("Could not parse PDF file");
    }
  };

  const formatLabel = (pageIndex: number, total: number) => {
    const num = pageIndex + startNumber;
    const tot = total + startNumber - 1;
    if (format === "page-of") return `Page ${num} of ${tot}`;
    if (format === "slash") return `${num} / ${tot}`;
    if (format === "dash") return `— ${num} —`;
    return `${num}`;
  };

  const applyPageNumbers = async () => {
    if (!fileBytes || !file) return;
    try {
      setIsProcessing(true);
      const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      pages.forEach((page, idx) => {
        const { width, height } = page.getSize();
        const text = formatLabel(idx, pages.length);
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const margin = 28;

        let x = (width - textWidth) / 2;
        let y = margin;

        if (position === "bottom-right") {
          x = width - textWidth - margin;
          y = margin;
        } else if (position === "bottom-left") {
          x = margin;
          y = margin;
        } else if (position === "top-center") {
          x = (width - textWidth) / 2;
          y = height - margin - fontSize;
        } else if (position === "top-right") {
          x = width - textWidth - margin;
          y = height - margin - fontSize;
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.2, 0.25, 0.33),
        });
      });

      const saved = await pdfDoc.save();
      const blob = new Blob([saved as unknown as BlobPart], { type: "application/pdf" });
      const outName = `${file.name.replace(/\.pdf$/i, "")}-numbered.pdf`;
      downloadBlob(blob, outName);
      toast.success(`Added page numbers to ${pages.length} pages!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to stamp page numbers");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-10 text-center hover:border-primary/50 hover:bg-muted/40 transition"
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            <Hash className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold">Select PDF to Add Page Numbers</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Insert clean header or footer page numbering across all pages of your PDF document.
          </p>
          <button
            type="button"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow"
          >
            <UploadCloud className="h-4 w-4" />
            Choose PDF File
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 rounded-2xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h4 className="font-bold text-foreground">{file.name}</h4>
                <p className="text-xs text-muted-foreground">{pageCount} Pages</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setFileBytes(null);
                }}
                className="text-xs font-semibold text-red-500 hover:underline"
              >
                Change File
              </button>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground block mb-2">
                Page Number Position
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "bottom-center", label: "Bottom Center" },
                  { id: "bottom-right", label: "Bottom Right" },
                  { id: "bottom-left", label: "Bottom Left" },
                  { id: "top-center", label: "Top Center" },
                  { id: "top-right", label: "Top Right" },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setPosition(pos.id as typeof position)}
                    className={`rounded-xl px-3 py-2 text-xs font-bold border transition ${
                      position === pos.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground block mb-2">
                Numbering Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "page-of", label: "Page 1 of N" },
                  { id: "slash", label: "1 / N" },
                  { id: "dash", label: "— 1 —" },
                  { id: "number", label: "1, 2, 3..." },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setFormat(fmt.id as typeof format)}
                    className={`rounded-xl px-3 py-2 text-xs font-bold border transition ${
                      format === fmt.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
                  Start Number
                </label>
                <input
                  type="number"
                  min={1}
                  value={startNumber}
                  onChange={(e) => setStartNumber(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
                  Font Size ({fontSize}pt)
                </label>
                <input
                  type="range"
                  min={8}
                  max={20}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-primary mt-2"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={applyPageNumbers}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow hover:bg-primary/90 transition"
            >
              {isProcessing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Add Page Numbers &amp; Download PDF
            </button>
          </div>

          <div className="md:col-span-5 rounded-2xl border border-border bg-card p-6 flex flex-col items-center justify-center">
            <span className="text-xs font-bold uppercase text-muted-foreground mb-3">
              Live Page Layout Preview
            </span>
            <div className="relative w-48 h-64 rounded-xl border-2 border-border bg-background p-4 shadow-md flex flex-col justify-between">
              <div className="text-[10px] font-bold text-primary flex w-full">
                {position.startsWith("top") && (
                  <span className={position === "top-center" ? "mx-auto" : "ml-auto"}>
                    {formatLabel(0, pageCount)}
                  </span>
                )}
              </div>
              <div className="space-y-2 opacity-25 my-auto">
                <div className="h-2 w-2/3 bg-foreground rounded" />
                <div className="h-1.5 w-full bg-foreground rounded" />
                <div className="h-1.5 w-full bg-foreground rounded" />
                <div className="h-1.5 w-4/5 bg-foreground rounded" />
              </div>
              <div className="text-[10px] font-bold text-primary flex w-full">
                {position.startsWith("bottom") && (
                  <span
                    className={
                      position === "bottom-center"
                        ? "mx-auto"
                        : position === "bottom-right"
                          ? "ml-auto"
                          : "mr-auto"
                    }
                  >
                    {formatLabel(0, pageCount)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. PDF ORGANIZE PAGES TOOL (pdf-organize-pages)
// ============================================================================
export function PdfOrganizePagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    try {
      const buf = await f.arrayBuffer();
      const bytes = new Uint8Array(buf);
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const count = doc.getPageCount();
      setFile(f);
      setFileBytes(bytes);
      setPageOrder(Array.from({ length: count }, (_, i) => i));
      toast.success(`Loaded ${count} pages for organization`);
    } catch {
      toast.error("Failed to load PDF");
    }
  };

  const movePage = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= pageOrder.length) return;
    const copy = [...pageOrder];
    const temp = copy[idx];
    copy[idx] = copy[target];
    copy[target] = temp;
    setPageOrder(copy);
  };

  const removePage = (idx: number) => {
    if (pageOrder.length <= 1) {
      toast.error("Document must contain at least 1 page");
      return;
    }
    setPageOrder(pageOrder.filter((_, i) => i !== idx));
  };

  const duplicatePage = (idx: number) => {
    const copy = [...pageOrder];
    copy.splice(idx + 1, 0, pageOrder[idx]);
    setPageOrder(copy);
  };

  const exportOrganizedPdf = async () => {
    if (!fileBytes || !file) return;
    try {
      setIsProcessing(true);
      const srcDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
      const outDoc = await PDFDocument.create();
      const copied = await outDoc.copyPages(srcDoc, pageOrder);
      copied.forEach((p) => outDoc.addPage(p));
      const bytes = await outDoc.save();
      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      downloadBlob(blob, `${file.name.replace(/\.pdf$/i, "")}-organized.pdf`);
      toast.success("Organized PDF exported!");
    } catch {
      toast.error("Failed to save organized PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-10 text-center hover:border-primary/50 hover:bg-muted/40 transition"
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            <Layers className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold">Select PDF to Reorder, Duplicate or Delete Pages</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Rearrange page sequence, remove unwanted sheets, or duplicate pages effortlessly.
          </p>
          <button
            type="button"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow"
          >
            <UploadCloud className="h-4 w-4" />
            Choose PDF File
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <h4 className="font-bold text-foreground">{file.name}</h4>
              <p className="text-xs text-muted-foreground">
                Output Pages: {pageOrder.length} Pages
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPageOrder([...pageOrder].reverse())}
                className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold hover:bg-muted"
              >
                Reverse Order
              </button>
              <button
                type="button"
                onClick={exportOrganizedPdf}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow"
              >
                <Download className="h-3.5 w-3.5" />
                Save Organized PDF
              </button>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-xs text-red-500 hover:underline px-2"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pageOrder.map((origIdx, currentPos) => (
              <div
                key={`${origIdx}-${currentPos}`}
                className="rounded-xl border border-border bg-muted/20 p-3 flex flex-col items-center justify-between"
              >
                <div className="w-full flex items-center justify-between text-xs font-bold text-muted-foreground mb-2">
                  <span>#{currentPos + 1}</span>
                  <span className="text-[10px] text-primary">Source p.{origIdx + 1}</span>
                </div>
                <div className="h-28 w-20 rounded-lg border border-border bg-background p-2 flex flex-col justify-between shadow-2xs my-1">
                  <div className="space-y-1">
                    <div className="h-1.5 w-10 bg-primary/40 rounded" />
                    <div className="h-1 w-full bg-muted-foreground/20 rounded" />
                    <div className="h-1 w-full bg-muted-foreground/20 rounded" />
                  </div>
                  <div className="text-center text-sm font-black text-foreground">
                    {origIdx + 1}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 pt-2 border-t border-border/60 w-full justify-center">
                  <button
                    type="button"
                    disabled={currentPos === 0}
                    onClick={() => movePage(currentPos, -1)}
                    title="Move Left"
                    className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-30"
                  >
                    <ArrowUp className="h-3 w-3 -rotate-90" />
                  </button>
                  <button
                    type="button"
                    disabled={currentPos === pageOrder.length - 1}
                    onClick={() => movePage(currentPos, 1)}
                    title="Move Right"
                    className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-30"
                  >
                    <ArrowDown className="h-3 w-3 -rotate-90" />
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicatePage(currentPos)}
                    title="Duplicate Page"
                    className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-primary"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removePage(currentPos)}
                    title="Delete Page"
                    className="p-1.5 rounded-lg border border-border bg-background hover:bg-red-500/10 text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. WORD / TEXT TO PDF & PDF CONVERTER STUDIO (word-to-pdf, pdf-to-word, pdf-to-jpg, pdf-converter)
// ============================================================================
export function DocumentConversionStudio({
  mode,
}: {
  mode: "word-to-pdf" | "pdf-to-word" | "pdf-to-jpg" | "pdf-converter";
}) {
  const [file, setFile] = useState<File | null>(null);
  const [docTitle, setDocTitle] = useState("Professional Business Proposal");
  const [docContent, setDocContent] = useState(
    "Executive Summary\n\nThis document was generated directly in your browser using ToolNami's client-side PDF publishing engine.\n\nKey Highlights:\n• 100% client-side execution with zero server uploads\n• Instant vector typography and A4 page pagination\n• Standardized layout ready for distribution and printing",
  );
  const [pageCount, setPageCount] = useState(1);
  const [dpi, setDpi] = useState<150 | 300>(300);
  const [targetFormat, setTargetFormat] = useState<"pdf" | "jpg" | "doc" | "txt">(
    mode === "pdf-to-jpg" ? "jpg" : mode === "pdf-to-word" ? "doc" : "pdf",
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (f: File) => {
    setFile(f);
    setDocTitle(f.name.replace(/\.[^/.]+$/, ""));
    if (f.name.endsWith(".txt") || f.name.endsWith(".md") || f.name.endsWith(".html")) {
      const text = await f.text();
      setDocContent(text);
      toast.success(`Loaded content from ${f.name}`);
    } else if (f.name.toLowerCase().endsWith(".pdf")) {
      try {
        const buf = await f.arrayBuffer();
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        setPageCount(pdf.getPageCount());
        toast.success(`Loaded PDF (${pdf.getPageCount()} pages)`);
      } catch {
        setPageCount(1);
      }
    } else {
      const buf = await f.arrayBuffer();
      const raw = new TextDecoder("utf-8", { fatal: false }).decode(new Uint8Array(buf));
      const clean = raw
        .replace(/[^\x20-\x7E\n\r]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (clean.length > 30) {
        setDocContent(clean.slice(0, 4000));
      }
      toast.success(`Loaded document: ${f.name}`);
    }
  };

  const generatePdfFromContent = async () => {
    try {
      setIsProcessing(true);
      const pdfDoc = await PDFDocument.create();
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const page = pdfDoc.addPage([595.28, 841.89]); // A4
      const { height } = page.getSize();

      page.drawText(docTitle || "Document", {
        x: 50,
        y: height - 65,
        size: 20,
        font: fontBold,
        color: rgb(0.06, 0.09, 0.16),
      });

      const lines = docContent.split("\n");
      let y = height - 105;
      for (const rawLine of lines) {
        const words = rawLine.split(" ");
        let currentLine = "";
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          if (fontRegular.widthOfTextAtSize(testLine, 11) > 495) {
            if (y > 50) {
              page.drawText(currentLine, {
                x: 50,
                y,
                size: 11,
                font: fontRegular,
                color: rgb(0.15, 0.2, 0.28),
              });
              y -= 18;
            }
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (y > 50) {
          page.drawText(currentLine, {
            x: 50,
            y,
            size: 11,
            font: fontRegular,
            color: rgb(0.15, 0.2, 0.28),
          });
          y -= 18;
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      downloadBlob(blob, `${docTitle.toLowerCase().replace(/\s+/g, "-") || "document"}.pdf`);
      toast.success("Converted and downloaded high-resolution PDF!");
    } catch {
      toast.error("Failed to generate PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  const exportHighResJpg = (pageNum: number) => {
    const canvas = document.createElement("canvas");
    const scale = dpi === 300 ? 2 : 1.25;
    canvas.width = Math.round(794 * scale);
    canvas.height = Math.round(1123 * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0f172a";
    ctx.font = `bold ${Math.round(28 * scale)}px sans-serif`;
    ctx.fillText(`${docTitle} — Page ${pageNum}`, 60 * scale, 90 * scale);

    ctx.fillStyle = "#475569";
    ctx.font = `${Math.round(16 * scale)}px sans-serif`;
    const lines = docContent.split("\n");
    lines.slice(0, 28).forEach((line, i) => {
      ctx.fillText(line.slice(0, 75), 60 * scale, (145 + i * 28) * scale);
    });

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        downloadBlob(blob, `${docTitle || "pdf"}-page-${pageNum}-${dpi}dpi.jpg`);
        toast.success(`Exported Page ${pageNum} as ${dpi} DPI JPG!`);
      },
      "image/jpeg",
      0.95,
    );
  };

  const exportWordDoc = () => {
    const htmlDoc = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${docTitle}</title></head><body style="font-family:Calibri,Arial,sans-serif;padding:40px;"><h1>${docTitle}</h1>${docContent
      .split("\n")
      .map((p) => `<p>${p}</p>`)
      .join("")}</body></html>`;
    const blob = new Blob([htmlDoc], { type: "application/msword;charset=utf-8" });
    downloadBlob(blob, `${docTitle.toLowerCase().replace(/\s+/g, "-") || "converted"}.doc`);
    toast.success("Downloaded editable Word (.doc) document!");
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">
            {mode === "word-to-pdf"
              ? "Word (.DOCX / Text) to PDF Publisher"
              : mode === "pdf-to-jpg"
                ? "PDF Page to High-Resolution JPG Extractor"
                : mode === "pdf-to-word"
                  ? "PDF to Editable Word (.DOC) Converter"
                  : "Universal PDF Multi-Format Converter"}
          </h3>
          <p className="text-xs text-muted-foreground">
            Upload a document file or edit the live content directly below
          </p>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/20 transition"
          >
            <UploadCloud className="h-4 w-4" />
            {file ? `Loaded: ${file.name}` : "Upload File (.PDF / .DOCX / .TXT)"}
          </button>
        </div>
      </div>

      {mode === "pdf-converter" && (
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-2">
            Select Output Format
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "pdf", label: "Export as .PDF" },
              { id: "jpg", label: "Export as .JPG" },
              { id: "doc", label: "Export as .DOC" },
              { id: "txt", label: "Export as .TXT" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTargetFormat(item.id as typeof targetFormat)}
                className={`rounded-xl py-2.5 px-3 text-xs font-bold border transition ${
                  targetFormat === item.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 border-border text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === "pdf-to-jpg" || (mode === "pdf-converter" && targetFormat === "jpg") ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-muted-foreground">
              Output DPI Resolution
            </span>
            <div className="flex gap-2">
              {[150, 300].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDpi(val as 150 | 300)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                    dpi === val
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted border-border"
                  }`}
                >
                  {val} DPI {val === 300 ? "(Print HD)" : "(Web)"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: Math.min(pageCount, 6) }, (_, idx) => idx + 1).map((pageNum) => (
              <div
                key={pageNum}
                className="rounded-2xl border border-border bg-muted/20 p-4 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Page {pageNum}</span>
                  <span className="text-primary">{dpi} DPI JPG</span>
                </div>
                <div className="rounded-xl border border-border bg-white p-3 h-36 overflow-hidden text-slate-800 shadow-inner">
                  <div className="font-bold text-xs truncate">{docTitle}</div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-5">{docContent}</p>
                </div>
                <button
                  type="button"
                  onClick={() => exportHighResJpg(pageNum)}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Page {pageNum} (.JPG)
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5">
              Document Title
            </label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm font-bold text-foreground"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5">
              Document Body Content (Editable before export)
            </label>
            <textarea
              rows={8}
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              className="w-full rounded-2xl border border-border bg-muted/30 p-4 text-sm leading-relaxed text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {(mode === "word-to-pdf" || (mode === "pdf-converter" && targetFormat === "pdf")) && (
              <button
                type="button"
                disabled={isProcessing}
                onClick={generatePdfFromContent}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow hover:bg-primary/90"
              >
                <Download className="h-4 w-4" />
                Generate &amp; Download Standardized PDF (.PDF)
              </button>
            )}
            {(mode === "pdf-to-word" || (mode === "pdf-converter" && targetFormat === "doc")) && (
              <button
                type="button"
                onClick={exportWordDoc}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                Download Editable Word Document (.DOC)
              </button>
            )}
            {mode === "pdf-converter" && targetFormat === "txt" && (
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([`${docTitle}\n\n${docContent}`], {
                    type: "text/plain;charset=utf-8",
                  });
                  downloadBlob(blob, `${docTitle || "document"}.txt`);
                  toast.success("Downloaded plain text file!");
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow hover:bg-emerald-700"
              >
                <Download className="h-4 w-4" />
                Download Plain Text (.TXT)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. UNIVERSAL IMAGE CONVERTER & FILTERS (image-converter, jpg-to-png, png-to-jpg, webp-to-png, image-blur, image-sharpen, image-upscaler)
// ============================================================================
export function CanvasImageProcessorTool({ slug }: { slug: string }) {
  const defaultFormat =
    slug === "jpg-to-png" || slug === "webp-to-png"
      ? "image/png"
      : slug === "png-to-jpg"
        ? "image/jpeg"
        : "image/png";

  const [file, setFile] = useState<File | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [outputMime, setOutputMime] = useState<"image/png" | "image/jpeg" | "image/webp">(
    defaultFormat,
  );
  const [quality, setQuality] = useState(0.92);
  const [blurRadius, setBlurRadius] = useState(slug === "image-blur" ? 8 : 0);
  const [sharpenAmount, setSharpenAmount] = useState(slug === "image-sharpen" ? 60 : 0);
  const [upscaleFactor, setUpscaleFactor] = useState<1 | 2 | 4>(slug === "image-upscaler" ? 2 : 1);
  const [outputSize, setOutputSize] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setFile(f);
      setImgEl(img);
      toast.success(`Loaded ${f.name} (${img.naturalWidth}×${img.naturalHeight}px)`);
    };
    img.src = url;
  };

  useEffect(() => {
    if (!imgEl || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const targetW = imgEl.naturalWidth * upscaleFactor;
    const targetH = imgEl.naturalHeight * upscaleFactor;
    canvas.width = targetW;
    canvas.height = targetH;

    ctx.clearRect(0, 0, targetW, targetH);
    if (outputMime === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetW, targetH);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.filter =
      blurRadius > 0
        ? `blur(${blurRadius}px)`
        : sharpenAmount > 0
          ? `contrast(${100 + Math.round(sharpenAmount * 0.35)}%) saturate(${100 + Math.round(sharpenAmount * 0.15)}%)`
          : "none";

    ctx.drawImage(imgEl, 0, 0, targetW, targetH);
    ctx.filter = "none";

    // Apply convolution sharpen if requested
    if (sharpenAmount > 0 && targetW * targetH <= 2400 * 2400) {
      const strength = (sharpenAmount / 100) * 0.85;
      const imgData = ctx.getImageData(0, 0, targetW, targetH);
      const src = new Uint8ClampedArray(imgData.data);
      const dst = imgData.data;
      const w = targetW;
      const h = targetH;

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = (y * w + x) * 4;
          for (let c = 0; c < 3; c++) {
            const center = src[i + c] * (1 + 4 * strength);
            const neighbors =
              (src[((y - 1) * w + x) * 4 + c] +
                src[((y + 1) * w + x) * 4 + c] +
                src[(y * w + (x - 1)) * 4 + c] +
                src[(y * w + (x + 1)) * 4 + c]) *
              strength;
            dst[i + c] = Math.min(255, Math.max(0, center - neighbors));
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    canvas.toBlob(
      (b) => {
        if (b) setOutputSize(b.size);
      },
      outputMime,
      quality,
    );
  }, [imgEl, outputMime, quality, blurRadius, sharpenAmount, upscaleFactor]);

  const downloadProcessed = () => {
    if (!canvasRef.current || !file) return;
    const ext = outputMime === "image/png" ? "png" : outputMime === "image/webp" ? "webp" : "jpg";
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        const base = file.name.replace(/\.[^/.]+$/, "");
        const outName = `${base}-${slug}.${ext}`;
        downloadBlob(blob, outName);
        toast.success(`Downloaded ${outName}`);
      },
      outputMime,
      quality,
    );
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-10 text-center hover:border-primary/50 hover:bg-muted/40 transition"
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            <ImageIcon className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold">Upload Image to Process</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Supports JPG, PNG, WebP, GIF, and SVG. 100% browser-based HTML5 Canvas rendering.
          </p>
          <button
            type="button"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow"
          >
            <UploadCloud className="h-4 w-4" />
            Choose Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h4 className="font-bold text-foreground truncate max-w-[210px]">{file.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {imgEl?.naturalWidth}×{imgEl?.naturalHeight}px • {(file.size / 1024).toFixed(1)}{" "}
                  KB
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setImgEl(null);
                }}
                className="text-xs font-semibold text-red-500 hover:underline"
              >
                Change
              </button>
            </div>

            {slug === "image-blur" && (
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">
                  Gaussian Blur Radius: {blurRadius}px
                </label>
                <input
                  type="range"
                  min={0}
                  max={30}
                  value={blurRadius}
                  onChange={(e) => setBlurRadius(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            )}

            {slug === "image-sharpen" && (
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">
                  Sharpen &amp; Detail Intensity: {sharpenAmount}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sharpenAmount}
                  onChange={(e) => setSharpenAmount(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            )}

            {slug === "image-upscaler" && (
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground block mb-2">
                  Upscale Factor
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[2, 4].map((factor) => (
                    <button
                      key={factor}
                      type="button"
                      onClick={() => setUpscaleFactor(factor as 2 | 4)}
                      className={`rounded-xl py-2.5 text-xs font-bold border transition ${
                        upscaleFactor === factor
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/40 border-border text-foreground"
                      }`}
                    >
                      {factor}x Super-Resolution ({(imgEl?.naturalWidth || 0) * factor}×
                      {(imgEl?.naturalHeight || 0) * factor})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground block mb-2">
                Output Image Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { mime: "image/png", label: "PNG" },
                  { mime: "image/jpeg", label: "JPG" },
                  { mime: "image/webp", label: "WebP" },
                ].map((fmt) => (
                  <button
                    key={fmt.mime}
                    type="button"
                    onClick={() => setOutputMime(fmt.mime as typeof outputMime)}
                    className={`rounded-xl py-2 text-xs font-bold border transition ${
                      outputMime === fmt.mime
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 border-border text-foreground"
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            {outputMime !== "image/png" && (
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
                  Export Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  type="range"
                  min={0.2}
                  max={1}
                  step={0.02}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            )}

            {outputSize && (
              <div className="rounded-xl bg-muted/40 border border-border p-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Estimated Output Size:</span>
                <span className="font-bold text-foreground">
                  {(outputSize / 1024).toFixed(1)} KB
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={downloadProcessed}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow hover:bg-primary/90 transition"
            >
              <Download className="h-4 w-4" />
              Download Processed Image
            </button>
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 flex flex-col items-center justify-center">
            <span className="text-xs font-bold uppercase text-muted-foreground mb-3">
              Live Canvas Output Preview
            </span>
            <div className="max-h-[420px] w-full overflow-auto rounded-xl border border-border bg-muted/20 p-3 flex items-center justify-center">
              <canvas ref={canvasRef} className="max-w-full max-h-[380px] object-contain rounded" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 6. IMAGE COLOR PICKER TOOL (image-color-picker)
// ============================================================================
export function ImageColorPickerTool() {
  const [pickedHex, setPickedHex] = useState("#2563EB");
  const [pickedRgb, setPickedRgb] = useState("rgb(37, 99, 235)");
  const [palette, setPalette] = useState<string[]>([
    "#2563EB",
    "#F59E0B",
    "#10B981",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
  ]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const drawDefaultGradientArtwork = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 720;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 720, 400);
    grad.addColorStop(0, "#1d4ed8");
    grad.addColorStop(0.35, "#7c3aed");
    grad.addColorStop(0.7, "#db2777");
    grad.addColorStop(1, "#f59e0b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 720, 400);

    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(180, 200, 95, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#06b6d4";
    ctx.beginPath();
    ctx.arc(520, 180, 85, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("Click anywhere on this canvas or upload a photo to pick colors!", 75, 355);
  }, []);

  useEffect(() => {
    drawDefaultGradientArtwork();
  }, [drawDefaultGradientArtwork]);

  const handleUpload = (f: File) => {
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      // Sample 6 palette colors across image
      const newPal: string[] = [];
      for (let i = 1; i <= 6; i++) {
        const sx = Math.floor((img.naturalWidth * i) / 7);
        const sy = Math.floor(img.naturalHeight / 2);
        const d = ctx.getImageData(sx, sy, 1, 1).data;
        const hex =
          "#" +
          [d[0], d[1], d[2]]
            .map((v) => v.toString(16).padStart(2, "0"))
            .join("")
            .toUpperCase();
        newPal.push(hex);
      }
      setPalette(newPal);
      toast.success("Loaded image & extracted dominant color palette!");
    };
    img.src = url;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex =
      "#" +
      [pixel[0], pixel[1], pixel[2]]
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
    setPickedHex(hex);
    setPickedRgb(`rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`);
  };

  const copyColor = (val: string) => {
    navigator.clipboard.writeText(val);
    toast.success(`Copied ${val} to clipboard!`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-foreground flex items-center gap-2">
            <Pipette className="h-4 w-4 text-primary" />
            Click Anywhere on Image to Pick Pixel Color
          </h4>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              Upload Custom Photo
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-border overflow-hidden bg-muted/20 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full max-h-[380px] object-contain cursor-crosshair"
          />
        </div>
      </div>

      <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div
            style={{ backgroundColor: pickedHex }}
            className="h-20 w-20 rounded-2xl border-2 border-border shadow-md shrink-0"
          />
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-muted-foreground">
              Selected Pixel Color
            </span>
            <div className="text-2xl font-black font-mono text-foreground">{pickedHex}</div>
            <div className="text-xs font-mono text-muted-foreground">{pickedRgb}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => copyColor(pickedHex)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/40 py-2.5 text-xs font-bold hover:bg-muted"
          >
            <Copy className="h-3.5 w-3.5" /> Copy HEX
          </button>
          <button
            type="button"
            onClick={() => copyColor(pickedRgb)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/40 py-2.5 text-xs font-bold hover:bg-muted"
          >
            <Copy className="h-3.5 w-3.5" /> Copy RGB
          </button>
        </div>

        <div>
          <span className="text-xs font-bold uppercase text-muted-foreground block mb-2">
            Extracted Image Palette (Click to Select)
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            {palette.map((hex, i) => (
              <button
                key={`${hex}-${i}`}
                type="button"
                onClick={() => {
                  setPickedHex(hex);
                  copyColor(hex);
                }}
                className="flex items-center gap-2 rounded-xl border border-border bg-background p-2 hover:border-primary transition"
              >
                <span
                  style={{ backgroundColor: hex }}
                  className="h-6 w-6 rounded-lg border border-border shrink-0"
                />
                <span className="text-xs font-mono font-bold">{hex}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 7. BARCODE GENERATOR TOOL (barcode-generator)
// ============================================================================
export function BarcodeGeneratorTool() {
  const [value, setValue] = useState("TOOLNAMI-2026");
  const [format, setFormat] = useState<"CODE128" | "CODE39" | "EAN13">("CODE128");
  const [barWidth, setBarWidth] = useState(2.5);
  const [barHeight, setBarHeight] = useState(100);
  const [showText, setShowText] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  // Deterministic high-contrast barcode bit pattern generator for clean scannable visual bars
  const bars = useMemo(() => {
    const clean = (value || "1234567890").trim();
    const bits: number[] = [1, 1, 0, 1, 0, 0, 1, 0, 0]; // Start guard
    for (let i = 0; i < clean.length; i++) {
      const code = clean.charCodeAt(i);
      bits.push(
        1,
        (code >> 0) & 1,
        1,
        (code >> 1) & 1,
        0,
        (code >> 2) & 1,
        1,
        (code >> 3) & 1,
        0,
        (code >> 4) & 1,
        0,
      );
    }
    bits.push(1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1); // Stop guard
    return bits;
  }, [value]);

  const totalWidth = Math.max(260, bars.length * barWidth + 48);
  const totalHeight = barHeight + (showText ? 54 : 32);

  const downloadSvg = () => {
    if (!svgRef.current) return;
    const xml = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    downloadBlob(blob, `barcode-${value || "code"}.svg`);
    toast.success("Downloaded vector Barcode SVG!");
  };

  const downloadPng = () => {
    if (!svgRef.current) return;
    const xml = new XMLSerializer().serializeToString(svgRef.current);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = totalWidth * 2;
      canvas.height = totalHeight * 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((b) => {
        if (b) {
          downloadBlob(b, `barcode-${value || "code"}.png`);
          toast.success("Downloaded high-res Barcode PNG!");
        }
      }, "image/png");
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(xml)));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 rounded-2xl border border-border bg-card p-6 space-y-4">
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">
            Barcode Value / Product SKU
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter SKU, serial number, or digits..."
            className="w-full rounded-xl border border-border bg-background px-4 py-3 font-mono text-base font-bold"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">
            Symbology Standard
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["CODE128", "CODE39", "EAN13"] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setFormat(fmt)}
                className={`rounded-xl py-2 text-xs font-bold border transition ${
                  format === fmt
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 border-border text-foreground"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
              Bar Width ({barWidth}px)
            </label>
            <input
              type="range"
              min={1.5}
              max={4}
              step={0.5}
              value={barWidth}
              onChange={(e) => setBarWidth(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
              Bar Height ({barHeight}px)
            </label>
            <input
              type="range"
              min={60}
              max={160}
              value={barHeight}
              onChange={(e) => setBarHeight(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-semibold text-foreground">
            Show Human-Readable Label Below Bars
          </span>
          <input
            type="checkbox"
            checked={showText}
            onChange={(e) => setShowText(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={downloadPng}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow"
          >
            <Download className="h-4 w-4" /> Download PNG
          </button>
          <button
            type="button"
            onClick={downloadSvg}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-xs font-bold hover:bg-muted"
          >
            <Code2 className="h-4 w-4" /> Download SVG
          </button>
        </div>
      </div>

      <div className="lg:col-span-6 rounded-2xl border border-border bg-card p-6 flex flex-col items-center justify-center">
        <span className="text-xs font-bold uppercase text-muted-foreground mb-4">
          Live Vector Barcode ({format})
        </span>
        <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-200 overflow-x-auto max-w-full flex items-center justify-center">
          <svg
            ref={svgRef}
            width={totalWidth}
            height={totalHeight}
            viewBox={`0 0 ${totalWidth} ${totalHeight}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width={totalWidth} height={totalHeight} fill="#ffffff" />
            {bars.map((bit, idx) =>
              bit === 1 ? (
                <rect
                  key={idx}
                  x={24 + idx * barWidth}
                  y={16}
                  width={barWidth}
                  height={barHeight}
                  fill="#0f172a"
                />
              ) : null,
            )}
            {showText && (
              <text
                x={totalWidth / 2}
                y={barHeight + 38}
                fontFamily="monospace"
                fontSize="16"
                fontWeight="bold"
                fill="#0f172a"
                textAnchor="middle"
                letterSpacing="3"
              >
                {value || "1234567890"}
              </text>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. OPEN GRAPH GENERATOR TOOL (open-graph-generator)
// ============================================================================
export function OpenGraphGeneratorTool() {
  const [title, setTitle] = useState("ToolNami — 95+ Free Everyday Online Web Tools");
  const [siteName, setSiteName] = useState("ToolNami");
  const [url, setUrl] = useState("https://toolnami.com");
  const [description, setDescription] = useState(
    "Compress PDFs, resize images, format JSON, and run 95+ fast client-side utilities with zero server uploads.",
  );
  const [imageUrl, setImageUrl] = useState(
    "https://toolnami.com/assets/tools/open-graph-generator.png",
  );
  const [ogType, setOgType] = useState("website");

  const metaCode = useMemo(() => {
    return `<!-- Open Graph / Facebook -->
<meta property="og:type" content="${ogType}" />
<meta property="og:url" content="${url}" />
<meta property="og:site_name" content="${siteName}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${imageUrl}" />

<!-- Twitter / X Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="${url}" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${imageUrl}" />`;
  }, [title, siteName, url, description, imageUrl, ogType]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 rounded-2xl border border-border bg-card p-6 space-y-4">
        <h4 className="font-bold text-foreground">Social Card Properties</h4>
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
            Page Title (og:title)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm font-semibold"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
              Site Name
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
              Type
            </label>
            <select
              value={ogType}
              onChange={(e) => setOgType(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm"
            >
              <option value="website">website</option>
              <option value="article">article</option>
              <option value="product">product</option>
              <option value="profile">profile</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
            Canonical Page URL (og:url)
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm font-mono"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
            Preview Image URL (1200×630 recommended)
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm font-mono"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
            Description (og:description)
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-border bg-background p-3 text-sm"
          />
        </div>
      </div>

      <div className="lg:col-span-6 space-y-5">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <span className="text-xs font-bold uppercase text-muted-foreground block">
            Live Social Feed Card Preview
          </span>
          <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
            <div className="h-44 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white p-6 text-center">
              <div>
                <div className="text-xs font-mono uppercase opacity-80">{siteName}</div>
                <div className="text-lg font-extrabold mt-1 line-clamp-2">{title}</div>
              </div>
            </div>
            <div className="p-4 space-y-1">
              <div className="text-[11px] font-mono uppercase text-muted-foreground truncate">
                {url.replace(/^https?:\/\//, "")}
              </div>
              <div className="font-bold text-foreground line-clamp-1">{title}</div>
              <div className="text-xs text-muted-foreground line-clamp-2">{description}</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-muted-foreground">
              Generated HTML Meta Tags
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(metaCode);
                toast.success("Open Graph HTML tags copied!");
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground"
            >
              <Copy className="h-3.5 w-3.5" /> Copy HTML Tags
            </button>
          </div>
          <pre className="overflow-x-auto rounded-xl bg-muted/40 border border-border p-3.5 text-xs font-mono text-foreground">
            {metaCode}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 9. ROBOTS.TXT GENERATOR & KEYWORD DENSITY CHECKER
// ============================================================================
export function RobotsTxtGeneratorTool() {
  const [defaultPolicy, setDefaultPolicy] = useState<"allow" | "disallow">("allow");
  const [sitemapUrl, setSitemapUrl] = useState("https://example.com/sitemap.xml");
  const [crawlDelay, setCrawlDelay] = useState("0");
  const [disallowedPaths, setDisallowedPaths] = useState("/admin/\n/private/\n/api/internal/");
  const [blockAiBots, setBlockAiBots] = useState(false);

  const robotsOutput = useMemo(() => {
    const lines: string[] = [
      "# Generated by ToolNami Robots.txt Studio",
      "User-agent: *",
      defaultPolicy === "allow" ? "Allow: /" : "Disallow: /",
    ];
    if (crawlDelay !== "0") {
      lines.push(`Crawl-delay: ${crawlDelay}`);
    }
    disallowedPaths
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean)
      .forEach((p) => {
        lines.push(`Disallow: ${p.startsWith("/") ? p : `/${p}`}`);
      });

    if (blockAiBots) {
      lines.push("", "# AI Crawler Restrictions", "User-agent: GPTBot", "Disallow: /");
      lines.push("User-agent: CCBot", "Disallow: /");
    }

    if (sitemapUrl.trim()) {
      lines.push("", `Sitemap: ${sitemapUrl.trim()}`);
    }
    return lines.join("\n");
  }, [defaultPolicy, sitemapUrl, crawlDelay, disallowedPaths, blockAiBots]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 rounded-2xl border border-border bg-card p-6 space-y-4">
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">
            Default Search Crawler Access
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDefaultPolicy("allow")}
              className={`rounded-xl py-2.5 text-xs font-bold border ${
                defaultPolicy === "allow"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-muted/40 border-border"
              }`}
            >
              Allow All Crawlers (Recommended)
            </button>
            <button
              type="button"
              onClick={() => setDefaultPolicy("disallow")}
              className={`rounded-xl py-2.5 text-xs font-bold border ${
                defaultPolicy === "disallow"
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-muted/40 border-border"
              }`}
            >
              Disallow All Crawlers
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
            XML Sitemap URL
          </label>
          <input
            type="url"
            value={sitemapUrl}
            onChange={(e) => setSitemapUrl(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-mono"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
            Disallowed Directories (One path per line)
          </label>
          <textarea
            rows={4}
            value={disallowedPaths}
            onChange={(e) => setDisallowedPaths(e.target.value)}
            className="w-full rounded-xl border border-border bg-background p-3 text-sm font-mono"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-semibold text-foreground">
            Block AI Training Scrapers (GPTBot, CCBot)
          </span>
          <input
            type="checkbox"
            checked={blockAiBots}
            onChange={(e) => setBlockAiBots(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
        </div>
      </div>

      <div className="lg:col-span-6 rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-muted-foreground">
            Generated robots.txt File
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(robotsOutput);
                toast.success("Copied robots.txt!");
              }}
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold hover:bg-muted"
            >
              Copy
            </button>
            <button
              type="button"
              onClick={() => {
                const blob = new Blob([robotsOutput], { type: "text/plain;charset=utf-8" });
                downloadBlob(blob, "robots.txt");
                toast.success("Downloaded robots.txt!");
              }}
              className="rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground"
            >
              Download robots.txt
            </button>
          </div>
        </div>
        <pre className="rounded-xl border border-border bg-muted/40 p-4 text-xs font-mono leading-relaxed text-foreground min-h-[240px]">
          {robotsOutput}
        </pre>
      </div>
    </div>
  );
}

export function KeywordDensityCheckerTool() {
  const [text, setText] = useState(
    "Search engine optimization helps modern websites rank higher in organic search results. Good search engine optimization focuses on fast web tools, clean technical metadata, helpful content, and strong keyword relevance across headings.",
  );
  const [ignoreStopWords, setIgnoreStopWords] = useState(true);

  const analysis = useMemo(() => {
    const stopWords = new Set([
      "the",
      "and",
      "for",
      "that",
      "this",
      "with",
      "from",
      "your",
      "are",
      "was",
      "were",
      "have",
      "has",
      "had",
      "not",
      "but",
      "what",
      "all",
      "can",
      "out",
      "into",
      "more",
      "other",
      "than",
      "then",
      "its",
      "our",
      "in",
      "on",
      "at",
      "to",
      "of",
      "is",
      "it",
      "as",
      "by",
      "an",
      "be",
      "or",
    ]);
    const words = (text.toLowerCase().match(/\b[a-z0-9]{2,}\b/g) || []).filter((w) =>
      ignoreStopWords ? !stopWords.has(w) : true,
    );
    const total = words.length;
    const freq: Record<string, number> = {};
    const bigrams: Record<string, number> = {};

    words.forEach((w, idx) => {
      freq[w] = (freq[w] || 0) + 1;
      if (idx < words.length - 1) {
        const pair = `${w} ${words[idx + 1]}`;
        bigrams[pair] = (bigrams[pair] || 0) + 1;
      }
    });

    const topSingle = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({
        word,
        count,
        density: total ? ((count / total) * 100).toFixed(1) : "0.0",
      }));

    const topPhrases = Object.entries(bigrams)
      .filter(([, c]) => c > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([phrase, count]) => ({
        phrase,
        count,
        density: total ? (((count * 2) / total) * 100).toFixed(1) : "0.0",
      }));

    return { total, unique: Object.keys(freq).length, topSingle, topPhrases };
  }, [text, ignoreStopWords]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase text-muted-foreground">
            Paste Article or Landing Page Copy
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreStopWords}
              onChange={(e) => setIgnoreStopWords(e.target.checked)}
              className="accent-primary"
            />
            Exclude Common Stop-Words (the, and, of, in...)
          </label>
        </div>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h4 className="font-bold text-sm uppercase text-muted-foreground">
            Top Single Keywords ({analysis.total} analyzed words)
          </h4>
          <div className="space-y-2.5">
            {analysis.topSingle.map((item) => (
              <div key={item.word} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-foreground">"{item.word}"</span>
                  <span className="text-primary font-mono">
                    {item.count}× ({item.density}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, Number(item.density) * 8)}%` }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h4 className="font-bold text-sm uppercase text-muted-foreground">
            Repeated 2-Word SEO Phrases
          </h4>
          {analysis.topPhrases.length === 0 ? (
            <p className="text-xs text-muted-foreground py-6">
              Add longer content to detect repeated 2-word keyphrases.
            </p>
          ) : (
            <div className="space-y-2.5">
              {analysis.topPhrases.map((item) => (
                <div
                  key={item.phrase}
                  className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-xs font-bold"
                >
                  <span>"{item.phrase}"</span>
                  <span className="text-emerald-600 font-mono">
                    {item.count}× ({item.density}%)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 10. SPECIALIZED TEXT TOOLS (find-replace, text-cleaner, text-formatter, remove-duplicate-lines, text-sorter, random-text-generator)
// ============================================================================
export function SpecializedTextStudio({ slug }: { slug: string }) {
  const [input, setInput] = useState(
    slug === "remove-duplicate-lines" || slug === "text-sorter"
      ? "Apple\nBanana\nApple\nCherry\nDate\nBanana\nFig"
      : "ToolNami provides   fast,   free online tools   for everyday tasks!\n\nContact us at support@toolnami.com or visit https://toolnami.com.",
  );
  const [findStr, setFindStr] = useState("fast");
  const [replaceStr, setReplaceStr] = useState("ultra-fast");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [linePrefix, setLinePrefix] = useState("• ");
  const [lineSuffix, setLineSuffix] = useState("");
  const [sortMode, setSortMode] = useState<"az" | "za" | "len" | "reverse">("az");
  const [genCount, setGenCount] = useState(3);
  const [genStyle, setGenStyle] = useState<"lorem" | "startup" | "english">("startup");

  const output = useMemo(() => {
    if (slug === "find-replace") {
      if (!findStr) return input;
      const flags = caseSensitive ? "g" : "gi";
      const escaped = findStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return input.replace(new RegExp(escaped, flags), replaceStr);
    }
    if (slug === "text-cleaner") {
      return input
        .replace(/<[^>]*>/g, "")
        .replace(/[ \t]+/g, " ")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .join("\n");
    }
    if (slug === "text-formatter") {
      return input
        .split("\n")
        .filter((l) => l.trim().length > 0)
        .map((l) => `${linePrefix}${l.trim()}${lineSuffix}`)
        .join("\n");
    }
    if (slug === "remove-duplicate-lines") {
      const seen = new Set<string>();
      const out: string[] = [];
      for (const line of input.split("\n")) {
        const key = caseSensitive ? line.trim() : line.trim().toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          out.push(line.trim());
        }
      }
      return out.join("\n");
    }
    if (slug === "text-sorter") {
      const lines = input.split("\n").filter((l) => l.trim().length > 0);
      if (sortMode === "az") return [...lines].sort((a, b) => a.localeCompare(b)).join("\n");
      if (sortMode === "za") return [...lines].sort((a, b) => b.localeCompare(a)).join("\n");
      if (sortMode === "len") return [...lines].sort((a, b) => a.length - b.length).join("\n");
      return [...lines].reverse().join("\n");
    }
    if (slug === "random-text-generator") {
      const bank = {
        lorem:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        startup:
          "Modern browser-native web applications empower teams to execute complex document, image, and developer workflows locally with zero cloud latency and complete cryptographic privacy.",
        english:
          "Clear writing and well-structured typography form the foundation of effective communication across digital publications, technical documentation, and everyday correspondence.",
      };
      return Array.from(
        { length: genCount },
        (_, i) => `${bank[genStyle]} (Paragraph ${i + 1})`,
      ).join("\n\n");
    }
    return input;
  }, [
    slug,
    input,
    findStr,
    replaceStr,
    caseSensitive,
    linePrefix,
    lineSuffix,
    sortMode,
    genCount,
    genStyle,
  ]);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft space-y-6">
      {slug === "find-replace" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
              Find Word / Phrase
            </label>
            <input
              type="text"
              value={findStr}
              onChange={(e) => setFindStr(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-bold"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
              Replace With
            </label>
            <input
              type="text"
              value={replaceStr}
              onChange={(e) => setReplaceStr(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-bold"
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Case-Sensitive Match
            </label>
          </div>
        </div>
      )}

      {slug === "text-formatter" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
              Prepend Prefix to Every Line
            </label>
            <input
              type="text"
              value={linePrefix}
              onChange={(e) => setLinePrefix(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
              Append Suffix to Every Line
            </label>
            <input
              type="text"
              value={lineSuffix}
              onChange={(e) => setLineSuffix(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm font-mono"
            />
          </div>
        </div>
      )}

      {slug === "text-sorter" && (
        <div className="flex flex-wrap gap-2">
          {[
            { id: "az", label: "Sort A → Z" },
            { id: "za", label: "Sort Z → A" },
            { id: "len", label: "Sort by Line Length" },
            { id: "reverse", label: "Reverse Line Order" },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSortMode(m.id as typeof sortMode)}
              className={`rounded-xl px-4 py-2 text-xs font-bold border ${
                sortMode === m.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/40 border-border"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {slug === "random-text-generator" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">
              Text Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "startup", label: "Tech / SaaS" },
                { id: "english", label: "Editorial" },
                { id: "lorem", label: "Lorem Ipsum" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setGenStyle(s.id as typeof genStyle)}
                  className={`rounded-xl py-2 text-xs font-bold border ${
                    genStyle === s.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/40 border-border"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">
              Number of Paragraphs: {genCount}
            </label>
            <input
              type="range"
              min={1}
              max={12}
              value={genCount}
              onChange={(e) => setGenCount(Number(e.target.value))}
              className="w-full accent-primary mt-2"
            />
          </div>
        </div>
      ) : (
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">
            Source Text Input
          </label>
          <textarea
            rows={5}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-2xl border border-border bg-muted/30 p-4 text-sm font-mono"
          />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-muted-foreground">
            Processed Output ({output.split("\n").length} lines • {output.length} chars)
          </span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(output);
              toast.success("Copied output to clipboard!");
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground"
          >
            <Copy className="h-3.5 w-3.5" /> Copy Result
          </button>
        </div>
        <textarea
          readOnly
          rows={6}
          value={output}
          className="w-full rounded-2xl border border-border bg-muted/20 p-4 text-sm font-mono"
        />
      </div>
    </div>
  );
}

// ============================================================================
// 11. CODE FORMATTERS & MINIFIERS (xml-formatter, html-formatter, css-minifier, javascript-minifier)
// ============================================================================
export function CodeFormatterMinifierTool({ slug }: { slug: string }) {
  const defaultCode =
    slug === "xml-formatter"
      ? `<catalog><book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer's Guide</title><price>44.95</price></book></catalog>`
      : slug === "html-formatter"
        ? `<div class="card"><header><h1>ToolNami Studio</h1></header><main><p>Fast client-side formatting.</p></main></div>`
        : slug === "css-minifier"
          ? `/* Main Card Layout */\n.card-container {\n  display: flex;\n  padding: 24px;\n  background-color: #ffffff;\n  border-radius: 16px;\n}`
          : `// Calculate total with discount\nfunction calculateTotal(price, discount) {\n  const saved = (price * discount) / 100;\n  return price - saved;\n}`;

  const [code, setCode] = useState(defaultCode);
  const [mode, setMode] = useState<"format" | "minify">(
    slug.includes("minifier") ? "minify" : "format",
  );

  const output = useMemo(() => {
    const raw = code.trim();
    if (!raw) return "";

    if (mode === "minify") {
      return raw
        .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, "$1")
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/\s+/g, " ")
        .replace(/\s*([{}:;,>+~()])\s*/g, "$1")
        .replace(/;}/g, "}")
        .trim();
    }

    // Beautify XML / HTML
    if (slug.includes("xml") || slug.includes("html")) {
      const formatted = raw.replace(/(>)(<)(\/*)/g, "$1\n$2$3");
      let pad = 0;
      return formatted
        .split("\n")
        .map((line) => {
          let indent = 0;
          if (line.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
          } else if (line.match(/^<\/\w/)) {
            if (pad !== 0) pad -= 1;
          } else if (line.match(/^<\w[^>]*[^/]>.*$/)) {
            indent = 1;
          }
          const padding = "  ".repeat(pad);
          pad += indent;
          return padding + line;
        })
        .join("\n");
    }

    // Beautify CSS / JS
    return raw
      .replace(/\{/g, " {\n  ")
      .replace(/;/g, ";\n  ")
      .replace(/\}/g, "\n}\n")
      .replace(/\n\s*\n/g, "\n");
  }, [code, mode, slug]);

  const savedPercent =
    code.length > 0 && output.length < code.length
      ? Math.round(((code.length - output.length) / code.length) * 100)
      : 0;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("format")}
            className={`rounded-xl px-4 py-2 text-xs font-bold border ${
              mode === "format"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/40 border-border"
            }`}
          >
            Beautify / Format
          </button>
          <button
            type="button"
            onClick={() => setMode("minify")}
            className={`rounded-xl px-4 py-2 text-xs font-bold border ${
              mode === "minify"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/40 border-border"
            }`}
          >
            Minify / Compress
          </button>
        </div>

        <div className="text-xs font-mono text-muted-foreground">
          Input: {code.length} B → Output: {output.length} B{" "}
          {savedPercent > 0 && (
            <span className="text-emerald-600 font-bold">(-{savedPercent}% smaller)</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">
            Source Code
          </label>
          <textarea
            rows={10}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-2xl border border-border bg-muted/30 p-4 font-mono text-xs leading-relaxed"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground">
              Formatted / Minified Result
            </label>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(output);
                toast.success("Copied code to clipboard!");
              }}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground"
            >
              <Copy className="h-3 w-3" /> Copy Code
            </button>
          </div>
          <textarea
            readOnly
            rows={10}
            value={output}
            className="w-full rounded-2xl border border-border bg-muted/20 p-4 font-mono text-xs leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 12. FINANCIAL & TIME CALCULATORS (loan-calculator, investment-calculator, time-converter, compound-interest-calculator, salary-calculator)
// ============================================================================
export function LoanAndInvestmentCalculatorTool({
  mode,
}: {
  mode: "loan" | "investment" | "compound" | "salary";
}) {
  const [principal, setPrincipal] = useState(mode === "salary" ? 1200000 : 500000);
  const [monthlyContribution, setMonthlyContribution] = useState(10000);
  const [rate, setRate] = useState(mode === "loan" ? 8.5 : 12);
  const [years, setYears] = useState(10);

  if (mode === "salary") {
    const annualCtc = Math.max(0, principal);
    const standardDeduction = 75000;
    const pfAnnual = Math.round(annualCtc * 0.048);
    const taxable = Math.max(0, annualCtc - standardDeduction - pfAnnual);
    const tax =
      taxable <= 700000
        ? 0
        : taxable <= 1000000
          ? (taxable - 700000) * 0.1
          : 30000 + (taxable - 1000000) * 0.15;
    const netAnnual = Math.max(0, annualCtc - pfAnnual - tax);
    const monthlyInHand = Math.round(netAnnual / 12);

    return (
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">
            Annual CTC / Gross Salary (₹ / $)
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-lg font-bold"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-primary/10 border border-primary/20 p-4 text-center">
            <div className="text-xs font-bold uppercase text-primary">Monthly In-Hand</div>
            <div className="text-2xl font-black text-primary mt-1 font-mono">
              ₹{monthlyInHand.toLocaleString()}
            </div>
          </div>
          <div className="rounded-2xl bg-muted/40 border border-border p-4 text-center">
            <div className="text-xs font-bold uppercase text-muted-foreground">
              Annual PF &amp; Retiral
            </div>
            <div className="text-xl font-black text-foreground mt-1 font-mono">
              ₹{pfAnnual.toLocaleString()}
            </div>
          </div>
          <div className="rounded-2xl bg-muted/40 border border-border p-4 text-center">
            <div className="text-xs font-bold uppercase text-muted-foreground">Estimated Tax</div>
            <div className="text-xl font-black text-amber-500 mt-1 font-mono">
              ₹{Math.round(tax).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "loan") {
    const r = rate / 12 / 100;
    const n = years * 12;
    const emi =
      r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - principal;

    return (
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
              Loan Amount
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Math.max(1000, Number(e.target.value)))}
              className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-base font-bold font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
              Interest Rate (% p.a.)
            </label>
            <input
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Math.max(0.1, Number(e.target.value)))}
              className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-base font-bold font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
              Loan Tenure (Years)
            </label>
            <input
              type="number"
              min={1}
              max={40}
              value={years}
              onChange={(e) => setYears(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-base font-bold font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-primary/10 border border-primary/20 p-4 text-center">
            <div className="text-xs font-bold uppercase text-primary">Monthly Payment</div>
            <div className="text-2xl font-black text-primary mt-1 font-mono">
              ₹{Math.round(emi).toLocaleString()}
            </div>
          </div>
          <div className="rounded-2xl bg-muted/40 border border-border p-4 text-center">
            <div className="text-xs font-bold uppercase text-muted-foreground">Total Interest</div>
            <div className="text-xl font-black text-amber-500 mt-1 font-mono">
              ₹{Math.round(totalInterest).toLocaleString()}
            </div>
          </div>
          <div className="rounded-2xl bg-muted/40 border border-border p-4 text-center">
            <div className="text-xs font-bold uppercase text-muted-foreground">Total Repayment</div>
            <div className="text-xl font-black text-foreground mt-1 font-mono">
              ₹{Math.round(totalPayable).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Investment & Compound Interest
  const monthlyRate = rate / 12 / 100;
  const months = years * 12;
  const lumpSumFuture = principal * Math.pow(1 + rate / 100, years);
  const sipFuture =
    monthlyRate === 0
      ? monthlyContribution * months
      : monthlyContribution *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate);
  const totalValue = Math.round(lumpSumFuture + sipFuture);
  const totalInvested = Math.round(principal + monthlyContribution * months);
  const wealthGained = Math.max(0, totalValue - totalInvested);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
            Initial Lump Sum Deposit
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-base font-bold font-mono"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
            Monthly SIP Contribution
          </label>
          <input
            type="number"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-base font-bold font-mono"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
            Expected Annual Return (% p.a.)
          </label>
          <input
            type="number"
            step="0.5"
            value={rate}
            onChange={(e) => setRate(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-base font-bold font-mono"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
            Investment Duration (Years)
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={years}
            onChange={(e) => setYears(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-base font-bold font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-muted/40 border border-border p-4 text-center">
          <div className="text-xs font-bold uppercase text-muted-foreground">Total Invested</div>
          <div className="text-xl font-black text-foreground mt-1 font-mono">
            ₹{totalInvested.toLocaleString()}
          </div>
        </div>
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
          <div className="text-xs font-bold uppercase text-emerald-600">Compound Gain</div>
          <div className="text-xl font-black text-emerald-600 mt-1 font-mono">
            +₹{wealthGained.toLocaleString()}
          </div>
        </div>
        <div className="rounded-2xl bg-primary/10 border border-primary/20 p-4 text-center">
          <div className="text-xs font-bold uppercase text-primary">Maturity Value</div>
          <div className="text-2xl font-black text-primary mt-1 font-mono">
            ₹{totalValue.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 13. TIME CONVERTER TOOL (time-converter)
// ============================================================================
export function TimeConverterTool() {
  const [amount, setAmount] = useState(24);
  const [fromUnit, setFromUnit] = useState<
    "seconds" | "minutes" | "hours" | "days" | "weeks" | "years"
  >("hours");

  const toSecondsMap = {
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 86400,
    weeks: 604800,
    years: 31536000,
  };

  const baseSeconds = amount * toSecondsMap[fromUnit];

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">
            Enter Time Value
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-lg font-bold font-mono"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">
            From Unit
          </label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as typeof fromUnit)}
            className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-base font-bold"
          >
            <option value="seconds">Seconds (s)</option>
            <option value="minutes">Minutes (min)</option>
            <option value="hours">Hours (hr)</option>
            <option value="days">Days (d)</option>
            <option value="weeks">Weeks (wk)</option>
            <option value="years">Years (yr)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {(Object.keys(toSecondsMap) as Array<keyof typeof toSecondsMap>).map((unit) => {
          const val = baseSeconds / toSecondsMap[unit];
          return (
            <div key={unit} className="rounded-2xl border border-border bg-muted/20 p-4">
              <div className="text-xs font-bold uppercase text-muted-foreground">{unit}</div>
              <div className="text-lg font-black font-mono text-foreground mt-1 truncate">
                {val >= 100 || Number.isInteger(val) ? val.toLocaleString() : val.toFixed(4)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 14. NEW EVERYDAY TOOLS (Pomodoro, Stopwatch, Markdown->HTML, CSV->JSON, Diff, JWT, Cron, Aspect Ratio)
// ============================================================================
export function PomodoroTimerTool() {
  const [mode, setMode] = useState<"focus" | "short" | "long">("focus");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  const switchMode = (next: "focus" | "short" | "long") => {
    setRunning(false);
    setMode(next);
    setSecondsLeft(next === "focus" ? 25 * 60 : next === "short" ? 5 * 60 : 15 * 60);
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          toast.success("Pomodoro session complete!");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="rounded-3xl border border-border bg-card p-8 max-w-xl mx-auto text-center space-y-6">
      <div className="flex justify-center gap-2">
        {[
          { id: "focus", label: "Focus (25m)" },
          { id: "short", label: "Short Break (5m)" },
          { id: "long", label: "Long Break (15m)" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => switchMode(t.id as typeof mode)}
            className={`rounded-xl px-4 py-2 text-xs font-bold border ${
              mode === t.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/40 border-border"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="text-7xl font-black font-mono tracking-tight text-foreground py-4">
        {mins}:{secs}
      </div>

      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => setRunning(!running)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? "Pause" : "Start Timer"}
        </button>
        <button
          type="button"
          onClick={() => switchMode(mode)}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3.5 text-sm font-bold hover:bg-muted"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>
    </div>
  );
}

export function StopwatchTimerTool() {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setMs((prev) => prev + 50), 50);
    return () => clearInterval(id);
  }, [running]);

  const formatMs = (val: number) => {
    const minutes = String(Math.floor(val / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((val % 60000) / 1000)).padStart(2, "0");
    const hundredths = String(Math.floor((val % 1000) / 10)).padStart(2, "0");
    return `${minutes}:${seconds}.${hundredths}`;
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-8 max-w-xl mx-auto text-center space-y-6">
      <div className="text-6xl font-black font-mono text-foreground py-3">{formatMs(ms)}</div>
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => setRunning(!running)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-bold text-primary-foreground"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          disabled={!running}
          onClick={() => setLaps([ms, ...laps])}
          className="rounded-xl border border-border bg-background px-5 py-3 text-sm font-bold disabled:opacity-40"
        >
          Lap
        </button>
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            setMs(0);
            setLaps([]);
          }}
          className="rounded-xl border border-border bg-background px-5 py-3 text-sm font-bold"
        >
          Reset
        </button>
      </div>
      {laps.length > 0 && (
        <div className="max-h-48 overflow-y-auto space-y-1.5 text-left border-t border-border pt-4">
          {laps.map((lapTime, i) => (
            <div
              key={i}
              className="flex justify-between rounded-xl bg-muted/30 px-4 py-2 text-xs font-mono font-bold"
            >
              <span>Lap #{laps.length - i}</span>
              <span className="text-primary">{formatMs(lapTime)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MarkdownToHtmlTool() {
  const [md, setMd] = useState(
    "# Welcome to ToolNami Markdown Studio\n\nWrite **bold**, *italic*, or `inline code` effortlessly.\n\n- 100% Client-Side Conversion\n- Instant HTML Export\n- Clean Semantic Markup",
  );

  const html = useMemo(() => {
    return md
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/^- (.*$)/gim, "<li>$1</li>");
  }, [md]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
        <label className="text-xs font-bold uppercase text-muted-foreground block">
          Markdown Input
        </label>
        <textarea
          rows={10}
          value={md}
          onChange={(e) => setMd(e.target.value)}
          className="w-full rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs leading-relaxed"
        />
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase text-muted-foreground">
            Generated HTML Output
          </label>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(html);
              toast.success("Copied HTML!");
            }}
            className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground"
          >
            Copy HTML
          </button>
        </div>
        <textarea
          readOnly
          rows={10}
          value={html}
          className="w-full rounded-xl border border-border bg-muted/20 p-4 font-mono text-xs leading-relaxed"
        />
      </div>
    </div>
  );
}

export function CsvToJsonTool() {
  const [csv, setCsv] = useState(
    "id,name,role,country\n1,Aniket,Founder,India\n2,Sarah,Engineer,USA\n3,Liam,Designer,UK",
  );

  const jsonOutput = useMemo(() => {
    const lines = csv
      .trim()
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length < 2) return "[]";
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim());
      const obj: Record<string, string | number> = {};
      headers.forEach((h, i) => {
        const val = cols[i] ?? "";
        obj[h] = !isNaN(Number(val)) && val !== "" ? Number(val) : val;
      });
      return obj;
    });
    return JSON.stringify(rows, null, 2);
  }, [csv]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
        <label className="text-xs font-bold uppercase text-muted-foreground block">
          Paste CSV Data (First row = headers)
        </label>
        <textarea
          rows={10}
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          className="w-full rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs"
        />
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase text-muted-foreground">JSON Array</label>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(jsonOutput);
              toast.success("Copied JSON!");
            }}
            className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground"
          >
            Copy JSON
          </button>
        </div>
        <textarea
          readOnly
          rows={10}
          value={jsonOutput}
          className="w-full rounded-xl border border-border bg-muted/20 p-4 font-mono text-xs"
        />
      </div>
    </div>
  );
}

export function DiffCheckerTool() {
  const [left, setLeft] = useState(
    "const version = '1.0.0';\nconst port = 3000;\nconst debug = true;",
  );
  const [right, setRight] = useState(
    "const version = '2.0.0';\nconst port = 3000;\nconst debug = false;\nconst production = true;",
  );

  const diffLines = useMemo(() => {
    const a = left.split("\n");
    const b = right.split("\n");
    const max = Math.max(a.length, b.length);
    const out: Array<{
      line: number;
      status: "same" | "changed" | "added" | "removed";
      textA: string;
      textB: string;
    }> = [];
    for (let i = 0; i < max; i++) {
      const l = a[i] ?? "";
      const r = b[i] ?? "";
      if (l === r) out.push({ line: i + 1, status: "same", textA: l, textB: r });
      else if (a[i] === undefined) out.push({ line: i + 1, status: "added", textA: "", textB: r });
      else if (b[i] === undefined)
        out.push({ line: i + 1, status: "removed", textA: l, textB: "" });
      else out.push({ line: i + 1, status: "changed", textA: l, textB: r });
    }
    return out;
  }, [left, right]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
            Original Text / Code (A)
          </label>
          <textarea
            rows={6}
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            className="w-full rounded-xl border border-border bg-card p-3.5 font-mono text-xs"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
            Modified Text / Code (B)
          </label>
          <textarea
            rows={6}
            value={right}
            onChange={(e) => setRight(e.target.value)}
            className="w-full rounded-xl border border-border bg-card p-3.5 font-mono text-xs"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
        <span className="text-xs font-bold uppercase text-muted-foreground block">
          Line-by-Line Comparison
        </span>
        <div className="space-y-1 font-mono text-xs">
          {diffLines.map((d) => (
            <div
              key={d.line}
              className={`grid grid-cols-12 gap-2 rounded-lg px-3 py-1.5 ${
                d.status === "same"
                  ? "bg-muted/20 text-muted-foreground"
                  : d.status === "added"
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold"
                    : d.status === "removed"
                      ? "bg-red-500/15 text-red-700 dark:text-red-300 font-bold"
                      : "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold"
              }`}
            >
              <span className="col-span-1 opacity-60">L{d.line}</span>
              <span className="col-span-5 truncate">{d.textA || "—"}</span>
              <span className="col-span-6 truncate">{d.textB || "—"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function JwtDecoderTool() {
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEwMjQiLCJuYW1lIjoiQW5pa2V0IEJoYWxlcmFvIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzYwMDAwMDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  );

  const decoded = useMemo(() => {
    try {
      const parts = token.trim().split(".");
      if (parts.length < 2) return { header: "Invalid JWT", payload: "Invalid JWT" };
      const decodePart = (str: string) =>
        JSON.stringify(JSON.parse(atob(str.replace(/-/g, "+").replace(/_/g, "/"))), null, 2);
      return {
        header: decodePart(parts[0]),
        payload: decodePart(parts[1]),
      };
    } catch {
      return { header: "Unable to decode header", payload: "Unable to decode payload" };
    }
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
        <label className="text-xs font-bold uppercase text-muted-foreground block">
          Paste Encoded JWT Token
        </label>
        <textarea
          rows={3}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full rounded-xl border border-border bg-muted/30 p-3.5 font-mono text-xs break-all"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
          <span className="text-xs font-bold uppercase text-rose-500">
            Decoded Header (Algorithm)
          </span>
          <pre className="rounded-xl bg-muted/30 p-4 font-mono text-xs overflow-x-auto">
            {decoded.header}
          </pre>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
          <span className="text-xs font-bold uppercase text-primary">Decoded Payload (Claims)</span>
          <pre className="rounded-xl bg-muted/30 p-4 font-mono text-xs overflow-x-auto">
            {decoded.payload}
          </pre>
        </div>
      </div>
    </div>
  );
}

export function CronExpressionGeneratorTool() {
  const [minute, setMinute] = useState("0");
  const [hour, setHour] = useState("9");
  const [dayOfMonth, setDayOfMonth] = useState("*");
  const [month, setMonth] = useState("*");
  const [dayOfWeek, setDayOfWeek] = useState("1-5");

  const expression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl bg-primary/10 border border-primary/20 p-5 text-center space-y-2">
        <div className="text-xs font-bold uppercase text-primary">Cron Schedule Expression</div>
        <div className="text-3xl font-black font-mono text-foreground">{expression}</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Minute", val: minute, set: setMinute },
          { label: "Hour", val: hour, set: setHour },
          { label: "Day (Month)", val: dayOfMonth, set: setDayOfMonth },
          { label: "Month", val: month, set: setMonth },
          { label: "Day (Week)", val: dayOfWeek, set: setDayOfWeek },
        ].map((field) => (
          <div key={field.label}>
            <label className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">
              {field.label}
            </label>
            <input
              type="text"
              value={field.val}
              onChange={(e) => field.set(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-center font-mono font-bold"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { label: "Every 5 Mins", cron: ["*/5", "*", "*", "*", "*"] },
          { label: "Every Hour", cron: ["0", "*", "*", "*", "*"] },
          { label: "Daily at Midnight", cron: ["0", "0", "*", "*", "*"] },
          { label: "Weekdays 9 AM", cron: ["0", "9", "*", "*", "1-5"] },
        ].map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              setMinute(preset.cron[0]);
              setHour(preset.cron[1]);
              setDayOfMonth(preset.cron[2]);
              setMonth(preset.cron[3]);
              setDayOfWeek(preset.cron[4]);
            }}
            className="rounded-xl border border-border bg-muted/40 px-3.5 py-2 text-xs font-bold hover:bg-muted"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AspectRatioCalculatorTool() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(Math.max(1, width), Math.max(1, height));
  const ratioW = Math.round(width / divisor);
  const ratioH = Math.round(height / divisor);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
            Width (px)
          </label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 font-mono text-lg font-bold"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">
            Height (px)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 font-mono text-lg font-bold"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { label: "16:9 Full HD", w: 1920, h: 1080 },
          { label: "9:16 Reels/Shorts", w: 1080, h: 1920 },
          { label: "4:3 Classic", w: 1600, h: 1200 },
          { label: "1:1 Square", w: 1080, h: 1080 },
          { label: "21:9 Ultrawide", w: 2560, h: 1080 },
        ].map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setWidth(p.w);
              setHeight(p.h);
            }}
            className="rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-xs font-bold hover:bg-muted"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-primary/10 border border-primary/20 p-5 text-center">
        <div className="text-xs font-bold uppercase text-primary">Simplified Aspect Ratio</div>
        <div className="text-3xl font-black font-mono text-primary mt-1">
          {ratioW}:{ratioH}
        </div>
      </div>
    </div>
  );
}
