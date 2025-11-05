USE portfolio;

-- Insert Simple Chat project
INSERT INTO projects (project_name, slug, overview, description, live_url, github_url, is_favorite)
VALUES 
(
    'Simple Chat',
    'simple-chat',
    'A real-time messaging app using WebSockets for two-way communication.',
    '<p><strong>Simple Chat</strong> is a lightweight, real-time messaging application built using <strong>Node.js</strong>, <strong>Express</strong>, and <strong>Socket.IO</strong>. It facilitates instant communication between multiple users connected to the same server instance via WebSockets. This project demonstrates how to build a performant, minimal chat server with live bidirectional messaging capability.</p><br /><p>Upon connection, users are able to send and receive messages in real time without any page refreshes or polling. The architecture uses Socket.IO on both the client and server side to maintain persistent WebSocket connections for efficient data exchange. Express serves the static frontend, while all WebSocket handling is abstracted through event-based communication in <code>index.js</code>.</p><br /><p><strong>Key Features:</strong></p><ul><li>- Real-time two-way communication between users using WebSockets</li><li>- Supports multiple simultaneous connections</li><li>- Efficient Socket.IO-based architecture</li><li>- Simple and clean UI for demonstration purposes</li><li>- Nodemon integration for rapid development and live reload</li><li>- Event-based message broadcasting on both send and receive</li><li>- Minimal dependencies: Express and Socket.IO</li></ul><br /><p>This project is a strong demonstration of real-time systems fundamentals and WebSocket protocol implementation, ideal for devs learning about server-client communication beyond HTTP.</p>',
    '',
    'https://github.com/austinxewell/simpleChat',
    FALSE
),
(
    'Pulse Project Management',
    'pulse-project-management',
    'A modern project management app to track, organize, and manage workflows.',
    '<p><strong>Pulse Project Management</strong> is a full-featured <strong>project management application</strong> built with a modern frontend stack using <strong>Nuxt 3</strong>, <strong>TypeScript</strong>, and <strong>Tailwind CSS</strong>. The platform was designed to help users manage complex workflows with clarity and speed. It supports <strong>task management</strong>, <strong>project-level dashboards</strong>, <strong>collaborative workspaces</strong>, and <strong>user authentication</strong>.</p><br /><p>On the technical side, Pulse uses <strong>Supabase</strong> as its backend for <strong>authentication</strong>, <strong>database</strong>, and <strong>real-time features</strong>. All forms are built with <strong>FormKit</strong> for rapid scaffolding and custom validation logic. <strong>TanStack Table</strong> powers the tabular data views with full client-side filtering and sorting. <strong>State</strong> is handled via <strong>Pinia</strong>, while <strong>Reka UI</strong> and <strong>Tailwind</strong> are used for consistent design components and utility-first styling. The app is bundled with <strong>Vite</strong> for fast builds and hot module replacement.</p><br /><p>Additional tooling includes <strong>Iconify</strong> for vector icons, <strong>SweetAlert2</strong> for UI alerts and confirmations, and <strong>FakerJS</strong> for generating seed data during development. <strong>Linter and formatting</strong> are enforced with <strong>ESLint</strong> and <strong>Prettier</strong>, ensuring consistent code quality throughout. <strong>Light and dark mode themes</strong> are supported globally.</p><br /><p><strong>Pulse</strong> emphasizes <strong>real-time feedback</strong> and smooth user interaction. It includes features like <strong>toast notifications</strong>, <strong>engaging dialog</strong>, and <strong>loading states</strong>. Forms include <strong>inline validation</strong> and <strong>accessible design practices</strong>. The entire <strong>UI</strong> is responsive and optimized for both <strong>desktop</strong> and <strong>mobile</strong> environments.</p><br /><p><strong>Note:</strong> Account creation has been disabled due to <strong>Supabase</strong> limitations on free-tier projects. To explore the full functionality of the live demo, please use the provided credentials below.</p><br /><p><strong>Live Demo Access</strong><br /><strong>Email:</strong> austin.ewell86@gmail.com<br /><strong>Password:</strong> password</p>',
    'https://pulse-project-managment.netlify.app/',
    'https://github.com/austinxewell/pulse-project-management',
    TRUE
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