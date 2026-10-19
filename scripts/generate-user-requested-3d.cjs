const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const publicToolsDir = path.join(__dirname, "..", "public", "assets", "tools");
const srcToolsDir = path.join(__dirname, "..", "src", "assets", "tools");
const distClientToolsDir = path.join(__dirname, "..", "dist", "client", "assets", "tools");
const distToolsDir = path.join(__dirname, "..", "dist", "assets", "tools");

const targetDirs = [publicToolsDir, srcToolsDir, distClientToolsDir, distToolsDir];
targetDirs.forEach((d) => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
});

const W = 1200;
const H = 750;

/**
 * Universal Studio lighting, 3D soft multi-layer shadow filters,
 * specular highlight shine, metallic and glassmorphism gradients.
 */
const studioDefs = `
  <defs>
    <!-- Soft 3D Drop Shadows -->
    <filter id="shadow-3d-lg" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="32" stdDeviation="28" flood-color="#0f172a" flood-opacity="0.22"/>
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.14"/>
    </filter>
    <filter id="shadow-3d-md" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#0f172a" flood-opacity="0.18"/>
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#0f172a" flood-opacity="0.12"/>
    </filter>
    <filter id="shadow-3d-sm" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#0f172a" flood-opacity="0.16"/>
    </filter>

    <!-- Vivid Ambient Glows -->
    <filter id="glow-gold" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="18" flood-color="#f59e0b" flood-opacity="0.55"/>
    </filter>
    <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="18" flood-color="#06b6d4" flood-opacity="0.55"/>
    </filter>
    <filter id="glow-emerald" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="18" flood-color="#10b981" flood-opacity="0.55"/>
    </filter>
    <filter id="glow-purple" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="18" flood-color="#8b5cf6" flood-opacity="0.55"/>
    </filter>
    <filter id="glow-rose" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="18" flood-color="#f43f5e" flood-opacity="0.55"/>
    </filter>
    <filter id="glow-blue" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="18" flood-color="#3b82f6" flood-opacity="0.55"/>
    </filter>

    <!-- Metallic & Glass Gradients -->
    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="35%" stop-color="#eab308"/>
      <stop offset="70%" stop-color="#ca8a04"/>
      <stop offset="100%" stop-color="#854d0e"/>
    </linearGradient>
    <linearGradient id="silver-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#94a3b8"/>
    </linearGradient>
    <linearGradient id="glass-pill" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.96"/>
      <stop offset="100%" stop-color="#f8fafc" stop-opacity="0.88"/>
    </linearGradient>
  </defs>
`;

// Helper for decorative background dot grid
function getDotGrid(opacity = 0.16) {
  const cols = 9;
  const rows = 6;
  return `
    <g fill="#94a3b8" opacity="${opacity}">
      ${Array.from({ length: cols })
        .map((_, i) =>
          Array.from({ length: rows })
            .map((__, j) => `<circle cx="${140 + i * 115}" cy="${100 + j * 110}" r="2.5"/>`)
            .join(""),
        )
        .join("")}
    </g>
  `;
}

/**
 * 1. PDF CONVERTER (pdf-converter.png)
 * 3D multi-format conversion nexus: Centerpiece 3D red PDF surrounded by orbiting
 * glossy 3D format cubes (DOCX, XLSX, JPG, PPTX) with luminous golden conversion flow
 */
function getPdfConverterSvg() {
  return `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    ${studioDefs}
    <defs>
      <linearGradient id="bg-pconv" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="50%" stop-color="#f1f5f9"/>
        <stop offset="100%" stop-color="#e0e7ff"/>
      </linearGradient>
      <radialGradient id="glow-pconv" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.32"/>
        <stop offset="50%" stop-color="#818cf8" stop-opacity="0.14"/>
        <stop offset="100%" stop-color="#f1f5f9" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="pdf-ruby" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff4b4b"/>
        <stop offset="45%" stop-color="#dc2626"/>
        <stop offset="100%" stop-color="#991b1b"/>
      </linearGradient>
      <linearGradient id="word-blue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3b82f6"/>
        <stop offset="100%" stop-color="#1d4ed8"/>
      </linearGradient>
      <linearGradient id="excel-green" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#34d399"/>
        <stop offset="100%" stop-color="#059669"/>
      </linearGradient>
      <linearGradient id="image-orange" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fb923c"/>
        <stop offset="100%" stop-color="#ea580c"/>
      </linearGradient>
    </defs>

    <rect width="${W}" height="${H}" fill="url(#bg-pconv)"/>
    <ellipse cx="600" cy="375" r="460" fill="url(#glow-pconv)"/>
    ${getDotGrid()}

    <g transform="translate(600, 360)">
      <!-- Ground Shadow & Pedestal Base -->
      <ellipse cx="0" cy="200" rx="380" ry="60" fill="#0f172a" opacity="0.14" filter="url(#shadow-3d-lg)"/>
      <ellipse cx="0" cy="190" rx="300" ry="32" fill="#64748b" opacity="0.16"/>

      <!-- Orbiting Conversion Rings -->
      <ellipse cx="0" cy="0" rx="320" ry="140" fill="none" stroke="#60a5fa" stroke-width="4" stroke-dasharray="14,10" opacity="0.6" transform="rotate(-12)"/>
      <ellipse cx="0" cy="0" rx="300" ry="120" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="8,8" opacity="0.5" transform="rotate(16)"/>

      <!-- Golden Curved Flow Arrows (Top & Bottom) -->
      <g filter="url(#glow-gold)">
        <path d="M -220 -30 C -150 -120, 150 -120, 220 -30" fill="none" stroke="url(#gold-grad)" stroke-width="8" stroke-linecap="round"/>
        <polygon points="230,-15 200,-35 228,-45" fill="#eab308"/>
      </g>
      <g filter="url(#glow-cyan)">
        <path d="M 220 30 C 150 120, -150 120, -220 30" fill="none" stroke="#06b6d4" stroke-width="8" stroke-linecap="round"/>
        <polygon points="-230,15 -200,35 -228,45" fill="#06b6d4"/>
      </g>

      <!-- SATELLITE 1: 3D Word Document Card (Top Left) -->
      <g transform="translate(-230, -90) rotate(-14)" filter="url(#shadow-3d-md)">
        <rect x="-55" y="-70" width="110" height="140" rx="14" fill="url(#word-blue)"/>
        <rect x="-42" y="-55" width="40" height="34" rx="8" fill="#ffffff"/>
        <text x="-22" y="-32" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="20" font-weight="900" fill="#1d4ed8" text-anchor="middle">W</text>
        <rect x="-42" y="-8" width="84" height="6" rx="3" fill="#ffffff" opacity="0.7"/>
        <rect x="-42" y="8" width="70" height="6" rx="3" fill="#ffffff" opacity="0.5"/>
        <rect x="-42" y="24" width="78" height="6" rx="3" fill="#ffffff" opacity="0.5"/>
        <rect x="-42" y="40" width="48" height="16" rx="8" fill="#ffffff" opacity="0.95"/>
        <text x="-18" y="52" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="10" font-weight="900" fill="#1e40af" text-anchor="middle">DOCX</text>
      </g>

      <!-- SATELLITE 2: 3D Excel Document Card (Top Right) -->
      <g transform="translate(230, -80) rotate(12)" filter="url(#shadow-3d-md)">
        <rect x="-55" y="-70" width="110" height="140" rx="14" fill="url(#excel-green)"/>
        <rect x="-42" y="-55" width="40" height="34" rx="8" fill="#ffffff"/>
        <text x="-22" y="-32" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="20" font-weight="900" fill="#059669" text-anchor="middle">X</text>
        <!-- Mini spreadsheet grid -->
        <rect x="-42" y="-10" width="84" height="36" rx="4" fill="#ffffff" opacity="0.25"/>
        <line x1="-14" y1="-10" x2="-14" y2="26" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
        <line x1="14" y1="-10" x2="14" y2="26" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
        <line x1="-42" y1="8" x2="42" y2="8" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
        <rect x="-42" y="38" width="46" height="16" rx="8" fill="#ffffff" opacity="0.95"/>
        <text x="-19" y="50" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="10" font-weight="900" fill="#047857" text-anchor="middle">XLSX</text>
      </g>

      <!-- SATELLITE 3: 3D Image/Photo Card (Bottom Right) -->
      <g transform="translate(220, 85) rotate(-8)" filter="url(#shadow-3d-md)">
        <rect x="-55" y="-70" width="110" height="140" rx="14" fill="url(#image-orange)"/>
        <circle cx="20" cy="-35" r="10" fill="#fef08a"/>
        <polygon points="-40,15 0,-25 30,15" fill="#ffffff" opacity="0.9"/>
        <polygon points="5,15 25,-5 42,15" fill="#ffffff" opacity="0.75"/>
        <rect x="-42" y="36" width="44" height="16" rx="8" fill="#ffffff" opacity="0.95"/>
        <text x="-20" y="48" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="10" font-weight="900" fill="#c2410c" text-anchor="middle">JPG</text>
      </g>

      <!-- SATELLITE 4: 3D Text/HTML Card (Bottom Left) -->
      <g transform="translate(-220, 80) rotate(10)" filter="url(#shadow-3d-md)">
        <rect x="-55" y="-70" width="110" height="140" rx="14" fill="#6366f1"/>
        <rect x="-40" y="-50" width="80" height="8" rx="4" fill="#ffffff" opacity="0.8"/>
        <rect x="-40" y="-32" width="65" height="8" rx="4" fill="#ffffff" opacity="0.6"/>
        <rect x="-40" y="-14" width="72" height="8" rx="4" fill="#ffffff" opacity="0.6"/>
        <rect x="-40" y="4" width="55" height="8" rx="4" fill="#ffffff" opacity="0.6"/>
        <rect x="-40" y="36" width="46" height="16" rx="8" fill="#ffffff" opacity="0.95"/>
        <text x="-17" y="48" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="10" font-weight="900" fill="#4338ca" text-anchor="middle">TXT</text>
      </g>

      <!-- CENTERPIECE: Massive 3D Glossy PDF Document -->
      <g filter="url(#shadow-3d-lg)" transform="translate(0, -10)">
        <!-- Back depth layer -->
        <rect x="-100" y="-135" width="200" height="270" rx="20" fill="#7f1d1d" transform="translate(8, 12)"/>
        <!-- Main PDF Sheet -->
        <rect x="-100" y="-135" width="200" height="270" rx="20" fill="url(#pdf-ruby)" stroke="#fca5a5" stroke-width="3"/>
        <!-- Folded Corner Top Right -->
        <path d="M 50 -135 L 50 -85 L 100 -85 Z" fill="#7f1d1d" opacity="0.5"/>
        <path d="M 50 -135 L 100 -85 L 50 -85 Z" fill="#ffffff" opacity="0.9"/>

        <!-- Prominent PDF Badge -->
        <rect x="-70" y="-105" width="90" height="42" rx="12" fill="#ffffff" filter="url(#shadow-3d-sm)"/>
        <text x="-25" y="-76" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="24" font-weight="900" fill="#dc2626" text-anchor="middle" letter-spacing="1">PDF</text>

        <!-- Document Content Lines -->
        <rect x="-70" y="-45" width="140" height="10" rx="5" fill="#ffffff" opacity="0.35"/>
        <rect x="-70" y="-25" width="115" height="10" rx="5" fill="#ffffff" opacity="0.35"/>
        <rect x="-70" y="-5" width="130" height="10" rx="5" fill="#ffffff" opacity="0.35"/>
        <rect x="-70" y="15" width="90" height="10" rx="5" fill="#ffffff" opacity="0.35"/>

        <!-- Universal Converter Dial on Document -->
        <circle cx="0" cy="72" r="32" fill="#ffffff" filter="url(#shadow-3d-sm)"/>
        <circle cx="0" cy="72" r="28" fill="#f8fafc"/>
        <path d="M -14 72 A 14 14 0 0 1 12 62" fill="none" stroke="#2563eb" stroke-width="4" stroke-linecap="round"/>
        <polygon points="16,62 10,54 8,66" fill="#2563eb"/>
        <path d="M 14 72 A 14 14 0 0 1 -12 82" fill="none" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/>
        <polygon points="-16,82 -10,90 -8,78" fill="#dc2626"/>
      </g>

      <!-- Sparkles -->
      <g transform="translate(130, -110)" filter="url(#glow-gold)">
        <polygon points="0,-16 4,-4 16,0 4,4 0,16 -4,4 -16,0 -4,-4" fill="#fbbf24"/>
      </g>
      <g transform="translate(-140, 110)" filter="url(#glow-cyan)">
        <polygon points="0,-14 4,-3 14,0 4,3 0,14 -4,3 -14,0 -4,-3" fill="#38bdf8"/>
      </g>

      <!-- Frosted Glass Pill Badge -->
      <g transform="translate(-160, 160)" filter="url(#shadow-3d-sm)">
        <rect width="320" height="54" rx="27" fill="url(#glass-pill)" stroke="#e2e8f0" stroke-width="2"/>
        <circle cx="30" cy="27" r="16" fill="url(#pdf-ruby)"/>
        <path d="M 23 27 L 28 32 L 37 22" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <text x="60" y="35" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="15" font-weight="900" fill="#0f172a" letter-spacing="1.2">UNIVERSAL PDF CONVERTER</text>
      </g>
    </g>
  </svg>
  `;
}

