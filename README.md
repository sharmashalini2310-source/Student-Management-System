# Student Management System

A full-stack Student Management System built with Node.js, Express.js, MongoDB, and Mongoose. The application provides user authentication, profile management, and student record management through a web interface and REST APIs.

## Technology Stack

- **Frontend:** HTML5, CSS3, Bootstrap, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **API Testing:** Postman
- **Session Management:** Session-based authentication using cookies

## Features

- User registration and login
- User logout and session management
- Authentication and profile retrieval
- Profile management
- Student dashboard
- Student record creation and retrieval
- Student record updating and deletion
- RESTful API endpoints
- MongoDB database integration

## Project Setup and Installation

### Prerequisites

Ensure the following software is installed:

- [Node.js](https://nodejs.org/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a MongoDB Atlas account
- [Visual Studio Code](https://code.visualstudio.com/)
- [Postman](https://www.postman.com/) (optional, for API testing)

### Installation Steps

**1. Clone the repository**

```bash
git clone https://github.com/sharmashalini2310-source/Student-Management-System.git
```

**2. Navigate to the project directory**

```bash
cd Student-Management-System
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Copy `.env.example` to `.env` and configure the required environment variables.

For Windows Command Prompt:

```cmd
copy .env.example .env
```

For a local MongoDB instance, configure:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/student_management
```

Add any other environment variables required by the application. Never commit your `.env` file or expose database credentials.

**5. Start the application**

```bash
npm start
```

**6. Open the application**

Visit the following URL in your browser:

http://localhost:3000

Ensure that your MongoDB service is running or that your MongoDB Atlas connection is configured correctly.

## REST API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Authenticate a user |
| POST | `/api/logout` | Log out the current user |
| GET | `/api/me` | Retrieve the current user's information |

### Profile and Dashboard

| Method | Endpoint | Description |
|---|---|---|
| PUT | `/api/profile` | Update the user's profile |
| GET | `/api/dashboard` | Retrieve dashboard information |

### Student Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | Retrieve student records |
| POST | `/api/students` | Create a student record |
| PUT | `/api/students/:id` | Update a student record |
| DELETE | `/api/students/:id` | Delete a student record |

## API Testing with Postman

1. Start the application and ensure the database connection is active.
2. Register a user using `POST /api/register`.
3. Log in using `POST /api/login`.
4. Use the session cookie returned by the login request for protected endpoints.
5. Test student creation, retrieval, updating, and deletion.

**Note:** Protected endpoints require a valid authenticated session. Ensure Postman preserves and sends the session cookie between requests.

## Project Structure

```text
StudentManagementSystemMongo/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── index.html
├── server.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

*The structure above reflects the expected layout; adjust it if your actual project contains additional files or folders.*

## Security Notes

- Store sensitive configuration values in environment variables.
- Never upload `.env`, database passwords, or secret keys to GitHub.
- Use appropriate authentication and authorization checks for protected endpoints.
- Validate user input on the server.
- Use secure password hashing and appropriate session-cookie settings.

## Future Enhancements

- Search, filtering, and pagination for student records
- Role-based access control
- Improved input validation and error handling
- Automated testing for APIs
- Deployment to a production hosting platform

## License

This project is available for educational and learning purposes. Add a specific open-source license if you intend to distribute it under particular terms.
