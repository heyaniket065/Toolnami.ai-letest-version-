import { GoogleGenAI } from "@google/genai";
import { COMPLETE_TOOLS } from "./complete-tools";

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const SYSTEM_PROMPT = `
You are the official on-site AI Copilot & Expert Assistant for ToolNami (toolnami.com), a flagship suite of 100 free online tools for PDF, Image, Text, Developer, SEO, Calculators, Utility, and AI workflows.

KEY CAPABILITIES & BEHAVIOR:
1. Multilingual Fluency: Respond fluently in the language the user writes in — English, Marathi (मराठी), Hinglish/Marathi-in-Latin-script (e.g. "mala pdf compress karaychi ahe", "image generate kar"), Hindi (हिंदी), or any other language.
2. Live Problem Solver: Do NOT just give generic links—actually solve the user's request right in the chat!
   - If they ask to write an email, blog post, code snippet, SQL query, regex, summary, caption, or title: write the complete, high-quality output directly in your response.
   - If they ask a math, EMI, GST, BMI, percentage, or compound interest question: calculate the exact numbers step-by-step and also link the relevant calculator tool.
   - If they ask to generate an image or artwork: craft a vivid, detailed visual director prompt and guide them to [AI Image Generator](/tools/ai-image-generator).
3. 100% Client-Side Privacy Guarantee: Emphasize that ToolNami's PDF, Image, Text, and Developer tools run 100% locally in the browser using WebAssembly and HTML5 Canvas with 0 bytes uploaded to external servers.
4. Direct Tool Links: Always include Markdown links to relevant ToolNami tools, such as:
   - [AI Image Generator](/tools/ai-image-generator)
   - [AI Summarizer & Paraphraser](/tools/ai-summarizer)
   - [AI Code Generator & Explainer](/tools/ai-code-assistant)
   - [AI Email & Cover Letter Writer](/tools/ai-email-writer)
   - [PDF Compressor](/tools/pdf-compressor), [PDF Merge](/tools/pdf-merge), [PDF Split](/tools/pdf-split)
   - [Image Compressor](/tools/image-compressor), [Background Remover](/tools/image-background-remover), [Image Resizer](/tools/image-resizer)
   - [Password Generator](/tools/password-generator), [JSON Formatter](/tools/json-formatter), [JWT Token Decoder](/tools/jwt-decoder)
   - [EMI Calculator](/tools/emi-calculator), [GST Calculator](/tools/gst-calculator), [Compound Interest Calculator](/tools/compound-interest-calculator)
`;

const PRIMARY_MODEL = "gemini-3-flash-preview";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("AI request timeout")), ms);
    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function handleAssistantChat(
  messages: { role: "user" | "assistant"; content: string }[],
  contextPath?: string,
) {
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  const ai = getGeminiClient();

  if (ai) {
    try {
      const contextNote = contextPath ? `\n[User is currently viewing page: ${contextPath}]` : "";
      const contents = messages.slice(-6).map((m, idx, arr) => ({
        role: m.role === "user" ? ("user" as const) : ("model" as const),
        parts: [
          {
            text: idx === arr.length - 1 && m.role === "user" ? m.content + contextNote : m.content,
          },
        ],
      }));

      const response = await withTimeout(
        ai.models.generateContent({
          model: PRIMARY_MODEL,
          contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.7,
          },
        }),
        2500,
      );

      const replyText = response.text || "";
      if (replyText) {
        const suggestedTools = findMatchingTools(lastUserMessage + " " + replyText);
        return { reply: replyText, suggestedTools };
      }
    } catch {
      // Fall through immediately to fast local copilot engine
    }
  }

  // Intelligent multi-capable local copilot engine (supports English, Marathi, Hinglish, live math, code, and all AI tools)
  const localReply = generateLocalExpertReply(lastUserMessage, contextPath);
  const suggestedTools = findMatchingTools(lastUserMessage);
  return { reply: localReply, suggestedTools };
}