/**
 * 2. PDF TO JPG (pdf-to-jpg.png)
 * 3D conversion from PDF document into high-res photographic polaroids / JPG images
 * with vibrant landscape graphics, glossy camera lens reflections and amber glow
 */
function getPdfToJpgSvg() {
  return `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    ${studioDefs}
    <defs>
      <linearGradient id="bg-ptj" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="50%" stop-color="#fff7ed"/>
        <stop offset="100%" stop-color="#ffedd5"/>
      </linearGradient>
      <radialGradient id="glow-ptj" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fb923c" stop-opacity="0.32"/>
        <stop offset="50%" stop-color="#f43f5e" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#fff7ed" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="pdf-red-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ef4444"/>
        <stop offset="100%" stop-color="#b91c1c"/>
      </linearGradient>
      <linearGradient id="photo-sunset" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f43f5e"/>
        <stop offset="40%" stop-color="#fb923c"/>
        <stop offset="75%" stop-color="#fbbf24"/>
        <stop offset="100%" stop-color="#0284c7"/>
      </linearGradient>
      <linearGradient id="lens-flare" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <rect width="${W}" height="${H}" fill="url(#bg-ptj)"/>
    <ellipse cx="600" cy="375" r="460" fill="url(#glow-ptj)"/>
    ${getDotGrid()}

    <g transform="translate(600, 360)">
      <!-- Ground Shadow & Pedestal Base -->
      <ellipse cx="0" cy="200" rx="380" ry="60" fill="#0f172a" opacity="0.14" filter="url(#shadow-3d-lg)"/>
      <ellipse cx="0" cy="190" rx="300" ry="32" fill="#fdba74" opacity="0.2"/>

      <!-- LEFT: 3D PDF Document -->
      <g transform="translate(-160, -15) rotate(-8)" filter="url(#shadow-3d-lg)">
        <rect x="-90" y="-120" width="180" height="240" rx="18" fill="url(#pdf-red-grad)" stroke="#fca5a5" stroke-width="3"/>
        <path d="M 45 -120 L 45 -75 L 90 -75 Z" fill="#7f1d1d" opacity="0.4"/>
        <path d="M 45 -120 L 90 -75 L 45 -75 Z" fill="#ffffff" opacity="0.85"/>
        <!-- PDF Badge -->
        <rect x="-65" y="-95" width="80" height="36" rx="10" fill="#ffffff"/>
        <text x="-25" y="-70" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="20" font-weight="900" fill="#dc2626" text-anchor="middle">PDF</text>
        <!-- Lines -->
        <rect x="-65" y="-40" width="130" height="10" rx="5" fill="#ffffff" opacity="0.3"/>
        <rect x="-65" y="-20" width="110" height="10" rx="5" fill="#ffffff" opacity="0.3"/>
        <rect x="-65" y="0" width="125" height="10" rx="5" fill="#ffffff" opacity="0.3"/>
        <rect x="-65" y="20" width="90" height="10" rx="5" fill="#ffffff" opacity="0.3"/>
        <!-- Page number counter -->
        <rect x="-65" y="55" width="60" height="22" rx="11" fill="#7f1d1d" opacity="0.6"/>
        <text x="-35" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" fill="#ffffff" text-anchor="middle">1 / 12</text>
      </g>

      <!-- CENTER CONVERSION SPEED BEAM -->
      <g transform="translate(0, -20)">
        <ellipse cx="0" cy="0" rx="60" ry="60" fill="#fef08a" opacity="0.35" filter="url(#glow-gold)"/>
        <!-- 3D Arrow Chevrons pointing to the right -->
        <path d="M -35 -20 L -5 0 L -35 20" fill="none" stroke="#f97316" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M -10 -20 L 20 0 L -10 20" fill="none" stroke="#ea580c" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M 15 -20 L 45 0 L 15 20" fill="none" stroke="#c2410c" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Sparkles around beam -->
        <circle cx="0" cy="-40" r="4" fill="#f59e0b"/>
        <circle cx="20" cy="40" r="5" fill="#ea580c"/>
      </g>

      <!-- RIGHT: Stack of 3D Glossy Polaroid Photo Prints (JPG) -->
      <!-- Back photo -->
      <g transform="translate(145, 10) rotate(16)" filter="url(#shadow-3d-md)">
        <rect x="-80" y="-105" width="160" height="210" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="3"/>
        <rect x="-70" y="-95" width="140" height="135" rx="8" fill="#38bdf8"/>
        <circle cx="-30" cy="-60" r="14" fill="#fef08a"/>
        <polygon points="-70,40 -20,-20 30,40" fill="#0284c7"/>
        <polygon points="10,40 40,0 70,40" fill="#0369a1"/>
      </g>

      <!-- Front Main Glossy Photo (High-Res 3D Sunset Polaroid) -->
      <g transform="translate(170, -30) rotate(-6)" filter="url(#shadow-3d-lg)">
        <rect x="-95" y="-120" width="190" height="240" rx="16" fill="#ffffff" stroke="#fed7aa" stroke-width="3"/>
        <!-- Photo Canvas -->
        <rect x="-82" y="-108" width="164" height="154" rx="10" fill="url(#photo-sunset)"/>
        <!-- Landscape Elements inside Photo -->
        <circle cx="-35" cy="-65" r="22" fill="#fef08a" filter="url(#glow-gold)"/>
        <!-- Purple Mountains Silhouette -->
        <polygon points="-82,46 -30,-20 15,46" fill="#4c1d95" opacity="0.95"/>
        <polygon points="-5,46 35,-5 82,46" fill="#581c87" opacity="0.9"/>
        <polygon points="40,46 65,15 82,46" fill="#3b0764"/>
        <!-- Glossy Glass Reflection across Photo -->
        <path d="M -82 -108 L 20 -108 L -82 10 Z" fill="url(#lens-flare)"/>

        <!-- High-Res Tag & JPG Badge at bottom of Polaroid -->
        <rect x="-78" y="62" width="70" height="34" rx="8" fill="#f97316"/>
        <text x="-43" y="85" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="18" font-weight="900" fill="#ffffff" text-anchor="middle">.JPG</text>
        
        <rect x="0" y="66" width="76" height="26" rx="13" fill="#ffedd5"/>
        <text x="38" y="83" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-weight="800" fill="#c2410c" text-anchor="middle">300 DPI</text>
      </g>

      <!-- Floating Sparkles -->
      <g transform="translate(250, -110)" filter="url(#glow-gold)">
        <polygon points="0,-16 4,-4 16,0 4,4 0,16 -4,4 -16,0 -4,-4" fill="#fb923c"/>
      </g>
      <g transform="translate(-250, -80)" filter="url(#glow-rose)">
        <polygon points="0,-14 4,-3 14,0 4,3 0,14 -4,3 -14,0 -4,-3" fill="#f43f5e"/>
      </g>

      <!-- Frosted Glass Pill Badge -->
      <g transform="translate(-160, 160)" filter="url(#shadow-3d-sm)">
        <rect width="320" height="54" rx="27" fill="url(#glass-pill)" stroke="#fed7aa" stroke-width="2"/>
        <circle cx="30" cy="27" r="16" fill="#ea580c"/>
        <path d="M 23 27 L 28 32 L 37 22" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <text x="60" y="35" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="15" font-weight="900" fill="#0f172a" letter-spacing="1.2">EXTRACT HD JPG IMAGES</text>
      </g>
    </g>
  </svg>
  `;
}

