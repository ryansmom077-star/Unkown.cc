# Profile System Guide - Unknown Forums

This guide provides a detailed description of how user profiles work in the Unknown Forums application.

## Table of Contents

1. [Overview](#overview)
2. [Profile Features](#profile-features)
3. [Profile Tabs](#profile-tabs)
4. [Profile Customization](#profile-customization)
5. [Image Upload & Cropping](#image-upload--cropping)
6. [Invitations System](#invitations-system)
7. [Notifications System](#notifications-system)
8. [Security Settings](#security-settings)
9. [Access Management](#access-management)
10. [Technical Details](#technical-details)

## Overview

The Unknown Forums profile system provides users with a comprehensive dashboard to manage their account, customize their appearance, view notifications, manage invitations, and configure security settings. Each user has a unique profile accessible via `/profile/:id` or `/profile` (for viewing your own profile).

## Profile Features

### Basic Profile Information

Every user profile displays:

- **Username**: The user's display name
- **UID (User ID)**: A unique numeric identifier for each user
- **Profile Picture (PFP)**: A customizable avatar image
- **Banner**: A customizable header banner image
- **Bio**: A personal description (editable by the user)
- **Signature**: A signature that appears in forum posts
- **Member Since**: The date the user joined the platform
- **Custom Rank**: Optional rank badge (configurable by staff)

### Profile Access

- **Own Profile**: Users can access their own profile by:
  - Navigating to `/profile` (without an ID)
  - Clicking on their username in the navigation
  
- **Other Users' Profiles**: View other users' profiles by:
  - Navigating to `/profile/:userId`
  - Clicking on usernames in forum threads or member lists

## Profile Tabs

The profile page has four main tabs (own profile only shows all four, viewing others shows only the Profile tab):

### 1. Profile Tab

The main profile tab displays and allows editing of:

- **Profile Picture (PFP)**: 280x280px circular image
- **Banner**: 640x200px rectangular header image
- **Bio**: Text description about yourself
- **Signature**: Text that appears in your forum posts

**Edit Mode**: Click "Edit Profile" to enter edit mode where you can:
- Upload new profile picture
- Upload new banner
- Edit bio text
- Edit signature text
- Click "Save Changes" to save or "Cancel" to discard

### 2. Notifications Tab

Displays all notifications for the current user, including:

- **Unread Count Badge**: Shows number of unread notifications
- **Notification Types**:
  - Invite key notifications (with special display showing the key)
  - Forum notifications
  - System messages
  
**Actions**:
- Mark individual notifications as read
- Delete individual notifications
- "Mark All as Read" button to clear all unread notifications

**Notification Display**:
- Unread notifications have a green left border and highlighted background
- Read notifications have a gray left border and dimmer background
- Each notification shows title, message, timestamp, and any special data

### 3. Invites Tab

Manage invitation codes for the forum:

**Statistics Displayed**:
- Invitations sent today
- Invitations sent this month
- Total invitations sent

**Invitation Table**:
- Date generated
- Invitation code (unique key)
- Registered user (who used the code)
- Status (unused/used/revoked)

**Staff Features**:
- Staff members (admin/manager) can generate new invitation codes
- Select quantity (1-25) and click "Generate Invites"

### 4. Security Tab

Manage account security settings:

#### Two-Factor Authentication (2FA)
- **Status Display**: Shows if 2FA is enabled or disabled
- **Enable/Disable Process**:
  1. Click "Send Enable Code" or "Send Disable Code"
  2. Check your email for the 6-digit code
  3. Enter the code in the input field
  4. Click "Confirm" to apply changes

#### Password Reset
- **Email Display**: Shows the email associated with your account
- **Reset Process**:
  1. Click "Send Reset Code"
  2. Check your email for the reset code
  3. Enter the reset code and new password
  4. Click "Update Password" to change your password

## Profile Customization

### Editing Your Profile

1. Navigate to your profile (`/profile`)
2. Click the "Edit Profile" button
3. Modify any of the following:
   - Bio text
   - Signature text
   - Profile picture (via upload)
   - Banner image (via upload)
4. Click "Save Changes" to apply

### Profile Picture (PFP) Upload

**Supported Formats**: PNG, JPG, WEBP, GIF

**Upload Process**:
1. In edit mode, click the edit icon (✎) on your profile picture
2. Select an image file from your device
3. Use the crop/zoom tool to adjust the image
4. Click "Apply" to confirm
5. Click "Save Changes" to upload

**Default Display**: If no profile picture is uploaded, displays the first letter of your username in a gradient circle.

### Banner Upload

**Supported Formats**: PNG, JPG, WEBP, GIF

**Upload Process**:
1. In edit mode, click "📷 Upload Banner" button on the banner area
2. Select an image file from your device
3. Use the crop/zoom tool to adjust the image (640x200px)
4. Click "Apply" to confirm
5. Click "Save Changes" to upload

**Default Display**: If no banner is uploaded, shows a gradient placeholder with "No banner" text.

## Image Upload & Cropping

The profile system includes an advanced image cropping tool:

### Crop Modal Features

- **Aspect Ratio**: 
  - Profile Picture: 1:1 (280x280px circular crop)
  - Banner: 3.2:1 (640x200px rectangular crop)
  
- **Controls**:
  - **Drag**: Click and drag the image to reposition
  - **Zoom Slider**: Adjust zoom level from 1x to 3x
  - **Apply**: Save the cropped image
  - **Cancel**: Discard changes

### Readjust Feature

After uploading an image, you can readjust the crop:
1. In edit mode, click the "Readjust" button
2. The crop modal reopens with your current image
3. Adjust position and zoom as needed
4. Click "Apply" and "Save Changes"

### Image Storage

- Images are uploaded as base64 data URLs to the backend
- The backend converts them to image files and stores them in `/uploads/`
- Stored with unique filenames using nanoid for collision prevention
- Only allowed MIME types are accepted: PNG, JPEG, WEBP, GIF

## Invitations System

The Unknown Forums uses an invitation-based registration system.

### For Regular Users

- View all invitations you've sent
- Track which invitations were used and by whom
- Monitor invitation statistics

### For Staff Members

Staff members (admins and managers) have additional capabilities:

- **Generate Invitations**: Create 1-25 invitation codes at once
- **Track Usage**: Monitor platform growth through invitation statistics
- **Invitation Limits**: Built-in rate limiting prevents abuse

### Invitation Lifecycle

1. **Generated**: Staff member creates invitation code
2. **Unused**: Code is available for registration
3. **Used**: A user registers with the code
4. **Revoked**: Code is disabled (if access is revoked)

## Notifications System

The notification system keeps users informed of important events.

### Notification Types

1. **Invite Key Notifications**: 
   - Special display with formatted key
   - Shows sender information
   - Allows easy copying of the invitation code

2. **General Notifications**:
   - Forum activity
   - System messages
   - Administrative notices

### Notification States

- **Unread**: Green highlight and border, counts toward unread badge
- **Read**: Gray styling, no longer counts as unread

### Notification Management

- **Individual Actions**: Mark as read or delete per notification
- **Bulk Actions**: "Mark All as Read" for all unread notifications
- **Automatic Loading**: Notifications load when switching to the notifications tab

## Security Settings

### Two-Factor Authentication (2FA)

Enhanced security through email-based two-factor authentication:

**Enable 2FA**:
1. Navigate to Security tab
2. Click "Send Enable Code"
3. Receive 6-digit code via email
4. Enter code and click "Confirm"
5. 2FA is now enabled

**Disable 2FA**:
1. Navigate to Security tab
2. Click "Send Disable Code"
3. Receive 6-digit code via email
4. Enter code and click "Confirm"
5. 2FA is now disabled

**Benefits**: Adds an extra layer of security by requiring email verification for login.

### Password Reset

Users can reset their password directly from the profile:

1. Click "Send Reset Code" in Security tab
2. Check email for reset code
3. Enter reset code and new password
4. Click "Update Password"
5. Password is immediately updated

**Note**: This is different from the forgot-password flow and requires being logged in.

## Access Management

### Access Revocation

If a user's forum access is revoked:

- They cannot access forum pages (`/forum`, `/thread/:id`)
- They are redirected to their profile with a warning banner
- They can still view their profile and other non-forum pages

### Access Restoration

Users with revoked access can restore it:

1. A red warning banner appears on their profile
2. Enter a new access key in the provided input field
3. Click "Redeem Key"
4. If valid, access is immediately restored
5. The user object is updated in localStorage

**Key Features**:
- Keys are validated by the backend
- Invalid keys show an error message
- Successful redemption updates both backend and frontend state

## Technical Details

### Frontend Architecture

**Component**: `/src/views/Profile.vue`
- Built with Vue 3 Composition API
- Uses `ref` and `computed` for reactive state
- Route-aware using Vue Router

**Key Features**:
- Lazy-loading of tab data (only loads when switching tabs)
- Image preview before upload
- Real-time crop preview
- Responsive design with mobile support

### Backend API Endpoints

**Profile Management**:
- `GET /api/users/:userId/profile` - Fetch user profile data
- `POST /api/users/profile` - Update own profile (requires auth)
- `PUT /api/users/profile` - Legacy update endpoint

**Invitations**:
- `GET /api/users/invites` - Fetch user's invitations
- `POST /api/users/invites/generate` - Generate new invites (staff only)

**Notifications**:
- `GET /api/notifications` - Fetch user notifications
- `POST /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification
- `POST /api/notifications/read-all` - Mark all as read

**Security**:
- `GET /api/users/security` - Fetch security settings
- `POST /api/auth/2fa/request-enable` - Request 2FA enable code
- `POST /api/auth/2fa/enable` - Verify and enable 2FA
- `POST /api/auth/2fa/request-disable` - Request 2FA disable code
- `POST /api/auth/2fa/disable` - Verify and disable 2FA
- `POST /api/auth/reset/request` - Request password reset code
- `POST /api/auth/reset/confirm` - Confirm password reset

**Access Management**:
- `POST /api/users/redeem-key` - Redeem access key

### Authentication & Authorization

**Authentication**: All profile modification endpoints require a valid JWT token in the `Authorization: Bearer <token>` header.

**Authorization Levels**:
- **Regular Users**: Can view and edit own profile, view others' profiles
- **Staff (Admin/Manager)**: Can generate invitations, modify custom ranks
- **Access-Revoked Users**: Cannot access forum, but can view profile and redeem keys

### Data Storage

**Database**: Uses lowdb (JSON file-based database)
- User profiles stored in `users` collection
- Each user has a `profile` object containing customization data
- Images stored as file paths (e.g., `/uploads/pfp_abc123.png`)
- Notifications stored in separate `notifications` collection
- Invitations stored in `invitations` collection

**User Profile Structure**:
```json
{
  "id": "user_id",
  "uid": 12345,
  "username": "username",
  "email": "user@example.com",
  "profile": {
    "pfp": "/uploads/pfp_abc123.png",
    "banner": "/uploads/banner_xyz789.png",
    "bio": "User bio text",
    "signature": "User signature",
    "customRank": "rank_id"
  },
  "accessRevoked": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Image Processing

**Upload Flow**:
1. Client uploads image as base64 data URL
2. Backend validates MIME type (PNG, JPEG, WEBP, GIF only)
3. Backend decodes base64 to binary
4. Backend saves as file with unique name (using nanoid)
5. Backend returns file path (`/uploads/filename.ext`)
6. Path stored in user's profile object

**URL Resolution**:
- Server URLs: Prefixed with `API_BASE` (e.g., `http://localhost:3000/uploads/...`)
- External URLs: Used as-is
- Data URLs: Used as-is for client-side preview

### Security Considerations

1. **Image Validation**: Only specific MIME types allowed
2. **File Size**: Base64 encoding and server limits prevent excessively large files
3. **Authentication**: All profile updates require valid JWT
4. **Authorization**: Users can only edit their own profiles
5. **XSS Prevention**: User-generated content is displayed safely (Vue's automatic escaping)
6. **Access Control**: Revoked users are blocked from forum access at route level

## Best Practices

### For Users

1. **Profile Pictures**: Use square images for best results
2. **Banners**: Use wide, rectangular images (3:1 ratio recommended)
3. **Bio**: Keep it concise and relevant
4. **Security**: Enable 2FA for enhanced account protection
5. **Invitations**: Only share invitation codes with trusted individuals

### For Administrators

1. **Access Revocation**: Only revoke access when necessary
2. **Invitation Management**: Monitor invitation usage to prevent abuse
3. **Custom Ranks**: Assign ranks appropriately to maintain community structure
4. **Regular Audits**: Check notification system and user feedback

## Troubleshooting

### Common Issues

**Profile not loading**:
- Check authentication token in localStorage
- Verify API connection
- Check browser console for errors

**Image upload fails**:
- Ensure image is PNG, JPG, WEBP, or GIF
- Check file size (very large files may fail)
- Try a different image format

**Can't access forum**:
- Check if access has been revoked
- Look for red warning banner on profile
- Contact staff for new access key if needed

**Notifications not appearing**:
- Refresh the page
- Check that you're on the Notifications tab
- Verify authentication is valid

**2FA code not received**:
- Check spam/junk folder
- Verify email address in Security tab
- Wait a few minutes and try again
- Contact support if issue persists

## Summary

The Unknown Forums profile system is a comprehensive user management solution that provides:

- **Personalization**: Custom avatars, banners, bios, and signatures
- **Communication**: Notification system for staying informed
- **Access Control**: Invitation-based registration and access management
- **Security**: Two-factor authentication and password reset capabilities
- **Social Features**: View other users' profiles and track community growth

The system is built with modern web technologies (Vue 3, Express) and follows best practices for security, user experience, and maintainability.
