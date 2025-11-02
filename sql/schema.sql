-- schema.sql
CREATE DATABASE IF NOT EXISTS portfolio;
USE portfolio;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT NOT NULL,
    image_url VARCHAR(1024),
    live_url VARCHAR(1024),
    github_url VARCHAR(1024),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- About table
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
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level VARCHAR(50),
    category VARCHAR(100)
);