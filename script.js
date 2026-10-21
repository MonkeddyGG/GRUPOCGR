document.addEventListener('DOMContentLoaded', () => {

    // Menú Hamburguesa Responsivo
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.querySelector('i').classList.toggle('fa-xmark');
    });

    // Cerrar menú móvil al dar clic en una opción
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-xmark');
        });
    });

    // Envío de Formulario hacia WhatsApp
    const formCotizacion = document.getElementById('form-cotizacion');

    formCotizacion.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const servicio = document.getElementById('servicio').value;
        const mensaje = document.getElementById('mensaje').value.trim();

        // Número de contacto de la empresa
        const telefonoWhatsApp = "5212216559132";

        // Estructura del mensaje para WhatsApp
        const textoWhatsApp = `Hola GRUPO CGR, me gustaría solicitar una cotización:%0A%0A` +
            `*Nombre:* ${nombre}%0A` +
            `*Teléfono:* ${telefono}%0A` +
            `*Servicio:* ${servicio}%0A` +
            `*Detalles:* ${mensaje}`;

        // Redireccionar a WhatsApp
        const urlWhatsApp = `https://wa.me/${telefonoWhatsApp}?text=${textoWhatsApp}`;
        window.open(urlWhatsApp, '_blank');
    });

    // Efecto de navegación activa en Scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
});