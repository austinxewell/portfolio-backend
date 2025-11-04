USE portfolio;

-- Simple Chat
SET @project_id = (SELECT id FROM projects WHERE slug = 'simple-chat');

INSERT INTO project_tech_tags (project_id, tag_id, is_primary)
VALUES
(@project_id, 1, TRUE),   -- Node
(@project_id, 2, FALSE),  -- Express
(@project_id, 3, FALSE),  -- Socket.IO
(@project_id, 4, TRUE),   -- WebSockets
(@project_id, 5, TRUE),   -- JavaScript
(@project_id, 6, FALSE),  -- Nodemon
(@project_id, 7, FALSE),  -- HTML
(@project_id, 8, FALSE)   -- CSS
ON DUPLICATE KEY UPDATE is_primary = VALUES(is_primary);

-- Pulse Project Management
SET @project_id = (SELECT id FROM projects WHERE slug = 'pulse-project-management');
INSERT INTO project_tech_tags (project_id, tag_id, is_primary)
VALUES
(@project_id, 9, TRUE),   -- TypeScript
(@project_id, 10, TRUE),  -- Nuxt3
(@project_id, 11, TRUE),  -- Tailwind
(@project_id, 12, FALSE),   -- Supabase
(@project_id, 13, FALSE),   -- Pinia
(@project_id, 14, FALSE),  -- Vite
(@project_id, 15, FALSE),  -- FormKit
(@project_id, 16, FALSE),   -- TanStack
(@project_id, 17, FALSE),   -- Iconify
(@project_id, 18, FALSE),   -- RekaUI
(@project_id, 19, FALSE),   -- SweetAlert2
(@project_id, 20, FALSE),   -- FakerJS
(@project_id, 21, FALSE),   -- ESLint
(@project_id, 22, FALSE)   -- Prettier
ON DUPLICATE KEY UPDATE is_primary = VALUES(is_primary);