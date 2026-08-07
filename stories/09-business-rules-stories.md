# Business Rules & Validation Stories

This document contains all user stories related to the core business rules, validation logic, and constraint enforcement in the shipping application.

---

## US-090: Gulf Countries Definition

**As a** system
**I want to** define which countries are Gulf countries
**So that** country-specific rules are applied correctly

### Gulf Countries List

| Country | Code | Is Gulf |
|---------|------|---------|
| Saudi Arabia | SA | YES |
| United Arab Emirates | AE | YES |
| Kuwait | KW | YES |
| Bahrain | BH | YES |
| Qatar | QA | YES |
| Oman | OM | YES |
| Egypt | EG | NO |
| Jordan | JO | NO |
| Lebanon | LB | NO |
| Iraq | IQ | NO |

### Rules Affected by Gulf Status

1. Street address requirement
2. Gulf to Iraq blocking
3. Item description requirement
4. Shipment type determination

---

## US-091: Street Address Required for Gulf Countries

**As a** system
**I want to** require street address for Gulf country addresses
**So that** delivery can be made to the correct location

### Business Rule

IF country IN [Saudi Arabia, UAE, Kuwait, Bahrain, Qatar, Oman]
THEN street.required = true
ELSE street.required = false

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Gulf sender | Street required for sender |
| 2 | Gulf receiver | Street required for receiver |
| 3 | Non-Gulf sender | Street optional |
| 4 | Non-Gulf receiver | Street optional |
| 5 | Error on empty | "Street address is required for Gulf countries" |

### Test Matrix

| Country | Role | Street Empty | Result |
|---------|------|--------------|--------|
| Saudi Arabia | Sender | Yes | Error |
| Saudi Arabia | Receiver | Yes | Error |
| Egypt | Sender | Yes | OK |
| Egypt | Receiver | Yes | OK |
| Kuwait | Sender | No | OK |
| Jordan | Receiver | Yes | OK |

---

## US-092: Block Gulf to Iraq Shipments

**As a** system
**I want to** prevent shipments from Gulf countries to Iraq
**So that** blocked shipping routes are enforced

### Business Rule

IF sender.country IN Gulf Countries
AND receiver.country = "Iraq"
THEN BLOCK with error

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Gulf to Iraq | Validation error shown |
| 2 | Non-Gulf to Iraq | Allowed |
| 3 | Gulf to non-Iraq | Allowed |
| 4 | Error message | "الشحن من دول الخليج إلى العراق غير متاح حالياً" |
| 5 | Checked on form | Real-time validation |
| 6 | Checked on finalize | Server-side enforcement |

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
| Iraq | Saudi Arabia | YES |

---

## US-093: Item Description for Non-Gulf to Gulf

**As a** system
**I want to** require item description for non-Gulf to Gulf shipments
**So that** customs documentation is complete

### Business Rule

IF sender.country NOT IN Gulf Countries
AND receiver.country IN Gulf Countries
THEN itemDescription.required = true
itemDescription.visible = true
itemDescription.minLength = 5

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Non-Gulf to Gulf | Description field shown and required |
| 2 | Gulf to Gulf | Description field hidden |
| 3 | Gulf to Non-Gulf | Description field hidden |
| 4 | Non-Gulf to Non-Gulf | Description field hidden |
| 5 | Minimum length | At least 5 characters |
| 6 | Error message | "وصف المحتويات مطلوب (5 أحرف على الأقل)" |

### Visibility Matrix

| Sender | Receiver | Description |
|--------|----------|-------------|
| Egypt | Saudi Arabia | Required |
| Jordan | UAE | Required |
| Lebanon | Kuwait | Required |
| Saudi Arabia | UAE | Hidden |
| UAE | Egypt | Hidden |
| Egypt | Jordan | Hidden |

---

## US-094: Shipment Type Detection

**As a** system
**I want to** automatically determine shipment type
**So that** correct services and limits are applied

