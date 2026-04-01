/* ============================================
   TuneTube CMS Engine
   Loads content from localStorage or content.json
   and applies it to the DOM
   ============================================ */

const CMS = {
    STORAGE_KEY: 'tunetube_cms_content',
    VERSION_KEY: 'tunetube_cms_version',
    CONTENT_VERSION: '2026.04.01.v8', // Bump: 8-image brands collage + remove brand wall
    content: null,

    // Load content: always fetch fresh content.json, only use localStorage
    // if it was saved by admin AND matches current version
    async init() {
        const savedVersion = localStorage.getItem(this.VERSION_KEY);
        const saved = localStorage.getItem(this.STORAGE_KEY);

        // Invalidate stale localStorage if version doesn't match
        if (savedVersion !== this.CONTENT_VERSION) {
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.removeItem(this.VERSION_KEY);
            await this.loadDefaults();
        } else if (saved) {
            try {
                this.content = JSON.parse(saved);
            } catch (e) {
                console.warn('CMS: Corrupted localStorage data, loading defaults');
                await this.loadDefaults();
            }
        } else {
            await this.loadDefaults();
        }
        this.applyToPage();
    },

    async loadDefaults() {
        try {
            const response = await fetch('content.json?t=' + Date.now());
            this.content = await response.json();
        } catch (e) {
            console.error('CMS: Could not load content.json', e);
        }
    },

    save(data) {
        this.content = data;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        localStorage.setItem(this.VERSION_KEY, this.CONTENT_VERSION);
    },

    reset() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    getContent() {
        return this.content;
    },

    // Apply content to the current page DOM
    applyToPage() {
        if (!this.content) return;
        const c = this.content;
        const page = document.body.className || 'homepage';

        // === HOMEPAGE ===
        if (!document.body.classList.contains('labels-page') && !document.body.classList.contains('submit-page')) {
            // Hero
            if (c.hero) {
                this.setText('.hero-tune', c.hero.logoLine1);
                this.setText('.hero-tube', c.hero.logoLine2);
                this.setText('.hero-tagline', c.hero.tagline);
                this.setText('.btn-contact', c.hero.ctaText);
                this.setLink('.btn-contact', c.hero.ctaLink);
                this.setImage('.hero-bg-img', c.hero.backgroundImage);
            }

            // For Labels section
            if (c.forLabels) {
                this.setText('#labels-title', c.forLabels.title);
                this.setText('#labels-desc', c.forLabels.description);
                this.setText('#btn-labels-touch', c.forLabels.ctaText);
                this.setLink('#btn-labels-touch', c.forLabels.ctaLink);
                this.setImage('.artist-collage-img', c.forLabels.image);
                
                // Spotify embed
                const spotifyIframe = document.querySelector('.spotify-embed iframe');
                if (spotifyIframe && c.forLabels.spotifyEmbed) {
                    spotifyIframe.src = c.forLabels.spotifyEmbed;
                }

                // Dynamic rebuild of artist grid from content.json
                if (c.forLabels.images && c.forLabels.images.length > 0) {
                    const artistGrid = document.querySelector('.artist-grid');
                    if (artistGrid) {
                        const cardClasses = ['artist-card-large', 'artist-card-small', 'artist-card-medium', 'artist-card-dark', 'artist-card-promo'];
                        artistGrid.innerHTML = '';
                        c.forLabels.images.forEach((img, i) => {
                            const div = document.createElement('div');
                            div.className = `artist-card ${cardClasses[i] || 'artist-card-large'}`;
                            div.innerHTML = `<img src="${this.escapeHtml(img)}" alt="Artist ${i + 1}">`;
                            artistGrid.appendChild(div);
                        });
                    }
                }
            }

            // For Brands section
            if (c.forBrands) {
                this.setText('#brands-title', c.forBrands.title);
                this.setText('#brands-desc', c.forBrands.description);
                this.setText('#btn-brands-touch', c.forBrands.ctaText);
                this.setLink('#btn-brands-touch', c.forBrands.ctaLink);
                this.setImage('.brands-collage-img', c.forBrands.image);

                // Dynamic rebuild of brands grid from content.json
                if (c.forBrands.images && c.forBrands.images.length > 0) {
                    const brandsGrid = document.querySelector('.brands-grid');
                    if (brandsGrid) {
                        brandsGrid.innerHTML = '';
                        // Define collage transforms for mobile
                        const mobileTransforms = [
                            'rotate(-5deg)',
                            'rotate(6deg)',
                            'rotate(4deg)',
                            'rotate(-7deg)',
                            'rotate(-4deg)',
                            'rotate(5deg)',
                            'rotate(-6deg)',
                            'rotate(8deg)'
                        ];
                        const isMobile = window.innerWidth <= 768;
                        c.forBrands.images.forEach((img, i) => {
                            const div = document.createElement('div');
                            div.className = `brand-photo brand-photo-${i + 1}`;
                            div.innerHTML = `<img src="${this.escapeHtml(img)}" alt="Brand ${i + 1}">`;
                            // Apply inline transforms on mobile for collage effect
                            if (isMobile && mobileTransforms[i]) {
                                div.style.transform = mobileTransforms[i];
                            }
                            brandsGrid.appendChild(div);
                        });
                    }
                }
            }

            // Wishlist section
            if (c.wishlist) {
                this.setText('#wishlist-title', c.wishlist.title);
                this.setText('#btn-submit-now', c.wishlist.ctaText);
                this.setLink('#btn-submit-now', c.wishlist.ctaLink);
            }


        }

        // === FOR LABELS PAGE ===
        if (document.body.classList.contains('labels-page') && c.labelsPage) {
            this.setText('#labels-title', c.labelsPage.heroTitle);
            this.setImage('.labels-hero-bg-img', c.labelsPage.backgroundImage);
            this.setText('#btn-join-now', c.labelsPage.ctaText);
            this.setLink('#btn-join-now', c.labelsPage.ctaLink);

            if (c.labelsPage.benefits) {
                const cards = document.querySelectorAll('.benefit-card');
                c.labelsPage.benefits.forEach((b, i) => {
                    if (cards[i]) {
                        const titleEl = cards[i].querySelector('.benefit-title');
                        const descEl = cards[i].querySelector('.benefit-desc');
                        if (titleEl) titleEl.textContent = b.title;
                        if (descEl) descEl.textContent = b.description;
                    }
                });
            }
        }

        // === SUBMIT PAGE ===
        if (document.body.classList.contains('submit-page') && c.submitPage) {
            this.setText('#form-title', c.submitPage.title);
            this.setText('#form-subtitle', c.submitPage.subtitle);
            this.setImage('.submit-bg-img', c.submitPage.backgroundImage);
            this.setText('#btn-submit', c.submitPage.submitBtnText);
        }

        // === FOOTER (all pages) ===
        if (c.footer) {
            this.setText('#footer-copyright', c.footer.copyright);
        }
    },

    // Utility helpers
    setText(selector, text) {
        const el = document.querySelector(selector);
        if (el && text !== undefined) el.textContent = text;
    },

    setLink(selector, href) {
        const el = document.querySelector(selector);
        if (el && href) el.href = href;
    },

    setImage(selector, src) {
        const el = document.querySelector(selector);
        if (el && src) el.src = src;
    },

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    CMS.init();
});
