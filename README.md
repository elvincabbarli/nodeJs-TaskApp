# Node.js Task Management API

This is a **Task Management API** built with **Node.js**, **Express**, and **MongoDB**. It provides authentication, user management, and task management functionality with JWT authentication and file upload support.

## Features

- **User Authentication**
  - Register, login, and logout users
  - JWT-based authentication
  - Profile management with avatar upload

- **Task Management**
  - Create, read, update, and delete tasks
  - Retrieve all tasks or personal tasks

- **Security & Middleware**
  - JWT-based authentication
  - File upload validation for profile pictures
  - CORS enabled for cross-origin requests

---

## Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **Multer (for file uploads)**
- **JWT (JSON Web Token) for authentication**
- **CORS**
- **dotenv** (for environment variables)

---

## Installation & Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v14 or later)
- **MongoDB** (running locally or using MongoDB Atlas)

### 1. Clone the Repository

git clone https://github.com/yourusername/your-repo.git
cd your-repo

2. Install Dependencies
sh
Copy
Edit
npm install

3. Set Up Environment Variables
Create a .env file in the root directory and add the following:

env
Copy
Edit
MONGODB_URI=your_mongodb_connection_string
VITE_PORT=5000
JWT_SECRET=your_jwt_secret
Replace your_mongodb_connection_string and your_jwt_secret with your actual MongoDB connection string and a secure secret key.

4. Start the Server
sh
Copy
Edit
npm start
The server will run on http://localhost:5000.


How It Works
User Authentication

Users register and log in to obtain a JWT token.
The token is required for protected routes.
Task Management

Users can create, update, and delete tasks.
Personal tasks are protected and require authentication.
File Uploads

Users can upload profile pictures (JPG/PNG, max 1MB).
Error Handling

The API provides meaningful error responses for authentication failures, invalid inputs, and missing resources.
Uploading files other than JPG/PNG will result in an error.



