const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', '..', 'frontend', 'assets', 'images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function cardSvg(title, bgGrad, cakeDrawing, badge = 'Artisan') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      ${bgGrad}
    </linearGradient>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#2C1810" flood-opacity="0.25"/>
    </filter>
    <radialGradient id="plateGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="85%" stop-color="#F2E9E4"/>
      <stop offset="100%" stop-color="#E2D4CC"/>
    </radialGradient>
  </defs>
  <!-- Background with warm gradient -->
  <rect width="600" height="400" rx="16" fill="url(#bg)"/>
  
  <!-- Bakery table surface / marble plate -->
  <ellipse cx="300" cy="310" rx="220" ry="60" fill="#000000" opacity="0.1" filter="url(#softShadow)"/>
  <ellipse cx="300" cy="305" rx="210" ry="50" fill="url(#plateGrad)"/>
  <ellipse cx="300" cy="305" rx="180" ry="40" fill="none" stroke="#DDA15E" stroke-width="2" stroke-opacity="0.4"/>

  <!-- Bakery Illustration Artwork -->
  ${cakeDrawing}

  <!-- Badge -->
  <g transform="translate(460, 30)">
    <rect width="110" height="32" rx="16" fill="#4A2E18" opacity="0.85"/>
    <text x="55" y="21" font-family="'Poppins', sans-serif" font-size="12" font-weight="600" fill="#FFF" text-anchor="middle" letter-spacing="1">${badge}</text>
  </g>
