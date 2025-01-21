const wsUrl = 'wss://maelink-ws.derpygamer2142.com';
const httpUrl = 'https://maelink-http.derpygamer2142.com';
let ws;
let postsLoaded = 0;
var animationComplete = false;
const jsString = (s) => JSON.stringify(s).replace(/'/g, "\\x31").replace(/&/g, "\\x26");
document.addEventListener('DOMContentLoaded', () => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    if (storedUsername && storedPassword) {
        login(storedUsername, storedPassword);
    }
});
document.addEventListener('focus', () => {
    document.title = "maelink";                        
});
document.addEventListener("visibilitychange", () => {
	if (document.visibilityState == "visible") {
		document.title = "maelink";
	}
});
function login(username, password) {
    fetch(`${httpUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                localStorage.setItem('username', username);
                localStorage.setItem('password', password);
                localStorage.setItem('token', data.token);
                hideModal('loginModal');
                document.getElementById('messages').style.display = 'block';
                document.getElementById('input').style.display = 'flex';
                document.getElementById('topbar').style.display = 'flex';
                document.getElementById('userInfo').style.display = 'flex';
                var welcomeMessageElement = document.getElementById('welcome-message');
                var welcomeMessage2Element = document.getElementById('welcome-message-2');
                if (welcomeMessageElement) {
                    welcomeMessageElement.innerText = `Hello, ${username}!`;
                    welcomeMessage2Element.innerText = `What will you post today?`;
                }
                connectWebSocket();
            } else {
                showToast('Login failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            showToast('Login error: ' + error.message);
        });
}

function connectWebSocket() {
    ws = new WebSocket(wsUrl);
    ws.onopen = () => {
        console.log('Connected to the WebSocket server');
        document.getElementById('loadMoreButton').style.display = 'block';
        ws.send(JSON.stringify({ cmd: 'fetch', offset: 0 }));
    };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const messagesContainer = document.getElementById('messages');

        if (message.cmd === 'fetch') {
            if (message.posts.length === 0) {
                showToast("No more posts to load!")
            } else {
                message.posts.forEach(post => {
                    const postElement = createPostElement(post);
                    messagesContainer.appendChild(postElement);
                    postsLoaded++;
                });
                showToast(postsLoaded === 10 ? "Connected to server!" : "Posts loaded successfully!")
            }
        } else if (message.cmd === 'post_home') {
            const postElement = createPostElement(message.post);
            messagesContainer.insertBefore(postElement, messagesContainer.firstChild);
        } else {
            const messageElement = document.createElement('div');
            messageElement.innerText = `Received: ${message.cmd} - ${JSON.stringify(message)}`;
            messagesContainer.appendChild(messageElement);
        }
    };

    ws.onclose = () => {
        console.log('Disconnected from the WebSocket server');
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    document.getElementById('sendButton').addEventListener('click', () => {
        const input = document.getElementById('messageInput');
        if (input.value.trim()) {
            sendMessage();
        }
    });
    document.getElementById('loadMoreButton').addEventListener('click', () => {
        ws.send(JSON.stringify({ cmd: 'fetch', offset: postsLoaded }));
    });
    document.getElementById('messageInput').addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (this.value.trim()) {
                sendMessage();
            }
        }
    });
    document.getElementById('messageInput').addEventListener('input', function () {
        this.style.height = 'auto';
        const newHeight = Math.min(this.scrollHeight, 150);
        this.style.height = newHeight + 'px';
        const sendButton = document.getElementById('sendButton');
        sendButton.style.height = newHeight + 'px';
    });
}

function fetchIndividualPost(postReply, callback) {
    const tempWs = new WebSocket(wsUrl);
    tempWs.onopen = () => {
        tempWs.send(JSON.stringify({ cmd: 'fetchInd', id: postReply }));
    };

    tempWs.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.cmd === 'fetchInd') {
            callback(response.post[0]);
            tempWs.close();
        }
    };

    tempWs.onerror = (error) => {
        console.error('WebSocket error:', error);
        tempWs.close();
    };
}

function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    console.log(post)
    const postData = JSON.parse(post.e);
    const timestamp = new Date(postData.t);
    const formattedText = post.p.replace(/\n/g, '<br>');
    const postId = post._id;
    const postReply = post.reply_to;

    // Initial post content without reply-pill
    postElement.innerHTML = `
        <div class="reply-container"></div>
        <div class="post-inner">
            <div class="avatar"></div>
            <div class="post-content">
                <div class="post-header" style="position: relative;">
                    <div class="header-left" style="display: flex; flex-direction: row;">
                        <span class="post-username">${post.u}</span>
                    </div>
                    <span class="post-timestamp">${timestamp.toLocaleString()}</span>
                    <img src="assets/reply.svg" class="reply-button" style="position: absolute; top: 0; right: 0; width: 24px; height: 24px; cursor: pointer;" onclick='handleReplyClick(${jsString(postId)}, ${jsString(formattedText)}, ${jsString(post.u)})' />
                </div>
                <div class="post-text">${formattedText}</div>
                <div class="id">${postId}</div>
            </div>
        </div>
    `;

    // Fetch and add reply-pill if postReply exists
    if (postReply) {
        fetchIndividualPost(postReply, (replyPost) => {
            const replyPill = document.createElement('div');
            replyPill.classList.add('reply-pill');
            replyPill.innerHTML = `
                <span class="reply-username">${replyPost.u}</span>
                <span class="reply-content">${replyPost.p}</span>
                <span class="reply-id" style="margin-top: 3px;">${replyPost._id}</span>
            `;
            const replyContainer = postElement.querySelector('.reply-container');
            replyContainer.appendChild(replyPill);
        });
    }
    if (document.visibilityState === "hidden") {
        document.title = "(!) maelink";
    }
    return postElement;
}

function handleReplyClick(postId, content, username) {
    const replyPill = document.createElement('div');
    replyPill.classList.add('reply-pill');
    replyPill.innerHTML = `
        <span class="reply-username">${username}</span>
        <span class="reply-content">${content}</span>
        <span class="reply-id">${postId}</span>
    `;
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.insertBefore(replyPill, messageContainer.firstChild);
    console.log(`Reply to post ID: ${postId}, Username: ${username}`);
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    const token = localStorage.getItem('token');
    const replyPill = document.querySelector('.reply-pill');
    let replyTo = null;

    if (replyPill && replyPill.children.length > 0) {
        replyTo = replyPill.querySelector('.reply-id').innerText;
        replyPill.remove();
    }

    if (!token) {
        showToast('You must be logged in to send messages');
        return;
    }

    if (!message) {
        showToast('Message cannot be empty');
        return;
    }

    ws.send(JSON.stringify({ cmd: 'post', p: message, token, reply_to: replyTo }));
    input.value = '';
    input.style.height = 'auto';
}