/**
 * 3. OPEN GRAPH GENERATOR (open-graph-generator.png)
 * 3D holographic social media preview card floating with network tags,
 * connected 3D Facebook, X/Twitter, LinkedIn and Instagram glowing orbs
 */
function getOpenGraphGeneratorSvg() {
  return `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    ${studioDefs}
    <defs>
      <linearGradient id="bg-og" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="50%" stop-color="#f5f3ff"/>
        <stop offset="100%" stop-color="#ede9fe"/>
      </linearGradient>
      <radialGradient id="glow-og" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.35"/>
        <stop offset="50%" stop-color="#6366f1" stop-opacity="0.14"/>
        <stop offset="100%" stop-color="#f5f3ff" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="card-header-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4f46e5"/>
        <stop offset="50%" stop-color="#7c3aed"/>
        <stop offset="100%" stop-color="#ec4899"/>
      </linearGradient>
      <linearGradient id="ig-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#833ab4"/>
        <stop offset="50%" stop-color="#fd1d1d"/>
        <stop offset="100%" stop-color="#fcb045"/>
      </linearGradient>
    </defs>

    <rect width="${W}" height="${H}" fill="url(#bg-og)"/>
    <ellipse cx="600" cy="375" r="460" fill="url(#glow-og)"/>
    ${getDotGrid()}

    <g transform="translate(600, 360)">
      <!-- Ground Shadow & Pedestal Base -->
      <ellipse cx="0" cy="200" rx="380" ry="60" fill="#0f172a" opacity="0.14" filter="url(#shadow-3d-lg)"/>
      <ellipse cx="0" cy="190" rx="300" ry="32" fill="#c4b5fd" opacity="0.25"/>

      <!-- Orbiting Network Connection Fibers -->
      <line x1="-240" y1="-80" x2="-80" y2="-40" stroke="#8b5cf6" stroke-width="2.5" stroke-dasharray="6,6" opacity="0.6"/>
      <line x1="240" y1="-80" x2="80" y2="-40" stroke="#06b6d4" stroke-width="2.5" stroke-dasharray="6,6" opacity="0.6"/>
      <line x1="-230" y1="90" x2="-100" y2="60" stroke="#ec4899" stroke-width="2.5" stroke-dasharray="6,6" opacity="0.6"/>
      <line x1="230" y1="90" x2="100" y2="60" stroke="#3b82f6" stroke-width="2.5" stroke-dasharray="6,6" opacity="0.6"/>

      <!-- SATELLITE 1: 3D Twitter/X Card (Top Left) -->
      <g transform="translate(-240, -80)" filter="url(#shadow-3d-md)">
        <circle cx="0" cy="0" r="36" fill="#0f172a"/>
        <circle cx="0" cy="0" r="34" fill="#020617"/>
        <path d="M -12 -12 L 12 12 M 12 -12 L -12 12" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
      </g>

      <!-- SATELLITE 2: 3D Facebook Orb (Top Right) -->
      <g transform="translate(240, -80)" filter="url(#shadow-3d-md)">
        <circle cx="0" cy="0" r="36" fill="#1877f2"/>
        <circle cx="0" cy="0" r="34" fill="#2563eb"/>
        <text x="0" y="16" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="44" font-weight="900" fill="#ffffff" text-anchor="middle">f</text>
      </g>

      <!-- SATELLITE 3: 3D Instagram Orb (Bottom Left) -->
      <g transform="translate(-230, 90)" filter="url(#shadow-3d-md)">
        <circle cx="0" cy="0" r="36" fill="url(#ig-grad)"/>
        <rect x="-18" y="-18" width="36" height="36" rx="10" fill="none" stroke="#ffffff" stroke-width="4"/>
        <circle cx="0" cy="0" r="8" fill="none" stroke="#ffffff" stroke-width="4"/>
        <circle cx="9" cy="-9" r="2.5" fill="#ffffff"/>
      </g>

      <!-- SATELLITE 4: 3D LinkedIn Orb (Bottom Right) -->
      <g transform="translate(230, 90)" filter="url(#shadow-3d-md)">
        <rect x="-34" y="-34" width="68" height="68" rx="18" fill="#0a66c2"/>
        <text x="0" y="12" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="32" font-weight="900" fill="#ffffff" text-anchor="middle">in</text>
      </g>

      <!-- CENTER: 3D High-Tech Open Graph Card -->
      <g filter="url(#shadow-3d-lg)" transform="translate(0, -20) rotate(-2)">
        <!-- Back depth plate -->
        <rect x="-170" y="-130" width="340" height="260" rx="22" fill="#4338ca" transform="translate(8, 12)"/>
        <!-- Main Social Preview Card -->
        <rect x="-170" y="-130" width="340" height="260" rx="22" fill="#ffffff" stroke="#c4b5fd" stroke-width="3"/>

        <!-- Card Image Header -->
        <rect x="-170" y="-130" width="340" height="125" rx="22" fill="url(#card-header-grad)"/>
        <!-- Flat bottom corner cover for header image -->
        <rect x="-170" y="-35" width="340" height="30" fill="url(#card-header-grad)"/>

        <!-- Graphic inside OG Image Header -->
        <circle cx="0" cy="-70" r="28" fill="#ffffff" opacity="0.25"/>
        <polygon points="-16,-62 0,-85 16,-62" fill="#ffffff"/>
        <text x="0" y="-40" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1">1200 × 630 OG:IMAGE</text>

        <!-- Social Meta Details inside Card -->
        <text x="-145" y="18" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="#6366f1" letter-spacing="0.5">TOOLNAMI.COM</text>
        <text x="-145" y="42" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="900" fill="#0f172a">Universal Everyday Web Tools</text>
        <text x="-145" y="66" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="500" fill="#64748b">Free PDF, image &amp; developer tools right in your browser.</text>

        <!-- Floating Monospace Meta Tag Badges on Card -->
        <g transform="translate(75, 95)" filter="url(#shadow-3d-sm)">
          <rect x="-55" y="-15" width="110" height="30" rx="8" fill="#0f172a"/>
          <text x="0" y="4" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#38bdf8" text-anchor="middle">&lt;og:meta/&gt;</text>
        </g>
      </g>

      <!-- Sparkles -->
      <g transform="translate(160, -115)" filter="url(#glow-gold)">
        <polygon points="0,-16 4,-4 16,0 4,4 0,16 -4,4 -16,0 -4,-4" fill="#fbbf24"/>
      </g>
      <g transform="translate(-160, -115)" filter="url(#glow-purple)">
        <polygon points="0,-14 4,-3 14,0 4,3 0,14 -4,3 -14,0 -4,-3" fill="#a855f7"/>
      </g>

      <!-- Frosted Glass Pill Badge -->
      <g transform="translate(-160, 160)" filter="url(#shadow-3d-sm)">
        <rect width="320" height="54" rx="27" fill="url(#glass-pill)" stroke="#c4b5fd" stroke-width="2"/>
        <circle cx="30" cy="27" r="16" fill="#7c3aed"/>
        <path d="M 23 27 L 28 32 L 37 22" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <text x="60" y="35" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="15" font-weight="900" fill="#0f172a" letter-spacing="1.2">OPEN GRAPH &amp; SOCIAL CARDS</text>
      </g>
    </g>
  </svg>
  `;
}

