// Manejar el menú desplegable del perfil
const profileButton = document.getElementById('profileButton');
const profileDropdown = document.getElementById('profileDropdown');
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.content');
profileButton.addEventListener('click', () => {
    profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
});

//Abrir Nueva Pagina
function openNewPage() {
    window.location.href = 'edit_perfil_user.html';
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove 'active' class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // Add 'active' class to the clicked tab and corresponding content
        tab.classList.add('active');
        document.getElementById(tab.getAttribute('data-target')).classList.add('active');
    });
});
