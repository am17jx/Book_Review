# Book_API: A Robust API for Managing Books, Comments, and Tags

<p align="center">
  <strong>A powerful and secure API for managing books, users, comments, and tags.</strong>
  <br />
  <br />
  <a href="#✨-key-features"><strong>Explore Features »</strong></a>
  ·
  <a href="#⚙️-api-endpoints"><strong>API Docs »</strong></a>
  ·
  <a href="#🏁-setup-and-installation"><strong>How to Run »</strong></a>
</p>

---

## 🚀 About The Project

This project is a powerful and secure API designed for managing book-related data, including user accounts, books, comments, and tags. Built with **Node.js** and the **Express.js** framework, it leverages a **PostgreSQL** database for robust data storage.

The project emphasizes security and efficient error handling, showcasing modern backend development practices, including:
* A complete authentication system based on **JWT**.
* Secure and encrypted password management using `bcrypt`.
* Role-based access control for users and administrators.
* Advanced error handling with a custom `AppError` class.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🔐 **User Management** | User registration (Sign up), login with JWT token generation, and retrieval of user profile details including book and comment counts. Routes requiring authentication are protected. |
| 📚 **Book Management** | Complete CRUD operations for books (Add, Retrieve, Update, Delete). Update operations are restricted to the book's owner, and delete operations require an `admin` role. |
| 💬 **Comment Management** | Create, retrieve, update, and delete comments for books. Comment updates are owner-restricted, and deletion requires an `admin` role. |
| 🏷️ **Tag Management** | Add and update tags for existing books (owner-only access, validates against predefined tag types). Admins can add new tag types, delete specific tag associations from books, and delete tag types from the system. Users can retrieve all available tag types. |
| 🛡️ **Security Enhancements** | Utilizes `bcrypt` for password hashing, `jsonwebtoken` for JWT authentication, `express-rate-limit` to prevent brute-force attacks, `helmet` for HTTP security headers, and `xss-clean` for input sanitization. |
| 🛠️ **Robust Error Handling** | Employs a custom `AppError` class for standardized error responses and a `catchAsync` utility to wrap asynchronous controller functions, ensuring robust error propagation. |

---

## 💻 Tech Stack

* **Node.js**: JavaScript runtime environment.
* **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
* **PostgreSQL**: Powerful, open-source object-relational database system.
* **PG**: Non-blocking PostgreSQL client for Node.js.
* **jsonwebtoken**: For JSON Web Token implementation.
* **bcryptjs**: For hashing and salting passwords.
* **dotenv**: Loads environment variables from a `.env` file.
* **express-rate-limit**: Basic rate-limiting middleware for Express.
* **helmet**: Helps secure Express apps by setting various HTTP headers.
* **xss-clean**: Middleware to sanitize user input.

---

## 🏁 Setup and Installation

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have the following installed on your machine:

