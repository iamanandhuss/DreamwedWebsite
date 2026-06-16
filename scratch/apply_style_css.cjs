const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/style.css');
let css = fs.readFileSync(filePath, 'utf8');

// Normalize newlines in source CSS
css = css.replace(/\r\n/g, '\n');

const targetComment = `/* Visual Layout Redesign completed globally in the upper section */`;

const newStyles = `/* Visual Layout Redesign completed globally in the upper section */

/* --- COMPACT PACKAGES GRID FOR TALL CARDS --- */
.packages-grid .package-card .package-event-sections,
.packages-grid .package-card .package-footer,
.packages-grid .package-card .premium-promo-card,
.packages-grid .package-card .card-urgency-timer-wrapper,
.packages-grid .package-card .package-badge,
.packages-grid .package-card .package-glow,
.packages-grid .package-card .package-header {
    display: none !important;
}

.packages-grid .package-card {
    min-height: 580px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-end !important;
    padding: 30px !important;
    border-radius: 40px !important;
    background: #0d0416 !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35) !important;
    overflow: visible !important;
    position: relative !important;
}

.packages-grid .package-card.premium-card {
    border: 3px solid #d1a852 !important;
    box-shadow: 0 0 35px rgba(209, 168, 82, 0.25), 0 20px 50px rgba(0, 0, 0, 0.4) !important;
}

.packages-grid .package-card.premium-card:hover {
    border-color: #e5c173 !important;
    box-shadow: 0 0 45px rgba(209, 168, 82, 0.45), 0 20px 50px rgba(0, 0, 0, 0.4) !important;
}

.packages-grid .package-card .package-cover-wrapper {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    z-index: 1 !important;
    border-radius: inherit !important;
    overflow: hidden !important;
    pointer-events: none !important;
    border: none !important;
    margin: 0 !important;
}

.packages-grid .package-card .package-cover-img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    opacity: 0.55 !important;
    transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1) !important;
}

.packages-grid .package-card:hover .package-cover-img {
    transform: scale(1.08) !important;
}

.packages-grid .package-card .package-cover-overlay {
    position: absolute !important;
    inset: 0 !important;
    background: linear-gradient(to bottom, rgba(13, 4, 22, 0.4) 0%, rgba(13, 4, 22, 0.2) 40%, rgba(10, 11, 14, 0.98) 100%) !important;
    z-index: 2 !important;
}

/* Floating Top Row Elements */
.package-card-top-row {
    position: absolute !important;
    top: 24px !important;
    left: 24px !important;
    right: 24px !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    z-index: 3 !important;
}

.card-heart-btn {
    background: rgba(0, 0, 0, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    color: #ffffff !important;
    width: 36px !important;
    height: 36px !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    font-size: 14px !important;
    transition: all 0.2s !important;
    padding: 0 !important;
}

.card-heart-btn:hover {
    background: rgba(255, 255, 255, 0.15) !important;
    color: #ff4757 !important;
    transform: scale(1.05);
}

.best-deal-ribbon {
    background: #eab308 !important;
    color: #000000 !important;
    border-color: #eab308 !important;
    font-weight: 800 !important;
}

/* Card Content Body */
.package-card-body {
    position: relative !important;
    z-index: 3 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    margin-top: auto !important;
    width: 100% !important;
}

.click-details-hint {
    font-size: 8px !important;
    font-weight: 700 !important;
    letter-spacing: 0.15em !important;
    color: var(--primary-gold) !important;
    text-transform: uppercase !important;
    display: inline-block !important;
    margin-bottom: 12px !important;
}

.package-title {
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 32px !important;
    font-weight: 500 !important;
    color: #ffffff !important;
    margin: 0 0 6px 0 !important;
    line-height: 1.15 !important;
}

.package-category-title {
    font-size: 9px !important;
    font-weight: 800 !important;
    color: var(--primary-gold) !important;
    letter-spacing: 0.12em !important;
    text-transform: uppercase !important;
    display: block !important;
    margin-bottom: 12px !important;
}

.package-short-desc {
    font-size: 11.5px !important;
    color: rgba(255, 255, 255, 0.6) !important;
    line-height: 1.45 !important;
    margin: 0 0 16px 0 !important;
    max-width: 280px !important;
    font-weight: 400 !important;
}

.package-pills-stack {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 8px !important;
    margin-bottom: 22px !important;
    width: 100% !important;
}

.package-pill {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px !important;
    padding: 6px 16px !important;
    border-radius: 100px !important;
    font-size: 11px !important;
    font-weight: 700 !important;
}

.package-pill i {
    font-size: 11px !important;
}

.price-pill {
    background: rgba(0, 0, 0, 0.55) !important;
    border: 1.5px solid var(--primary-gold) !important;
    color: var(--primary-gold) !important;
}

.setup-pill {
    background: rgba(255, 255, 255, 0.08) !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    color: #ffffff !important;
}

.secure-offer-btn {
    width: 100% !important;
    max-width: 240px !important;
    background: #ffffff !important;
    color: #000000 !important;
    border: none !important;
    padding: 14px 20px !important;
    border-radius: 20px !important;
    font-size: 12px !important;
    font-weight: 900 !important;
    letter-spacing: 0.12em !important;
    text-transform: uppercase !important;
    cursor: pointer !important;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25) !important;
    transition: transform 0.2s, box-shadow 0.2s !important;
    text-align: center !important;
    line-height: 1.2 !important;
}

.secure-offer-btn:hover {
    transform: scale(1.03) !important;
    box-shadow: 0 12px 24px rgba(255, 255, 255, 0.2) !important;
}

/* ==========================================================================
   DETAILS MODAL SYSTEM CSS (White Premium UI Split Layout)
   ========================================================================== */

.pkg-details-modal-overlay {
    position: fixed !important;
    inset: 0 !important;
    background: rgba(0, 0, 0, 0.75) !important;
    backdrop-filter: blur(8px) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 10000 !important;
    padding: 20px !important;
}

.pkg-details-modal-card {
    background: #ffffff !important;
    width: 100% !important;
    max-width: 980px !important;
    height: 90vh !important;
    max-height: 700px !important;
    border-radius: 40px !important;
    overflow: hidden !important;
    position: relative !important;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4) !important;
    animation: modalScaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

@keyframes modalScaleIn {
    from {
        opacity: 0;
        transform: scale(0.96) translateY(12px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.pkg-details-modal-close {
    position: absolute !important;
    top: 20px !important;
    right: 20px !important;
    width: 38px !important;
    height: 38px !important;
    border-radius: 50% !important;
    background: #18181b !important;
    color: #ffffff !important;
    border: none !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    z-index: 10 !important;
    transition: background 0.2s !important;
}

.pkg-details-modal-close:hover {
    background: #3f3f46 !important;
}

.pkg-details-modal-grid {
    display: grid !important;
    grid-template-columns: 1fr 1.15fr !important;
    height: 100% !important;
}

@media (max-width: 768px) {
    .pkg-details-modal-grid {
        grid-template-columns: 1fr !important;
        grid-template-rows: 200px 1fr !important;
    }
    .pkg-details-modal-card {
        max-height: 85vh !important;
    }
}

/* Left Panel (Image & Watermark) */
.pkg-details-modal-left {
    position: relative !important;
    height: 100% !important;
    overflow: hidden !important;
    background: #000000 !important;
}

.pkg-details-modal-img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    opacity: 0.85 !important;
}

.pkg-details-modal-left::after {
    content: '' !important;
    position: absolute !important;
    inset: 0 !important;
    background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%) !important;
    z-index: 1 !important;
}

.pkg-modal-left-dots {
    position: absolute !important;
    top: 24px !important;
    left: 24px !important;
    display: flex !important;
    gap: 6px !important;
    z-index: 2 !important;
}

.pkg-modal-left-dots span {
    width: 6px !important;
    height: 6px !important;
    border-radius: 50% !important;
    background: rgba(255,255,255,0.4) !important;
}

.pkg-details-modal-watermark {
    position: absolute !important;
    bottom: 30px !important;
    left: 30px !important;
    right: 30px !important;
    z-index: 2 !important;
    color: #ffffff !important;
    text-align: left !important;
}

.pkg-watermark-brand {
    font-family: 'Outfit', sans-serif !important;
    font-size: 10px !important;
    font-weight: 800 !important;
    letter-spacing: 0.15em !important;
    color: rgba(255, 255, 255, 0.5) !important;
    display: block !important;
    margin-bottom: 6px !important;
}

.pkg-details-modal-watermark h4 {
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 20px !important;
    font-weight: 500 !important;
    color: #ffffff !important;
    margin: 0 0 4px 0 !important;
}

.pkg-details-modal-watermark p {
    font-size: 11px !important;
    color: rgba(255, 255, 255, 0.7) !important;
    margin: 0 !important;
    font-weight: 400 !important;
}

/* Right Panel (Content area) */
.pkg-details-modal-right {
    background: #ffffff !important;
    padding: 40px !important;
    display: flex !important;
    flex-direction: column !important;
    height: 100% !important;
    overflow: hidden !important;
    box-sizing: border-box !important;
}

@media (max-width: 768px) {
    .pkg-details-modal-right {
        padding: 24px 20px !important;
    }
}

.pkg-details-modal-header {
    margin-bottom: 20px !important;
}

.pkg-details-modal-badge {
    display: inline-block !important;
    background: #f4f4f5 !important;
    color: #71717a !important;
    font-size: 9px !important;
    font-weight: 800 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.1em !important;
    padding: 5px 10px !important;
    border-radius: 4px !important;
    margin-bottom: 10px !important;
}

.pkg-details-modal-title {
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 32px !important;
    font-weight: 600 !important;
    color: #09090b !important;
    margin: 0 0 6px 0 !important;
    line-height: 1.2 !important;
}

.pkg-details-modal-price {
    font-size: 28px !important;
    font-weight: 800 !important;
    color: #15803d !important;
    font-family: 'Outfit', sans-serif !important;
}

.pkg-details-modal-scroll-body {
    flex-grow: 1 !important;
    overflow-y: auto !important;
    padding-right: 12px !important;
    margin-bottom: 20px !important;
    /* Custom Scrollbar */
    scrollbar-width: thin !important;
    scrollbar-color: #d4d4d8 #f4f4f5 !important;
}

.pkg-details-modal-scroll-body::-webkit-scrollbar {
    width: 6px !important;
}

.pkg-details-modal-scroll-body::-webkit-scrollbar-track {
    background: #f4f4f5 !important;
    border-radius: 10px !important;
}

.pkg-details-modal-scroll-body::-webkit-scrollbar-thumb {
    background: #d4d4d8 !important;
    border-radius: 10px !important;
}

.pkg-details-modal-desc {
    font-size: 13.5px !important;
    color: #4b5563 !important;
    line-height: 1.55 !important;
    margin: 0 0 20px 0 !important;
}

.pkg-details-modal-standard-box {
    display: flex !important;
    gap: 14px !important;
    background: #f8fafc !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 16px !important;
    padding: 16px !important;
    margin-bottom: 24px !important;
}

.pkg-standard-box-icon {
    width: 38px !important;
    height: 38px !important;
    border-radius: 50% !important;
    background: #f1f5f9 !important;
    border: 1px solid #e2e8f0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    color: #64748b !important;
    font-size: 15px !important;
    flex-shrink: 0 !important;
}

.pkg-standard-box-content strong {
    display: block !important;
    font-size: 10.5px !important;
    font-weight: 800 !important;
    color: #0f172a !important;
    text-transform: uppercase !important;
    letter-spacing: 0.08em !important;
    margin-bottom: 4px !important;
}

.pkg-standard-box-content p {
    font-size: 12px !important;
    color: #475569 !important;
    margin: 0 !important;
    line-height: 1.45 !important;
}

.pkg-details-modal-checklist-header {
    font-size: 10.5px !important;
    font-weight: 800 !important;
    color: #4b5563 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.08em !important;
    margin-bottom: 14px !important;
}

.pkg-details-modal-checklist-container {
    color: #374151 !important;
}

.pkg-details-modal-checklist-container ul {
    list-style: none !important;
    padding: 0 !important;
    margin: 0 !important;
}

.pkg-details-modal-checklist-container li {
    display: flex !important;
    align-items: flex-start !important;
    gap: 10px !important;
    font-size: 13.5px !important;
    line-height: 1.5 !important;
    margin-bottom: 12px !important;
}

.pkg-details-modal-checklist-container li i {
    color: #16a34a !important;
    font-size: 13.5px !important;
    margin-top: 4px !important;
    flex-shrink: 0 !important;
}

.pkg-details-modal-footer {
    border-top: 1px solid #e4e4e7 !important;
    padding-top: 18px !important;
    background: #ffffff !important;
}

.pkg-modal-book-btn {
    width: 100% !important;
    background: #18181b !important;
    color: #ffffff !important;
    border: none !important;
    padding: 16px 24px !important;
    border-radius: 16px !important;
    font-size: 13.5px !important;
    font-weight: 800 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.08em !important;
    cursor: pointer !important;
    transition: background 0.2s, transform 0.1s !important;
}

.pkg-modal-book-btn:hover {
    background: #09090b !important;
    transform: translateY(-1px) !important;
}

.pkg-modal-book-btn:active {
    transform: translateY(1px) !important;
}

.pkg-refundable-note {
    font-size: 10px !important;
    color: #71717a !important;
    text-align: center !important;
    margin-top: 8px !important;
    font-weight: 600 !important;
}`;

if (!css.includes(targetComment)) {
    console.error("Could not find the target comment in style.css");
} else {
    css = css.replace(targetComment, newStyles);
    console.log("Successfully replaced the end comment and added card & modal styles to style.css");
}

fs.writeFileSync(filePath, css, 'utf8');
console.log("style.css modification complete!");
