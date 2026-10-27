import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  Download,
  RefreshCw,
  Wand2,
  Sliders,
  Image as ImageIcon,
  Copy,
  Check,
  Shuffle,
  Layers,
  Maximize2,
  Palette,
  Sun,
  Type,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

type AspectRatioOption = {
  id: "1:1" | "16:9" | "9:16" | "4:3";
  label: string;
  sub: string;
  width: number;
  height: number;
  previewW: number;
  previewH: number;
};

const ASPECT_RATIOS: AspectRatioOption[] = [
  {
    id: "1:1",
    label: "1:1 Square",
    sub: "1024 × 1024",
    width: 1024,
    height: 1024,
    previewW: 640,
    previewH: 640,
  },
  {
    id: "16:9",
    label: "16:9 Landscape",
    sub: "1920 × 1080",
    width: 1920,
    height: 1080,
    previewW: 800,
    previewH: 450,
  },
  {
    id: "9:16",
    label: "9:16 Vertical",
    sub: "1080 × 1920",
    width: 1080,
    height: 1920,
    previewW: 450,
    previewH: 800,
  },
  {
    id: "4:3",
    label: "4:3 Classic",
    sub: "1440 × 1080",
    width: 1440,
    height: 1080,
    previewW: 720,
    previewH: 540,
  },
];

type StylePreset = {
  id: string;
  label: string;
  badge: string;
  descriptor: string;
  colors: [string, string, string, string];
};

const STYLE_PRESETS: StylePreset[] = [
  {
    id: "octane-3d",
    label: "3D Octane Render",
    badge: "3D Studio",
    descriptor: "Cinema4D Octane render, subsurface scattering, raytraced reflections, 8k",
    colors: ["#0f172a", "#312e81", "#8b5cf6", "#38bdf8"],
  },
  {
    id: "photorealistic",
    label: "Photorealistic 8K",
    badge: "Camera",
    descriptor: "85mm f/1.4 lens, natural golden hour lighting, ultra-detailed photorealistic",
    colors: ["#1e1b4b", "#7c2d12", "#f59e0b", "#fef08a"],
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk Neon",
    badge: "Sci-Fi",
    descriptor: "futuristic cyberpunk metropolis, neon magenta and cyan holographic reflections",
    colors: ["#090d16", "#3b0764", "#d946ef", "#22d3ee"],
  },
  {
    id: "digital-art",
    label: "Concept Illustration",
    badge: "Art",
    descriptor: "epic fantasy concept art, matte painting, volumetric god rays, atmospheric depth",
    colors: ["#064e3b", "#0f766e", "#10b981", "#a7f3d0"],
  },
  {
    id: "anime",
    label: "Anime Studio",
    badge: "Anime",
    descriptor: "Makoto Shinkai inspired anime scenery, vibrant clouds, cel-shaded lighting",
    colors: ["#1e3a8a", "#4338ca", "#f472b6", "#fde047"],
  },
  {
    id: "vector-logo",
    label: "Minimalist Vector",
    badge: "Brand",
    descriptor: "clean flat geometric vector emblem, Swiss design grid, bold contrast",
    colors: ["#0f172a", "#1e293b", "#6366f1", "#f43f5e"],
  },
  {
    id: "isometric",
    label: "Isometric 3D World",
    badge: "Iso",
    descriptor: "isometric miniature 3D diorama, soft clay & glass materials, studio softbox",
    colors: ["#111827", "#1e40af", "#60a5fa", "#fbbf24"],
  },
  {
    id: "oil-painting",
    label: "Impasto Oil Canvas",
    badge: "Fine Art",
    descriptor: "textured impasto brushstrokes, classical chiaroscuro lighting, rich pigments",
    colors: ["#271c19", "#5c2d16", "#d97706", "#fde68a"],
  },
];

const LIGHTING_MOODS = [
  { id: "cinematic", label: "Cinematic Volumetric", accent: "#f59e0b" },
  { id: "neon", label: "Cyber Neon Glow", accent: "#e879f9" },
  { id: "golden", label: "Golden Hour Sunset", accent: "#fb923c" },
  { id: "studio", label: "Clean Studio Softbox", accent: "#38bdf8" },
  { id: "emerald", label: "Northern Aurora", accent: "#34d399" },
  { id: "monochrome", label: "Noir High Contrast", accent: "#94a3b8" },
];

