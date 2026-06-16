const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const packagesMetadata = [
  {
    shareId: "pkgWeddingBasicCard",
    title: "Wedding Photography (Essential Single-Side)",
    desc: "Essential single-side wedding photography and videography coverage starting at ₹39,999 Net.",
    cover: "/uploaded_bride_yellow.jpg"
  },
  {
    shareId: "pkgWeddingPreCard",
    title: "Wedding Photo & Pre-Wedding",
    desc: "Perfect for capturing your beautiful pre-wedding love story and the complete wedding day celebrations.",
    cover: "/couple_fun_glasses.jpg"
  },
  {
    shareId: "pkgCandidCard",
    title: "Candid Photo & Videography",
    desc: "Our creative 3-camera setup featuring dedicated candid photography for artistic wedding stories.",
    cover: "/uploaded_bride_traditional.jpg"
  },
  {
    shareId: "pkgLuxuryCard",
    title: "Bride & Groom Luxury Package",
    desc: "Our ultimate dual-side wedding collection. Features 4-camera coverage, drone photography, and handcrafted album boxes.",
    cover: "/bride_christian_white.jpg"
  },
  {
    shareId: "pkgWeddingStandaloneDay",
    title: "Standalone Wedding Day",
    desc: "Dedicated professional photography & videography team for your wedding ceremony day coverage.",
    cover: "/uploaded_couple_blackwhite.jpg"
  },
  {
    shareId: "pkgWeddingStandaloneReception",
    title: "Standalone Reception",
    desc: "Sleek professional photo & video coverage optimized for your grand reception event.",
    cover: "/kochi_couple.jpg"
  },
  {
    shareId: "pkgEngagementBasicCard",
    title: "Engagement Photography (Essential)",
    desc: "Dedicated candid & traditional photographer coverage for your engagement ceremony.",
    cover: "/uploaded_bride_yellow.jpg"
  },
  {
    shareId: "pkgEngagementPreCard",
    title: "Bride or Groom Engagement Package",
    desc: "Our complete single-side engagement package including cinematic video, premium album, and reels.",
    cover: "/couple_fun_glasses.jpg"
  },
  {
    shareId: "pkgPremiumCandidCard",
    title: "Premium Candid Package (Engagement)",
    desc: "Our comprehensive 4-camera premium package featuring dedicated candid & traditional teams with helicam drone.",
    cover: "/couple_traditional_red.jpg"
  },
  {
    shareId: "pkgHaldiBasicCard",
    title: "Haldi Photography (Only)",
    desc: "Dedicated single photographer capturing the vibrant colors of your Haldi ceremony.",
    cover: "/athulraj.jpg"
  },
  {
    shareId: "pkgHaldiAlbumCard",
    title: "Haldi Photography with Album",
    desc: "Premium Haldi photography including a beautifully printed layflat album.",
    cover: "/anandha_lekshmi.jpg"
  },
  {
    shareId: "pkgHaldiPhotoVideoCard",
    title: "Haldi Photo & Videography",
    desc: "Full-spectrum cinematic and traditional coverage of your Haldi celebrations.",
    cover: "/kochi_couple.jpg"
  }
];

packagesMetadata.forEach((pkg) => {
  const fileName = `${pkg.shareId}.html`;
  const filePath = path.join(publicDir, fileName);
  
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dreamwed Stories | ${pkg.title}</title>
  
  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Dreamwed Stories | ${pkg.title}" />
  <meta property="og:description" content="${pkg.desc}" />
  <meta property="og:image" content="https://dreamwedstories.co.in${pkg.cover}" />
  <meta property="og:url" content="https://dreamwedstories.co.in/${pkg.shareId}.html" />
  <meta property="og:site_name" content="Dreamwed Stories" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Dreamwed Stories | ${pkg.title}" />
  <meta name="twitter:description" content="${pkg.desc}" />
  <meta name="twitter:image" content="https://dreamwedstories.co.in${pkg.cover}" />
  
  <!-- Instant Redirect Script -->
  <script>
    window.location.replace("/packages?pkg=${pkg.shareId}");
  </script>
</head>
<body>
  <div style="font-family: sans-serif; text-align: center; margin-top: 100px; color: #555;">
    <h2>Dreamwed Stories</h2>
    <p>Redirecting you to the package details...</p>
    <a href="/packages?pkg=${pkg.shareId}" style="color: #b4975a; text-decoration: none; font-weight: bold;">Click here if not redirected automatically</a>
  </div>
</body>
</html>
`;

  fs.writeFileSync(filePath, htmlContent, 'utf8');
  console.log(`Generated ${fileName}`);
});

console.log('Successfully generated all package social preview redirect pages!');
