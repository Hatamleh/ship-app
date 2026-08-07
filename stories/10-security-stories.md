# Security Stories

This document contains all user stories related to security, authentication, data protection, and access control in the shipping application.

---

## US-110: Password Security

**As a** system
**I want to** securely store user passwords
**So that** user accounts are protected

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Never store plaintext | Passwords always hashed |
| 2 | Bcrypt hashing | Use bcrypt with 10 salt rounds |
| 3 | Unique salts | Each password has unique salt |
| 4 | Verify on login | Compare hash, not plaintext |
| 5 | Never expose | Password never returned in API responses |

### Security Properties

| Property | Value |
|----------|-------|
| Algorithm | bcrypt |
| Salt Rounds | 10 |
| Output Length | 60 characters |
| Unique Salt | Yes |

---

## US-111: JWT Token Security

**As a** system
**I want to** use secure JWT tokens for authentication
**So that** sessions are protected

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Signed tokens | JWT signed with secret key |
| 2 | Payload minimal | Only userId and email |
| 3 | Expiry set | 30-day expiration |
| 4 | Secret from env | Key stored in environment variable |
| 5 | Verify on each request | Token validated before access |

### JWT Configuration

| Property | Value |
|----------|-------|
| Algorithm | HS256 (default) |
| Expiry | 30 days |
| Payload | { userId, email, iat, exp } |
| Secret Source | JWT_SECRET env variable |

---

## US-112: Secure Cookie Configuration

**As a** system
**I want to** use secure cookie settings
**So that** session tokens are protected

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | HttpOnly | Not accessible via JavaScript |
| 2 | Secure | HTTPS only in production |
| 3 | SameSite | Lax (CSRF protection) |
| 4 | Max Age | 30 days |
| 5 | Path | Root path (/) |

### Cookie Configuration

### Security Properties

| Property | Value | Purpose |
|----------|-------|---------|
| httpOnly | true | Prevents XSS access |
| secure | true (prod) | Prevents interception |
| sameSite | lax | CSRF protection |
| maxAge | 2592000 | Session duration |

---

## US-113: User Data Isolation

**As a** system
**I want to** isolate user data
**So that** users cannot access others' data

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Shipment ownership | Each shipment linked to userId |
| 2 | Query filtering | All queries include userId filter |
| 3 | Cannot view others | 404 for unauthorized shipment access |
| 4 | Cannot edit others | 401 for unauthorized modification |
| 5 | Cannot delete others | 401 for unauthorized deletion |

### Authorization Flow

1. User requests /api/shipments/123
2. Extract userId from JWT token
3. Query: WHERE id = 123 AND userId = [extracted]
4. If null → 404 Not Found
5. If found → Return shipment

---

## US-114: Authentication Enforcement

**As a** system
**I want to** enforce authentication on protected routes
**So that** only logged-in users can access features

### Public Routes

| Route | Method | Auth Required |
|-------|--------|---------------|
| /login | GET | No |
| /register | GET | No |
| /api/auth/login | POST | No |
| /api/auth/register | POST | No |
| /api/auth/logout | POST | No |

### Protected Routes

| Route | Method | Auth Required |
|-------|--------|---------------|
| / | GET | Yes |
| /shipments | GET | Yes |
| /shipments/[id] | GET | Yes |
| /api/auth/me | GET | Yes |
| /api/shipments | GET/POST | Yes |
| /api/shipments/[id] | GET/PUT/DELETE | Yes |
| /api/shipments/draft | POST | Yes |
| /api/shipments/finalize | POST | Yes |

---

## US-115: Email Uniqueness

**As a** system
**I want to** enforce unique email addresses
**So that** accounts cannot be duplicated

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Unique constraint | Database enforces uniqueness |
| 2 | Pre-check | Check before insert |
| 3 | Error response | 409 Conflict if duplicate |
| 4 | Error message | "Email already registered" |

---

## US-116: Input Validation

**As a** system
**I want to** validate all user inputs
**So that** malicious data is rejected

### Validation Points

| Input | Validation |
|-------|------------|
| Email | Format pattern check |
| Password | Minimum 6 characters |
| Names | Min 2 chars, letters only |
| Phone | Min 10 digits |
| Postal Code | 3-10 characters |
| Weight | Positive number, within limits |
| Dimensions | Positive, max 200 cm |

---

## US-117: Server-Side Rate Calculation

**As a** system
**I want to** calculate rates on the server
**So that** price manipulation is prevented

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Ignore frontend rates | Server calculates fresh |
| 2 | On finalization | Recalculate before storage |
| 3 | Validation | Ensure calculation succeeds |
| 4 | Security logging | Log rate mismatches |

---

## US-118: Session Expiration

**As a** system
**I want to** expire sessions after a period
**So that** abandoned sessions don't persist

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Token expiry | 30 days from creation |
| 2 | Cookie expiry | 30 days from creation |
| 3 | Expired access | Redirect to login |
| 4 | No auto-refresh | User must login again |

### Expiration Timeline

Day 0: User logs in
→ JWT created with 30-day expiry
→ Cookie set with 30-day maxAge
Day 29: Token still valid
→ User can access features
Day 30: Token expires
→ 401 response on API calls
→ Redirect to login

---

## US-119: Error Message Security

**As a** system
**I want to** use generic error messages
**So that** attackers cannot probe the system

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Login failure | "Invalid email or password" (generic) |
| 2 | Not found | 404 without details |
| 3 | Server errors | Generic 500 message |
| 4 | No stack traces | Production hides details |

### Secure Error Messages

| Scenario | Insecure | Secure |
|----------|----------|--------|
| Wrong password | "Password incorrect" | "Invalid credentials" |
| Email not found | "Email not found" | "Invalid credentials" |
| Shipment not owned | "Not your shipment" | "Not found" |
| Server error | Stack trace | "Server error" |

---

## US-120: CORS and Request Origin

**As a** system
**I want to** validate request origins
**So that** cross-origin attacks are prevented

### Cookie Settings for CSRF

### SameSite Policy

| Request Type | Cookie Sent |
|--------------|-------------|
| Same-site navigation | Yes |
| Same-site form POST | Yes |
| Cross-site navigation | Yes |
| Cross-site form POST | No |
| Cross-site AJAX | No |

---

## Security Checklist Summary

| Category | Control | Status |
|----------|---------|--------|
| Passwords | Bcrypt hashing | ✓ |
| Sessions | JWT with expiry | ✓ |
| Cookies | HttpOnly, Secure, SameSite | ✓ |
| Data | User isolation | ✓ |
| Routes | Authentication required | ✓ |
| Accounts | Unique emails | ✓ |
| Input | Server-side validation | ✓ |
| Pricing | Server-side calculation | ✓ |
| Errors | Generic messages | ✓ |
| CSRF | SameSite cookies | ✓ |

---

## Test Scenarios Summary

| Scenario | Test | Expected |
|----------|------|----------|
| Password storage | Check database | Hashed, not plaintext |
| Wrong password | Login attempt | Generic error |
| Expired token | API call after 30 days | 401 Unauthorized |
| Access other's shipment | GET /api/shipments/X | 404 Not Found |
| Edit other's shipment | PUT /api/shipments/X | 401 Unauthorized |
| Delete other's shipment | DELETE /api/shipments/X | 401 Unauthorized |
| Duplicate email | Registration | 409 Conflict |
| No auth cookie | Access /shipments | Redirect to login |
| Modified JWT | API call | 401 Unauthorized |
| Price manipulation | Finalize with fake price | Server recalculates |
