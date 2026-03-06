# 🚀 Quick Start Guide - Resume Development

**Last Updated**: March 6, 2026 | **Status**: Ready to Code

---

## 📋 What's Been Done

✅ **Backend API**: 40+ endpoints implemented  
✅ **Frontend UI**: Authentication, appointments, user profiles  
✅ **Database**: Schema designed with 3 models  
✅ **Security**: JWT, rate limiting, 2FA  
✅ **Testing**: 40+ integration tests  
✅ **Documentation**: Swagger docs on most endpoints

---

## 🔴 What's Broken (Critical - FIX NOW)

### CRITICAL #1: In-Memory Database → Real MongoDB

**Problem**: `src/config/database.js` uses in-memory MongoDB

```javascript
// CURRENT (Development only):
const db = await connect(
  process.env.DATABASE_URL || 'mongodb://localhost/psychology-assistant',
);
// But no actual MongoDB running in production!
```

**Solution** (15 min):

```bash
# 1. Start MongoDB locally OR use cloud MongoDB
mongod  # local
# OR
# Create MongoDB Atlas account at https://www.mongodb.com/cloud/atlas

# 2. Set DATABASE_URL in .env
echo "DATABASE_URL=mongodb://localhost:27017/psychology-assistant" >> .env

# 3. Test connection:
npm test  # Tests will now use real database
```

---

### CRITICAL #2: Missing Authorization → Add RBAC

**Problem**: No owner verification on appointments

```javascript
// CURRENT (VULNERABLE):
router.get('/:id', authenticateToken, getAppointmentById);
// Anyone with token can access ANY appointment!
```

**Solution** (3-4 hours):

**File**: `src/middlewares/authMiddleware.js`

```javascript
// Add ownership verification middleware:
export const authorizeAppointmentOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json(apiResponse(null, 'Not found', 404));
    }

    if (appointment.userId.toString() !== req.user.id) {
      return res.status(403).json(apiResponse(null, 'Forbidden', 403));
    }

    next();
  } catch (error) {
    next(error);
  }
};
```

**File**: `src/routes/appointmentRoutes.js`

```javascript
// Update routes:
router.get(
  '/:id',
  authenticateToken,
  authorizeAppointmentOwner,
  getAppointmentById,
);
router.put(
  '/:id',
  authenticateToken,
  authorizeAppointmentOwner,
  updateAppointment,
);
router.delete(
  '/:id',
  authenticateToken,
  authorizeAppointmentOwner,
  deleteAppointment,
);
```

---

### CRITICAL #3: Frontend Deactivate Endpoint Broken

**Problem**: `frontend/src/app/services/user.ts` calls wrong endpoint

```typescript
// CURRENT (WRONG):
deactivateAccount() {
  return this.http.post('/api/users/deactivate', {});  // ❌ Missing auth
}
```

**Solution** (30 min):

```typescript
// FIX:
deactivateAccount(): Observable<any> {
  return this.http.post('/api/users/deactivate', {}, {
    headers: this.getAuthHeaders()
  });
}
```

---

### CRITICAL #4: Appointment Schema Mismatch

**Problem**: Frontend sends different field names than backend expects

**Backend Expected**:

```javascript
{
  title, description, startTime, endTime, psychologistId;
}
```

**Frontend Sends**:

```javascript
{
  name, details, start, end, therapistId;
} // ❌ WRONG
```

**Solution** (30 min):
**File**: `frontend/src/app/appointments/appointment-create/appointment-create.ts`

```typescript
const appointment = {
  title: this.form.get('title')?.value, // NOT 'name'
  description: this.form.get('description')?.value, // NOT 'details'
  startTime: this.form.get('startTime')?.value, // NOT 'start'
  endTime: this.form.get('endTime')?.value, // NOT 'end'
  psychologistId: this.selectedPsychologistId, // NOT 'therapistId'
};
```

---

### CRITICAL #5: No JWT Refresh Tokens

**Problem**: JWT expires in 7 days; no refresh mechanism

```javascript
// CURRENT (PROBLEMATIC):
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
// After 7 days: session ends, user must login again
```

**Solution** (4-5 hours):

**Step 1**: Update `src/models/session.js`

