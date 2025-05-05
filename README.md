# BugTracker Backend 🐞

This is the backend server for a Bug Tracking application built with **Node.js**, **Express**, **MongoDB**, and **JWT**. It supports user registration/login, bug creation, and tracking functionality.

## Features 🚀

- User authentication (register, login) with JWT cookies
- Bug creation, reading, updating, and deleting (CRUD)
- Dockerized with separate containers for the server and MongoDB
- MongoDB data is persisted using Docker volumes

## Tech Stack 🛠️

- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT (JSON Web Token)
- Docker & Docker Compose

## Getting Started 🧪

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Environment Variables

Create a `.env` file in the root of your project:

```env
PORT=8000
MONGO_URI=<your connection string from the cluster(if you want to use on the cloud) or mongodb://mongo:27017/BugTrakerDB>
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
