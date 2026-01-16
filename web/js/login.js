/**
 * Login page controller
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const loginButton = document.getElementById('loginButton');

    // Check if already logged in
    async function checkAuth() {
        const authData = await Auth.checkAuth();
        if (authData.authenticated) {
            window.location.href = '/integration.html';
        }
    }

    // Check authentication on page load
    checkAuth();

    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Hide previous messages
        errorMessage.classList.remove('show');
        successMessage.classList.remove('show');
        
        // Disable button and show loading
        loginButton.disabled = true;
        loginButton.innerHTML = '<span class="loading"></span>Entrando...';
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const result = await Auth.login(username, password);
        
        if (result.success) {
            // Show success message
            successMessage.textContent = 'Login realizado com sucesso! Redirecionando...';
            successMessage.classList.add('show');
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = '/integration.html';
            }, 1000);
        } else {
            // Show error message
            errorMessage.textContent = result.data.error || 'Erro ao fazer login';
            errorMessage.classList.add('show');
            
            // Re-enable button
            loginButton.disabled = false;
            loginButton.textContent = 'Entrar';
        }
    });
});
