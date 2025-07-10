# Learn Space - Course Web Platform

Learn Space is a web platform for online courses, built with Node.js, Express, EJS for templating, and MySQL. This project is a refactored and improved version of an older course platform.

## Features (Post-Refactor)

*   **Modern User Interface**: Clean, responsive design for a better user experience.
*   **Modular Backend**: Organized Node.js and Express codebase following best practices.
*   **Improved Security**: Basic input validation and protected routes.
*   **Structured Database**: Comprehensive MySQL schema for users, courses, modules, lessons, and progress.
*   **User Authentication**: Secure login and registration.
*   **Course Catalog**: Browse and view course details.
*   **Lesson Navigation**: Access course modules and lessons.
*   **(Planned/Future)**: Role management (student, instructor, admin), advanced progress tracking, user profiles, etc.

## Project Structure

```
.
├── config/
│   └── database.js         # Database connection configuration
├── controllers/            # Handles request logic
│   ├── authController.js
│   ├── courseController.js
│   └── pageController.js
├── database/
│   └── database_setup.sql  # SQL script for database schema and seed data
├── env/
│   └── .env.example        # Environment variable template
├── middlewares/
│   ├── authMiddleware.js   # Authentication and authorization
│   └── validators.js       # Input validation rules
├── models/                 # (Planned) Database models/abstractions
├── public/                 # Static assets
│   ├── css/
│   │   ├── main.css
│   │   └── index-specific.css
│   │   └── ... (other page-specific CSS)
│   ├── assets/
│   │   └── img/            # Images
│   └── js/
│       ├── main.js
│       └── ... (other page-specific JS)
├── routes/                 # Route definitions
│   ├── auth.js
│   └── index.js
├── services/               # (Planned) Business logic services
├── views/                  # EJS templates
│   ├── partials/           # Reusable EJS partials (header, footer)
│   ├── index.ejs
│   ├── login.ejs
│   └── ... (other pages)
├── .gitignore
├── app.js                  # Main Express application setup
├── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

*   Node.js (v14 or later recommended)
*   npm (usually comes with Node.js)
*   MySQL Server

### 1. Clone the Repository

```bash
git clone <repository_url>
cd <project_directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

*   Create a `.env` file in the `env/` directory by copying `env/.env.example` (if it exists, otherwise create it manually).
*   Update the `.env` file with your MySQL database credentials and other settings:

    ```ini
    DB_HOST=localhost
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_DATABASE=learn_space_db
    SESSION_SECRET=a_strong_session_secret_key
    ```

    *Note: The current `config/database.js` directly uses environment variables as defined in the original project. Ensure these match your MySQL setup.*

### 4. Setup Database

*   Make sure your MySQL server is running.
*   Connect to your MySQL server using a client (e.g., MySQL Workbench, `mysql` command line).
*   Create the database if it doesn't exist:
    ```sql
    CREATE DATABASE IF NOT EXISTS learn_space_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    ```
*   Select the database:
    ```sql
    USE learn_space_db;
    ```
*   Run the `database/database_setup.sql` script to create tables and seed initial data. You can do this by:
    *   Pasting the content of the SQL file into your MySQL client.
    *   Or using the command line:
        ```bash
        mysql -u your_mysql_user -p learn_space_db < database/database_setup.sql
        ```
        (Enter your password when prompted)

### 5. Run the Application

```bash
npm start
```
Or, if you have `nodemon` installed (it's in `dependencies`):
```bash
nodemon app.js
```
The server should start, typically on `http://localhost:3000`.

## Summary of Changes Made

This project underwent a significant refactoring and improvement process:

### Backend
*   **Restructured Architecture**: Codebase organized into `controllers`, `routes`, `middlewares`, `config`. `services` and `models` folders are placeholders for future expansion.
*   **Modular Routes**: Express routes are now modular, separating authentication and general page routes.
*   **Controllers**: Logic moved from `app.js` and route files into dedicated controllers.
*   **Security Enhancements**:
    *   Implemented basic input validation for registration and login using `express-validator`.
    *   Added `isAuthenticated` middleware to protect routes.
    *   Login now redirects to originally intended page.
*   **Database Connection**: Centralized database connection in `config/database.js`.

### Database
*   **New Schema Design**: A comprehensive SQL schema was designed covering users, roles, courses, modules, lessons, enrollments, and user progress.
*   **Setup Script**: `database/database_setup.sql` created to initialize the entire database schema and populate it with seed data (including roles, sample users, courses, etc.).

### Frontend
*   **Code Cleaning**: Removed redundant static HTML files from `public/assets/html/` as EJS templates are used.
*   **Partials**: Created reusable EJS partials for `header` and `footer` to ensure consistency and easier maintenance.
*   **Modern Design & Responsiveness (Foundation)**:
    *   A global `public/css/main.css` was established with a CSS reset, base styles, typography, and responsive layouts for header (including mobile navigation) and footer.
    *   `public/js/main.js` added for global JavaScript interactions like mobile menu toggle and active navigation link highlighting.
    *   The main landing page (`views/index.ejs`) was significantly redesigned with a modern structure (hero section, featured courses, etc.) and corresponding specific CSS (`public/css/index-specific.css`).
*   **Improved Structure**: EJS views are now structured to include the common header and footer.

### General
*   **Documentation**: This `README.md` created to provide setup instructions and an overview.
*   **.gitignore**: Added a comprehensive `.gitignore` file for Node.js projects.

## Future Improvements
*   Complete the UI refactor for all remaining pages.
*   Implement service and model layers in the backend for better separation of concerns.
*   Enhance security (CSRF protection, XSS prevention, rate limiting).
*   Add more robust error handling.
*   Develop features like user profile editing, course creation (for instructors), admin dashboard, quizzes, etc.
*   Write unit and integration tests.

```
