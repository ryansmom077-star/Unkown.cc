# How to Recreate Unknown.cc - Concise Guide for AI

## What This Website Is

A gaming forum platform with user authentication, forums, admin panel, tickets, and a store. Dark-themed modern UI built as a full-stack web application.

**Live URLs:**
- Frontend: https://exquisite-tanuki-2c779a.netlify.app
- Backend: https://unkown-cc.onrender.com

---

## Technology Stack

**Frontend:** Vue 3 + Vite + Vue Router  
**Backend:** Node.js + Express + lowdb (JSON database)  
**Auth:** JWT tokens + bcrypt passwords + optional 2FA  
**Payments:** Stripe integration  
**Deployment:** Netlify (frontend) + Render (backend)

---

## Project Structure

```
root/
├── src/                          # Vue.js frontend
│   ├── main.js                  # Entry: creates Vue app, handles JWT from localStorage/cookies
│   ├── App.vue                  # Root: header with nav, logo, user menu, logout
│   ├── router.js                # Routes with auth guards (requiresAuth, requiresStaff)
│   ├── styles.css               # Dark theme: --primary #00ff88, --bg #030c10
│   ├── lib/apiBase.js           # API_BASE from env or localhost:3000
│   ├── components/
│   │   └── PasswordStrength.vue # Password validation component
│   └── views/                   # 13 page components
│       ├── Home.vue             # Landing page with hero
│       ├── Login.vue            # Login with 2FA support
│       ├── Register.vue         # Registration (requires invite key)
│       ├── Forums.vue           # Forum categories and forums list
│       ├── Thread.vue           # Thread with posts
│       ├── Profile.vue          # User profile with image upload
│       ├── Admin.vue            # Admin panel (users, forums, keys, roles)
│       ├── Members.vue          # User list
│       ├── Tickets.vue          # Support tickets
│       ├── Store.vue            # Products with Stripe checkout
│       ├── Guide.vue            # User guide page
│       └── Terms.vue            # Terms of service
│
├── server/                       # Express backend
│   ├── index.js                 # Main server (2179 lines, all routes)
│   ├── middleware/security.js   # Rate limiting, validation, CORS, helmet
│   ├── db.json                  # Database (all data in JSON)
│   ├── config.json              # Admin IPs, SMTP config
│   └── uploads/                 # User uploaded images
│
├── index.html                    # HTML shell with <div id="app">
├── vite.config.js                # Vite config: port 5173
├── netlify.toml                  # Build: "npm run build", publish: "dist"
└── render.yaml                   # Service: rootDir "server", persistent disk /var/data
```

---

## Database Schema (server/db.json)

JSON file with these collections:

```javascript
{
  uidCounter: 1,  // Auto-increment for user display IDs
  
  users: [{
    id, uid, username, email, passwordHash,
    role: "user|staff",
    staffRole: "admin|manager|null",
    banned, banReason, banExpiresAt,
    profile: { pfp, banner, bio, signature },
    twoFa: { enabled, code, codeExpiry },
    ips: [{ ip, timestamp }],
    roles: ["role_id"],
    createdAt
  }],
  
  forumCategories: [{ id, name, color, order }],
  forums: [{ id, categoryId, name, description }],
  threads: [{ id, forumId, title, content, authorId, pinned, locked, createdAt }],
  posts: [{ id, threadId, content, authorId, createdAt }],
  
  roles: [{ id, name, color, permissions: {}, position }],
  ranks: [{ id, name, color, permissions: {forum_access, create_threads, ...}, createdAt }],
  
  keys: [{ id, key, createdBy, usedBy, revoked }],
  
  tickets: [{ id, subject, description, category, status, createdBy, responses: [] }],
  
  products: [{ id, name, description, price, currency }],
  orders: [{ id, productId, userId, paymentIntentId, status, tosAccepted }],
  
  accountLogs: [],
  notifications: []
}
```

---

## Key API Endpoints (server/index.js)

**Authentication:**
- `POST /api/auth/register` - Register with username, email, password, inviteKey
- `POST /api/auth/login` - Login, returns JWT token (7 day expiry)
- `POST /api/auth/verify-2fa` - Verify 6-digit email code

**Forums:**
- `GET /api/forums/categories` - Get all categories
- `GET /api/forums` - Get all forums
- `GET /api/threads` - Get all threads
- `GET /api/threads/:id` - Get thread with posts
- `POST /api/threads` - Create thread (auth required)
- `POST /api/threads/:id/posts` - Create post (auth required)

**Admin:**
- `POST /api/admin/keys/generate` - Generate invite keys
- `POST /api/admin/users/:userId/ban` - Ban user
- `POST /api/admin/users/:userId/unban` - Unban user
- `POST /api/admin/forums` - Create forum
- `POST /api/admin/roles` - Create role

