# Sender Information Stories

This document contains all user stories related to the sender information card in the shipment creation form.

---

## US-010: View Pre-filled Sender Information

**As a** logged-in user creating a shipment
**I want to** see my registered address pre-filled as sender
**So that** I don't have to re-enter my information every time

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Auto-populate | Sender fields filled from user profile |
| 2 | Fields populated | Name, phone, country, city, street, postal code |
| 3 | Read-only | All sender fields are disabled (cannot edit) |
| 4 | Visual indicator | Fields appear grayed out to show read-only state |
| 5 | Card always enabled | Sender card is enabled on form load |

### Business Rules

- Sender information comes from authenticated user's profile
- User cannot modify sender information in shipment form
- To change sender info, user must update their profile

---

## US-011: Sender Name Validation

**As a** system
**I want to** validate sender name
**So that** shipments have valid sender identification

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Minimum length | Name must be at least 2 characters |
| 2 | Characters allowed | Letters, spaces, hyphens, apostrophes only |
| 3 | No numbers | Numbers are not allowed in name |
| 4 | No special characters | Special characters rejected |

---

## US-012: Sender Phone Validation

**As a** system
**I want to** validate sender phone number
**So that** the carrier can contact the sender if needed

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Minimum digits | At least 10 digits required |
| 2 | Flexible format | Accepts: 555-0123, (555) 012-3456, 555.012.3456, +31627004821 |
| 3 | Digit extraction | Non-digit characters removed before validation |
| 4 | International support | Country codes accepted |

### Validation Logic

### Valid Examples

| Input | Digits Extracted | Valid |
|-------|-----------------|-------|
| `555-0123456` | `5550123456` | Yes (10 digits) |
| `(555) 012-3456` | `5550123456` | Yes (10 digits) |
| `+966501234567` | `966501234567` | Yes (12 digits) |
| `12345` | `12345` | No (5 digits) |

---

## US-013: Sender Country Selection

**As a** user
**I want to** have my country pre-selected
**So that** the form knows the shipment origin

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Country required | Country is a mandatory field |
| 2 | Dropdown options | All supported countries shown |
| 3 | Gulf countries marked | Gulf countries have special designation |
| 4 | Pre-selected | User's registered country is selected |

### Supported Countries

| Country | Code | Gulf Country |
|---------|------|--------------|
| Saudi Arabia | SA | Yes |
| United Arab Emirates | AE | Yes |
| Kuwait | KW | Yes |
| Bahrain | BH | Yes |
| Qatar | QA | Yes |
| Oman | OM | Yes |
| Egypt | EG | No |
| Jordan | JO | No |
| Lebanon | LB | No |
| Iraq | IQ | No |

---

## US-014: Sender Street Address (Gulf Country Rule)

**As a** system
**I want to** require street address for Gulf country senders
**So that** packages can be properly picked up

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Gulf sender | Street address is REQUIRED |
| 2 | Non-Gulf sender | Street address is OPTIONAL |
| 3 | Dynamic validation | Rule changes based on country selection |
| 4 | Error message | "Street address is required for Gulf countries" |

### Business Rule

IF sender.country IN [Saudi Arabia, UAE, Kuwait, Bahrain, Qatar, Oman]
THEN street.required = true
ELSE street.required = false

### Gulf Countries

- Saudi Arabia
- United Arab Emirates
- Kuwait
- Bahrain
- Qatar
- Oman

---

## US-015: Sender City Validation

**As a** system
**I want to** validate sender city
**So that** the pickup location is properly identified

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Required field | City cannot be empty |
| 2 | Minimum length | At least 2 characters |
| 3 | Error message | "City must be at least 2 characters" |

---

## US-016: Sender Postal Code Validation

**As a** system
**I want to** validate sender postal code
**So that** the pickup address is complete

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Required field | Postal code cannot be empty |
| 2 | Minimum length | At least 3 characters |
| 3 | Maximum length | No more than 10 characters |
| 4 | Error message | "Postal code must be between 3-10 characters" |

---

## US-017: Sender Card Completion

**As a** user
**I want to** know when sender information is complete
**So that** I can proceed to the next step

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | All fields valid | Card marked as complete |
| 2 | Visual indicator | Checkmark or success state shown |
| 3 | Enables next step | Receiver card becomes enabled |
| 4 | Auto-complete | Since fields are pre-filled, card is typically complete on load |

---

## API Endpoint

### Get Sender Rules

**Endpoint:** POST /api/rules/sender

---

## Test Scenarios Summary

| Scenario | Sender Country | Street Required | Expected |
|----------|---------------|-----------------|----------|
| Gulf sender with street | Saudi Arabia | Yes | Valid |
| Gulf sender without street | UAE | Yes | Error |
| Non-Gulf sender with street | Egypt | No | Valid |
| Non-Gulf sender without street | Lebanon | No | Valid |
| Invalid phone (5 digits) | Any | - | Error |
| Short name (1 char) | Any | - | Error |
| Short city (1 char) | Any | - | Error |
| Short postal (2 chars) | Any | - | Error |