</svg>`;
}

const images = {
  'cake-chocolate.svg': cardSvg(
    'Belgian Chocolate Truffle Cake',
    `<stop offset="0%" stop-color="#4A2810"/><stop offset="100%" stop-color="#2D1508"/>`,
    `
    <!-- Chocolate Cake Multi-layer -->
    <g transform="translate(300, 240)">
      <!-- Base layer -->
      <path d="M -120 0 C -120 40, 120 40, 120 0 L 120 -60 C 120 -90, -120 -90, -120 -60 Z" fill="#3D1D0B" stroke="#251005" stroke-width="3"/>
      <!-- Frosting band -->
      <path d="M -120 -30 C -120 -10, 120 -10, 120 -30" stroke="#78350F" stroke-width="12" fill="none"/>
      <!-- Cake Top Ganache -->
      <ellipse cx="0" cy="-60" rx="120" ry="40" fill="#54230D"/>
      <!-- Drips -->
      <path d="M -110 -60 C -110 -40, -95 -30, -95 -50 C -95 -35, -70 -20, -70 -45 C -70 -25, -40 -15, -40 -40 C -40 -20, 0 -10, 0 -45 C 0 -20, 40 -15, 40 -40 C 40 -25, 70 -20, 70 -45 C 70 -35, 95 -30, 95 -50 C 95 -40, 110 -60, 110 -60" fill="#2D1508"/>
      <!-- Chocolate rosettes & curls -->
      <circle cx="-60" cy="-70" r="14" fill="#3B1A08"/>
      <circle cx="-20" cy="-78" r="14" fill="#3B1A08"/>
      <circle cx="20" cy="-78" r="14" fill="#3B1A08"/>
      <circle cx="60" cy="-70" r="14" fill="#3B1A08"/>
      <circle cx="0" cy="-65" r="12" fill="#D4A373"/>
      <!-- Gold leaf flakes -->
      <polygon points="-40,-65 -35,-68 -32,-63 -38,-61" fill="#FFD700"/>
      <polygon points="35,-72 40,-75 42,-69 36,-68" fill="#FFD700"/>
    </g>
    `,
    'Bestseller'
  ),

  'cake-redvelvet.svg': cardSvg(
    'Red Velvet Cream Cheese Cake',
    `<stop offset="0%" stop-color="#59141B"/><stop offset="100%" stop-color="#3B0A10"/>`,
    `
    <g transform="translate(300, 240)">
      <!-- Crimson sponge base -->
      <path d="M -120 0 C -120 40, 120 40, 120 0 L 120 -60 C 120 -90, -120 -90, -120 -60 Z" fill="#800E13" stroke="#590D10" stroke-width="3"/>
      <!-- Cream cheese layer lines -->
      <path d="M -120 -30 C -120 -10, 120 -10, 120 -30" stroke="#FFFDF0" stroke-width="12" fill="none"/>
      <!-- Frosting top -->
      <ellipse cx="0" cy="-60" rx="120" ry="40" fill="#FFFDF0"/>
      <!-- Red velvet crumbs & white swirls -->
      <circle cx="-70" cy="-68" r="12" fill="#FFF"/>
      <circle cx="-35" cy="-74" r="14" fill="#FFF"/>
      <circle cx="0" cy="-76" r="15" fill="#FFF"/>
      <circle cx="35" cy="-74" r="14" fill="#FFF"/>
      <circle cx="70" cy="-68" r="12" fill="#FFF"/>
      <!-- Crimson crumbs on top -->
      <circle cx="-20" cy="-65" r="3" fill="#AD2831"/>
      <circle cx="-10" cy="-60" r="4" fill="#AD2831"/>
      <circle cx="15" cy="-62" r="3.5" fill="#AD2831"/>
      <circle cx="25" cy="-68" r="4" fill="#AD2831"/>
      <circle cx="5" cy="-70" r="3" fill="#AD2831"/>
    </g>
    `,
    'Premium'
  ),

  'cake-vanilla.svg': cardSvg(
    'Classic Vanilla Buttercream Cake',
    `<stop offset="0%" stop-color="#DDA15E"/><stop offset="100%" stop-color="#9C6644"/>`,
    `
    <g transform="translate(300, 240)">
      <!-- Golden vanilla sponge -->
      <path d="M -120 0 C -120 40, 120 40, 120 0 L 120 -60 C 120 -90, -120 -90, -120 -60 Z" fill="#F4E0A5" stroke="#DDA15E" stroke-width="3"/>
      <path d="M -120 -30 C -120 -10, 120 -10, 120 -30" stroke="#FFF" stroke-width="12" fill="none"/>
      <ellipse cx="0" cy="-60" rx="120" ry="40" fill="#FFF9ED"/>
      <!-- Pastel rosettes -->
      <circle cx="-60" cy="-68" r="15" fill="#F7D6D0"/>
      <circle cx="-20" cy="-75" r="16" fill="#FCEEE9"/>
      <circle cx="20" cy="-75" r="16" fill="#F7D6D0"/>
      <circle cx="60" cy="-68" r="15" fill="#FCEEE9"/>
      <circle cx="0" cy="-65" r="10" fill="#E29578"/>
      <!-- Vanilla bean flecks -->
      <circle cx="-15" cy="-62" r="1.5" fill="#583101"/>
      <circle cx="10" cy="-60" r="1.5" fill="#583101"/>
      <circle cx="30" cy="-64" r="1.5" fill="#583101"/>
    </g>
    `,
    'Classic'
  ),

  'cupcake-caramel.svg': cardSvg(
    'Salted Caramel Crunch Cupcake',
    `<stop offset="0%" stop-color="#6F4E37"/><stop offset="100%" stop-color="#3D2B1F"/>`,
    `
    <g transform="translate(300, 220)">
      <!-- Liner -->
      <path d="M -70 40 L -45 110 L 45 110 L 70 40 Z" fill="#DDA15E" stroke="#BC6C25" stroke-width="3"/>
      <path d="M -30 40 L -15 110 M 0 40 L 0 110 M 30 40 L 15 110" stroke="#BC6C25" stroke-width="2"/>
      <!-- Caramel Frosting Cloud -->
      <path d="M -80 40 C -80 0, -40 -10, -30 0 C -20 -30, 20 -30, 30 0 C 40 -10, 80 0, 80 40 Z" fill="#C68B59"/>
      <path d="M -50 0 C -50 -40, 50 -40, 50 0 Z" fill="#DDA15E"/>
      <path d="M -30 -30 C -30 -60, 30 -60, 30 -30 Z" fill="#E6CCB2"/>
      <!-- Salt crystals & caramel drizzle -->
      <path d="M -40 -20 Q 0 10 40 -10" stroke="#7F4F24" stroke-width="5" fill="none" stroke-linecap="round"/>
      <rect x="-10" y="-45" width="8" height="8" rx="2" fill="#FFF" transform="rotate(25 -10 -45)"/>
      <rect x="15" y="-35" width="7" height="7" rx="2" fill="#FFF" transform="rotate(15 15 -35)"/>
    </g>
    `,
    'Special'
  ),

  'cupcake-blueberry.svg': cardSvg(
    'Blueberry Swirl Cupcake',
    `<stop offset="0%" stop-color="#3D348B"/><stop offset="100%" stop-color="#1B1745"/>`,
    `
    <g transform="translate(300, 220)">
      <path d="M -70 40 L -45 110 L 45 110 L 70 40 Z" fill="#E0AAFF" stroke="#9D4EDD" stroke-width="3"/>
      <path d="M -80 40 C -80 0, -40 -10, -30 0 C -20 -30, 20 -30, 30 0 C 40 -10, 80 0, 80 40 Z" fill="#C77DFF"/>
      <path d="M -50 0 C -50 -40, 50 -40, 50 0 Z" fill="#E0AAFF"/>
      <path d="M -30 -30 C -30 -60, 30 -60, 30 -30 Z" fill="#F3C4FB"/>
      <!-- Real blueberries on top -->
      <circle cx="-15" cy="-45" r="10" fill="#240046"/>
      <circle cx="15" cy="-40" r="11" fill="#3C096C"/>
      <circle cx="0" cy="-55" r="9" fill="#10002B"/>
      <!-- Mint leaf -->
      <path d="M 0 -60 Q 15 -75 25 -65 Q 10 -55 0 -60" fill="#52B788"/>
    </g>
    `,
    'Fruity'
  ),

  'cupcake-chocolate.svg': cardSvg(
    'Double Chocolate Fudge Cupcake',
    `<stop offset="0%" stop-color="#4A2810"/><stop offset="100%" stop-color="#1E0E04"/>`,
    `
    <g transform="translate(300, 220)">
      <path d="M -70 40 L -45 110 L 45 110 L 70 40 Z" fill="#582F0E" stroke="#331A05" stroke-width="3"/>
      <path d="M -80 40 C -80 0, -40 -10, -30 0 C -20 -30, 20 -30, 30 0 C 40 -10, 80 0, 80 40 Z" fill="#3D1D0B"/>
      <path d="M -50 0 C -50 -40, 50 -40, 50 0 Z" fill="#4B240F"/>
      <path d="M -30 -30 C -30 -60, 30 -60, 30 -30 Z" fill="#603013"/>
      <!-- Cocoa curls & dark heart -->
      <circle cx="0" cy="-50" r="12" fill="#7F4F24"/>
      <circle cx="-20" cy="-10" r="4" fill="#E6CCB2"/>
      <circle cx="20" cy="-15" r="4" fill="#E6CCB2"/>
      <circle cx="0" cy="5" r="4" fill="#E6CCB2"/>
    </g>
    `,
    'Decadent'
  ),

  'cookie-chocochip.svg': cardSvg(
    'Belgian Choco-Chip Cookies',
    `<stop offset="0%" stop-color="#7F4F24"/><stop offset="100%" stop-color="#462B14"/>`,
    `
    <g transform="translate(300, 240)">
      <!-- Cookie stack -->
      <!-- Back cookie -->
      <circle cx="-40" cy="10" r="65" fill="#D4A373" stroke="#B07D62" stroke-width="3"/>
      <circle cx="-70" cy="-10" r="9" fill="#3D1D0B"/>
      <circle cx="-40" cy="30" r="8" fill="#3D1D0B"/>
      <!-- Front cookie -->
      <circle cx="30" cy="-10" r="75" fill="#E6CCB2" stroke="#BC6C25" stroke-width="4"/>
      <!-- Molten chocolate chips -->
      <circle cx="-5" cy="-45" r="12" fill="#2E1705"/>
      <circle cx="45" cy="-50" r="10" fill="#2E1705"/>
      <circle cx="10" cy="-10" r="14" fill="#2E1705"/>
      <circle cx="65" cy="-5" r="11" fill="#2E1705"/>
      <circle cx="40" cy="30" r="13" fill="#2E1705"/>
      <circle cx="-10" cy="25" r="12" fill="#2E1705"/>
      <circle cx="-25" cy="-15" r="10" fill="#2E1705"/>
    </g>
    `,
    'Fresh Baked'
  ),

  'cookie-almond.svg': cardSvg(
    'Almond Oat Butter Crisps',
    `<stop offset="0%" stop-color="#936639"/><stop offset="100%" stop-color="#583101"/>`,
    `
    <g transform="translate(300, 240)">
      <circle cx="0" cy="0" r="80" fill="#EDE0D4" stroke="#DDB892" stroke-width="4"/>
      <!-- Sliced almonds -->
      <ellipse cx="-30" cy="-30" rx="18" ry="8" fill="#C6AC8F" transform="rotate(-30 -30 -30)"/>
      <ellipse cx="25" cy="-25" rx="20" ry="9" fill="#C6AC8F" transform="rotate(45 25 -25)"/>
      <ellipse cx="-20" cy="25" rx="19" ry="8" fill="#C6AC8F" transform="rotate(15 -20 25)"/>
      <ellipse cx="30" cy="20" rx="18" ry="9" fill="#C6AC8F" transform="rotate(-40 30 20)"/>
      <ellipse cx="0" cy="-2" rx="18" ry="8" fill="#B08968"/>
    </g>
    `,
    'Artisan'
  ),

  'pastry-strawberry.svg': cardSvg(
    'Fresh Strawberry Glaze Pastry',
    `<stop offset="0%" stop-color="#800E13"/><stop offset="100%" stop-color="#38040E"/>`,
    `
    <g transform="translate(300, 240)">
      <!-- Pastry slice triangular layers -->
      <path d="M -110 50 L 100 50 L 0 -40 Z" fill="#F4E0A5" stroke="#C68B59" stroke-width="3"/>
      <path d="M -100 30 L 90 30 L 0 -35 Z" fill="#FFF" opacity="0.9"/>
      <path d="M -90 10 L 80 10 L 0 -30 Z" fill="#FFCCD5"/>
      <!-- Strawberries on top -->
      <g transform="translate(0, -50)">
        <path d="M -35 0 C -35 -20, 0 -30, 0 -10 C 0 -30, 35 -20, 35 0 C 35 25, 0 40, 0 40 C 0 40, -35 25, -35 0 Z" fill="#D90429"/>
        <path d="M -10 -25 L 0 -15 L 10 -25" stroke="#2D6A4F" stroke-width="4" stroke-linecap="round"/>
        <circle cx="-12" cy="0" r="2" fill="#FFD166"/>
        <circle cx="0" cy="10" r="2" fill="#FFD166"/>
        <circle cx="12" cy="0" r="2" fill="#FFD166"/>
      </g>
    </g>
    `,
    'Seasonal'
  ),

  'pastry-blackforest.svg': cardSvg(
    'Black Forest Cherry Pastry',
    `<stop offset="0%" stop-color="#2B1308"/><stop offset="100%" stop-color="#140602"/>`,
    `
    <g transform="translate(300, 240)">
      <path d="M -110 50 L 100 50 L 0 -40 Z" fill="#3D1D0B" stroke="#251005" stroke-width="3"/>
      <path d="M -100 30 L 90 30 L 0 -35 Z" fill="#FFF" opacity="0.9"/>
      <path d="M -90 10 L 80 10 L 0 -30 Z" fill="#581C10"/>
      <!-- Cherries with stem -->
      <circle cx="-15" cy="-60" r="14" fill="#9D0208"/>
      <circle cx="15" cy="-55" r="13" fill="#6A040F"/>
      <path d="M -12 -72 C 0 -95, 20 -85, 25 -95" fill="none" stroke="#2D6A4F" stroke-width="3" stroke-linecap="round"/>
      <!-- Chocolate shavings -->
      <rect x="-40" y="-30" width="12" height="4" rx="2" fill="#240D05" transform="rotate(25 -40 -30)"/>
      <rect x="25" y="-35" width="14" height="4" rx="2" fill="#240D05" transform="rotate(-15 25 -35)"/>
    </g>
    `,
    'Classic'
  ),

  'brownie-walnut.svg': cardSvg(
    'Sizzling Walnut Fudge Brownie',
    `<stop offset="0%" stop-color="#3A1C06"/><stop offset="100%" stop-color="#190A01"/>`,
    `
    <g transform="translate(300, 230)">
      <!-- Dense chocolate block -->
      <polygon points="-80,30 20,60 100,0 0,-30" fill="#2F1303" stroke="#1A0A01" stroke-width="3"/>
      <polygon points="-80,30 20,60 20,10 -80,-20" fill="#4A2308"/>
      <polygon points="20,60 100,0 100,-50 20,10" fill="#391804"/>
      <!-- Walnut pieces on surface -->
      <ellipse cx="20" cy="-5" rx="16" ry="10" fill="#C68B59" transform="rotate(-15 20 -5)"/>
      <ellipse cx="-20" cy="10" rx="14" ry="9" fill="#B07D62" transform="rotate(20 -20 10)"/>
      <ellipse cx="50" cy="-20" rx="12" ry="8" fill="#C68B59"/>
    </g>
    `,
    'Fudgy'
  ),

  'brownie-nutella.svg': cardSvg(
    'Nutella Overload Brownie',
    `<stop offset="0%" stop-color="#481F01"/><stop offset="100%" stop-color="#240E00"/>`,
    `
    <g transform="translate(300, 230)">
      <polygon points="-80,30 20,60 100,0 0,-30" fill="#2F1303" stroke="#1A0A01" stroke-width="3"/>
      <!-- Nutella glossy glaze drip -->
      <polygon points="-75,25 20,55 95,-2 0,-25" fill="#5E2C04"/>
      <path d="M -60 25 Q -40 45 -20 30 Q 0 50 30 40 Q 60 45 80 15" stroke="#3D1D05" stroke-width="8" fill="none" stroke-linecap="round"/>
      <!-- Hazelnuts -->
      <circle cx="-10" cy="5" r="9" fill="#D4A373"/>
      <circle cx="30" cy="-5" r="8" fill="#D4A373"/>
      <circle cx="10" cy="-20" r="7" fill="#C68B59"/>
    </g>
    `,
    'Heavenly'
  ),

  'hero-banner.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" width="1200" height="600">
  <defs>
    <linearGradient id="heroBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF9F2"/>
      <stop offset="50%" stop-color="#FCEEE9"/>
      <stop offset="100%" stop-color="#F7D6D0"/>
    </linearGradient>
    <filter id="heroShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="20" stdDeviation="25" flood-color="#4A2E18" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="1200" height="600" fill="url(#heroBg)"/>
  
  <!-- Bakery counter illustration -->
  <ellipse cx="600" cy="520" rx="550" ry="90" fill="#EAD7C8" opacity="0.6"/>
  <ellipse cx="600" cy="500" rx="500" ry="70" fill="#FFFFFF" opacity="0.9" filter="url(#heroShadow)"/>

  <!-- Tiered Celebration Cake in center -->
  <g transform="translate(600, 420)">
    <!-- Base tier -->
    <path d="M -140 0 C -140 40, 140 40, 140 0 L 140 -80 C 140 -120, -140 -120, -140 -80 Z" fill="#E6CCB2" stroke="#BC6C25" stroke-width="4"/>
    <ellipse cx="0" cy="-80" rx="140" ry="40" fill="#FFFDF0"/>
    <!-- Middle tier -->
    <path d="M -90 -80 C -90 -50, 90 -50, 90 -80 L 90 -160 C 90 -190, -90 -190, -90 -160 Z" fill="#F7D6D0" stroke="#E29578" stroke-width="4"/>
    <ellipse cx="0" cy="-160" rx="90" ry="30" fill="#FFFDF0"/>
    <!-- Top tier -->
    <path d="M -50 -160 C -50 -140, 50 -140, 50 -160 L 50 -230 C 50 -250, -50 -250, -50 -230 Z" fill="#D4A373" stroke="#B07D62" stroke-width="4"/>
    <ellipse cx="0" cy="-230" rx="50" ry="20" fill="#FFFDF0"/>
    <!-- Cake topper rosettes -->
    <circle cx="0" cy="-245" r="16" fill="#C1121F"/>
    <circle cx="-20" cy="-240" r="12" fill="#E29578"/>
    <circle cx="20" cy="-240" r="12" fill="#F7D6D0"/>
  </g>

  <!-- Left: Cupcake stand -->
  <g transform="translate(250, 430)">
    <ellipse cx="0" cy="40" rx="90" ry="25" fill="#E6CCB2"/>
    <path d="M -40 20 L -25 70 L 25 70 L 40 20 Z" fill="#DDA15E"/>
    <path d="M -45 20 C -45 -10, 45 -10, 45 20 Z" fill="#F7D6D0"/>
    <circle cx="0" cy="-5" r="8" fill="#C1121F"/>
  </g>

  <!-- Right: Croissant & Cookies -->
  <g transform="translate(950, 450)">
    <circle cx="-30" cy="10" r="45" fill="#E6CCB2" stroke="#BC6C25" stroke-width="2"/>
    <circle cx="-40" cy="0" r="6" fill="#3D1D0B"/>
    <circle cx="-20" cy="20" r="5" fill="#3D1D0B"/>
    <!-- Golden Croissant -->
    <path d="M 20 40 C 0 10, 40 -20, 80 0 C 100 20, 70 45, 20 40 Z" fill="#DDA15E" stroke="#BC6C25" stroke-width="3"/>
  </g>

  <!-- Floating Sparkles & Flour notes -->
  <circle cx="350" cy="180" r="4" fill="#E29578" opacity="0.6"/>
  <circle cx="850" cy="150" r="5" fill="#E29578" opacity="0.6"/>
  <circle cx="480" cy="100" r="3" fill="#DDA15E" opacity="0.8"/>
  <circle cx="720" cy="110" r="4" fill="#DDA15E" opacity="0.8"/>
</svg>`,

  'about-story.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 500" width="700" height="500">
  <defs>
    <linearGradient id="aboutBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF9F2"/>
      <stop offset="100%" stop-color="#FCEEE9"/>
    </linearGradient>
  </defs>
  <rect width="700" height="500" rx="20" fill="url(#aboutBg)"/>
  <!-- Oven & Kitchen counter -->
  <rect x="80" y="140" width="220" height="280" rx="16" fill="#4A2E18"/>
  <rect x="100" y="220" width="180" height="160" rx="10" fill="#2C1810"/>
  <!-- Oven glass warm glow -->
  <rect x="120" y="240" width="140" height="120" rx="8" fill="#F4A261" opacity="0.85"/>
  <ellipse cx="190" cy="300" rx="50" ry="20" fill="#E76F51"/>
  <!-- Loaves baking inside -->
  <ellipse cx="190" cy="295" rx="35" ry="14" fill="#9C6644"/>
  <!-- Counter top -->
  <rect x="320" y="240" width="300" height="180" rx="12" fill="#E6CCB2"/>
  <!-- Rolling pin -->
  <rect x="360" y="220" width="180" height="16" rx="8" fill="#DDA15E" transform="rotate(-15 450 228)"/>
  <!-- Flour dusting -->
  <ellipse cx="480" cy="235" rx="60" ry="12" fill="#FFFFFF" opacity="0.8"/>
  <!-- Chef hat -->
  <g transform="translate(480, 100)">
    <path d="M -40 40 C -60 10, -20 -30, 0 -20 C 20 -30, 60 10, 40 40 Z" fill="#FFFFFF" stroke="#E6CCB2" stroke-width="2"/>
    <rect x="-35" y="40" width="70" height="15" rx="3" fill="#FFFFFF" stroke="#E6CCB2" stroke-width="1.5"/>
  </g>
