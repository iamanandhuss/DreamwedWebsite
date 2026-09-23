// AI-Powered PDF Proposal Parser for Dreamwed Stories Admin & Client Proposal
// Powered by Google Gemini 2.5 Flash

export const DEFAULT_GEMINI_API_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_GEMINI_API_KEY) ||
  (typeof window !== "undefined" && localStorage.getItem("dreamwed_gemini_api_key")) ||
  "";

export async function loadPdfJs() {
  if (typeof window !== "undefined" && window.pdfjsLib) return window.pdfjsLib;

  return new Promise((resolve, reject) => {
    const existing = document.getElementById("pdfjs-cdn-script");
    if (existing) {
      if (window.pdfjsLib) {
        resolve(window.pdfjsLib);
        return;
      }
      existing.addEventListener("load", () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(window.pdfjsLib);
      });
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.id = "pdfjs-cdn-script";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(window.pdfjsLib);
      } else {
        reject(new Error("pdfjsLib not defined after script load"));
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export const DEFAULT_PHOTOS = {
  coverPhoto: "./images/parvathy_cloudinary_cover.jpg",
  packageBannerPhoto: "./images/parvathy_cloudinary_package.jpg",
  coverSlideshow: [
    "./images/parvathy_cloudinary_cover.jpg",
    "./images/parvathy_cloudinary_package.jpg",
    "./images/uploaded_bride_gold.jpg",
    "./images/kochi_couple.jpg",
    "./images/parvathi_wedding.jpg",
    "./images/uploaded_couple_blackwhite.jpg",
    "./images/bride_christian_white.jpg"
  ],
  event1Photo: "./images/gallery/01.jpg",
  event2Photo: "./images/gallery/ceremony_01.jpg",
  philosophyPhoto: "./images/uploaded_couple_blackwhite.jpg",
  gallery1: "./images/gallery/02.jpg",
  gallery2: "./images/gallery/ceremony_03.jpg",
  gallery3: "./images/gallery/04.jpg"
};

export const AVAILABLE_STOCK_PHOTOS = [
  { url: "./images/parvathy_cloudinary_cover.jpg", label: "Parvathy Ceremony Walk" },
  { url: "./images/parvathy_cloudinary_package.jpg", label: "Parvathy Intimate Portrait" },
  { url: "./images/parvathi_wedding.jpg", label: "Parvathy Muhurtham" },
  { url: "./images/gallery/01.jpg", label: "Save The Date Outdoor" },
  { url: "./images/gallery/02.jpg", label: "Kerala Bride Portrait" },
  { url: "./images/gallery/ceremony_01.jpg", label: "Wedding Stage Multicam" },
  { url: "./images/gallery/ceremony_02.jpg", label: "Traditional Mandap" },
  { url: "./images/gallery/ceremony_03.jpg", label: "Temple Ritual Moments" },
  { url: "./images/gallery/04.jpg", label: "Outdoor Sunset Couple" },
  { url: "./images/gallery/05.jpg", label: "Candid Joyful Smile" },
  { url: "./images/uploaded_bride_gold.jpg", label: "Traditional Gold Bride" },
  { url: "./images/kochi_couple.jpg", label: "Kochi Couple Outdoor" },
  { url: "./images/uploaded_couple_blackwhite.jpg", label: "Editorial B&W Romance" },
  { url: "./images/bride_christian_white.jpg", label: "White Gown Bride" }
];

export const PARVATHY_SAMPLE_PROPOSAL = {
  id: "proposal_parvathy_nov30",
  clientName: "PARVATHY",
  eventDate: "November 30, 2026",
  venue: "Kochi, Kerala",
  price: "1,45,000",
  originalPrice: "1,60,000",
  proposalNo: "DW-VIP-PARVATHY",
  packageTitle: "Pre-wedding Photography & Cinematography Special Package",
  packageSubtitle: "Special Package Curated For Parvathy",
  phone: "9995412955",
  upiId: "dreamwedstories@okaxis",
  photos: { ...DEFAULT_PHOTOS },
  events: [
    {
      eventTag: "PRE-WEDDING COVERAGE",
      title: "PRE-WEDDING COVERAGE",
      subhead: "PRE-WEDDING SHOOT",
      crew: ["1 Photographer", "1 Videographer", "20 Edited Master Photos"],
      description:
        "Outdoor couple pre-wedding portrait & video session capturing authentic storytelling, romantic poses, and color-graded high-resolution photos."
    },
    {
      eventTag: "MAIN CELEBRATION",
      title: "WEDDING & RECEPTION COVERAGE",
      subhead: "November 30, 2026",
      crew: [
        "1 Candid Photographer",
        "1 Traditional Photographer",
        "1 Candid Videographer",
        "1 Traditional Videographer"
      ],
      description:
        "Full-day multicam production covering early morning bridal preparations, auspicious muhurtham ceremonies, family blessings, and evening reception celebrations."
    }
  ],
  addons: ["Aerial Drone (Helicam) Coverage"],
  deliverables: {
    albums: [
      {
        tag: "MAIN WEDDING ALBUM",
        title: "2 x Premium Layflat Main Album",
        desc: "40 Leafs / 80 Pages layflat binding on imported archival paper packed with candid & ritual photographs."
      },
      {
        tag: "PARENT HEIRLOOM REPLICA",
        title: "Miniature Copy of Main Album",
        desc: "Handcrafted miniature companion replica of the main wedding album specially made for parents."
      },
      {
        tag: "PRE-WEDDING SHOOT",
        title: "Save the Date Shoot (Photo & Video)",
        desc: "Includes 20 high-resolution master edited photographs & cinematic video session."
      },
      {
        tag: "PHYSICAL STORAGE BOX",
        title: "High-Speed USB Pen Drive Box",
        desc: "High-speed 3.0 USB drive containing all RAW and color-graded edited master photographs."
      }
    ],
    films: [
      {
        tag: "4K CINEMA HIGHLIGHTS",
        title: "4K/HD Cinematic Highlights Video Film",
        desc: "Emotional movie trailer with live audio vows, laughter, and cinematic grading."
      },
      {
        tag: "FULL HD DOCUMENTARY",
        title: "Full HD Wedding Video Film",
        desc: "Traditional documentary film preserving all sacred rituals, stage events, and candid moments."
      },
      {
        tag: "ONLINE ARCHIVING",
        title: "Online Digital Link (Google Drive)",
        desc: "High-speed cloud access with all RAW & high-resolution edited images for unlimited family downloads."
      },
      {
        tag: "MULTICAM COVERAGE",
        title: "Candid Wedding & Reception Coverage",
        desc: "Dedicated candid photography and videography for both wedding day and reception."
      }
    ],
    complimentary: [
      {
        icon: "🖼️",
        title: "2 x Wall Frames",
        desc: "12x18 inches fine-art gallery frames ready to hang"
      },
      {
        icon: "📱",
        title: "2 x Reels",
        desc: "Vertical 9:16 Instagram-ready teasers (48-72 hr delivery)"
      },
      {
        icon: "☕",
        title: "Pre-Wed Planning",
        desc: "1-on-1 creative consultation with lead director"
      }
    ]
  },
  testimonials: [
    {
      initials: "DA",
      name: "Dr. Athulraj",
      event: "Wedding Photos",
      text: "The photos came out much better than expected, especially the low-light shots! You didn't miss a single moment of the wedding, and I don't think anyone else can provide such incredible quality in this budget. Thank you so much guys ❤️"
    },
    {
      initials: "C",
      name: "Chindu",
      event: "Cinematic Video",
      text: "What you did is one of the best I have seen so far. I've been searching for 7 months... the cinematic video you guys did is one of the best! All my friends and office colleagues are showering with praises."
    },
    {
      initials: "AL",
      name: "Anandha Lekshmi",
      event: "Wedding Ceremony",
      text: "Thank you so much to the whole team for the beautiful photo frame and for capturing our big day perfectly! ❤️❤️"
    },
    {
      initials: "DK",
      name: "Deepak Kollam",
      event: "Candid Portraits",
      text: "Superb work bro! We had a great experience with the team. I am someone who doesn't pose for photos at all, but you guys managed to capture such incredible shots and made me feel so comfortable."
    }
  ],
  directorNote: {
    salutation: "Dear PARVATHY,",
    p1: "Your wedding day is not just a schedule of events; it is a tapestry of quiet glances, unchoreographed laughter, and raw emotions. At Dreamwed Stories, we dedicate our lenses to documenting your legacy with a mixture of fine-art photography and cinematic storytelling.",
    p2: "We believe in an unobtrusive approach. We blend into your celebrations, allowing you to live fully in the moment while we capture the fleeting details that standard photography often misses.",
    sign: "Unni Krishnan & Team",
    role: "Lead Photographer & Director, Dreamwed Stories",
    tagline: '"Timeless, honest, fine-art"'
  },
  videoUrl: "./videos/wedding_reel.mp4",
  createdAt: new Date().toISOString()
};

/**
 * Extracts all raw text from a PDF file using PDF.js
 */
export async function extractPdfText(fileOrArrayBuffer) {
  const pdfjs = await loadPdfJs();
  let arrayBuffer;

  if (fileOrArrayBuffer instanceof ArrayBuffer) {
    arrayBuffer = fileOrArrayBuffer;
  } else if (fileOrArrayBuffer && typeof fileOrArrayBuffer.arrayBuffer === "function") {
    arrayBuffer = await fileOrArrayBuffer.arrayBuffer();
  } else {
    throw new Error("Invalid file provided for PDF extraction");
  }

  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const tc = await page.getTextContent();
    fullText += tc.items.map((x) => x.str).join(" ") + " \n ";
  }

  return fullText;
}

/**
 * AI Proposal Parser powered by Gemini 2.5 Flash
 * Understands what information is in the PDF and generates a beautiful structured representation
 */
export async function parseProposalWithAI(fileOrArrayBuffer, fileName = "Wedding_Proposal.pdf", customApiKey = null) {
  const fullText = await extractPdfText(fileOrArrayBuffer);
  const apiKey = customApiKey || localStorage.getItem("dreamwed_gemini_api_key") || DEFAULT_GEMINI_API_KEY;

  console.log("🤖 Running Gemini 2.5 Flash AI to understand proposal PDF...");

  const systemInstruction = `You are the Lead Creative Director and Proposal Architect at Dreamwed Stories, Kerala's premier luxury wedding photography and cinema studio.
Your task is to analyze ANY wedding photography proposal PDF text and extract a comprehensive, structured JSON representation designed to render a breathtaking, ultra-luxury online client proposal.

Extraction & Intelligence Rules:
1. clientName: Extract the couple / bride / groom name (e.g. "PARVATHY", "ANAND & PARVATHY"). Must be UPPERCASE.
2. eventDate: Extract full wedding date (e.g. "November 30, 2026").
3. venue: Extract event location (e.g. "Kochi, Kerala" or city + state).
4. price: Look for the discounted / final investment figure (e.g. "1,45,000" or numeric amount). If not found, use "1,45,000".
5. originalPrice: Look for original / slashed price (e.g. "1,60,000"). If not found, calculate 10-15% above price.
6. packageTitle: e.g. "Pre-wedding Photography & Cinematography Special Package".
7. packageSubtitle: e.g. "Special Package Curated For [Client Name]".
8. events: Array of detailed events detected in the proposal (Pre-wedding, Muhurtham, Reception, Haldi, Sangeet, Drone, etc.):
   - eventTag: "EVENT 01 • PRE-WEDDING", "EVENT 02 • MAIN CELEBRATION", etc.
   - title: uppercase event title.
   - crew: array of crew members (e.g. ["1 Candid Photographer", "1 Traditional Photographer", "1 Candid Videographer", "1 Traditional Videographer", "Aerial Drone (Helicam) Coverage"]).
   - description: 1-2 sentence compelling summary of what this event captures.
9. deliverables:
   - albums: array of objects { tag, title, desc } for physical albums.
   - films: array of objects { tag, title, desc } for video highlights, documentary films, reels, cloud links.
   - complimentary: array of objects { icon, title, desc } for free wall frames, reels, consultations, etc.
10. testimonials: 4 real couple testimonials.
11. directorNote: { salutation: "Dear [Client Name],", p1: string, p2: string, sign: "Unni Krishnan & Team", role: "Lead Photographer & Director, Dreamwed Stories", tagline: "\"Timeless, honest, fine-art\"" }.

Output MUST be strictly valid JSON without any markdown code blocks or backticks.`;

  const prompt = `Here is the complete extracted text from the proposal PDF (${fileName}):\n\n` + fullText;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.15
          }
        })
      }
    );

    if (res.ok) {
      const data = await res.json();
      const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawJson) {
        const parsedAI = JSON.parse(rawJson);
        const proposalId = "dw_" + Date.now().toString(36);

        // Merge with defaults and stock photos
        const finalProposal = {
          ...PARVATHY_SAMPLE_PROPOSAL,
          id: proposalId,
          proposalNo: proposalId.toUpperCase(),
          clientName: (parsedAI.clientName || "VALUED CLIENT").toUpperCase(),
          eventDate: parsedAI.eventDate || "November 30, 2026",
          venue: parsedAI.venue || "Kochi, Kerala",
          price: parsedAI.price || "1,45,000",
          originalPrice: parsedAI.originalPrice || "1,60,000",
          packageTitle: parsedAI.packageTitle || "Pre-wedding Photography & Cinematography Special Package",
          packageSubtitle: parsedAI.packageSubtitle || `Special Package Curated For ${parsedAI.clientName}`,
          events: parsedAI.events && parsedAI.events.length > 0 ? parsedAI.events : PARVATHY_SAMPLE_PROPOSAL.events,
          deliverables: {
            albums: parsedAI.deliverables?.albums?.length ? parsedAI.deliverables.albums : PARVATHY_SAMPLE_PROPOSAL.deliverables.albums,
            films: parsedAI.deliverables?.films?.length ? parsedAI.deliverables.films : PARVATHY_SAMPLE_PROPOSAL.deliverables.films,
            complimentary: parsedAI.deliverables?.complimentary?.length ? parsedAI.deliverables.complimentary : PARVATHY_SAMPLE_PROPOSAL.deliverables.complimentary
          },
          testimonials: parsedAI.testimonials?.length ? parsedAI.testimonials : PARVATHY_SAMPLE_PROPOSAL.testimonials,
          directorNote: parsedAI.directorNote || {
            ...PARVATHY_SAMPLE_PROPOSAL.directorNote,
            salutation: `Dear ${parsedAI.clientName},`
          },
          photos: { ...DEFAULT_PHOTOS },
          phone: "9995412955",
          upiId: "dreamwedstories@okaxis",
          videoUrl: "./videos/wedding_reel.mp4",
          isAiGenerated: true,
          createdAt: new Date().toISOString()
        };

        console.log("✨ AI successfully understood and generated proposal for:", finalProposal.clientName);
        return finalProposal;
      }
    } else {
      const errData = await res.json().catch(() => ({}));
      console.warn("Gemini API error, falling back to heuristic parser:", errData);
    }
  } catch (aiErr) {
    console.warn("AI understanding failed or offline, falling back to local extractor:", aiErr);
  }

  // Graceful fallback to deterministic parser
  return parseProposalPdf(fileOrArrayBuffer, fileName, fullText);
}

