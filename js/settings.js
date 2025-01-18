document.addEventListener('DOMContentLoaded', () => {
    const userIcon = document.getElementById('userIcon');
    const dropdownContent = document.querySelector('.dropdown-content');
    const settingsButton = document.getElementById('settingsButton');
    const settingsModal = document.getElementById('settingsModal');
    const closeButtons = document.querySelectorAll('.close-button');
    const logoutButton = document.getElementById('logoutButton');

    // Toggle dropdown menu
    userIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownContent.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.matches('#userIcon')) {
            dropdownContent.classList.remove('show');
        }
    });

    // Settings modal
    settingsButton.addEventListener('click', () => {
        settingsModal.style.display = 'block';
        dropdownContent.classList.remove('show');
    });

    // Close modals with close button
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').style.display = 'none';
        });
    });

    // Logout functionality
    logoutButton.addEventListener('click', () => {
        dropdownContent.classList.remove('show');
        logout();
    });
});