/**
 * 4. AI HASHTAG GENERATOR (ai-hashtag-generator.png)
 * Enormous 3D neon violet-fuchsia Hashtag symbol '#' with trending viral rocket,
 * floating hashtag capsules (#viral, #trending, #explore) and sparkling AI aura
 */
function getAiHashtagGeneratorSvg() {
  return `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    ${studioDefs}
    <defs>
      <linearGradient id="bg-hash" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="50%" stop-color="#faf5ff"/>
        <stop offset="100%" stop-color="#f3e8ff"/>
      </linearGradient>
      <radialGradient id="glow-hash" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#d946ef" stop-opacity="0.38"/>
        <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#faf5ff" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="neon-hash" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f43f5e"/>
        <stop offset="50%" stop-color="#d946ef"/>
        <stop offset="100%" stop-color="#7c3aed"/>
      </linearGradient>
      <linearGradient id="rocket-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="50%" stop-color="#fecdd3"/>
        <stop offset="100%" stop-color="#f43f5e"/>
      </linearGradient>
    </defs>

    <rect width="${W}" height="${H}" fill="url(#bg-hash)"/>
    <ellipse cx="600" cy="375" r="460" fill="url(#glow-hash)"/>
    ${getDotGrid()}

    <g transform="translate(600, 360)">
      <!-- Ground Shadow & Pedestal Base -->
      <ellipse cx="0" cy="200" rx="380" ry="60" fill="#0f172a" opacity="0.14" filter="url(#shadow-3d-lg)"/>
      <ellipse cx="0" cy="190" rx="300" ry="32" fill="#e9d5ff" opacity="0.3"/>

      <!-- FLOATING 3D HASHTAG PILL CHIPS AROUND CENTER -->
      <g transform="translate(-220, -90) rotate(-12)" filter="url(#shadow-3d-md)">
        <rect x="-75" y="-24" width="150" height="48" rx="24" fill="#0f172a"/>
        <circle cx="-45" cy="0" r="14" fill="#10b981"/>
        <text x="-45" y="5" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">#</text>
        <text x="8" y="6" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="800" fill="#34d399">trending</text>
      </g>

      <g transform="translate(220, -80) rotate(10)" filter="url(#shadow-3d-md)">
        <rect x="-65" y="-24" width="130" height="48" rx="24" fill="#0f172a"/>
        <circle cx="-35" cy="0" r="14" fill="#ef4444"/>
        <text x="-35" y="5" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">#</text>
        <text x="12" y="6" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="800" fill="#f87171">viral</text>
      </g>

      <g transform="translate(-210, 80) rotate(8)" filter="url(#shadow-3d-md)">
        <rect x="-70" y="-24" width="140" height="48" rx="24" fill="#0f172a"/>
        <circle cx="-40" cy="0" r="14" fill="#3b82f6"/>
        <text x="-40" y="5" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">#</text>
        <text x="10" y="6" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="800" fill="#60a5fa">growth</text>
      </g>

      <g transform="translate(210, 80) rotate(-10)" filter="url(#shadow-3d-md)">
        <rect x="-70" y="-24" width="140" height="48" rx="24" fill="#0f172a"/>
        <circle cx="-40" cy="0" r="14" fill="#f59e0b"/>
        <text x="-40" y="5" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">#</text>
        <text x="10" y="6" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="800" fill="#fbbf24">explore</text>
      </g>

      <!-- 3D Trending Viral Rocket on the Right -->
      <g transform="translate(130, -50) rotate(24)" filter="url(#shadow-3d-md)">
        <!-- Rocket Body -->
        <path d="M 0 -50 C 25 -30, 25 20, 0 35 C -25 20, -25 -30, 0 -50 Z" fill="url(#rocket-grad)"/>
        <!-- Rocket Wings -->
        <polygon points="-20,10 -35,30 -20,28" fill="#e11d48"/>
        <polygon points="20,10 35,30 20,28" fill="#e11d48"/>
        <!-- Porthole Window -->
        <circle cx="0" cy="-10" r="10" fill="#38bdf8" stroke="#0284c7" stroke-width="3"/>
        <!-- Thrust Fire -->
        <polygon points="-12,35 0,65 12,35" fill="#f59e0b"/>
        <polygon points="-6,35 0,55 6,35" fill="#ef4444"/>
      </g>

      <!-- GIGANTIC 3D METALLIC NEON HASHTAG (Centerpiece) -->
      <g filter="url(#shadow-3d-lg)" transform="translate(0, -25) rotate(-6)">
        <!-- 3D Extrusion Shadow Layer -->
        <g fill="#4a044e" transform="translate(12, 16)">
          <rect x="-105" y="-45" width="210" height="32" rx="16"/>
          <rect x="-105" y="15" width="210" height="32" rx="16"/>
          <rect x="-45" y="-105" width="32" height="210" rx="16" transform="skewX(-14)"/>
          <rect x="15" y="-105" width="32" height="210" rx="16" transform="skewX(-14)"/>
        </g>

        <!-- Front Neon Gradients Surface -->
        <g fill="url(#neon-hash)" filter="url(#glow-purple)">
          <rect x="-105" y="-45" width="210" height="32" rx="16"/>
          <rect x="-105" y="15" width="210" height="32" rx="16"/>
          <rect x="-45" y="-105" width="32" height="210" rx="16" transform="skewX(-14)"/>
          <rect x="15" y="-105" width="32" height="210" rx="16" transform="skewX(-14)"/>
        </g>

        <!-- Glossy Specular Highlights on Bars -->
        <rect x="-95" y="-40" width="190" height="8" rx="4" fill="#ffffff" opacity="0.6"/>
        <rect x="-95" y="20" width="190" height="8" rx="4" fill="#ffffff" opacity="0.6"/>
        
        <!-- Glowing Core Nodes at Intersections -->
        <circle cx="-32" cy="-30" r="10" fill="#ffffff" filter="url(#glow-gold)"/>
        <circle cx="28" cy="-30" r="10" fill="#ffffff" filter="url(#glow-gold)"/>
        <circle cx="-22" cy="30" r="10" fill="#ffffff" filter="url(#glow-gold)"/>
        <circle cx="38" cy="30" r="10" fill="#ffffff" filter="url(#glow-gold)"/>
      </g>

      <!-- Sparkles -->
      <g transform="translate(160, -110)" filter="url(#glow-gold)">
        <polygon points="0,-16 4,-4 16,0 4,4 0,16 -4,4 -16,0 -4,-4" fill="#fbbf24"/>
      </g>
      <g transform="translate(-160, -110)" filter="url(#glow-rose)">
        <polygon points="0,-14 4,-3 14,0 4,3 0,14 -4,3 -14,0 -4,-3" fill="#f43f5e"/>
      </g>

      <!-- Frosted Glass Pill Badge -->
      <g transform="translate(-160, 160)" filter="url(#shadow-3d-sm)">
        <rect width="320" height="54" rx="27" fill="url(#glass-pill)" stroke="#e9d5ff" stroke-width="2"/>
        <circle cx="30" cy="27" r="16" fill="#c026d3"/>
        <path d="M 23 27 L 28 32 L 37 22" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <text x="60" y="35" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="15" font-weight="900" fill="#0f172a" letter-spacing="1.2">AI HASHTAG &amp; VIRAL TAGS</text>
      </g>
    </g>
  </svg>
  `;
}

