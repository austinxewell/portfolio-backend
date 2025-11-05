USE portfolio;

-- Insert canonical images
INSERT INTO images (img_name, img_url)
VALUES
-- Simple Chat Images
('Empty Chat Screen', 'https://i.postimg.cc/SsTp9WSp/simple-Chat-empty.png'),
('Pre-send UI State', 'https://i.postimg.cc/W47V2Bxz/simple-Chat-pre-sent.png'),
('Message Sent UI', 'https://i.postimg.cc/wBzHYqfn/simple-Chat-sent-message.png'),
('2-Way Communication', 'https://i.postimg.cc/Wzdcwhzq/simple-Chat-2-way-communication.png'),
('Multiple Messages', 'https://i.postimg.cc/RFVBqPzR/simple-Chat-multiple-messages.png'),
('Socket Connection Log', 'https://i.postimg.cc/3xm7q4Bg/simple-Chat-socket-connection.png'),
-- Pulse Project Management Images
('Landing Page', 'https://i.postimg.cc/Gp5JydPy/pulse-landing.png'),
('Landing Page - Light Mode', 'https://i.postimg.cc/g2qSJdMv/pulse-landing-light-mode.png'),
('Login', 'https://i.postimg.cc/bvTph7cJ/pulse-login.png'),
('Login - Light Mode', 'https://i.postimg.cc/ThvKBjGX/pulse-login-light-mode.png'),
('Projects', 'https://i.postimg.cc/vTRr0hN8/pulse-projects.png'),
('Project', 'https://i.postimg.cc/GhDgWvGg/Project.png'),
('Tasks', 'https://i.postimg.cc/TPdk5SSB/Tasks.png'),
('Task', 'https://i.postimg.cc/ry3YZf0t/Task.png'),
('Create New Task Form', 'https://i.postimg.cc/gjHXhM1B/pulse-task-creating.png'),
('Create New Task Form - Error State', 'https://i.postimg.cc/zvrHVm2g/pulse-task-creating-error.png'),
('Create New Project Form', 'https://i.postimg.cc/9MTqmXb2/pulse-project-creation.png'),
('Toasts', 'https://i.postimg.cc/pVp6BwTH/Toast.png')
ON DUPLICATE KEY UPDATE img_url = VALUES(img_url);
