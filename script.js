document.addEventListener('DOMContentLoaded', () => {

    /* ===================================================
       1. SCROLL PROGRESS BAR & STICKY HEADER
    =================================================== */
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        // Header Transparente -> Sólido
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');

        // Barra de progreso (Reading indicator)
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });

    /* ===================================================
       2. MOBILE MENU & OVERLAY
    =================================================== */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-btn');

    function toggleMenu() {
        navMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
        // Prevenir scroll en body cuando el menú está abierto
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) toggleMenu();
        });
    });

    /* ===================================================
       3. DARK/LIGHT MODE TOGGLE (LocalStorage)
       Manejo avanzado de la paleta y los iconos
    =================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Función para renderizar el icono correcto
    const updateIcon = (theme) => {
        if (theme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-sun" style="color: #fbbf24;"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    };

    // Inicializar con la preferencia guardada o el default (light)
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateIcon(currentTheme);
    } else {
        // Opcional: Detectar la preferencia del sistema operativo del usuario
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateIcon('dark');
        }
    }

    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            updateIcon('light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            updateIcon('dark');
        }
    });

    /* ===================================================
       4. TYPEWRITER EFFECT (Efecto Máquina de Escribir)
    =================================================== */
    const words = ["Obra Civil.", "Remodelaciones.", "Proyectos 3D.", "Tu Visión."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterElement = document.getElementById('typewriter');

    function typeEffect() {
        if (!typewriterElement) return;

        const currentWord = words[wordIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 120;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2500; // Pausa para leer la palabra completa
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 600; // Pausa antes de escribir la siguiente palabra
        }

        setTimeout(typeEffect, typeSpeed);
    }

    setTimeout(typeEffect, 1000); // Retraso de inicio

    /* ===================================================
       5. CONTADORES ANIMADOS (Intersection Observer)
    =================================================== */
    const counters = document.querySelectorAll('.counter');
    let countersStarted = false;

    function startCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const increment = target / 100; // Ajusta velocidad aquí (mayor num = más lento)

            function updateCount() {
                const count = +counter.innerText;
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 25);
                } else {
                    counter.innerText = target + (target > 50 ? "+" : ""); // Añade un '+' al final a los números altos
                }
            }
            updateCount();
        });
    }

    /* ===================================================
       6. SCROLL REVEAL (Entradas suaves al hacer scroll)
    =================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Si la sección revelada son los stats, dispara el contador
                if (entry.target.id === 'stats' && !countersStarted) {
                    startCounters();
                    countersStarted = true;
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 }); // 15% del elemento visible para disparar la animación

    revealElements.forEach(el => revealObserver.observe(el));

    /* ===================================================
       7. GALERÍA JS FILTER
    =================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => { item.style.display = 'none'; }, 400);
                }
            });
        });
    });

    /* ===================================================
       8. TESTIMONIALS SLIDER (Carrusel Personalizado)
    =================================================== */
    const track = document.getElementById('testimonial-track');
    const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
    const dotsContainer = document.getElementById('slider-dots');
    let currentSlide = 0;
    let slideInterval;

    if (track && slides.length > 0) {
        // Crear Píldoras (dots) dinámicamente
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function goToSlide(index) {
            track.style.transform = `translateX(-${index * 100}%)`;
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));

            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
            resetInterval(); // Reinicia el timer al interactuar
        }

        function nextSlide() {
            let next = (currentSlide + 1) % slides.length;
            goToSlide(next);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 6000); // 6 Segundos por slide
        }

        resetInterval();
    }

    /* ===================================================
       9. FAQ ACORDEÓN (Preguntas frecuentes)
    =================================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const activeQuestion = document.querySelector('.faq-question.active');
            const answer = question.nextElementSibling;

            // Si hay otro abierto, lo cierra suavemente
            if (activeQuestion && activeQuestion !== question) {
                activeQuestion.classList.remove('active');
                activeQuestion.nextElementSibling.style.maxHeight = null;
            }

            // Alternar el estado actual
            question.classList.toggle('active');
            if (question.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px"; // Expande basado en contenido
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    /* ===================================================
       10. FORMULARIO A WHATSAPP
    =================================================== */
    const formCotizacion = document.getElementById('form-cotizacion');

    if (formCotizacion) {
        formCotizacion.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const telefono = document.getElementById('telefono').value;
            const servicio = document.getElementById('servicio').value;
            const mensaje = document.getElementById('mensaje').value;

            // Botón Loading UI Feedback
            const btn = formCotizacion.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Procesando...';
            btn.style.opacity = '0.8';
            btn.disabled = true;

            setTimeout(() => {
                const text = `*SOLICITUD DE COTIZACIÓN - WEB CGR*%0A%0A*👤 Cliente:* ${nombre}%0A*📞 Tel:* ${telefono}%0A*🏗️ Servicio:* ${servicio}%0A*📋 Detalles:* ${mensaje}`;
                // Lanza WhatsApp
                window.open(`https://wa.me/5212216559132?text=${text}`, '_blank');

                // Restaura botón
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
                btn.disabled = false;
                formCotizacion.reset();
            }, 1200);
        });
    }
});