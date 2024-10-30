document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        menuButton.innerHTML = mobileMenu.classList.contains('active')
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>';
    });

    // Implementación básica de los carruseles
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        const content = carousel.querySelector('.carousel-content');
        const prevButton = carousel.querySelector('.prev');
        const nextButton = carousel.querySelector('.next');

        prevButton.addEventListener('click', () => {
            content.scrollBy({ left: -300, behavior: 'smooth' });
        });

        nextButton.addEventListener('click', () => {
            content.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }); 
});