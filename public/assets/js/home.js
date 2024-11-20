
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

//cambiar de contenido
const buttons = document.querySelectorAll('.nav-button');
const sections = document.querySelectorAll('.section');

// Añadir evento de clic a cada botón
buttons.forEach(button => {
  button.addEventListener('click', () => {
    // Si el botón no es el de notificaciones, cambia la sección
    if (button.getAttribute('data-section') !== 'notificaciones') {
      // Eliminar la clase 'active' de todos los botones
      buttons.forEach(btn => btn.classList.remove('active'));
      // Añadir la clase 'active' al botón clickeado
      button.classList.add('active');
      
      // Ocultar todas las secciones
      sections.forEach(section => section.classList.remove('active'));
      // Mostrar la sección correspondiente
      const sectionId = button.getAttribute('data-section');
      document.getElementById(sectionId).classList.add('active');
    }
  });
});

//Panel de Notificaciones
const notificationButton = document.getElementById('notificationButton');
const notificationPanel = document.getElementById('notificationPanel');
const closeButton = document.getElementById('closeButton');
const notificationList = document.getElementById('notificationList');
const notificationCount = document.getElementById('notificationCount');

// Mostrar/ocultar el panel de notificaciones
notificationButton.addEventListener('click', (event) => {
    event.stopPropagation();
    notificationPanel.style.display = notificationPanel.style.display === 'block' ? 'none' : 'block';
});

// Cerrar el panel de notificaciones
closeButton.addEventListener('click', () => {
    notificationPanel.style.display = 'none';
});

// Cerrar el panel si se hace clic fuera de él
document.addEventListener('click', (event) => {
    if (!notificationButton.contains(event.target) && !notificationPanel.contains(event.target)) {
        notificationPanel.style.display = 'none';
    }
});