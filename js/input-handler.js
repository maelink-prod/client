// Handle message input box dynamics and events
document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    // Convert input to textarea
    messageInput.type = 'textarea';
    messageInput.style.resize = 'none';
    messageInput.style.overflow = 'hidden';
    messageInput.style.minHeight = '36px';
    messageInput.style.maxHeight = '150px';

    function adjustInputHeight() {
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + 'px';
        sendButton.style.height = messageInput.style.height;
    }

    // Handle input events
    messageInput.addEventListener('input', adjustInputHeight);

    // Handle key events for enter/shift+enter
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (!e.shiftKey) {
                e.preventDefault();
                sendMessage();
                adjustInputHeight();
            }
        }
    });

    window.adjustInputHeight = adjustInputHeight;
});