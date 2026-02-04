document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const githubUsername = 'yasithinosh'; // Change this to your GitHub username
    const repoContainer = document.getElementById('repo-grid');

    // Navigation and Mobile Menu
    const header = document.getElementById('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Sticky Header Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 30px -10px rgba(2, 12, 27, 0.7)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // Mobile Menu Toggle
    hamburger.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        if (navLinks.style.display === 'flex') {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '80px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'var(--bg-color)';
            navLinks.style.padding = '2rem';
            navLinks.style.borderBottom = '1px solid var(--glass-border)';
        }
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.style.display = ''; // Close mobile menu on click
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Scroll Reveal Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => {
        el.style.animationPlayState = 'paused'; // Pause initially
        observer.observe(el);
    });

    // Dynamic Copyright Year
    const yearElement = document.querySelector('.footer p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = `&copy; ${currentYear} InoVoid Development. All rights reserved.`;
    }

    // Fetch GitHub Repositories
    const fetchRepos = async () => {
        repoContainer.innerHTML = '<div class="loader">Loading projects...</div>';
        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc`);
            if (!response.ok) throw new Error('Failed to fetch repositories');

            const repos = await response.json();

            // Filter out forks to show only original work, and pick top 6
            const myRepos = repos.filter(repo => !repo.fork).slice(0, 6);

            if (myRepos.length === 0) {
                repoContainer.innerHTML = '<p style="text-align:center; color: var(--text-secondary);">No public repositories found.</p>';
                return;
            }

            repoContainer.innerHTML = ''; // Clear loader

            myRepos.forEach(repo => {
                const card = createRepoCard(repo);
                repoContainer.appendChild(card);
            });
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
        div.className = 'repo-card fade-up'; // Add fade-up for animation

        // Language color mapping
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
