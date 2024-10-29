document.addEventListener('DOMContentLoaded', function() {
    // Inicializar los iconos de Lucide
    lucide.createIcons();

    // Obtener todos los botones de navegación y secciones de contenido
    const navButtons = document.querySelectorAll('.nav-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const sectionTitle = document.getElementById('section-title');

    // Función para cambiar de pestaña
    function switchTab(tabId) {
        // Desactivar todos los botones y ocultar todos los contenidos
        navButtons.forEach(button => button.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Activar el botón seleccionado y mostrar el contenido correspondiente
        const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(tabId);

        if (selectedButton && selectedContent) {
            selectedButton.classList.add('active');
            selectedContent.classList.add('active');
            sectionTitle.textContent = selectedButton.textContent.trim();
        }
    }

    // Agregar event listeners a los botones de navegación
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

});