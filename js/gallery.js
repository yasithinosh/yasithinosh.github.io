document.addEventListener('DOMContentLoaded', () => {

    // ─── Particle Canvas ───────────────────────────────────────────────
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const getAccentColor = () =>
        getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#38bdf8';

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.8 + 0.5;
            this.alpha = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = getAccentColor();
            ctx.globalAlpha = this.alpha;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    const PARTICLE_COUNT = 80;
    const CONNECTION_DIST = 130;

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const color = getAccentColor();

        particles.forEach((p, i) => {
            p.update();
            p.draw();
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = color;
                    ctx.globalAlpha = (1 - dist / CONNECTION_DIST) * 0.15;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        });
        requestAnimationFrame(animateParticles);
    };
    animateParticles();

    // ─── Theme Toggle ──────────────────────────────────────────────────
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        themeIcon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    };

    applyTheme(initTheme);

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        applyTheme(next);
        localStorage.setItem('theme', next);
    });

    // ─── Header Drop Shadow ────────────────────────────────────────────
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.style.boxShadow = window.scrollY > 50
            ? '0 8px 32px rgba(0, 0, 0, 0.35)'
            : 'none';
    });

    // ─── Mobile Menu ───────────────────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const isOpen = navLinks.classList.contains('open');
        hamburger.querySelector('i').className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    });

    // ─── Scroll Reveal ─────────────────────────────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-up').forEach(el => {
        el.style.animationPlayState = 'paused';
        revealObserver.observe(el);
    });

    // ─── Dynamic Footer Year ───────────────────────────────────────────
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ─── Full Achievement Gallery ──────────────────────────────────────
    const galleryItems = [
        {
            type: 'photo',
            src: 'assets/gallery/SLASSCOM Digitel Oil lamp.jpeg',
            thumb: 'assets/gallery/SLASSCOM Digitel Oil lamp.jpeg',
            title: 'SLASSCOM IT & BPM Exporation Day 2026',
            caption: 'Digital Oil Lamp Lighting Ceremony.',
            category: 'event'
        },
        {
            type: 'photo',
            src: 'assets/gallery/Wild life camera.jpeg',
            thumb: 'assets/gallery/Wild life camera.jpeg',
            title: 'Wild Life Photography',
            caption: 'Wild Life Photography using Camera Traps.',
            category: 'media'
        },
        {
            type: 'photo',
            src: 'assets/gallery/Drone Session.jpeg',
            thumb: 'assets/gallery/Drone Session.jpeg',
            title: 'Drone Session',
            caption: 'Drone Session.',
            category: 'media'
        },
        {
            type: 'photo',
            src: 'assets/gallery/Setificate FOT Media AGM.jpeg',
            thumb: 'assets/gallery/Setificate FOT Media AGM.jpeg',
            title: 'FOT Media AGM',
            caption: 'FOT Media AGM Certificate to the Director Board 2025.',
            category: 'cert'
        },
        {
            type: 'photo',
            src: 'assets/gallery/IOT Group project.jpeg',
            thumb: 'assets/gallery/IOT Group project.jpeg',
            title: 'IOT Group Project',
            caption: 'IOT Group project.',
            category: 'project'
        },
        {
            type: 'photo',
            src: 'assets/gallery/30 th Anniversary RUSL live.jpeg',
            thumb: 'assets/gallery/30 th Anniversary RUSL live.jpeg',
            title: '30th Anniversary RUSL Live',
            caption: 'Rajarata University of Sri Lanka 30th Anniversary Live Event.',
            category: 'event'
        },
        {
            type: 'photo',
            src: 'assets/gallery/ATIT AGM.jpeg',
            thumb: 'assets/gallery/ATIT AGM.jpeg',
            title: 'ATIT AGM',
            caption: 'ATIT Annual General Meeting.',
            category: 'event'
        },
        {
            type: 'photo',
            src: 'assets/gallery/Digtel Oil lamp.jpeg',
            thumb: 'assets/gallery/Digtel Oil lamp.jpeg',
            title: 'Digital Oil Lamp',
            caption: 'Digital Oil Lamp project showcase.',
            category: 'project'
        },
        {
            type: 'photo',
            src: 'assets/gallery/Drone .jpeg',
            thumb: 'assets/gallery/Drone .jpeg',
            title: 'Drone',
            caption: 'Drone photography and videography session.',
            category: 'media'
        },
        {
            type: 'photo',
            src: 'assets/gallery/Drone wild life.jpeg',
            thumb: 'assets/gallery/Drone wild life.jpeg',
            title: 'Drone Wildlife Photography',
            caption: 'Wildlife photography captured using drone.',
            category: 'media'
        },
        {
            type: 'photo',
            src: 'assets/gallery/EXTRU 2025.jpeg',
            thumb: 'assets/gallery/EXTRU 2025.jpeg',
            title: 'EXTRU 2025',
            caption: 'EXTRU 2025 tech exhibition.',
            category: 'event'
        },
        {
            type: 'photo',
            src: 'assets/gallery/EXTRU Live.jpeg',
            thumb: 'assets/gallery/EXTRU Live.jpeg',
            title: 'EXTRU Live',
            caption: 'EXTRU Live performance and coverage.',
            category: 'event'
        },
        {
            type: 'photo',
            src: 'assets/gallery/EXTRU Organicing commete.jpeg',
            thumb: 'assets/gallery/EXTRU Organicing commete.jpeg',
            title: 'EXTRU Organizing Committee',
            caption: 'Part of the EXTRU organizing committee.',
            category: 'event'
        },
        {
            type: 'photo',
            src: 'assets/gallery/FOT Media AGM D Oil Lamp.jpeg',
            thumb: 'assets/gallery/FOT Media AGM D Oil Lamp.jpeg',
            title: 'FOT Media AGM - Digital Oil Lamp',
            caption: 'FOT Media AGM Digital Oil Lamp ceremony.',
            category: 'event'
        },
        {
            type: 'photo',
            src: 'assets/gallery/FOT Media AGM setificate.jpeg',
            thumb: 'assets/gallery/FOT Media AGM setificate.jpeg',
            title: 'FOT Media AGM Certificate',
            caption: 'Certificate received at FOT Media AGM.',
            category: 'cert'
        },
        {
            type: 'photo',
            src: 'assets/gallery/FOT Media All New Asset.jpeg',
            thumb: 'assets/gallery/FOT Media All New Asset.jpeg',
            title: 'FOT Media New Assets',
            caption: 'FOT Media club new asset handover.',
            category: 'event'
        },
        {
            type: 'photo',
            src: 'assets/gallery/SAMAS Digitel Oil lamp.jpeg',
            thumb: 'assets/gallery/SAMAS Digitel Oil lamp.jpeg',
            title: 'SAMAS Digital Oil Lamp',
            caption: 'Digital Oil Lamp at SAMAS event.',
            category: 'event'
        },
        {
            type: 'photo',
            src: 'assets/gallery/Wild life.jpeg',
            thumb: 'assets/gallery/Wild life.jpeg',
            title: 'Wildlife Photography',
            caption: 'Wildlife photography in the field.',
            category: 'media'
        },
        {
            type: 'photo',
            src: 'assets/gallery/certificate.jpg',
            thumb: 'assets/gallery/certificate.jpg',
            title: 'Certificate',
            caption: 'Achievement certificate.',
            category: 'cert'
        },
        {
            type: 'photo',
            src: 'assets/gallery/drone-aerial.jpg',
            thumb: 'assets/gallery/drone-aerial.jpg',
            title: 'Drone Aerial Shot',
            caption: 'Aerial photography from drone.',
            category: 'media'
        },
        {
            type: 'photo',
            src: 'assets/gallery/event-exhibition.jpg',
            thumb: 'assets/gallery/event-exhibition.jpg',
            title: 'Event Exhibition',
            caption: 'Exhibition and event coverage.',
            category: 'event'
        }
    ];

    let currentGalleryItems = [...galleryItems];
    let lightboxIndex = 0;

    const galleryGrid = document.getElementById('gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lbOverlay = document.getElementById('lightbox-overlay');
    const lbContent = document.getElementById('lb-content');
    const lbTitle = document.getElementById('lb-title');
    const lbCaption = document.getElementById('lb-caption');
    const lbCounter = document.getElementById('lb-counter');

    const renderGallery = (items) => {
        galleryGrid.innerHTML = '';
        if (!items.length) {
            galleryGrid.innerHTML = '<p class="gallery-empty">No items in this category yet.</p>';
            return;
        }
        items.forEach((item, idx) => {
            const el = document.createElement('div');
            el.className = 'gallery-item fade-up';
            el.dataset.index = idx;

            const badgeIcon = item.type === 'video' ? 'fa-play' : 'fa-camera';
            const badgeLabel = item.type === 'video' ? 'Video' : 'Photo';

            const mediaHTML = item.type === 'video'
                ? `<div class="video-thumb"><i class="fas fa-play-circle"></i></div>`
                : `<img src="${item.src}" alt="${item.title}" loading="lazy">`;

            el.innerHTML = `
                ${mediaHTML}
                <div class="gallery-badge"><i class="fas ${badgeIcon}"></i> ${badgeLabel}</div>
                <div class="gallery-overlay">
                    <h4>${item.title}</h4>
                    <p>${item.caption}</p>
                </div>
                <div class="gallery-expand"><i class="fas fa-expand-alt"></i></div>
            `;

            el.addEventListener('click', () => openLightbox(idx));
            galleryGrid.appendChild(el);
            revealObserver.observe(el);
        });
    };

    const openLightbox = (idx) => {
        lightboxIndex = idx;
        updateLightbox();
        lightbox.classList.add('open');
        lbOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        lbOverlay.classList.remove('open');
        document.body.style.overflow = '';
        lbContent.innerHTML = ''; // Pause video
    };

    const updateLightbox = () => {
        const item = currentGalleryItems[lightboxIndex];
        lbTitle.textContent = item.title;
        lbCaption.textContent = item.caption;
        lbCounter.textContent = `${lightboxIndex + 1} / ${currentGalleryItems.length}`;

        if (item.type === 'video') {
            const isYoutube = item.src.includes('youtube') || item.src.includes('youtu.be');
            lbContent.innerHTML = isYoutube
                ? `<iframe src="${item.src}?autoplay=1" allow="autoplay; fullscreen" allowfullscreen></iframe>`
                : `<video src="${item.src}" controls autoplay></video>`;
        } else {
            lbContent.innerHTML = `<img src="${item.src}" alt="${item.title}">`;
        }
    };

    if (document.getElementById('lb-close')) {
        document.getElementById('lb-close').addEventListener('click', closeLightbox);
        lbOverlay.addEventListener('click', closeLightbox);

        document.getElementById('lb-prev').addEventListener('click', () => {
            lightboxIndex = (lightboxIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
            updateLightbox();
        });

        document.getElementById('lb-next').addEventListener('click', () => {
            lightboxIndex = (lightboxIndex + 1) % currentGalleryItems.length;
            updateLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') {
                lightboxIndex = (lightboxIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
                updateLightbox();
            }
            if (e.key === 'ArrowRight') {
                lightboxIndex = (lightboxIndex + 1) % currentGalleryItems.length;
                updateLightbox();
            }
        });
    }

    // Filter tabs
    const setFilterActive = (filterVal) => {
        document.querySelectorAll('.gallery-filter').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filterVal);
        });
        currentGalleryItems = filterVal === 'all'
            ? [...galleryItems]
            : galleryItems.filter(item => item.category === filterVal);
        renderGallery(currentGalleryItems);
    };

    document.querySelectorAll('.gallery-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            setFilterActive(btn.dataset.filter);
            // Optionally update URL to preserve filter on reload without scrolling
            const url = new URL(window.location);
            url.searchParams.set('filter', btn.dataset.filter);
            window.history.replaceState({}, '', url);
        });
    });

    // Check URL params for pre-selected filter (from main page preview cards)
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilter = urlParams.get('filter') || 'all';
    
    // Slight timeout so the grid layout works properly
    setTimeout(() => {
        setFilterActive(initialFilter);
    }, 50);
});
