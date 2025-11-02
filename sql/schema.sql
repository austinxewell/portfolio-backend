-- Drop the entire database
DROP DATABASE IF EXISTS portfolio;

-- Recreate the database
CREATE DATABASE portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio;

-- ABOUT TABLE (single-row)
CREATE TABLE IF NOT EXISTS about (
    id INT PRIMARY KEY DEFAULT 1,
    name VARCHAR(255),
    title VARCHAR(255),
    specialty VARCHAR(255),
    contact_email VARCHAR(255),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    resume_url VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    overview TEXT,
    description LONGTEXT,
    live_url VARCHAR(500),
    github_url VARCHAR(500),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TECH TAGS TABLE
CREATE TABLE IF NOT EXISTS tech_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- PROJECT <-> TECH TAGS JOIN TABLE
CREATE TABLE IF NOT EXISTS project_tech_tags (
    project_id INT NOT NULL,
    tag_id INT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (project_id, tag_id),
    INDEX (tag_id),
    CONSTRAINT fk_ptt_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_ptt_tag FOREIGN KEY (tag_id) REFERENCES tech_tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- IMAGES TABLE (generic image store)
CREATE TABLE IF NOT EXISTS images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    img_name VARCHAR(255),
    img_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- PROJECT <-> IMAGES LINK TABLE (stores is_thumbnail)
CREATE TABLE IF NOT EXISTS project_images (
    project_id INT NOT NULL,
    image_id INT NOT NULL,
    is_thumbnail BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (project_id, image_id),
    INDEX (image_id),
    CONSTRAINT fk_pi_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_pi_image FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SKILLS TABLE
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    level VARCHAR(50),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
