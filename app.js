document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Mobile Navigation Menu Toggle
    // -------------------------------------------------------------
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('navMenu');
    
    mobileNavToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileNavToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    // Close menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileNavToggle.querySelector('i').className = 'fa-solid fa-bars';
            
            // Highlight active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // -------------------------------------------------------------
    // 2. Interactive SVG Map Controller (Revised for CAD Layout)
    // -------------------------------------------------------------
    const plots = document.querySelectorAll('.map-plot');
    const floatingPlotCard = document.getElementById('floatingPlotCard');
    const closePlotCard = document.getElementById('closePlotCard');
    const detailPlotName = document.getElementById('detailPlotName');
    const detailStatus = document.getElementById('detailStatus');
    const detailSqft = document.getElementById('detailSqft');
    const detailDimensions = document.getElementById('detailDimensions');
    const detailLocation = document.getElementById('detailLocation');
    const detailDesc = document.getElementById('detailDesc');
    const plotSelect = document.getElementById('plotSelect');
    const bookPlotCTA = document.getElementById('bookPlotCTA');
    const resetMapBtn = document.getElementById('resetMap');
    const svgMarketing = document.getElementById('svgMarketing');

    const defaultViewBox = "0 0 520 780";
    let isZoomed = false;

    plots.forEach(plot => {
        plot.addEventListener('click', () => {
            const plotId = plot.getAttribute('data-id');

            // Set active class on plot path
            plots.forEach(p => p.classList.remove('active'));
            plot.classList.add('active');

            // Update Panel Details
            updatePlotDetailCard(plot);
            
            // Show floating card overlay
            floatingPlotCard.classList.add('active');
            
            // Auto-select plot in Form dropdown
            plotSelect.value = plotId;

            // Zoom SVG
            zoomIntoPlot(plot);
        });
    });

    closePlotCard.addEventListener('click', (e) => {
        e.stopPropagation();
        resetSVGZoom();
    });

    function updatePlotDetailCard(plot) {
        const name = plot.getAttribute('data-name');
        const size = plot.getAttribute('data-size');
        const dim = plot.getAttribute('data-dim');
        const desc = plot.getAttribute('data-desc');
        const loc = plot.getAttribute('data-loc');
        const status = plot.getAttribute('data-status');

        // Update card values
        detailPlotName.innerHTML = name;
        detailSqft.innerText = size;
        detailDimensions.innerHTML = dim;
        detailLocation.innerHTML = loc;
        detailDesc.innerHTML = desc;

        // Update Status Badge
        if (status === 'Sold') {
            detailStatus.innerText = 'Sold Out / बिका हुआ';
            detailStatus.className = 'status-badge status-sold sold';
            bookPlotCTA.style.pointerEvents = 'none';
            bookPlotCTA.style.opacity = '0.5';
            bookPlotCTA.innerHTML = 'Plot Sold Out / बिका हुआ';
        } else {
            detailStatus.innerText = 'Available / उपलब्ध';
            detailStatus.className = 'status-badge status-available';
            bookPlotCTA.style.pointerEvents = 'auto';
            bookPlotCTA.style.opacity = '1';
            bookPlotCTA.innerHTML = 'Book / Inquire (पूछताछ करें)';
        }
    }

    function zoomIntoPlot(plot) {
        // Calculate Bounding Box of plot path
        const bbox = plot.getBBox();
        const pad = 12; // Padding around the plot
        
        // Define target viewBox coordinates
        const targetX = bbox.x - pad;
        const targetY = bbox.y - pad;
        const targetW = bbox.width + pad * 2;
        const targetH = bbox.height + pad * 2;

        // Animate viewBox transition smoothly
        animateViewBox(svgMarketing, targetX, targetY, targetW, targetH);
        
        // Show Reset button
        resetMapBtn.style.display = 'inline-flex';
        isZoomed = true;
    }

    resetMapBtn.addEventListener('click', () => {
        resetSVGZoom();
    });

    function resetSVGZoom() {
        const defaultCoords = defaultViewBox.split(' ').map(Number);
        animateViewBox(svgMarketing, defaultCoords[0], defaultCoords[1], defaultCoords[2], defaultCoords[3]);
        
        // Reset selections and hide floating card
        plots.forEach(p => p.classList.remove('active'));
        floatingPlotCard.classList.remove('active');
        resetMapBtn.style.display = 'none';
        plotSelect.value = "";
        isZoomed = false;
    }

    // Custom requestAnimationFrame smooth viewBox interpolator
    function animateViewBox(svg, targetX, targetY, targetWidth, targetHeight, duration = 450) {
        const currentViewBox = svg.getAttribute('viewBox') || defaultViewBox;
        const [startX, startY, startWidth, startHeight] = currentViewBox.split(' ').map(Number);
        const startTime = performance.now();

        function update(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Easing function (easeOutQuad)
            const ease = progress * (2 - progress);

            const currX = startX + (targetX - startX) * ease;
            const currY = startY + (targetY - startY) * ease;
            const currW = startWidth + (targetWidth - startWidth) * ease;
            const currH = startHeight + (targetHeight - startHeight) * ease;

            svg.setAttribute('viewBox', `${currX} ${currY} ${currW} ${currH}`);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // -------------------------------------------------------------
    // 3. Image Carousel Slider & Lightbox
    // -------------------------------------------------------------
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    let currentSlide = 0;
    let carouselInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        
        currentSlide = (index + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    function startAutoplay() {
        carouselInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    }

    function stopAutoplay() {
        clearInterval(carouselInterval);
    }

    prevBtn.addEventListener('click', () => {
        stopAutoplay();
        showSlide(currentSlide - 1);
        startAutoplay();
    });

    nextBtn.addEventListener('click', () => {
        stopAutoplay();
        showSlide(currentSlide + 1);
        startAutoplay();
    });

    indicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            stopAutoplay();
            const slideIndex = parseInt(indicator.getAttribute('data-slide'));
            showSlide(slideIndex);
            startAutoplay();
        });
    });

    startAutoplay();

    // -------------------------------------------------------------
    // 4. Lightbox Modal Gallery
    // -------------------------------------------------------------
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const index = item.getAttribute('data-index');
            const img = item.querySelector('img');
            const slide = slides[index];
            const caption = slide.querySelector('.slide-caption').innerHTML;
            
            lightboxModal.style.display = 'block';
            lightboxImg.src = img.src;
            lightboxCaption.innerHTML = caption;
            stopAutoplay();
        });
    });

    lightboxClose.addEventListener('click', () => {
        lightboxModal.style.display = 'none';
        startAutoplay();
    });

    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            lightboxModal.style.display = 'none';
            startAutoplay();
        }
    });

    // Close lightbox with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.style.display === 'block') {
            lightboxModal.style.display = 'none';
            startAutoplay();
        }
    });

    // -------------------------------------------------------------
    // 5. Contact Form Simulation & Email Payload
    // -------------------------------------------------------------
    const inquiryForm = document.getElementById('inquiryForm');
    const successModal = document.getElementById('successModal');
    const closeSuccessBtn = document.getElementById('closeSuccess');


    async function getWeb3FormsKey() {
        try {
            const response = await fetch('.env');
            if (response.ok) {
                const text = await response.text();
                const lines = text.split('\n');
                for (let line of lines) {
                    const parts = line.split('=');
                    if (parts[0] && parts[0].trim() === 'WEB3FORMS_ACCESS_KEY') {
                        return parts[1] ? parts[1].trim() : '';
                    }
                }
            }
        } catch (e) {
            console.warn("Could not read .env file:", e);
        }
        return null;
    }

    inquiryForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const submitButton = document.getElementById('submitForm');
        const originalBtnText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending Inquiry / भेजा जा रहा है...';

        const formData = new FormData(inquiryForm);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Load Web3Forms Access Key from .env
        const web3Key = await getWeb3FormsKey();
        if (web3Key && web3Key !== 'YOUR_ACCESS_KEY_HERE') {
            formObject['access_key'] = web3Key;
            const hiddenKeyInput = document.getElementById('web3FormsAccessKey');
            if (hiddenKeyInput) hiddenKeyInput.value = web3Key;
        }
        
        // Add full plot name to the email submission
        formObject['Selected Plot Details'] = getPlotNameById(formData.get('SelectedPlot'));

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formObject)
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.ok) {
                successModal.classList.add('active');
            } else {
                alert("Submission failed: " + (json.message || "Unknown error"));
            }
        })
        .catch(error => {
            console.error("Error submitting form:", error);
            alert("Form submission failed. Please check your internet connection and try again.");
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = originalBtnText;
        });
    });

    closeSuccessBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
        
        // Reset form and map zoom after successful submission
        inquiryForm.reset();
        resetSVGZoom();
    });

    function getPlotNameById(id) {
        switch(id) {
            case '1': return 'Plot 1 (1,954 SQ.FT)';
            case '2': return 'Plot 2 (1,903 SQ.FT)';
            case '3': return 'Plot 3 (1,903 SQ.FT)';
            case '4': return 'Plot 4 (1,903 SQ.FT)';
            case '5': return 'Plot 5 (5,099 SQ.FT)';
            case '6': return 'Plot 6 (5,282 SQ.FT)';
            case '7': return 'Plot 7 (5,658 SQ.FT)';
            case '8': return 'Plot 8 (6,045 SQ.FT)';
            case '9': return 'Plot 9 (6,433 SQ.FT)';
            case '10': return 'Plot 10 (6,819 SQ.FT)';
            case '11': return 'Plot 11 (7,513 SQ.FT)';
            case '12': return 'Plot 12 (11,465 SQ.FT)';
            default: return 'Plot ' + id;
        }
    }

    // -------------------------------------------------------------
    // 6. Sticky Header Scroll Indicator & Fade Animations
    // -------------------------------------------------------------
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.boxShadow = 'var(--shadow-sm)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // Simple Intersection Observer to fade in elements on scroll
    const fadeElems = document.querySelectorAll('.feature-card, .section-header, .location-container, .contact-grid');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElems.forEach(elem => {
        elem.style.opacity = '0';
        elem.style.transform = 'translateY(35px)';
        elem.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(elem);
    });
});