### Business Rules

### Shipment Type Matrix

| Sender | Receiver | Type | Reason |
|--------|----------|------|--------|
| SA | SA | Domestic | Same country |
| Kuwait | Kuwait | Domestic | Same country |
| SA | UAE | IntraGulf | Both Gulf |
| UAE | Kuwait | IntraGulf | Both Gulf |
| SA | Egypt | International | Gulf to non-Gulf |
| UAE | Jordan | International | Gulf to non-Gulf |
| Egypt | SA | International | Non-Gulf to Gulf |
| Lebanon | Qatar | International | Non-Gulf to Gulf |
| Egypt | Jordan | International | Both non-Gulf |
| Lebanon | Iraq | International | Both non-Gulf |

---

## US-095: Weight Limits by Shipment Type

**As a** system
**I want to** enforce weight limits based on shipment type
**So that** packages meet carrier requirements

### Weight Limits

| Shipment Type | Maximum Weight |
|---------------|----------------|
| Domestic | 50 kg |
| IntraGulf | 30 kg |
| International | 25 kg |

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Within limit | Validation passes |
| 2 | Exceeds limit | Error with specific limit |
| 3 | Zero weight | Error "Weight must be > 0" |
| 4 | Negative weight | Error "Weight must be > 0" |

### Test Cases

| Type | Weight | Result |
|------|--------|--------|
| Domestic | 50 kg | OK |
| Domestic | 51 kg | Error |
| IntraGulf | 30 kg | OK |
| IntraGulf | 31 kg | Error |
| International | 25 kg | OK |
| International | 26 kg | Error |

---

## US-096: Service Weight Limits

**As a** system
**I want to** filter services based on package weight
**So that** users only see compatible services

### Service Weight Limits

| Service | Max Weight |
|---------|------------|
| Domestic Standard | 50 kg |
| Domestic Express | 30 kg |
| Gulf Standard | 30 kg |
| Gulf Express | 20 kg |
| International Economy | 25 kg |
| International Standard | 25 kg |

### Filtering Logic

### Examples

| Type | Weight | Available Services |
|------|--------|-------------------|
| Domestic | 25 kg | Standard, Express |
| Domestic | 35 kg | Standard only |
| IntraGulf | 15 kg | Standard, Express |
| IntraGulf | 25 kg | Standard only |
| International | 20 kg | Economy, Standard |

---

## US-097: Dimension Limits

**As a** system
**I want to** enforce package dimension limits
**So that** packages fit carrier requirements

### Dimension Limits

| Dimension | Minimum | Maximum |
|-----------|---------|---------|
| Length | > 0 cm | 200 cm |
| Width | > 0 cm | 200 cm |
| Height | > 0 cm | 200 cm |

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Zero dimension | Error |
| 2 | Negative dimension | Error |
| 3 | Over 200 cm | Error |
| 4 | Within limits | OK |

---

## US-098: Home Pickup Weight Restriction

**As a** system
**I want to** disable home pickup for heavy packages
**So that** pickup logistics are manageable

### Business Rule

IF package.weight > 17 kg
AND sender.country != "Iraq"
THEN pickupMethod.home.disabled = true
pickupMethod.defaultValue = "postal_office"

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Weight ≤ 17 kg | Both options available |
| 2 | Weight > 17 kg | Home pickup disabled |
| 3 | Iraq exception | Home pickup always available |
| 4 | Auto-select | Postal office auto-selected for heavy |

### Test Matrix

| Sender | Weight | Home Pickup |
|--------|--------|-------------|
| Saudi Arabia | 10 kg | Available |
| Saudi Arabia | 17 kg | Available |
| Saudi Arabia | 18 kg | Disabled |
| UAE | 25 kg | Disabled |
| Iraq | 10 kg | Available |
| Iraq | 18 kg | Available |
| Iraq | 30 kg | Available |

---

