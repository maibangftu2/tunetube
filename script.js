/* ============================================
   TuneTube - Premium JavaScript
   Scroll animations, parallax, header behavior
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // === Header Scroll Effect ===
    const header = document.getElementById('header');
    const hero = document.querySelector('.hero');
    let lastScroll = 0;

    const handleHeaderScroll = () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
            header.classList.remove('transparent');
        } else {
            header.classList.remove('scrolled');
            // Only add transparent class on homepage with hero
            if (hero) {
                header.classList.add('transparent');
            }
        }
        
        lastScroll = currentScroll;
    };

    // Initial state
    if (hero) {
        header.classList.add('transparent');
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // === Mobile Navigation Toggle ===
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            
            // Change hamburger color when transparent header
            if (header.classList.contains('transparent')) {
                hamburger.querySelectorAll('span').forEach(span => {
                    span.style.background = hamburger.classList.contains('active') ? '#000' : '#fff';
                });
            }
        });

        // Close mobile nav on link click
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
    }

    // === Scroll Reveal Animations ===
    const animateElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation delay for grouped elements
                const delay = entry.target.closest('.brand-wall') 
                    ? index * 120 
                    : index * 80;
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        observer.observe(el);
    });

    // === Smooth Section Reveal ===
    const sections = document.querySelectorAll('.for-labels-section, .for-brands-section, .labels-hero-content');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.08 });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
        section.style.transition = 'opacity 1s ease, transform 1s ease';
        sectionObserver.observe(section);
    });

    // === Chat Widget Animation ===
    const chatWidget = document.querySelector('.chat-widget');
    if (chatWidget) {
        chatWidget.style.opacity = '0';
        chatWidget.style.transform = 'translateY(20px) scale(0.9)';
        chatWidget.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        setTimeout(() => {
            chatWidget.style.opacity = '1';
            chatWidget.style.transform = 'translateY(0) scale(1)';
        }, 2000);
    }

    // === Chat Button Click ===
    const chatBtn = document.querySelector('.chat-btn');
    if (chatBtn) {
        chatBtn.addEventListener('click', () => {
            window.location.href = 'submit-request.html';
        });
    }

    // === Form Handling ===
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate submission
            setTimeout(() => {
                const formContainer = document.getElementById('form-container');
                formContainer.style.transition = 'all 0.4s ease';
                formContainer.style.opacity = '0';
                formContainer.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    formContainer.innerHTML = `
                        <div style="text-align: center; padding: 50px 0;">
                            <div style="width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, #7B42BC, #9B6DD7); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                            </div>
                            <h2 style="font-size: 30px; font-weight: 800; margin-bottom: 12px; color: #1a1a1a;">Thank You!</h2>
                            <p style="font-size: 15px; color: #666; margin-bottom: 36px; line-height: 1.6;">Your request has been submitted successfully.<br>We'll get back to you shortly.</p>
                            <a href="index.html" style="display: inline-block; padding: 15px 44px; background: #7B42BC; color: white; border-radius: 30px; font-family: 'Montserrat', sans-serif; font-weight: 600; text-decoration: none; transition: all 0.3s ease; font-size: 14px; letter-spacing: 0.5px;">Back to Home</a>
                        </div>
                    `;
                    formContainer.style.opacity = '1';
                    formContainer.style.transform = 'scale(1)';
                }, 400);
            }, 800);
        });
    }

    // === Hero Parallax Effect ===
    const heroBg = document.querySelector('.hero-bg-img');
    
    if (hero && heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            
            if (scrolled < heroHeight) {
                const parallax = scrolled * 0.35;
                heroBg.style.transform = `scale(1.05) translateY(${parallax}px)`;
            }
        }, { passive: true });
    }

    // === Labels page parallax ===
    const labelsBg = document.querySelector('.labels-hero-bg-img');
    const labelsHero = document.querySelector('.labels-hero');
    
    if (labelsBg && labelsHero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = labelsHero.offsetHeight;

            if (scrolled < heroHeight) {
                labelsBg.style.transform = `translateY(${scrolled * 0.2}px)`;
            }
        }, { passive: true });
    }

    // === Polaroid hover enhancement ===
    const polaroids = document.querySelectorAll('.polaroid');
    polaroids.forEach(polaroid => {
        polaroid.addEventListener('mouseenter', () => {
            polaroids.forEach(p => {
                if (p !== polaroid) {
                    p.style.opacity = '0.6';
                    p.style.filter = 'blur(1px)';
                }
            });
        });
        
        polaroid.addEventListener('mouseleave', () => {
            polaroids.forEach(p => {
                p.style.opacity = '1';
                p.style.filter = 'none';
            });
        });
    });

    // === Scroll indicator hide on scroll ===
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }, { passive: true });
        scrollIndicator.style.transition = 'opacity 0.5s ease';
    }

    // === Smooth counter for brand wall === 
    const brandWall = document.getElementById('brand-wall');
    if (brandWall) {
        const brandObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = entry.target.querySelectorAll('.brand-wall-item');
                    cards.forEach((card, i) => {
                        setTimeout(() => {
                            card.classList.add('show');
                        }, i * 200);
                    });
                    brandObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        
        brandObserver.observe(brandWall);
    }

    // === Hamburger color for transparent header ===
    if (hero && hamburger) {
        const updateHamburgerColor = () => {
            if (header.classList.contains('transparent') && !hamburger.classList.contains('active')) {
                hamburger.querySelectorAll('span').forEach(span => {
                    span.style.background = '#fff';
                });
            } else {
                hamburger.querySelectorAll('span').forEach(span => {
                    span.style.background = '#000';
                });
            }
        };
        
        window.addEventListener('scroll', updateHamburgerColor, { passive: true });
        updateHamburgerColor();
    }
});