**Store:**
- `GET /api/products` - Get products
- `POST /api/orders/create` - Create order (Stripe)

All protected routes check JWT via `authMiddleware`.

---

## Authentication Flow

1. **Registration:** User provides username/email/password/inviteKey → Server validates, hashes password (bcrypt 10 rounds), marks key as used → Returns JWT
2. **Login:** Server checks credentials → If 2FA enabled, generates 6-digit code, emails it → User verifies code → Returns JWT
3. **Token Storage:** Frontend stores JWT in localStorage, sends in `Authorization: Bearer <token>` header
4. **Route Guards:** Vue router checks token before navigation, backend middleware verifies on each request

---

## Security Features

**Rate Limiting:**
- Auth routes: 5 req/15min
- General API: 100 req/15min

**Input Validation:**
- express-validator for username/email/password
- express-mongo-sanitize prevents NoSQL injection
- hpp prevents parameter pollution

**Headers (helmet):**
- XSS protection, frame options, CSP, HSTS

**CORS:** Configured in middleware/security.js

---

## Key Frontend Patterns

**API Calls:**
```javascript
import { API_BASE } from '@/lib/apiBase.js'

const response = await fetch(`${API_BASE}/api/endpoint`, {
  headers: { 
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
```

**Router Guards:**
```javascript
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) next('/login')
  else next()
})
```

**Auth State:**
- JWT stored in localStorage as 'token'
- User object stored as 'user' (parsed from JWT)
- Remember me checkbox keeps token persistent

---

## Styling

**Dark Theme CSS Variables:**
```css
--primary: #00ff88;
--bg: #030c10;
--surface: #0f1b22;
--text: #e7f8ff;
--border: rgba(0, 255, 136, 0.2);
```

**Typography:**
- Headings: Montserrat, 700-800 weight
- Body: Inter, 400-500 weight

**Components:**
- Border radius: 8-12px
- Transitions: 0.2s ease
- Glow effects with primary color

---

## Deployment Configuration

**Frontend (Netlify):**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
Environment: `VITE_API_BASE=https://unkown-cc.onrender.com`

**Backend (Render):**
```yaml
# render.yaml
services:
  - type: web
    rootDir: server
    buildCommand: npm install
    startCommand: npm start
    disk:
      mountPath: /var/data
      sizeGB: 1
```
Environment: `JWT_SECRET` (auto-generated), `DATA_DIR=/var/data`

---

## Local Development

```bash
# Terminal 1 - Backend
cd server && npm install && npm start
# Runs on localhost:3000

# Terminal 2 - Frontend  
npm install && npm run dev
# Runs on localhost:5173
```

Frontend auto-connects to localhost:3000 in development.

---

## Recreation Steps

1. **Setup:** Create project structure, install dependencies (see package.json files)
2. **Frontend:** Create Vue components in src/views/, wire up router, implement API calls
3. **Backend:** Create Express server with all routes in server/index.js, implement JWT middleware
4. **Database:** Initialize db.json with default structure, implement lowdb read/write
5. **Security:** Add helmet, CORS, rate limiting, input validation middleware
6. **Test:** Run locally, verify registration/login/forums work
7. **Deploy:** Push to GitHub, connect Netlify (frontend) and Render (backend), set env vars

---

## Key Dependencies to Install

**Frontend:**
```bash
npm install vue@latest vue-router@^4.6.4
npm install -D vite@^7.3.1 @vitejs/plugin-vue@^6.0.4
```

**Backend:**
```bash
cd server
npm install express@^4.18.2 cors@^2.8.5 bcrypt@^5.1.0 jsonwebtoken@^9.0.0
npm install lowdb@^6.0.1 nanoid@^4.0.0 helmet@^8.1.0 express-rate-limit@^8.2.1
npm install express-validator@^7.3.1 nodemailer@^6.9.12 stripe@^20.3.1
npm install -D nodemon@^2.0.22
```

---

## Critical Files to Create

1. **src/main.js** - Vue app initialization, JWT parsing from localStorage/cookies
2. **src/App.vue** - Header with navigation, logo, user menu
3. **src/router.js** - All 13 routes with auth guards
4. **src/lib/apiBase.js** - API base URL configuration
5. **server/index.js** - Express server with 50+ API endpoints
6. **server/middleware/security.js** - All security middleware functions
7. **vite.config.js** - Vite dev server config
8. **netlify.toml** - Frontend deployment config
9. **render.yaml** - Backend deployment config

The codebase has 22 frontend files and 9 backend files totaling ~2,500 lines of actual code.

---

**That's it!** This is everything needed to recreate the website. Focus on the API flow (registration → JWT → authenticated requests), the database structure (lowdb JSON), and the deployment setup (Netlify + Render with env vars).