## US-099: Mandatory Signature for Jordan/Egypt

**As a** system
**I want to** force signature requirement for certain countries
**So that** regulatory requirements are met

### Business Rule

IF receiver.country IN ["Jordan", "Egypt"]
THEN signature.required = true
signature.disabled = true
signature.value = true

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Jordan destination | Signature forced and disabled |
| 2 | Egypt destination | Signature forced and disabled |
| 3 | Other destinations | Signature optional |
| 4 | Fee added | $5.00 automatically included |

### Signature Matrix

| Destination | Required | User Can Change |
|-------------|----------|-----------------|
| Saudi Arabia | No | Yes |
| UAE | No | Yes |
| Kuwait | No | Yes |
| Bahrain | No | Yes |
| Qatar | No | Yes |
| Oman | No | Yes |
| Jordan | YES | NO |
| Egypt | YES | NO |
| Lebanon | No | Yes |
| Iraq | No | Yes |

---

## US-100: Name Validation Rules

**As a** system
**I want to** validate sender and receiver names
**So that** shipments have proper identification

### Validation Rules

| Rule | Value |
|------|-------|
| Minimum length | 2 characters |
| Allowed characters | Letters, spaces, hyphens, apostrophes |
| Numbers | Not allowed |
| Special characters | Not allowed |

### Test Cases

| Input | Valid | Reason |
|-------|-------|--------|
| `Ahmad` | Yes | Valid name |
| `Al-Hassan` | Yes | Hyphen allowed |
| `O'Brien` | Yes | Apostrophe allowed |
| `John Smith` | Yes | Space allowed |
| `A` | No | Less than 2 chars |
| `John123` | No | Contains numbers |
| `User@Name` | No | Special character |

---

## US-101: Phone Validation Rules

**As a** system
**I want to** validate phone numbers
**So that** contact information is complete

### Validation Rules

| Rule | Value |
|------|-------|
| Minimum digits | 10 |
| Non-digit handling | Stripped before counting |
| Format | Flexible (various formats accepted) |

### Valid Formats

| Input | Digits | Valid |
|-------|--------|-------|
| `5550123456` | 10 | Yes |
| `555-012-3456` | 10 | Yes |
| `(555) 012-3456` | 10 | Yes |
| `+966501234567` | 12 | Yes |
| `12345` | 5 | No |

---

## US-102: Postal Code Validation Rules

**As a** system
**I want to** validate postal codes
**So that** addresses are complete

### Validation Rules

| Rule | Value |
|------|-------|
| Minimum length | 3 characters |
| Maximum length | 10 characters |
| Required | Yes |

---

## US-103: City Validation Rules

**As a** system
**I want to** validate city names
**So that** addresses are complete

### Validation Rules

| Rule | Value |
|------|-------|
| Minimum length | 2 characters |
| Required | Yes |

---

## Business Rules Summary Table

| Rule | Condition | Action |
|------|-----------|--------|
| Gulf street | Country is Gulf | Street required |
| Gulf to Iraq | Gulf sender + Iraq receiver | Block shipment |
| Item description | Non-Gulf to Gulf | Description required (5+ chars) |
| Domestic type | Same country | Max 50 kg |
| IntraGulf type | Both Gulf or Non-Gulf to Gulf | Max 30 kg |
| International type | Gulf to Non-Gulf or Both Non-Gulf | Max 25 kg |
| Heavy pickup | Weight > 17 kg (not Iraq) | Home pickup disabled |
| Jordan signature | Receiver = Jordan | Signature forced |
| Egypt signature | Receiver = Egypt | Signature forced |
| Name | Sender/Receiver | Min 2 chars, letters only |
| Phone | Sender/Receiver | Min 10 digits |
| Postal | Sender/Receiver | 3-10 characters |
| City | Sender/Receiver | Min 2 chars |
| Dimensions | Package | 0 < value ≤ 200 cm |
