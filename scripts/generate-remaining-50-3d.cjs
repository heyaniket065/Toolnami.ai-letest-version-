const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public", "assets", "tools");
const srcDir = path.join(__dirname, "..", "src", "assets", "tools");

[publicDir, srcDir].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const W = 1200;
const H = 750;

const commonDefs = `
  <defs>
    <filter id="shadow-lg" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="22" stdDeviation="24" flood-color="#0f172a" flood-opacity="0.16"/>
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
    <filter id="shadow-md" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#0f172a" flood-opacity="0.14"/>
    </filter>
    <filter id="shadow-sm" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.10"/>
    </filter>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    <linearGradient id="glass-pill" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.96"/>
      <stop offset="100%" stop-color="#f8fafc" stop-opacity="0.90"/>
    </linearGradient>
    <linearGradient id="card-white" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
    <linearGradient id="card-dark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
    <linearGradient id="purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
    <linearGradient id="rose-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fb7185"/>
      <stop offset="100%" stop-color="#e11d48"/>
    </linearGradient>
    <linearGradient id="cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
`;

function wrapStage({ bg1, bg2, glowColor, pillText, pillColor, centerArt }) {
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    ${commonDefs}
    <defs>
      <linearGradient id="bg-stage" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="55%" stop-color="${bg1}"/>
        <stop offset="100%" stop-color="${bg2}"/>
      </linearGradient>
      <radialGradient id="stage-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${glowColor}" stop-opacity="0.28"/>
        <stop offset="65%" stop-color="${glowColor}" stop-opacity="0.06"/>
        <stop offset="100%" stop-color="${glowColor}" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- Studio Backdrop -->
    <rect width="${W}" height="${H}" fill="url(#bg-stage)"/>
    <ellipse cx="600" cy="365" rx="460" ry="260" fill="url(#stage-glow)"/>

    <!-- Subtle Perspective Floor Grid -->
    <g stroke="${glowColor}" stroke-opacity="0.10" stroke-width="1.5">
      <line x1="200" y1="560" x2="1000" y2="560"/>
      <line x1="140" y1="620" x2="1060" y2="620"/>
      <line x1="360" y1="510" x2="240" y2="660"/>
      <line x1="600" y1="510" x2="600" y2="660"/>
      <line x1="840" y1="510" x2="960" y2="660"/>
    </g>

    <g transform="translate(600, 355)">
      <!-- 3D Pedestal Shadow & Plinth -->
      <ellipse cx="0" cy="185" rx="340" ry="52" fill="#0f172a" opacity="0.12" filter="url(#shadow-lg)"/>
      <ellipse cx="0" cy="172" rx="290" ry="40" fill="#ffffff" stroke="#e2e8f0" stroke-width="3" filter="url(#shadow-md)"/>
      <ellipse cx="0" cy="166" rx="260" ry="32" fill="${bg1}" stroke="${pillColor}" stroke-width="1.5" stroke-opacity="0.35"/>

      <!-- Main Bespoke 3D Scene -->
      ${centerArt}

      <!-- Floating Ambient 3D Spheres & Sparkles -->
      <circle cx="-275" cy="-120" r="18" fill="url(#gold-grad)" filter="url(#shadow-sm)"/>
      <circle cx="285" cy="-95" r="14" fill="${pillColor}" opacity="0.85" filter="url(#shadow-sm)"/>
      <polygon points="255,-165 260,-151 274,-146 260,-141 255,-127 250,-141 236,-146 250,-151" fill="#f59e0b"/>
      <polygon points="-245,65 -241,75 -231,79 -241,83 -245,93 -249,83 -259,79 -249,75" fill="${pillColor}"/>

      <!-- Bottom Glass Pill Badge -->
      <g transform="translate(-155, 138)" filter="url(#shadow-md)">
        <rect width="310" height="54" rx="27" fill="url(#glass-pill)" stroke="#ffffff" stroke-width="3"/>
        <rect width="310" height="54" rx="27" fill="none" stroke="${pillColor}" stroke-width="1.5" opacity="0.35"/>
        <circle cx="30" cy="27" r="15" fill="${pillColor}"/>
        <path d="M 23 27 L 28 32 L 37 22" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <text x="172" y="34" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="14" font-weight="900" fill="#0f172a" letter-spacing="1.4" text-anchor="middle">${pillText.replace(/&(?!amp;)/g, "&amp;")}</text>
      </g>
    </g>
  </svg>`;
}

const SCENES = {
  "pdf-page-number": () =>
    wrapStage({
      bg1: "#fef2f2",
      bg2: "#fee2e2",
      glowColor: "#ef4444",
      pillColor: "#dc2626",
      pillText: "AUTO PAGE NUMBERS",
      centerArt: `
        <g transform="translate(-95, -25) rotate(-8)" filter="url(#shadow-md)">
          <rect x="-90" y="-125" width="180" height="230" rx="18" fill="#ffffff" stroke="#fecaca" stroke-width="2"/>
          <rect x="-65" y="-95" width="130" height="12" rx="6" fill="#e2e8f0"/>
          <rect x="-65" y="-72" width="105" height="10" rx="5" fill="#f1f5f9"/>
          <rect x="-50" y="62" width="100" height="26" rx="8" fill="#fee2e2"/>
          <text x="0" y="80" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" fill="#dc2626" text-anchor="middle">Page 1 of 3</text>
        </g>
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-95" y="-130" width="190" height="240" rx="18" fill="#ffffff" stroke="#ef4444" stroke-width="3"/>
          <rect x="-70" y="-105" width="56" height="24" rx="6" fill="#ef4444"/>
          <text x="-42" y="-89" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="900" fill="#ffffff" text-anchor="middle">PDF</text>
          <rect x="-70" y="-65" width="140" height="12" rx="6" fill="#cbd5e1"/>
          <rect x="-70" y="-44" width="120" height="12" rx="6" fill="#e2e8f0"/>
          <rect x="-70" y="-23" width="130" height="12" rx="6" fill="#e2e8f0"/>
          <rect x="-65" y="62" width="130" height="32" rx="10" fill="url(#rose-grad)" filter="url(#shadow-sm)"/>
          <text x="0" y="83" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">Page 2 of 3</text>
        </g>
        <g transform="translate(135, -5) rotate(8)" filter="url(#shadow-md)">
          <circle cx="0" cy="0" r="46" fill="url(#gold-grad)" stroke="#ffffff" stroke-width="4"/>
          <text x="0" y="12" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">#1</text>
        </g>
      `,
    }),

  "pdf-organize-pages": () =>
    wrapStage({
      bg1: "#fff1f2",
      bg2: "#ffe4e6",
      glowColor: "#f43f5e",
      pillColor: "#e11d48",
      pillText: "SORT & REORDER PDF",
      centerArt: `
        <g transform="translate(-125, -45)" filter="url(#shadow-md)">
          <rect x="-65" y="-85" width="130" height="165" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
          <circle cx="0" cy="-20" r="22" fill="#f1f5f9"/>
          <text x="0" y="-13" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="900" fill="#475569" text-anchor="middle">1</text>
          <rect x="-42" y="25" width="84" height="10" rx="5" fill="#cbd5e1"/>
          <rect x="-42" y="42" width="64" height="10" rx="5" fill="#e2e8f0"/>
        </g>
        <g transform="translate(0, -65) rotate(-5)" filter="url(#shadow-lg)">
          <rect x="-70" y="-90" width="140" height="175" rx="16" fill="#ffffff" stroke="#e11d48" stroke-width="3.5"/>
          <circle cx="0" cy="-22" r="24" fill="url(#rose-grad)"/>
          <text x="0" y="-14" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle">3</text>
          <rect x="-45" y="24" width="90" height="10" rx="5" fill="#fecdd3"/>
          <rect x="-45" y="42" width="70" height="10" rx="5" fill="#ffe4e6"/>
        </g>
        <g transform="translate(125, -45)" filter="url(#shadow-md)">
          <rect x="-65" y="-85" width="130" height="165" rx="14" fill="#ffffff" stroke="#3b82f6" stroke-width="2.5"/>
          <circle cx="0" cy="-20" r="22" fill="url(#blue-grad)"/>
          <text x="0" y="-13" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle">2</text>
          <rect x="-42" y="25" width="84" height="10" rx="5" fill="#bfdbfe"/>
          <rect x="-42" y="42" width="64" height="10" rx="5" fill="#dbeafe"/>
        </g>
        <path d="M -20 55 Q 60 95 125 55" fill="none" stroke="#f59e0b" stroke-width="6" stroke-linecap="round" stroke-dasharray="10 6"/>
      `,
    }),

  "image-converter": () =>
    wrapStage({
      bg1: "#eff6ff",
      bg2: "#dbeafe",
      glowColor: "#3b82f6",
      pillColor: "#2563eb",
      pillText: "MULTI-FORMAT ENGINE",
      centerArt: `
        <g transform="translate(-145, -35) rotate(-8)" filter="url(#shadow-md)">
          <rect x="-80" y="-95" width="160" height="190" rx="18" fill="#ffffff" stroke="#f59e0b" stroke-width="3"/>
          <rect x="-55" y="-72" width="64" height="26" rx="7" fill="url(#gold-grad)"/>
          <text x="-23" y="-54" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="900" fill="#ffffff" text-anchor="middle">JPG</text>
          <circle cx="15" cy="-10" r="18" fill="#fde047"/>
          <polygon points="-55,65 -10,5 30,45 55,15 65,65" fill="#fb923c"/>
        </g>
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <circle cx="0" cy="0" r="64" fill="url(#blue-grad)" stroke="#ffffff" stroke-width="5"/>
          <path d="M -22 -8 L 16 -8 L 6 -20 M 22 10 L -16 10 L -6 22" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <g transform="translate(145, -35) rotate(8)" filter="url(#shadow-md)">
          <rect x="-80" y="-95" width="160" height="190" rx="18" fill="#ffffff" stroke="#10b981" stroke-width="3"/>
          <rect x="-55" y="-72" width="82" height="26" rx="7" fill="url(#emerald-grad)"/>
          <text x="-14" y="-54" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="900" fill="#ffffff" text-anchor="middle">PNG / WEBP</text>
          <circle cx="15" cy="-10" r="18" fill="#34d399"/>
          <polygon points="-55,65 -10,5 30,45 55,15 65,65" fill="#10b981"/>
        </g>
      `,
    }),

  "jpg-to-png": () =>
    wrapStage({
      bg1: "#ecfeff",
      bg2: "#cffafe",
      glowColor: "#06b6d4",
      pillColor: "#0891b2",
      pillText: "JPG TO TRANSPARENT PNG",
      centerArt: `
        <g transform="translate(-130, -30) rotate(-6)" filter="url(#shadow-lg)">
          <rect x="-85" y="-105" width="170" height="210" rx="20" fill="#ffffff" stroke="#f59e0b" stroke-width="3"/>
          <rect x="-60" y="-82" width="65" height="28" rx="8" fill="url(#gold-grad)"/>
          <text x="-27" y="-63" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">.JPG</text>
          <circle cx="20" cy="-15" r="20" fill="#fbbf24"/>
          <polygon points="-60,70 -10,5 40,55 60,25 65,70" fill="#f59e0b"/>
        </g>
        <g transform="translate(0, -30)" filter="url(#shadow-md)">
          <circle cx="0" cy="0" r="38" fill="#ffffff" stroke="#06b6d4" stroke-width="3"/>
          <path d="M -14 0 L 14 0 M 4 -10 L 14 0 L 4 10" stroke="#0891b2" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </g>
        <g transform="translate(130, -30) rotate(6)" filter="url(#shadow-lg)">
          <rect x="-85" y="-105" width="170" height="210" rx="20" fill="#ffffff" stroke="#06b6d4" stroke-width="3"/>
          <rect x="-60" y="-40" width="120" height="110" rx="12" fill="#f1f5f9" stroke="#e2e8f0"/>
          <rect x="-60" y="-82" width="65" height="28" rx="8" fill="url(#cyan-grad)"/>
          <text x="-27" y="-63" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">.PNG</text>
          <polygon points="-45,60 0,-5 45,60" fill="#06b6d4"/>
        </g>
      `,
    }),

  "png-to-jpg": () =>
    wrapStage({
      bg1: "#fffbeb",
      bg2: "#fef3c7",
      glowColor: "#f59e0b",
      pillColor: "#d97706",
      pillText: "PNG TO HIGH-RES JPG",
      centerArt: `
        <g transform="translate(-130, -30) rotate(-6)" filter="url(#shadow-lg)">
          <rect x="-85" y="-105" width="170" height="210" rx="20" fill="#ffffff" stroke="#06b6d4" stroke-width="3"/>
          <rect x="-60" y="-82" width="65" height="28" rx="8" fill="url(#cyan-grad)"/>
          <text x="-27" y="-63" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">.PNG</text>
          <polygon points="-45,60 0,-5 45,60" fill="#06b6d4"/>
        </g>
        <g transform="translate(0, -30)" filter="url(#shadow-md)">
          <circle cx="0" cy="0" r="38" fill="#ffffff" stroke="#f59e0b" stroke-width="3"/>
          <path d="M -14 0 L 14 0 M 4 -10 L 14 0 L 4 10" stroke="#d97706" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </g>
        <g transform="translate(130, -30) rotate(6)" filter="url(#shadow-lg)">
          <rect x="-85" y="-105" width="170" height="210" rx="20" fill="#ffffff" stroke="#f59e0b" stroke-width="3"/>
          <rect x="-60" y="-82" width="65" height="28" rx="8" fill="url(#gold-grad)"/>
          <text x="-27" y="-63" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">.JPG</text>
          <circle cx="22" cy="-15" r="18" fill="#f59e0b"/>
          <polygon points="-55,65 -5,0 55,65" fill="#d97706"/>
        </g>
      `,
    }),

  "png-to-webp": () =>
    wrapStage({
      bg1: "#ecfdf5",
      bg2: "#d1fae5",
      glowColor: "#10b981",
      pillColor: "#059669",
      pillText: "NEXT-GEN WEBP ENGINE",
      centerArt: `
        <g transform="translate(-130, -30) rotate(-6)" filter="url(#shadow-lg)">
          <rect x="-85" y="-105" width="170" height="210" rx="20" fill="#ffffff" stroke="#3b82f6" stroke-width="3"/>
          <rect x="-60" y="-82" width="68" height="28" rx="8" fill="url(#blue-grad)"/>
          <text x="-26" y="-63" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">.PNG</text>
          <text x="0" y="25" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="900" fill="#64748b" text-anchor="middle">2.4 MB</text>
        </g>
        <g transform="translate(0, -30)" filter="url(#shadow-md)">
          <circle cx="0" cy="0" r="40" fill="url(#emerald-grad)" stroke="#ffffff" stroke-width="4"/>
          <path d="M -6 -16 L -14 2 L 0 2 L -4 16 L 14 -4 L 0 -4 Z" fill="#ffffff"/>
        </g>
        <g transform="translate(130, -30) rotate(6)" filter="url(#shadow-lg)">
          <rect x="-85" y="-105" width="170" height="210" rx="20" fill="#ffffff" stroke="#10b981" stroke-width="3.5"/>
          <rect x="-60" y="-82" width="76" height="28" rx="8" fill="url(#emerald-grad)"/>
          <text x="-22" y="-63" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">.WEBP</text>
          <text x="0" y="18" font-family="'Plus Jakarta Sans', sans-serif" font-size="26" font-weight="900" fill="#059669" text-anchor="middle">410 KB</text>
          <text x="0" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="800" fill="#10b981" text-anchor="middle">-82% SMALLER</text>
        </g>
      `,
    }),

  "webp-to-png": () =>
    wrapStage({
      bg1: "#f0f9ff",
      bg2: "#e0f2fe",
      glowColor: "#0284c7",
      pillColor: "#0369a1",
      pillText: "WEBP TO LOSSLESS PNG",
      centerArt: `
        <g transform="translate(-130, -30) rotate(-6)" filter="url(#shadow-lg)">
          <rect x="-85" y="-105" width="170" height="210" rx="20" fill="#ffffff" stroke="#10b981" stroke-width="3"/>
          <rect x="-60" y="-82" width="76" height="28" rx="8" fill="url(#emerald-grad)"/>
          <text x="-22" y="-63" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">.WEBP</text>
          <circle cx="0" cy="15" r="36" fill="#d1fae5"/>
        </g>
        <g transform="translate(0, -30)" filter="url(#shadow-md)">
          <circle cx="0" cy="0" r="38" fill="#ffffff" stroke="#0284c7" stroke-width="3"/>
          <path d="M -14 0 L 14 0 M 4 -10 L 14 0 L 4 10" stroke="#0284c7" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </g>
        <g transform="translate(130, -30) rotate(6)" filter="url(#shadow-lg)">
          <rect x="-85" y="-105" width="170" height="210" rx="20" fill="#ffffff" stroke="#0284c7" stroke-width="3.5"/>
          <rect x="-60" y="-82" width="68" height="28" rx="8" fill="url(#cyan-grad)"/>
          <text x="-26" y="-63" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">.PNG</text>
          <rect x="-50" y="-20" width="100" height="90" rx="12" fill="#e0f2fe"/>
          <text x="0" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="900" fill="#0369a1" text-anchor="middle">LOSSLESS</text>
        </g>
      `,
    }),

  "image-upscaler": () =>
    wrapStage({
      bg1: "#f5f3ff",
      bg2: "#ede9fe",
      glowColor: "#8b5cf6",
      pillColor: "#7c3aed",
      pillText: "4X AI SUPER RESOLUTION",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-190" y="-120" width="380" height="230" rx="24" fill="#ffffff" stroke="#ddd6fe" stroke-width="3"/>
          <!-- Left SD side -->
          <rect x="-170" y="-100" width="165" height="190" rx="14" fill="#f1f5f9"/>
          <text x="-88" y="-65" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="900" fill="#64748b" text-anchor="middle">1X LOW-RES</text>
          <rect x="-135" y="-25" width="30" height="30" fill="#cbd5e1"/><rect x="-105" y="-25" width="30" height="30" fill="#94a3b8"/><rect x="-75" y="-25" width="30" height="30" fill="#cbd5e1"/>
          <rect x="-135" y="5" width="30" height="30" fill="#94a3b8"/><rect x="-105" y="5" width="30" height="30" fill="#cbd5e1"/><rect x="-75" y="5" width="30" height="30" fill="#94a3b8"/>
          <!-- Right 4K HD side -->
          <rect x="5" y="-100" width="165" height="190" rx="14" fill="#ede9fe"/>
          <text x="88" y="-65" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="900" fill="#7c3aed" text-anchor="middle">4X ULTRA HD</text>
          <circle cx="125" cy="-20" r="18" fill="url(#gold-grad)"/>
          <polygon points="25,65 75,-5 125,65" fill="url(#purple-grad)"/>
          <polygon points="75,65 115,15 155,65" fill="#6d28d9"/>
          <!-- Center Laser Divider -->
          <line x1="0" y1="-130" x2="0" y2="120" stroke="#f59e0b" stroke-width="5"/>
          <circle cx="0" cy="-5" r="22" fill="url(#gold-grad)" stroke="#ffffff" stroke-width="3"/>
          <text x="0" y="1" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="900" fill="#ffffff" text-anchor="middle">4X</text>
        </g>
      `,
    }),

  "image-blur": () =>
    wrapStage({
      bg1: "#f0f9ff",
      bg2: "#e0f2fe",
      glowColor: "#38bdf8",
      pillColor: "#0284c7",
      pillText: "GAUSSIAN BLUR STUDIO",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-165" y="-115" width="330" height="220" rx="22" fill="#ffffff" stroke="#bae6fd" stroke-width="3"/>
          <circle cx="-65" cy="-20" r="38" fill="url(#blue-grad)"/>
          <polygon points="-130,75 -55,-20 20,75" fill="#0284c7"/>
          <!-- Frosted Blur Lens Overlay on Right Half -->
          <rect x="-10" y="-95" width="155" height="180" rx="16" fill="#e0f2fe" opacity="0.88" stroke="#ffffff" stroke-width="3"/>
          <circle cx="68" cy="-15" r="38" fill="#38bdf8" opacity="0.45" filter="url(#glow)"/>
          <rect x="20" y="35" width="96" height="26" rx="13" fill="#0284c7"/>
          <text x="68" y="53" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="900" fill="#ffffff" text-anchor="middle">BLUR: 16PX</text>
        </g>
      `,
    }),

  "image-sharpen": () =>
    wrapStage({
      bg1: "#fefce8",
      bg2: "#fef08a",
      glowColor: "#eab308",
      pillColor: "#ca8a04",
      pillText: "CRISP DETAIL ENHANCER",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-160" y="-115" width="320" height="220" rx="22" fill="#ffffff" stroke="#fde047" stroke-width="3"/>
          <polygon points="-110,65 -20,-55 70,65" fill="url(#blue-grad)"/>
          <polygon points="-20,65 55,-25 130,65" fill="url(#emerald-grad)"/>
          <!-- 3D Magnifying Focus Ring -->
          <circle cx="25" cy="-10" r="68" fill="none" stroke="url(#gold-grad)" stroke-width="10" filter="url(#shadow-md)"/>
          <line x1="-15" y1="-10" x2="65" y2="-10" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4 4"/>
          <line x1="25" y1="-50" x2="25" y2="30" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4 4"/>
        </g>
      `,
    }),

  "image-color-picker": () =>
    wrapStage({
      bg1: "#fdf4ff",
      bg2: "#fae8ff",
      glowColor: "#d946ef",
      pillColor: "#c026d3",
      pillText: "HEX & RGB EYEDROPPER",
      centerArt: `
        <g transform="translate(-85, -30)" filter="url(#shadow-lg)">
          <rect x="-95" y="-105" width="190" height="210" rx="22" fill="#ffffff" stroke="#f5d0fe" stroke-width="3"/>
          <circle cx="-35" cy="-40" r="32" fill="#f43f5e"/>
          <circle cx="35" cy="-40" r="32" fill="#3b82f6"/>
          <circle cx="-35" cy="30" r="32" fill="#10b981"/>
          <circle cx="35" cy="30" r="32" fill="#f59e0b"/>
        </g>
        <g transform="translate(95, -35)" filter="url(#shadow-lg)">
          <rect x="-85" y="-95" width="170" height="190" rx="20" fill="url(#card-dark)" stroke="#e879f9" stroke-width="2.5"/>
          <rect x="-60" y="-70" width="120" height="55" rx="12" fill="#d946ef"/>
          <text x="0" y="15" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="800" fill="#ffffff" text-anchor="middle">#D946EF</text>
          <text x="0" y="45" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" fill="#cbd5e1" text-anchor="middle">RGB(217, 70, 239)</text>
        </g>
      `,
    }),

  "character-counter": () =>
    wrapStage({
      bg1: "#eff6ff",
      bg2: "#dbeafe",
      glowColor: "#3b82f6",
      pillColor: "#2563eb",
      pillText: "LIVE CHARACTER METRICS",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-175" y="-115" width="350" height="220" rx="22" fill="#ffffff" stroke="#bfdbfe" stroke-width="3"/>
          <g transform="translate(-85, -35)">
            <rect x="-65" y="-50" width="130" height="95" rx="16" fill="url(#blue-grad)"/>
            <text x="0" y="-2" font-family="'Plus Jakarta Sans', sans-serif" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle">1,480</text>
            <text x="0" y="25" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" fill="#dbeafe" text-anchor="middle">CHARACTERS</text>
          </g>
          <g transform="translate(85, -35)">
            <rect x="-65" y="-50" width="130" height="95" rx="16" fill="url(#gold-grad)"/>
            <text x="0" y="-2" font-family="'Plus Jakarta Sans', sans-serif" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle">245</text>
            <text x="0" y="25" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" fill="#fef3c7" text-anchor="middle">WORDS</text>
          </g>
          <rect x="-145" y="65" width="290" height="14" rx="7" fill="#e2e8f0"/>
          <rect x="-145" y="65" width="210" height="14" rx="7" fill="#2563eb"/>
        </g>
      `,
    }),

  "text-cleaner": () =>
    wrapStage({
      bg1: "#ecfdf5",
      bg2: "#d1fae5",
      glowColor: "#10b981",
      pillColor: "#059669",
      pillText: "STRIP SPACES & SYMBOLS",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-170" y="-115" width="340" height="220" rx="22" fill="#ffffff" stroke="#a7f3d0" stroke-width="3"/>
          <rect x="-140" y="-80" width="120" height="32" rx="8" fill="#fee2e2"/>
          <text x="-80" y="-59" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="800" fill="#dc2626" text-anchor="middle">H#e  l!l o</text>
          <circle cx="0" cy="-64" r="20" fill="url(#emerald-grad)"/>
          <path d="M -7 -64 L 7 -64 M 2 -70 L 8 -64 L 2 -58" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round"/>
          <rect x="25" y="-80" width="120" height="32" rx="8" fill="#d1fae5"/>
          <text x="85" y="-59" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="900" fill="#059669" text-anchor="middle">Hello Clean</text>
          <rect x="-140" y="-20" width="280" height="14" rx="7" fill="#10b981"/>
          <rect x="-140" y="10" width="240" height="14" rx="7" fill="#34d399"/>
          <rect x="-140" y="40" width="260" height="14" rx="7" fill="#6ee7b7"/>
        </g>
      `,
    }),

  "text-formatter": () =>
    wrapStage({
      bg1: "#f5f3ff",
      bg2: "#ede9fe",
      glowColor: "#8b5cf6",
      pillColor: "#7c3aed",
      pillText: "AUTO FORMAT & ALIGN",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-165" y="-115" width="330" height="220" rx="22" fill="#ffffff" stroke="#ddd6fe" stroke-width="3"/>
          <rect x="-135" y="-85" width="70" height="44" rx="10" fill="url(#purple-grad)"/>
          <text x="-100" y="-56" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle">Aa</text>
          <rect x="-45" y="-80" width="180" height="14" rx="7" fill="#7c3aed"/>
          <rect x="-45" y="-56" width="140" height="12" rx="6" fill="#c4b5fd"/>
          <rect x="-135" y="-15" width="270" height="12" rx="6" fill="#cbd5e1"/>
          <rect x="-135" y="10" width="270" height="12" rx="6" fill="#cbd5e1"/>
          <rect x="-135" y="35" width="210" height="12" rx="6" fill="#cbd5e1"/>
          <rect x="-135" y="60" width="250" height="12" rx="6" fill="#cbd5e1"/>
        </g>
      `,
    }),

  "remove-duplicate-lines": () =>
    wrapStage({
      bg1: "#fff1f2",
      bg2: "#ffe4e6",
      glowColor: "#f43f5e",
      pillColor: "#e11d48",
      pillText: "DEDUPLICATE LINES",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-165" y="-115" width="330" height="220" rx="22" fill="#ffffff" stroke="#fecdd3" stroke-width="3"/>
          <rect x="-135" y="-80" width="270" height="34" rx="10" fill="#d1fae5"/>
          <text x="-115" y="-58" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="800" fill="#059669">✓ apple@example.com</text>
          <rect x="-135" y="-32" width="270" height="34" rx="10" fill="#fee2e2" stroke="#f43f5e" stroke-dasharray="6 4"/>
          <text x="-115" y="-10" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="800" fill="#e11d48" text-decoration="line-through">✕ apple@example.com (DUP)</text>
          <rect x="-135" y="16" width="270" height="34" rx="10" fill="#d1fae5"/>
          <text x="-115" y="38" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="800" fill="#059669">✓ orange@example.com</text>
        </g>
      `,
    }),

  "text-sorter": () =>
    wrapStage({
      bg1: "#eff6ff",
      bg2: "#dbeafe",
      glowColor: "#2563eb",
      pillColor: "#1d4ed8",
      pillText: "SORT A-Z & NUMERIC",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-165" y="-115" width="330" height="220" rx="22" fill="#ffffff" stroke="#bfdbfe" stroke-width="3"/>
          <g transform="translate(-100, 0)">
            <rect x="-40" y="-80" width="80" height="46" rx="12" fill="url(#blue-grad)"/>
            <text x="0" y="-50" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle">A → Z</text>
            <rect x="-40" y="-10" width="80" height="46" rx="12" fill="url(#gold-grad)"/>
            <text x="0" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle">1 → 9</text>
          </g>
          <rect x="0" y="-75" width="135" height="22" rx="8" fill="#dbeafe"/>
          <rect x="0" y="-38" width="135" height="22" rx="8" fill="#bfdbfe"/>
          <rect x="0" y="-1" width="135" height="22" rx="8" fill="#93c5fd"/>
          <rect x="0" y="36" width="135" height="22" rx="8" fill="#60a5fa"/>
        </g>
      `,
    }),

  "find-replace": () =>
    wrapStage({
      bg1: "#fffbeb",
      bg2: "#fef3c7",
      glowColor: "#f59e0b",
      pillColor: "#d97706",
      pillText: "FIND & REPLACE REGEX",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-170" y="-115" width="340" height="220" rx="22" fill="#ffffff" stroke="#fde68a" stroke-width="3"/>
          <rect x="-140" y="-75" width="115" height="42" rx="10" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
          <text x="-82" y="-49" font-family="'JetBrains Mono', monospace" font-size="15" font-weight="800" fill="#dc2626" text-anchor="middle">"foo_old"</text>
          <path d="M -12 -54 L 18 -54 M 8 -62 L 18 -54 L 8 -46" stroke="#d97706" stroke-width="4" fill="none" stroke-linecap="round"/>
          <rect x="30" y="-75" width="115" height="42" rx="10" fill="#d1fae5" stroke="#10b981" stroke-width="2"/>
          <text x="87" y="-49" font-family="'JetBrains Mono', monospace" font-size="15" font-weight="800" fill="#059669" text-anchor="middle">"bar_new"</text>
          <rect x="-140" y="-5" width="285" height="36" rx="10" fill="#f8fafc" stroke="#e2e8f0"/>
          <text x="0" y="18" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#475569" text-anchor="middle">/([a-z0-9_]+)/gi → MATCHED</text>
        </g>
      `,
    }),

  "line-counter": () =>
    wrapStage({
      bg1: "#f0fdf4",
      bg2: "#dcfce7",
      glowColor: "#22c55e",
      pillColor: "#16a34a",
      pillText: "INSTANT LINE COUNTER",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-165" y="-115" width="330" height="220" rx="22" fill="url(#card-dark)" stroke="#4ade80" stroke-width="2.5"/>
          <g font-family="'JetBrains Mono', monospace" font-size="15" font-weight="800" fill="#4ade80">
            <text x="-135" y="-62">01</text>
            <text x="-135" y="-27">02</text>
            <text x="-135" y="8">03</text>
            <text x="-135" y="43">04</text>
          </g>
          <rect x="-95" y="-75" width="190" height="14" rx="7" fill="#38bdf8"/>
          <rect x="-95" y="-40" width="150" height="14" rx="7" fill="#94a3b8"/>
          <rect x="-95" y="-5" width="210" height="14" rx="7" fill="#facc15"/>
          <rect x="-95" y="30" width="130" height="14" rx="7" fill="#4ade80"/>
        </g>
      `,
    }),

  "random-text-generator": () =>
    wrapStage({
      bg1: "#faf5ff",
      bg2: "#f3e8ff",
      glowColor: "#a855f7",
      pillColor: "#9333ea",
      pillText: "LOREM IPSUM GENERATOR",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-165" y="-115" width="330" height="220" rx="22" fill="#ffffff" stroke="#e9d5ff" stroke-width="3"/>
          <rect x="-135" y="-85" width="160" height="32" rx="8" fill="url(#purple-grad)"/>
          <text x="-55" y="-64" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">LOREM IPSUM</text>
          <rect x="-135" y="-35" width="270" height="12" rx="6" fill="#cbd5e1"/>
          <rect x="-135" y="-12" width="250" height="12" rx="6" fill="#e2e8f0"/>
          <rect x="-135" y="11" width="265" height="12" rx="6" fill="#e2e8f0"/>
          <rect x="-135" y="34" width="200" height="12" rx="6" fill="#cbd5e1"/>
        </g>
      `,
    }),

  "barcode-generator": () =>
    wrapStage({
      bg1: "#f8fafc",
      bg2: "#e2e8f0",
      glowColor: "#3b82f6",
      pillColor: "#1e293b",
      pillText: "CODE-128 & EAN BARCODE",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-175" y="-110" width="350" height="210" rx="22" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
          <g fill="#0f172a" transform="translate(-125, -75)">
            <rect x="0" y="0" width="8" height="115"/><rect x="14" y="0" width="4" height="115"/><rect x="24" y="0" width="12" height="115"/>
            <rect x="44" y="0" width="6" height="115"/><rect x="56" y="0" width="4" height="115"/><rect x="68" y="0" width="14" height="115"/>
            <rect x="90" y="0" width="6" height="115"/><rect x="102" y="0" width="10" height="115"/><rect x="120" y="0" width="4" height="115"/>
            <rect x="132" y="0" width="12" height="115"/><rect x="152" y="0" width="6" height="115"/><rect x="164" y="0" width="8" height="115"/>
            <rect x="180" y="0" width="14" height="115"/><rect x="202" y="0" width="4" height="115"/><rect x="212" y="0" width="10" height="115"/>
            <rect x="230" y="0" width="6" height="115"/><rect x="242" y="0" width="8" height="115"/>
          </g>
          <!-- Glowing Red Scanner Laser Line -->
          <line x1="-155" y1="-18" x2="155" y2="-18" stroke="#ef4444" stroke-width="5" filter="url(#glow)"/>
          <text x="0" y="72" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="800" fill="#0f172a" letter-spacing="6" text-anchor="middle">978020137962</text>
        </g>
      `,
    }),

  "uuid-generator": () =>
    wrapStage({
      bg1: "#eef2ff",
      bg2: "#e0e7ff",
      glowColor: "#6366f1",
      pillColor: "#4f46e5",
      pillText: "CRYPTO UUID V4 ENGINE",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-185" y="-105" width="370" height="200" rx="22" fill="url(#card-dark)" stroke="#818cf8" stroke-width="3"/>
          <rect x="-70" y="-75" width="140" height="30" rx="8" fill="#4f46e5"/>
          <text x="0" y="-55" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="900" fill="#ffffff" text-anchor="middle">RFC 4122 UUID v4</text>
          <text x="0" y="5" font-family="'JetBrains Mono', monospace" font-size="17" font-weight="800" fill="#38bdf8" text-anchor="middle">550e8400-e29b-41d4</text>
          <text x="0" y="34" font-family="'JetBrains Mono', monospace" font-size="17" font-weight="800" fill="#a5b4fc" text-anchor="middle">-a716-446655440000</text>
        </g>
      `,
    }),

  "json-validator": () =>
    wrapStage({
      bg1: "#ecfdf5",
      bg2: "#d1fae5",
      glowColor: "#10b981",
      pillColor: "#059669",
      pillText: "SYNTAX & SCHEMA CHECK",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-170" y="-115" width="340" height="220" rx="22" fill="url(#card-dark)" stroke="#10b981" stroke-width="3"/>
          <text x="-95" y="15" font-family="'JetBrains Mono', monospace" font-size="74" font-weight="900" fill="#38bdf8" text-anchor="middle">{ }</text>
          <circle cx="65" cy="-5" r="52" fill="url(#emerald-grad)" stroke="#ffffff" stroke-width="4"/>
          <path d="M 42 -5 L 58 12 L 90 -22" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </g>
      `,
    }),

  "xml-formatter": () =>
    wrapStage({
      bg1: "#eff6ff",
      bg2: "#dbeafe",
      glowColor: "#3b82f6",
      pillColor: "#2563eb",
      pillText: "BEAUTIFY XML TREE",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-170" y="-115" width="340" height="220" rx="22" fill="url(#card-dark)" stroke="#60a5fa" stroke-width="3"/>
          <text x="-135" y="-55" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="800" fill="#38bdf8">&lt;root&gt;</text>
          <text x="-105" y="-15" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="800" fill="#facc15">&lt;item id="1"&gt;</text>
          <text x="-75" y="20" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="700" fill="#4ade80">ToolNami XML</text>
          <text x="-105" y="55" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="800" fill="#facc15">&lt;/item&gt;</text>
        </g>
      `,
    }),

  "url-encoder": () =>
    wrapStage({
      bg1: "#f0f9ff",
      bg2: "#e0f2fe",
      glowColor: "#0284c7",
      pillColor: "#0369a1",
      pillText: "PERCENT URL ENCODER",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-180" y="-100" width="360" height="190" rx="22" fill="#ffffff" stroke="#7dd3fc" stroke-width="3"/>
          <rect x="-150" y="-65" width="300" height="46" rx="12" fill="#f1f5f9"/>
          <text x="0" y="-36" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="800" fill="#334155" text-anchor="middle">https://site.com/a b?x=1</text>
          <rect x="-150" y="5" width="300" height="50" rx="12" fill="url(#cyan-grad)"/>
          <text x="0" y="36" font-family="'JetBrains Mono', monospace" font-size="17" font-weight="900" fill="#ffffff" text-anchor="middle">%3A%2F%2Fsite.com%2Fa%20b</text>
        </g>
      `,
    }),

  "url-decoder": () =>
    wrapStage({
      bg1: "#ecfdf5",
      bg2: "#d1fae5",
      glowColor: "#10b981",
      pillColor: "#059669",
      pillText: "CLEAN URL DECODER",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-180" y="-100" width="360" height="190" rx="22" fill="#ffffff" stroke="#6ee7b7" stroke-width="3"/>
          <rect x="-150" y="-65" width="300" height="46" rx="12" fill="#fee2e2"/>
          <text x="0" y="-36" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="800" fill="#dc2626" text-anchor="middle">https%3A%2F%2Ftoolnami.com</text>
          <rect x="-150" y="5" width="300" height="50" rx="12" fill="url(#emerald-grad)"/>
          <text x="0" y="36" font-family="'JetBrains Mono', monospace" font-size="17" font-weight="900" fill="#ffffff" text-anchor="middle">https://toolnami.com</text>
        </g>
      `,
    }),

  "html-formatter": () =>
    wrapStage({
      bg1: "#fff7ed",
      bg2: "#ffedd5",
      glowColor: "#f97316",
      pillColor: "#ea580c",
      pillText: "HTML5 INDENT & CLEAN",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-170" y="-115" width="340" height="220" rx="22" fill="url(#card-dark)" stroke="#fb923c" stroke-width="3"/>
          <text x="0" y="20" font-family="'JetBrains Mono', monospace" font-size="68" font-weight="900" fill="#fb923c" text-anchor="middle">&lt;/&gt;</text>
          <rect x="-70" y="-85" width="140" height="28" rx="8" fill="#ea580c"/>
          <text x="0" y="-66" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="900" fill="#ffffff" text-anchor="middle">HTML5 BEAUTIFIER</text>
        </g>
      `,
    }),

  "css-minifier": () =>
    wrapStage({
      bg1: "#eff6ff",
      bg2: "#dbeafe",
      glowColor: "#3b82f6",
      pillColor: "#2563eb",
      pillText: "COMPRESS CSS BUNDLES",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-165" y="-110" width="330" height="210" rx="22" fill="url(#card-dark)" stroke="#3b82f6" stroke-width="3"/>
          <text x="0" y="-25" font-family="'JetBrains Mono', monospace" font-size="46" font-weight="900" fill="#60a5fa" text-anchor="middle">.min.css</text>
          <rect x="-95" y="20" width="190" height="40" rx="12" fill="url(#emerald-grad)"/>
          <text x="0" y="46" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="900" fill="#ffffff" text-anchor="middle">-68% SMALLER</text>
        </g>
      `,
    }),

  "javascript-minifier": () =>
    wrapStage({
      bg1: "#fefce8",
      bg2: "#fef08a",
      glowColor: "#eab308",
      pillColor: "#ca8a04",
      pillText: "MINIFY JS PAYLOADS",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-165" y="-110" width="330" height="210" rx="22" fill="url(#card-dark)" stroke="#facc15" stroke-width="3"/>
          <rect x="-45" y="-80" width="90" height="65" rx="14" fill="url(#gold-grad)"/>
          <text x="0" y="-34" font-family="'Plus Jakarta Sans', sans-serif" font-size="34" font-weight="900" fill="#0f172a" text-anchor="middle">JS</text>
          <text x="0" y="42" font-family="'JetBrains Mono', monospace" font-size="24" font-weight="900" fill="#fde047" text-anchor="middle">app.min.js ⚡</text>
        </g>
      `,
    }),

  "robots-txt-generator": () =>
    wrapStage({
      bg1: "#f0fdf4",
      bg2: "#dcfce7",
      glowColor: "#10b981",
      pillColor: "#059669",
      pillText: "SEO CRAWLER DIRECTIVES",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-175" y="-110" width="350" height="210" rx="22" fill="url(#card-dark)" stroke="#34d399" stroke-width="3"/>
          <text x="-135" y="-50" font-family="'JetBrains Mono', monospace" font-size="17" font-weight="800" fill="#38bdf8">User-agent: *</text>
          <text x="-135" y="-12" font-family="'JetBrains Mono', monospace" font-size="17" font-weight="800" fill="#4ade80">Allow: /</text>
          <text x="-135" y="26" font-family="'JetBrains Mono', monospace" font-size="17" font-weight="800" fill="#f87171">Disallow: /admin/</text>
          <text x="-135" y="64" font-family="'JetBrains Mono', monospace" font-size="15" font-weight="700" fill="#facc15">Sitemap: /sitemap.xml</text>
        </g>
      `,
    }),

  "bmi-calculator": () =>
    wrapStage({
      bg1: "#ecfdf5",
      bg2: "#d1fae5",
      glowColor: "#10b981",
      pillColor: "#059669",
      pillText: "BODY MASS INDEX HEALTH",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-165" y="-115" width="330" height="220" rx="24" fill="#ffffff" stroke="#a7f3d0" stroke-width="3"/>
          <circle cx="0" cy="-20" r="68" fill="none" stroke="#e2e8f0" stroke-width="16"/>
          <circle cx="0" cy="-20" r="68" fill="none" stroke="#10b981" stroke-width="16" stroke-dasharray="260 400"/>
          <text x="0" y="-12" font-family="'Plus Jakarta Sans', sans-serif" font-size="32" font-weight="900" fill="#059669" text-anchor="middle">22.4</text>
          <text x="0" y="14" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="800" fill="#10b981" text-anchor="middle">HEALTHY BMI</text>
        </g>
      `,
    }),

  "gst-calculator": () =>
    wrapStage({
      bg1: "#eff6ff",
      bg2: "#dbeafe",
      glowColor: "#2563eb",
      pillColor: "#1d4ed8",
      pillText: "GST INCLUSIVE & EXCLUSIVE",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-170" y="-115" width="340" height="220" rx="22" fill="#ffffff" stroke="#bfdbfe" stroke-width="3"/>
          <rect x="-135" y="-80" width="125" height="65" rx="14" fill="url(#blue-grad)"/>
          <text x="-72" y="-38" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">18%</text>
          <rect x="10" y="-80" width="125" height="65" rx="14" fill="url(#gold-grad)"/>
          <text x="72" y="-38" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="900" fill="#ffffff" text-anchor="middle">GST</text>
          <rect x="-135" y="10" width="270" height="58" rx="14" fill="#f1f5f9"/>
          <text x="0" y="46" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="900" fill="#0f172a" text-anchor="middle">CGST 9% + SGST 9%</text>
        </g>
      `,
    }),

  "discount-calculator": () =>
    wrapStage({
      bg1: "#fff1f2",
      bg2: "#ffe4e6",
      glowColor: "#f43f5e",
      pillColor: "#e11d48",
      pillText: "SALE & SAVINGS CALCULATOR",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-165" y="-110" width="330" height="210" rx="24" fill="url(#rose-grad)" stroke="#ffffff" stroke-width="4"/>
          <circle cx="-125" cy="0" r="14" fill="#ffffff"/>
          <text x="15" y="-10" font-family="'Plus Jakarta Sans', sans-serif" font-size="56" font-weight="900" fill="#ffffff" text-anchor="middle">50% OFF</text>
          <rect x="-85" y="25" width="190" height="38" rx="12" fill="#ffffff"/>
          <text x="10" y="50" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="900" fill="#e11d48" text-anchor="middle">INSTANT SAVINGS</text>
        </g>
      `,
    }),

  "loan-calculator": () =>
    wrapStage({
      bg1: "#f0fdf4",
      bg2: "#dcfce7",
      glowColor: "#10b981",
      pillColor: "#059669",
      pillText: "LOAN PAYOFF & INTEREST",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-170" y="-115" width="340" height="220" rx="22" fill="#ffffff" stroke="#a7f3d0" stroke-width="3"/>
          <text x="0" y="-55" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" fill="#64748b" text-anchor="middle">MONTHLY INSTALLMENT</text>
          <text x="0" y="-8" font-family="'Plus Jakarta Sans', sans-serif" font-size="42" font-weight="900" fill="#059669" text-anchor="middle">$1,245 / mo</text>
          <rect x="-135" y="25" width="185" height="24" rx="8" fill="#10b981"/>
          <rect x="55" y="25" width="80" height="24" rx="8" fill="#f59e0b"/>
        </g>
      `,
    }),

  "investment-calculator": () =>
    wrapStage({
      bg1: "#ecfdf5",
      bg2: "#d1fae5",
      glowColor: "#10b981",
      pillColor: "#059669",
      pillText: "ROI & WEALTH PROJECTOR",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-170" y="-115" width="340" height="220" rx="22" fill="#ffffff" stroke="#a7f3d0" stroke-width="3"/>
          <rect x="-120" y="20" width="42" height="55" rx="8" fill="#6ee7b7"/>
          <rect x="-55" y="-10" width="42" height="85" rx="8" fill="#34d399"/>
          <rect x="10" y="-45" width="42" height="120" rx="8" fill="#10b981"/>
          <rect x="75" y="-85" width="42" height="160" rx="8" fill="url(#gold-grad)"/>
          <path d="M -110 5 L -35 -25 L 30 -60 L 95 -95" fill="none" stroke="#059669" stroke-width="6" stroke-linecap="round"/>
        </g>
      `,
    }),

  "time-converter": () =>
    wrapStage({
      bg1: "#eff6ff",
      bg2: "#dbeafe",
      glowColor: "#3b82f6",
      pillColor: "#2563eb",
      pillText: "DAYS • HOURS • MINUTES • SEC",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <circle cx="0" cy="-10" r="95" fill="#ffffff" stroke="#3b82f6" stroke-width="8"/>
          <circle cx="0" cy="-10" r="8" fill="#1e293b"/>
          <line x1="0" y1="-10" x2="0" y2="-65" stroke="#2563eb" stroke-width="7" stroke-linecap="round"/>
          <line x1="0" y1="-10" x2="48" y2="12" stroke="#f59e0b" stroke-width="6" stroke-linecap="round"/>
        </g>
      `,
    }),

  "random-number-generator": () =>
    wrapStage({
      bg1: "#f5f3ff",
      bg2: "#ede9fe",
      glowColor: "#8b5cf6",
      pillColor: "#7c3aed",
      pillText: "TRUE CRYPTO RNG PICKER",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-165" y="-105" width="330" height="200" rx="26" fill="url(#purple-grad)" stroke="#ffffff" stroke-width="4"/>
          <text x="0" y="22" font-family="'Plus Jakarta Sans', sans-serif" font-size="82" font-weight="900" fill="#ffffff" text-anchor="middle">742</text>
        </g>
      `,
    }),

  "dice-roller": () =>
    wrapStage({
      bg1: "#fff1f2",
      bg2: "#ffe4e6",
      glowColor: "#f43f5e",
      pillColor: "#e11d48",
      pillText: "3D MULTI-DICE ROLLER",
      centerArt: `
        <g transform="translate(-85, -35) rotate(-12)" filter="url(#shadow-lg)">
          <rect x="-65" y="-65" width="130" height="130" rx="24" fill="url(#rose-grad)" stroke="#ffffff" stroke-width="4"/>
          <circle cx="-30" cy="-30" r="10" fill="#ffffff"/><circle cx="30" cy="-30" r="10" fill="#ffffff"/>
          <circle cx="0" cy="0" r="10" fill="#ffffff"/>
          <circle cx="-30" cy="30" r="10" fill="#ffffff"/><circle cx="30" cy="30" r="10" fill="#ffffff"/>
        </g>
        <g transform="translate(85, -25) rotate(14)" filter="url(#shadow-lg)">
          <rect x="-65" y="-65" width="130" height="130" rx="24" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/>
          <circle cx="-30" cy="-30" r="10" fill="#e11d48"/><circle cx="30" cy="-30" r="10" fill="#e11d48"/>
          <circle cx="-30" cy="0" r="10" fill="#e11d48"/><circle cx="30" cy="0" r="10" fill="#e11d48"/>
          <circle cx="-30" cy="30" r="10" fill="#e11d48"/><circle cx="30" cy="30" r="10" fill="#e11d48"/>
        </g>
      `,
    }),

  "internet-speed-test": () =>
    wrapStage({
      bg1: "#ecfeff",
      bg2: "#cffafe",
      glowColor: "#06b6d4",
      pillColor: "#0891b2",
      pillText: "BANDWIDTH & LATENCY TEST",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-175" y="-115" width="350" height="220" rx="24" fill="url(#card-dark)" stroke="#22d3ee" stroke-width="3"/>
          <path d="M -95 45 A 95 95 0 0 1 95 45" fill="none" stroke="#334155" stroke-width="18" stroke-linecap="round"/>
          <path d="M -95 45 A 95 95 0 0 1 75 -15" fill="none" stroke="url(#cyan-grad)" stroke-width="18" stroke-linecap="round"/>
          <text x="0" y="35" font-family="'Plus Jakarta Sans', sans-serif" font-size="42" font-weight="900" fill="#ffffff" text-anchor="middle">840</text>
          <text x="0" y="62" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" fill="#22d3ee" text-anchor="middle">MBPS DOWNLOAD</text>
        </g>
      `,
    }),

  "ai-content-writer": () =>
    wrapStage({
      bg1: "#faf5ff",
      bg2: "#f3e8ff",
      glowColor: "#9333ea",
      pillColor: "#7e22ce",
      pillText: "AI COPYWRITING STUDIO",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-170" y="-115" width="340" height="220" rx="22" fill="#ffffff" stroke="#d8b4fe" stroke-width="3"/>
          <rect x="-135" y="-85" width="120" height="30" rx="8" fill="url(#purple-grad)"/>
          <text x="-75" y="-65" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="900" fill="#ffffff" text-anchor="middle">✨ AI DRAFT</text>
          <rect x="-135" y="-38" width="270" height="14" rx="7" fill="#9333ea"/>
          <rect x="-135" y="-12" width="230" height="12" rx="6" fill="#cbd5e1"/>
          <rect x="-135" y="12" width="250" height="12" rx="6" fill="#cbd5e1"/>
          <rect x="-135" y="36" width="190" height="12" rx="6" fill="#cbd5e1"/>
        </g>
      `,
    }),

  "ai-title-generator": () =>
    wrapStage({
      bg1: "#fffbeb",
      bg2: "#fef3c7",
      glowColor: "#f59e0b",
      pillColor: "#d97706",
      pillText: "HIGH-CTR HEADLINE AI",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-175" y="-110" width="350" height="210" rx="22" fill="#ffffff" stroke="#fde68a" stroke-width="3"/>
          <rect x="-145" y="-75" width="290" height="46" rx="12" fill="url(#gold-grad)"/>
          <text x="0" y="-46" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="900" fill="#ffffff" text-anchor="middle">🔥 #1 Viral Headline Hook</text>
          <rect x="-145" y="-10" width="290" height="40" rx="10" fill="#fef3c7"/>
          <text x="0" y="15" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" fill="#b45309" text-anchor="middle">CTR Score: 98/100 • SEO Optimized</text>
        </g>
      `,
    }),

  "pomodoro-timer": () =>
    wrapStage({
      bg1: "#fff1f2",
      bg2: "#ffe4e6",
      glowColor: "#f43f5e",
      pillColor: "#e11d48",
      pillText: "25:00 FOCUS TIMER",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <circle cx="0" cy="-10" r="102" fill="url(#rose-grad)" stroke="#ffffff" stroke-width="6"/>
          <circle cx="0" cy="-10" r="84" fill="none" stroke="#fecdd3" stroke-width="4" stroke-dasharray="12 8"/>
          <text x="0" y="8" font-family="'JetBrains Mono', monospace" font-size="48" font-weight="900" fill="#ffffff" text-anchor="middle">25:00</text>
          <text x="0" y="38" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" fill="#ffe4e6" letter-spacing="2" text-anchor="middle">DEEP WORK</text>
        </g>
      `,
    }),

  "stopwatch-timer": () =>
    wrapStage({
      bg1: "#eff6ff",
      bg2: "#dbeafe",
      glowColor: "#3b82f6",
      pillColor: "#2563eb",
      pillText: "MILLISECOND LAP TIMER",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-175" y="-105" width="350" height="200" rx="24" fill="url(#card-dark)" stroke="#60a5fa" stroke-width="3"/>
          <text x="0" y="0" font-family="'JetBrains Mono', monospace" font-size="52" font-weight="900" fill="#38bdf8" text-anchor="middle">00:42.89</text>
          <rect x="-110" y="30" width="100" height="32" rx="10" fill="#2563eb"/>
          <text x="-60" y="51" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="800" fill="#ffffff" text-anchor="middle">LAP 1</text>
          <rect x="10" y="30" width="100" height="32" rx="10" fill="#10b981"/>
          <text x="60" y="51" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="800" fill="#ffffff" text-anchor="middle">START</text>
        </g>
      `,
    }),

  "markdown-to-html": () =>
    wrapStage({
      bg1: "#f5f3ff",
      bg2: "#ede9fe",
      glowColor: "#8b5cf6",
      pillColor: "#7c3aed",
      pillText: "MARKDOWN TO HTML5",
      centerArt: `
        <g transform="translate(-115, -35)" filter="url(#shadow-lg)">
          <rect x="-95" y="-100" width="190" height="195" rx="18" fill="url(#card-dark)" stroke="#a78bfa" stroke-width="2.5"/>
          <text x="-70" y="-45" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="800" fill="#c084fc"># Heading</text>
          <text x="-70" y="-10" font-family="'JetBrains Mono', monospace" font-size="15" font-weight="700" fill="#cbd5e1">**Bold Text**</text>
          <text x="-70" y="25" font-family="'JetBrains Mono', monospace" font-size="15" font-weight="700" fill="#38bdf8">- List item</text>
        </g>
        <g transform="translate(115, -35)" filter="url(#shadow-lg)">
          <rect x="-95" y="-100" width="190" height="195" rx="18" fill="#ffffff" stroke="#7c3aed" stroke-width="2.5"/>
          <text x="-70" y="-45" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="800" fill="#7c3aed">&lt;h1&gt;Title&lt;/h1&gt;</text>
          <text x="-70" y="-10" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#334155">&lt;strong&gt;Bold&lt;/strong&gt;</text>
          <text x="-70" y="25" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#059669">&lt;li&gt;Item&lt;/li&gt;</text>
        </g>
      `,
    }),

  "csv-to-json": () =>
    wrapStage({
      bg1: "#ecfdf5",
      bg2: "#d1fae5",
      glowColor: "#10b981",
      pillColor: "#059669",
      pillText: "CSV TABLE TO JSON API",
      centerArt: `
        <g transform="translate(-115, -35)" filter="url(#shadow-lg)">
          <rect x="-95" y="-100" width="190" height="195" rx="18" fill="#ffffff" stroke="#10b981" stroke-width="3"/>
          <rect x="-75" y="-75" width="150" height="28" rx="6" fill="url(#emerald-grad)"/>
          <text x="0" y="-56" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="900" fill="#ffffff" text-anchor="middle">id,name,role</text>
          <text x="0" y="-15" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="700" fill="#334155" text-anchor="middle">1,Alex,Admin</text>
          <text x="0" y="18" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="700" fill="#334155" text-anchor="middle">2,Sara,Lead</text>
        </g>
        <g transform="translate(115, -35)" filter="url(#shadow-lg)">
          <rect x="-95" y="-100" width="190" height="195" rx="18" fill="url(#card-dark)" stroke="#38bdf8" stroke-width="2.5"/>
          <text x="-70" y="-45" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="800" fill="#facc15">[{</text>
          <text x="-55" y="-15" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="700" fill="#38bdf8">"id": 1,</text>
          <text x="-55" y="12" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="700" fill="#4ade80">"name": "Alex"</text>
          <text x="-70" y="42" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="800" fill="#facc15">}]</text>
        </g>
      `,
    }),

  "diff-checker": () =>
    wrapStage({
      bg1: "#eff6ff",
      bg2: "#dbeafe",
      glowColor: "#3b82f6",
      pillColor: "#2563eb",
      pillText: "SIDE-BY-SIDE TEXT DIFF",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-175" y="-110" width="350" height="210" rx="22" fill="#ffffff" stroke="#bfdbfe" stroke-width="3"/>
          <rect x="-145" y="-75" width="290" height="36" rx="8" fill="#fee2e2"/>
          <text x="-125" y="-52" font-family="'JetBrains Mono', monospace" font-size="15" font-weight="800" fill="#dc2626">- const status = "draft";</text>
          <rect x="-145" y="-25" width="290" height="36" rx="8" fill="#dcfce7"/>
          <text x="-125" y="-2" font-family="'JetBrains Mono', monospace" font-size="15" font-weight="800" fill="#16a34a">+ const status = "live";</text>
          <rect x="-145" y="25" width="290" height="32" rx="8" fill="#f1f5f9"/>
          <text x="-125" y="46" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#64748b">  export default status;</text>
        </g>
      `,
    }),

  "jwt-decoder": () =>
    wrapStage({
      bg1: "#fdf2f8",
      bg2: "#fce7f3",
      glowColor: "#ec4899",
      pillColor: "#db2777",
      pillText: "DECODE JWT CLAIMS",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-175" y="-110" width="350" height="210" rx="22" fill="url(#card-dark)" stroke="#f472b6" stroke-width="3"/>
          <text x="0" y="-55" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="900" text-anchor="middle">
            <tspan fill="#fb7185">eyJhbG</tspan><tspan fill="#ffffff">.</tspan><tspan fill="#c084fc">eyJzdWI</tspan><tspan fill="#ffffff">.</tspan><tspan fill="#38bdf8">SflKxw</tspan>
          </text>
          <rect x="-140" y="-25" width="280" height="95" rx="14" fill="#1e293b" stroke="#c084fc" stroke-width="1.5"/>
          <text x="0" y="8" font-family="'JetBrains Mono', monospace" font-size="15" font-weight="800" fill="#c084fc" text-anchor="middle">{ "sub": "1234567890",</text>
          <text x="0" y="36" font-family="'JetBrains Mono', monospace" font-size="15" font-weight="800" fill="#4ade80" text-anchor="middle">  "role": "admin" }</text>
        </g>
      `,
    }),

  "cron-expression-generator": () =>
    wrapStage({
      bg1: "#f0f9ff",
      bg2: "#e0f2fe",
      glowColor: "#0284c7",
      pillColor: "#0369a1",
      pillText: "CRONTAB SCHEDULE BUILDER",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-180" y="-105" width="360" height="200" rx="22" fill="url(#card-dark)" stroke="#38bdf8" stroke-width="3"/>
          <g transform="translate(0, -25)" font-family="'JetBrains Mono', monospace" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">
            <rect x="-145" y="-35" width="50" height="58" rx="10" fill="#0284c7"/><text x="-120" y="4">0</text>
            <rect x="-85" y="-35" width="50" height="58" rx="10" fill="#0284c7"/><text x="-60" y="4">9</text>
            <rect x="-25" y="-35" width="50" height="58" rx="10" fill="#334155"/><text x="0" y="4">*</text>
            <rect x="35" y="-35" width="50" height="58" rx="10" fill="#334155"/><text x="60" y="4">*</text>
            <rect x="95" y="-35" width="60" height="58" rx="10" fill="#f59e0b"/><text x="125" y="4" font-size="22">1-5</text>
          </g>
          <text x="0" y="52" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="800" fill="#38bdf8" text-anchor="middle">AT 09:00 AM • MONDAY THROUGH FRIDAY</text>
        </g>
      `,
    }),

  "compound-interest-calculator": () =>
    wrapStage({
      bg1: "#ecfdf5",
      bg2: "#d1fae5",
      glowColor: "#10b981",
      pillColor: "#059669",
      pillText: "COMPOUND WEALTH GROWTH",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-175" y="-115" width="350" height="220" rx="22" fill="#ffffff" stroke="#6ee7b7" stroke-width="3"/>
          <rect x="-130" y="30" width="36" height="45" rx="6" fill="#a7f3d0"/>
          <rect x="-75" y="5" width="36" height="70" rx="6" fill="#6ee7b7"/>
          <rect x="-20" y="-28" width="36" height="103" rx="6" fill="#34d399"/>
          <rect x="35" y="-65" width="36" height="140" rx="6" fill="#10b981"/>
          <rect x="90" y="-95" width="36" height="170" rx="6" fill="url(#gold-grad)"/>
          <text x="-45" y="-60" font-family="'Plus Jakarta Sans', sans-serif" font-size="26" font-weight="900" fill="#059669">$248,500</text>
        </g>
      `,
    }),

  "salary-calculator": () =>
    wrapStage({
      bg1: "#eff6ff",
      bg2: "#dbeafe",
      glowColor: "#2563eb",
      pillColor: "#1d4ed8",
      pillText: "CTC TO IN-HAND SALARY",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-175" y="-110" width="350" height="210" rx="22" fill="#ffffff" stroke="#93c5fd" stroke-width="3"/>
          <rect x="-145" y="-80" width="290" height="72" rx="14" fill="url(#emerald-grad)"/>
          <text x="0" y="-52" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" fill="#d1fae5" text-anchor="middle">MONTHLY NET TAKE-HOME</text>
          <text x="0" y="-22" font-family="'Plus Jakarta Sans', sans-serif" font-size="30" font-weight="900" fill="#ffffff" text-anchor="middle">$6,840 / mo</text>
          <rect x="-145" y="10" width="138" height="48" rx="10" fill="#eff6ff"/>
          <text x="-76" y="39" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" fill="#1d4ed8" text-anchor="middle">PF: 12%</text>
          <rect x="7" y="10" width="138" height="48" rx="10" fill="#fef3c7"/>
          <text x="76" y="39" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" fill="#b45309" text-anchor="middle">TAX SLAB</text>
        </g>
      `,
    }),

  "aspect-ratio-calculator": () =>
    wrapStage({
      bg1: "#f5f3ff",
      bg2: "#ede9fe",
      glowColor: "#8b5cf6",
      pillColor: "#7c3aed",
      pillText: "16:9 • 9:16 • 4:3 • 1:1",
      centerArt: `
        <g transform="translate(0, -35)" filter="url(#shadow-lg)">
          <rect x="-170" y="-105" width="340" height="192" rx="18" fill="#ffffff" stroke="#7c3aed" stroke-width="4"/>
          <rect x="-150" y="-85" width="220" height="124" rx="10" fill="#ede9fe" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="6 4"/>
          <line x1="-170" y1="87" x2="170" y2="-105" stroke="#f59e0b" stroke-width="3" stroke-dasharray="8 6"/>
          <rect x="-55" y="-25" width="110" height="46" rx="12" fill="url(#purple-grad)"/>
          <text x="0" y="6" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="900" fill="#ffffff" text-anchor="middle">16 : 9</text>
        </g>
      `,
    }),
};

async function run() {
  const entries = Object.entries(SCENES);
  console.log(`Rendering ${entries.length} bespoke 3D studio cover images (1200x750)...`);

  for (const [slug, fn] of entries) {
    const svg = fn();
    const buf = await sharp(Buffer.from(svg))
      .resize(W, H)
      .png({ quality: 95, compressionLevel: 8 })
      .toBuffer();

    const filename = `${slug}.png`;
    fs.writeFileSync(path.join(publicDir, filename), buf);
    fs.writeFileSync(path.join(srcDir, filename), buf);
  }

  console.log(`Successfully rendered all ${entries.length} 3D tool cover images!`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
