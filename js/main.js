document.addEventListener('DOMContentLoaded', () => {
    const githubUsername = 'yasithinosh';
    const repoContainer = document.getElementById('repo-grid');

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeIcon.classList.replace(
            newTheme === 'light' ? 'fa-moon' : 'fa-sun',
            newTheme === 'light' ? 'fa-sun' : 'fa-moon'
        );
    });

    // Sticky header shadow
    const header = document.getElementById('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        header.style.boxShadow = window.scrollY > 50
            ? '0 10px 30px -10px rgba(2, 12, 27, 0.7)'
            : 'none';
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.style.display === 'flex';
        navLinks.style.display = isOpen ? 'none' : 'flex';
        if (!isOpen) {
            Object.assign(navLinks.style, {
                flexDirection: 'column',
                position: 'absolute',
                top: '80px',
                left: '0',
                width: '100%',
                background: 'var(--bg-color)',
                padding: '2rem',
                borderBottom: '1px solid var(--glass-border)'
            });
        }
    });

    // Smooth scroll + close mobile menu on link click
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.style.display = '';
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Scroll-reveal for .fade-up elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-up').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });

    // Dynamic copyright year
    const yearElement = document.querySelector('.footer p');
    if (yearElement) {
        yearElement.innerHTML = `&copy; ${new Date().getFullYear()} InoVoid Development. All rights reserved.`;
    }

    // Fetch GitHub repositories
    const fetchRepos = async () => {
        repoContainer.innerHTML = '<div class="loader">Loading projects...</div>';
        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc`);
            if (!response.ok) throw new Error('Failed to fetch repositories');

            const repos = await response.json();
            const myRepos = repos.filter(repo => !repo.fork).slice(0, 6);

            if (myRepos.length === 0) {
                repoContainer.innerHTML = '<p style="text-align:center; color: var(--text-secondary);">No public repositories found.</p>';
                return;
            }

            repoContainer.innerHTML = '';
            myRepos.forEach(repo => repoContainer.appendChild(createRepoCard(repo)));
        } catch (error) {
            console.error('Error fetching repos:', error);
            repoContainer.innerHTML = `
                <div style="text-align:center; width: 100%;">
                    <p style="color: var(--text-secondary); margin-bottom: 1rem;">Could not load projects at this time.</p>
                    <button id="retry-btn" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Retry</button>
                </div>
            `;
            document.getElementById('retry-btn').addEventListener('click', fetchRepos);
        }
    };

    const createRepoCard = (repo) => {
        const div = document.createElement('div');
        div.className = 'repo-card fade-up';

        const langColors = {
            JavaScript: '#f1e05a',
            HTML: '#e34c26',
            CSS: '#563d7c',
            Python: '#3572A5',
            Java: '#b07219',
            TypeScript: '#2b7489',
            Vue: '#41b883',
            React: '#61dafb'
        };

        const langColor = langColors[repo.language] || '#ccc';
        const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

        div.innerHTML = `
            <div class="repo-header">
                <i class="far fa-folder folder-icon"></i>
                <div class="repo-links">
                    <a href="${repo.html_url}" target="_blank" aria-label="GitHub Link"><i class="fab fa-github"></i></a>
                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" aria-label="External Link"><i class="fas fa-external-link-alt"></i></a>` : ''}
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
        return div;
    };

    fetchRepos();
});
