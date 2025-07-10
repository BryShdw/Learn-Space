document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const mainNavList = document.querySelector('#main-nav-list');
    const profileLink = document.querySelector('.profile-link'); // For dropdown on mobile

    if (navToggle && mainNavList) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
            navToggle.setAttribute('aria-expanded', !isExpanded);
            mainNavList.classList.toggle('nav-active');

            // Close profile dropdown if open
            if (profileLink && profileLink.classList.contains('open')) {
                profileLink.classList.remove('open');
                profileLink.setAttribute('aria-expanded', 'false');
                const dropdownMenu = profileLink.nextElementSibling;
                if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
                    dropdownMenu.style.display = 'none';
                }
            }
        });
    }

    // Handle profile dropdown click/tap for mobile
    if (profileLink) {
        const dropdownMenu = profileLink.nextElementSibling;
        if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
            profileLink.addEventListener('click', function(event) {
                // Only activate for smaller screens where nav-toggle is visible
                if (window.getComputedStyle(navToggle).display !== 'none') {
                    event.preventDefault(); // Prevent navigation if it's a link
                    const isExpanded = profileLink.getAttribute('aria-expanded') === 'true' || false;

                    profileLink.setAttribute('aria-expanded', !isExpanded);
                    profileLink.classList.toggle('open');

                    if (!isExpanded) {
                        dropdownMenu.style.display = 'block';
                    } else {
                        dropdownMenu.style.display = 'none';
                    }
                }
            });
        }
    }

    // Close mobile nav or dropdown if clicked outside
    document.addEventListener('click', function(event) {
        if (mainNavList && mainNavList.classList.contains('nav-active')) {
            if (!mainNavList.contains(event.target) && !navToggle.contains(event.target)) {
                mainNavList.classList.remove('nav-active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        }
        // Close profile dropdown if open and click is outside
        if (profileLink && profileLink.classList.contains('open')) {
            const dropdownMenu = profileLink.nextElementSibling;
            if (dropdownMenu && !dropdownMenu.contains(event.target) && !profileLink.contains(event.target)) {
                profileLink.classList.remove('open');
                profileLink.setAttribute('aria-expanded', 'false');
                dropdownMenu.style.display = 'none';
            }
        }
    });

    // Add active class to current page link in navigation
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.main-nav-link');
    navLinks.forEach(link => {
        // Handle exact match for homepage '/'
        if (link.getAttribute('href') === '/' && currentPath === '/') {
            link.classList.add('active');
        }
        // Handle other pages, ensure it's not just '/'
        else if (link.getAttribute('href') !== '/' && currentPath.startsWith(link.getAttribute('href'))) {
            link.classList.add('active');
        }

        // Special case for /home as it might be the root for logged-in users
        if (currentPath === '/home' && link.getAttribute('href') === '/home') {
            navLinks.forEach(l => l.classList.remove('active')); // Remove active from '/' if on /home
            link.classList.add('active');
        }
    });

});
