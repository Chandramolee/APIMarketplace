# API Marketplace

A full-stack API Marketplace where developers can discover, publish, and review APIs.
Built with the MERN stack (MongoDB, Node.js, Express, React).

## Prerequisites
- Node.js (v16+)
- MongoDB (Running locally on `mongodb://localhost:27017` or update the MONGODB_URI in `backend/.env`)

## Setup & Running

We provide a single root script to manage both the backend and frontend simultaneously.

1. From the root directory, install all dependencies (for root, backend, and frontend):
   ```bash
   npm run install-all
   ```

2. Run the seed script to populate initial mock APIs (avoids duplicate data):
   ```bash
   npm run seed
   ```

3. Start both the backend and frontend development servers concurrently:
   ```bash
   npm run dev
   ```
   - Documentation & Backend API runs on `http://localhost:5005`
   - Frontend React App runs on `http://localhost:5173`
