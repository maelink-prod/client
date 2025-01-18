function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    
    // Reset animations
    toast.style.animation = 'none';
    toast.offsetHeight; // Trigger reflow
    toast.style.animation = 'slideIn 0.5s, fadeOut 0.5s ' + (duration - 500) + 'ms';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, duration);
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Initialize modal close buttons
document.addEventListener('DOMContentLoaded', () => {
    const closeButtons = document.getElementsByClassName('close-button');
    Array.from(closeButtons).forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                hideModal(modal.id);
            }
        });
    });
});