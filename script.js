
    /* sparkles */
    const particleContainer = document.getElementById('particle-container');
    const symbols = ['✧', '✦', '⟡', '⋆', '•'];
    for (let i = 0; i < 35; i++) {
        const particle = document.createElement('div');
        if (Math.random() > 0.6) {
            particle.classList.add('rune');
            particle.innerText = symbols[Math.floor(Math.random() * symbols.length)];
            particle.style.fontSize = Math.random() * 25 + 10 + 'px';
        } else {
            particle.classList.add('particle');
            const size = Math.random() * 3 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
        }
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDuration = Math.random() * 15 + 10 + 's';
        particle.style.animationDelay = Math.random() * -20 + 's';
        particleContainer.appendChild(particle);
    }

    /* modal logic */
    const modal = document.getElementById('project-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalGallery = document.getElementById('modal-gallery');
    const extraModalGallery = document.getElementById('extra-modal-gallery');

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCloseBtn = document.getElementById('lightbox-close');

    let projectData = {};

    async function loadPortfolioData() {
        try {
            const response = await fetch('dictionaryData.json');
            projectData = await response.json();
            initializeModals();

        } catch (error) {
            console.error("Failed to load project data:", error);
        }
    }

    loadPortfolioData();

    function initializeModals() {
        const portfolioItems = document.querySelectorAll('.interactive-item');
        const modalTitle = document.getElementById('modal-title');
        const modalTags = document.getElementById('modal-tags');
        const modalBody = document.getElementById('modal-body');
        const extraGallerySection = document.getElementById('extra-gallery-section');

        portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                const projectId = item.getAttribute('data-project');
                const data = projectData[projectId];

                if (data) {
                    modalTitle.innerText = data.title;
                    modalTags.innerHTML = data.tags.map(tag => `<span>${tag}</span>`).join('');
                    modalBody.innerHTML = data.description;

                    modalGallery.innerHTML = '';
                    extraModalGallery.innerHTML = '';
                    extraGallerySection.style.display = 'none';

                    if (data.media && data.media.length > 0) {
                        data.media.forEach((mediaItem, index) => {
                            if (mediaItem.type === "video") {
                                modalGallery.innerHTML += `
                                <video class="modal-media" autoplay loop muted playsinline controls>
                                    <source src="${mediaItem.src}" type="video/mp4">
                                </video>`;
                            } else if (mediaItem.type === "image") {
                                modalGallery.innerHTML += `
                                <img src="${mediaItem.src}" class="modal-media zoomable" alt="${data.title} - Image ${index + 1}">`;
                            }
                        });
                    }

                    if (data.extraMedia && data.extraMedia.length > 0) {
                        extraGallerySection.style.display = 'block';
                        data.extraMedia.forEach((mediaItem, index) => {
                            if (mediaItem.type === "video") {
                                extraModalGallery.innerHTML += `
                                <video class="modal-media" autoplay loop muted playsinline controls>
                                    <source src="${mediaItem.src}" type="video/mp4">
                                </video>`;
                            } else if (mediaItem.type === "image") {
                                extraModalGallery.innerHTML += `
                                <img src="${mediaItem.src}" class="modal-media zoomable" alt="${data.title} - Extra Image ${index + 1}">`;
                            }
                        });
                    }
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    }

    const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    setTimeout(() => { modalGallery.innerHTML = ''; extraModalGallery.innerHTML = ''; }, 400);
};

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    const triggerLightbox = (e) => {
    if (e.target.tagName === 'IMG' && e.target.classList.contains('zoomable')) {
        lightboxImg.src = e.target.src;
        lightbox.classList.add('active');
    }
};

    modalGallery.addEventListener('click', triggerLightbox);
    extraModalGallery.addEventListener('click', triggerLightbox);

    const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
};

    lightboxCloseBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target !== lightboxImg) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightbox.classList.contains('active')) closeLightbox();
            else if (modal.classList.contains('active')) closeModal();
        }
    });

    const cards = document.querySelectorAll('.nav-card');
    const sections = document.querySelectorAll('.portfolio-section');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const targetId = card.getAttribute('data-target');

            sections.forEach(section => {
                if (section.id === targetId) {
                    section.style.display = 'block';
                    setTimeout(() => {
                        section.style.opacity = '1';
                    }, 10);
                    document.querySelector('.portfolio-wrapper').scrollIntoView({behavior: 'smooth', block: 'start'});
                } else {
                    section.style.display = 'none';
                    section.style.opacity = '0';
                }
            });
        });

        if (window.matchMedia("(pointer: fine)").matches) {
            const bg = card.querySelector('.card-bg');

            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const rotateX = ((y - (rect.height / 2)) / 15) * -1;
                const rotateY = ((x - (rect.width / 2)) / 15);
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

                if (bg) {
                    const moveX = (x - rect.width / 2) * -0.05;
                    const moveY = (y - rect.height / 2) * -0.05;
                    bg.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                card.style.transition = 'transform 0.5s ease';
                if (bg) {
                    bg.style.transform = `translate(0px, 0px) scale(1.1)`;
                    bg.style.transition = 'transform 0.5s ease';
                }
            });

            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
                if (bg) bg.style.transition = 'none';
            });
        }
    });

    /* back to top logic */
    const backToTopBtn = document.getElementById('back-to-top');
    const aboutSection = document.getElementById('about');

    window.addEventListener('scroll', () => {
        const aboutBottomOffset = aboutSection.offsetTop + aboutSection.offsetHeight;

        if (window.scrollY > aboutBottomOffset - window.innerHeight / 2) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