/**
 * 5. AI CAPTION GENERATOR (ai-caption-generator.png)
 * 3D multi-layered speech bubbles, glowing AI magic quill/wand, engagement reaction
 * hearts, speech stars, and high-engagement social media copy
 */
function getAiCaptionGeneratorSvg() {
  return `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    ${studioDefs}
    <defs>
      <linearGradient id="bg-cap" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="50%" stop-color="#fdf2f8"/>
        <stop offset="100%" stop-color="#fae8ff"/>
      </linearGradient>
      <radialGradient id="glow-cap" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ec4899" stop-opacity="0.32"/>
        <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.14"/>
        <stop offset="100%" stop-color="#fdf2f8" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="bubble-pink" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f43f5e"/>
        <stop offset="100%" stop-color="#db2777"/>
      </linearGradient>
      <linearGradient id="bubble-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#06b6d4"/>
        <stop offset="100%" stop-color="#0284c7"/>
      </linearGradient>
      <linearGradient id="wand-magic" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="50%" stop-color="#eab308"/>
        <stop offset="100%" stop-color="#ca8a04"/>
      </linearGradient>
    </defs>

    <rect width="${W}" height="${H}" fill="url(#bg-cap)"/>
    <ellipse cx="600" cy="375" r="460" fill="url(#glow-cap)"/>
    ${getDotGrid()}

    <g transform="translate(600, 360)">
      <!-- Ground Shadow & Pedestal Base -->
      <ellipse cx="0" cy="200" rx="380" ry="60" fill="#0f172a" opacity="0.14" filter="url(#shadow-3d-lg)"/>
      <ellipse cx="0" cy="190" rx="300" ry="32" fill="#fbcfe8" opacity="0.3"/>

      <!-- FLOATING ENGAGEMENT REACTION ORBS -->
      <!-- 3D Heart Reaction (Top Left) -->
      <g transform="translate(-230, -70) rotate(-14)" filter="url(#shadow-3d-md)">
        <circle cx="0" cy="0" r="38" fill="url(#bubble-pink)"/>
        <path d="M -16 -6 C -16 -16, -4 -16, 0 -6 C 4 -16, 16 -16, 16 -6 C 16 8, 0 18, 0 18 C 0 18, -16 8, -16 -6 Z" fill="#ffffff"/>
      </g>

      <!-- 3D Paper Airplane Share Icon (Top Right) -->
      <g transform="translate(230, -70) rotate(14)" filter="url(#shadow-3d-md)">
        <circle cx="0" cy="0" r="38" fill="url(#bubble-cyan)"/>
        <polygon points="-12,12 16,0 -16,-12 -8,0" fill="#ffffff"/>
      </g>

      <!-- 3D Fire Flame Reaction (Bottom Right) -->
      <g transform="translate(210, 85) rotate(-10)" filter="url(#shadow-3d-md)">
        <circle cx="0" cy="0" r="36" fill="#f59e0b"/>
        <path d="M 0 -16 C 8 -8, 14 0, 14 8 C 14 16, 8 20, 0 20 C -8 20, -14 16, -14 8 C -14 0, -8 -8, 0 -16 Z" fill="#ef4444"/>
        <path d="M 0 -6 C 4 -2, 6 2, 6 6 C 6 10, 4 12, 0 12 C -4 12, -6 10, -6 6 C -6 2, -4 -2, 0 -6 Z" fill="#fef08a"/>
      </g>

      <!-- BACK CHAT BUBBLE (Gradient Violet) -->
      <g transform="translate(-80, -70) rotate(-6)" filter="url(#shadow-3d-md)">
        <rect x="-100" y="-45" width="200" height="90" rx="24" fill="#7c3aed"/>
        <path d="M -50 45 L -70 65 L -40 45 Z" fill="#7c3aed"/>
        <rect x="-80" y="-22" width="130" height="12" rx="6" fill="#ffffff" opacity="0.6"/>
        <rect x="-80" y="2" width="90" height="12" rx="6" fill="#ffffff" opacity="0.4"/>
      </g>

      <!-- MAIN 3D GLOSSY AI SPEECH BUBBLE (Centerpiece) -->
      <g filter="url(#shadow-3d-lg)" transform="translate(10, -10)">
        <!-- Back depth layer -->
        <rect x="-170" y="-105" width="340" height="210" rx="30" fill="#9d174d" transform="translate(8, 12)"/>
        <path d="M -80 105 L -110 145 L -55 105 Z" fill="#9d174d" transform="translate(8, 12)"/>
        <!-- Main Bubble Surface -->
        <rect x="-170" y="-105" width="340" height="210" rx="30" fill="#ffffff" stroke="#fbcfe8" stroke-width="3"/>
        <path d="M -80 105 L -110 145 L -55 105 Z" fill="#ffffff" stroke="#fbcfe8" stroke-width="3"/>

        <!-- Header Chip with AI Sparkle -->
        <rect x="-145" y="-80" width="110" height="32" rx="16" fill="#fdf2f8" stroke="#f43f5e" stroke-width="1.5"/>
        <circle cx="-125" cy="-64" r="8" fill="#f43f5e"/>
        <text x="-95" y="-59" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="900" fill="#e11d48">AI Caption</text>

        <!-- Simulated Caption Text Lines with glowing caret -->
        <text x="-145" y="-22" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="800" fill="#0f172a">Ready to elevate your game? ✨</text>
        <text x="-145" y="6" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="500" fill="#475569">Swipe through for the 3 daily secrets...</text>
        <text x="-145" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" fill="#0284c7">#creators #buildinpublic #viral</text>

        <!-- Floating Caret Line -->
        <line x1="105" y1="-28" x2="105" y2="-10" stroke="#db2777" stroke-width="3.5" stroke-linecap="round"/>

        <!-- Action / Copy CTA Button -->
        <g transform="translate(80, 55)">
          <rect x="-55" y="-16" width="110" height="32" rx="16" fill="url(#bubble-pink)"/>
          <text x="0" y="4" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" fill="#ffffff" text-anchor="middle">Copy 1-Click</text>
        </g>
      </g>

      <!-- 3D GOLDEN AI MAGIC PEN / WAND -->
      <g transform="translate(180, -95) rotate(-35)" filter="url(#shadow-3d-lg)">
        <!-- Wand Stick -->
        <rect x="-6" y="-60" width="12" height="120" rx="6" fill="url(#wand-magic)"/>
        <!-- Wand Tip -->
        <circle cx="0" cy="-65" r="14" fill="#ffffff" filter="url(#glow-gold)"/>
        <polygon points="0,-85 5,-70 20,-65 5,-60 0,-45 -5,-60 -20,-65 -5,-70" fill="#fbbf24"/>
      </g>

      <!-- Sparkles -->
      <g transform="translate(150, 110)" filter="url(#glow-gold)">
        <polygon points="0,-16 4,-4 16,0 4,4 0,16 -4,4 -16,0 -4,-4" fill="#fbbf24"/>
      </g>
      <g transform="translate(-160, -110)" filter="url(#glow-rose)">
        <polygon points="0,-14 4,-3 14,0 4,3 0,14 -4,3 -14,0 -4,-3" fill="#f43f5e"/>
      </g>

      <!-- Frosted Glass Pill Badge -->
      <g transform="translate(-160, 160)" filter="url(#shadow-3d-sm)">
        <rect width="320" height="54" rx="27" fill="url(#glass-pill)" stroke="#fbcfe8" stroke-width="2"/>
        <circle cx="30" cy="27" r="16" fill="#db2777"/>
        <path d="M 23 27 L 28 32 L 37 22" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <text x="60" y="35" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="15" font-weight="900" fill="#0f172a" letter-spacing="1.2">AI SOCIAL CAPTION ENGINE</text>
      </g>
    </g>
  </svg>
  `;
}