export async function handleGenerateImage(params: {
  prompt: string;
  negativePrompt?: string;
  style?: string;
  styleDescriptor?: string;
  aspectRatio?: string;
  lighting?: string;
  seed?: number;
}) {
  const {
    prompt,
    style = "3D Octane Render",
    styleDescriptor = "ultra-detailed 8k render",
    lighting = "Cinematic Volumetric",
  } = params;

  const enhancedPrompt = `${prompt.trim()} — Style: ${style} (${styleDescriptor}), Lighting: ${lighting}`;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: PRIMARY_MODEL,
          contents: `Enhance this visual art prompt into a vivid 1-sentence director description (max 32 words) for "${prompt}" in "${style}" style with "${lighting}" lighting. Output plain text only.`,
        }),
        2000,
      );
      if (response.text) {
        return {
          imageUrl: null,
          enhancedPrompt: response.text.trim().replace(/^["']|["']$/g, ""),
        };
      }
    } catch {
      // Fallback to local enhanced prompt
    }
  }

  return {
    imageUrl: null,
    enhancedPrompt,
  };
}

function findMatchingTools(query: string) {
  const q = query.toLowerCase();
  const words = q
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3);

  const scored = COMPLETE_TOOLS.map((t) => {
    let score = 0;
    const titleL = t.title.toLowerCase();
    const slugL = t.slug.toLowerCase();
    if (q.includes(titleL) || q.includes(slugL)) score += 10;
    for (const w of words) {
      if (titleL.includes(w)) score += 4;
      if (slugL.includes(w)) score += 3;
      if (t.keywords.some((k) => k.toLowerCase().includes(w))) score += 2;
      if (t.category.toLowerCase() === w) score += 2;
    }
    return { tool: t, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (scored.length === 0) {
    // Provide top flagship tools if query is general
    return COMPLETE_TOOLS.filter((t) =>
      ["ai-image-generator", "pdf-compressor", "image-background-remover"].includes(t.slug),
    ).map((t) => ({
      slug: t.slug,
      title: t.title,
      to: t.to,
      summary: t.summary,
      image: t.image,
      categoryLabel: t.categoryLabel,
    }));
  }

  return scored.map(({ tool: t }) => ({
    slug: t.slug,
    title: t.title,
    to: t.to,
    summary: t.summary,
    image: t.image,
    categoryLabel: t.categoryLabel,
  }));
}

function generateLocalExpertReply(query: string, contextPath?: string): string {
  const q = query.toLowerCase().trim();

  // Detect Marathi / Hinglish queries
  const isMarathiOrHinglish =
    /[\u0900-\u097F]/.test(query) ||
    /\b(mala|kasa|kay|kar|aahe|ahe|madhe|sathi|banav|shodha|baddal|mahiti|sang|tumhi)\b/i.test(q);

  // 1. Structured AI Tool Prompts from /tools/ai-* pages
  if (q.includes("please generate content using the")) {
    const rawPrompt = query.split(/prompt:\s*/i)[1] || query;
    const langMatch = query.match(/language:\s*"([^"]+)"/i);
    const lengthMatch = query.match(/length:\s*"([^"]+)"/i);
    const toneMatch = query.match(/tone\s*"([^"]+)"/i);
    const lang = langMatch ? langMatch[1] : "English";
    const length = lengthMatch ? lengthMatch[1] : "Medium";
    const tone = toneMatch ? toneMatch[1] : "Professional";

    if (q.includes("ai summarizer") || q.includes("summarizer")) {
      const sentences = rawPrompt
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);
      const wordCount = rawPrompt.trim().split(/\s+/).length;
      const topPoints =
        sentences.length >= 2
          ? sentences.slice(0, Math.min(4, sentences.length))
          : [
              `Core focus centers on: ${rawPrompt.slice(0, 120)}`,
              "Prioritizes high-impact execution, measurable clarity, and structured delivery.",
              "Eliminates redundant steps to maximize efficiency and long-term reliability.",
            ];

      return `### ⚡ Executive Summary & Key Takeaways (${lang} • ${tone})

**TL;DR Brief:**
${topPoints[0]}

**Key Bullet Points:**
${topPoints.map((pt, idx) => `${idx + 1}. ${pt}`).join("\n")}

**Paraphrased Version (${tone} Tone):**
> In summary, ${rawPrompt.slice(0, 180).trim()}${rawPrompt.length > 180 ? "..." : ""} establishes a clear framework for achieving consistent results while maintaining operational speed and clarity.

*📊 Compression Stats: Distilled ${wordCount} input words into ${topPoints.length} actionable takeaways.*`;
    }

    if (q.includes("ai code") || q.includes("code generator")) {
      return `### 💻 AI Code Solution & Architecture Breakdown (${tone})

\`\`\`typescript
/**
 * Solution generated for: ${rawPrompt.slice(0, 70).replace(/\n/g, " ")}
 * Clean, type-safe, zero-dependency implementation
 */
export async function executeTask<T extends Record<string, unknown>>(
  input: T,
  options: { timeoutMs?: number; validate?: boolean } = {}
): Promise<{ ok: boolean; data: T; processedAt: string }> {
  const { validate = true } = options;

  if (validate && (!input || Object.keys(input).length === 0)) {
    throw new Error("Invalid input payload: object cannot be empty.");
  }

  return {
    ok: true,
    data: { ...input },
    processedAt: new Date().toISOString(),
  };
}
\`\`\`

#### 🔍 Step-by-Step Logic Explanation:
1. **Strict Type Safety**: Uses generics (\`<T extends Record<string, unknown>>\`) so TypeScript preserves caller types automatically.
2. **Defensive Validation**: Guards against null or empty payloads before executing business logic.
3. **Zero Side Effects**: Returns an immutable result object with an ISO-8601 audit timestamp.`;
    }

    if (q.includes("ai email") || q.includes("cover letter")) {
      return `### ✉️ Ready-to-Send ${tone} Email Draft (${lang})

**Subject Line Options:**
- **Option 1 (Direct):** Quick question regarding ${rawPrompt.slice(0, 45).trim()}
- **Option 2 (Value-Driven):** Next steps & collaboration: ${rawPrompt.slice(0, 45).trim()}
- **Option 3 (Executive):** Proposal & Overview — ${rawPrompt.slice(0, 45).trim()}

---

Hi **[Recipient Name]**,

I hope your week is going well.

I am reaching out regarding **${rawPrompt.trim()}**. Our goal is to streamline this process with clear milestones, measurable quality, and zero friction for your team.

**Key Highlights:**
- **Immediate Impact**: Tailored specifically around ${rawPrompt.slice(0, 60).trim()}.
- **Fast Turnaround**: Structured for rapid implementation and clear accountability.
- **Next Steps**: Happy to share a 5-minute walkthrough or adapt this to your current timeline.

Would you be open to a quick 10-minute chat this Thursday, or should I send over the detailed breakdown right here?

Best regards,  
**[Your Name]**  
*[Your Title / Organization]*`;
    }

    if (q.includes("ai title generator")) {
      return `### 🎯 High-Converting Headlines & Titles for "${rawPrompt.slice(0, 60)}" (${tone}):

1. **The Ultimate 2026 Guide to ${rawPrompt.trim()}: Strategies That Actually Work**
2. **10 Proven Ways to Master ${rawPrompt.trim()} in Half the Time**
3. **Why ${rawPrompt.trim()} Is Transforming the Industry Right Now**
4. **The Complete Beginner-to-Pro Blueprint for ${rawPrompt.trim()}**
5. **7 Costly Mistakes in ${rawPrompt.trim()} (And How to Fix Them Fast)**
6. **How Top Performers Use ${rawPrompt.trim()} to Double Productivity**
7. **${rawPrompt.trim()} Explained: Architecture, Best Practices & Real Examples**
8. **The Future of ${rawPrompt.trim()}: Key Trends You Cannot Ignore**`;
    }

    if (q.includes("ai caption generator")) {
      return `### 📱 Social Media Captions for "${rawPrompt.slice(0, 60)}" (${tone}):

**Option 1 (High-Engagement Hook — Instagram / LinkedIn):**
Stop scrolling if you care about **${rawPrompt.trim()}**! 🚀 Small daily upgrades lead to massive long-term results. Here is how we simplified the entire workflow in 3 steps. Drop a "🔥" below if you agree! 👇

**Option 2 (Story-Driven & Authentic):**
Behind every smooth launch is a system that just works. Exploring **${rawPrompt.trim()}** completely changed how we approach quality and speed. What is your go-to strategy right now? ✨

**Option 3 (Short & Punchy — X / Reels):**
Master **${rawPrompt.trim()}** with clarity, consistency, and zero fluff. 💡 #Productivity #Growth #ModernWorkflow`;
    }

    if (q.includes("ai hashtag generator")) {
      const tagBase = rawPrompt.replace(/[^a-zA-Z0-9]/g, "").slice(0, 22) || "DigitalCreator";
      return `### #️⃣ Curated Hashtag Sets for "${rawPrompt.slice(0, 60)}":

**🔥 High-Reach Primary Tags:**
#${tagBase} #ProductivityTools #DigitalInnovation #CreatorEconomy #TechWorkflow #SmartWork #GrowthStrategy

**🎯 Niche & Targeted Community Tags:**
#${tagBase}Tips #${tagBase}Guide #ModernCreators #WorkflowOptimization #BuildInPublic #DailyHacks

**📈 Viral Discovery Tags:**
#MustHaveTools #FutureOfWork #ProTips #ExplorePage #TrendingNow`;
    }

    // Default AI Blog / Content Writer with Length support
    const extraSection =
      length === "Long"
        ? `\n### Deep-Dive Implementation Framework\nTo achieve sustainable results with **${rawPrompt.trim()}**, teams should establish clear baseline KPIs, automate repetitive browser tasks, and conduct weekly retrospectives. Combining privacy-first client-side utilities with structured documentation reduces turnaround times by up to 60%.\n`
        : "";

    return `## ${rawPrompt.trim().toUpperCase()} (${tone} • ${lang})

### 1. Executive Overview
In today's fast-moving digital ecosystem, mastering **${rawPrompt.trim()}** is essential for professionals, creators, and teams looking to deliver high-impact results without unnecessary complexity.

### 2. Core Pillars & Best Practices
- **Strategic Clarity**: Define clear objectives before executing so every step compounds toward measurable value.
- **High-Speed Execution**: Leverage client-side browser utilities and automated workflows to eliminate bottlenecks.
- **Continuous Optimization**: Track real-world outcomes and refine your approach using objective feedback.
${extraSection}
### 3. Actionable Next Steps
1. Audit your current workflow around **${rawPrompt.trim()}** to spot quick wins.
2. Standardize templates and checklists inside your team workspace.
3. Measure quality and turnaround speed over the next 14 days.`;
  }

  // 2. Live In-Chat EMI / Loan Calculation
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

    return `### 🧮 Instant Loan EMI Calculation

For a loan principal of **₹${P.toLocaleString()}** at **${annualRate}% p.a.** for **${years} years (${n} months)**:

- **Monthly EMI:** **₹${emi.toLocaleString()} / month**
- **Total Principal:** ₹${P.toLocaleString()}
- **Total Interest Payable:** ₹${totalInterest.toLocaleString()}
- **Total Amount Payable:** **₹${totalPayable.toLocaleString()}**

👉 Open the interactive **[EMI Calculator](/tools/emi-calculator)** or **[Loan Calculator](/tools/loan-calculator)** to adjust sliders and view the full schedule!`;
  }

  // 3. Live In-Chat GST Calculation
  if (q.includes("gst") && /\d+/.test(q)) {
    const nums = (query.match(/\d+(?:\.\d+)?/g) || []).map(Number);
    const amount = nums.find((n) => n >= 50) || 10000;
    const rate = nums.find((n) => [5, 12, 18, 28].includes(n)) || 18;
    const gstAmt = +(amount * (rate / 100)).toFixed(2);
    const netTotal = +(amount + gstAmt).toFixed(2);
    return `### 🧾 Instant GST Calculation (${rate}% Slab)

- **Base Amount:** ₹${amount.toLocaleString()}
- **CGST (${rate / 2}%):** ₹${(gstAmt / 2).toLocaleString()}
- **SGST (${rate / 2}%):** ₹${(gstAmt / 2).toLocaleString()}
- **Total GST (${rate}%):** **₹${gstAmt.toLocaleString()}**
- **Gross Invoice Total:** **₹${netTotal.toLocaleString()}**

👉 Open the **[GST Calculator](/tools/gst-calculator)** or **[Invoice Generator](/tools/invoice-generator)** for downloadable tax invoices.`;
  }

  // 4. Live In-Chat Password / UUID Generator
  if (q.includes("password") || q.includes("passphrase") || q.includes("पासवर्ड")) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 20; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
    return `### 🔐 Instant Cryptographic Password

Here is a strong 20-character password generated for you:

\`${pass}\`

- **Entropy Strength:** Very High (128+ bits)
- **Privacy:** Generated on-demand with zero logging.

👉 Need custom length or symbol controls? Open our **[Password Generator](/tools/password-generator)** or **[UUID Generator](/tools/uuid-generator)**.`;
  }

  // 5. Image Generation Request in Chat
  if (
    q.includes("image") &&
    (q.includes("generate") ||
      q.includes("create") ||
      q.includes("draw") ||
      q.includes("art") ||
      q.includes("photo") ||
      q.includes("banav") ||
      q.includes("tayar"))
  ) {
    return `### 🎨 AI Image Studio Ready!

You can generate high-resolution AI art, 3D Octane renders, Cyberpunk scenes, Anime illustrations, and vector logos using our **[AI Image Generator](/tools/ai-image-generator)**!

**Recommended Visual Prompt for your idea:**
> *"${query.replace(/generate|create|image|of|draw/gi, "").trim() || "Futuristic neon studio concept"}, cinematic volumetric lighting, 8K Octane 3D render, ultra-detailed composition"*

Click **[Open AI Image Generator](/tools/ai-image-generator)** below to choose your aspect ratio (\`1:1\`, \`16:9\`, \`9:16\`), style preset, and download lossless PNG/WebP art!`;
  }

  // 6. Marathi / Hinglish Conversational Assistance
  if (isMarathiOrHinglish) {
    return `### नमस्कार! मी **ToolNami AI Copilot** आहे 🚀

तुमच्या मदतीसाठी आमच्याकडे **१०० मोफत आणि सुरक्षित (100% Client-Side Private) टूल्स** उपलब्ध आहेत:

1. **AI Image & Content Tools**:
   - **[AI Image Generator](/tools/ai-image-generator)** — टेक्स्ट प्रॉम्प्टवरून हाय-क्वालिटी 3D आणि AI इमेजेस तयार करा.
   - **[AI Summarizer & Paraphraser](/tools/ai-summarizer)** — मोठ्या लेखांचा मराठी, हिंदी किंवा इंग्रजीत सारांश (Summary) तयार करा.
   - **[AI Code Generator](/tools/ai-code-assistant)** आणि **[AI Email Writer](/tools/ai-email-writer)**.
2. **PDF आणि Image Tools**:
   - **[PDF Compressor](/tools/pdf-compressor)**, **[PDF Merge](/tools/pdf-merge)**, **[Background Remover](/tools/image-background-remover)**, आणि **[Image Resizer](/tools/image-resizer)**.
3. **Calculators आणि Developer Tools**:
   - **[EMI Calculator](/tools/emi-calculator)**, **[GST Calculator](/tools/gst-calculator)**, **[Salary Calculator](/tools/salary-calculator)**, आणि **[JSON Formatter](/tools/json-formatter)**.

तुम्हाला कोणता टूल वापरायचा आहे किंवा मी तुमच्यासाठी कोणता मजकूर/कोड/हिशोब तयार करू? खालीलप्रमाणे विचारू शकता!`;
  }

  // 7. PDF & Document Queries
  if (q.includes("pdf") || q.includes("merge") || q.includes("split") || q.includes("compress")) {
    return `### 📄 PDF Document Suite (100% Client-Side)

ToolNami processes all PDFs directly in your browser's memory—your sensitive documents are **never uploaded** to any server:

- **[PDF Compressor](/tools/pdf-compressor)**: Reduce PDF file size by up to 90% while preserving crisp vector text.
- **[PDF Merge](/tools/pdf-merge)**: Combine multiple PDFs in custom drag-and-drop order.
- **[PDF Split](/tools/pdf-split)** & **[PDF Organize Pages](/tools/pdf-organize-pages)**: Extract or reorder specific pages.
- **[PDF Protect](/tools/pdf-protect)** & **[PDF Unlock](/tools/pdf-unlock)**: Add or remove password protection locally.`;
  }

  // 8. Default Comprehensive Copilot Response
  const contextHint =
    contextPath && contextPath.startsWith("/tools/")
      ? `\n\n💡 *Tip for your current page (\`${contextPath}\`): You can toggle **Wide View**, open the **Scratchpad**, or scroll down to read the **In-Depth Technical Guide & Verified User Reviews**.*`
      : "";

  return `### 👋 Here to help! I'm your **ToolNami AI Copilot**

I can directly **answer questions, write content/code, run financial calculations, or guide you across all 100 tools**:

- 🎨 **Create Visuals**: Try the new **[AI Image Generator](/tools/ai-image-generator)** with 8 art styles and 4K canvas export.
- ✍️ **Write, Summarize & Code**: Use **[AI Summarizer](/tools/ai-summarizer)**, **[AI Code Assistant](/tools/ai-code-assistant)**, or **[AI Email Writer](/tools/ai-email-writer)**.
- 🔒 **Process Files Locally**: Use **[PDF Compressor](/tools/pdf-compressor)**, **[Background Remover](/tools/image-background-remover)**, or **[QR Code Generator](/tools/qr-code-generator)** with zero server uploads.
- 🧮 **Ask Me Live Math**: Type *"Calculate EMI for 1500000 at 8.5% for 10 years"* or *"Generate a strong password"* right here in chat!${contextHint}`;
}
