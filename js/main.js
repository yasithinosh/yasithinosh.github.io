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

    // ─── Sticky Header ─────────────────────────────────────────────────
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

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.querySelector('i').className = 'fas fa-bars';
        });
    });

    // ─── Smooth Scroll ─────────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ─── Active Nav Highlight ──────────────────────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));

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

    // ─── Typing Animation ──────────────────────────────────────────────
    const titles = [
        'Full-Stack Engineer',
        'DevOps Enthusiast',
        'Mobile App Developer',
        'IoT & Embedded Builder',
        'BICT Undergraduate'
    ];
    const typedEl = document.getElementById('typed-text');
    let titleIdx = 0, charIdx = 0, isDeleting = false;

    const type = () => {
        const current = titles[titleIdx];
        typedEl.textContent = isDeleting
            ? current.substring(0, charIdx--)
            : current.substring(0, charIdx++);

        let delay = isDeleting ? 50 : 100;

        if (!isDeleting && charIdx > current.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIdx < 0) {
            isDeleting = false;
            charIdx = 0;
            titleIdx = (titleIdx + 1) % titles.length;
            delay = 400;
        }
        setTimeout(type, delay);
    };
    type();

    // ─── Dynamic Footer Year ───────────────────────────────────────────
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ─── Fetch GitHub Repositories ─────────────────────────────────────
    const githubUsername = 'yasithinosh';
    const repoContainer = document.getElementById('repo-grid');

    const langColors = {
        JavaScript: '#f1e05a', HTML: '#e34c26', CSS: '#563d7c',
        Python: '#3572A5', Java: '#b07219', TypeScript: '#2b7489',
        Vue: '#41b883', Dart: '#00B4AB', 'C++': '#f34b7d', Shell: '#89e051'
    };

    const createRepoCard = (repo) => {
        const div = document.createElement('div');
        div.className = 'repo-card fade-up';

        const langColor = langColors[repo.language] || '#ccc';
        const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

        div.innerHTML = `
            <div class="repo-header">
                <i class="far fa-folder folder-icon"></i>
                <div class="repo-links">
                    <a href="${repo.html_url}" target="_blank" aria-label="GitHub Link"><i class="fab fa-github"></i></a>
                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" aria-label="Live Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
                </div>
            </div>
            <h3 class="repo-name">${repo.name}</h3>
            <p class="repo-desc">${repo.description || 'No description available.'}</p>
            <div class="repo-stats">
                <div class="repo-lang">
                    <span style="background-color: ${langColor}"></span>${repo.language || 'Code'}
                </div>
                <div class="repo-stars" title="Stars">
                    <i class="far fa-star"></i> ${repo.stargazers_count}
                </div>
                <div class="repo-updated" title="Last Updated">
                    <i class="far fa-clock"></i> ${updatedDate}
                </div>
            </div>
        `;

        revealObserver.observe(div);
        return div;
    };

    const fetchRepos = async () => {
        repoContainer.innerHTML = '<div class="loader"><i class="fas fa-spinner fa-spin"></i> Loading projects...</div>';
        try {
            const res = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc`);
            if (!res.ok) throw new Error('API error');

            const repos = await res.json();
            const myRepos = repos.filter(r => !r.fork).slice(0, 6);

            if (!myRepos.length) {
                repoContainer.innerHTML = '<p style="text-align:center; color: var(--text-secondary);">No public repositories found.</p>';
                return;
            }

            repoContainer.innerHTML = '';
            myRepos.forEach(r => repoContainer.appendChild(createRepoCard(r)));
        } catch (err) {
            console.error(err);
            repoContainer.innerHTML = `
                <div style="text-align:center; width:100%;">
                    <p style="color:var(--text-secondary); margin-bottom:1rem;">Could not load projects at this time.</p>
                    <button id="retry-btn" class="btn btn-secondary">Retry</button>
                </div>`;
            document.getElementById('retry-btn').addEventListener('click', fetchRepos);
        }
    };

    fetchRepos();
});
