# 🧪 Test Your Backend

Your backend is deployed at: **https://unkown-cc.onrender.com**

## Quick Backend Tests

### Test 1: Check if Backend is Running

Open this URL in your browser:
```
https://unkown-cc.onrender.com/api/forums/categories
```

**Expected Result**: You should see JSON data with forum categories

**If you see an error**: Wait 1-2 minutes. Render services can take a moment to wake up if they've been idle.

---

### Test 2: Check Backend Root

Open this URL:
```
https://unkown-cc.onrender.com
```

**Expected Result**: May show "Cannot GET /" - this is normal. The API is at `/api/*` routes.

---

### Test 3: Using curl (Command Line)

```bash
# Test API endpoint
curl https://unkown-cc.onrender.com/api/forums/categories

# Test with headers
curl -I https://unkown-cc.onrender.com/api/forums/categories
```

**Expected**: JSON response with forum data

---

## Common Backend Issues

### Backend is Sleeping (Cold Start)
**Symptoms**: First request takes 30+ seconds or times out

**Solution**: 
- Render free tier services sleep after 15 minutes of inactivity
- First request wakes them up (takes 30-60 seconds)
- Subsequent requests are fast
- Upgrade to paid tier to avoid sleeping

### DNS Not Resolved Yet
**Symptoms**: "Could not resolve host" error

**Solution**:
- Wait 2-3 minutes for DNS to propagate
- Try again
- Check Render dashboard for service status

### Service Not Started
**Symptoms**: Connection refused or 503 errors

**Solution**:
1. Go to Render dashboard: https://dashboard.render.com
2. Check service status (should be green/running)
3. View logs for errors
4. Check "Events" tab for deployment status

---

## API Endpoints Available

Once backend is running, these endpoints should work:

### Public Endpoints (No Auth Required)
```
GET  /api/forums/categories          - List forum categories
GET  /api/forums/:forumId/threads    - List threads in a forum
GET  /api/threads/:threadId          - Get thread details
GET  /api/threads/:threadId/posts    - Get posts in thread
```

### Auth Endpoints
```
POST /api/auth/register              - Register new user
POST /api/auth/login                 - Login user
POST /api/auth/logout                - Logout user
GET  /api/auth/me                    - Get current user
```

### Admin Endpoints (Requires Admin Auth)
```
GET  /api/admin/users                - List all users
GET  /api/admin/keys                 - List invite keys
POST /api/admin/keys/generate        - Generate invite key
... (many more admin endpoints)
```

---

## Test with Browser DevTools

1. Open your browser
2. Press F12 (DevTools)
3. Go to Console tab
4. Run:
```javascript
fetch('https://unkown-cc.onrender.com/api/forums/categories')
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(err => console.error('Error:', err))
```

**Expected**: Should log forum categories data

---

## Verify CORS is Working

Your backend should allow requests from any origin in development. Test CORS:

```bash
curl -H "Origin: https://exquisite-tanuki-2c779a.netlify.app" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://unkown-cc.onrender.com/api/forums/categories
```

**Expected**: Should return CORS headers

---

## Check Render Dashboard

1. Go to: https://dashboard.render.com
2. Find your service: `forum-backend` or similar
3. Check:
   - ✅ Status: Running (green)
   - ✅ Last deployment: Successful
   - ✅ Logs: No errors
   - ✅ Events: Service started

---

## Backend URL Reference

| Purpose | URL |
|---------|-----|
| **Backend Base** | https://unkown-cc.onrender.com |
| **API Base** | https://unkown-cc.onrender.com/api |
| **Test Endpoint** | https://unkown-cc.onrender.com/api/forums/categories |
| **Render Dashboard** | https://dashboard.render.com |

---

## Next Steps

Once backend tests pass:
1. ✅ Backend is confirmed working
2. Add `VITE_API_BASE=https://unkown-cc.onrender.com` to Netlify
3. Redeploy Netlify
4. Test full application

See **CONFIGURE_NETLIFY.md** for detailed Netlify configuration steps.