```javascript
refreshTokenExpiry: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
refreshTokenHash: String
```

**Step 2**: Update `src/controllers/authController.js`

```javascript
// Upon login, return both tokens:
const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' });

await Session.updateOne(
  { userId },
  { refreshTokenHash: hashToken(refreshToken) },
);

res.json(
  apiResponse(
    {
      accessToken, // 1 hour expiry
      refreshToken, // 30 days expiry
    },
    'Login successful',
  ),
);
```

**Step 3**: Add refresh endpoint in `src/routes/authRoutes.js`

```javascript
router.post(
  '/refresh',
  validateRequest([body('refreshToken').notEmpty()]),
  refreshToken,
);
```

**Step 4**: Update frontend to use refresh token

```typescript
// frontend/src/app/interceptors/auth-interceptor.ts
if (error.status === 401) {
  return this.auth.refreshToken().pipe(
    switchMap(({ accessToken }) => {
      // Retry request with new token
      return next.handle(
        request.clone({
          headers: request.headers.set(
            'Authorization',
            `Bearer ${accessToken}`,
          ),
        }),
      );
    }),
  );
}
```

---

## 📋 Development Workflow

### 1. Setup Environment

```bash
cd /media/bladimir/Datos1/Datos/Node/psychology-assistant

# Install dependencies
pnpm install
pnpm install --dir frontend

# Create .env file
cp .env.example .env  # If it exists
# OR create new one:
cat > .env << EOF
PORT=3000
DATABASE_URL=mongodb://localhost:27017/psychology-assistant
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
EOF

# Start MongoDB (if local)
mongod &

# Start backend
npm run dev

# In another terminal: Start frontend
cd frontend && npm start
```

### 2. Testing

```bash
# Run all tests
npm test

# Run specific test
npm test -- appointmentController.test.js

# With coverage
npm test -- --coverage
```

### 3. Deploy to Production

```bash
# Build frontend
cd frontend && npm run build

# Start with Docker
docker-compose up -d
```

---

## 🎯 Task Checklist - Start Here

Choose which task to work on:

### Option A: Start with Critical #1 (Easiest - 15 min)

```
[ ] Setup real MongoDB
[ ] Update .env
[ ] Verify tests pass
```

→ **Then proceed to Critical #2**

### Option B: Start with Critical #2 (Most Important - 3-4 hrs)

```
[ ] Add authorizeAppointmentOwner middleware
[ ] Update appointmentRoutes.js
[ ] Test authorization with Postman
[ ] Update frontend to handle 403 errors
```

→ **Unblocks security**

### Option C: Start with Critical #3 (Quick Fix - 30 min)

```
[ ] Fix deactivateAccount method
[ ] Update headers with auth
[ ] Test in frontend
```

→ **Quick win**

### Option D: Start with Critical #4 (Quick Fix - 30 min)

```
[ ] Check frontend form field names
[ ] Align with backend schema
[ ] Test appointment creation
```

→ **Another quick win**

### Option E: Start with Critical #5 (Complex - 4-5 hrs)

```
[ ] Implement refresh token generation
[ ] Add refresh endpoint
[ ] Update frontend interceptor
[ ] Test token refresh flow
```

→ **Most complex**

---

## 💡 Pro Tips

1. **Start with Critical #1 + #3 + #4** (1.5 hours) for quick wins
2. **Then do Critical #2** (3-4 hours) for security
3. **Then do Critical #5** (4-5 hours) for polish
4. After that, move to HIGH priority items

**Total Time to Production-Ready**: 9 hours + testing

---

## 📞 If You Get Stuck

Let me know:

1. Which critical task you're working on
2. The error message or unexpected behavior
3. What you've already tried

I can provide:

- ✅ Complete code solutions
- ✅ Step-by-step implementation guides
- ✅ Code reviews for your changes
- ✅ Test case generation

---

## 📚 Documentation

- **Full Audit**: See `PROJECT_STATUS.md`
- **Detailed Plan**: `/memories/session/action-plan-2026-03-06.md`
- **API Docs**: POST `http://localhost:3000/api/swagger/ui` when running
- **Tests**: `src/__tests__/` and `src/controllers/__tests__/`

---

**Ready?** Let me know which task to start with! 🚀
