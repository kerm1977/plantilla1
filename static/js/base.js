// Lógica PWA, Chromecast, Botones Flotantes y Cambio de Tema
document.addEventListener('DOMContentLoaded', function() {
    // ... (código JS existente para PWA, Cast, etc.)

    // LÓGICA BOTÓN VOLVER
    const backFab = document.getElementById('back-fab');
    if (backFab && (window.location.pathname === '/' || window.location.pathname === '/home')) {
        backFab.style.display = 'none';
    }

    // LÓGICA DE CAMBIO DE TEMA
    const themeButton = document.getElementById('single-theme-button');
    const htmlElement = document.documentElement;
    const activeThemeIcon = document.getElementById('active-theme-icon');

    // Función para actualizar el ícono del tema según el valor de data-theme
    const updateThemeIcon = (theme) => {
        switch (theme) {
            case 'dark':
                activeThemeIcon.className = 'fas fa-moon';
                break;
            case 'sepia':
                activeThemeIcon.className = 'fas fa-book-open';
                break;
            default:
                activeThemeIcon.className = 'fas fa-sun';
        }
    };

    // Al cargar la página, establece el ícono inicial basado en el tema actual
    updateThemeIcon(htmlElement.getAttribute('data-theme'));

    if (themeButton) {
        themeButton.addEventListener('click', () => {
            let currentTheme = htmlElement.getAttribute('data-theme');
            let newTheme;

            switch (currentTheme) {
                case 'light':
                    newTheme = 'dark';
                    break;
                case 'dark':
                    newTheme = 'sepia';
                    break;
                case 'sepia':
                    newTheme = 'light';
                    break;
                default:
                    newTheme = 'light';
            }

            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // LÓGICA PARA CERRAR NAVBAR (MOVIDO DESDE NAVBAR.HTML)
    const navbarCollapseElement = document.getElementById('navbarNav');
    const navbarToggler = document.querySelector('.navbar-toggler');

    document.addEventListener('click', function (event) {
        if (navbarCollapseElement && navbarCollapseElement.classList.contains('show')) {
            const isClickInsideNavbar = navbarCollapseElement.contains(event.target) || navbarToggler.contains(event.target);
            const isClickInsideDropdownMenu = event.target.closest('.dropdown-menu');

            if (!isClickInsideNavbar && !isClickInsideDropdownMenu) {
                bootstrap.Collapse.getInstance(navbarCollapseElement).hide();
            }
        }
    });

    if (navbarCollapseElement) {
        navbarCollapseElement.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', function() {
                if (navbarCollapseElement.classList.contains('show')) {
                     bootstrap.Collapse.getInstance(navbarCollapseElement).hide();
                }
            });
        });
    }
});
