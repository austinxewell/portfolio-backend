USE portfolio;

-- Insert Simple Chat project
INSERT INTO projects (project_name, slug, overview, description, live_url, github_url, is_favorite)
VALUES (
    'Simple Chat',
    'simple-chat',
    'A real-time messaging app using WebSockets for two-way communication.',
    '<p><strong>Simple Chat</strong> is a lightweight, real-time messaging application built using <strong>Node.js</strong>, <strong>Express</strong>, and <strong>Socket.IO</strong>. It facilitates instant communication between multiple users connected to the same server instance via WebSockets. This project demonstrates how to build a performant, minimal chat server with live bidirectional messaging capability.</p><br /><p>Upon connection, users are able to send and receive messages in real time without any page refreshes or polling. The architecture uses Socket.IO on both the client and server side to maintain persistent WebSocket connections for efficient data exchange. Express serves the static frontend, while all WebSocket handling is abstracted through event-based communication in <code>index.js</code>.</p><br /><p><strong>Key Features:</strong></p><ul><li>- Real-time two-way communication between users using WebSockets</li><li>- Supports multiple simultaneous connections</li><li>- Efficient Socket.IO-based architecture</li><li>- Simple and clean UI for demonstration purposes</li><li>- Nodemon integration for rapid development and live reload</li><li>- Event-based message broadcasting on both send and receive</li><li>- Minimal dependencies: Express and Socket.IO</li></ul><br /><p>This project is a strong demonstration of real-time systems fundamentals and WebSocket protocol implementation, ideal for devs learning about server-client communication beyond HTTP.</p>',
    '',
    'https://github.com/austinxewell/simpleChat',
    FALSE
)
ON DUPLICATE KEY UPDATE
    project_name = VALUES(project_name),
    overview = VALUES(overview),
    description = VALUES(description),
    live_url = VALUES(live_url),
    github_url = VALUES(github_url),
    is_favorite = VALUES(is_favorite);

-- Optionally add more projects in the same format
-- Example:
-- INSERT INTO projects (project_name, slug, overview, description, live_url, github_url, is_favorite)
-- VALUES ('Planning Poker App', 'planning-poker', 'Estimation tool for teams', '...', '', 'https://github.com/you/planning-poker', FALSE)
-- ON DUPLICATE KEY UPDATE ...