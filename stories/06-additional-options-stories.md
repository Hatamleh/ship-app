# Additional Options Stories

This document contains all user stories related to additional shipping options including signature, insurance, packaging, liquid handling, and pickup method.

---

## US-050: View Additional Options

**As a** user creating a shipment
**I want to** see available additional options
**So that** I can customize my shipment with extra services

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Card enabled | After package card is complete |
| 2 | All options shown | Signature, liquid, insurance, packaging, pickup method |
| 3 | Dynamic rules | Some options may be required/disabled based on context |
| 4 | Price indicators | Fee for each option displayed |
| 5 | Updates total | Selecting options updates total price |

### Available Options

| Option | Type | Fee | Default |
|--------|------|-----|---------|
| Signature Required | checkbox | $5.00 | false |
| Contains Liquid | checkbox | $10.00 | false |
| Insurance | checkbox | $15.00 | false |
| Professional Packaging | checkbox | $8.00 | false |
| Pickup Method | radio | varies | home |

---

## US-051: Signature Required Option

**As a** user
**I want to** request delivery signature
**So that** I have proof the package was received

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Optional by default | User can check/uncheck |
| 2 | Fee added | $5.00 added to total when selected |
| 3 | Fee removed | $5.00 removed when deselected |
| 4 | Visual indicator | Checkbox with fee displayed |

### Business Rule (Standard)

Signature is optional for most destinations.
When selected, adds $5.00 to total.

---

## US-052: Mandatory Signature for Jordan

**As a** system
**I want to** force signature requirement for Jordan deliveries
**So that** regulatory requirements are met

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Auto-checked | Signature checkbox is automatically checked |
| 2 | Disabled | User cannot uncheck the signature option |
| 3 | Fee applied | $5.00 signature fee is automatically added |
| 4 | Visual indicator | Checkbox shows disabled/locked state |
| 5 | Explanation | Message explains why signature is required |

### Business Rule

IF receiver.country = "Jordan"
THEN signature.required = true
signature.disabled = true
signature.value = true
signature.fee = $5.00

---

## US-053: Mandatory Signature for Egypt

**As a** system
**I want to** force signature requirement for Egypt deliveries
**So that** regulatory requirements are met

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Auto-checked | Signature checkbox is automatically checked |
| 2 | Disabled | User cannot uncheck the signature option |
| 3 | Fee applied | $5.00 signature fee is automatically added |
| 4 | Visual indicator | Checkbox shows disabled/locked state |

### Business Rule

IF receiver.country = "Egypt"
THEN signature.required = true
signature.disabled = true
signature.value = true
signature.fee = $5.00

### Signature Requirement Matrix

| Destination | Signature Required | User Can Change |
|-------------|-------------------|-----------------|
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

## US-054: Contains Liquid Option

**As a** user
**I want to** indicate my package contains liquids
**So that** special handling is applied

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Optional | User can check/uncheck |
| 2 | Fee added | $10.00 added to total when selected |
| 3 | Fee removed | $10.00 removed when deselected |
| 4 | Special handling | Package marked for liquid handling |

### Business Rule

Contains Liquid is always optional.
When selected, adds $10.00 to total for special handling.

---

## US-055: Insurance Option

**As a** user
**I want to** add insurance to my shipment
**So that** I'm protected against loss or damage

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Optional | User can check/uncheck |
| 2 | Fee added | $15.00 added to total when selected |
| 3 | Fee removed | $15.00 removed when deselected |
| 4 | Coverage info | Insurance terms/coverage displayed |

### Business Rule

Insurance is always optional.
When selected, adds $15.00 to total.

---

## US-056: Professional Packaging Option

**As a** user
**I want to** request professional packaging
**So that** my items are securely packed by experts

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Optional | User can check/uncheck |
| 2 | Fee added | $8.00 added to total when selected |
| 3 | Fee removed | $8.00 removed when deselected |

### Business Rule

Professional Packaging is always optional.
When selected, adds $8.00 to total.

