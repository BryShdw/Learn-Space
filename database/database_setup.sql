-- Create database if it doesn't exist (optional, depends on your setup)
-- CREATE DATABASE IF NOT EXISTS learn_space_db;
-- USE learn_space_db;

-- Roles Table
CREATE TABLE IF NOT EXISTS `roles` (
  `id_role` INT AUTO_INCREMENT PRIMARY KEY,
  `role_name` VARCHAR(50) NOT NULL UNIQUE
);

-- Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id_user` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `birth_date` DATE NOT NULL,
  `id_role` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_role`) REFERENCES `roles`(`id_role`) ON DELETE SET NULL
);

-- Schools Table (as it seems to be used in existing code)
CREATE TABLE IF NOT EXISTS `schools` (
  `id_school` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT
);

-- Courses Table
CREATE TABLE IF NOT EXISTS `courses` (
  `id_course` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `id_school` INT,
  `id_instructor` INT, -- Can be NULL if not assigned or assigned later
  `image_url` VARCHAR(2048),
  `level` VARCHAR(50) COMMENT 'e.g., beginner, intermediate, advanced',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_school`) REFERENCES `schools`(`id_school`) ON DELETE SET NULL,
  FOREIGN KEY (`id_instructor`) REFERENCES `users`(`id_user`) ON DELETE SET NULL -- Instructor must be a user
);

-- Course Modules Table
CREATE TABLE IF NOT EXISTS `course_modules` (
  `id_course_module` INT AUTO_INCREMENT PRIMARY KEY,
  `course_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `module_order` INT NOT NULL DEFAULT 0 COMMENT 'Order of the module within the course',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id_course`) ON DELETE CASCADE -- If course is deleted, its modules are deleted
);

-- Lessons Table
CREATE TABLE IF NOT EXISTS `lessons` (
  `id_lesson` INT AUTO_INCREMENT PRIMARY KEY,
  `module_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content_type` VARCHAR(50) COMMENT 'e.g., video, text, quiz, assignment',
  `content_url` TEXT COMMENT 'URL for video, path to resource, or rich text content',
  `estimated_duration_minutes` INT COMMENT 'Estimated time to complete in minutes',
  `lesson_order` INT NOT NULL DEFAULT 0 COMMENT 'Order of the lesson within the module',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`module_id`) REFERENCES `course_modules`(`id_course_module`) ON DELETE CASCADE -- If module is deleted, its lessons are deleted
);

-- Enrollments Table
CREATE TABLE IF NOT EXISTS `enrollments` (
  `id_enrollment` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `enrolled_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(50) DEFAULT 'active' COMMENT 'e.g., active, completed, cancelled',
  `completed_at` TIMESTAMP NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id_course`) ON DELETE CASCADE,
  UNIQUE KEY `user_course_unique` (`user_id`, `course_id`) -- A user can enroll in a course only once
);

-- User Progress Table
CREATE TABLE IF NOT EXISTS `user_progress` (
  `id_user_progress` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `lesson_id` INT NOT NULL,
  `enrollment_id` INT NOT NULL COMMENT 'To link progress to a specific enrollment instance',
  `status` VARCHAR(50) DEFAULT 'not_started' COMMENT 'e.g., not_started, in_progress, completed',
  `completed_at` TIMESTAMP NULL,
  `last_accessed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE CASCADE,
  FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id_lesson`) ON DELETE CASCADE,
  FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments`(`id_enrollment`) ON DELETE CASCADE,
  UNIQUE KEY `user_lesson_enrollment_unique` (`user_id`, `lesson_id`, `enrollment_id`)
);

-- Seed Data --

-- Roles
INSERT INTO `roles` (`role_name`) VALUES
('student'),
('instructor'),
('admin')
ON DUPLICATE KEY UPDATE role_name=role_name; -- Do nothing if exists

-- Sample Users (Passwords are 'password123' hashed with bcrypt, cost 8. Replace with your actual hashes in production)
-- For testing, a known plain password 'password123' and its hash can be used.
-- Hash for 'password123' with cost 8: $2a$08$Y0LKYpTj06p./yP9xOB8dOhXJj.nB9qj.XyO5XG0XzY5Xk.Z.XyO5 (this is an example, it might vary slightly)
-- User 1: Admin
INSERT INTO `users` (`first_name`, `last_name`, `email`, `password`, `birth_date`, `id_role`) VALUES
('Admin', 'User', 'admin@example.com', '$2a$08$Y0LKYpTj06p./yP9xOB8dOhXJj.nB9qj.XyO5XG0XzY5Xk.Z.XyO5', '1990-01-01', (SELECT id_role FROM roles WHERE role_name='admin'))
ON DUPLICATE KEY UPDATE email=email;

-- User 2: Instructor
INSERT INTO `users` (`first_name`, `last_name`, `email`, `password`, `birth_date`, `id_role`) VALUES
('Instructor', 'Smith', 'instructor@example.com', '$2a$08$Y0LKYpTj06p./yP9xOB8dOhXJj.nB9qj.XyO5XG0XzY5Xk.Z.XyO5', '1985-05-15', (SELECT id_role FROM roles WHERE role_name='instructor'))
ON DUPLICATE KEY UPDATE email=email;

