# 🐞 BugTracker Backend

This is the backend server for a Bug Tracking application built with **Node.js**, **Express**, **MongoDB**, and **JWT**. It supports user authentication, bug tracking, group-based access control, and collaboration workflows.

---

## 🚀 Features

- ✅ User registration & login with secure **JWT cookies**
- 🐞 Full bug CRUD: Create, update, delete, assign, filter
- 👥 Group system:
  - Create and manage groups
  - Associate bugs with groups
  - Users only see bugs in their groups
- 📬 Membership workflow:
  - Users can request to join a group
  - Managers can invite users to groups
  - Users must accept/decline invitations
- 🔐 Protected routes using authentication middleware
- 🐳 Docker + Docker Compose setup with persistent MongoDB volume

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** (via Mongoose)
- **JWT (JSON Web Token)**
- **Docker & Docker Compose**

---

## ⚙️ Getting Started

### 🔧 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB Atlas or local MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

### 📁 Environment Variables

Create a `.env` file in the root of the project:

```env
PORT=8000
MONGO_URI=mongodb://mongo:27017/BugTrakerDB
💡 If you want to connect to a MongoDB Atlas cloud cluster, replace MONGO_URI with your cloud connection string.
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

---

### 🧪 Running the App
▶️ Option 1: Local Development (Without Docker)
- Clone the repository:
```
git clone https://github.com/AvihayFinish/BugTracker.git
cd your-repo-name
```
- Install dependencies:
```
npm install
```
- Create a .env file as shown above.
- Start the server:
```
npm start
```
- or with nodemon (if installed):
```
npm run server
```

🐳 Option 2: Using Docker (Recommended)
1. Make sure your .env file exists as shown above.
2. Run the app with Docker Compose:
```
docker compose up --build
```
This will: <br>
• Build the Node.js server from the Dockerfile. <br>
• Start a MongoDB container from the official image. <br>
• Create a named volume to persist MongoDB data. <br>

3. To stop and remove everything (including the volume):
```
docker compose down --volumes
```

---

### 🔐 API Overview
🔑 Auth Routes
- POST	    /users/register	    Register new user
- POST	    /users/login	    Login and get token
- POST      /users/logout       Logout and delete token
- GET	    /users/profile	    Get authenticated user
- PUT       /users/profile      Update user details

🐞 Bug Routes
- GET	    /bugs	    List bugs (filterable)
- POST	    /bugs	    Create new bug
- PUT	    /bugs/:id	Update a bug
- DELETE	/bugs/:id	Delete a bug

👥 Group Routes
- POST	    /group	    Create a new group
- GET	    /group/:id	Get group details + members
- PUT	    /group/:id	Update group info
- DELETE	/group/:id	Delete group

📬 Group Join System
- POST	    /group/request	User requests to join group
- POST	    /group/invite	Manager invites user to group
- GET	    /group/requests	Manager views join requests
- GET	    /group/invites	User views pending invites
- PATCH	    /group/request/:id/response	User accepts/declines join request
- PATCH	    /group/invite/:id/response	User accepts/declines invite
- DELETE	/group/request/:id	Cancel join request

---

### 🧪 Testing
You can use Postman or any REST client to test the API. Make sure to send the JWT cookie with each protected request.

Endpoints are defined and documented in the controllers/ directory.