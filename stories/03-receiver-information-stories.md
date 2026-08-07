# Receiver Information Stories

This document contains all user stories related to the receiver information card in the shipment creation form.

---

## US-020: Enter Receiver Information

**As a** user creating a shipment
**I want to** enter the recipient's address details
**So that** the package can be delivered to the correct location

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Card enabled | Only after sender card is complete |
| 2 | All fields editable | User can enter all receiver details |
| 3 | Required fields | Name, phone, country, city, postal code |
| 4 | Conditional fields | Street address based on country |
| 5 | Real-time validation | Errors shown on field blur |

### Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Receiver Name | text | Yes | Min 2 characters |
| Receiver Phone | text | Yes | Min 10 digits |
| Receiver Country | select | Yes | From supported list |
| Receiver City | text | Yes | Min 2 characters |
| Receiver Street | text | Conditional | Required for Gulf countries |
| Receiver Postal Code | text | Yes | 3-10 characters |

---

## US-021: Receiver Name Validation

**As a** system
**I want to** validate receiver name
**So that** packages are addressed to valid recipients

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Minimum length | Name must be at least 2 characters |
| 2 | Characters allowed | Letters, spaces, hyphens, apostrophes |
| 3 | No numbers | Numbers not allowed |
| 4 | Error on blur | Validation triggered when field loses focus |

### Valid Examples

| Input | Valid | Reason |
|-------|-------|--------|
| `Ahmad` | Yes | 5 characters, letters only |
| `Al-Hassan` | Yes | Hyphen allowed |
| `O'Brien` | Yes | Apostrophe allowed |
| `A` | No | Less than 2 characters |
| `John123` | No | Contains numbers |

---

## US-022: Receiver Phone Validation

**As a** system
**I want to** validate receiver phone number
**So that** delivery personnel can contact the recipient

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Minimum 10 digits | After removing non-digit characters |
| 2 | Format flexible | Accepts various phone formats |
| 3 | International support | Country codes accepted |
| 4 | Error message | "Phone number must have at least 10 digits" |

---

## US-023: Receiver Country Selection

**As a** user
**I want to** select the destination country
**So that** the system knows where to ship the package

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Dropdown list | All supported countries shown |
| 2 | Required field | Cannot proceed without selection |
| 3 | Triggers validation | Gulf to Iraq check performed |
| 4 | Updates rules | Other fields update based on selection |

### Supported Destination Countries

- Saudi Arabia
- United Arab Emirates
- Kuwait
- Bahrain
- Qatar
- Oman
- Egypt
- Jordan
- Lebanon
- Iraq

---

## US-024: Receiver Street Address (Gulf Country Rule)

**As a** system
**I want to** require street address for Gulf country destinations
**So that** packages can be properly delivered

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Gulf destination | Street address is REQUIRED |
| 2 | Non-Gulf destination | Street address is OPTIONAL |
| 3 | Dynamic update | Requirement changes with country selection |
| 4 | Visual indicator | Required fields marked with asterisk |

### Business Rule

IF receiver.country IN [Saudi Arabia, UAE, Kuwait, Bahrain, Qatar, Oman]
THEN receiverStreet.required = true
ELSE receiverStreet.required = false

---

## US-025: Block Gulf to Iraq Shipments

**As a** system
**I want to** prevent shipments from Gulf countries to Iraq
**So that** blocked routes are enforced

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Gulf sender + Iraq receiver | Validation error displayed |
| 2 | Error message | "Shipping from Gulf countries to Iraq is currently not possible" |
| 3 | Cannot proceed | Form cannot be submitted |
| 4 | Real-time check | Error shown immediately on Iraq selection |
| 5 | Non-Gulf to Iraq | Allowed (e.g., Lebanon to Iraq) |

### Business Rule

IF sender.country IN [Saudi Arabia, UAE, Kuwait, Bahrain, Qatar, Oman]
AND receiver.country = Iraq
THEN BLOCK with error "الشحن من دول الخليج إلى العراق غير متاح حالياً"

### Test Matrix

| Sender | Receiver | Allowed |
|--------|----------|---------|
| Saudi Arabia | Iraq | NO |
| UAE | Iraq | NO |
| Kuwait | Iraq | NO |
| Bahrain | Iraq | NO |
| Qatar | Iraq | NO |
| Oman | Iraq | NO |
| Egypt | Iraq | YES |
| Jordan | Iraq | YES |
| Lebanon | Iraq | YES |

---

## US-026: Receiver City Validation

**As a** system
**I want to** validate receiver city
**So that** the delivery location is properly identified

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Required field | Cannot be empty |
| 2 | Minimum 2 characters | Short names rejected |
| 3 | Error message | "City must be at least 2 characters" |

---

## US-027: Receiver Postal Code Validation

**As a** system
**I want to** validate receiver postal code
**So that** the delivery address is complete

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Required field | Cannot be empty |
| 2 | Minimum 3 characters | Short codes rejected |
| 3 | Maximum 10 characters | Long codes rejected |
| 4 | Error message | "Postal code must be between 3-10 characters" |

---

## US-028: Receiver Card Enables Next Step

**As a** user
**I want to** proceed to package details after entering receiver info
**So that** I can complete my shipment

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | All fields valid | Card marked as complete |
| 2 | No blocked routes | Gulf to Iraq check passed |
| 3 | Package card enabled | Next section becomes available |
| 4 | Shipment type determined | Domestic/IntraGulf/International set |

---

## US-029: Auto-Detect Shipment Type

**As a** system
**I want to** automatically determine shipment type from countries
**So that** appropriate services and pricing are applied

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Same country | Shipment type = Domestic |
| 2 | Both Gulf countries | Shipment type = IntraGulf |
| 3 | Gulf to non-Gulf | Shipment type = International |
| 4 | Non-Gulf to Gulf | Shipment type = International |
| 5 | Both non-Gulf | Shipment type = International |

### Shipment Type Logic

### Shipment Type Matrix

| Sender | Receiver | Type |
|--------|----------|------|
| Saudi Arabia | Saudi Arabia | Domestic |
| Saudi Arabia | UAE | IntraGulf |
| Saudi Arabia | Egypt | International |
| Egypt | Saudi Arabia | International |
| Egypt | Jordan | International |
| Lebanon | Kuwait | International |

---

## API Endpoint

### Get Receiver Rules

**Endpoint:** POST /api/rules/receiver

---

## Test Scenarios Summary

| Scenario | Sender | Receiver | Expected |
|----------|--------|----------|----------|
| Valid Gulf to Gulf | UAE | Saudi Arabia | Success, IntraGulf |
| Valid same country | Kuwait | Kuwait | Success, Domestic |
| Valid non-Gulf to Gulf | Egypt | Qatar | Success, IntraGulf |
| Blocked Gulf to Iraq | Saudi Arabia | Iraq | Error |
| Blocked Gulf to Iraq | UAE | Iraq | Error |
| Non-Gulf to Iraq | Lebanon | Iraq | Success, International |
| Missing receiver name | - | - | Validation error |
| Short phone number | - | 5 digits | Validation error |
| Gulf without street | Saudi Arabia | UAE (no street) | Validation error |
| Non-Gulf without street | Egypt | Jordan (no street) | Success |
