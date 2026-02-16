# Complete Features Documentation - Unknown.cc

This document explains every feature, widget, and functionality in the Unknown.cc forum platform, with focus on admin features and how each system works.

---

## Table of Contents

1. [Authentication System](#authentication-system)
2. [Admin Panel Features](#admin-panel-features)
3. [User Features](#user-features)
4. [Forum System](#forum-system)
5. [Store & Payments](#store--payments)
6. [Support Ticket System](#support-ticket-system)
7. [Profile Management](#profile-management)
8. [Security Features](#security-features)

---

## 1. Authentication System

### Registration Feature
**Location:** `/register` page

**How It Works:**
1. User provides username, email, password, and invitation key
2. System validates inputs:
   - Username: 3-20 alphanumeric characters
   - Email: Valid email format
   - Password: 8+ chars with uppercase, lowercase, and number
   - Invite key: Must be valid and unused
3. Password is hashed with bcrypt (10 salt rounds)
4. Account is created with UID (sequential user number)
5. Invitation key is marked as used
6. JWT token is generated and returned
7. User is automatically logged in

**Database Impact:**
- Adds user to `users` collection
- Increments `uidCounter`
- Updates invite key in `keys` collection

---

### Login Feature
**Location:** `/login` page

**How It Works:**
1. User enters username/email and password
2. System verifies credentials
3. If 2FA is enabled:
   - Generates 6-digit code
   - Sends code via email (if SMTP configured)
   - User must enter code on verification page
   - Code expires in 10 minutes
4. If 2FA disabled or verified:
   - JWT token generated (7-day expiration)
   - Token stored in localStorage
   - User redirected to home/profile

**Remember Me:**
- If checked, token persists in localStorage
- Auto-login on next visit by decoding JWT from localStorage or cookies

**Database Impact:**
- Updates `lastIp` and adds entry to `ips` array
- Creates entry in `accountLogs` for login event

---

### 2FA (Two-Factor Authentication)
**Location:** Profile → Security tab

**How It Works:**

**Enabling 2FA:**
1. User clicks "Enable 2FA" in security settings
2. Backend generates 6-digit code
3. Code sent to user's email
4. User enters code to confirm
5. 2FA is activated for account

**Disabling 2FA:**
1. User clicks "Disable 2FA"
2. System sends verification code
3. User confirms with code
4. 2FA is deactivated

**Login with 2FA:**
- After password verification, code is sent
- User has 10 minutes to enter code
- Invalid/expired codes rejected
- Successful verification completes login

**Database Fields:**
```javascript
twoFa: {
  enabled: true/false,
  code: "123456",
  codeExpiry: timestamp
}
```

---

### Password Reset Feature
**Location:** Login page → "Forgot Password" link

**How It Works:**
1. User enters email address
2. Backend generates 6-digit reset code
3. Code sent via email (expires in 10 minutes)
4. User enters code + new password
5. Password is hashed and updated
6. Confirmation email sent
7. User can login with new password

**Security:**
- Rate limited to prevent abuse
- Old codes invalidated when new one generated
- Password must meet strength requirements

---

## 2. Admin Panel Features

**Access:** Only users with `staffRole: 'admin'` or `staffRole: 'manager'` can access `/admin`

The admin panel has 9 tabs with different management functions:

---

### 2.1 Invitation Keys Tab

**Purpose:** Manage invitation keys for new user registrations

**Features:**

**Generate Keys:**
- Input: Number of keys to generate (1-100)
- Click "Generate Keys" button
- Backend creates random alphanumeric keys
- Keys displayed in table with creation info

**Key Table Displays:**
- Key string (e.g., "ABC123XYZ")
- Created date/time
- Creator username
- Status: Unused / Used by [username]
- Actions: Revoke button

**Revoke Key:**
- Click revoke button
- Key marked as `revoked: true`
- Can no longer be used for registration
- Already-used keys cannot be revoked

**API Endpoints:**
- `POST /api/admin/keys/generate` - Generate keys
- `POST /api/admin/keys/:keyId/revoke` - Revoke key
- `GET /api/admin/keys` - List all keys

**Database:**
```javascript
keys: [{
  id: "key_id",
  key: "ALPHANUMERIC",
  createdBy: "user_id",
  createdAt: timestamp,
  usedBy: "user_id" or null,
  usedAt: timestamp or null,
  revoked: boolean
}]
```

---

### 2.2 Users Tab

**Purpose:** Manage all registered users

**Features:**

**User List:**
- Displays all users with:
  - UID (sequential number)
  - Username
  - Email
  - Role (user/staff)
  - Staff role (admin/manager)
  - Banned status
  - Registration date
  - Last IP address
  - Assigned roles

**Search Function:**
- Real-time search by username or email
- Filters user list as you type

**User Actions Menu:**
Click on user row to open action menu:

1. **Ban User**
   - Opens ban modal
   - Options: Ban duration (1d, 7d, 30d, permanent)
   - Reason field (required)
   - Submits ban with details
   - User cannot login while banned
   - Sets `banExpiresAt` for temporary bans

2. **Change Email**
   - Opens email change modal
   - Enter new email address
   - Updates user's email
   - Logs action in accountLogs

3. **Change UID**
   - Opens UID modal
   - Enter new display ID number
   - Updates user's sequential ID
   - Useful for reordering members

4. **Assign Role**
   - Lists available custom roles
   - Click to add role to user
   - User inherits role permissions

5. **Assign Rank**
   - Lists available ranks
   - Assigns display rank to user
   - Shows colored rank badge

6. **Toggle Staff**
   - Promotes user to staff role
   - Options: admin or manager
   - Grants access to admin panel

7. **View Profile**
   - Opens user's profile page
   - Shows all user information

**Create New User:**
- Button at top of page
- Form fields:
  - Username
  - Email  
  - Password
  - Staff role (user/admin/manager)
- Creates account without invite key
- Useful for admin-created accounts

**API Endpoints:**
- `GET /api/admin/users` - List all users
- `POST /api/admin/users/:userId/ban` - Ban user
- `POST /api/admin/users/:userId/unban` - Unban user
- `POST /api/admin/users/:userId/change-email` - Change email
- `POST /api/admin/users/:userId/change-uid` - Change UID
- `POST /api/admin/users/:userId/roles` - Assign role
- `POST /api/admin/users/:userId/rank` - Assign rank
- `POST /api/admin/users/:userId/staff` - Toggle staff status
- `POST /api/admin/users/create` - Create new user

---

### 2.3 Banned Users Tab

**Purpose:** View and manage banned users

**Features:**

**Banned User List:**
- Shows only banned users
- Displays:
  - Username
  - Ban reason
  - Ban duration (e.g., "7 days", "Permanent")
  - Ban issue date
  - Ban expiration date
  - Who issued the ban

**Search:**
- Filter banned users by username

**Unban Action:**
- Click "Unban" button
- Removes ban immediately
- User can login again
- Ban record kept in accountLogs

**Ban Types:**
- **Temporary:** Expires after set duration (1d, 7d, 30d)
- **Permanent:** Never expires automatically
- **Auto-expiry:** System automatically unbans when time reached

**API Endpoints:**
- `GET /api/admin/users?banned=true` - List banned users
- `POST /api/admin/users/:userId/unban` - Unban user

---

### 2.4 Ranks Tab

**Purpose:** Create and manage user rank system

**Features:**

**What are Ranks?**
- Display badges shown on user profiles/posts
- Have colored styling (#FF6B6B, #00ff88, etc.)
- Include permission sets
- Examples: "Beta Tester", "Moderator", "VIP"

**Create Rank:**
1. Enter rank name
2. Choose color (hex picker)
3. Set permissions:
   - Forum access
   - Create threads
   - Create posts
   - Delete own posts
   - View tickets
   - Create tickets
   - Generate invites
   - Ban users
   - Delete any post
   - Delete threads
   - Manage forum
   - Change user email
   - Change user UID
   - Revoke key access
4. Click "Create Rank"

**Rank Permissions Explained:**
- `forum_access`: Can view and access forums
- `create_threads`: Can start new forum threads
- `create_posts`: Can reply to threads
- `delete_own_posts`: Can delete their own posts
- `view_tickets`: Can view support tickets
- `create_tickets`: Can create support tickets
- `generate_invites`: Can generate invitation keys
- `ban_users`: Can ban other users
- `delete_posts`: Can delete any user's posts
- `delete_threads`: Can delete any thread
- `manage_forum`: Can create/edit forums
- `change_user_email`: Can change any user's email
- `change_user_uid`: Can change user UIDs
- `revoke_key_access`: Can revoke invitation keys

**Edit Rank:**
- Click rank in list
- Modify name, color, or permissions
- Save changes

**Delete Rank:**
- Click delete button
- Rank removed from system
- Users with this rank lose the assignment

**Assign to User:**
- Done from Users tab
- User gets rank badge
- Inherits rank permissions

**API Endpoints:**
- `GET /api/admin/ranks` - List all ranks
- `POST /api/admin/ranks` - Create rank
- `PUT /api/admin/ranks/:rankId` - Update rank
- `DELETE /api/admin/ranks/:rankId` - Delete rank
- `POST /api/admin/users/:userId/rank` - Assign rank to user

**Database:**
```javascript
ranks: [{
  id: "rank_id",
  name: "Beta Tester",
  color: "#FF6B6B",
  permissions: {
    forum_access: true,
    create_threads: true,
    // ... other permissions
  },
  createdAt: timestamp
}]
```

---

### 2.5 Permissions Tab

**Purpose:** Create custom roles with permission sets

**Features:**

**Roles vs Ranks:**
- **Roles:** Permission groups (backend)
- **Ranks:** Display badges with permissions (frontend+backend)
- Roles are more technical, ranks are user-facing

**Create Role:**
1. Enter role name
2. Choose color
3. Set position (hierarchy number)
4. Assign permission object
5. Click "Create Role"

**Role System:**
- Roles can be assigned to users
- Multiple roles per user possible
- Used for fine-grained access control
- Default role: "Member"

**Manage Roles:**
- View all roles in list
- Edit role properties
- Delete roles
- Assign to users from Users tab

**API Endpoints:**
- `GET /api/admin/roles` - List roles
- `POST /api/admin/roles` - Create role
- `PUT /api/admin/roles/:roleId` - Update role
- `DELETE /api/admin/roles/:roleId` - Delete role
- `POST /api/admin/users/:userId/roles` - Assign role

---

### 2.6 Forums Tab

**Purpose:** Manage forum structure (categories and forums)

**Features:**

**Forum Structure:**
```
Categories (top level)
└── Forums (sub-forums)
    └── Threads (topics)
        └── Posts (replies)
```

**Create Category:**
1. Enter category name
2. Choose color
3. Set order number (for sorting)
4. Click "Create Category"
5. Category appears in forum listing

**Create Forum:**
1. Enter forum name
2. Enter description
3. Select parent category
4. Click "Create Forum"
5. Forum appears under category

**Edit Forum:**
- Click edit button
- Modify name or description
- Save changes

**Delete Forum:**
- Click delete button
- Removes forum and all its threads/posts
- **Warning:** Permanent deletion

**Forum Display:**
- Categories grouped by color
- Forums listed under categories
- Thread counts shown
- Last post timestamp displayed

**API Endpoints:**
- `GET /api/forums/categories` - List categories and forums
- `POST /api/admin/forums/categories` - Create category
- `POST /api/admin/forums` - Create forum
- `PUT /api/admin/forums/:forumId` - Update forum
- `DELETE /api/admin/forums/:forumId` - Delete forum

**Database:**
```javascript
forumCategories: [{
  id: "cat_id",
  name: "CS2",
  color: "#FF6B6B",
  order: 1
}],

forums: [{
  id: "forum_id",
  categoryId: "cat_id",
  name: "General Discussion",
  description: "General topics",
  createdBy: "user_id",
  threadCount: 0
}]
```

---

### 2.7 Settings Tab

**Purpose:** Global forum settings

**Features:**

**Forum Open/Close Toggle:**
- Switch to enable/disable entire forum
- When closed:
  - Regular users cannot access forums
  - Staff can still access
  - Shows "Forum is currently closed" message
- When open:
  - All users with permissions can access
- Useful for maintenance or emergencies

**How It Works:**
1. Click toggle button
2. Backend updates `forumStatus.isOpen`
3. Middleware checks status on forum routes
4. Users redirected if forum is closed

**API Endpoint:**
- `POST /api/admin/forum/toggle` - Toggle forum status

**Database:**
```javascript
forumStatus: {
  isOpen: true
}
```

---

### 2.8 Products Tab

**Purpose:** Manage store products for sale

**Features:**

**Create Product:**
1. Enter product name
2. Enter description
3. Set price (in cents: 999 = $9.99)
4. Choose currency (USD, EUR, etc.)
5. Click "Create Product"

**Product List:**
- Shows all products
- Displays: Name, description, price, created date
- Actions: Edit, Delete

**Edit Product:**
- Click edit button
- Modify any field
- Save changes

**Delete Product:**
- Click delete button
- Product removed
- Past orders still show product name

**Product Integration:**
- Products shown on `/store` page
- Users can purchase with Stripe
- Orders recorded in database
- TOS acceptance required

**API Endpoints:**
- `GET /api/store/products` - List products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

**Database:**
```javascript
products: [{
  id: "prod_1",
  name: "Premium Access",
  description: "Full access to features",
  price: 999,  // in cents
  currency: "USD",
  createdAt: timestamp
}]
```

---

### 2.9 Account Logs Tab

**Purpose:** View all user account activity

**Features:**

**Log Types:**
- User registration
- Login attempts
- Password changes
- Email changes
- UID changes
- Ban/unban actions
- Role assignments
- 2FA enable/disable
- Password resets

**Log Display:**
- Timestamp
- User ID and username
- Action type
- Details (JSON data)
- IP address
- User agent (browser/device)

**Search Function:**
- Filter by username
- Filter by action type
- Date range filtering

**Use Cases:**
- Security auditing
- Troubleshooting user issues
- Tracking admin actions
- Compliance requirements

**API Endpoint:**
- `GET /api/admin/accountlogs` - List all logs

**Database:**
```javascript
accountLogs: [{
  id: "log_id",
  userId: "user_id",
  action: "login|register|password_change|...",
  details: {},
  ip: "127.0.0.1",
  userAgent: "Mozilla/5.0...",
  timestamp: timestamp
}]
```

---

## 3. User Features

### Home Page
**Location:** `/`

**Features:**
- Hero section with logo background
- Call-to-action buttons:
  - "Forum" - Navigate to forums
  - "Products" - Navigate to store
- Displays site branding
- Clean, modern dark theme

---

### Members Page
**Location:** `/members`

**Features:**

**Member List:**
- Shows all registered users
- Displays:
  - Profile picture
  - Username
  - UID
  - Assigned roles (colored badges)
  - Online status (green dot if active in last 5 minutes)
  - Registration date

**Search:**
- Real-time filter by username
- Instant results

**User Cards:**
- Click to view profile
- Shows role badges with colors
- Online/offline indicator

**Staff Actions:**
- If user is admin/manager:
  - Can ban users directly
  - Quick access to admin features

---

### Guide Page
**Location:** `/guide`

**Features:**
- User documentation
- Platform guidelines
- How-to instructions
- Community rules
- FAQ section

**Content Sections:**
- Getting Started
- Forum Usage
- Account Security
- Support Information

---

## 4. Forum System

### Forums Listing
**Location:** `/forum`

**Features:**

**Category Display:**
- Categories shown with colored headers
- Forums grouped under categories
- Each forum shows:
  - Forum name
  - Description
  - Thread count
  - Last post info (time, author)

**Forum Access:**
- Click forum to view threads
- Requires forum_access permission
- Checks if forum access revoked

**Create Thread:**
- Click "New Thread" button
- Fill in title and content
- Submit to create
- Thread appears in forum

**Thread List:**
- Shows all threads in forum
- Displays:
  - Thread title
  - Author
  - Reply count
  - Last post time
  - Pinned threads at top
  - Locked threads (no new replies)

---

### Thread View
**Location:** `/thread/:id`

**Features:**

**Thread Display:**
- Original post at top
- All replies in chronological order
- Each post shows:
  - Author profile picture
  - Username
  - User rank/role badges
  - Post content
  - Post timestamp
  - Quote/reply options

**Reply to Thread:**
- Text area at bottom
- Enter post content
- Click "Post Reply"
- Reply appears immediately

**Thread Actions (Staff Only):**
- Pin thread (appears at top of forum)
- Lock thread (prevent new replies)
- Delete thread
- Delete individual posts

**Permissions:**
- Must have `create_posts` permission
- Must not have `accessRevoked` flag
- Forum must be open

---

## 5. Store & Payments

**Location:** `/store`

**Features:**

### Product Display
- Hero image/placeholder for product
- Product name and description
- Pricing tiers

### Subscription Plans
**Available Plans:**
1. **1 Month** - Base price
2. **3 Months** - Save 10%
3. **6 Months** - Save 20%
4. **12 Months** - Save 30%

**Plan Selection:**
- Click plan card to select
- Shows total price
- Displays monthly breakdown
- Highlights savings

### Purchase Flow
1. Select subscription length
2. Click "Buy Now"
3. If not logged in → redirect to login
4. Redirect to Terms page
5. Accept TOS with signature (username)
6. Redirect to Stripe checkout
7. Complete payment
8. Order recorded in database
9. Confirmation displayed

### Stripe Integration
**How It Works:**
- Frontend creates checkout session
- Passes product ID and months
- Stripe handles payment form
- Webhook confirms payment
- Order status updated to "completed"

**API Endpoints:**
- `GET /api/store/products` - List products
- `POST /api/store/checkout` - Create Stripe session
- `POST /api/store/webhook` - Stripe webhook (payment confirmation)
- `GET /api/store/orders` - User's order history

**Database:**
```javascript
orders: [{
  id: "order_id",
  productId: "prod_1",
  userId: "user_id",
  price: 999,
  currency: "USD",
  months: 3,
  paymentIntentId: "pi_stripe_id",
  status: "pending|completed|failed",
  tosAccepted: true,
  tosSignature: "username",
  createdAt: timestamp
}]
```

---

### Terms of Service
**Location:** `/terms`

**Features:**
- Displays current TOS
- Last updated timestamp
- Admin can edit TOS content
- Required acceptance for purchases

**TOS Acceptance:**
- Checkbox to accept
- Signature field (enter username)
- Both required to proceed
- Recorded with order

---

## 6. Support Ticket System

**Location:** `/tickets`

**Features:**

### Create Ticket
1. Click "New Ticket" button
2. Fill in form:
   - Subject
   - Description
   - Category (account/technical/billing/other)
3. Submit ticket
4. Ticket created with status "open"

### Ticket List
**User View:**
- Shows user's own tickets
- Tabs: Open | Closed
- Each ticket shows:
  - Subject
  - Category
  - Status
  - Created date
  - Response count

**Staff View:**
- Can see ALL tickets
- Search by username
- Filter by status
- Priority indicators

### Ticket Details
- Click ticket to view full thread
- Shows original message
- All responses in order
- Each message shows:
  - Author
  - Timestamp
  - Message content
  - Staff badge if applicable

### Respond to Ticket
- Text area at bottom
- Enter response
- Click "Send Response"
- User/staff notified

### Ticket Actions
**User Actions:**
- View own tickets
- Create new tickets
- Respond to tickets
- Close own tickets

**Staff Actions:**
- View all tickets
- Respond to any ticket
- Close any ticket
- Change ticket status
- Assign tickets (if implemented)

**API Endpoints:**
- `GET /api/tickets` - List tickets
- `GET /api/tickets/:id` - Get ticket details
- `POST /api/tickets` - Create ticket
- `POST /api/tickets/:id/respond` - Add response
- `POST /api/tickets/:id/close` - Close ticket

**Database:**
```javascript
tickets: [{
  id: "ticket_id",
  subject: "Help needed",
  description: "I can't login",
  category: "account",
  status: "open|in_progress|closed",
  createdBy: "user_id",
  createdAt: timestamp,
  responses: [{
    id: "response_id",
    message: "Let me help you",
    authorId: "staff_id",
    createdAt: timestamp
  }]
}]
```

---

## 7. Profile Management

**Location:** `/profile` or `/profile/:userId`

**Features:**

### Profile Tabs
1. **Profile** - View/edit profile
2. **Invites** - Manage invitation keys (if permission granted)
3. **Security** - 2FA and password management
4. **Notifications** - User notifications

---

### Profile Tab

**View Profile:**
- Profile picture (pfp)
- Banner image
- UID display
- Username
- Bio text
- Signature
- Assigned ranks/roles
- Registration date
- Account stats

**Edit Profile (Own Profile):**
1. Click "Edit Profile" button
2. Editable fields:
   - Bio
   - Signature
   - Profile picture
   - Banner image
3. Save changes

**Profile Picture Upload:**
- Click "Upload" button
- Select image (PNG, JPG, WEBP, GIF)
- Image preview with crop tool
- Zoom slider
- Drag to position
- Click "Save" to upload
- Image saved to `/uploads/` folder
- Path stored in user profile

**Banner Upload:**
- Same process as profile picture
- Different dimensions (640x200)
- Displayed at top of profile

**Access Revoked Feature:**
- If admin revokes forum access
- User sees "Access Revoked" message
- Can request reinstatement
- Redeem access key if provided
- Cannot access forums until restored

---

### Invites Tab

**If User Has Permission:**
- Shows invite generation stats:
  - Today's invites
  - This month's invites
  - Total invites sent
- Generate invitation button
- List of generated keys
- Key status (unused/used)

**Generate Invites:**
1. Select number of keys (1-10)
2. Click "Generate"
3. Keys created
4. Can share keys with others

**Invite List:**
- Shows all keys user created
- Status: Used by [username] or Unused
- Created date
- Copy key button

---

### Security Tab

**Features:**

**Email Display:**
- Shows current email
- Cannot be changed by user (admin only)

**Change Password:**
1. Enter current password
2. Enter new password
3. Confirm new password
4. Submit
5. Password updated
6. Confirmation email sent

**Two-Factor Authentication:**
- Current status (enabled/disabled)
- "Enable 2FA" button if disabled
- "Disable 2FA" button if enabled

**Enable 2FA Process:**
1. Click "Enable 2FA"
2. Verification code sent to email
3. Enter code
4. 2FA activated
5. Will prompt for code on login

**Disable 2FA Process:**
1. Click "Disable 2FA"
2. Verification code sent to email
3. Enter code
4. 2FA deactivated

**Password Reset Request:**
- Link to request reset
- Sends code to email
- Enter code + new password
- Password updated

---

### Notifications Tab

**Features:**
- List of all notifications
- Shows:
  - Notification type
  - Message
  - Timestamp
  - Read/unread status

**Notification Types:**
- Thread replies
- @mentions
- System announcements
- Ticket responses
- Account actions

**Actions:**
- Mark as read
- Delete notification
- Click to navigate to related content

**Unread Counter:**
- Badge shows unread count
- Updated in real-time

---

## 8. Security Features

### Rate Limiting
**Purpose:** Prevent abuse and brute force attacks

**Tiers:**
1. **Auth Routes** (login, register)
   - 5 requests per 15 minutes
   - Prevents brute force login attempts

2. **General API**
   - 100 requests per 15 minutes
   - Covers all regular endpoints

3. **Strict Routes** (2FA, password reset)
   - 10 requests per hour
   - Extra protection for sensitive operations

**How It Works:**
- Express-rate-limit middleware
- Tracks requests by IP
- Returns 429 error when exceeded
- Client should implement retry logic

---

### Input Validation
**Libraries Used:**
- express-validator
- express-mongo-sanitize
- hpp (HTTP Parameter Pollution)

**Validation Rules:**
- **Username:** alphanumeric, 3-20 chars
- **Email:** valid email format
- **Password:** 8+ chars, uppercase, lowercase, number
- **Invite Key:** alphanumeric, 4+ chars

**Sanitization:**
- Removes NoSQL injection attempts
- Strips dangerous characters
- Prevents XSS attacks
- Validates all user input

---

### Security Headers (Helmet)
**Headers Applied:**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security
- Content-Security-Policy

**Purpose:**
- Prevent XSS attacks
- Prevent clickjacking
- Force HTTPS
- Control resource loading

---

### CORS Configuration
**Settings:**
- Production: Only allows Netlify domain
- Development: Allows localhost
- Credentials: Enabled
- Methods: GET, POST, PUT, DELETE
- Headers: Authorization, Content-Type

**Why Important:**
- Prevents unauthorized API access
- Controls which domains can make requests
- Protects against CSRF attacks

---

### JWT Token Security
**Token Details:**
- Algorithm: HS256
- Expiration: 7 days
- Secret: Environment variable

**Token Contents:**
```javascript
{
  id: "user_id",
  username: "username",
  role: "user|staff",
  staffRole: "admin|manager|null",
  roles: ["role_id"],
  iat: timestamp,
  exp: timestamp
}
```

**Storage:**
- Frontend: localStorage
- Sent in Authorization header
- Format: `Bearer <token>`

**Validation:**
- Every protected route checks token
- Expired tokens rejected (401)
- Invalid tokens rejected (401)
- Token decoded to get user info

---

### Password Security
**Hashing:**
- Algorithm: bcrypt
- Salt rounds: 10
- CPU-intensive (prevents brute force)

**Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Validated on both frontend and backend

**Storage:**
- Only hash stored in database
- Original password never stored
- Cannot be recovered (only reset)

---

### IP Tracking
**What's Tracked:**
- Registration IP
- Login IPs (history array)
- Last IP address
- Timestamps for each IP

**Purpose:**
- Security monitoring
- Detect suspicious activity
- Account takeover prevention
- Compliance/auditing

**Database:**
```javascript
user: {
  registeredIp: "127.0.0.1",
  lastIp: "192.168.1.1",
  ips: [
    { ip: "127.0.0.1", timestamp: 1234567890 },
    { ip: "192.168.1.1", timestamp: 1234567900 }
  ]
}
```

---

### Session Security
**Features:**
- Token blacklisting on logout
- Session validation middleware
- Suspicious activity monitoring
- Device tracking (user-agent)

**Logout Process:**
1. Token added to blacklist
2. LocalStorage cleared
3. Cookie deleted
4. Redirect to home

---

## Summary

This documentation covers all features in the Unknown.cc platform:

✅ **Admin Panel** - 9 comprehensive tabs for complete site management  
✅ **User Features** - Profile, forums, store, tickets  
✅ **Authentication** - Login, register, 2FA, password reset  
✅ **Forum System** - Categories, forums, threads, posts  
✅ **Store** - Products, subscriptions, Stripe payments  
✅ **Tickets** - Support system with staff responses  
✅ **Security** - Rate limiting, validation, encryption, monitoring  

Each feature is fully integrated with the backend API and database, providing a complete forum platform with e-commerce and support capabilities.
