import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  Bot,
  Zap,
  Copy,
  Check,
  Volume2,
  Mic,
  Maximize2,
  Minimize2,
  Download,
  Calculator,
  Code2,
  Compass,
} from "lucide-react";
import { toast } from "sonner";
import { FormattedMarkdown } from "@/components/ui/formatted-markdown";
import { getToolBySlug, searchTools } from "../lib/complete-tools";

type SuggestedTool = {
  slug: string;
  title: string;
  to: string;
  summary: string;
  image: string;
  categoryLabel: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  suggestedTools?: SuggestedTool[];
};

type CopilotMode = "copilot" | "finder" | "writer" | "solver";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    role: "assistant",
    content:
      "Hello! नमस्कार! 👋 I am your **ToolNami AI Copilot**.\n\nI have full context of all **100 free client-side tools** and can also **write content/code, summarize text, generate AI art prompts, or calculate Loan EMI & GST** right inside this chat (in English, मराठी, or हिंदी)!\n\nHow can I help you today?",
    timestamp: "Just now",
    suggestedTools: [
      {
        slug: "ai-image-generator",
        title: "AI Image Generator",
        to: "/tools/ai-image-generator",
        summary: "Generate high-resolution AI art, 3D renders, and social banners from text.",
        image: "/assets/tools/ai-image-generator.png",
        categoryLabel: "AI Tools",
      },
      {
        slug: "pdf-compressor",
        title: "PDF Compressor",
        to: "/tools/pdf-compressor",
        summary: "Reduce PDF file size by up to 90% while keeping high visual clarity.",
        image: "/assets/tools/3d-pdf-compressor.png",
        categoryLabel: "PDF Tools",
      },
    ],
  },
];

const MODE_PROMPTS: Record<CopilotMode, string[]> = {
  copilot: [
    "Generate AI Image of a neon city",
    "माझ्यासाठी योग्य टूल शोधा (Marathi)",
    "Calculate EMI for 1000000 at 8.5% for 5 years",
    "Generate a strong 20-char password",
    "How do I compress a PDF privately?",
  ],
  finder: [
    "Show me all AI tools",
    "Which tool removes image backgrounds?",
    "Best tools for PDF editing",
    "Developer JSON & JWT utilities",
  ],
  writer: [
    "Write a professional email for project delivery",
    "Generate 8 viral YouTube titles for AI tools",
    "Write a TypeScript debounce function",
    "Summarize key benefits of client-side tools",
  ],
  solver: [
    "Calculate EMI for 1500000 at 9% for 7 years",
    "Calculate 18% GST on 25000",
    "Generate a strong password",
    "What is the aspect ratio of 1920x1080?",
  ],
};

