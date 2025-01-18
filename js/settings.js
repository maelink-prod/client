document.addEventListener('DOMContentLoaded', () => {
    const userIcon = document.getElementById('userIcon');
    const dropdownContent = document.querySelector('.dropdown-content');
    const settingsButton = document.getElementById('settingsButton');
    const settingsScreen = document.getElementById('settingsScreen');
    const closeSettingsButton = document.getElementById('closeSettings');
    const logoutButton = document.getElementById('logoutButton');
    const settingsNavItems = document.querySelectorAll('.settings-nav-item');
    const settingsSections = document.querySelectorAll('.settings-section');

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

    // Settings screen
    settingsButton.addEventListener('click', () => {
        settingsScreen.style.display = 'block';
        dropdownContent.classList.remove('show');
    });

    // Close settings screen
    closeSettingsButton.addEventListener('click', () => {
        settingsScreen.style.display = 'none';
    });

    // Settings navigation
    settingsNavItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items and sections
            settingsNavItems.forEach(navItem => navItem.classList.remove('active'));
            settingsSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked item and corresponding section
            item.classList.add('active');
            const sectionId = item.getAttribute('data-section') + 'Section';
            document.getElementById(sectionId).classList.add('active');
        });
    });

    // Logout functionality
    logoutButton.addEventListener('click', () => {
        dropdownContent.classList.remove('show');
        settingsScreen.style.display = 'none';
        logout();
    });
});