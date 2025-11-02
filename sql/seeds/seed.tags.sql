USE portfolio;

-- Insert all tech tags
INSERT IGNORE INTO tech_tags (tag_name) VALUES
('Node'),
('Express'),
('Socket.IO'),
('WebSockets'),
('JavaScript'),
('Nodemon'),
('HTML'),
('CSS');

-- Link tags to the Simple Chat project
-- First, get the project ID
SET @project_id = (SELECT id FROM projects WHERE slug = 'simple-chat');

-- Link tags with is_primary flag
INSERT INTO project_tech_tags (project_id, tag_id, is_primary)
SELECT
    @project_id,
    id,
    CASE WHEN tag_name IN ('Node', 'WebSockets', 'JavaScript') THEN TRUE ELSE FALSE END
FROM tech_tags
WHERE tag_name IN ('Node', 'Express', 'Socket.IO', 'WebSockets', 'JavaScript', 'Nodemon', 'HTML', 'CSS')
ON DUPLICATE KEY UPDATE
    is_primary = VALUES(is_primary);
