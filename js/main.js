document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       Navigation Bar Scroll Effect
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       Mobile Menu Toggle
       ========================================================================== */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    /* ==========================================================================
       Scroll Reveal Animations
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* ==========================================================================
       Project Carousel Logic (Infinite Loop)
       ========================================================================== */
    const carouselTrack = document.getElementById('project-track');
    if (carouselTrack) {
        const originalCards = Array.from(carouselTrack.querySelectorAll('.project-card'));
        
        // Only initialize carousel if there are 4 or more cards
        if (originalCards.length >= 4) {
            // Clone enough cards to fill the screen (max 3 visible on desktop)
            const cloneCount = 3; 
            for (let i = 0; i < cloneCount; i++) {
                if (originalCards[i % originalCards.length]) {
                    const clone = originalCards[i % originalCards.length].cloneNode(true);
                    clone.setAttribute('aria-hidden', 'true'); // Hide from screen readers
                    carouselTrack.appendChild(clone);
                }
            }
            
            let currentIndex = 0;
            const originalLength = originalCards.length;

            carouselTrack.addEventListener('transitionend', () => {
                // Once we have slid past the last original card and into the clones,
                // silently snap back to the very first card position.
                if (currentIndex >= originalLength) {
                    carouselTrack.style.transition = 'none';
                    currentIndex = currentIndex % originalLength; // Reset to 0
                    
                    const firstCard = carouselTrack.querySelector('.project-card');
                    const cardWidth = firstCard.offsetWidth;
                    const gap = parseInt(window.getComputedStyle(carouselTrack).gap) || 40;
                    
                    carouselTrack.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
                    
                    // Force browser reflow to apply 'transition: none' instantaneously
                    carouselTrack.offsetHeight; 
                    
                    // Remove inline 'transition: none' to re-enable CSS stylesheet transition
                    carouselTrack.style.transition = '';
                }
            });

            setInterval(() => {
                const firstCard = carouselTrack.querySelector('.project-card');
                const cardWidth = firstCard.offsetWidth;
                const gap = parseInt(window.getComputedStyle(carouselTrack).gap) || 40;
                
                // Slide left by one card
                currentIndex++;
                carouselTrack.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
            }, 4000); // Switch every 4 seconds
        }
    }
});
