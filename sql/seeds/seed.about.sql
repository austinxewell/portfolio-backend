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