---

## US-057: Pickup Method Selection

**As a** user
**I want to** choose between home pickup and postal office drop-off
**So that** I can select the most convenient option

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Two options | Home pickup and Postal office drop-off |
| 2 | Radio selection | Only one can be selected |
| 3 | Default | Home pickup is default |
| 4 | Fee varies | Fee depends on sender country |
| 5 | Dynamic rules | Home pickup may be disabled for heavy packages |

### Pickup Fees by Country

| Country | Home Pickup | Postal Office |
|---------|-------------|---------------|
| Saudi Arabia | $8.00 | $3.00 |
| UAE | $10.00 | $3.00 |
| Kuwait | $7.00 | $2.50 |
| Bahrain | $6.00 | $2.00 |
| Qatar | $8.00 | $3.00 |
| Oman | $7.00 | $2.50 |
| Jordan | $12.00 | $4.00 |
| Lebanon | $12.00 | $4.00 |
| Egypt | $15.00 | $5.00 |
| Iraq | $18.00 | $6.00 |
| Other | $20.00 | $8.00 |

---

## US-058: Home Pickup Weight Restriction

**As a** system
**I want to** disable home pickup for packages over 17 kg
**So that** pickup logistics are manageable

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Weight check | If package > 17 kg, home pickup disabled |
| 2 | Auto-select | Postal office automatically selected |
| 3 | Visual indicator | Home pickup option shows disabled state |
| 4 | Explanation | Message explains why home pickup unavailable |
| 5 | Iraq exception | This rule does NOT apply to Iraq senders |

### Business Rule

IF package.weight > 17 kg
AND sender.country != "Iraq"
THEN pickupMethod.home.disabled = true
pickupMethod.value = "postal_office"

### Weight vs Pickup Matrix

| Sender Country | Weight | Home Pickup Available |
|----------------|--------|----------------------|
| Saudi Arabia | 10 kg | YES |
| Saudi Arabia | 17 kg | YES |
| Saudi Arabia | 18 kg | NO |
| Saudi Arabia | 25 kg | NO |
| UAE | 15 kg | YES |
| UAE | 20 kg | NO |
| Iraq | 10 kg | YES |
| Iraq | 18 kg | YES (Exception!) |
| Iraq | 25 kg | YES (Exception!) |
| Iraq | 50 kg | YES (Exception!) |

---

## US-059: Iraq Exception for Heavy Package Pickup

**As a** system
**I want to** allow home pickup for heavy packages from Iraq
**So that** Iraq-specific logistics are supported

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Iraq sender | Home pickup available regardless of weight |
| 2 | Weight > 17 kg | Home pickup still available |
| 3 | Both options | User can choose home or postal office |

### Business Rule

IF sender.country = "Iraq"
THEN pickupMethod.home.disabled = false (always available)

---

## API Endpoint

### Get Additional Options Rules

**Endpoint:** POST /api/rules/additional-options

---

## Additional Fees Summary

| Option | Fee | Condition |
|--------|-----|-----------|
| Signature Required | $5.00 | When selected or forced |
| Contains Liquid | $10.00 | When selected |
| Insurance | $15.00 | When selected |
| Professional Packaging | $8.00 | When selected |
| Home Pickup | $6-20 | Country-specific |
| Postal Office | $2-8 | Country-specific |

---

## Test Scenarios Summary

| Scenario | Receiver | Weight | Expected |
|----------|----------|--------|----------|
| Standard options | UAE | 10 kg | All options available |
| Signature forced | Jordan | 10 kg | Signature required, disabled |
| Signature forced | Egypt | 10 kg | Signature required, disabled |
| Heavy package | Saudi Arabia | 20 kg | Home pickup disabled |
| Heavy from Iraq | Iraq | 20 kg | Home pickup available |
| Light package | UAE | 5 kg | Both pickup options available |
| All options selected | Kuwait | 10 kg | Total = base + all fees |
| No options selected | Bahrain | 10 kg | Total = base only |