/**
 * 6. AI BLOG GENERATOR (ai-blog-generator.png)
 * 3D open editorial tablet/book, neural AI fountain pen writing glowing paragraphs,
 * #1 SEO ranking trophy medal, keyword density tags, and ambient sapphire-gold glow
 */
function getAiBlogGeneratorSvg() {
  return `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    ${studioDefs}
    <defs>
      <linearGradient id="bg-blog" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="50%" stop-color="#f0fdf4"/>
        <stop offset="100%" stop-color="#e0f2fe"/>
      </linearGradient>
      <radialGradient id="glow-blog" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#10b981" stop-opacity="0.32"/>
        <stop offset="50%" stop-color="#0284c7" stop-opacity="0.14"/>
        <stop offset="100%" stop-color="#f0fdf4" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="editorial-hero" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#059669"/>
        <stop offset="50%" stop-color="#0284c7"/>
        <stop offset="100%" stop-color="#4f46e5"/>
      </linearGradient>
      <linearGradient id="quill-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="50%" stop-color="#0284c7"/>
        <stop offset="100%" stop-color="#0369a1"/>
      </linearGradient>
    </defs>

    <rect width="${W}" height="${H}" fill="url(#bg-blog)"/>
    <ellipse cx="600" cy="375" r="460" fill="url(#glow-blog)"/>
    ${getDotGrid()}

    <g transform="translate(600, 360)">
      <!-- Ground Shadow & Pedestal Base -->
      <ellipse cx="0" cy="200" rx="380" ry="60" fill="#0f172a" opacity="0.14" filter="url(#shadow-3d-lg)"/>
      <ellipse cx="0" cy="190" rx="300" ry="32" fill="#a7f3d0" opacity="0.25"/>

      <!-- SATELLITE 1: 3D #1 Google Rank Medal (Top Left) -->
      <g transform="translate(-230, -85) rotate(-10)" filter="url(#shadow-3d-md)">
        <circle cx="0" cy="0" r="38" fill="url(#gold-grad)"/>
        <circle cx="0" cy="0" r="32" fill="#ffffff"/>
        <text x="0" y="8" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="900" fill="#ca8a04" text-anchor="middle">#1</text>
        <!-- Ribbon hanging down -->
        <polygon points="-16,28 0,46 16,28" fill="#ca8a04"/>
      </g>

      <!-- SATELLITE 2: 3D Trending Traffic Chart (Top Right) -->
      <g transform="translate(230, -80) rotate(12)" filter="url(#shadow-3d-md)">
        <rect x="-55" y="-40" width="110" height="80" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <path d="M -38 18 L -15 0 L 10 10 L 38 -18" fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
        <polygon points="38,-18 28,-18 38,-8" fill="#10b981"/>
        <text x="0" y="30" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="800" fill="#059669" text-anchor="middle">+450% SEO</text>
      </g>

      <!-- SATELLITE 3: 3D Word Count Chip (Bottom Left) -->
      <g transform="translate(-220, 85) rotate(8)" filter="url(#shadow-3d-md)">
        <rect x="-65" y="-22" width="130" height="44" rx="22" fill="#0f172a"/>
        <text x="0" y="6" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="800" fill="#38bdf8" text-anchor="middle">2,500 Words</text>
      </g>

      <!-- SATELLITE 4: 3D Read Time Chip (Bottom Right) -->
      <g transform="translate(220, 85) rotate(-8)" filter="url(#shadow-3d-md)">
        <rect x="-65" y="-22" width="130" height="44" rx="22" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <text x="0" y="6" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="800" fill="#0f172a" text-anchor="middle">⏱ 5 Min Read</text>
      </g>

      <!-- MAIN 3D EDITORIAL BLOG TABLET (Centerpiece) -->
      <g filter="url(#shadow-3d-lg)" transform="translate(0, -15)">
        <!-- Back depth layer -->
        <rect x="-170" y="-125" width="340" height="250" rx="24" fill="#065f46" transform="translate(8, 12)"/>
        <!-- Main Document Sheet -->
        <rect x="-170" y="-125" width="340" height="250" rx="24" fill="#ffffff" stroke="#a7f3d0" stroke-width="3"/>

        <!-- Article Banner -->
        <rect x="-170" y="-125" width="340" height="60" rx="24" fill="url(#editorial-hero)"/>
        <rect x="-170" y="-85" width="340" height="20" fill="url(#editorial-hero)"/>

        <!-- Article Title & Meta -->
        <rect x="-145" y="-45" width="80" height="18" rx="9" fill="#dcfce7"/>
        <text x="-105" y="-32" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="900" fill="#15803d" text-anchor="middle">PUBLISHED</text>

        <text x="-145" y="-2" font-family="'Plus Jakarta Sans', sans-serif" font-size="17" font-weight="900" fill="#0f172a">How AI Transforms Productivity</text>

        <!-- Content Paragraph Lines with glowing accents -->
        <rect x="-145" y="16" width="290" height="8" rx="4" fill="#cbd5e1"/>
        <rect x="-145" y="32" width="270" height="8" rx="4" fill="#e2e8f0"/>
        <rect x="-145" y="48" width="280" height="8" rx="4" fill="#e2e8f0"/>
        <rect x="-145" y="64" width="220" height="8" rx="4" fill="#e2e8f0"/>
        <rect x="-145" y="80" width="250" height="8" rx="4" fill="#e2e8f0"/>

        <!-- Subheading in article -->
        <rect x="-145" y="100" width="120" height="10" rx="5" fill="#3b82f6" opacity="0.6"/>
      </g>

      <!-- 3D HOLOGRAPHIC AI STYLUS / FOUNTAIN PEN (Writing on document) -->
      <g transform="translate(140, 20) rotate(-40)" filter="url(#shadow-3d-lg)">
        <!-- Pen Body -->
        <rect x="-7" y="-90" width="14" height="130" rx="7" fill="url(#quill-body)"/>
        <!-- Golden Nib -->
        <polygon points="-7,40 0,65 7,40" fill="url(#gold-grad)"/>
        <line x1="0" y1="40" x2="0" y2="58" stroke="#ffffff" stroke-width="1.5"/>
        <!-- Glowing Light Beam from Nib -->
        <circle cx="0" cy="65" r="8" fill="#38bdf8" filter="url(#glow-cyan)"/>
      </g>

      <!-- Sparkles -->
      <g transform="translate(150, -120)" filter="url(#glow-gold)">
        <polygon points="0,-16 4,-4 16,0 4,4 0,16 -4,4 -16,0 -4,-4" fill="#fbbf24"/>
      </g>
      <g transform="translate(-150, 110)" filter="url(#glow-emerald)">
        <polygon points="0,-14 4,-3 14,0 4,3 0,14 -4,3 -14,0 -4,-3" fill="#10b981"/>
      </g>

      <!-- Frosted Glass Pill Badge -->
      <g transform="translate(-160, 160)" filter="url(#shadow-3d-sm)">
        <rect width="320" height="54" rx="27" fill="url(#glass-pill)" stroke="#a7f3d0" stroke-width="2"/>
        <circle cx="30" cy="27" r="16" fill="#059669"/>
        <path d="M 23 27 L 28 32 L 37 22" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <text x="60" y="35" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="15" font-weight="900" fill="#0f172a" letter-spacing="1.2">AI LONG-FORM BLOG WRITER</text>
      </g>
    </g>
  </svg>
  `;
}

