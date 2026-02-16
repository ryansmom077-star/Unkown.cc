# 🔧 Troubleshooting Render Service: srv-d65r8gur433s73ddpd9g

## Your Render Service Information

**Service ID:** `srv-d65r8gur433s73ddpd9g`  
**Repository:** `ryansmom077-star/Unkown.cc` (main branch)  
**URL:** `https://unkown-cc.onrender.com`

---

## 🚨 Current Issue

When I test your backend URL, it's not responding:
```bash
$ curl https://unkown-cc.onrender.com/
# No response - connection timeout or service not running
```

---

## 🔍 Step 1: Check Service Status

**Go to your service page:**
https://dashboard.render.com/web/srv-d65r8gur433s73ddpd9g

**Look for the status indicator:**

| Status | What It Means | What To Do |
|--------|---------------|------------|
| 🟢 **Live** | Service is running | Test URL, check logs if not working |
| 🟡 **Building** | Currently deploying | Wait 2-3 minutes |
| 🔴 **Build Failed** | Deployment error | Check logs for errors |
| 🔴 **Deploy Failed** | Started but crashed | Check logs for runtime errors |
| ⚪ **Suspended** | Free tier limit hit | Need to upgrade or wait for reset |

---

## 🔍 Step 2: Check Logs

**In your Render dashboard:**

1. Click on your service
2. Go to the **"Logs"** tab
3. Look at the most recent logs

**What to look for:**

### ✅ Good Signs (Service Working):
```
SMTP is not configured. Email features will log codes to console.
Server listening on http://0.0.0.0:10000
```

### ❌ Bad Signs (Service Failed):

**Port binding error:**
```
Error: listen EADDRINUSE: address already in use :::10000
```
**Fix:** Render should handle this automatically on redeploy

**Missing dependencies:**
```
Error: Cannot find module 'express'
```
**Fix:** Check that `npm install` ran successfully in build logs

**Database connection error:**
```
ECONNREFUSED or connection timeout to database
```
**Fix:** Check DATA_DIR environment variable

**Out of memory:**
```
JavaScript heap out of memory
```
**Fix:** Reduce data size or upgrade plan

---

## 🔍 Step 3: Check Events

**In Render dashboard:**

1. Go to **"Events"** tab
2. Look at recent deployments

**You should see:**
- ✅ "Deploy live" - Service started successfully
- 🟡 "Deploy started" - Currently deploying
- 🔴 "Deploy failed" - Something went wrong

---

## 😴 Is Your Service Sleeping?

**Render Free Tier Behavior:**
- Services **sleep after 15 minutes** of inactivity
- **First request takes 30-60 seconds** to wake up
- Subsequent requests are fast

**How to test:**

1. Visit: https://unkown-cc.onrender.com/
2. **Wait patiently for 30-60 seconds**
3. Page should load eventually

**If it loads:** Service was just sleeping! It's working now.

**If it never loads:** Service has a problem.

---

## 🔧 Step 4: Manual Deploy

If service failed or stuck, trigger a manual deploy:

1. Go to: https://dashboard.render.com/web/srv-d65r8gur433s73ddpd9g
2. Click **"Manual Deploy"** button
3. Select **"Clear build cache & deploy"**
4. Wait 2-3 minutes
5. Check logs for success/errors

---

## 🧪 Step 5: Test Your Backend

Once service shows as "Live", test these URLs:

### Test 1: Root Endpoint
```
https://unkown-cc.onrender.com/
```
**Expected response:**
```json
{
  "message": "Unknown.cc Forum API",
  "status": "running",
  "version": "1.0.0",
  ...
}
```

### Test 2: Health Check
```
https://unkown-cc.onrender.com/health
```
**Expected response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-16T...",
  "uptime": 123.45
}
```

### Test 3: API Endpoint
```
https://unkown-cc.onrender.com/api/forums/categories
```
**Expected response:**
```json
[
  {
    "id": "cat_cs2",
    "name": "CS2",
    "color": "#00ff88"
  }
]
```

---

## 🔍 Step 6: Check CORS

If backend loads but frontend still fails:

**In browser console (F12), run:**
```javascript
fetch('https://unkown-cc.onrender.com/api/forums/categories', {
  headers: {
    'Origin': 'https://exquisite-tanuki-2c779a.netlify.app'
  }
})
.then(r => r.json())
.then(d => console.log('✅ CORS Working:', d))
.catch(e => console.error('❌ CORS Error:', e))
```

**If CORS error:**
- Backend needs to redeploy with latest code (has CORS fix)
- Check that code was pushed to main branch
- Trigger manual deploy

---

## 🔍 Step 7: Check Environment Variables

**In Render dashboard:**

1. Go to **"Environment"** tab
2. Verify these are set:

| Variable | Value | Status |
|----------|-------|--------|
| `JWT_SECRET` | (auto-generated) | Should exist ✅ |
| `DATA_DIR` | `/var/data` | Should be set ✅ |
| `NODE_ENV` | `production` | Optional but recommended |
| `FRONTEND_URL` | `https://exquisite-tanuki-2c779a.netlify.app` | Optional |

---

## 🎯 Common Issues & Solutions

### Issue 1: Service Won't Start
**Symptom:** Deploy succeeds but service crashes immediately

**Check logs for:**
- Port binding errors
- Missing dependencies  
- Syntax errors in code

**Solution:**
- Fix error in code
- Push to GitHub
- Render will auto-deploy

### Issue 2: Free Tier Limits
**Symptom:** Service suspended or won't deploy

**Render free tier limits:**
- 750 hours/month of runtime
- 100GB bandwidth/month
- Services sleep after 15 min idle

**Solution:**
- Wait for monthly reset
- Upgrade to paid plan
- Reduce usage

### Issue 3: Build Fails
**Symptom:** "Build failed" status

**Common causes:**
- `npm install` failed
- Missing package.json
- Wrong Node.js version

**Solution:**
- Check build logs
- Fix package.json issues
- Ensure server/package.json exists

---

## 📋 Quick Checklist

- [ ] Go to https://dashboard.render.com/web/srv-d65r8gur433s73ddpd9g
- [ ] Check status (Live, Building, Failed?)
- [ ] Check Logs tab for errors
- [ ] Check Events tab for deployment history
- [ ] If sleeping, wait 60 seconds for wake up
- [ ] If failed, trigger manual deploy
- [ ] Test URL: https://unkown-cc.onrender.com/
- [ ] Confirm CORS headers present
- [ ] Update Netlify if URL is different
- [ ] Redeploy Netlify

---

## 🆘 Still Not Working?

**Tell me:**
1. What status does Render show? (Live, Failed, etc.)
2. What do the logs say? (Copy error message)
3. When you visit the URL, what happens?
4. Does it load after waiting 60 seconds?

**I can help debug based on the specific error!**

---

## Quick Links

- **Your Service**: https://dashboard.render.com/web/srv-d65r8gur433s73ddpd9g
- **Backend URL**: https://unkown-cc.onrender.com
- **Netlify Settings**: https://app.netlify.com/sites/exquisite-tanuki-2c779a/settings/env
- **GitHub Repo**: https://github.com/ryansmom077-star/Unkown.cc

---

**CHECK YOUR RENDER DASHBOARD NOW!** 🔍
