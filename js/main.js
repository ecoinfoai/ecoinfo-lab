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
            let autoPlayInterval;

            const updateCarousel = (animate = true) => {
                const firstCard = carouselTrack.querySelector('.project-card');
                const cardWidth = firstCard.offsetWidth;
                const gap = parseInt(window.getComputedStyle(carouselTrack).gap) || 40;
                carouselTrack.style.transition = animate ? 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
                carouselTrack.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
            };

            const nextSlide = () => {
                currentIndex++;
                updateCarousel(true);
            };

            const prevSlide = () => {
                if (currentIndex === 0) {
                    // Silently jump to the cloned end before sliding left
                    currentIndex = originalLength;
                    updateCarousel(false);
                    // Force browser reflow to apply 'none' instantaneously
                    carouselTrack.offsetHeight;
                }
                currentIndex--;
                updateCarousel(true);
            };

            carouselTrack.addEventListener('transitionend', () => {
                // If we slid linearly past the original cards, snap back to the start smoothly
                if (currentIndex >= originalLength) {
                    currentIndex = currentIndex % originalLength; // Reset to 0
                    updateCarousel(false);
                }
            });

            const startAutoPlay = () => {
                autoPlayInterval = setInterval(nextSlide, 4000);
            };

            const pauseAutoPlay = () => {
                clearInterval(autoPlayInterval);
            };

            startAutoPlay();

            // Arrow Interactivity
            const prevBtn = document.getElementById('prev-project');
            const nextBtn = document.getElementById('next-project');
            const carouselContainer = document.getElementById('project-carousel');

            if (prevBtn && nextBtn) {
                prevBtn.addEventListener('click', () => {
                    pauseAutoPlay();
                    prevSlide();
                    startAutoPlay();
                });
                nextBtn.addEventListener('click', () => {
                    pauseAutoPlay();
                    nextSlide();
                    startAutoPlay();
                });
            }

            // Pause on hover
            if (carouselContainer) {
                carouselContainer.addEventListener('mouseenter', pauseAutoPlay);
                carouselContainer.addEventListener('mouseleave', startAutoPlay);
            }
        }
    }
});