-- User 3: Student
INSERT INTO `users` (`first_name`, `last_name`, `email`, `password`, `birth_date`, `id_role`) VALUES
('Student', 'Doe', 'student@example.com', '$2a$08$Y0LKYpTj06p./yP9xOB8dOhXJj.nB9qj.XyO5XG0XzY5Xk.Z.XyO5', '2000-08-20', (SELECT id_role FROM roles WHERE role_name='student'))
ON DUPLICATE KEY UPDATE email=email;

-- Sample Schools
INSERT INTO `schools` (`name`, `description`) VALUES
('School of Technology', 'Courses related to programming, data science, and IT.'),
('School of Design', 'Courses on graphic design, UI/UX, and multimedia arts.')
ON DUPLICATE KEY UPDATE name=name;

-- Sample Courses
INSERT INTO `courses` (`title`, `description`, `id_school`, `id_instructor`, `image_url`, `level`) VALUES
('Introduction to Web Development', 'Learn the basics of HTML, CSS, and JavaScript.', (SELECT id_school FROM schools WHERE name='School of Technology'), (SELECT id_user FROM users WHERE email='instructor@example.com'), '/resources/assets/img/Portada js.webp', 'beginner'),
('Advanced JavaScript', 'Deep dive into JavaScript concepts and frameworks.', (SELECT id_school FROM schools WHERE name='School of Technology'), (SELECT id_user FROM users WHERE email='instructor@example.com'), '/resources/assets/img/imagen2.jpeg', 'advanced'),
('UI/UX Fundamentals', 'Principles of user interface and user experience design.', (SELECT id_school FROM schools WHERE name='School of Design'), (SELECT id_user FROM users WHERE email='instructor@example.com'), '/resources/assets/img/imagen3.jpeg', 'beginner')
ON DUPLICATE KEY UPDATE title=title;

-- Sample Modules for "Introduction to Web Development"
SET @intro_web_course_id = (SELECT id_course FROM courses WHERE title='Introduction to Web Development');
INSERT INTO `course_modules` (`course_id`, `title`, `description`, `module_order`) VALUES
(@intro_web_course_id, 'Module 1: HTML Basics', 'Learn the structure of web pages.', 1),
(@intro_web_course_id, 'Module 2: CSS Fundamentals', 'Style your web pages.', 2),
(@intro_web_course_id, 'Module 3: JavaScript Essentials', 'Add interactivity to your sites.', 3)
ON DUPLICATE KEY UPDATE title=title;

-- Sample Lessons for "Module 1: HTML Basics"
SET @html_module_id = (SELECT id_course_module FROM course_modules WHERE title='Module 1: HTML Basics' AND course_id=@intro_web_course_id);
INSERT INTO `lessons` (`module_id`, `title`, `content_type`, `content_url`, `estimated_duration_minutes`, `lesson_order`) VALUES
(@html_module_id, 'Introduction to HTML', 'video', 'https://www.example.com/video/html_intro.mp4', 10, 1),
(@html_module_id, 'HTML Tags and Elements', 'text', '/resources/lessons/html_tags.md', 20, 2),
(@html_module_id, 'Creating Forms', 'video', 'https://www.example.com/video/html_forms.mp4', 15, 3)
ON DUPLICATE KEY UPDATE title=title;

-- Sample Lessons for "Module 2: CSS Fundamentals"
SET @css_module_id = (SELECT id_course_module FROM course_modules WHERE title='Module 2: CSS Fundamentals' AND course_id=@intro_web_course_id);
INSERT INTO `lessons` (`module_id`, `title`, `content_type`, `content_url`, `estimated_duration_minutes`, `lesson_order`) VALUES
(@css_module_id, 'Introduction to CSS', 'video', 'https://www.example.com/video/css_intro.mp4', 12, 1),
(@css_module_id, 'Selectors and Properties', 'text', '/resources/lessons/css_selectors.md', 25, 2)
ON DUPLICATE KEY UPDATE title=title;

-- Sample Enrollment
SET @student_id = (SELECT id_user FROM users WHERE email='student@example.com');
INSERT INTO `enrollments` (`user_id`, `course_id`, `status`) VALUES
(@student_id, @intro_web_course_id, 'active')
ON DUPLICATE KEY UPDATE user_id=user_id; -- Do nothing if enrollment exists

-- Sample User Progress (Student Doe on first lesson of HTML module)
SET @enrollment_id_val = (SELECT id_enrollment FROM enrollments WHERE user_id=@student_id AND course_id=@intro_web_course_id);
SET @lesson1_html_id_val = (SELECT id_lesson FROM lessons WHERE title='Introduction to HTML' AND module_id=@html_module_id);

INSERT INTO `user_progress` (`user_id`, `lesson_id`, `enrollment_id`, `status`) VALUES
(@student_id, @lesson1_html_id_val, @enrollment_id_val, 'in_progress')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- Note: The password hashes for seed users are placeholders.
-- You should generate secure bcrypt hashes for any actual seed users.
-- The registration logic in `authController.js` uses `await bcryptjs.hash(password, 8);`
-- The example hash '$2a$08$Y0LKYpTj06p./yP9xOB8dOhXJj.nB9qj.XyO5XG0XzY5Xk.Z.XyO5' is for 'password123' with cost 8.
```
