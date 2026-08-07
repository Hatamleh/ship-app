# Authentication & Account Management Stories

This document contains all user stories related to user authentication, registration, and account management.

---

## US-001: User Registration

**As a** new user
**I want to** create an account with my personal information
**So that** I can use the shipping platform to send packages

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | All required fields must be filled | Email, password, full name, phone, country, city, street, postal code are mandatory |
| 2 | Email must be valid format | Must contain @ and domain (pattern: `^[^\s@]+@[^\s@]+\.[^\s@]+$`) |
| 3 | Email must be unique | Cannot register with an existing email address |
| 4 | Password minimum length | Password must be at least 6 characters |
| 5 | Phone number validation | Must have at least 10 digits |
| 6 | Name validation | Full name must be at least 2 characters |
| 7 | City validation | City must be at least 2 characters |
| 8 | Postal code validation | Postal code must be between 3-10 characters |
| 9 | Successful registration | User is automatically logged in and redirected to home page |
| 10 | JWT cookie set | HTTP-only auth cookie is set with 30-day expiry |

### Business Rules

- Password is hashed using bcrypt with 10 salt rounds before storage
- User's address information is used as default sender address for shipments
- Street address validation depends on country (required for Gulf countries)

### API Endpoint

**Endpoint:** POST /api/auth/register

### Response Codes

| Code | Description |
|------|-------------|
| 201 | User created successfully |
| 400 | Validation error (missing/invalid fields) |
| 409 | Email already exists |
| 500 | Server error |

---

## US-002: User Login

**As a** registered user
**I want to** log in with my email and password
**So that** I can access my shipments and create new ones

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Email required | Cannot submit without email |
| 2 | Password required | Cannot submit without password |
| 3 | Valid credentials | User is logged in and redirected to home page |
| 4 | Invalid credentials | Error message displayed: "Invalid email or password" |
| 5 | JWT cookie set | HTTP-only auth cookie is set on successful login |
| 6 | User context loaded | User information available throughout the app |
| 7 | Loading state | Button shows loading indicator during authentication |

### Business Rules

- Password is verified using bcrypt compare
- JWT token contains userId and email
- Token expires after 30 days
- Cookie settings: httpOnly, secure (production), sameSite: lax

### API Endpoint

**Endpoint:** POST /api/auth/login

### Response Codes

| Code | Description |
|------|-------------|
| 200 | Login successful |
| 400 | Missing email or password |
| 401 | Invalid credentials |
| 500 | Server error |

---

## US-003: User Logout

**As a** logged-in user
**I want to** log out of my account
**So that** I can secure my session on shared devices

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Logout action | User clicks logout button |
| 2 | Cookie cleared | Auth cookie is removed (maxAge: 0) |
| 3 | Redirect | User is redirected to login page |
| 4 | Context cleared | User context is reset to null |
| 5 | Protected routes | Accessing protected routes redirects to login |

### Business Rules

- Logout clears the HTTP-only cookie by setting maxAge to 0
- No server-side session to invalidate (stateless JWT)

### API Endpoint

**Endpoint:** POST /api/auth/logout

---

## US-004: View Current User Profile

**As a** logged-in user
**I want to** see my registered information
**So that** I can verify my account details

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Authenticated access | Only logged-in users can view profile |
| 2 | Display all fields | Name, email, phone, country, city, street, postal code shown |
| 3 | Password not exposed | Password is never returned from API |
| 4 | Pre-filled sender | Profile data auto-fills sender card in shipment form |

### Business Rules

- User data is fetched on app load via `/api/auth/me`
- 10-second timeout on profile fetch to prevent infinite loading
- Profile data is used as default sender information (read-only in form)

### API Endpoint

**Endpoint:** GET /api/auth/me

### Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 401 | Not authenticated |
| 500 | Server error |

---

## US-005: Auto-Redirect for Unauthenticated Users

**As a** system
**I want to** redirect unauthenticated users to login
**So that** protected routes are secured

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Public routes accessible | /login and /register are always accessible |
| 2 | Protected routes redirect | /, /shipments, /shipments/[id] redirect to /login if not authenticated |
| 3 | After login redirect | User returns to original destination after login |
| 4 | Loading state | Loading indicator shown while checking auth status |

### Business Rules

- Public routes: `/login`, `/register`
- All other routes require authentication
- AuthContext handles redirect logic
- Cookie verification happens on every page load

---

## US-006: Session Persistence

**As a** logged-in user
**I want to** stay logged in across browser sessions
**So that** I don't have to log in every time

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Cookie persists | Auth cookie survives browser close |
| 2 | 30-day expiry | Session valid for 30 days |
| 3 | Auto-refresh | User info loaded on app start if cookie exists |
| 4 | Expired token | User redirected to login if token expired |

### Business Rules

- JWT token has 30-day expiry (`30d`)
- Cookie maxAge: 2,592,000 seconds (30 days)
- Token contains: userId, email, iat (issued at), exp (expiry)

---

## Test Scenarios Summary

| Scenario | Input | Expected Result |
|----------|-------|-----------------|
| Register with valid data | All fields valid | Account created, logged in |
| Register with existing email | Duplicate email | 409 error |
| Register with short password | 5 char password | Validation error |
| Register with invalid email | "notanemail" | Validation error |
| Login with valid credentials | Correct email/password | Logged in, redirected |
| Login with wrong password | Wrong password | 401 error |
| Login with non-existent email | Unknown email | 401 error |
| Access protected route | Not logged in | Redirect to login |
| Logout | Logged in user | Cookie cleared, redirect |
| Session timeout | 31 days after login | Redirect to login |