</svg>`,

  'baker-1.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <rect width="300" height="300" rx="150" fill="#FCEEE9"/>
  <!-- Chef portrait avatar -->
  <circle cx="150" cy="130" r="50" fill="#E0A96D"/>
  <!-- Chef Hat -->
  <path d="M 110 90 C 90 40, 140 10, 150 20 C 160 10, 210 40, 190 90 Z" fill="#FFFFFF"/>
  <rect x="115" y="85" width="70" height="15" fill="#FFFFFF"/>
  <!-- Hair & Smile -->
  <path d="M 105 110 C 110 90, 190 90, 195 110" fill="#4A2E18"/>
  <path d="M 135 150 Q 150 165 165 150" fill="none" stroke="#4A2E18" stroke-width="3" stroke-linecap="round"/>
  <!-- Eyes -->
  <circle cx="135" cy="130" r="4" fill="#4A2E18"/>
  <circle cx="165" cy="130" r="4" fill="#4A2E18"/>
  <!-- Uniform Coat -->
  <path d="M 70 270 C 70 200, 230 200, 230 270 Z" fill="#FFFFFF" stroke="#DDA15E" stroke-width="3"/>
  <!-- Red neckerchief -->
  <polygon points="135,190 165,190 150,220" fill="#C1121F"/>
</svg>`,

  'baker-2.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <rect width="300" height="300" rx="150" fill="#FFF9F2"/>
  <circle cx="150" cy="130" r="50" fill="#D4A373"/>
  <!-- Baker cap -->
  <ellipse cx="150" cy="85" rx="55" ry="20" fill="#4A2E18"/>
  <path d="M 105 115 C 110 85, 190 85, 195 115" fill="#2C1810"/>
  <path d="M 135 150 Q 150 165 165 150" fill="none" stroke="#2C1810" stroke-width="3" stroke-linecap="round"/>
  <circle cx="135" cy="130" r="4" fill="#2C1810"/>
  <circle cx="165" cy="130" r="4" fill="#2C1810"/>
  <path d="M 70 270 C 70 200, 230 200, 230 270 Z" fill="#BC6C25"/>
  <path d="M 130 200 L 170 200 L 160 270 L 140 270 Z" fill="#FFFFFF"/>
</svg>`,

  'baker-3.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <rect width="300" height="300" rx="150" fill="#F7D6D0"/>
  <circle cx="150" cy="130" r="50" fill="#E8C39E"/>
  <!-- Hair bun & Headband -->
  <circle cx="150" cy="70" r="25" fill="#4A2810"/>
  <rect x="100" y="90" width="100" height="12" rx="6" fill="#E29578"/>
  <path d="M 135 150 Q 150 165 165 150" fill="none" stroke="#4A2810" stroke-width="3" stroke-linecap="round"/>
  <circle cx="135" cy="130" r="4" fill="#4A2810"/>
  <circle cx="165" cy="130" r="4" fill="#4A2810"/>
  <path d="M 70 270 C 70 200, 230 200, 230 270 Z" fill="#FFFDF0" stroke="#E29578" stroke-width="3"/>
  <circle cx="150" cy="225" r="5" fill="#E29578"/>
  <circle cx="150" cy="245" r="5" fill="#E29578"/>
</svg>`
};

for (const [filename, content] of Object.entries(images)) {
  fs.writeFileSync(path.join(targetDir, filename), content.trim(), 'utf8');
  console.log(`Generated SVG asset: ${filename}`);
}

console.log('All 17 bakery SVG assets generated successfully!');