* [Node.js](https://nodejs.org/) (v18+ recommended)
* [PostgreSQL](https://www.postgresql.org/download/)

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone <Your GitHub repository URL>
    cd Book_API
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Database Setup:**
    * Create a PostgreSQL database named `book`.
    * Execute the following SQL queries to set up the necessary tables and the `type_tag` enum.

    **Database Schema Example:**
    ```sql
    -- Create the ENUM for tag types (must be created before the tags table)
    CREATE TYPE type_tag AS ENUM ('fiction', 'non-fiction', 'fantasy', 'science', 'history', 'programming');

    -- Users Table
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user' -- Can be 'user' or 'admin'
    );

    -- Books Table
    CREATE TABLE books (
        id SERIAL PRIMARY KEY,
        book_name VARCHAR(255) NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    );

    -- Comments Table
    CREATE TABLE comments (
        id SERIAL PRIMARY KEY,
        comment_text TEXT NOT NULL,
        book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    );

    -- Tags Table - for available tag types
    CREATE TABLE tags (
        id SERIAL PRIMARY KEY,
        tag type_tag UNIQUE NOT NULL -- Uses the ENUM here
    );

    -- Book-Tag Junction Table
    CREATE TABLE book_tag (
        book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
        tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (book_id, tag_id)
    );

    -- Insert some default tags into the tags table
    INSERT INTO tags (tag) VALUES
    ('fiction'),
    ('non-fiction'),
    ('fantasy'),
    ('science'),
    ('history'),
    ('programming');
    ```
4.  **Create `.env` file:**
    * In the root of your project, create a file named `.env`.
    * Add the following environment variables with your specific values:
        ```
        PORT=3000
        DB_PASSWORD=YOUR_POSTGRES_PASSWORD
        JWT_SECRET=YOUR_VERY_STRONG_JWT_SECRET_KEY
        ```
    * **Crucially:** Add `.env` to your `.gitignore` file to prevent it from being pushed to GitHub.

### Running the Application

To start the server in development mode:
```bash
npm start

## 🚀 Features

| Feature | Description |
| :--- | :--- |
| 🔐 **User Management** | User registration (Sign up), login with JWT token generation, and retrieval of user profile details including book and comment counts. Routes requiring authentication are protected. |
| 📚 **Book Management** | Complete CRUD operations for books (Add, Retrieve, Update, Delete). Update operations are restricted to the book's owner, and delete operations require an `admin` role. |
| 💬 **Comment Management** | Create, retrieve, update, and delete comments for books. Comment updates are owner-restricted, and deletion requires an `admin` role. |
| 🏷️ **Tag Management** | Add and update tags for existing books (owner-only access, validates against predefined tag types). Admins can add new tag types, delete specific tag associations from books, and delete tag types from the system. Users can retrieve all available tag types. |
| 🛡️ **Security Enhancements** | Utilizes `bcrypt` for password hashing, `jsonwebtoken` for JWT authentication, `express-rate-limit` to prevent brute-force attacks, `helmet` for HTTP security headers, and `xss-clean` for input sanitization. |
| 🛠️ **Robust Error Handling** | Employs a custom `AppError` class for standardized error responses and a `catchAsync` utility to wrap asynchronous controller functions, ensuring robust error propagation. |

---

## 👤 User Authentication

| Endpoint | Method | Description | Authentication | Request Body (JSON) | Query Params | Path Params |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `/api/user/signup` | POST | Register a new user. | None | `{ "email": "string", "password": "string" }` | N/A | N/A |
| `/api/user/login` | POST | Log in a user and get a JWT. | None | `{ "email": "string", "password": "string" }` | N/A | N/A |
| `/api/user` | GET | Get user profile details. | Protected | N/A | N/A | N/A |

---

## 📚 Book Management

| Endpoint | Method | Description | Authentication | Request Body (JSON) | Query Params | Path Params |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `/api/books` | POST | Add a new book. Requires `book_name` and an existing `tag` type. | Protected | `{ "book_name": "string", "tag": "string" }` | N/A | N/A |
| `/api/books` | GET | Get all books. Can be filtered by `user_id`. | Protected | N/A | `user_id` | N/A |
| `/api/books/:id` | PATCH | Update a book's name. Only the book's owner can update. | Protected, Book Owner | `{ "book_name": "string" }` | N/A | `id` |
| `/api/books/:id` | DELETE | Delete a book. Requires `admin` role. | Protected, Admin Role | N/A | N/A | `id` |

---

## 💬 Comment Management

| Endpoint | Method | Description | Authentication | Request Body (JSON) | Query Params | Path Params |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `/api/comment` | POST | Create a new comment for a book. | Protected | `{ "comment_text": "string" }` | `book_id` | N/A |
| `/api/comment` | GET | Get all comments. | Protected | N/A | N/A | N/A |
| `/api/comment/:id` | PATCH | Update a comment. Only the comment's owner can update. | Protected, Comment Owner | `{ "comment_text": "string" }` | N/A | `id` |
| `/api/comment/:id` | DELETE | Delete a comment. Requires `admin` role. | Protected, Admin Role | N/A | N/A | `id` |

---

## 🏷️ Tag Management

| Endpoint | Method | Description | Authentication | Request Body (JSON) | Query Params | Path Params |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| `/api/tag` | GET | Get all available tag types. | Protected | N/A | N/A | N/A |
| `/api/tag/:book_id` | POST | Add an existing tag to a book. Only the book's owner can add tags. | Protected, Book Owner | `{ "tag": "string" }` | N/A | `book_id` |
| `/api/tag` | POST | Add a new tag type. Requires `admin` role. | Protected, Admin Role | `{ "tag": "string" }` | N/A | N/A |
| `/api/tag/:book_id/:tag_Id` | PATCH | Update a tag associated with a book. Only the book's owner can update. | Protected, Book Owner | `{ "tag": "string" }` | N/A | `book_id`, `tag_Id` |
| `/api/tag/:bookId/:tagId` | DELETE | Delete a tag association from a book. Requires `admin` role. | Protected, Admin Role | N/A | N/A | `bookId`, `tagId` |
| `/api/tag/:id` | DELETE | Delete a tag type from the system. Requires `admin` role. | Protected, Admin Role | N/A | N/A | `id` |
