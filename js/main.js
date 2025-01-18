const wsUrl = 'wss://maelink-ws.derpygamer2142.com';
import { hashPassword, comparePasswords } from './bcrypt.js';

// Cookie helper functions
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/; Secure; SameSite=Strict";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
const httpUrl = 'https://maelink-http.derpygamer2142.com';
let ws;
let postsLoaded = 0;
var animationComplete = false;
document.addEventListener('DOMContentLoaded', () => {
    const storedUsername = getCookie('username');
    const storedPassword = getCookie('hashedPassword');
    if (storedUsername && storedPassword) {
        login(storedUsername, storedPassword);
    }
});

document.getElementById('loginModal').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        login(username, password);
    } else {
        showModal('Please enter both username and password');
    }
});

async function login(username, password) {
    const hashedPassword = await hashPassword(password);
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
                setCookie('username', username, 7);
                setCookie('hashedPassword', hashedPassword, 7);
                setCookie('token', data.token, 7);
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

    document.getElementById('sendButton').addEventListener('click', sendMessage);
    document.getElementById('loadMoreButton').addEventListener('click', () => {
        ws.send(JSON.stringify({ cmd: 'fetch', offset: postsLoaded }));
    });
}

function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    const postData = JSON.parse(post.e);
    const timestamp = new Date(postData.t);
    postElement.innerHTML = `
        <div class="avatar"></div>
        <div class="post-content">
            <div class="post-header">
                <span class="post-username">${post.u}</span>
                <span class="post-timestamp">${timestamp.toLocaleString()}</span>
            </div>
            <div class="post-text">${post.p}</div>
        </div>
    `;
    return postElement;
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value;
    const token = getCookie('token');

    if (message == "") {
        showToast('Message cannot be empty');
    } else {
        if (message && token) {
            ws.send(JSON.stringify({ cmd: 'post', p: message, token }));
            input.value = '';
        } else {
            showToast('You must be logged in to send messages');
        }
    }
}