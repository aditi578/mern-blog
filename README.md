# MERN Stack Blogging Project

This repository contains a MERN (MongoDB, Express, React, Node.js) stack blogging project that allows users to create, edit, and view blog posts. Users can also register and log in to the application to manage their blog posts.

## Features

- User Registration and Login: Users can create accounts and log in to the application to manage their blog posts.
- Create Blog Posts: Logged-in users can create new blog posts by providing a title, summary, cover image, and content.
- Edit Blog Posts: Users can edit their own blog posts, including updating the title, summary, cover image, and content.
- View Blog Posts: All users, including those who are not logged in, can view the list of blog posts and read individual posts in detail.
- User Authentication: User authentication is implemented using JWT (JSON Web Token) for secure login and protected routes.

## Installation

Follow these steps to set up the project on your local machine:

1. Clone the repository: `https://github.com/aditi578/mern-blog.git`
2. Navigate to the project directory: `cd mern-blog`
3. Install server dependencies: `npm install`
4. Install client dependencies: `cd client && npm install`
5. Start the development server: `npm run dev`

The server will run on `http://localhost:4000`, and the client will run on `http://localhost:3000`.

## Project Structure

The project is structured as follows:

- `api`: Contains the backend server code, including routes and database models.
- `client`: Contains the frontend React application code.
- `uploads`: A directory to store uploaded images for blog posts.
- `index.js`: The entry point for the backend server.
- `package.json`: Contains the project dependencies and scripts.

## Technologies Used

- MongoDB: Database to store blog post and user data.
- Express: Backend web application framework.
- React: Frontend JavaScript library for building user interfaces.
- Node.js: Server-side JavaScript runtime environment.
- JWT: JSON Web Tokens for user authentication.
- Multer: Middleware for handling file uploads.
- Date-fns: Library for formatting dates in the frontend.
- Axios: Promise-based HTTP client for making API requests.


Thank you for showing interest in this MERN stack blogging project. We hope you find it useful and enjoy exploring and contributing to the codebase. If you have any questions or need assistance, feel free to reach out to me. Happy blogging!
