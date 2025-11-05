USE portfolio;

INSERT INTO collaborations (company_name)
VALUES
    ('Balance of Nature'),
    ('Crysta Diane Photography'),
    ('Delta Health Coaching'),
    ('Stark Systems'),
    ('United We Pledge'),
    ('Evig LLC'),
    ('Ship It'),
    ('Synthesis Concrete'),
    ('Premium Productions LLC'),
    ('Action Store')
ON DUPLICATE KEY UPDATE
    company_name = VALUES(company_name)