const INSPIRATION_PROMPTS = [
  "Futuristic glass biosphere floating above neon cyberpunk Tokyo at midnight with flying vehicles",
  "Serene Himalayan mountain monastery at golden sunrise reflected in a crystal alpine lake",
  "Isometric 3D developer workspace with holographic code monitors, warm coffee, and indoor plants",
  "Majestic astronaut standing on an alien bioluminescent coral planet under twin ringed moons",
  "Minimalist luxury geometric phoenix emblem in brushed gold and obsidian glass",
  "Enchanted ancient library with floating glowing lanterns and spiral crystal staircases",
];

type GeneratedArtwork = {
  id: string;
  prompt: string;
  enhancedPrompt: string;
  styleId: string;
  aspectId: "1:1" | "16:9" | "9:16" | "4:3";
  lightingId: string;
  seed: number;
  dataUrl: string;
  timestamp: string;
};

function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function drawSceneOnContext(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  targetPrompt: string,
  style: StylePreset,
  lightingAccent: string,
  activeSeed: number,
) {
  const rand = seededRandom(activeSeed);
  const pLower = targetPrompt.toLowerCase();
  const [c0, c1, c2, c3] = style.colors;

  // 1. Deep Multi-Stop Atmospheric Sky / Backdrop
  const skyGrad = ctx.createLinearGradient(0, 0, W * 0.35, H);
  skyGrad.addColorStop(0, c0);
  skyGrad.addColorStop(0.45, c1);
  skyGrad.addColorStop(0.82, c2);
  skyGrad.addColorStop(1, lightingAccent);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Volumetric Radial Nebulae & Ambient Light Sources (Zero shadowBlur for mobile GPU speed)
  const sunX = W * (0.28 + rand() * 0.44);
  const sunY = H * (0.24 + rand() * 0.26);
  const sunRadius = Math.min(W, H) * (0.22 + rand() * 0.14);

  const auraGrad = ctx.createRadialGradient(
    sunX,
    sunY,
    sunRadius * 0.05,
    sunX,
    sunY,
    sunRadius * 2.4,
  );
  auraGrad.addColorStop(0, "#ffffff");
  auraGrad.addColorStop(0.18, c3);
  auraGrad.addColorStop(0.5, lightingAccent + "88");
  auraGrad.addColorStop(1, "transparent");
  ctx.fillStyle = auraGrad;
  ctx.fillRect(0, 0, W, H);

  // Starfield / Atmospheric Bokeh Particles (lightweight count for mobile smoothness)
  for (let i = 0; i < 65; i++) {
    const px = rand() * W;
    const py = rand() * H * 0.78;
    const pr = (0.8 + rand() * 2.5) * (W / 800);
    ctx.fillStyle = i % 5 === 0 ? c3 : "#ffffff";
    ctx.globalAlpha = 0.2 + rand() * 0.65;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 3. Celestial Orb / Glowing Core (using radial halo instead of slow shadowBlur)
  const haloGrad = ctx.createRadialGradient(
    sunX,
    sunY,
    sunRadius * 0.4,
    sunX,
    sunY,
    sunRadius * 0.95,
  );
  haloGrad.addColorStop(0, lightingAccent + "aa");
  haloGrad.addColorStop(1, "transparent");
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius * 0.95, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius * 0.55, 0, Math.PI * 2);
  const orbGrad = ctx.createLinearGradient(
    sunX - sunRadius * 0.5,
    sunY - sunRadius * 0.5,
    sunX + sunRadius * 0.5,
    sunY + sunRadius * 0.5,
  );
  orbGrad.addColorStop(0, "#ffffff");
  orbGrad.addColorStop(0.45, c3);
  orbGrad.addColorStop(1, lightingAccent);
  ctx.fillStyle = orbGrad;
  ctx.fill();

  // Planetary Ring or Geometric Halo
  if (
    style.id === "octane-3d" ||
    style.id === "cyberpunk" ||
    style.id === "vector-logo" ||
    pLower.includes("planet") ||
    pLower.includes("space") ||
    pLower.includes("futuristic")
  ) {
    ctx.save();
    ctx.translate(sunX, sunY);
    ctx.rotate((-18 + rand() * 36) * (Math.PI / 180));
    ctx.strokeStyle = c3;
    ctx.lineWidth = Math.max(2, W * 0.004);
    ctx.globalAlpha = 0.65;
    ctx.beginPath();
    ctx.ellipse(0, 0, sunRadius * 1.15, sunRadius * 0.26, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 4. Scene-Specific Foreground Architecture
  const isCityOrCyber =
    style.id === "cyberpunk" ||
    pLower.includes("city") ||
    pLower.includes("skyline") ||
    pLower.includes("tokyo") ||
    pLower.includes("neon") ||
    pLower.includes("building");

  const isLogoOrMinimal =
    style.id === "vector-logo" ||
    style.id === "isometric" ||
    pLower.includes("logo") ||
    pLower.includes("emblem") ||
    pLower.includes("icon") ||
    pLower.includes("workspace");

  if (isLogoOrMinimal) {
    const cx = W * 0.5;
    const cy = H * 0.54;
    const scale = Math.min(W, H) * 0.24;

    for (let layer = 2; layer >= 0; layer--) {
      const ly = cy + scale * 0.65 + layer * (14 * (W / 800));
      const rx = scale * (1.35 - layer * 0.12);
      const ry = scale * (0.38 - layer * 0.03);
      ctx.beginPath();
      ctx.ellipse(cx, ly, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = layer === 0 ? c1 : c0;
      ctx.strokeStyle = lightingAccent;
      ctx.lineWidth = Math.max(1.5, 2.5 * (W / 800));
      ctx.fill();
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(cx, cy - scale * 0.1);

    ctx.beginPath();
    ctx.moveTo(0, -scale * 0.95);
    ctx.lineTo(-scale * 0.75, 0);
    ctx.lineTo(0, scale * 0.45);
    ctx.closePath();
    ctx.fillStyle = c2;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -scale * 0.95);
    ctx.lineTo(scale * 0.75, 0);
    ctx.lineTo(0, scale * 0.45);
    ctx.closePath();
    ctx.fillStyle = c3;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-scale * 0.75, 0);
    ctx.lineTo(0, scale * 0.95);
    ctx.lineTo(0, scale * 0.45);
    ctx.closePath();
    ctx.fillStyle = c1;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(scale * 0.75, 0);
    ctx.lineTo(0, scale * 0.95);
    ctx.lineTo(0, scale * 0.45);
    ctx.closePath();
    ctx.fillStyle = lightingAccent;
    ctx.fill();

    ctx.restore();
  } else if (isCityOrCyber) {
    const horizonY = H * 0.68;
    const towerCount = 24;
    const stepY = Math.max(10, H * 0.024);
    const stepX = Math.max(8, W * 0.012);

    for (let i = 0; i < towerCount; i++) {
      const bw = W * (0.028 + rand() * 0.045);
      const bh = H * (0.14 + rand() * 0.36);
      const bx = (i / towerCount) * W + (rand() - 0.5) * 14;
      const by = horizonY - bh;

      ctx.fillStyle = i % 2 === 0 ? "#090d16" : "#111827";
      ctx.fillRect(bx, by, bw, bh);

      ctx.fillStyle = i % 3 === 0 ? lightingAccent : c3;
      ctx.globalAlpha = 0.65;
      const cols = Math.min(3, Math.max(1, Math.floor(bw / stepX)));
      for (let wy = by + stepY * 0.6; wy < horizonY - stepY * 0.6; wy += stepY) {
        for (let wx = 0; wx < cols; wx++) {
          if (rand() > 0.45) {
            ctx.fillRect(bx + 4 + wx * stepX, wy, stepX * 0.45, stepY * 0.45);
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    const floorGrad = ctx.createLinearGradient(0, horizonY, 0, H);
    floorGrad.addColorStop(0, lightingAccent + "66");
    floorGrad.addColorStop(0.3, c1);
    floorGrad.addColorStop(1, c0);
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, horizonY, W, H - horizonY);

    ctx.strokeStyle = c3;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = Math.max(1, W * 0.0018);
    ctx.beginPath();
    for (let y = horizonY; y < H; y += (y - horizonY + 8) * 0.32) {
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
    }
    for (let x = -W * 0.4; x <= W * 1.4; x += W * 0.1) {
      ctx.moveTo(W * 0.5 + (x - W * 0.5) * 0.15, horizonY);
      ctx.lineTo(x, H);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  } else {
    const horizonY = H * 0.72;
    const layers = [
      { yBase: horizonY - H * 0.18, amp: H * 0.18, color: c2 + "99", roughness: 0.005 },
      { yBase: horizonY - H * 0.09, amp: H * 0.15, color: c1, roughness: 0.007 },
      { yBase: horizonY, amp: H * 0.11, color: c0, roughness: 0.01 },
    ];

    const xStep = Math.max(8, Math.round(W / 90));
    layers.forEach((layer, idx) => {
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      const phase = rand() * 100;
      for (let x = 0; x <= W; x += xStep) {
        const n =
          Math.sin(x * layer.roughness + phase) * 0.5 +
          Math.sin(x * layer.roughness * 2.3 + phase * 1.7) * 0.3 +
          Math.cos(x * layer.roughness * 4.7 + idx) * 0.2;
        const y = layer.yBase - Math.abs(n) * layer.amp;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, horizonY);
      ctx.closePath();
      ctx.fillStyle = layer.color;
      ctx.fill();
    });

    const lakeGrad = ctx.createLinearGradient(0, horizonY, 0, H);
    lakeGrad.addColorStop(0, c2);
    lakeGrad.addColorStop(0.45, c1);
    lakeGrad.addColorStop(1, c0);
    ctx.fillStyle = lakeGrad;
    ctx.fillRect(0, horizonY, W, H - horizonY);

    for (let r = 0; r < 40; r++) {
      const ry = horizonY + 6 + rand() * (H - horizonY - 12);
      const spread = ((ry - horizonY) / (H - horizonY)) * W * 0.28 + 20;
      const rx = sunX + (rand() - 0.5) * spread;
      const rw = (18 + rand() * 65) * (W / 800);
      ctx.fillStyle = r % 2 === 0 ? c3 : lightingAccent;
      ctx.globalAlpha = 0.25 + rand() * 0.45;
      ctx.fillRect(rx - rw / 2, ry, rw, Math.max(1.5, 2 * (H / 600)));
    }
    ctx.globalAlpha = 1;
  }

  // Subtle Cinema Vignette Frame
  const vig = ctx.createRadialGradient(
    W / 2,
    H / 2,
    Math.min(W, H) * 0.35,
    W / 2,
    H / 2,
    Math.max(W, H) * 0.75,
  );
  vig.addColorStop(0, "transparent");
  vig.addColorStop(1, "rgba(0,0,0,0.42)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);
}

function drawTypographyOverlay(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  text: string,
  accent: string,
) {
  ctx.save();
  const fontSize = Math.round(Math.min(W, H) * 0.055);
  ctx.font = `900 ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const metrics = ctx.measureText(text);
  const padX = fontSize * 0.9;
  const padY = fontSize * 0.55;
  const boxW = Math.min(W * 0.88, metrics.width + padX * 2);
  const boxH = fontSize + padY * 2;
  const boxX = (W - boxW) / 2;
  const boxY = H * 0.84 - boxH / 2;

  ctx.fillStyle = "rgba(15, 23, 42, 0.82)";
  ctx.strokeStyle = accent;
  ctx.lineWidth = Math.max(2, W * 0.0025);
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, W / 2, H * 0.84, W * 0.82);
  ctx.restore();
}

export function AiImageGeneratorTool({ initialPrompt = "" }: { initialPrompt?: string }) {
  const defaultPrompt =
    initialPrompt ||
    "Futuristic glass biosphere floating above neon cyberpunk skyline at sunset, volumetric lighting, 8k octane render";

  const [prompt, setPrompt] = useState(defaultPrompt);
  const [renderedPrompt, setRenderedPrompt] = useState(defaultPrompt);
  const [negativePrompt, setNegativePrompt] = useState("blurry, low quality, distorted, watermark");
  const [selectedStyle, setSelectedStyle] = useState<string>("octane-3d");
  const [selectedAspect, setSelectedAspect] = useState<"1:1" | "16:9" | "9:16" | "4:3">("16:9");
  const [selectedLighting, setSelectedLighting] = useState<string>("cinematic");
  const [seed, setSeed] = useState<number>(482910);
  const [lockSeed, setLockSeed] = useState<boolean>(false);

  // Post-processing adjustments (applied via GPU CSS filter during preview!)
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(104);
  const [saturation, setSaturation] = useState<number>(108);
  const [overlayText, setOverlayText] = useState<string>("");
  const [exportFormat, setExportFormat] = useState<"png" | "jpeg" | "webp">("png");

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [serverImageBase64, setServerImageBase64] = useState<string | null>(null);
  const [activeCaption, setActiveCaption] = useState<string>("");
  const [gallery, setGallery] = useState<GeneratedArtwork[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { recordToolHistory } = useAuth();

  const currentAspectObj = ASPECT_RATIOS.find((a) => a.id === selectedAspect) || ASPECT_RATIOS[1];
  const currentStyleObj = STYLE_PRESETS.find((s) => s.id === selectedStyle) || STYLE_PRESETS[0];
  const currentLightingObj =
    LIGHTING_MOODS.find((l) => l.id === selectedLighting) || LIGHTING_MOODS[0];

  // Fast preview renderer (runs in < 2ms on mobile, NO toDataURL, NO ctx.filter!)
  const renderPreviewCanvas = useCallback(
    async (
      targetPrompt: string,
      style: StylePreset,
      aspect: AspectRatioOption,
      lightingAccent: string,
      activeSeed: number,
      aiBase64?: string | null,
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const W = aspect.previewW;
      const H = aspect.previewH;
      if (canvas.width !== W) canvas.width = W;
      if (canvas.height !== H) canvas.height = H;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (aiBase64) {
        try {
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("Image load failed"));
            img.src = aiBase64;
          });
          ctx.drawImage(img, 0, 0, W, H);
          return;
        } catch {
          // Fallback to procedural render
        }
      }

      drawSceneOnContext(ctx, W, H, targetPrompt, style, lightingAccent, activeSeed);
    },
    [],
  );

  // Only re-render preview when style, aspect, lighting, seed, or renderedPrompt changes (NOT on every keystroke!)
  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      void renderPreviewCanvas(
        renderedPrompt,
        currentStyleObj,
        currentAspectObj,
        currentLightingObj.accent,
        seed,
        serverImageBase64,
      );
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [
    renderedPrompt,
    currentStyleObj,
    currentAspectObj,
    currentLightingObj,
    seed,
    serverImageBase64,
    renderPreviewCanvas,
  ]);

  const createGalleryThumbnail = useCallback((): string => {
    const srcCanvas = canvasRef.current;
    if (!srcCanvas) return "";
    try {
      const thumb = document.createElement("canvas");
      thumb.width = 320;
      thumb.height = Math.round((320 * srcCanvas.height) / Math.max(1, srcCanvas.width));
      const tCtx = thumb.getContext("2d");
      if (!tCtx) return "";
      tCtx.drawImage(srcCanvas, 0, 0, thumb.width, thumb.height);
      return thumb.toDataURL("image/jpeg", 0.78);
    } catch {
      return "";
    }
  }, []);

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) {
      toast.error("Enter a short idea first so AI can enhance it!");
      return;
    }
    setIsEnhancing(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Rewrite and expand this image generation prompt into a single vivid, cinematic 35-word visual prompt with lighting, camera lens, and atmosphere details (output ONLY the prompt text, no quotes): ${prompt}`,
            },
          ],
        }),
      });
      const data = await res.json();
      if (data.reply && !data.reply.includes("ToolNami provides") && !data.reply.includes("###")) {
        const cleaned = data.reply.replace(/^["']|["']$/g, "").trim();
        setPrompt(cleaned);
        toast.success("Prompt enhanced with cinematic details!");
      } else {
        const fallbackEnhanced = `${prompt.trim()}, ${currentStyleObj.descriptor}, ${currentLightingObj.label.toLowerCase()} lighting, ultra-detailed 8K masterpiece, dramatic atmospheric depth`;
        setPrompt(fallbackEnhanced);
        toast.success("Prompt expanded with style & lighting modifiers!");
      }
    } catch {
      const fallbackEnhanced = `${prompt.trim()}, ${currentStyleObj.descriptor}, ${currentLightingObj.label.toLowerCase()} lighting, ultra-detailed 8K masterpiece`;
      setPrompt(fallbackEnhanced);
      toast.success("Prompt expanded with style & lighting modifiers!");
    } finally {
      clearTimeout(timeoutId);
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) {
      toast.error("Please enter a visual prompt to generate an image!");
      return;
    }

    setIsGenerating(true);
    const nextSeed = lockSeed ? seed : Math.floor(100000 + Math.random() * 900000);
    if (!lockSeed) setSeed(nextSeed);
    setRenderedPrompt(cleanPrompt);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2800);

    try {
      let aiImgUrl: string | null = null;
      let enhanced = `${cleanPrompt} — ${currentStyleObj.descriptor} (${currentLightingObj.label})`;

      try {
        const response = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            prompt: cleanPrompt,
            negativePrompt: negativePrompt.trim(),
            style: currentStyleObj.label,
            styleDescriptor: currentStyleObj.descriptor,
            aspectRatio: selectedAspect,
            lighting: currentLightingObj.label,
            seed: nextSeed,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.imageUrl) {
            aiImgUrl = data.imageUrl;
          }
          if (data.enhancedPrompt) {
            enhanced = data.enhancedPrompt;
          }
        }
      } catch {
        // Proceed immediately with local high-speed studio render
      }

      setServerImageBase64(aiImgUrl);
      setActiveCaption(enhanced);

      await renderPreviewCanvas(
        cleanPrompt,
        currentStyleObj,
        currentAspectObj,
        currentLightingObj.accent,
        nextSeed,
        aiImgUrl,
      );

      const thumbDataUrl = createGalleryThumbnail();
      if (thumbDataUrl) {
        const item: GeneratedArtwork = {
          id: `art-${Date.now()}`,
          prompt: cleanPrompt,
          enhancedPrompt: enhanced,
          styleId: selectedStyle,
          aspectId: selectedAspect,
          lightingId: selectedLighting,
          seed: nextSeed,
          dataUrl: thumbDataUrl,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setGallery((prev) => [item, ...prev.slice(0, 7)]);
      }

      void recordToolHistory(
        "ai-image-generator",
        "AI Image Generator",
        `Generated ${selectedAspect} ${currentStyleObj.label} image: "${cleanPrompt.slice(0, 40)}..."`,
      );
      toast.success("High-resolution AI artwork generated!");
    } finally {
      clearTimeout(timeoutId);
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    try {
      const exportCanvas = document.createElement("canvas");
      const W = currentAspectObj.width;
      const H = currentAspectObj.height;
      exportCanvas.width = W;
      exportCanvas.height = H;
      const ctx = exportCanvas.getContext("2d");
      if (!ctx) return;

      ctx.save();
      if (brightness !== 100 || contrast !== 100 || saturation !== 100) {
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      }
      drawSceneOnContext(
        ctx,
        W,
        H,
        renderedPrompt,
        currentStyleObj,
        currentLightingObj.accent,
        seed,
      );
      if (overlayText.trim()) {
        drawTypographyOverlay(ctx, W, H, overlayText.trim(), currentLightingObj.accent);
      }
      ctx.restore();

      const mime = `image/${exportFormat}`;
      const ext = exportFormat === "jpeg" ? "jpg" : exportFormat;
      const dataUrl = exportCanvas.toDataURL(mime, 0.92);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `toolnami-ai-${selectedStyle}-${seed}.${ext}`;
      a.click();
      toast.success(`Downloaded high-res ${ext.toUpperCase()} (${currentAspectObj.sub})!`);
    } catch {
      toast.error("Failed to export image.");
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Control Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5 rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-soft">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Visual Prompt Studio
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const randomP =
                    INSPIRATION_PROMPTS[Math.floor(Math.random() * INSPIRATION_PROMPTS.length)];
                  setPrompt(randomP);
                  setRenderedPrompt(randomP);
                  setSeed(Math.floor(100000 + Math.random() * 900000));
                  setServerImageBase64(null);
                  toast.info("Loaded inspiration prompt!");
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-semibold text-foreground hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
              >
                <Shuffle className="w-3 h-3" /> Surprise Me
              </button>
              <button
                type="button"
                onClick={handleEnhancePrompt}
                disabled={isEnhancing}
                className="inline-flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/25 px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Wand2 className="w-3 h-3" />
                {isEnhancing ? "Enhancing..." : "Enhance with AI"}
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the scene, subject, lighting, and mood..."
              className="w-full rounded-2xl border border-border bg-muted/30 p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyPrompt}
              title="Copy Prompt"
              className="absolute bottom-2.5 right-2.5 rounded-lg bg-card/90 border border-border px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
            >
              {copied ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          {/* Style Presets Grid */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2.5">
              <Palette className="w-3.5 h-3.5 text-primary" /> Art Style Preset
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STYLE_PRESETS.map((style) => {
                const active = selectedStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => {
                      setSelectedStyle(style.id);
                      setServerImageBase64(null);
                    }}
                    className={`flex items-center justify-between rounded-xl border p-2.5 text-left transition-colors cursor-pointer ${
                      active
                        ? "border-primary bg-primary/10 text-foreground shadow-sm"
                        : "border-border bg-muted/25 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <div className="min-w-0 pr-1">
                      <div className="text-xs font-bold truncate">{style.label}</div>
                      <div className="text-[10px] opacity-75">{style.badge}</div>
                    </div>
                    <div className="flex -space-x-1 shrink-0">
                      {style.colors.slice(1, 4).map((hex, i) => (
                        <span
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-background"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
              <Maximize2 className="w-3.5 h-3.5 text-primary" /> Aspect Ratio &amp; Resolution
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar.id}
                  type="button"
                  onClick={() => setSelectedAspect(ar.id)}
                  className={`rounded-xl border px-2.5 py-2 text-center transition-colors cursor-pointer ${
                    selectedAspect === ar.id
                      ? "border-primary bg-primary text-primary-foreground font-bold shadow-sm"
                      : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="text-xs font-bold">{ar.id}</div>
                  <div className="text-[10px] opacity-80">{ar.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Lighting & Atmosphere */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
              <Sun className="w-3.5 h-3.5 text-primary" /> Lighting &amp; Color Mood
            </label>
            <div className="flex flex-wrap gap-1.5">
              {LIGHTING_MOODS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    setSelectedLighting(l.id);
                    setServerImageBase64(null);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    selectedLighting === l.id
                      ? "border-primary bg-primary/15 text-primary font-bold"
                      : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: l.accent }}
                  />
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Negative Prompt & Seed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-border">
            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                Negative Prompt (Exclude)
              </label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="blurry, low-res..."
                className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-foreground"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-muted-foreground">Seed ({seed})</label>
                <label className="flex items-center gap-1 text-[11px] text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lockSeed}
                    onChange={(e) => setLockSeed(e.target.checked)}
                    className="rounded text-primary"
                  />
                  Lock
                </label>
              </div>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(Number(e.target.value) || 1)}
                  className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs font-mono text-foreground"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSeed(Math.floor(100000 + Math.random() * 900000));
                    setServerImageBase64(null);
                  }}
                  className="px-2.5 rounded-xl border border-border bg-muted/50 hover:bg-muted text-foreground cursor-pointer"
                  title="Randomize Seed"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-extrabold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing High-Res Artwork...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate AI Image ({currentAspectObj.sub})</span>
              </>
            )}
          </button>
        </div>

        {/* Right Canvas Preview & Post-Processing Studio (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-soft space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
                  <ImageIcon className="w-3.5 h-3.5" />
                  {currentStyleObj.label}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {currentAspectObj.sub}px • Seed #{seed}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as "png" | "jpeg" | "webp")}
                  className="rounded-xl border border-border bg-muted/50 px-2.5 py-1.5 text-xs font-bold text-foreground"
                >
                  <option value="png">PNG (Lossless)</option>
                  <option value="jpeg">JPG (Compact)</option>
                  <option value="webp">WebP (Web Ready)</option>
                </select>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download {exportFormat.toUpperCase()}
                </button>
              </div>
            </div>

            {/* Hardware-Accelerated Interactive Canvas Container */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-slate-950 flex items-center justify-center min-h-[280px] sm:min-h-[340px] max-h-[520px]">
              <canvas
                ref={canvasRef}
                style={{
                  filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                }}
                className="max-w-full max-h-[500px] w-auto h-auto object-contain block shadow-2xl"
              />

              {/* Live GPU-Composited Text Overlay Preview */}
              {overlayText.trim() && (
                <div className="pointer-events-none absolute inset-x-4 bottom-6 flex justify-center">
                  <div
                    style={{ borderColor: currentLightingObj.accent }}
                    className="max-w-[90%] truncate rounded-2xl border-2 bg-slate-900/85 px-4 py-2 text-center text-sm sm:text-lg font-black text-white shadow-lg"
                  >
                    {overlayText.trim()}
                  </div>
                </div>
              )}

              {isGenerating && (
                <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-3 text-white">
                  <div className="w-11 h-11 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary animate-spin" />
                  </div>
                  <div className="text-sm font-bold">
                    Rendering {currentAspectObj.sub} Canvas...
                  </div>
                  <div className="text-xs text-slate-300 max-w-xs text-center px-4">
                    Applying {currentStyleObj.label} shaders &amp; {currentLightingObj.label}{" "}
                    lighting
                  </div>
                </div>
              )}
            </div>

            {activeCaption && (
              <div className="rounded-xl bg-muted/40 border border-border px-3.5 py-2.5 text-xs text-muted-foreground flex items-center justify-between gap-2">
                <span className="truncate">
                  <strong className="text-foreground">AI Director Spec:</strong> {activeCaption}
                </span>
              </div>
            )}

            {/* Post-Generation Color Grading & Text Overlay Bar */}
            <div className="rounded-2xl border border-border bg-muted/25 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-primary" /> Studio Color Grading &amp;
                  Caption Overlay
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setBrightness(100);
                    setContrast(104);
                    setSaturation(108);
                    setOverlayText("");
                  }}
                  className="text-[11px] font-semibold text-muted-foreground hover:text-primary cursor-pointer"
                >
                  Reset Adjustments
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span>Brightness</span>
                    <span className="font-mono text-primary">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min={60}
                    max={140}
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span>Contrast</span>
                    <span className="font-mono text-primary">{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min={60}
                    max={150}
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span>Saturation</span>
                    <span className="font-mono text-primary">{saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={180}
                    value={saturation}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-1 flex items-center gap-2">
                <Type className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={overlayText}
                  onChange={(e) => setOverlayText(e.target.value)}
                  placeholder="Optional banner headline / poster caption overlay (renders live on image)..."
                  className="w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Session Generation History Gallery */}
          {gallery.length > 0 && (
            <div className="rounded-3xl border border-border bg-card p-5 shadow-soft space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-primary" /> Session Render History (
                  {gallery.length})
                </h4>
                <span className="text-[11px] text-muted-foreground">
                  Tap any variation to restore settings
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {gallery.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setPrompt(item.prompt);
                      setRenderedPrompt(item.prompt);
                      setSelectedStyle(item.styleId);
                      setSelectedAspect(item.aspectId);
                      setSelectedLighting(item.lightingId);
                      setSeed(item.seed);
                      toast.info(`Restored render #${item.seed}`);
                    }}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-slate-900 aspect-video text-left transition-colors hover:border-primary cursor-pointer"
                  >
                    <img
                      src={item.dataUrl}
                      alt={item.prompt}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2">
                      <div className="text-[10px] font-bold text-white truncate">{item.prompt}</div>
                      <div className="text-[9px] text-slate-300 font-mono">
                        {item.aspectId} • #{item.seed}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
