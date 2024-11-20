const form = document.getElementById('profile-form');
const submitBtn = document.getElementById('submit-btn');
const toast = document.getElementById('toast');
const avatarUpload = document.getElementById('avatar-upload');
const avatarPreview = document.getElementById('avatar-preview');

//Abrir nueva pagina
function openNewPage() {
    window.location.href = 'user_perfil.html';
}

//Validacion de telefono
const numericInput = document.getElementById('phone-number');
numericInput.addEventListener('input', function (e) {
    // Reemplaza cualquier carácter que no sea un número
    this.value = this.value.replace(/[^0-9]/g, '');
});

// Manejar el menú desplegable del perfil
const profileButton = document.getElementById('profileButton');
const profileDropdown = document.getElementById('profileDropdown');
profileButton.addEventListener('click', () => {
    profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', (event) => {
    if (!profileButton.contains(event.target) && !profileDropdown.contains(event.target)) {
       profileDropdown.style.display = 'none';
    }
  });

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Actualizando...';

    // Simular una petición de actualización
    await new Promise(resolve => setTimeout(resolve, 2000));

    submitBtn.disabled = false;
    submitBtn.textContent = 'Guardar Cambios';

    // Mostrar notificación
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
});

avatarUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            avatarPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});