/**
 * 7. WORD TO PDF (word-to-pdf.png)
 * 3D Microsoft Word (.DOCX) document transforming into Adobe PDF (.PDF)
 * via a golden conversion gateway portal with high-energy directional rays
 */
function getWordToPdfSvg() {
  return `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    ${studioDefs}
    <defs>
      <linearGradient id="bg-w2p" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="50%" stop-color="#eff6ff"/>
        <stop offset="100%" stop-color="#fee2e2"/>
      </linearGradient>
      <radialGradient id="glow-w2p" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.30"/>
        <stop offset="50%" stop-color="#ef4444" stop-opacity="0.20"/>
        <stop offset="100%" stop-color="#f8fafc" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="word-navy" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2563eb"/>
        <stop offset="50%" stop-color="#1d4ed8"/>
        <stop offset="100%" stop-color="#1e3a8a"/>
      </linearGradient>
      <linearGradient id="pdf-ruby" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff4b4b"/>
        <stop offset="50%" stop-color="#dc2626"/>
        <stop offset="100%" stop-color="#991b1b"/>
      </linearGradient>
    </defs>

    <rect width="${W}" height="${H}" fill="url(#bg-w2p)"/>
    <ellipse cx="600" cy="375" r="460" fill="url(#glow-w2p)"/>
    ${getDotGrid()}

    <g transform="translate(600, 360)">
      <!-- Ground Shadow & Pedestal Base -->
      <ellipse cx="0" cy="200" rx="380" ry="60" fill="#0f172a" opacity="0.14" filter="url(#shadow-3d-lg)"/>
      <ellipse cx="-160" cy="190" rx="140" ry="24" fill="#93c5fd" opacity="0.25"/>
      <ellipse cx="160" cy="190" rx="140" ry="24" fill="#fca5a5" opacity="0.25"/>

      <!-- LEFT: 3D Microsoft Word Document (.DOCX) -->
      <g transform="translate(-170, -15) rotate(-6)" filter="url(#shadow-3d-lg)">
        <!-- Back depth layer -->
        <rect x="-85" y="-120" width="170" height="240" rx="18" fill="#172554" transform="translate(6, 10)"/>
        <!-- Front Surface -->
        <rect x="-85" y="-120" width="170" height="240" rx="18" fill="url(#word-navy)" stroke="#93c5fd" stroke-width="3"/>
        <!-- Folded Page Corner Top Right -->
        <path d="M 40 -120 L 40 -80 L 85 -80 Z" fill="#172554" opacity="0.5"/>
        <path d="M 40 -120 L 85 -80 L 40 -80 Z" fill="#ffffff" opacity="0.85"/>

        <!-- Word Emblem "W" Badge -->
        <g transform="translate(-55, -95)">
          <rect width="52" height="46" rx="12" fill="#ffffff" filter="url(#shadow-3d-sm)"/>
          <text x="26" y="32" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="28" font-weight="900" fill="#1d4ed8" text-anchor="middle">W</text>
        </g>

        <!-- Document Content Lines -->
        <rect x="-55" y="-35" width="115" height="9" rx="4.5" fill="#ffffff" opacity="0.8"/>
        <rect x="-55" y="-18" width="95" height="9" rx="4.5" fill="#ffffff" opacity="0.5"/>
        <rect x="-55" y="-1" width="105" height="9" rx="4.5" fill="#ffffff" opacity="0.5"/>
        <rect x="-55" y="16" width="80" height="9" rx="4.5" fill="#ffffff" opacity="0.5"/>

        <!-- Pill Badge on Card -->
        <rect x="-55" y="46" width="68" height="22" rx="11" fill="#1e3a8a"/>
        <text x="-21" y="61" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="900" fill="#93c5fd" text-anchor="middle">.DOCX</text>
      </g>

      <!-- CENTER: 3D Glowing Transformation Gateway Portal -->
      <g transform="translate(0, -15)">
        <!-- Luminous Portal Rings -->
        <ellipse cx="0" cy="0" rx="55" ry="55" fill="none" stroke="url(#gold-grad)" stroke-width="5" stroke-dasharray="10,6" filter="url(#glow-gold)"/>
        <!-- Directional Flow Chevrons -->
        <path d="M -30 -18 L -6 0 L -30 18" fill="none" stroke="#f59e0b" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M -6 -18 L 18 0 L -6 18" fill="none" stroke="#ea580c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M 18 -18 L 42 0 L 18 18" fill="none" stroke="#dc2626" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      </g>

      <!-- RIGHT: 3D Adobe PDF Document (.PDF) -->
      <g transform="translate(170, -15) rotate(6)" filter="url(#shadow-3d-lg)">
        <!-- Back depth layer -->
        <rect x="-85" y="-120" width="170" height="240" rx="18" fill="#7f1d1d" transform="translate(6, 10)"/>
        <!-- Front Surface -->
        <rect x="-85" y="-120" width="170" height="240" rx="18" fill="url(#pdf-ruby)" stroke="#fca5a5" stroke-width="3"/>
        <!-- Folded Page Corner Top Right -->
        <path d="M 40 -120 L 40 -80 L 85 -80 Z" fill="#7f1d1d" opacity="0.5"/>
        <path d="M 40 -120 L 85 -80 L 40 -80 Z" fill="#ffffff" opacity="0.85"/>

        <!-- PDF Emblem Badge -->
        <g transform="translate(-55, -95)">
          <rect width="65" height="46" rx="12" fill="#ffffff" filter="url(#shadow-3d-sm)"/>
          <text x="32.5" y="32" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="24" font-weight="900" fill="#dc2626" text-anchor="middle" letter-spacing="1">PDF</text>
        </g>

        <!-- Document Content Lines -->
        <rect x="-55" y="-35" width="115" height="9" rx="4.5" fill="#ffffff" opacity="0.8"/>
        <rect x="-55" y="-18" width="95" height="9" rx="4.5" fill="#ffffff" opacity="0.5"/>
        <rect x="-55" y="-1" width="105" height="9" rx="4.5" fill="#ffffff" opacity="0.5"/>
        <rect x="-55" y="16" width="80" height="9" rx="4.5" fill="#ffffff" opacity="0.5"/>

        <!-- Standardized PDF Security Stamp -->
        <rect x="-55" y="46" width="68" height="22" rx="11" fill="#7f1d1d"/>
        <text x="-21" y="61" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="900" fill="#fca5a5" text-anchor="middle">.PDF</text>
      </g>

      <!-- Sparkles -->
      <g transform="translate(0, -95)" filter="url(#glow-gold)">
        <polygon points="0,-16 4,-4 16,0 4,4 0,16 -4,4 -16,0 -4,-4" fill="#fbbf24"/>
      </g>
      <g transform="translate(-250, -80)" filter="url(#glow-blue)">
        <polygon points="0,-14 4,-3 14,0 4,3 0,14 -4,3 -14,0 -4,-3" fill="#3b82f6"/>
      </g>

      <!-- Frosted Glass Pill Badge -->
      <g transform="translate(-160, 160)" filter="url(#shadow-3d-sm)">
        <rect width="320" height="54" rx="27" fill="url(#glass-pill)" stroke="#e2e8f0" stroke-width="2"/>
        <circle cx="30" cy="27" r="16" fill="#2563eb"/>
        <path d="M 23 27 L 28 32 L 37 22" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <text x="60" y="35" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="15" font-weight="900" fill="#0f172a" letter-spacing="1.2">WORD DOCX TO SECURE PDF</text>
      </g>
    </g>
  </svg>
  `;
}

/**
 * 8. PDF UNLOCK (pdf-unlock.png)
 * Heavy 3D Golden Padlock in the OPEN state, radiating emerald freedom beams,
 * floating golden skeleton key, shattered restriction chains, and decrypted PDF document
 */
