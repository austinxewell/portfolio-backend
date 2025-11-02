-- seed.sql
USE portfolio;

INSERT INTO about (
    id,
    name,
    title,
    specialty,
    contact_email,
    linkedin_url,
    github_url,
    resume_url
)
VALUES (
    1,
    'Austin Ewell',
    'Full Stack Web Developer',
    'Front-End Specialist',
    'austin.ewell86@gmail.com',
    'https://www.linkedin.com/in/austin-ewell-01a60313a/',
    'https://github.com/austinxewell',
    'https://docs.google.com/document/d/1cu6hZPHk1PHfz0GArEs7qk5DN2fKxlggOiJoiApVy0Y/edit?usp=sharing'
)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    title = VALUES(title),
    specialty = VALUES(specialty),
    contact_email = VALUES(contact_email),
    linkedin_url = VALUES(linkedin_url),
    github_url = VALUES(github_url),
    resume_url = VALUES(resume_url);

INSERT INTO projects (title, description, tech_stack, image_url, live_url, github_url)
VALUES
('Portfolio Website', 'Built with Nuxt3 and Tailwind', JSON_ARRAY('Nuxt3','TailwindCSS','Node'), NULL, 'https://yourdomain.com', 'https://github.com/you/portfolio'),
('Planning Poker App', 'Estimation tool for teams', JSON_ARRAY('Vue3','Express','Socket.io'), NULL, null, 'https://github.com/you/planning-poker');

INSERT INTO skills (name, level, category) VALUES
('JavaScript', 'expert', 'language'),
('Vue/Nuxt', 'advanced', 'frontend'),
('Node.js', 'intermediate', 'backend');