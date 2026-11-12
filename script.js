// ==========================================
// PORTFOLIO NAVIGATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = Array.from(document.querySelectorAll('nav a'));
    const sections = navLinks
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === `#${entry.target.id}`
                    );
                });
            });
        }, { rootMargin: '-35% 0px -55% 0px' });

        sections.forEach(section => observer.observe(section));
    }

    // ==========================================
    // PORTFOLIO IMAGE VIEWER
    // Built here instead of relying on pre-existing
    // lightbox HTML, so it cannot initialize too early.
    // ==========================================
    const viewer = document.createElement('div');
    viewer.className = 'art-viewer';
    viewer.setAttribute('aria-hidden', 'true');
    viewer.innerHTML = `
        <button class="art-viewer-close" type="button" aria-label="Close image viewer">×</button>
        <button class="art-viewer-prev" type="button" aria-label="Previous artwork">‹</button>
        <figure class="art-viewer-figure">
            <img class="art-viewer-image" alt="">
            <figcaption class="art-viewer-caption"></figcaption>
        </figure>
        <button class="art-viewer-next" type="button" aria-label="Next artwork">›</button>
        <div class="art-viewer-count" aria-live="polite"></div>
    `;
    document.body.appendChild(viewer);

    const viewerImage = viewer.querySelector('.art-viewer-image');
    const viewerCaption = viewer.querySelector('.art-viewer-caption');
    const viewerCount = viewer.querySelector('.art-viewer-count');
    const closeButton = viewer.querySelector('.art-viewer-close');
    const prevButton = viewer.querySelector('.art-viewer-prev');
    const nextButton = viewer.querySelector('.art-viewer-next');

    let images = [];
    let currentIndex = 0;
    let previousFocus = null;

    function collectImages() {
        // The intro portrait is intentionally excluded.
        return Array.from(document.querySelectorAll('main img'))
            .filter(img => !img.closest('.intro-photo-wrap') && img.getAttribute('src'));
    }

    function openViewer(index) {
        images = collectImages();
        if (!images.length) return;

        currentIndex = (index + images.length) % images.length;
        const selected = images[currentIndex];

        previousFocus = document.activeElement;
        viewerImage.src = selected.currentSrc || selected.src;
        viewerImage.alt = selected.alt || 'Portfolio artwork';
        viewerCaption.textContent = selected.alt || 'Portfolio artwork';
        viewerCount.textContent = `${currentIndex + 1} / ${images.length}`;

        viewer.classList.add('is-open');
        viewer.setAttribute('aria-hidden', 'false');
        document.body.classList.add('art-viewer-open');
        closeButton.focus();
    }

    function closeViewer() {
        viewer.classList.remove('is-open');
        viewer.setAttribute('aria-hidden', 'true');
        viewerImage.removeAttribute('src');
        document.body.classList.remove('art-viewer-open');

        if (previousFocus && typeof previousFocus.focus === 'function') {
            previousFocus.focus();
        }
    }

    function moveViewer(step) {
        openViewer(currentIndex + step);
    }

    // Event delegation means every artwork image works, including images
    // that are added to the page later.
    document.addEventListener('click', event => {
        const image = event.target.closest('main img');
        if (!image || image.closest('.intro-photo-wrap')) return;

        const list = collectImages();
        const index = list.indexOf(image);
        if (index === -1) return;

        event.preventDefault();
        openViewer(index);
    });

    // Keyboard access to artwork thumbnails.
    document.querySelectorAll('main img:not(.intro-photo-wrap img)').forEach(img => {
        img.tabIndex = 0;
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', `Enlarge: ${img.alt || 'portfolio artwork'}`);
        img.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const list = collectImages();
                openViewer(list.indexOf(img));
            }
        });
    });

    closeButton.addEventListener('click', closeViewer);
    prevButton.addEventListener('click', () => moveViewer(-1));
    nextButton.addEventListener('click', () => moveViewer(1));

    // Clicking the dark area around the artwork closes the viewer.
    viewer.addEventListener('click', event => {
        if (event.target === viewer) closeViewer();
    });

    document.addEventListener('keydown', event => {
        if (!viewer.classList.contains('is-open')) return;

        if (event.key === 'Escape') closeViewer();
        if (event.key === 'ArrowLeft') moveViewer(-1);
        if (event.key === 'ArrowRight') moveViewer(1);
    });
});
