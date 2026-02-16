# Vite Vue Starter

This is a project template using [Vite](https://vitejs.dev/). It requires [Node.js](https://nodejs.org) version 18+ or 20+.

## 🚨 Important: First Time Setup

**If you see "failed to fetch" errors, you need to install dependencies first!**

### Quick Start (First Time)

Run this script to install all dependencies and start both servers:

```sh
# Install dependencies for both frontend and backend
npm install
cd server && npm install && cd ..

# Start backend (in one terminal)
cd server && npm start

# Start frontend (in another terminal)
npm run dev
```

### Development

To start the frontend:

```sh
npm install  # Only needed first time or after pulling new changes
npm run dev
```

## Forum Backend

This project includes a minimal backend inside the `server` folder (Express + lowdb) used for authentication and forum data.

To run the backend:

```sh
cd server
npm install  # Only needed first time or after pulling new changes
# copy .env.example -> .env and set JWT_SECRET as needed
npm run dev
```

The backend listens on port `3000` by default. The frontend expects the API at `http://localhost:3000/api` during development.

## Full Dev

In one terminal run the backend (above), and in another run the frontend from project root:

```sh
npm install
npm run dev
```

After both servers are running open the Vite dev URL (usually http://localhost:5173).

## Documentation

- **[Profile Guide](PROFILE_GUIDE.md)** - Comprehensive guide on how user profiles work in the Unknown Forums, including customization, notifications, invitations, and security settings.

## Production Deployment (Netlify + Render)

This repo is set up for a public deployment with Netlify (frontend) and Render (API).

### Backend (Render)

1. Create a new Render Web Service and connect this repo.
2. Render will detect [render.yaml](render.yaml) and use it automatically.
3. The service mounts a persistent disk at `/var/data` for `db.json` and uploads.
4. After deploy, copy the public service URL (e.g. https://your-service.onrender.com).

### Frontend (Netlify)

1. Create a new Netlify site from this repo.
2. Netlify will use [netlify.toml](netlify.toml) for build settings.
3. Set the environment variable `VITE_API_BASE` to your Render URL.
	- Example: `https://your-service.onrender.com`
4. Redeploy the Netlify site.