function buildInstantClientFallbackReply(query: string): string {
  const q = query.toLowerCase().trim();
  const isMarathi =
    /[\u0900-\u097F]/.test(query) ||
    /\b(mala|kasa|kay|kar|aahe|ahe|madhe|sathi|banav|shodha|baddal|mahiti|sang|tumhi)\b/i.test(q);

  if (q.includes("emi") || (q.includes("loan") && /\d+/.test(q))) {
    const nums = (query.match(/\d+(?:\.\d+)?/g) || []).map(Number);
    const P = nums.find((n) => n >= 1000) || 500000;
    const annualRate = nums.find((n) => n > 0 && n <= 35) || 8.5;
    const years = nums.find((n) => n >= 1 && n <= 40 && n !== annualRate) || 5;
    const r = annualRate / 12 / 100;
    const n = years * 12;
    const emi = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalPayable = emi * n;
    const totalInterest = totalPayable - P;
    return `### 🧮 Instant Loan EMI Calculation\n\n- **Principal:** ₹${P.toLocaleString()}\n- **Interest Rate:** ${annualRate}% p.a. (${years} years)\n- **Monthly EMI:** **₹${emi.toLocaleString()} / month**\n- **Total Interest:** ₹${totalInterest.toLocaleString()}\n- **Total Payable:** **₹${totalPayable.toLocaleString()}**\n\nOpen **[EMI Calculator](/tools/emi-calculator)** to customize sliders!`;
  }

  if (q.includes("gst") && /\d+/.test(q)) {
    const nums = (query.match(/\d+(?:\.\d+)?/g) || []).map(Number);
    const amount = nums.find((n) => n >= 50) || 10000;
    const rate = nums.find((n) => [5, 12, 18, 28].includes(n)) || 18;
    const gstAmt = +(amount * (rate / 100)).toFixed(2);
    const netTotal = +(amount + gstAmt).toFixed(2);
    return `### 🧾 Instant GST Calculation (${rate}%)\n\n- **Base Amount:** ₹${amount.toLocaleString()}\n- **Total GST (${rate}%):** **₹${gstAmt.toLocaleString()}**\n- **Gross Total:** **₹${netTotal.toLocaleString()}**\n\nOpen **[GST Calculator](/tools/gst-calculator)** for full tax invoices.`;
  }

  if (q.includes("password")) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 20; i++) pass += chars[Math.floor(Math.random() * chars.length)];
    return `### 🔐 Strong 20-Character Password\n\n\`${pass}\`\n\nGenerated locally with zero logging. Open **[Password Generator](/tools/password-generator)** for custom rules!`;
  }

  if (isMarathi) {
    return `### नमस्कार! मी **ToolNami AI Copilot** आहे 🚀\n\nतुमच्या मदतीसाठी आमच्याकडे **१०० मोफत आणि सुरक्षित टूल्स** आहेत:\n- **[AI Image Generator](/tools/ai-image-generator)** — टेक्स्टवरून हाय-क्वालिटी 3D आणि AI इमेजेस तयार करा.\n- **[AI Summarizer](/tools/ai-summarizer)** — मराठी, हिंदी किंवा इंग्रजीत सारांश तयार करा.\n- **[PDF Compressor](/tools/pdf-compressor)** आणि **[Background Remover](/tools/image-background-remover)**.\n\nखालील रेकमेंडेड टूलवर क्लिक करून लगेच सुरू करा!`;
  }

  return "ToolNami provides **100 fast, client-side tools** for AI Image Generation, PDF, Image, Text, Code, and Finance. Tap any recommended tool below to launch it immediately!";
}

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState<CopilotMode>("copilot");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Scroll inner container only (never call window-scrolling scrollIntoView on mobile)
  useEffect(() => {
    if (isOpen && !isMinimized && messagesContainerRef.current) {
      const el = messagesContainerRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [isOpen, isMinimized, messages]);

  // Only auto-focus input on desktop screens so mobile virtual keyboard doesn't trap the screen
  useEffect(() => {
    if (isOpen && !isMinimized && typeof window !== "undefined" && window.innerWidth >= 768) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contextPath: currentPath,
          messages: [...messages.slice(-6), userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply || buildInstantClientFallbackReply(text),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedTools:
          data.suggestedTools && data.suggestedTools.length > 0
            ? data.suggestedTools
            : findClientFallbackTools(text),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const fallbackTools = findClientFallbackTools(text);
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: buildInstantClientFallbackReply(text),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedTools: fallbackTools,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    toast.success("Chat reset!");
  };

  const handleCopyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("Copied response to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakMessage = (content: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Text-to-speech is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = content.replace(/[#*`_~[\]()]/g, " ");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.02;
    window.speechSynthesis.speak(utterance);
    toast.info("Reading response aloud...");
  };

  const handleVoiceInput = () => {
    if (typeof window === "undefined") return;
    const SpeechRec =
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

    if (!SpeechRec) {
      toast.error("Voice recognition is not supported in this browser.");
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recognition = new (SpeechRec as any)();
      recognition.lang = "en-IN";
      recognition.interimResults = false;
      setIsListening(true);
      recognition.onresult = (event: { results: { transcript: string }[][] }) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
      toast.info("Listening... Speak in English, Marathi, or Hindi.");
    } catch {
      setIsListening(false);
    }
  };

  const handleExportChat = () => {
    const transcript = messages
      .map((m) => `[${m.timestamp}] ${m.role.toUpperCase()}:\n${m.content}\n`)
      .join("\n---\n\n");
    const blob = new Blob([transcript], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "toolnami-copilot-chat.md";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded chat transcript!");
  };

  function findClientFallbackTools(query: string): SuggestedTool[] {
    const results = searchTools(query).slice(0, 3);
    if (results.length > 0) {
      return results.map((t) => ({
        slug: t.slug,
        title: t.title,
        to: t.to,
        summary: t.summary,
        image: t.image,
        categoryLabel: t.categoryLabel,
      }));
    }
    return ["ai-image-generator", "pdf-compressor", "password-generator"]
      .map((s) => getToolBySlug(s))
      .filter((t): t is NonNullable<typeof t> => !!t)
      .map((t) => ({
        slug: t.slug,
        title: t.title,
        to: t.to,
        summary: t.summary,
        image: t.image,
        categoryLabel: t.categoryLabel,
      }));
  }

  return (
    <>
      {/* Lightweight Floating Launcher Button (Zero continuous GPU blur repaint on mobile) */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            id="ai-assistant-launcher"
            className="group relative flex items-center gap-2.5 px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-full bg-card text-foreground border-2 border-primary/50 shadow-xl hover:border-primary transition-transform duration-200 active:scale-95 cursor-pointer"
            aria-label="Open ToolNami AI Copilot"
          >
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary text-primary-foreground shadow-sm">
              <Bot className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 border border-card" />
            </div>

            <div className="text-left hidden sm:block">
              <div className="text-xs font-extrabold text-foreground flex items-center gap-1.5 leading-tight">
                ToolNami AI Copilot
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold">
                  100 Tools
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground font-medium">
                Chat • Write • Calculate • मराठी / EN
              </div>
            </div>
            <span className="sm:hidden text-xs font-extrabold text-foreground pr-1">
              AI Copilot
            </span>
          </button>
        </div>
      )}

      {/* Mobile Backdrop Overlay (tap outside to close easily on mobile) */}
      {isOpen && !isMinimized && (
        <div
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/40 sm:hidden"
        />
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div
          id="ai-assistant-modal"
          className={`fixed z-50 ${
            isMinimized
              ? "bottom-4 right-4 sm:bottom-6 sm:right-6 w-72 sm:w-80 rounded-2xl bg-card border border-border shadow-2xl p-3"
              : isExpanded
                ? "bottom-3 right-3 left-3 sm:left-auto sm:bottom-6 sm:right-6 sm:w-[640px] h-[540px] sm:h-[700px] max-h-[80dvh] rounded-3xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden text-foreground"
                : "bottom-3 right-3 left-3 sm:left-auto sm:bottom-6 sm:right-6 sm:w-[430px] h-[520px] sm:h-[600px] max-h-[78dvh] rounded-3xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden text-foreground"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-muted/60 dark:bg-muted/30 border-b border-border select-none shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-foreground flex items-center gap-1.5 truncate">
                  ToolNami AI Copilot
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                </div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1 truncate">
                  <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                  100 Tools • English, मराठी &amp; हिंदी
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {!isMinimized && (
                <>
                  <button
                    type="button"
                    onClick={handleExportChat}
                    title="Download Chat Transcript"
                    className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    title={isExpanded ? "Standard Width" : "Wide Copilot View"}
                    className="hidden sm:inline-flex p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  >
                    {isExpanded ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={handleReset}
                title="Restart Chat"
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
                aria-label="Reset Conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Expand" : "Minimize"}
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
                aria-label="Minimize"
              >
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${isMinimized ? "rotate-180" : ""}`}
                />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Copilot Mode Switcher Tabs */}
              <div className="grid grid-cols-4 gap-1 px-3 py-2 bg-muted/25 border-b border-border shrink-0">
                {[
                  { id: "copilot", label: "Copilot", icon: Sparkles },
                  { id: "finder", label: "Finder", icon: Compass },
                  { id: "writer", label: "Write/Code", icon: Code2 },
                  { id: "solver", label: "Calculate", icon: Calculator },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = mode === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setMode(tab.id as CopilotMode)}
                      className={`flex items-center justify-center gap-1 rounded-xl py-1.5 text-[11px] font-bold transition-colors cursor-pointer ${
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Message List */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-4 space-y-4"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 shadow-sm text-sm ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted/70 text-foreground border border-border rounded-tl-sm"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <FormattedMarkdown
                          content={message.content}
                          onLinkClick={handleCloseModal}
                          className="text-foreground text-sm leading-relaxed"
                        />
                      ) : (
                        <p className="leading-relaxed break-words">{message.content}</p>
                      )}

                      {/* Attached Tool Recommendation Cards */}
                      {message.suggestedTools && message.suggestedTools.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border space-y-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-500" />
                            Recommended Tools
                          </div>
                          {message.suggestedTools.map((tool) => (
                            <Link
                              key={tool.slug}
                              to={tool.to}
                              onClick={handleCloseModal}
                              className="group block p-2 rounded-xl bg-card hover:bg-muted/80 border border-border transition-colors text-left"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-12 h-8 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border">
                                  <img
                                    src={tool.image}
                                    alt={tool.title}
                                    loading="lazy"
                                    className="w-full h-full object-contain block"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                                    <span className="truncate">{tool.title}</span>
                                    <span className="text-[10px] text-primary font-mono ml-1 font-bold shrink-0">
                                      Open →
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-muted-foreground truncate">
                                    {tool.summary}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Message Action Bar for Assistant */}
                      {message.role === "assistant" && (
                        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => handleSpeakMessage(message.content)}
                            title="Read Aloud"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          >
                            <Volume2 className="w-3 h-3" /> Listen
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(message.id, message.content)}
                            title="Copy Response"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          >
                            {copiedId === message.id ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            {copiedId === message.id ? "Copied" : "Copy"}
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 px-1">
                      {message.timestamp}
                    </span>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground text-xs px-2 py-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span>ToolNami AI Copilot is thinking...</span>
                  </div>
                )}
              </div>

              {/* Mode-Specific Quick Prompt Chips */}
              <div className="px-3 py-2 bg-muted/30 border-t border-border overflow-x-auto whitespace-nowrap flex gap-1.5 shrink-0">
                {MODE_PROMPTS[mode].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void handleSend(prompt)}
                    disabled={isLoading}
                    className="text-xs px-2.5 py-1 rounded-full bg-card hover:bg-primary/10 hover:border-primary/40 text-foreground border border-border transition-colors flex-shrink-0 active:scale-95 disabled:opacity-50 font-medium cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Form with Voice Mic */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSend();
                }}
                className="p-2.5 sm:p-3 bg-muted/40 border-t border-border flex items-center gap-2 shrink-0"
              >
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  title="Voice Input (English / Marathi / Hindi)"
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                    isListening
                      ? "bg-rose-500 text-white border-rose-500"
                      : "bg-card text-muted-foreground hover:text-foreground border-border"
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask in English or मराठी (tools, EMI, code)..."
                  disabled={isLoading}
                  className="flex-1 min-w-0 bg-card text-foreground placeholder-muted-foreground text-sm px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-medium transition-colors shadow-sm cursor-pointer shrink-0"
                  aria-label="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
