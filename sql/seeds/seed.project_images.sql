USE portfolio;

-- Simple Chat
SET @project_id = (SELECT id FROM projects WHERE slug = 'simple-chat');

INSERT INTO project_images (project_id, image_id, is_thumbnail)
VALUES
(@project_id, 1, FALSE),
(@project_id, 2, FALSE),
(@project_id, 3, FALSE),
(@project_id, 4, TRUE),
(@project_id, 5, FALSE),
(@project_id, 6, FALSE)
ON DUPLICATE KEY UPDATE is_thumbnail = VALUES(is_thumbnail);

-- Pulse Project Management
SET @project_id = (SELECT id FROM projects WHERE slug = 'pulse-project-management');

INSERT INTO project_images (project_id, image_id, is_thumbnail)
VALUES
(@project_id, 7, TRUE),
(@project_id, 8, FALSE),
(@project_id, 9, FALSE),
(@project_id, 10, FALSE),
(@project_id, 11, FALSE),
(@project_id, 12, FALSE),
(@project_id, 13, FALSE),
(@project_id, 14, FALSE),
(@project_id, 15, FALSE),
(@project_id, 16, FALSE),
(@project_id, 17, FALSE),
(@project_id, 18, FALSE)
ON DUPLICATE KEY UPDATE is_thumbnail = VALUES(is_thumbnail);

