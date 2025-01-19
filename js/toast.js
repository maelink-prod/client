let toastTimeout;

function showToast(message) {
    const toast = document.querySelector('.toast');
    
    if (toastTimeout) {
        clearTimeout(toastTimeout);
        toast.classList.remove('fadeOut');
        void toast.offsetWidth; // Trigger reflow to restart the animation
    }

    toast.textContent = message;
    toast.style.display = 'block';
    toast.classList.add('slideIn');

    toastTimeout = setTimeout(() => {
        toast.classList.remove('slideIn');
        toast.classList.add('fadeOut');
        toastTimeout = setTimeout(() => {
            toast.style.display = 'none';
            toast.classList.remove('fadeOut');
        }, 500); // Match the duration of the fadeOut animation
    }, 1500); // Duration before starting fadeOut
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