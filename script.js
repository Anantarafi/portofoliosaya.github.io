// script.js - Complete version with bilingual support and optimized slider
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    function setActiveNavLink() {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNavLink);
    setActiveNavLink(); // Run once on load

    // ==========================================
    // OPTIMIZED IMAGE SLIDER FUNCTIONALITY
    // ==========================================
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlideIndex = 0;
    let slideInterval;
    let isTransitioning = false;

    if (slides.length > 0) {
        function showSlide(index, direction = 'next') {
            // Prevent rapid clicking during transition
            if (isTransitioning) return;
            
            isTransitioning = true;
            
            // Add loading state
            const sliderContainer = document.querySelector('.slider-container');
            if (sliderContainer) {
                sliderContainer.classList.add('loading');
            }
            
            // Remove active class from all slides and dots
            slides.forEach((slide, i) => {
                slide.classList.remove('active', 'prev', 'next');
                
                if (i === currentSlideIndex) {
                    slide.classList.add(direction === 'next' ? 'prev' : 'next');
                }
            });
            
            dots.forEach(dot => dot.classList.remove('active'));

            // Add active class to new slide and dot with slight delay for smooth transition
            setTimeout(() => {
                if (slides[index]) {
                    slides[index].classList.add('active');
                }
                if (dots[index]) {
                    dots[index].classList.add('active');
                }
            }, 50);

            currentSlideIndex = index;
            
            // Remove loading state and allow new transitions
            setTimeout(() => {
                if (sliderContainer) {
                    sliderContainer.classList.remove('loading');
                }
                isTransitioning = false;
                
                // Clean up transition classes
                slides.forEach(slide => {
                    slide.classList.remove('prev', 'next');
                });
            }, 800); // Match CSS transition duration
        }

        function nextSlide() {
            const nextIndex = (currentSlideIndex + 1) % slides.length;
            showSlide(nextIndex, 'next');
        }

        function prevSlide() {
            const prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
            showSlide(prevIndex, 'prev');
        }

        // Event listeners for navigation buttons with debounce
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (!isTransitioning) {
                    nextSlide();
                    resetAutoplay();
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (!isTransitioning) {
                    prevSlide();
                    resetAutoplay();
                }
            });
        }

        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (!isTransitioning && index !== currentSlideIndex) {
                    const direction = index > currentSlideIndex ? 'next' : 'prev';
                    showSlide(index, direction);
                    resetAutoplay();
                }
            });
        });

        // Keyboard navigation with debounce
        let keyboardTimeout;
        document.addEventListener('keydown', (e) => {
            if (keyboardTimeout) return;
            
            keyboardTimeout = setTimeout(() => {
                keyboardTimeout = null;
            }, 300);
            
            if (e.key === 'ArrowLeft' && !isTransitioning) {
                prevSlide();
                resetAutoplay();
            } else if (e.key === 'ArrowRight' && !isTransitioning) {
                nextSlide();
                resetAutoplay();
            }
        });

        // Auto-play functionality with longer interval
        function startAutoplay() {
            slideInterval = setInterval(() => {
                if (!isTransitioning) {
                    nextSlide();
                }
            }, 8000); // Increased from 5000ms to 8000ms (8 seconds)
        }

        function stopAutoplay() {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
        }

        function resetAutoplay() {
            stopAutoplay();
            // Delay restart to give user time to interact
            setTimeout(() => {
                startAutoplay();
            }, 2000);
        }

        // Enhanced touch/swipe support for mobile
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        const sliderContainer = document.querySelector('.slider-container');

        if (sliderContainer) {
            sliderContainer.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                startTime = Date.now();
            }, { passive: true });

            sliderContainer.addEventListener('touchend', (e) => {
                if (!startX || !startY || isTransitioning) return;

                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const endTime = Date.now();

                const diffX = startX - endX;
                const diffY = startY - endY;
                const timeDiff = endTime - startTime;

                // Check if it's a quick swipe (not a long press/drag)
                if (timeDiff > 500) return;

                // Check if horizontal swipe is more significant than vertical
                if (Math.abs(diffX) > Math.abs(diffY)) {
                    if (Math.abs(diffX) > 80) { // Increased minimum swipe distance
                        if (diffX > 0) {
                            nextSlide(); // Swipe left - next slide
                        } else {
                            prevSlide(); // Swipe right - previous slide
                        }
                        resetAutoplay();
                    }
                }

                startX = 0;
                startY = 0;
                startTime = 0;
            }, { passive: true });

            // Prevent context menu on long press
            sliderContainer.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });

            // Pause autoplay when hovering over slider
            sliderContainer.addEventListener('mouseenter', stopAutoplay);
            sliderContainer.addEventListener('mouseleave', () => {
                if (!document.hidden) {
                    startAutoplay();
                }
            });
        }

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoplay();
            } else if (sliderContainer && !sliderContainer.matches(':hover')) {
                startAutoplay();
            }
        });

        // Initialize slider with smooth entrance
        showSlide(0);
        
        // Start autoplay after initial load (give time for page to settle)
        setTimeout(() => {
            startAutoplay();
        }, 3000); // Wait 3 seconds before starting autoplay

        // Preload images for smoother transitions
        slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img && img.src) {
                const preloadImg = new Image();
                preloadImg.src = img.src;
            }
        });
    }

    // Contact form handling with bilingual support
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const message = this.querySelector('textarea').value.trim();

            // Enhanced validation with language support
            if (!name || !email || !message) {
                showNotification(getTranslation('form-error-fields'), 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification(getTranslation('form-error-email'), 'error');
                return;
            }

            if (message.length < 10) {
                showNotification(getTranslation('form-error-message'), 'error');
                return;
            }

            // Simulate form submission
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = getTranslation('btn-sending');
            submitButton.disabled = true;

            setTimeout(() => {
                showNotification(getTranslation('form-success'), 'success');
                this.reset();
                submitButton.textContent = getTranslation('btn-send');
                submitButton.disabled = false;
            }, 1500);
        });
    }

    // Helper function to get translation
    function getTranslation(key) {
        return window.languageManager ? window.languageManager.translate(key) : key;
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '9999',
            maxWidth: '300px',
            fontSize: '0.9rem',
            lineHeight: '1.4',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);

        // Remove on click
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
    }

    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.skill-card, .stat');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animated');
            }
        });
    };

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }

    // Throttle scroll events for better performance
    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                setActiveNavLink();
                animateOnScroll();
                updateNavbar();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', handleScroll);

    // Initialize animations
    animateOnScroll();

    // Loading animation (optional)
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Intersection Observer for better animation performance
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.skill-card, .stat').forEach(el => {
            observer.observe(el);
        });
    }
});