// ==========================================
// PORTFOLIO JAVASCRIPT - COMPLETE & WORKING
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // === 1. HIDE LOADING SCREEN IMMEDIATELY ===
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 300);
    }

    // === 2. NAVIGATION ===
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    function updateActiveNav() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    // === 3. PROJECT FILTERS ===
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const noResults = document.getElementById('no-results');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filterValue = this.getAttribute('data-filter');
            const searchValue = document.getElementById('project-search')?.value.toLowerCase() || '';
            filterProjects(filterValue, searchValue);
        });
    });

    function filterProjects(filter, search = '') {
        let visibleCount = 0;

        projectCards.forEach((card) => {
            const category = card.getAttribute('data-category');
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = card.querySelector('p')?.textContent.toLowerCase() || '';
            const tech = Array.from(card.querySelectorAll('.project-tech span'))
                .map(span => span.textContent.toLowerCase())
                .join(' ');

            const matchCategory = filter === 'all' || category === filter;
            const matchSearch = !search || title.includes(search) || description.includes(search) || tech.includes(search);

            if (matchCategory && matchSearch) {
                card.style.display = 'flex';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                visibleCount++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    // === 4. PROJECT SEARCH ===
    const projectSearch = document.getElementById('project-search');
    if (projectSearch) {
        let searchTimeout;
        projectSearch.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchValue = this.value.toLowerCase();
                const activeFilter = document.querySelector('.filter-btn.active');
                const filterValue = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
                filterProjects(filterValue, searchValue);
            }, 300);
        });
    }

// === 5. PROJECT MODAL - FIXED EVENT BUBBLING ===
const modal = document.getElementById('project-modal');
const modalClose = document.getElementById('modal-close');
const closeModalBtn = document.getElementById('close-modal');
const modalBackdrop = document.querySelector('.modal-backdrop');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalTech = document.getElementById('modal-tech');
const modalCategory = document.getElementById('modal-category');
const viewProjectBtn = document.getElementById('view-project');
const shareProjectBtn = document.getElementById('share-project');

let currentProjectLink = '';

function openModal(card) {
    const imgSrc = card.querySelector('.project-image img')?.src || '';
    const title = card.querySelector('h3')?.textContent || '';
    const description = card.querySelector('p')?.textContent || '';
    const category = card.getAttribute('data-category') || '';
    const projectLink = card.getAttribute('data-link') || '#';
    const techSpans = card.querySelectorAll('.project-tech span');

    currentProjectLink = projectLink;

    if (modalImage) {
        modalImage.src = imgSrc;
        modalImage.alt = title;
    }
    if (modalTitle) modalTitle.textContent = title;
    if (modalDescription) modalDescription.textContent = description;
    
    if (modalTech) {
        modalTech.innerHTML = '';
        techSpans.forEach(span => {
            const techTag = document.createElement('span');
            techTag.className = 'tech-tag';
            techTag.textContent = span.textContent;
            modalTech.appendChild(techTag);
        });
    }

    if (modalCategory) {
        const categoryMap = {
            'ui-ux': 'UI/UX Design',
            'web': 'Web Development',
            'design': 'Graphic Design'
        };
        modalCategory.textContent = categoryMap[category] || category;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('Modal opened:', title);
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    resetZoom();
    currentProjectLink = '';
    console.log('Modal closed');
}

// PERBAIKAN: Event listener untuk tombol "Lihat Detail"
projectCards.forEach(card => {
    const btn = card.querySelector('.project-btn');
    if (btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // PENTING: Stop event bubbling
            e.stopImmediatePropagation(); // TAMBAHAN: Stop semua event
            openModal(card);
        });
    }
    
    // PERBAIKAN: Jangan buka modal saat klik card
    card.addEventListener('click', function(e) {
        // Cek apakah yang diklik adalah tombol atau overlay
        if (e.target.closest('.project-btn') || e.target.closest('.project-overlay')) {
            return; // Jangan lakukan apa-apa
        }
    });
});

// Close modal events
if (modalClose) {
    modalClose.addEventListener('click', function(e) {
        e.stopPropagation();
        closeModal();
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeModal();
    });
}

// PERBAIKAN: Backdrop hanya close saat klik di luar modal content
if (modalBackdrop) {
    modalBackdrop.addEventListener('click', function(e) {
        if (e.target === modalBackdrop) {
            closeModal();
        }
    });
}

