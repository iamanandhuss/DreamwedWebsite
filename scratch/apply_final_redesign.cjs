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
        
        const checklistSource = card.querySelector('.package-event-sections');
        const checklistHtml = checklistSource ? checklistSource.innerHTML : '';
        const listItemsCount = checklistSource ? checklistSource.querySelectorAll('li').length : 0;

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

        // Style all checkmark icons inside the modal list to checkmark style
        const listContainer = modalDiv.querySelector('.pkg-details-modal-checklist-container');
        if (listContainer) {
            const icons = listContainer.querySelectorAll('i');
            icons.forEach(icon => {
                icon.className = 'fa-solid fa-check';
            });
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
    };

    // --- CARDS RESTRUCTURER CONTROLLER (To match the screenshot's compact look and details) ---
    window.restructurePackageCards = function() {
        const cardData = {
            'pkgWeddingBasicCard': {
                title: 'Bride or Groom<br>Pack 01',
                category: 'SPECIAL PACKAGE COVERAGE',
                desc: "Our highly sought-after single-side coverage package. Designed to capture every detail o..",
                priceText: 'from ₹49,999',
                priceVal: '49999',
                setup: '<i class="fa-solid fa-camera"></i> 1 Photographer Setup',
                ribbon: '+ FREE PRE-WEDDING PHOTO',
                ribbonClass: '',
                img: 'uploaded_bride_yellow.jpg',
                highlighted: false
            },
            'pkgWeddingPreCard': {
                title: 'Bride & Groom<br>Pack 02',
                category: 'PREMIUM PHOTO & VIDEO PACKAGE',
                desc: 'Our comprehensive premium dual-side package. Ideal for capturing both sides of th..',
                priceText: 'from ₹99,999',
                priceVal: '99999',
                setup: '<i class="fa-solid fa-camera"></i> 4 Camera Setup',
                ribbon: '+ FREE PRE-WEDDING PHOTO',
                ribbonClass: '',
                img: 'uploaded_couple_blackwhite.jpg',
                highlighted: false
            },
            'pkgCandidCard': {
                title: 'Bride & Groom<br>Pack 03',
                category: 'COMPLETE CINEMATIC & PORTRAITURE',
                desc: 'Our absolute signature masterpiece package. Includes premium pre-wedding photos and..',
                priceText: 'from ₹1,10,000',
                priceVal: '110000',
                setup: '<i class="fa-solid fa-camera"></i> 4 Camera Setup',
                ribbon: '+ BEST DEAL (RECOMMENDED)',
                ribbonClass: 'best-deal-ribbon',
                img: 'uploaded_bride_traditional.jpg',
                highlighted: true
            },
            'pkgCandidVideoCard': {
                title: 'Engagement +<br>Wedding Pack 04',
                category: 'MULTI-DAY COMPLETE COVERAGE',
                desc: 'Our ultimate, all-inclusive multi-day celebration package. Captures your entire...',
                priceText: 'from ₹1,59,000',
                priceVal: '159000',
                setup: '<i class="fa-solid fa-plane"></i> Drone Aerial Coverage',
                ribbon: '+ FREE DRONE AERIAL COVERAGE',
                ribbonClass: '',
                img: 'uploaded_couple_blackwhite.jpg',
                highlighted: false
            }
        };

        // Hide the 5th card
        const card5 = document.getElementById('pkgBrideGroomCard');
        if (card5) {
            card5.style.setProperty('display', 'none', 'important');
        }

        Object.keys(cardData).forEach(id => {
            const card = document.getElementById(id);
            if (!card) return;

            // If already restructured, don't overwrite
            if (card.querySelector('.package-card-body')) return;

            const data = cardData[id];

            // Save original features/checklists if not already saved
            let checklistHtml = '';
            const featuresEl = card.querySelector('.package-event-sections');
            if (featuresEl) {
                checklistHtml = featuresEl.innerHTML;
            }

            // Set data attributes for standard booking flow
            card.setAttribute('data-plan', data.title.replace('<br>', ' '));
            card.setAttribute('data-price', data.priceVal);

            // Apply card highlighted styles
            if (data.highlighted) {
                card.classList.add('premium-card');
            } else {
                card.classList.remove('premium-card');
            }

            card.innerHTML = \`
                <!-- Background Cover Image -->
                <div class="package-cover-wrapper">
                    <img src="\${data.img}" class="package-cover-img" alt="\${data.title}">
                    <div class="package-cover-overlay"></div>
                </div>

                <!-- Floating Top Row Elements -->
                <div class="package-card-top-row">
                    <span class="flyer-ribbon-tag \${data.ribbonClass}">\${data.ribbon}</span>
                    <button class="card-heart-btn" title="Add to Wishlist">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>

                <!-- Card Content -->
                <div class="package-card-body">
                    <span class="click-details-hint"><i class="fa-solid fa-plane"></i> CLICK FOR PHOTOS & DETAILS</span>
                    <h3 class="package-title">\${data.title}</h3>
                    <span class="package-category-title">\${data.category}</span>
                    <p class="package-short-desc">\${data.desc}</p>
                    
                    <!-- Stacked Pills -->
                    <div class="package-pills-stack">
                        <div class="package-pill price-pill">
                            <i class="fa-solid fa-tag"></i> \${data.priceText}
                        </div>
                        <div class="package-pill setup-pill">
                            \${data.setup}
                        </div>
                    </div>

                    <!-- Secure Offer CTA -->
                    <button class="select-pkg-btn secure-offer-btn" data-plan="\${data.title.replace('<br>', ' ')}" data-price="\${data.priceVal}">
                        SECURE<br>OFFER
                    </button>
                </div>

                <!-- Keep Inclusions hidden for Modal extractor -->
                <div class="package-event-sections" style="display:none !important;">
                    \${checklistHtml}
                </div>
                
                <div class="package-subtitle" style="display:none !important;">
                    \${data.desc}
                </div>

                <div class="package-badge" style="display:none !important;">
                    \${data.ribbon}
                </div>

                <div class="package-price" style="display:none !important;">
                    <span class="price-value">₹\${parseInt(data.priceVal).toLocaleString()}/-</span>
                </div>
            \`;
        });
    };`;

        js = js.substring(0, idx) + replacementJS + '\n\n' + js.substring(nextIdx);
        console.log("Successfully replaced app.js block with expected card text and images.");
    }
}

fs.writeFileSync(filePath, js, 'utf8');
console.log("Final App JS complete!");
