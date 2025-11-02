USE portfolio;

INSERT INTO skills (name, level, category)
VALUES
('JavaScript', 'expert', 'language'),
('Vue/Nuxt', 'advanced', 'frontend'),
('Node.js', 'intermediate', 'backend'),
('Express', 'intermediate', 'backend'),
('TailwindCSS', 'advanced', 'frontend')
ON DUPLICATE KEY UPDATE name = VALUES(name);
