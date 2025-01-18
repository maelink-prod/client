document.addEventListener('DOMContentLoaded', () => {
    // Show login modal on page load if not logged in
    const user = localStorage.getItem('username');
    if (!user) {
        showModal('loginModal');
        loadingScreen = document.getElementById('loading-screen');
        function hideLoadingScreen() {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 1000);
        }
            setTimeout(() => {
            animationComplete = true;
            if (animationComplete) {
                hideLoadingScreen();
            }
        }, 500);
    }

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    const loginButton = loginForm.querySelector('#modal-loginButton');
    const registerButton = loginForm.querySelector('#modal-registerButton');

    // Add logout button event listener
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', () => {
        // Clear the authentication token
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        // Close the WebSocket connection
        if (ws) {
            ws.close();
            ws = null;
            ws = new WebSocket(wsUrl);
        }
        // Reset the UI
        showModal('loginModal');
        // Clear any sensitive data from the page
        document.getElementById('messages').innerHTML = '';
        document.getElementById('messages').style.display = 'none';
        document.getElementById('input').style.display = 'none';
        document.getElementById('welcome-message').textContent = '';
        document.getElementById('welcome-message-2').textContent = '';
        // Show a toast notification
        showToast('Logged out successfully');
    });

    loginButton.addEventListener('click', () => {
        const username = loginForm.querySelector('#modal-username').value;
        const password = loginForm.querySelector('#modal-password').value;
        login(username, password);
    });

    registerButton.addEventListener('click', async () => {
        const username = loginForm.querySelector('#modal-username').value;
        const password = loginForm.querySelector('#modal-password').value;
        if (username && password) {
            try {
                const response = await fetch(`${httpUrl}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user: username, password })
                });
    
                const data = await response.json();
    
                if (data.status === 'success') {
                    showToast('Registration successful! Please log in.');
                } else {
                    showToast('Registration failed: ' + data.message);
                }
            } catch (error) {
                console.error('Registration error:', error);
                showToast('Registration error: ' + error.message);
            }
        } else {
            showToast('Please enter both username and password');
        }
    });
})