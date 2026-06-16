const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/app.js');
let js = fs.readFileSync(filePath, 'utf8');

js = js.replace(/\r\n/g, '\n');

// Find the index of the controller
const keyOpenModal = `window.openDetailsModal = function(card) {`;
const idx = js.indexOf(keyOpenModal);

if (idx === -1) {
    console.error("Could not find window.openDetailsModal in app.js!");
} else {
    const nextSectionText = `    // Unified event delegation`;
    const nextIdx = js.indexOf(nextSectionText, idx);
    
    if (nextIdx === -1) {
        console.error("Could not find next section boundary in app.js!");
    } else {
        const replacementJS = `    // --- DETAILS MODAL CONTROLLER (screenshot style popup for checklists) ---
    window.openDetailsModal = function(card) {
        // Remove existing modal if any
        const existing = document.getElementById('pkgDetailsModal');
        if (existing) existing.remove();

        const planName = card.getAttribute('data-plan') || 'Wedding Package';
        const planPrice = card.getAttribute('data-price') || '39999';
        
        // Safely extract elements
        const imgEl = card.querySelector('.package-cover-img');
        const imgSrc = imgEl ? imgEl.src : '';
        const h3El = card.querySelector('.package-title, .package-header h3');
        const titleText = h3El ? h3El.innerHTML.replace(/<br\\s*\\/?>/gi, ' ').trim() : planName;
        const subEl = card.querySelector('.package-subtitle');
        const subtitleText = subEl ? subEl.innerHTML.trim() : '';

        const cardId = card.id;

        // Extract collection tag based on card ID
        const collectionTags = {
            'pkgWeddingBasicCard': 'ESSENTIAL COLLECTION',
            'pkgWeddingPreCard': 'PREMIUM COLLECTION',
            'pkgCandidCard': 'SIGNATURE COLLECTION',
            'pkgCandidVideoCard': 'MULTI-DAY COLLECTION'
        };
        const collectionTag = collectionTags[cardId] || 'SPECIAL COLLECTION';

        // Add Package suffix to title if not present
        let displayTitleText = titleText;
        if (!displayTitleText.toLowerCase().endsWith('package')) {
            displayTitleText += ' Package';
        }

        const descriptions = {
            'pkgWeddingBasicCard': "Our highly sought-after single-side coverage package. Designed to capture every detail of the Bride's OR Groom's celebrations with elite creative precision and beautiful physical heirlooms.",
            'pkgWeddingPreCard': 'Our comprehensive premium dual-side package. Ideal for capturing both sides of the celebrations with multiple angles and full coverage.',
            'pkgCandidCard': 'Our absolute signature masterpiece package. Includes premium pre-wedding photos and complete cinematic & portraiture coverage.',
            'pkgCandidVideoCard': 'Our ultimate, all-inclusive multi-day celebration package. Captures your entire wedding story across multiple days.'
        };
        const descriptionText = descriptions[cardId] || subtitleText;

        // Synchronize checklist items with the Home page React app (PricingSection.jsx)
        const standardChecklists = {
            'pkgWeddingBasicCard': [
                "Free Pre-Wedding (Photo Coverage)",
                "Wedding Reception Photography",
                "Wedding Reception Videography",
                "Wedding Day Photography",
                "Wedding Day Videography",
                "One 80-Pages Premium layflat Album (Panoramic layout)",
                "One 80-Pages Mini layflat Album (Parent copy)",
                "Cinematic Highlights Video Film",
                "Full HD Wedding Video Film (Traditional & Candid mix)",
                "Instagram Wedding Reel & Social Media edits",
                "1 Photographer Setup",
                "1 Videographer Setup",
                "2x Premium Wall Frames & Custom Calendar",
                "Edited Social-Media Photos & High-speed Pendrive"
            ],
            'pkgWeddingPreCard': [
                "Free Pre-Wedding (Photo Coverage)",
                "Bride Reception (Photo + Video)",
                "Candid Wedding (Photo + Video)",
                "Wedding Day (Photo + Video)",
                "Groom Reception (Photo + Video)",
                "4 Camera Wedding Setup",
                "One 80-Page Premium layflat Album (Panoramic layout)",
                "One 80-Page Mini layflat Album (Parent copy)",
                "Cinematic Highlights Video Film",
                "Full HD Wedding Film with Candids & Live streams",
                "Instagram reels & Edited Social Photos in private cloud",
                "2x Luxury Wall Frames",
                "Signature Album Bag, Custom Calendar & Pen Drive"
            ],
            'pkgCandidCard': [
                "Free Pre-Wedding (Photo AND Cinematic Video Film!)",
                "Bride Reception (Photo + Video)",
                "Candid Wedding (Photo + Video)",
                "Wedding Day (Photo + Video)",
                "Groom Reception (Photo + Video)",
                "4 Camera Wedding Setup",
                "One 90-Page Premium layflat Album (Archival paper)",
                "One 90-Page Mini layflat Album (Parent copy)",
                "Cinematic Highlights Video Film (Cinema grade coloring)",
                "Full HD Wedding Film with Candids & Live sound capture",
                "Instagram reels & Edited Social Photos in private cloud",
                "2x Luxury Wall Frames",
                "Signature Album Bag, Custom Calendar & Pen Drive"
            ],
            'pkgCandidVideoCard': [
                "Engagement Day Photo + Video",
                "Pre-Wedding Photo Shoot",
                "Bride Reception (Photo + Video)",
                "Groom Reception (Photo + Video)",
                "Wedding Day (Photo + Video)",
                "Wedding Day Candid (Photo + Video)",
                "Drone Aerial Coverage (Both Days)",
                "One 80-Page Premium layflat Album (Panoramic layout)",
                "One 80-Page Mini layflat Album (Parent copy)",
                "Full HD Wedding Film with Candid edits",
                "Cinematic Highlights Video & Wedding Reel",
                "3x Luxury Wall Frames",
                "Signature Album Bag, Custom Calendar & Pen Drive"
            ]
        };

        let checklistHtml = '';
        let listItemsCount = 0;

        if (standardChecklists[cardId]) {
            const listItems = standardChecklists[cardId];
            listItemsCount = listItems.length;
            checklistHtml = \`<ul class="package-features">\` + 
                listItems.map(item => \`<li><i class="fa-solid fa-check"></i> \${item}</li>\`).join('') + 
                \`</ul>\`;
        } else {
            // Fallback for custom/admin-added package cards
            const checklistSource = card.querySelector('.package-event-sections');
            checklistHtml = checklistSource ? checklistSource.innerHTML : '';
            listItemsCount = checklistSource ? checklistSource.querySelectorAll('li').length : 0;
        }

        const modalDiv = document.createElement('div');
        modalDiv.className = 'pkg-details-modal-overlay';
        modalDiv.id = 'pkgDetailsModal';
        modalDiv.innerHTML = \`
            <div class="pkg-details-modal-card">
                <button class="pkg-details-modal-close" id="btnClosePkgDetails">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="pkg-details-modal-grid">
                    <div class="pkg-details-modal-left">
                        <img src="\${imgSrc}" class="pkg-details-modal-img" alt="\${titleText}">
                        <div class="pkg-modal-left-dots">
                            <span></span><span></span><span></span>
                        </div>
                        <div class="pkg-details-modal-watermark">
                            <span class="pkg-watermark-brand">DREAMWED STORIES</span>
                            <h4>Actual Wedding Work Captures</h4>
                            <p>Every pixel captured with high-fidelity professional optics.</p>
                        </div>
                    </div>
                    <div class="pkg-details-modal-right">
                        <div class="pkg-details-modal-header">
                            <span class="pkg-details-modal-badge">\${collectionTag}</span>
                            <h3 class="pkg-details-modal-title">\${displayTitleText}</h3>
                            <div class="pkg-details-modal-price">₹\${parseInt(planPrice).toLocaleString()}/-</div>
                        </div>
                        
                        <div class="pkg-details-modal-scroll-body">
                            <p class="pkg-details-modal-desc">\${descriptionText}</p>
                            
                            <div class="pkg-details-modal-standard-box">
                                <div class="pkg-standard-box-icon">
                                    <i class="fa-solid fa-gift"></i>
                                </div>
                                <div class="pkg-standard-box-content">
                                    <strong>DREAMWED STORIES STANDARD</strong>
                                    <p>Premium color-grading, handcrafted album delivery, and a personalized story design consultation session.</p>
                                </div>
                            </div>
                            
                            <div class="pkg-details-modal-checklist-header">
                                COMPLETE DELIVERABLES (SCROLL FOR ALL \${listItemsCount} ITEMS 👇):
                            </div>
                            
                            <div class="pkg-details-modal-checklist-container">
                                \${checklistHtml}
                            </div>
                        </div>
                        
                        <div class="pkg-details-modal-footer">
                            <button class="pkg-modal-book-btn select-pkg-btn" data-plan="\${planName}" data-price="\${planPrice}">
                                BOOK A CONSULTATION NOW 🌟
                            </button>
                            <div class="pkg-refundable-note">
                                <i class="fa-solid fa-shield-halved"></i> 100% Refundable if your wedding date changes
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        \`;

        document.body.appendChild(modalDiv);
        document.body.style.overflow = 'hidden';

        // Apply checkmarks specifically to fallback list items (for custom packages)
        if (!standardChecklists[cardId]) {
            const listContainer = modalDiv.querySelector('.pkg-details-modal-checklist-container');
            if (listContainer) {
                const listIcons = listContainer.querySelectorAll('li i');
                listIcons.forEach(icon => {
                    icon.className = 'fa-solid fa-check';
                });
            }
        }

        const closeBtn = modalDiv.querySelector('#btnClosePkgDetails');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modalDiv.remove();
                document.body.style.overflow = '';
            });
        }

        modalDiv.addEventListener('click', (e) => {
            if (e.target === modalDiv) {
                modalDiv.remove();
                document.body.style.overflow = '';
            }
        });
    };`;

        js = js.substring(0, idx) + replacementJS + '\n\n' + js.substring(nextIdx);
        console.log("Successfully synchronized package details in app.js!");
    }
}

fs.writeFileSync(filePath, js, 'utf8');
console.log("Sync complete!");
