# Render Environment Variables Configuration

Your backend is deployed at: **https://unkown-cc.onrender.com**

## Required Environment Variables in Render

Go to: https://dashboard.render.com → Your Service → Environment

### 1. JWT_SECRET (Already Auto-Generated)
```
Already set by Render automatically ✅
```

### 2. FRONTEND_URL (Add This)
```
Key:   FRONTEND_URL
Value: https://exquisite-tanuki-2c779a.netlify.app
```

This tells the backend which domain to allow CORS requests from.

### 3. NODE_ENV (Optional but Recommended)
```
Key:   NODE_ENV
Value: production
```

This enables production security settings.

---

## After Adding Environment Variables

1. Save the environment variables
2. Render will automatically redeploy your backend
3. Wait 2-3 minutes for deployment
4. Your frontend should work!

---

## Current CORS Configuration

The backend now allows these origins:
- `https://exquisite-tanuki-2c779a.netlify.app` (your Netlify site)
- `https://unknown.cc` (future custom domain)
- Any domain set in `FRONTEND_URL` environment variable

---

## Verify CORS is Working

Test with curl:
```bash
curl -I -H "Origin: https://exquisite-tanuki-2c779a.netlify.app" \
  https://unkown-cc.onrender.com/api/forums/categories
```

Look for these headers in the response:
```
Access-Control-Allow-Origin: https://exquisite-tanuki-2c779a.netlify.app
Access-Control-Allow-Credentials: true
```

---

## Complete Configuration Checklist

### Backend (Render)
- [x] Backend deployed at https://unkown-cc.onrender.com
- [x] CORS updated to allow Netlify domain
- [ ] **Add FRONTEND_URL environment variable** (optional but recommended)
- [ ] Redeploy backend (happens automatically after adding env var)

### Frontend (Netlify)
- [ ] **Add VITE_API_BASE environment variable**
  - Key: `VITE_API_BASE`
  - Value: `https://unkown-cc.onrender.com`
- [ ] Trigger new deployment

---

## Quick Links

- **Render Dashboard**: https://dashboard.render.com
- **Netlify Environment**: https://app.netlify.com/sites/exquisite-tanuki-2c779a/settings/env
- **Netlify Deploys**: https://app.netlify.com/sites/exquisite-tanuki-2c779a/deploys