// PERBAIKAN: Prevent modal content click from closing
const modalContent = document.querySelector('.modal-content');
if (modalContent) {
    modalContent.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent bubbling to backdrop
    });
}

// Close with ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

    // === 6. VIEW PROJECT BUTTON ===
    if (viewProjectBtn) {
        viewProjectBtn.addEventListener('click', function() {
            console.log('Button clicked, link:', currentProjectLink);
            if (currentProjectLink && currentProjectLink !== '#' && currentProjectLink !== '') {
                window.open(currentProjectLink, '_blank');
            } else {
                showNotification('Link project belum tersedia', 'info');
            }
        });
    }

    // === 7. SHARE PROJECT ===
    if (shareProjectBtn) {
        shareProjectBtn.addEventListener('click', function() {
            const projectTitle = modalTitle?.textContent || '';
            const shareUrl = currentProjectLink !== '#' ? currentProjectLink : window.location.href;

            if (navigator.share) {
                navigator.share({
                    title: projectTitle,
                    url: shareUrl
                }).catch(err => console.log('Error:', err));
            } else {
                navigator.clipboard.writeText(shareUrl).then(() => {
                    showNotification('Link disalin!', 'success');
                }).catch(() => {
                    showNotification('Gagal menyalin', 'error');
                });
            }
        });
    }

    // === 8. ZOOM CONTROLS ===
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const resetZoomBtn = document.getElementById('reset-zoom');
    const modalImageContainer = document.querySelector('.modal-image-container');
    let zoomLevel = 1;

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', function() {
            if (zoomLevel < 4) {
                zoomLevel++;
                updateZoom();
            }
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', function() {
            if (zoomLevel > 1) {
                zoomLevel--;
                updateZoom();
            }
        });
    }

    if (resetZoomBtn) {
        resetZoomBtn.addEventListener('click', resetZoom);
    }

    function updateZoom() {
        if (modalImageContainer) {
            modalImageContainer.className = 'modal-image-container zoom-' + zoomLevel;
        }
    }

    function resetZoom() {
        zoomLevel = 1;
        if (modalImageContainer) {
            modalImageContainer.className = 'modal-image-container zoom-1';
        }
    }

    if (modalImage) {
        modalImage.addEventListener('click', function() {
            zoomLevel = zoomLevel === 1 ? 2 : 1;
            updateZoom();
        });
    }

    // === 9. CONTACT FORM ===
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[name="name"]')?.value.trim() || '';
            const email = this.querySelector('input[name="email"]')?.value.trim() || '';
            const message = this.querySelector('textarea[name="message"]')?.value.trim() || '';

            if (!name || !email || !message) {
                showNotification('Mohon isi semua field!', 'error');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showNotification('Email tidak valid!', 'error');
                return;
            }

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Mengirim...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showNotification('Pesan terkirim!', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // === 10. BACK TO TOP ===
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function updateBackToTop() {
        if (window.scrollY > 300) {
            backToTop?.classList.add('visible');
        } else {
            backToTop?.classList.remove('visible');
        }
    }

    // === 11. SMOOTH SCROLL ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // === 12. SCROLL HANDLER ===
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateActiveNav();
                updateBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // === 13. ANIMATE CARDS ===
    function animateProjectCards() {
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    // === 14. NOTIFICATION ===
    function showNotification(message, type = 'info') {
        document.querySelectorAll('.notification').forEach(n => {
            n.style.transform = 'translateX(100%)';
            setTimeout(() => n.remove(), 300);
        });

        const notification = document.createElement('div');
        notification.className = 'notification';
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#6366f1'
        };

        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: colors[type],
            color: '#fff',
            padding: '1rem 1.5rem',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.35s ease',
            fontWeight: '500'
        });

        notification.innerHTML = `<span>${message}</span>`;
        document.body.appendChild(notification);
        setTimeout(() => notification.style.transform = 'translateX(0)', 20);
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 350);
        }, 3000);
    }

    // === INITIALIZE ===
    filterProjects('all', '');
    animateProjectCards();

    console.log('%c✅ Portfolio Ready!', 'color: #10b981; font-size: 14px; font-weight: bold;');
});
