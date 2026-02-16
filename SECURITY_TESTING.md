# Quick Security Testing Guide

## Test User Accounts
Create test accounts to verify security features:

```bash
# Register test user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!@#",
    "inviteKey": "your-invite-key"
  }'
```

## Testing Rate Limiting

### Test Login Rate Limit (10 req / 15 min)
```bash
# This should succeed
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"wrong"}';
  echo ""
done

# This should fail with 429
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"wrong"}'
```

### Test Brute Force Protection (5 attempts)
```bash
# After 5 failed attempts, account should be locked for 15 minutes
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"testuser","password":"WrongPassword123!"}';
  echo ""
done
```

## Testing Notifications

### Admin Send Invite to User
```bash
# Get admin token first, then:
curl -X POST http://localhost:3000/api/admin/send-invite-to-user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "userId": "user_id_here",
    "message": "Welcome! Here is your invite key."
  }'
```

### Get User Notifications
```bash
curl http://localhost:3000/api/notifications \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

## Testing Input Validation

### Password Validation
Test these passwords (should fail):
- `weak` - too short
- `password` - no uppercase
- `PASSWORD` - no lowercase  
- `Password` - no number
- `Password1` - no special char

This should pass:
- `Password1!` - meets all requirements

### Username Validation
Test these usernames (should fail):
- `ab` - too short
- `this_username_is_way_too_long_more_than_30` - too long
- `user name` - contains space
- `user@name` - invalid character

These should pass:
- `user123` - valid
- `user.name` - valid with dot
- `user-name` - valid with hyphen
- `user_name` - valid with underscore

## Testing Token Blacklisting

```bash
# 1. Login and get token
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test123!@#"}' \
  | jq -r '.token')

# 2. Use token (should work)
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer $TOKEN"

# 3. Logout (blacklist token)
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"

# 4. Try using token again (should fail with 401)
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

## Testing Security Headers

```bash
# Check security headers
curl -I http://localhost:3000/

# Look for:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# Content-Security-Policy: ...
```

## Testing CORS

```bash
# Test CORS preflight
curl -X OPTIONS http://localhost:3000/api/users/me \
  -H "Origin: http://malicious-site.com" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

## UI Testing

### Password Strength Meter
1. Navigate to `/register`
2. Type in password field
3. Observe real-time strength feedback
4. Verify all 5 requirements are checked

### Notifications
1. Login as admin
2. Go to admin panel → Users tab
3. Click "..." on any user
4. Click "Send Invite Key"
5. Enter optional message
6. Click "Send Invite Key"
7. Login as that user
8. Go to profile → Notifications tab
9. Verify invite key is visible
10. Test "Mark as Read" button
11. Test "Delete" button

### Brute Force Protection UI
1. Try logging in with wrong password 5 times
2. On 6th attempt, should see "Account locked" message
3. Wait 15 minutes or check server logs for lockout expiry

## Security Checklist

- [ ] Rate limiting works on all auth endpoints
- [ ] Brute force protection locks accounts
- [ ] Password requirements are enforced
- [ ] Password strength meter displays correctly
- [ ] Security headers are present in responses
- [ ] Token blacklisting works after logout
- [ ] Input validation prevents injection attacks
- [ ] Notifications system works end-to-end
- [ ] Admin can send invite keys to users
- [ ] Users can view notifications in profile
- [ ] CORS prevents unauthorized origins
- [ ] Request logging captures security events

## Common Issues

### Issue: Rate limit not working
**Solution**: Check that rate limit middleware is applied to the route

### Issue: Token still works after logout
**Solution**: Verify token is being blacklisted and checked in authMiddleware

### Issue: Password strength meter not showing
**Solution**: Check that PasswordStrength component is imported correctly

### Issue: Notifications not appearing
**Solution**: Verify notifications are being created in database and user is logged in

## Performance Notes

- Rate limiting is memory-based (resets on server restart)
- Token blacklist is memory-based (consider Redis for production)
- Login attempts are memory-based (consider persistent storage)

## Production Recommendations

Before deploying to production:

1. Set environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=<strong-random-secret>
   FRONTEND_URL=https://your-domain.com
   ```

2. Configure SMTP for email delivery

3. Consider Redis for:
   - Rate limiting persistence
   - Token blacklist persistence
   - Login attempt tracking

4. Set up monitoring and alerting

5. Enable HTTPS and update security headers accordingly

6. Review and test all security features in staging environment
