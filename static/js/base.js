// Lógica PWA, Chromecast, Botones Flotantes y Cambio de Tema
document.addEventListener('DOMContentLoaded', function() {
    // ... (código JS existente para PWA, Cast, etc.)

    // LÓGICA BOTÓN VOLVER
    const backFab = document.getElementById('back-fab');
    if (backFab && (window.location.pathname === '/' || window.location.pathname === '/home')) {
        backFab.style.display = 'none';
    }

    // LÓGICA DE CAMBIO DE TEMA
    const themeSwitchers = document.querySelectorAll('.theme-switcher');
    const activeThemeIcon = document.getElementById('active-theme-icon');
    const themes = ['light', 'dark', 'sepia'];
    
    function updateActiveIcon(theme) {
        if (!activeThemeIcon) return;
        let iconClass = 'fa-sun'; // default to light
        if (theme === 'dark') iconClass = 'fa-moon';
        if (theme === 'sepia') iconClass = 'fa-book-open';
        activeThemeIcon.className = 'fas ' + iconClass;
    }
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        updateActiveIcon(theme);
        fetch("{{ url_for('change_theme', theme='dummy') }}".replace('dummy', theme), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }).then(response => {
            if (response.ok) {
                window.location.reload(); // Recarga la página para aplicar el tema
            }
        }).catch(console.error);
    }
    
    // Este código maneja el clic en un solo botón
    const singleThemeButton = document.getElementById('single-theme-button');
    if (singleThemeButton) {
        singleThemeButton.addEventListener('click', function(e) {
            e.preventDefault();
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const currentIndex = themes.indexOf(currentTheme);
            const nextIndex = (currentIndex + 1) % themes.length;
            const nextTheme = themes[nextIndex];
            setTheme(nextTheme);
        });
    }
    updateActiveIcon(document.documentElement.getAttribute('data-theme'));
    
    // LÓGICA DE CAMBIO DE IDIOMA
    const langSwitchers = document.querySelectorAll('.lang-switcher');
    function setLang(lang) {
        // Asume que tienes un endpoint '/set_lang' en Flask
        fetch("{{ url_for('change_language', lang='dummy') }}".replace('dummy', lang), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }).then(response => {
            if (response.ok) {
                window.location.reload(); // Recarga la página para aplicar el idioma
            }
        }).catch(console.error);
    }
    
    const singleLangButton = document.getElementById('single-lang-button');
    if (singleLangButton) {
        singleLangButton.addEventListener('click', function(e) {
            e.preventDefault();
            const currentLang = document.documentElement.getAttribute('lang');
            const nextLang = (currentLang === 'es') ? 'en' : 'es';
            setLang(nextLang);
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