/**
 * Deterministic fallback parser
 */
export async function parseProposalPdf(fileOrArrayBuffer, fileName = "Wedding_Proposal.pdf", preExtractedText = null) {
  const fullText = preExtractedText || await extractPdfText(fileOrArrayBuffer);

  // 1. Extract Client Name
  let clientName = "";
  const nameMatch = fullText.match(
    /P\s*R\s*E\s*S\s*E\s*N\s*T\s*E\s*D\s*F\s*O\s*R\s+([A-Za-z\s]+?)(?=\s+(?:JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER|\d{4}))/i
  );
  if (nameMatch && nameMatch[1].trim()) {
    clientName = nameMatch[1].trim().replace(/\s+/g, " ");
  } else {
    clientName = fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/wedding|proposal|dreamwed|vip|_|-/gi, " ")
      .trim()
      .toUpperCase() || "VALUED CLIENT";
  }

  // 2. Extract Event Date & Venue
  let eventDate = "November 30, 2026";
  let venue = "Kochi, Kerala";
  const dateMatch = fullText.match(
    /(JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)\s+(\d{1,2}),\s*(\d{4})\s*•\s*([A-Za-z\s]+?)(?=\s+(?:PAGE|TESTIMONIALS|\n|$))/i
  );
  if (dateMatch) {
    const m = dateMatch[1];
    const d = dateMatch[2];
    const y = dateMatch[3];
    eventDate = `${m} ${d}, ${y}`;
    venue = dateMatch[4].trim().replace(/\s+/g, " ");
    if (!venue.toLowerCase().includes("kerala")) {
      venue += ", Kerala";
    }
  }

  // 3. Extract Price & Original Price
  let price = "1,45,000";
  let originalPrice = "1,60,000";
  const priceMatch = fullText.match(/₹\s*([0-9,\s]+)\s*INR/i);
  if (priceMatch) {
    price = priceMatch[1].replace(/\s+/g, "").trim();
    const numPrice = parseInt(price.replace(/,/g, ""), 10);
    if (!isNaN(numPrice)) {
      const orig = Math.round((numPrice * 1.1) / 1000) * 1000;
      originalPrice = orig.toLocaleString("en-IN");
    }
  }

  const proposalId = "dw_" + Date.now().toString(36);

  const proposalData = {
    ...PARVATHY_SAMPLE_PROPOSAL,
    id: proposalId,
    clientName: clientName.toUpperCase(),
    eventDate: eventDate,
    venue: venue,
    price: price,
    originalPrice: originalPrice,
    proposalNo: proposalId.toUpperCase(),
    packageSubtitle: `Special Package Curated For ${clientName}`,
    directorNote: {
      ...PARVATHY_SAMPLE_PROPOSAL.directorNote,
      salutation: `Dear ${clientName},`
    },
    isAiGenerated: false,
    createdAt: new Date().toISOString()
  };

  return proposalData;
}
