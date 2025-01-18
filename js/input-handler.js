const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    sendButton.style.height = this.style.height;
});

// Initial height
messageInput.style.height = 'auto';
messageInput.style.height = (messageInput.scrollHeight) + 'px';
sendButton.style.height = messageInput.style.height;