// Portfolio Gallery - Complete JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1000);

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
                const offsetTop = target.offsetTop - 70;
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

    // ==========================================
    // PROJECT GALLERY FUNCTIONALITY
    // ==========================================
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const searchInput = document.getElementById('project-search');
    const noResults = document.getElementById('no-results');
    let isFiltering = false;

    // Initialize gallery with staggered animation
    function initializeGallery() {
        projectCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Filter projects function
    function filterProjects(filterValue, searchTerm = '') {
        if (isFiltering) return;
        isFiltering = true;

        let visibleCount = 0;

        // Add exit animation
        projectCards.forEach((card, index) => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.95)';
        });

        setTimeout(() => {
            projectCards.forEach((card, index) => {
                const cardCategory = card.getAttribute('data-category');
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const tech = Array.from(card.querySelectorAll('.project-tech span'))
                                .map(span => span.textContent.toLowerCase()).join(' ');
                
                const matchesFilter = filterValue === 'all' || cardCategory === filterValue;
                const matchesSearch = !searchTerm || 
                                    title.includes(searchTerm) || 
                                    description.includes(searchTerm) || 
                                    tech.includes(searchTerm);
                
                const shouldShow = matchesFilter && matchesSearch;
                
                if (shouldShow) {
                    card.style.display = 'block';
                    visibleCount++;
                    // Entrance animation with stagger
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, index * 50);
                } else {
                    card.style.display = 'none';
                }
            });

            // Show/hide no results message
            if (noResults) {
                noResults.style.display = visibleCount === 0 ? 'block' : 'none';
            }

            isFiltering = false;
        }, 300);
    }

    // Set up filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (isFiltering) return;

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
            filterProjects(filterValue, searchTerm);

            // Add button feedback animation
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Set up search functionality
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const searchTerm = e.target.value.toLowerCase().trim();
            
            searchTimeout = setTimeout(() => {
                const activeFilter = document.querySelector('.filter-btn.active');
                const filterValue = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
                filterProjects(filterValue, searchTerm);
            }, 300);
        });
    }

    // Project card interactions
    projectCards.forEach(card => {
        const image = card.querySelector('.project-image img');
        
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on overlay buttons
            if (e.target.closest('.project-btn')) return;
            
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(99, 102, 241, 0.3);
                border-radius: 50%;
                pointer-events: none;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                z-index: 10;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });

        // Image error handling
        if (image) {
            image.addEventListener('error', function() {
                this.src = 'data:image/svg+xml,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                        <rect width="400" height="300" fill="#f3f4f6"/>
                        <text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="#9ca3af">
                            Image not available
                        </text>
                    </svg>
                `);
                this.style.objectFit = 'contain';
            });
        }
    });

    // Initialize gallery
    setTimeout(() => {
        initializeGallery();
    }, 500);

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const message = this.querySelector('textarea').value.trim();

            // Validation
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
            submitButton.style.opacity = '0.7';

            // Add loading animation to button
            submitButton.innerHTML = `
                <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
                    <span style="width: 16px; height: 16px; border: 2px solid currentColor; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></span>
                    ${getTranslation('btn-sending')}
                </span>
            `;

            setTimeout(() => {
                showNotification(getTranslation('form-success'), 'success');
                this.reset();
                submitButton.textContent = getTranslation('btn-send');
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
                submitButton.innerHTML = getTranslation('btn-send');
            }, 2000);
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

    // Enhanced notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Icon based on type
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type] || icons.info}</span>
                <span class="notification-message">${message}</span>
            </div>
            <button class="notification-close" aria-label="${getTranslation('close-notification')}">&times;</button>
        `;

        // Add styles
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#6366f1'
        };

        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: colors[type] || colors.info,
            color: 'white',
            padding: '1rem',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            zIndex: '9999',
            maxWidth: '350px',
            fontSize: '0.9rem',
            lineHeight: '1.4',
            transform: 'translateX(100%)',
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
        });

        // Style notification content
        const content = notification.querySelector('.notification-content');
        content.style.cssText = 'display: flex; align-items: center; gap: 0.5rem; flex: 1;';

        const icon = notification.querySelector('.notification-icon');
        icon.style.cssText = 'font-size: 1.2rem; font-weight: bold;';

        // Style close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.4rem;
            cursor: pointer;
            padding: 0;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s ease;
            flex-shrink: 0;
        `;

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });

        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.backgroundColor = 'transparent';
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Auto remove after delay
        const autoRemoveTimeout = setTimeout(() => {
            removeNotification();
        }, type === 'error' ? 7000 : 5000);

        // Remove function
        function removeNotification() {
            clearTimeout(autoRemoveTimeout);
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 400);
        }

        // Remove on close button click
        closeBtn.addEventListener('click', removeNotification);

        // Remove on notification click (except close button)
        notification.addEventListener('click', (e) => {
            if (e.target !== closeBtn) {
                removeNotification();
            }
        });
    }

    // Intersection Observer for scroll animations
    function setupScrollAnimations() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        
                        // Add stagger animation for children
                        const children = entry.target.querySelectorAll('.skill-card, .stat, .project-card');
                        children.forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('animated');
                            }, index * 100);
                        });
                        
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe sections
            document.querySelectorAll('.skills, .about, .contact').forEach(section => {
                animationObserver.observe(section);
            });

            document.querySelectorAll('.skill-card, .stat').forEach(card => {
                animationObserver.observe(card);
            });
        }
    }

    // Navbar behavior on scroll
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
            navbar.style.backdropFilter = 'blur(10px)';
        }

        // Optional: Hide/show navbar on scroll
        if (Math.abs(currentScrollY - lastScrollY) > 100) {
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                // Scrolling down - hide navbar
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show navbar
                navbar.style.transform = 'translateY(0)';
            }
            lastScrollY = currentScrollY;
        }
    }

    // Throttle scroll events
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                setActiveNavLink();
                updateNavbar();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initialize scroll animations
    setupScrollAnimations();

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // ESC key to close mobile menu
        if (e.key === 'Escape') {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }

        // Arrow keys for project navigation (optional)
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const activeCard = document.querySelector('.project-card:hover');
            if (activeCard) {
                const cards = Array.from(projectCards);
                const currentIndex = cards.indexOf(activeCard);
                let nextIndex;
                
                if (e.key === 'ArrowLeft') {
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
                } else {
                    nextIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
                }
                
                const nextCard = cards[nextIndex];
                if (nextCard && nextCard.style.display !== 'none') {
                    nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    nextCard.focus();
                }
            }
        }
    });

    // Accessibility improvements
    function enhanceAccessibility() {
        // Add keyboard navigation for filter buttons
        filterButtons.forEach((button, index) => {
            button.setAttribute('tabindex', '0');
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const buttons = Array.from(filterButtons);
                    let nextIndex;
                    
                    if (e.key === 'ArrowLeft') {
                        nextIndex = index > 0 ? index - 1 : buttons.length - 1;
                    } else {
                        nextIndex = index < buttons.length - 1 ? index + 1 : 0;
                    }
                    
                    buttons[nextIndex].focus();
                }
            });
        });

        // Add focus management for project cards
        projectCards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `View project: ${card.querySelector('h3').textContent}`);
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });

        // Improve focus visibility
        const focusStyles = `
            .filter-btn:focus,
            .project-card:focus,
            .nav-link:focus,
            .btn:focus {
                outline: 2px solid var(--primary-color);
                outline-offset: 2px;
            }
            
            .project-card:focus {
                transform: translateY(-5px);
                box-shadow: var(--shadow-lg);
                border-color: var(--primary-color);
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = focusStyles;
        document.head.appendChild(styleSheet);
    }

    // Initialize accessibility features
    enhanceAccessibility();

    // Performance optimizations
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setActiveNavLink();
            // Recalculate any position-dependent features if needed
        }, 250);
    }, { passive: true });

    // Page visibility API for performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause any animations or timers when page is hidden
        } else {
            // Resume when page becomes visible
            setActiveNavLink();
        }
    });

    // Loading completion
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        setTimeout(() => {
            document.body.classList.add('fully-loaded');
        }, 500);
    });

    // Add page transition effects
    function addPageTransitions() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    }

    addPageTransitions();

    // Initialize everything
    console.log('🎨 Portfolio Gallery loaded successfully!');
    console.log(`📊 Found ${projectCards.length} projects`);
    console.log(`🔍 Search functionality: ${searchInput ? 'enabled' : 'disabled'}`);
    console.log(`🎯 Filter buttons: ${filterButtons.length}`);
});

// Export utility functions for external use
window.portfolioUtils = {
    showNotification: function(message, type) {
        // This function will be available after DOM is loaded
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        }
    },
    filterProjects: function(category) {
        const filterBtn = document.querySelector(`[data-filter="${category}"]`);
        if (filterBtn) {
            filterBtn.click();
        }
    },
    searchProjects: function(term) {
        const searchInput = document.getElementById('project-search');
        if (searchInput) {
            searchInput.value = term;
            searchInput.dispatchEvent(new Event('input'));
        }
    }
};
