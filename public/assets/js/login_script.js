document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
        
        // Add a temporary class to highlight the password field
        passwordInput.classList.add('password-visible');
        setTimeout(() => {
            passwordInput.classList.remove('password-visible');
        }, 2000); // Remove the class after 2 seconds
    });
});

