# 🔨 Complete Website Recreation Guide - Unknown.cc

**Last Updated:** February 16, 2026  
**Version:** 1.0

This comprehensive guide provides exact details to recreate the Unknown.cc forum website from scratch. Follow these instructions to build an identical copy of this website.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Prerequisites](#prerequisites)
4. [Project Architecture](#project-architecture)
5. [File Structure](#file-structure)
6. [Database Schema](#database-schema)
7. [Frontend Setup](#frontend-setup)
8. [Backend Setup](#backend-setup)
9. [API Endpoints](#api-endpoints)
10. [Authentication System](#authentication-system)
11. [Security Features](#security-features)
12. [Local Development](#local-development)
13. [Production Deployment](#production-deployment)
14. [Environment Variables](#environment-variables)
15. [Testing & Verification](#testing--verification)

---

## 🎯 Project Overview

**Unknown.cc** is a modern gaming community forum platform with the following features:
- User authentication with JWT tokens and 2FA support
- Forum with categories, threads, and posts
- Role-based access control (RBAC)
- Admin panel for user and content management
- Ticket system for support
- Product store with Stripe integration
- Security features (rate limiting, CORS, input sanitization)
- Profile customization with image uploads
- Email notifications with SMTP support

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Vue.js 3.x (Composition API)
- **Build Tool:** Vite 7.3.1
- **Routing:** Vue Router 4.6.4
- **Language:** JavaScript (ES6+)
- **Styling:** Custom CSS with CSS Variables
- **HTTP Client:** Native Fetch API

### Backend
- **Runtime:** Node.js 18+ or 20+
- **Framework:** Express 4.18.2
- **Database:** lowdb 6.0.1 (JSON file-based)
- **Authentication:** JWT (jsonwebtoken 9.0.0)
- **Password Hashing:** bcrypt 5.1.0
- **Payment:** Stripe 20.3.1
- **Email:** nodemailer 6.9.12

### Security Middleware
- helmet (8.1.0) - Security headers
- cors (2.8.5) - CORS configuration
- express-rate-limit (8.2.1) - Rate limiting
- express-validator (7.3.1) - Input validation
- express-mongo-sanitize (2.2.0) - NoSQL injection prevention
- hpp (0.2.3) - HTTP parameter pollution prevention

### Development Tools
- nodemon (2.0.22) - Auto-restart on changes

### Deployment
- **Frontend:** Netlify
- **Backend:** Render
- **Frontend URL:** https://exquisite-tanuki-2c779a.netlify.app
- **Backend URL:** https://unkown-cc.onrender.com

---

## 📦 Prerequisites

Before starting, ensure you have:

1. **Node.js** 18+ or 20+ installed
   - Download from: https://nodejs.org
   - Verify: `node --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **Git** for version control
   - Download from: https://git-scm.com
   - Verify: `git --version`

4. **Code Editor** (recommended: VS Code)

5. **GitHub Account** (for deployment)

6. **Netlify Account** (for frontend hosting)

7. **Render Account** (for backend hosting)

8. **Stripe Account** (optional, for payment processing)

---

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────┐
│              FRONTEND (Netlify)             │
│                                             │
│  - Vue.js 3 SPA                            │
│  - Vite dev server (localhost:5173)        │
│  - Vue Router for navigation               │
│  - Fetch API for HTTP requests             │
│                                             │
└──────────────┬──────────────────────────────┘
               │
               │ HTTP/HTTPS
               │ (API_BASE)
               │
┌──────────────▼──────────────────────────────┐
│              BACKEND (Render)               │
│                                             │
│  - Express.js REST API                     │
│  - JWT authentication                      │
│  - lowdb JSON database                     │
│  - Security middleware                     │
│  - File uploads (avatars, banners)         │
│  - Email notifications (nodemailer)        │
│  - Stripe payment processing               │
│                                             │
└──────────────┬──────────────────────────────┘
               │
               │
┌──────────────▼──────────────────────────────┐
│        DATA STORAGE (File System)          │
│                                             │
│  - db.json (database)                      │
│  - config.json (configuration)             │
│  - uploads/ (user images)                  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📁 File Structure

### Root Directory
```
Unkown.cc/
├── src/                        # Frontend Vue.js source
│   ├── assets/                 # Static assets (images, fonts)
│   │   ├── logo.png           # Site logo (876KB)
│   │   └── logo.svg           # SVG version
│   ├── components/            # Reusable Vue components
│   │   └── PasswordStrength.vue
│   ├── lib/                   # Utility libraries
│   │   └── apiBase.js        # API base URL configuration
│   ├── views/                 # Page components
│   │   ├── Admin.vue         # Admin dashboard
│   │   ├── Forum.vue         # Individual forum view
│   │   ├── Forums.vue        # Forum listing
│   │   ├── Guide.vue         # User guide
│   │   ├── Home.vue          # Landing page
│   │   ├── Login.vue         # Login page
│   │   ├── Members.vue       # Members listing
│   │   ├── Profile.vue       # User profile
│   │   ├── Register.vue      # Registration page
│   │   ├── Store.vue         # Product store
│   │   ├── Terms.vue         # Terms of service
│   │   ├── Thread.vue        # Thread view
│   │   └── Tickets.vue       # Support tickets
│   ├── App.vue               # Root component with header/nav
│   ├── main.js               # App entry point
│   ├── router.js             # Vue Router configuration
│   └── styles.css            # Global styles
│
├── server/                    # Backend Express.js server
│   ├── middleware/           # Custom middleware
│   │   └── security.js      # Security functions (12KB)
│   ├── uploads/             # User-uploaded files
│   ├── config.json          # Server configuration
│   ├── db.json              # Database (lowdb JSON file)
│   ├── index.js             # Main server file (2179 lines)
│   ├── package.json         # Backend dependencies
│   └── package-lock.json    # Locked dependencies
│
├── index.html                # HTML entry point
├── package.json              # Frontend dependencies
├── package-lock.json         # Locked dependencies
├── vite.config.js            # Vite configuration
├── tsconfig.json             # TypeScript config (for IDE support)
├── netlify.toml              # Netlify deployment config
├── render.yaml               # Render deployment config
├── setup.sh                  # Setup script
├── import-map.json           # Import map for CDN imports
├── .gitignore                # Git ignore rules
│
└── [Documentation Files]     # Various MD files for documentation
    ├── README.md
    ├── DEPLOYMENT.md
    ├── START_HERE.md
    └── ... (other guides)
```

### Key Files Explained

**Frontend Entry Points:**
- `index.html` - HTML shell with `<div id="app"></div>`
- `src/main.js` - Creates Vue app, mounts to #app
- `src/App.vue` - Root component with header and router-view
- `src/router.js` - Defines all routes and navigation guards

**Backend Entry Point:**
- `server/index.js` - Express app with all API routes

**Configuration Files:**
- `vite.config.js` - Vite dev server on port 5173
- `netlify.toml` - Build command, publish dir, redirects
- `render.yaml` - Backend service definition
- `server/config.json` - Admin IPs, SMTP settings

**Database:**
- `server/db.json` - All data (users, threads, posts, etc.)

---

## 🗄️ Database Schema

The application uses **lowdb**, a simple JSON database. All data is stored in `server/db.json`.

### Database Structure

```javascript
{
  // User Management
  "uidCounter": 2,              // Auto-increment user ID counter
  "users": [                    // Array of user objects
    {
      "id": "nanoid",          // Unique user ID (generated)
      "uid": 1,                // Sequential user number
      "username": "string",    // Unique username
      "email": "string",       // User email
      "passwordHash": "string", // bcrypt hashed password
      "role": "user|staff",    // Base role
      "staffRole": "admin|manager|null", // Staff-specific role
      "banned": false,         // Ban status
      "banReason": "string|null",
      "banIssuedAt": "timestamp|null",
      "banExpiresAt": "timestamp|null",
      "banDurationLabel": "string|null",
      "accessRevoked": false,  // Forum access revoked
      "registeredIp": "string", // IP at registration
      "lastIp": "string",      // Most recent IP
      "ips": [                 // IP history
        { "ip": "string", "timestamp": 1234567890 }
      ],
      "profile": {
        "pfp": "/uploads/...",  // Profile picture path
        "banner": "string|null", // Profile banner
        "background": "string|null",
        "signature": "string",
        "customRank": "string|null",
        "bio": "string"
      },
      "twoFa": {
        "enabled": false,
        "code": "string|null",   // Current 2FA code
        "codeExpiry": "timestamp|null"
      },
      "createdAt": 1234567890,
      "roles": ["role_id"]      // Array of assigned role IDs
    }
  ],

  // Forum System
  "forumStatus": {
    "isOpen": true              // Global forum open/closed
  },
  "forumCategories": [          // Forum categories
    {
      "id": "cat_id",
      "name": "string",
      "description": "string",
      "color": "#hex",
      "order": 1
    }
  ],
  "forums": [                   // Individual forums
    {
      "id": "forum_id",
      "categoryId": "cat_id",   // Parent category
      "name": "string",
      "description": "string",
      "createdBy": "user_id",
      "createdAt": 1234567890,
      "threadCount": 0
    }
  ],
  "threads": [                  // Forum threads
    {
      "id": "thread_id",
      "forumId": "forum_id",
      "title": "string",
      "content": "string",
      "authorId": "user_id",
      "pinned": false,
      "locked": false,
      "createdAt": 1234567890
    }
  ],
  "posts": [                    // Thread posts
    {
      "id": "post_id",
      "threadId": "thread_id",
      "content": "string",
      "authorId": "user_id",
      "createdAt": 1234567890
    }
  ],

  // Role & Permission System
  "roles": [                    // Custom roles
    {
      "id": "role_id",
      "name": "string",
      "color": "#hex",
      "permissions": {},
      "position": 0
    }
  ],
  "ranks": [                    // Display ranks
    {
      "id": "rank_id",
      "name": "string",
      "color": "#hex",
      "permissions": {
        "forum_access": true,
        "create_threads": true,
        "create_posts": true,
        "delete_own_posts": true,
        "view_tickets": false,
        "create_tickets": false,
        "ban_users": false,
        "delete_posts": false,
        "delete_threads": false,
        "manage_forum": false
      },
      "createdAt": 1234567890
    }
  ],

  // Invitation System
  "keys": [                     // Invitation keys
    {
      "id": "key_id",
      "key": "string",          // The actual key
      "createdBy": "user_id",
      "createdAt": 1234567890,
      "usedBy": "user_id|null",
      "usedAt": "timestamp|null",
      "revoked": false
    }
  ],

  // Support System
  "tickets": [                  // Support tickets
    {
      "id": "ticket_id",
      "subject": "string",
      "description": "string",
      "category": "account|technical|billing|other",
      "status": "open|in_progress|closed",
      "createdBy": "user_id",
      "createdAt": 1234567890,
      "responses": [
        {
          "id": "response_id",
          "message": "string",
          "authorId": "user_id",
          "createdAt": 1234567890
        }
      ]
    }
  ],

  // Store System
  "products": [                 // Products for sale
    {
      "id": "prod_id",
      "name": "string",
      "description": "string",
      "price": 999,             // Price in cents
      "currency": "USD",
      "createdAt": 1234567890
    }
  ],
  "orders": [                   // Purchase orders
    {
      "id": "order_id",
      "productId": "prod_id",
      "productName": "string",
      "price": 999,
      "currency": "USD",
      "userId": "user_id",
      "paymentIntentId": "string",
      "status": "pending|completed|failed",
      "tosAccepted": true,
      "tosSignature": "string",
      "createdAt": 1234567890
    }
  ],
  "stripeConfig": {
    "apiKey": "string",
    "publishableKey": "string"
  },

  // Terms of Service
  "tos": {
    "title": "string",
    "content": "string",
    "lastUpdated": 1234567890
  },

  // Activity Logs
  "accountLogs": [              // User account activity logs
    {
      "id": "log_id",
      "userId": "user_id",
      "action": "string",
      "details": {},
      "ip": "string",
      "timestamp": 1234567890
    }
  ],

  // Notifications
  "notifications": [            // User notifications
    {
      "id": "notif_id",
      "userId": "user_id",
      "type": "string",
      "message": "string",
      "read": false,
      "createdAt": 1234567890
    }
  ]
}
```

---

## 🎨 Frontend Setup

### Step 1: Initialize Frontend Project

```bash
# Create project directory
mkdir Unkown.cc
cd Unkown.cc

# Initialize npm
npm init -y
```

### Step 2: Install Frontend Dependencies

```bash
npm install vue@latest vue-router@^4.6.4
npm install --save-dev vite@^7.3.1 @vitejs/plugin-vue@^6.0.4
```

### Step 3: Create Frontend Files

**package.json** (root):
```json
{
  "name": "vite-vue-starter",
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview"
  },
  "dependencies": {
    "bcrypt": "^6.0.0",
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "lowdb": "^7.0.1",
    "nanoid": "^5.1.6",
    "stripe": "^20.3.1",
    "vue": "latest",
    "vue-router": "^4.6.4"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.4",
    "vite": "^7.3.1"
  }
}
```

**vite.config.js**:
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 5173
  }
})
```

**index.html**:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Unknown.cc - Gaming Community</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

**src/main.js**:
```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles.css'

function decodeJwt(token) {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = parts[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(json)))
  } catch (e) {
    return null
  }
}

// Auto sign-in when 'remember' is set and token present
const token = localStorage.getItem('token')
const remember = localStorage.getItem('remember')
if (token && remember && !localStorage.getItem('user')) {
  const payload = decodeJwt(token)
  if (payload) {
    const u = { 
      id: payload.id, 
      username: payload.username, 
      role: payload.role, 
      staffRole: payload.staffRole, 
      roles: payload.roles || [] 
    }
    localStorage.setItem('user', JSON.stringify(u))
  }
}

// If no token in localStorage, try to find a JWT stored as a cookie
if (!localStorage.getItem('token') && typeof document !== 'undefined') {
  const cookieStr = document.cookie || ''
  const parts = cookieStr.split(';').map(s => s.trim())
  for (const p of parts) {
    const eq = p.indexOf('=')
    if (eq === -1) continue
    const name = p.slice(0, eq)
    const val = decodeURIComponent(p.slice(eq + 1))
    if (val && typeof val === 'string' && (val.match(/\./g) || []).length === 2) {
      try {
        const payload = decodeJwt(val)
        if (payload && payload.id) {
          localStorage.setItem('token', val)
          const u = { 
            id: payload.id, 
            username: payload.username, 
            role: payload.role, 
            staffRole: payload.staffRole, 
            roles: payload.roles || [] 
          }
          localStorage.setItem('user', JSON.stringify(u))
          break
        }
      } catch (e) {
        // not a valid JWT, continue
      }
    }
  }
}

createApp(App).use(router).mount('#app')
```

**src/lib/apiBase.js**:
```javascript
const inferredHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
const inferredProtocol = typeof window !== 'undefined' ? window.location.protocol : 'http:'
export const API_BASE = import.meta.env.VITE_API_BASE || `${inferredProtocol}//${inferredHost}:3000`
```

**src/router.js**:
```javascript
import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Forums from './views/Forums.vue'
import Thread from './views/Thread.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Admin from './views/Admin.vue'
import Guide from './views/Guide.vue'
import Members from './views/Members.vue'
import Profile from './views/Profile.vue'
import Tickets from './views/Tickets.vue'
import Terms from './views/Terms.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/forum', component: Forums, meta: { requiresAuth: true, requiresForumAccess: true } },
  { path: '/store', component: () => import('./views/Store.vue') },
  { path: '/thread/:id', component: Thread, props: true, meta: { requiresAuth: true, requiresForumAccess: true } },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/guide', component: Guide },
  { path: '/members', component: Members, meta: { requiresAuth: true } },
  { path: '/profile/:id?', component: Profile, meta: { requiresAuth: true } },
  { path: '/tickets', component: Tickets, meta: { requiresAuth: true } },
  { path: '/terms', component: Terms },
  { path: '/admin', component: Admin, meta: { requiresAuth: true, requiresStaff: true } }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  
  const isStaff = user?.role === 'staff' || user?.staffRole === 'admin' || 
                  user?.staffRole === 'manager' || 
                  (user?.roles || []).includes('role_admin') || 
                  (user?.roles || []).includes('role_manager')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.requiresForumAccess && user?.accessRevoked) {
    next('/profile')
  } else if (to.meta.requiresStaff && !isStaff) {
    next('/')
  } else {
    next()
  }
})

export default router
```

**src/styles.css** (abbreviated - create with dark theme styling):
```css
:root {
  --primary: #00ff88;
  --bg: #030c10;
  --surface: #0f1b22;
  --text: #e7f8ff;
  --text-muted: #9bb0bd;
  --border: rgba(0, 255, 136, 0.2);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

/* Add more styles for buttons, forms, cards, etc. */
```

---

## ⚙️ Backend Setup

### Step 1: Initialize Backend

```bash
mkdir server
cd server
npm init -y
```

### Step 2: Install Backend Dependencies

```bash
npm install express@^4.18.2 cors@^2.8.5 bcrypt@^5.1.0 jsonwebtoken@^9.0.0
npm install lowdb@^6.0.1 nanoid@^4.0.0 stripe@^20.3.1 nodemailer@^6.9.12
npm install helmet@^8.1.0 express-rate-limit@^8.2.1 express-validator@^7.3.1
npm install express-mongo-sanitize@^2.2.0 hpp@^0.2.3
npm install --save-dev nodemon@^2.0.22
```

### Step 3: Create Backend Files

**server/package.json**:
```json
{
  "name": "forum-backend",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.0",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "express-mongo-sanitize": "^2.2.0",
    "express-rate-limit": "^8.2.1",
    "express-validator": "^7.3.1",
    "helmet": "^8.1.0",
    "hpp": "^0.2.3",
    "jsonwebtoken": "^9.0.0",
    "lowdb": "^6.0.1",
    "nanoid": "^4.0.0",
    "nodemailer": "^6.9.12",
    "stripe": "^20.3.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

**server/config.json**:
```json
{
  "adminIps": ["127.0.0.1", "::1"],
  "email": {
    "smtp": {
      "host": "smtp.gmail.com",
      "port": 587,
      "secure": false,
      "user": "your-email@gmail.com",
      "pass": "your-app-password",
      "from": "noreply@unknown.cc"
    }
  }
}
```

**server/db.json** (initial structure):
```json
{
  "uidCounter": 1,
  "forumStatus": { "isOpen": true },
  "ranks": [],
  "roles": [
    { 
      "id": "role_member", 
      "name": "Member", 
      "color": "#9bb0bd", 
      "permissions": {}, 
      "position": 0 
    }
  ],
  "forumCategories": [
    { "id": "cat_cs2", "name": "CS2", "color": "#00ff88" }
  ],
  "forums": [
    { 
      "id": "forum_cs2_general", 
      "name": "General Discussion", 
      "description": "General CS2 discussions", 
      "categoryId": "cat_cs2" 
    }
  ],
  "users": [],
  "threads": [],
  "posts": [],
  "keys": [],
  "accountLogs": [],
  "notifications": [],
  "tickets": [],
  "products": [],
  "orders": [],
  "stripeConfig": { "apiKey": "", "publishableKey": "" },
  "tos": { 
    "title": "Terms of Service", 
    "content": "By using this platform, you agree to our terms.", 
    "lastUpdated": 1707500000000 
  }
}
```

**server/index.js** (main backend file - 2179 lines total):

The complete backend code is too large to include here in full. Key sections include:

1. **Imports and Setup** (lines 1-100)
2. **Email Functions** (lines 100-250)
3. **Express App Configuration** (lines 250-350)
4. **Authentication Routes** (lines 350-500)
   - POST `/api/auth/register` - User registration
   - POST `/api/auth/login` - User login
   - POST `/api/auth/logout` - Logout
5. **Forum Routes** (lines 500-750)
   - GET `/api/forums/categories` - Get categories
   - GET `/api/forums` - Get forums
   - GET `/api/threads` - Get threads
   - POST `/api/threads` - Create thread
   - GET `/api/threads/:id` - Get thread with posts
   - POST `/api/threads/:id/posts` - Create post
6. **Admin Routes** (lines 750-1500)
   - User management (ban, unban, role assignment)
   - Forum management (create/edit/delete forums)
   - Key management (generate invitation keys)
   - Rank management
7. **Store Routes** (lines 1500-1800)
   - Product management
   - Stripe integration
8. **Profile Routes** (lines 1800-2000)
   - Profile updates
   - Image uploads
9. **Server Start** (lines 2000-2179)

**server/middleware/security.js** (security middleware - 12KB):

Key exports include:
- `helmetConfig` - Security headers
- `corsConfig()` - CORS configuration
- `authRateLimit` - Rate limiting for auth routes
- `generalRateLimit` - General rate limiting
- `validateEmail` - Email validation
- `validatePassword` - Password validation
- `validateUsername` - Username validation
- `sanitizeInput` - Input sanitization
- `securityMonitor` - Security monitoring

---

## 🔌 API Endpoints

### Authentication Endpoints

```
POST   /api/auth/register           - Register new user (requires invite key)
POST   /api/auth/login              - Login user
POST   /api/auth/logout             - Logout user
POST   /api/auth/verify-2fa         - Verify 2FA code
POST   /api/auth/resend-code        - Resend 2FA code
POST   /api/auth/forgot-password    - Initiate password reset
POST   /api/auth/reset-password     - Complete password reset
```

### Forum Endpoints

```
GET    /api/forums/categories       - Get all forum categories
GET    /api/forums                  - Get all forums
GET    /api/forums/:forumId         - Get specific forum
POST   /api/forums                  - Create forum (admin)
PUT    /api/forums/:forumId         - Update forum (admin)
DELETE /api/forums/:forumId         - Delete forum (admin)

GET    /api/threads                 - Get all threads
GET    /api/threads/:id             - Get thread with posts
POST   /api/threads                 - Create new thread
DELETE /api/threads/:threadId       - Delete thread (admin)

POST   /api/threads/:id/posts       - Create post in thread
DELETE /api/posts/:postId           - Delete post (admin)
```

### User Management Endpoints

```
GET    /api/users                   - Get all users (admin)
GET    /api/users/:id               - Get user by ID
PUT    /api/users/profile           - Update own profile
POST   /api/users/upload            - Upload profile image

POST   /api/admin/users/:userId/ban    - Ban user (admin)
POST   /api/admin/users/:userId/unban  - Unban user (admin)
POST   /api/admin/users/:userId/revoke-access - Revoke forum access
POST   /api/admin/users/:userId/change-email  - Change user email
POST   /api/admin/users/:userId/change-uid    - Change user UID
POST   /api/admin/users/create                - Create user (admin)
POST   /api/admin/users/:userId/staff         - Assign staff role
```

### Role & Rank Endpoints

```
GET    /api/roles                   - Get all roles
POST   /api/admin/roles             - Create role (admin)
PUT    /api/admin/roles/:roleId     - Update role (admin)
DELETE /api/admin/roles/:roleId     - Delete role (admin)
POST   /api/admin/users/:userId/roles - Assign role to user

GET    /api/ranks                   - Get all ranks
POST   /api/admin/ranks             - Create rank (admin)
PUT    /api/admin/ranks/:rankId     - Update rank (admin)
DELETE /api/admin/ranks/:rankId     - Delete rank (admin)
POST   /api/admin/users/:userId/rank - Assign rank to user
```

### Invitation Key Endpoints

```
GET    /api/admin/keys              - Get all keys (admin)
POST   /api/admin/keys/generate     - Generate invitation keys (admin)
DELETE /api/admin/keys/:keyId       - Delete key (admin)
POST   /api/admin/keys/:keyId/revoke - Revoke key (admin)
POST   /api/invites/generate        - Generate invite (if has permission)
```

### Ticket Endpoints

```
GET    /api/tickets                 - Get user's tickets
GET    /api/tickets/:id             - Get specific ticket
POST   /api/tickets                 - Create new ticket
POST   /api/tickets/:id/respond     - Respond to ticket
PUT    /api/tickets/:id/status      - Update ticket status (staff)
```

### Store Endpoints

```
GET    /api/products                - Get all products
GET    /api/products/:id            - Get specific product
POST   /api/admin/products          - Create product (admin)
PUT    /api/admin/products/:id      - Update product (admin)
DELETE /api/admin/products/:id      - Delete product (admin)

POST   /api/orders/create           - Create order
POST   /api/orders/webhook          - Stripe webhook
GET    /api/orders/history          - Get user's order history
```

### Misc Endpoints

```
GET    /api/tos                     - Get terms of service
PUT    /api/admin/tos               - Update TOS (admin)
POST   /api/admin/forum/toggle      - Toggle forum open/closed (admin)
GET    /api/account-logs            - Get account logs (own or admin)
GET    /api/notifications           - Get notifications
PUT    /api/notifications/:id/read  - Mark notification as read
```

---

## 🔐 Authentication System

### JWT Token Structure

```javascript
{
  "id": "user_nanoid",
  "username": "string",
  "role": "user|staff",
  "staffRole": "admin|manager|null",
  "roles": ["role_id1", "role_id2"],
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Authentication Flow

1. **Registration:**
   - User provides username, email, password, and invite key
   - Server validates inputs and checks invite key validity
   - Password is hashed with bcrypt (10 rounds)
   - User record is created in database
   - JWT token is generated and returned
   - Invite key is marked as used

2. **Login:**
   - User provides username/email and password
   - Server looks up user and verifies password with bcrypt
   - If 2FA is enabled, server generates 6-digit code
   - Code is sent via email
   - User must verify code to complete login
   - JWT token is generated and returned

3. **Token Storage:**
   - Frontend stores JWT in localStorage
   - Token is sent in Authorization header: `Bearer <token>`
   - Token expires in 7 days

4. **Protected Routes:**
   - Frontend router checks for token before navigating
   - Backend middleware verifies token on each request
   - Invalid/expired tokens return 401 Unauthorized

### Password Security

- **Hashing:** bcrypt with 10 rounds
- **Validation:** 
  - Minimum 8 characters
  - Must contain uppercase, lowercase, number
  - Validated with express-validator

### 2FA Implementation

- 6-digit numeric code
- Sent via email (nodemailer)
- Expires in 10 minutes
- Stored in user.twoFa object
- Validated during login process

---

## 🛡️ Security Features

### Rate Limiting

```javascript
// Auth routes: 5 requests per 15 minutes
authRateLimit: { windowMs: 15 * 60 * 1000, max: 5 }

// General API: 100 requests per 15 minutes
generalRateLimit: { windowMs: 15 * 60 * 1000, max: 100 }

// Strict routes: 10 requests per hour
strictRateLimit: { windowMs: 60 * 60 * 1000, max: 10 }
```

### Input Sanitization

- **express-mongo-sanitize:** Prevents NoSQL injection
- **hpp:** Prevents HTTP parameter pollution
- **express-validator:** Validates and sanitizes inputs

### Security Headers (Helmet)

```javascript
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
})
```

### CORS Configuration

```javascript
cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://exquisite-tanuki-2c779a.netlify.app']
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
})
```

### Session Security

- IP tracking and logging
- User-agent tracking
- Suspicious activity monitoring
- Token blacklisting on logout
- Session validation middleware

---

## 💻 Local Development

### Complete Setup Script

Create **setup.sh**:
```bash
#!/bin/bash

echo "🚀 Unknown.cc Forum Setup"
echo "=========================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install
cd ..

echo "✨ Setup complete!"
echo ""
echo "To start the application:"
echo "1. In one terminal: cd server && npm start"
echo "2. In another terminal: npm run dev"
echo ""
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:5173"
```

### Running Locally

**Terminal 1 (Backend):**
```bash
cd server
npm start
# Or for auto-restart on changes:
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

### Development Workflow

1. **Make changes to frontend:**
   - Edit files in `src/`
   - Vite hot-reloads automatically
   - Check browser console for errors

2. **Make changes to backend:**
   - Edit `server/index.js` or `server/middleware/security.js`
   - If using `npm run dev`, nodemon auto-restarts
   - If using `npm start`, manually restart server

3. **Test API endpoints:**
   - Use browser DevTools Network tab
   - Use Postman or similar tool
   - Check server logs in terminal

---

## 🚀 Production Deployment

### Backend Deployment (Render)

1. **Create Render Account:**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Render detects `render.yaml` automatically

3. **render.yaml Configuration:**
```yaml
services:
  - type: web
    name: forum-backend
    env: node
    rootDir: server
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: JWT_SECRET
        generateValue: true
      - key: DATA_DIR
        value: /var/data
    disk:
      name: forum-data
      mountPath: /var/data
      sizeGB: 1
```

4. **Important Settings:**
   - Auto-deploy: ✅ Enabled
   - Health check: `/api/forums/categories`
   - Persistent disk: Mounted at `/var/data`

5. **Get Backend URL:**
   - After deployment: `https://your-service.onrender.com`
   - Save this URL for frontend configuration

### Frontend Deployment (Netlify)

1. **Create Netlify Account:**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Create New Site:**
   - Click "New site from Git"
   - Connect GitHub repository
   - Netlify detects `netlify.toml` automatically

3. **netlify.toml Configuration:**
```toml
[build]
  base = "."
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20.19.0"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

4. **Configure Environment Variable:**
   - Go to Site Settings → Environment Variables
   - Add variable:
     - Key: `VITE_API_BASE`
     - Value: `https://your-backend.onrender.com`

5. **Deploy:**
   - Click "Trigger deploy"
   - Wait 1-2 minutes
   - Site is live!

### Post-Deployment

1. **Verify Backend:**
   ```bash
   curl https://your-backend.onrender.com/api/forums/categories
   ```

2. **Verify Frontend:**
   - Open `https://your-site.netlify.app`
   - Check browser console for errors
   - Try registering and logging in

3. **Configure CORS:**
   - Update `server/middleware/security.js`
   - Add Netlify URL to allowed origins

---

## 🔧 Environment Variables

### Frontend (.env - optional)

```env
# Backend API URL (required in production)
VITE_API_BASE=https://your-backend.onrender.com
```

### Backend (.env - optional, can use config.json instead)

```env
# Server Configuration
PORT=3000
HOST=0.0.0.0
NODE_ENV=production

# JWT Secret (auto-generated in Render)
JWT_SECRET=your-secret-key-here

# Data Directory (for Render persistent disk)
DATA_DIR=/var/data

# Stripe Configuration (optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# SMTP Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Netlify Environment Variables

Set in Netlify Dashboard → Site Settings → Environment Variables:
- `VITE_API_BASE` - Backend URL

### Render Environment Variables

Set in Render Dashboard → Service → Environment:
- `JWT_SECRET` - Auto-generated or manual
- `DATA_DIR` - `/var/data` (for persistent disk)
- Optional: Stripe, SMTP credentials

---

## ✅ Testing & Verification

### Functional Testing

1. **User Registration:**
   - Generate invite key (admin)
   - Register new account
   - Verify email validation
   - Check password strength requirements

2. **User Login:**
   - Login with credentials
   - Verify JWT token storage
   - Test "remember me" functionality
   - Test 2FA if enabled

3. **Forum Functionality:**
   - Browse forum categories
   - Create new thread
   - Reply to thread
   - Edit own posts
   - Delete own posts (if permitted)

4. **Admin Functions:**
   - Access admin panel
   - Create/edit forums
   - Manage users (ban/unban)
   - Generate invite keys
   - Manage roles and ranks

5. **Profile Management:**
   - Update profile information
   - Upload profile picture
   - Change password
   - Enable/disable 2FA

6. **Store:**
   - Browse products
   - Create test order
   - Test Stripe integration

### API Testing

Use curl or Postman:

```bash
# Test health
curl https://your-backend.onrender.com/api/forums/categories

# Test login
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"TestPass123"}'

# Test authenticated route
curl https://your-backend.onrender.com/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Security Testing

1. **Rate Limiting:**
   - Make multiple rapid requests
   - Verify 429 Too Many Requests response

2. **Input Validation:**
   - Try SQL injection attempts
   - Try XSS payloads
   - Verify sanitization

3. **Authentication:**
   - Try accessing protected routes without token
   - Try using expired token
   - Try using invalid token

### Performance Testing

1. **Page Load Times:**
   - Check with browser DevTools
   - Target: < 3 seconds

2. **API Response Times:**
   - Check Network tab
   - Target: < 500ms for most endpoints

3. **Database Operations:**
   - Monitor lowdb read/write times
   - Check file size growth

---

## 📚 Additional Resources

### Key Documentation Files

- **README.md** - Quick start guide
- **DEPLOYMENT.md** - Detailed deployment guide
- **START_HERE.md** - First-time setup instructions
- **QUICK_REFERENCE.md** - Common commands and URLs

### Useful Links

- Vue.js Docs: https://vuejs.org/guide/
- Vite Docs: https://vitejs.dev/guide/
- Express Docs: https://expressjs.com/
- lowdb GitHub: https://github.com/typicode/lowdb
- Netlify Docs: https://docs.netlify.com/
- Render Docs: https://render.com/docs

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--primary: #00ff88;           /* Accent green */
--primary-dark: #00cc6a;      /* Darker green */
--accent: #ff6b6b;            /* Red accent */

/* Background Colors */
--bg: #030c10;                /* Main background */
--surface: #0f1b22;           /* Card/panel background */
--surface-hover: #1a2930;     /* Hover state */

/* Text Colors */
--text: #e7f8ff;              /* Primary text */
--text-muted: #9bb0bd;        /* Secondary text */
--text-dim: #6b7f8c;          /* Tertiary text */

/* Border & Divider */
--border: rgba(0, 255, 136, 0.2);
--divider: rgba(255, 255, 255, 0.1);

/* Status Colors */
--success: #00ff88;
--error: #ff4444;
--warning: #ffaa00;
--info: #00aaff;
```

### Typography

- **Font Family:** Inter, system-ui, sans-serif
- **Headings:** Montserrat (bold, 700-800 weight)
- **Body:** Inter (regular, 400-500 weight)
- **Monospace:** Consolas, Monaco, Courier New

### Component Styling

- **Border Radius:** 8-12px for cards, 6px for buttons
- **Shadows:** Subtle glows with primary color
- **Transitions:** 0.2s ease for hover effects
- **Spacing:** 8px base unit (8, 16, 24, 32, etc.)

---

## 🔍 Troubleshooting

### Common Issues

1. **"Failed to fetch" errors:**
   - Check VITE_API_BASE is set correctly
   - Verify backend is running
   - Check CORS configuration

2. **Database not persisting:**
   - Ensure DATA_DIR is set correctly
   - Check disk mount in Render
   - Verify file permissions

3. **Images not uploading:**
   - Check uploads directory exists
   - Verify file size limits
   - Check permissions

4. **Email not sending:**
   - Verify SMTP configuration
   - Check console logs for fallback messages
   - Test SMTP credentials

5. **JWT token invalid:**
   - Check JWT_SECRET matches
   - Verify token hasn't expired
   - Check token format in Authorization header

---

## 📝 Summary Checklist

To recreate this website exactly, follow this checklist:

- [ ] Install Node.js 18+ or 20+
- [ ] Clone or create project directory structure
- [ ] Install frontend dependencies (`npm install` in root)
- [ ] Install backend dependencies (`npm install` in server/)
- [ ] Create all Vue components in src/
- [ ] Create backend server in server/index.js
- [ ] Create security middleware in server/middleware/security.js
- [ ] Initialize database with db.json structure
- [ ] Configure CORS and security headers
- [ ] Test locally (frontend on :5173, backend on :3000)
- [ ] Create Render account and deploy backend
- [ ] Create Netlify account and deploy frontend
- [ ] Configure VITE_API_BASE environment variable
- [ ] Test production deployment
- [ ] Configure custom domain (optional)
- [ ] Set up SMTP for emails (optional)
- [ ] Configure Stripe for payments (optional)

---

## 🎉 Congratulations!

You now have complete documentation to recreate the Unknown.cc forum website from scratch. This guide covers:

✅ **Complete architecture** - Frontend, backend, and data layer  
✅ **All dependencies** - Exact versions and configurations  
✅ **Full file structure** - Every directory and key file  
✅ **Database schema** - Complete data model  
✅ **API documentation** - All endpoints and their usage  
✅ **Security features** - Authentication, rate limiting, validation  
✅ **Deployment process** - Step-by-step for Netlify and Render  
✅ **Testing procedures** - How to verify everything works  

**Questions or issues?** Refer to the other documentation files in this repository for more specific guides on deployment, troubleshooting, and configuration.

---

**Created:** February 2026  
**Repository:** https://github.com/ryansmom077-star/Unkown.cc  
**License:** Private  
**Maintainer:** ryansmom077-star
