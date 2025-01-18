document.addEventListener('DOMContentLoaded', () => {
    // Show login modal on page load if not logged in
    const user = getCookie('username');
    if (!user) {
        showModal('loginModal');
    } else {
        showToast("Connecting to server...")
    }

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    const loginButton = loginForm.querySelector('#modal-loginButton');
    const registerButton = loginForm.querySelector('#modal-registerButton');

    // Add logout button event listener
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', () => {
        // Clear the authentication token
        eraseCookie('token');
        eraseCookie('username');
        eraseCookie('hashedPassword');
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
        showToast("Logging in...")
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