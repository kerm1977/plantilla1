/**
 * @fileoverview Script para manejar la validación del formulario de registro.
 * @author Gemini
 */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * @constant {NodeListOf<HTMLInputElement>} nameInputs - Todos los campos de entrada para nombres y apellidos.
     */
    const nameInputs = document.querySelectorAll('input[name="nombre"], input[name="primer_apellido"], input[name="segundo_apellido"]');

    nameInputs.forEach(input => {
        // Establecer la longitud máxima de 20 caracteres
        input.setAttribute('maxlength', '20');

        input.addEventListener('input', (event) => {
            let value = event.target.value;

            // 1. Eliminar caracteres no alfabéticos y espacios
            value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '');

            // 2. Forzar el formato "Title Case"
            if (value.length > 0) {
                value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            }

            // 3. Actualizar el valor del campo
            event.target.value = value;
        });

        // Añadir un listener 'change' para procesar de nuevo en caso de pegar o autocompletar
        input.addEventListener('change', (event) => {
            let value = event.target.value;

            // 1. Eliminar caracteres no alfabéticos y espacios
            value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '');

            // 2. Forzar el formato "Title Case"
            if (value.length > 0) {
                value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            }

            // 3. Actualizar el valor del campo
            event.target.value = value;
        });
    });
});
