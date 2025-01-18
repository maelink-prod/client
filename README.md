# Simple Client for Maelink

This project is a simple client for connecting to the Maelink server. It utilizes WebSocket for real-time communication and provides a basic interface for sending and receiving messages.

## Project Structure

- `index.html`: The main HTML document that sets up the structure of the web page.
- `css/styles.css`: Contains styles for the HTML elements, defining layout, colors, and fonts.
- `js/main.js`: Handles the WebSocket connection, manages sending and receiving messages, and updates the HTML accordingly.

## Getting Started

1. **Clone the Repository**: 
   ```bash
   git clone <repository-url>
   cd simple-client
   ```

2. **Open `index.html`**: 
   Open the `index.html` file in your web browser. This will automatically connect to the WebSocket server.

3. **WebSocket Connection**: 
   By default, the client connects to:
   - WebSocket: `wss://maelink-ws.derpygamer2142.com`
   - HTTP: `https://maelink-http.derpygamer2142.com`

4. **Usage**: 
   - Once connected, you can send messages through the interface.
   - Messages received from the server will be displayed in the designated area.