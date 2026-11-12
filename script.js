
// ==========================================
// NAVIGATION: Highlight the active section
// ==========================================

const navLinks = [...document.querySelectorAll('nav a')];

const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.toggle(
                            'active',
                            link.getAttribute('href') === `#${entry.target.id}`
                        );
                    });
                }
            });
        },
        {
            rootMargin: '-35% 0px -55% 0px'
        }
    );

    sections.forEach(section => observer.observe(section));
}


// ==========================================
// IMAGE VIEWER: Open and browse artwork
// ==========================================

const lightbox = document.querySelector('#art-lightbox');

if (lightbox) {

    const lightboxImage = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('figcaption');

    const closeButton = lightbox.querySelector('.lightbox-close');
    const previousButton = lightbox.querySelector('.lightbox-prev');
    const nextButton = lightbox.querySelector('.lightbox-next');

    // Collect all portfolio images except the artist portrait
    const artwork = [
        ...document.querySelectorAll('main img')
    ].filter(img => !img.closest('.intro-photo-wrap'));

    let activeArtwork = 0;
    let previouslyFocusedElement = null;


    // Open an artwork in the viewer
    function showArtwork(index) {

        if (artwork.length === 0) return;

        activeArtwork = (index + artwork.length) % artwork.length;

        const img = artwork[activeArtwork];

        previouslyFocusedElement = document.activeElement;

        lightboxImage.src = img.currentSrc || img.src;
        lightboxImage.alt = img.alt || 'Portfolio artwork';

        lightboxCaption.textContent = img.alt || '';

        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');

        document.body.style.overflow = 'hidden';

        closeButton.focus();
    }


    // Close the viewer
    function closeArtwork() {

        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');

        lightboxImage.removeAttribute('src');

        document.body.style.overflow = '';

        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }
    }


    // Make portfolio images clickable
    artwork.forEach((img, index) => {

        img.style.cursor = 'zoom-in';
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');

        img.addEventListener('click', () => {
            showArtwork(index);
        });

        img.addEventListener('keydown', event => {

            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                showArtwork(index);
            }

        });

    });


    // Close button
    closeButton.addEventListener('click', closeArtwork);


    // Previous artwork
    previousButton.addEventListener('click', () => {
        showArtwork(activeArtwork - 1);
    });


    // Next artwork
    nextButton.addEventListener('click', () => {
        showArtwork(activeArtwork + 1);
    });


    // Close when clicking outside the artwork
    lightbox.addEventListener('click', event => {

        if (event.target === lightbox) {
            closeArtwork();
        }

    });


    // Keyboard controls
    document.addEventListener('keydown', event => {

        if (!lightbox.classList.contains('open')) return;

        if (event.key === 'Escape') {
            closeArtwork();
        }

        if (event.key === 'ArrowLeft') {
            showArtwork(activeArtwork - 1);
        }

        if (event.key === 'ArrowRight') {
            showArtwork(activeArtwork + 1);
        }

    });

}
