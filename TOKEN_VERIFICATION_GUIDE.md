# Token Expiry & Deletion Verification Guide

## ✅ What's Working Correctly

### 1. **Token Deletion Functions** (`client.js`)
```javascript
localStorage.removeItem("token");
localStorage.removeItem("user");
```
- ✅ Removes both token and user data
- ✅ Handles 401 responses from backend
- ✅ Redirects to `/login` page

### 2. **Token Expiry Check** (`token.utils.js`)
- ✅ `isTokenExpired()` - Correctly checks if token is expired
- ✅ `getTokenExpiryTime()` - Correctly extracts expiry time from JWT
- ✅ Handles errors with try-catch

### 3. **Auto-Logout Hook** (`useAuth.js`)
- ✅ Sets timeout to logout exactly when token expires
- ✅ Clears timeout on component unmount
- ✅ Handles already-expired tokens immediately

---

## 🔧 Issues Fixed

### Issue 1: Logout Redirect Path
**Problem:** `useAutoLogout` redirected to `/admin` instead of `/login`
**Fix:** Changed to `/login` ✅

### Issue 2: Logout Function Scope
**Problem:** `logout()` was private (couldn't be imported/tested)
**Fix:** Exported as `export const logout()` ✅

---

## 🧪 How to Test Token Expiry

### Test 1: Manual Token Test (Browser Console)
```javascript
// 1. Login first
// 2. Open browser DevTools (F12)
// 3. Go to Console tab
// 4. Paste this:

import { runAllTests } from '@/modules/admin/features/auth/__tests__/auth.test.js'
runAllTests()
```

Expected output:
```
✓ Token and User are in localStorage
✓ Is Expired: false
✓ Time Remaining: 0.98 hours
```

### Test 2: Check LocalStorage
```javascript
// In browser console:
console.log(localStorage.getItem("token"))
console.log(localStorage.getItem("user"))

// Should see JWT token and user object
```

### Test 3: Verify Axios Interceptor
```javascript
// In browser console, make a request with expired token:
import API from '@/api/client.js'
API.get('/protected-endpoint')

// If token is expired/invalid, should see:
// 1. 401 response from backend
// 2. Token removed from localStorage
// 3. Redirect to /login
```

### Test 4: Wait for 1-Hour Expiry (Real-time Test)
1. **Login** to admin panel
2. **Check token expiry time:**
   ```javascript
   import { getTokenExpiryTime } from '@/modules/admin/features/auth/utils/token.utils.js'
   new Date(getTokenExpiryTime(localStorage.getItem("token")))
   // Should show time 1 hour from now
   ```
3. **Wait 1 hour** (or mock time in DevTools)
4. **Verify:** Should auto-logout and redirect to `/login`

---

## 📊 Token Lifecycle Flow

```
1. User Logs In
   ↓
2. Token stored in localStorage (exp: now + 1h)
   ↓
3. useAutoLogout hook runs
   ├─ Calculates time until expiry
   ├─ Sets timeout to auto-logout
   └─ Sets cleanup to clear timeout on unmount
   ↓
4. Option A: Token expires naturally
   ├─ Timeout fires after 1 hour
   ├─ logout() removes token & user
   └─ Redirects to /login ✅
   ↓
   Option B: API returns 401
   ├─ Axios interceptor catches error
   ├─ Removes token & user
   └─ Redirects to /login ✅
```

---

## ✨ Verification Checklist

- [ ] Token is created with 1-hour expiry (backend verified)
- [ ] `localStorage.getItem("token")` returns a valid JWT
- [ ] `localStorage.getItem("user")` returns user object
- [ ] After 1 hour, both are removed automatically
- [ ] Manual logout works (token removed)
- [ ] 401 responses trigger token deletion
- [ ] Redirect to `/login` happens on logout
- [ ] No console errors in browser DevTools

---

## 🚨 Potential Issues to Monitor

1. **If token doesn't auto-delete after 1 hour:**
   - Check browser console for errors
   - Verify token expiry time is correct: `new Date(getTokenExpiryTime(...))`
   - Check if `useAutoLogout()` is called in App component

2. **If redirect to /login fails:**
   - Check if `/login` route exists in your router
   - Verify no JavaScript errors in console

3. **If interceptor not working:**
   - Verify API client is imported and used
   - Check if backend returns 401 for expired tokens

---

## 📝 Files Modified
- `src/modules/admin/features/auth/hooks/useAuth.js` - Fixed logout redirect & exported logout function
- `src/modules/admin/features/auth/__tests__/auth.test.js` - Created test suite

