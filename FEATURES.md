# Complete Features Documentation - Unknown.cc

Comprehensive guide to all features in the Unknown.cc forum platform.

## Table of Contents

1. [Authentication](#authentication)
2. [Admin Panel](#admin-panel)
3. [User Features](#user-features)
4. [Forum System](#forum-system)
5. [Store & Payments](#store--payments)
6. [Support Tickets](#support-tickets)
7. [Profile Management](#profile-management)
8. [Security](#security)

---

## 1. Authentication

### Registration (`/register`)
- User provides username (3-20 chars), email, password (8+ chars, mixed case + number), and invite key
- Password hashed with bcrypt (10 rounds), account created with sequential UID
- JWT token generated (7-day expiry), user auto-logged in
- **DB:** Adds to `users`, increments `uidCounter`, marks invite key as used

### Login (`/login`)
- Verifies credentials, optional 2FA via 6-digit email code (10 min expiry)
- JWT stored in localStorage, "Remember Me" enables auto-login
- **DB:** Updates `lastIp`, logs to `accountLogs`

### 2FA (Profile → Security)
- **Enable/Disable:** Email verification code required
- **Login:** Code sent after password verification, 10-minute window
- **DB:** `twoFa: { enabled, code, codeExpiry }`

### Password Reset
- Request via email → 6-digit code (10 min expiry) → New password
- Rate limited, old codes invalidated

---

## 2. Admin Panel

**Access:** `/admin` (admin/manager only) - 9 management tabs

### Keys Tab
- **Generate:** 1-100 random alphanumeric keys
- **Revoke:** Mark keys as unusable (can't revoke used keys)
- **Display:** Key, creator, status, usage
- **API:** `POST /api/admin/keys/generate`, `POST /api/admin/keys/:keyId/revoke`
- **DB:** `keys: [{ id, key, createdBy, usedBy, revoked }]`

### Users Tab
- **Display:** UID, username, email, role, staff role, ban status, IP, roles
- **Search:** Real-time filter by username/email
- **Actions:** Ban (with duration/reason), change email/UID, assign roles/ranks, toggle staff, view profile
- **Create User:** Admin-created accounts without invite key
- **API:** `GET /api/admin/users`, `POST /api/admin/users/:userId/{ban,unban,change-email,change-uid,roles,rank,staff}`, `POST /api/admin/users/create`

### Banned Tab
- Shows banned users with reason, duration, dates, issuer
- Search by username, unban action
- **Ban Types:** Temporary (1d/7d/30d), Permanent, Auto-expiry
- **API:** `GET /api/admin/users?banned=true`, `POST /api/admin/users/:userId/unban`

### Ranks Tab
- Colored display badges with 14 permissions (forum_access, create_threads, create_posts, delete_own_posts, view_tickets, create_tickets, generate_invites, ban_users, delete_posts, delete_threads, manage_forum, change_user_email, change_user_uid, revoke_key_access)
- Create/edit/delete ranks, assign to users
- **API:** `GET/POST/PUT/DELETE /api/admin/ranks/:rankId`, `POST /api/admin/users/:userId/rank`

### Permissions Tab
- Custom roles for fine-grained access (vs ranks which are user-facing badges)
- Multiple roles per user, hierarchical positions
- **API:** `GET/POST/PUT/DELETE /api/admin/roles/:roleId`, `POST /api/admin/users/:userId/roles`

### Forums Tab
- Manage structure: Categories → Forums → Threads → Posts
- **Create Category:** Name, color, order
- **Create Forum:** Name, description, parent category
- Edit/delete (permanent, removes all content)
- **API:** `GET /api/forums/categories`, `POST /api/admin/forums/{categories,}`, `PUT/DELETE /api/admin/forums/:forumId`

### Settings Tab
- **Forum Toggle:** Enable/disable entire forum (staff can still access)
- **API:** `POST /api/admin/forum/toggle`
- **DB:** `forumStatus: { isOpen }`

### Products Tab
- Store product CRUD: name, description, price (cents), currency
- Displays on `/store`, Stripe integration, TOS required
- **API:** `GET /api/store/products`, `POST/PUT/DELETE /api/admin/products/:id`

### Account Logs Tab
- Audit trail: registration, login, password/email/UID changes, bans, role assignments, 2FA
- Display: timestamp, user, action, details, IP, user-agent
- Search by username, action type, date range
- **API:** `GET /api/admin/accountlogs`

---

## 3. User Features

### Home (`/`)
- Hero section with logo, CTAs to Forum and Store

### Members (`/members`)
- User directory: profile pic, username, UID, role badges, online status (5min), registration date
- Real-time search, staff can ban users

### Guide (`/guide`)
- Platform documentation, rules, FAQ

---

## 4. Forum System

### Forums (`/forum`)
- Categories with colored headers, forums grouped underneath
- Each forum shows: name, description, thread count, last post
- Create threads with title + content
- Permissions checked: `forum_access`, not `accessRevoked`

### Threads (`/thread/:id`)
- Original post + replies chronologically
- Shows: author pfp, username, rank badges, content, timestamp
- Reply via text area, staff can pin/lock/delete
- Requires `create_posts` permission

---

## 5. Store & Payments

### Store (`/store`)
- Product display with hero image/placeholder
- **Subscription Plans:** 1/3/6/12 months with discounts (10%/20%/30%)
- **Purchase Flow:** Select plan → Buy Now → Login check → TOS acceptance (checkbox + signature) → Stripe checkout → Order confirmation
- **Stripe Integration:** Frontend creates session, Stripe handles payment, webhook confirms
- **API:** `GET /api/store/products`, `POST /api/store/checkout`, `POST /api/store/webhook`, `GET /api/store/orders`
- **DB:** `orders: [{ id, productId, userId, price, months, paymentIntentId, status, tosAccepted, tosSignature }]`

### Terms (`/terms`)
- TOS display, required acceptance for purchases

---

## 6. Support Tickets

### Tickets (`/tickets`)
- **Create:** Subject, description, category (account/technical/billing/other)
- **List:** User's tickets or all (staff), tabs for Open/Closed
- **Details:** Full thread with responses, author, timestamps
- **Respond:** Text area, notifications sent
- **Actions:** Users close own tickets, staff close/manage all
- **API:** `GET/POST /api/tickets`, `POST /api/tickets/:id/{respond,close}`
- **DB:** `tickets: [{ id, subject, description, category, status, createdBy, responses: [] }]`

---

## 7. Profile Management

**Location:** `/profile/:userId?` - 4 tabs

### Profile Tab
- **View:** pfp, banner, UID, username, bio, signature, ranks/roles, registration date
- **Edit (own):** Bio, signature, image uploads with crop tool (zoom, drag positioning)
- **Upload:** PNG/JPG/WEBP/GIF → Crop preview → Save to `/uploads/`
- **Access Revoked:** Message shown, can redeem access key

### Invites Tab (if permission granted)
- Stats: today/month/total invites sent
- Generate 1-10 keys, view list (status, date, copy button)

### Security Tab
- Email display (admin-only changes)
- **Change Password:** Current + new + confirm → Email confirmation
- **2FA:** Enable/disable via email code verification
- **Password Reset:** Request link → Email code → New password

### Notifications Tab
- List: type, message, timestamp, read/unread status
- Types: thread replies, @mentions, system, ticket responses, account actions
- Actions: mark read, delete, navigate to content

---

## 8. Security

### Rate Limiting
- **Auth Routes:** 5 req/15min (login, register)
- **General API:** 100 req/15min
- **Strict Routes:** 10 req/hour (2FA, password reset)
- Tracks by IP, returns 429 when exceeded

### Input Validation
- **Libraries:** express-validator, express-mongo-sanitize, hpp
- **Rules:** Username (alphanumeric, 3-20), Email (valid format), Password (8+, mixed case+number), Invite Key (alphanumeric, 4+)
- Prevents NoSQL injection, XSS, parameter pollution

### Security Headers (Helmet)
- X-Content-Type-Options: nosniff, X-Frame-Options: DENY, X-XSS-Protection, Strict-Transport-Security, Content-Security-Policy
- Prevents XSS, clickjacking, forces HTTPS

### CORS
- Production: Netlify domain only, Development: localhost
- Credentials enabled, methods: GET/POST/PUT/DELETE

### JWT Tokens
- HS256, 7-day expiry, secret from env
- Contains: `{ id, username, role, staffRole, roles[], iat, exp }`
- Stored in localStorage, sent as `Authorization: ******
- Validated on all protected routes

### Password Security
- bcrypt, 10 salt rounds
- Requirements: 8+ chars, mixed case, number
- Only hash stored, never plain text

### IP Tracking
- Logs: registeredIp, lastIp, ips[{ ip, timestamp }]
- For security monitoring, compliance

### Session Security
- Token blacklisting on logout
- Session validation middleware
- Suspicious activity monitoring
- Device tracking (user-agent)

---

## Summary

**Platform Coverage:**
- ✅ Admin Panel - 9 tabs (keys, users, banned, ranks, permissions, forums, settings, products, logs)
- ✅ Authentication - Registration, login, 2FA, password reset
- ✅ Forums - Categories → Forums → Threads → Posts
- ✅ Store - Products, subscriptions, Stripe, TOS
- ✅ Tickets - Creation, responses, staff management
- ✅ Profile - Edit, uploads, invites, security, notifications
- ✅ Security - Rate limiting, validation, encryption, monitoring

Complete forum platform with e-commerce and support capabilities.
