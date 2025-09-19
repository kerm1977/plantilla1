document.addEventListener('DOMContentLoaded', () => {
    // Select all password toggle elements.
    const passwordToggles = document.querySelectorAll('[id^="toggle_"]');

    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            // Get the ID of the associated password input.
            const inputId = toggle.id.replace('toggle_', '') + '_input';
            const passwordInput = document.getElementById(inputId);

            if (passwordInput) {
                // Change the input type between 'password' and 'text'.
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);

                // Find the icon and toggle its class.
                const icon = toggle.querySelector('i');
                if (type === 'password') {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                } else {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                }
            }
        });
    });
});
