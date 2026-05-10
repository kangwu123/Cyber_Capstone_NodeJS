-- Create Database
CREATE DATABASE Job_MarketPlace;
USE Job_MarketPlace;

-- 1. Job Categories
CREATE TABLE JobCategories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(255) NOT NULL
);
-- 2. Job Subcategories
CREATE TABLE JobSubCategories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sub_category_name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES JobCategories(id)
);
-- 3. Users
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    birth_day DATE,
    gender VARCHAR(10),
    role VARCHAR(50) NOT NULL, -- Admin, Client, Freelancer
    skill TEXT,
    certification TEXT,
    refresh_token VARCHAR(255),
    lastLoginAt DATETIME,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP 
);
ALTER TABLE `Users` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `Users` ADD COLUMN `avatar` VARCHAR(255);

-- 4. Jobs
CREATE TABLE Jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_name VARCHAR(255) NOT NULL,
    rating INT DEFAULT 0,
    price INT NOT NULL,
    image VARCHAR(255),
    description TEXT,
    short_description VARCHAR(500),
    job_stars INT DEFAULT 0,
    sub_category_id INT,
    creator_id INT,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (sub_category_id) REFERENCES JobSubCategories(id),
    FOREIGN KEY (creator_id) REFERENCES Users(id)
);

-- 5. Hired Jobs (ThueCongViec)
CREATE TABLE HiredJobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT,
    hirer_id INT,
    hire_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_completed BOOLEAN DEFAULT FALSE,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (job_id) REFERENCES Jobs(id),
    FOREIGN KEY (hirer_id) REFERENCES Users(id)
);

-- 6. Comments
CREATE TABLE Comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT,
    user_id INT,
    comment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    content TEXT,
    rating_stars INT,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (job_id) REFERENCES Jobs(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- INSERT DEMO DATA
INSERT INTO JobCategories (category_name) VALUES
('Graphics & Design'),
('Digital Marketing'),
('Writing & Translation'),
('Video & Animation'),
('Music & Audio');

INSERT INTO JobSubCategories (sub_category_name, category_id) VALUES
('Logo Design', 1),
('Social Media Marketing', 2),
('Blog Posts', 3),
('Animated Explainer Videos', 4),
('Voice Over', 5);

INSERT INTO Users (name, email, password, phone, birth_day, gender, role, skill) VALUES
('Admin User', 'admin@example.com', 'adminpass', '1234567890', '1990-01-01', 'Male', 'Admin', 'Management'),
('Client User 1', 'client1@example.com', 'clientpass1', '1112223333', '1985-05-10', 'Female', 'Client', NULL),
('Freelancer User 1', 'freelancer1@example.com', 'freelancerpass1', '4445556666', '1992-08-15', 'Male', 'Freelancer', 'Graphic Design, Photoshop'),
('Client User 2', 'client2@example.com', 'clientpass2', '7778889999', '1995-02-20', 'Female', 'Client', NULL),
('Freelancer User 2', 'freelancer2@example.com', 'freelancerpass2', '0001112222', '1988-11-30', 'Male', 'Freelancer', 'SEO, Content Writing');

-- Jobs
INSERT INTO Jobs (job_name, price, description, short_description, sub_category_id, creator_id) VALUES
('Custom Logo Design for Your Brand', 50, 'I will create a unique and professional logo for your business.', 'Professional logo design.', 1, 3),
('Manage Your Social Media Presence', 150, 'Full-service social media management to grow your audience.', 'Social media management.', 2, 5),
('Engaging Blog Post Writing', 75, 'High-quality blog posts on any topic, SEO optimized.', 'SEO blog posts.', 3, 5),
('Create a 2D Animated Explainer Video', 300, 'Bring your ideas to life with a custom animated video.', '2D animated explainer.', 4, 3),
('Professional American Male Voice Over', 100, 'I will record a high-quality voice over for your project.', 'Male voice over.', 5, 3);

-- Hired Jobs
INSERT INTO HiredJobs (job_id, hirer_id, is_completed) VALUES
(1, 2, TRUE),
(2, 4, FALSE),
(3, 2, TRUE),
(4, 4, FALSE),
(5, 2, TRUE);

-- Comments
INSERT INTO Comments (job_id, user_id, content, rating_stars) VALUES
(1, 2, 'Amazing work! The logo was exactly what I wanted.', 5),
(2, 4, 'Still waiting for the first report.', 3),
(3, 2, 'Great writer, delivered on time.', 4),
(4, 4, 'The animation is good, but it took longer than expected.', 4),
(5, 2, 'Clear and professional voice. Highly recommend.', 5);
