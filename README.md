# Book_API: A Robust API for Managing Books, Comments, and Tags

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-purple.svg)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-orange.svg)](https://jwt.io/)

A powerful and secure API for managing books, users, comments, and tags. This project is built using Node.js, the Express.js framework, and a PostgreSQL database, with a strong focus on security and efficient error handling.

## Key Features

* **User Management:**
    * User registration (Sign up).
    * User login and JWT token generation for authentication.
    * Retrieve user's profile details, including the count of their books and comments.
    * Protect routes requiring user authentication.
* **Book Management:**
    * Add new books.
    * Retrieve all books or filter by a specific user's books.
    * Update book details (owner-only access).
    * Delete books (admin-only access).
* **Comment Management:**
    * Create new comments for books.
    * Retrieve all comments.
    * Update comments (owner-only access).
    * Delete comments (admin-only access).
* **Tag Management:**
    * Add tags to existing books (owner-only access, validates against predefined tag types).
    * Update tags associated with a book (owner-only access).
    * Delete specific tags from a book (admin-only access).
    * Add new tag types to the available list (admin-only access).
    * Delete tag types (admin-only access).
    * Retrieve all available tag types.
* **Security:**
    * Uses `bcrypt` for password hashing.
    * Implements JWT-based authentication for secure access.
    * Applies `express-rate-limit` to prevent brute-force attacks and control request rates.
    * Uses `helmet` for setting various security-related HTTP headers.
    * Employs `xss-clean` to sanitize user input against Cross-Site Scripting (XSS) attacks.
    * Leverages `dotenv` for managing sensitive environment variables.
* **Error Handling:**
    * Custom `AppError` class for standardized error responses.
    * `catchAsync` utility to wrap asynchronous controller functions for robust error propagation.

## Technologies Used

* **Backend:**
    * [Node.js](https://nodejs.org/): JavaScript runtime environment.
    * [Express.js](https://expressjs.com/): Fast, unopinionated, minimalist web framework for Node.js.
    * [PostgreSQL](https://www.postgresql.org/): Powerful, open-source object-relational database system.
    * [PG](https://node-postgres.com/): Non-blocking PostgreSQL client for Node.js.
    * [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): For JSON Web Token implementation.
    * [bcryptjs](https://www.npmjs.com/package/bcryptjs): For hashing and salting passwords.
    * [dotenv](https://www.npmjs.com/package/dotenv): Loads environment variables from a `.env` file.
    * [express-rate-limit](https://www.npmjs.com/package/express-rate-limit): Basic rate-limiting middleware for Express.
    * [helmet](https://www.npmjs.com/package/helmet): Helps secure Express apps by setting various HTTP headers.
    * [xss-clean](https://www.npmjs.com/package/xss-clean): Middleware to sanitize user input.

## Setup and Installation

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

# API Endpoints for Book_API

All endpoints are prefixed with `/api/`.

## User Authentication

| Endpoint           | Method | Description                                    | Authentication | Request Body (JSON)                                | Query Params | Path Params |
| :----------------- | :----- | :--------------------------------------------- | :------------- | :------------------------------------------------- | :----------- | :---------- |
| `/api/user/signup` | `POST` | Register a new user.              | None | `{ "email": "string", "password": "string" }` | N/A          | N/A         |
| `/api/user/login`  | `POST` | Log in a user and get a JWT.      | None | `{ "email": "string", "password": "string" }` | N/A          | N/A         |
| `/api/user`        | `GET`  | Get user profile details.         | Protected | N/A                                                | N/A          | N/A         |

## Book Management

| Endpoint             | Method   | Description                                                                                             | Authentication                          | Request Body (JSON)                       | Query Params   | Path Params    |
| :------------------- | :------- | :------------------------------------------------------------------------------------------------------ | :-------------------------------------- | :---------------------------------------- | :------------- | :------------- |
| `/api/books`         | `POST`   | Add a new book. Requires `book_name` and an existing `tag` type (e.g., "fiction").        | Protected                     | `{ "book_name": "string", "tag": "string" }` | N/A            | N/A            |
| `/api/books`         | `GET`    | Get all books. Can be filtered by `user_id`.                                               | Protected                     | N/A                                       | `user_id`      | N/A            |
| `/api/books/:id`     | `PATCH`  | Update a book's name. Only the book's owner can update.                                  | Protected, Book Owner         | `{ "book_name": "string" }`     | N/A            | `id` (Book ID) |
| `/api/books/:id`     | `DELETE` | Delete a book. Requires `admin` role.                                                    | Protected, Admin Role      | N/A                                       | N/A            | `id` (Book ID) |

## Comment Management

| Endpoint           | Method   | Description                                                               | Authentication                   | Request Body (JSON)             | Query Params        | Path Params        |
| :----------------- | :------- | :------------------------------------------------------------------------ | :------------------------------- | :------------------------------ | :------------------ | :----------------- |
| `/api/comment`     | `POST`   | Create a new comment for a book.                                | Protected              | `{ "comment_text": "string" }` | `book_id` (Book ID) | N/A                |
| `/api/comment`     | `GET`    | Get all comments.                                               | Protected              | N/A                             | N/A                 | N/A                |
| `/api/comment/:id` | `PATCH`  | Update a comment. Only the comment's owner can update.          | Protected, Comment Owner | `{ "comment_text": "string" }` | N/A                 | `id` (Comment ID) |
| `/api/comment/:id` | `DELETE` | Delete a comment. Requires `admin` role.                      | Protected, Admin Role | N/A                             | N/A                 | `id` (Comment ID) |

## Tag Management

| Endpoint                   | Method   | Description                                                                                                    | Authentication                   | Request Body (JSON)                  | Query Params | Path Params                                     |
| :------------------------- | :------- | :------------------------------------------------------------------------------------------------------------- | :------------------------------- | :----------------------------------- | :----------- | :---------------------------------------------- |
| `/api/tag`                 | `GET`    | Get all available tag types (from the `tags` table).                                                 | Protected              | N/A                                  | N/A          | N/A                                             |
| `/api/tag/:book_id`        | `POST`   | Add an existing tag type to a specific book. Only the book's owner can add tags.                     | Protected, Book Owner  | `{ "tag": "string" }` (e.g., "fiction") | N/A          | `book_id` (Book ID)                   |
| `/api/tag`                 | `POST`   | Add a *new* tag type to the `type_tag` enum and `tags` table. Requires `admin` role.                 | Protected, Admin Role | `{ "tag": "string" }` (new tag name) | N/A          | N/A                                             |
| `/api/tag/:book_id/:tag_Id`| `PATCH`  | Update a tag associated with a book. Only the book's owner can update.                               | Protected, Book Owner  | `{ "tag": "string" }` (new tag name) | N/A          | `book_id` (Book ID), `tag_Id` (Old Tag ID) |
| `/api/tag/:bookId/:tagId`  | `DELETE` | Delete a specific tag association from a book. Requires `admin` role.                                | Protected, Admin Role | N/A                                  | N/A          | `bookId` (Book ID), `tagId` (Tag ID) |
| `/api/tag/:id`             | `DELETE` | Delete a tag *type* from the `tags` table. Requires `admin` role. (This also removes associations). | Protected, Admin Role | N/A                                  | N/A          | `id` (Tag Type ID) |