function getPdfUnlockSvg() {
  return `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    ${studioDefs}
    <defs>
      <linearGradient id="bg-unl" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="50%" stop-color="#f0fdf4"/>
        <stop offset="100%" stop-color="#dcfce7"/>
      </linearGradient>
      <radialGradient id="glow-unl" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#10b981" stop-opacity="0.35"/>
        <stop offset="50%" stop-color="#34d399" stop-opacity="0.14"/>
        <stop offset="100%" stop-color="#f0fdf4" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="emerald-shield" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#34d399"/>
        <stop offset="100%" stop-color="#059669"/>
      </linearGradient>
    </defs>

    <rect width="${W}" height="${H}" fill="url(#bg-unl)"/>
    <ellipse cx="600" cy="375" r="460" fill="url(#glow-unl)"/>
    ${getDotGrid()}

    <g transform="translate(600, 360)">
      <!-- Ground Shadow & Pedestal Base -->
      <ellipse cx="0" cy="200" rx="380" ry="60" fill="#0f172a" opacity="0.14" filter="url(#shadow-3d-lg)"/>
      <ellipse cx="0" cy="190" rx="300" ry="32" fill="#86efac" opacity="0.3"/>

      <!-- LEFT: Decrypted 3D PDF Document with Green Freedom Rays -->
      <g transform="translate(-160, -15) rotate(-6)" filter="url(#shadow-3d-lg)">
        <rect x="-85" y="-120" width="170" height="240" rx="18" fill="#ffffff" stroke="#86efac" stroke-width="3"/>
        <!-- PDF Badge -->
        <rect x="-65" y="-95" width="70" height="34" rx="10" fill="#ef4444"/>
        <text x="-30" y="-72" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="18" font-weight="900" fill="#ffffff" text-anchor="middle">PDF</text>

        <!-- Unlocked Badge on Document -->
        <rect x="-65" y="-45" width="130" height="26" rx="8" fill="#dcfce7"/>
        <text x="0" y="-28" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="900" fill="#15803d" text-anchor="middle">🔓 NO PASSWORD</text>

        <!-- Clean Text Lines -->
        <rect x="-65" y="-5" width="130" height="8" rx="4" fill="#cbd5e1"/>
        <rect x="-65" y="12" width="115" height="8" rx="4" fill="#e2e8f0"/>
        <rect x="-65" y="29" width="125" height="8" rx="4" fill="#e2e8f0"/>
        <rect x="-65" y="46" width="90" height="8" rx="4" fill="#e2e8f0"/>

        <!-- Emerald Security Checkmark Badge -->
        <g transform="translate(35, 60)">
          <circle cx="0" cy="0" r="16" fill="url(#emerald-shield)"/>
          <path d="M -6 0 L -2 4 L 6 -4" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </g>
      </g>

      <!-- SHATTERED CHAIN LINKS FLOATING IN SPACE -->
      <g transform="translate(-30, -90) rotate(25)" filter="url(#shadow-3d-sm)" opacity="0.8">
        <path d="M -15 0 C -15 -10, 15 -10, 15 0 C 15 10, -15 10, -15 0 Z" fill="none" stroke="url(#silver-grad)" stroke-width="7"/>
      </g>
      <g transform="translate(-10, 60) rotate(-35)" filter="url(#shadow-3d-sm)" opacity="0.8">
        <path d="M -12 0 C -12 -8, 12 -8, 12 0 C 12 8, -12 8, -12 0 Z" fill="none" stroke="url(#silver-grad)" stroke-width="6"/>
      </g>

      <!-- CENTER-RIGHT: MASSIVE 3D GOLDEN PADLOCK (OPEN STATE) -->
      <g transform="translate(130, -10)" filter="url(#shadow-3d-lg)">
        <!-- Chrome Shackle (Lifted up and swung open) -->
        <path d="M -40 -40 L -40 -85 C -40 -125, 40 -125, 40 -85 L 40 -65" fill="none" stroke="url(#silver-grad)" stroke-width="22" stroke-linecap="round"/>
        <!-- Shackle Gap showing it is UNLOCKED -->
        <line x1="40" y1="-65" x2="40" y2="-40" stroke="#f0fdf4" stroke-width="8" opacity="0.3"/>

        <!-- Solid Gold Padlock Body -->
        <!-- Depth plate -->
        <rect x="-70" y="-40" width="140" height="150" rx="28" fill="#713f12" transform="translate(8, 12)"/>
        <!-- Front Surface -->
        <rect x="-70" y="-40" width="140" height="150" rx="28" fill="url(#gold-grad)" stroke="#fef08a" stroke-width="3"/>

        <!-- Bevel Sheen on Padlock -->
        <rect x="-55" y="-28" width="110" height="12" rx="6" fill="#ffffff" opacity="0.5"/>

        <!-- Keyhole with Glowing Emerald Light Emission -->
        <g transform="translate(0, 30)">
          <circle cx="0" cy="0" r="16" fill="#0f172a"/>
          <circle cx="0" cy="0" r="14" fill="#022c22"/>
          <polygon points="-5,0 5,0 8,24 -8,24" fill="#022c22"/>
          <!-- Glowing Core inside Keyhole -->
          <circle cx="0" cy="0" r="6" fill="#34d399" filter="url(#glow-emerald)"/>
        </g>
      </g>

      <!-- 3D FLOATING ORNATE GOLDEN SKELETON KEY -->
      <g transform="translate(230, -75) rotate(-45)" filter="url(#shadow-3d-md)">
        <!-- Key Head Ring -->
        <circle cx="0" cy="-35" r="20" fill="none" stroke="url(#gold-grad)" stroke-width="7"/>
        <circle cx="0" cy="-35" r="8" fill="#ffffff" opacity="0.6"/>
        <!-- Key Shaft -->
        <rect x="-3.5" y="-18" width="7" height="60" rx="3.5" fill="url(#gold-grad)"/>
        <!-- Key Teeth -->
        <rect x="0" y="24" width="14" height="6" rx="2" fill="url(#gold-grad)"/>
        <rect x="0" y="34" width="18" height="6" rx="2" fill="url(#gold-grad)"/>
      </g>

      <!-- Sparkles -->
      <g transform="translate(70, -125)" filter="url(#glow-gold)">
        <polygon points="0,-16 4,-4 16,0 4,4 0,16 -4,4 -16,0 -4,-4" fill="#fbbf24"/>
      </g>
      <g transform="translate(-140, 110)" filter="url(#glow-emerald)">
        <polygon points="0,-14 4,-3 14,0 4,3 0,14 -4,3 -14,0 -4,-3" fill="#34d399"/>
      </g>

      <!-- Frosted Glass Pill Badge -->
      <g transform="translate(-160, 160)" filter="url(#shadow-3d-sm)">
        <rect width="320" height="54" rx="27" fill="url(#glass-pill)" stroke="#86efac" stroke-width="2"/>
        <circle cx="30" cy="27" r="16" fill="#059669"/>
        <path d="M 23 27 L 28 32 L 37 22" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <text x="60" y="35" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="15" font-weight="900" fill="#0f172a" letter-spacing="1.2">UNLOCK &amp; REMOVE PASSWORD</text>
      </g>
    </g>
  </svg>
  `;
}

async function renderToolImages() {
  console.log("🎨 Rendering 8 high quality 3D aesthetic design tool images...");

  const toolList = [
    { name: "pdf-converter.png", svg: getPdfConverterSvg(), title: "PDF Converter" },
    { name: "pdf-to-jpg.png", svg: getPdfToJpgSvg(), title: "PDF to JPG" },
    {
      name: "open-graph-generator.png",
      svg: getOpenGraphGeneratorSvg(),
      title: "Open Graph Generator",
    },
    {
      name: "ai-hashtag-generator.png",
      svg: getAiHashtagGeneratorSvg(),
      title: "AI Hashtag Generator",
    },
    {
      name: "ai-caption-generator.png",
      svg: getAiCaptionGeneratorSvg(),
      title: "AI Caption Generator",
    },
    { name: "ai-blog-generator.png", svg: getAiBlogGeneratorSvg(), title: "AI Blog Generator" },
    { name: "word-to-pdf.png", svg: getWordToPdfSvg(), title: "Word to PDF" },
    { name: "pdf-unlock.png", svg: getPdfUnlockSvg(), title: "PDF Unlock" },
  ];

  for (const item of toolList) {
    const pngBuffer = await sharp(Buffer.from(item.svg))
      .png({ quality: 96, compressionLevel: 8 })
      .toBuffer();

    for (const dir of targetDirs) {
      const destPath = path.join(dir, item.name);
      fs.writeFileSync(destPath, pngBuffer);
    }
    console.log(
      `✅ [3D Aesthetic Photo] Generated for ${item.title} -> ${item.name} (${pngBuffer.length} bytes)`,
    );
  }

  console.log(
    "\n🚀 All 8 3D aesthetic design tool photos successfully rendered and saved across all asset directories!",
  );
}

renderToolImages().catch((err) => {
  console.error("Error rendering tool images:", err);
  process.exit(1);
});
