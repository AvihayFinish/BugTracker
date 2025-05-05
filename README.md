# 🐞 BugTracker Backend

This is the **backend server** for a Bug Tracking application, built using **Node.js**, **Express**, **MongoDB**, and **JWT**. It provides RESTful APIs for user authentication and bug management, and is containerized using **Docker** for easy development and deployment.

---

## ✨ Features

- 🔐 User authentication with JWT stored in HTTP-only cookies  
- 🐛 Full CRUD functionality for bug tracking  
- 📦 Dockerized: separate containers for the server and MongoDB  
- 💾 Persistent MongoDB storage using Docker volumes  

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

🧪 Running the App
▶️ Option 1: Local Development (Without Docker)
1. Clone the repository:
git clone https://github.com/AvihayFinish/BugTracker.git
cd your-repo-name
2. Install dependencies:
npm install
3. Create a .env file as shown above.
4. Start the server:
npm start
or with nodemon (if installed):
npm run server

🐳 Option 2: Using Docker (Recommended)
1. Make sure your .env file exists as shown above.
2. Run the app with Docker Compose:
docker compose up --build
This will:

Build the Node.js server from the Dockerfile

Start a MongoDB container from the official image

Create a named volume to persist MongoDB data

3. To stop and remove everything (including the volume):
docker compose down --volumes

🔌 API Endpoints
The backend exposes routes for:

User registration

User login

Bug creation

Bug update

Bug deletion

Bug listing

Endpoints are defined and documented in the controllers/ directory. Use Postman or another API client to test.

