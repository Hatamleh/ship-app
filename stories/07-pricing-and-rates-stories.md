# Pricing & Rates Stories

This document contains all user stories related to shipping pricing calculations, rate display, and cost breakdown.

---

## US-060: View Rate Card

**As a** user creating a shipment
**I want to** see the total cost and breakdown
**So that** I know exactly what I'm paying for

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Visible after service selection | Rate card shows after selecting a service |
| 2 | Itemized breakdown | Shows each cost component separately |
| 3 | Total displayed | Final total prominently shown |
| 4 | Real-time updates | Updates when options change |
| 5 | Currency format | All prices in USD with 2 decimal places |

### Rate Card Components

| Component | Description |
|-----------|-------------|
| Service Base | Base price for selected service |
| Weight Cost | Weight × price per kg |
| Pickup Fee | Based on sender country and method |
| Signature Fee | $5.00 if required |
| Liquid Fee | $10.00 if contains liquid |
| Insurance Fee | $15.00 if selected |
| Packaging Fee | $8.00 if selected |
| **Total** | Sum of all components |

---

## US-061: Calculate Service Base Cost

**As a** system
**I want to** calculate the base shipping cost
**So that** pricing reflects the selected service

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Service base price | Added to cost |
| 2 | Weight multiplier | Weight × service price per kg |
| 3 | Combined | Base + (weight × rate) |

### Service Pricing

| Service | Base Price | Per KG Rate |
|---------|-----------|-------------|
| Domestic Standard | $15.00 | $0.50 |
| Domestic Express | $30.00 | $1.00 |
| Gulf Standard | $25.00 | $1.50 |
| Gulf Express | $45.00 | $2.50 |
| International Economy | $35.00 | $2.00 |
| International Standard | $50.00 | $3.00 |

### Calculation Formula

serviceBaseCost = service.basePrice + (package.weight × service.pricePerKg)

### Examples

| Service | Weight | Calculation | Result |
|---------|--------|-------------|--------|
| Domestic Standard | 10 kg | $15 + (10 × $0.50) | $20.00 |
| Domestic Express | 10 kg | $30 + (10 × $1.00) | $40.00 |
| Gulf Standard | 15 kg | $25 + (15 × $1.50) | $47.50 |
| Gulf Express | 15 kg | $45 + (15 × $2.50) | $82.50 |
| International Economy | 20 kg | $35 + (20 × $2.00) | $75.00 |
| International Standard | 20 kg | $50 + (20 × $3.00) | $110.00 |

---

## US-062: Calculate Pickup Fee

**As a** system
**I want to** add the appropriate pickup/drop-off fee
**So that** logistics costs are covered

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Country-specific | Fee based on sender country |
| 2 | Method-specific | Different fee for home vs postal |
| 3 | Default fallback | Use default if country not listed |

### Pickup Fees by Country

| Country | Home Pickup | Postal Office |
|---------|-------------|---------------|
| Saudi Arabia | $8.00 | $3.00 |
| United Arab Emirates | $10.00 | $3.00 |
| Kuwait | $7.00 | $2.50 |
| Bahrain | $6.00 | $2.00 |
| Qatar | $8.00 | $3.00 |
| Oman | $7.00 | $2.50 |
| Jordan | $12.00 | $4.00 |
| Lebanon | $12.00 | $4.00 |
| Egypt | $15.00 | $5.00 |
| Iraq | $18.00 | $6.00 |
| Other (Default) | $20.00 | $8.00 |

---

## US-063: Calculate Signature Fee

**As a** system
**I want to** add signature fee when required
**So that** signature service is properly charged

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Fee amount | $5.00 |
| 2 | When applied | When signature is selected or forced |
| 3 | Forced for Jordan/Egypt | Auto-added for these destinations |

### Business Rule

IF signatureRequired = true
THEN signatureFee = $5.00
ELSE signatureFee = $0.00

---

## US-064: Calculate Liquid Handling Fee

**As a** system
**I want to** add liquid handling fee when applicable
**So that** special handling is properly charged

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Fee amount | $10.00 |
| 2 | When applied | When containsLiquid is selected |

### Business Rule

IF containsLiquid = true
THEN liquidFee = $10.00
ELSE liquidFee = $0.00

---

## US-065: Calculate Insurance Fee

**As a** system
**I want to** add insurance fee when selected
**So that** insurance coverage is properly charged

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Fee amount | $15.00 |
| 2 | When applied | When insurance is selected |

### Business Rule

IF insurance = true
THEN insuranceFee = $15.00
ELSE insuranceFee = $0.00

---

## US-066: Calculate Packaging Fee

**As a** system
**I want to** add professional packaging fee when selected
**So that** packaging service is properly charged

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Fee amount | $8.00 |
| 2 | When applied | When packaging is selected |

### Business Rule

IF packaging = true
THEN packagingFee = $8.00
ELSE packagingFee = $0.00

---

## US-067: Calculate Total Price

**As a** system
**I want to** calculate the final total
**So that** users see the complete cost

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Sum all components | All fees added together |
| 2 | Round to 2 decimals | Prices rounded properly |
| 3 | Display format | $XX.XX format |

### Total Price Formula

totalPrice = serviceBaseCost
+ pickupFee
+ signatureFee
+ liquidFee
+ insuranceFee
+ packagingFee

### Complete Calculation Example

Sender: Kuwait
Receiver: Saudi Arabia
Weight: 5 kg
Service: Gulf Standard
Pickup: Home
Options: Signature, Insurance
Calculation:
- Service Base: $25.00
- Weight: 5 kg × $1.50 = $7.50
- Home Pickup (Kuwait): $7.00
- Signature: $5.00
- Insurance: $15.00
- Liquid: $0.00
- Packaging: $0.00
Total: $25.00 + $7.50 + $7.00 + $5.00 + $15.00 = $59.50

---

## US-068: Frontend Rate Preview

**As a** user
**I want to** see estimated pricing while filling the form
**So that** I can make informed decisions

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Real-time calculation | Updates as options change |
| 2 | API endpoint | POST /api/rates |
| 3 | Preview only | Not used for final billing |
| 4 | Quick response | Fast calculation for UX |

### API Endpoint

**Endpoint:** POST /api/rates

---

## US-069: Server-Side Rate Recalculation

**As a** system
**I want to** recalculate rates on the server during finalization
**So that** price manipulation is prevented

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Ignore frontend prices | Backend calculates fresh |
| 2 | Validate service | Ensure service exists and handles weight |
| 3 | Apply all rules | Use current pricing configuration |
| 4 | Store calculated rate | Save server-calculated total |
| 5 | Security measure | Prevents users from modifying prices |

### Business Rule

On finalization:
1. Receive form data from frontend
2. IGNORE any prices/rates in the request
3. Recalculate using server-side logic
4. Use recalculated rates for storage
5. Return rate breakdown in response

### Security Considerations

- Frontend rates are for preview only
- Backend ALWAYS recalculates on finalization
- Price tolerance check (0.01) for validation
- Mismatch logged for security audit

---

## US-070: Rate Validation on Finalize

**As a** system
**I want to** validate that rates can be calculated
**So that** invalid shipments are rejected

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Service must exist | Error if invalid service ID |
| 2 | Weight within limits | Error if weight > service max |
| 3 | Country recognized | Error if unknown country |
| 4 | Calculation succeeds | Error if any calculation fails |

### Error Scenarios

| Scenario | Error Message |
|----------|---------------|
| Invalid service ID | "Service not found" |
| Weight exceeds max | "Weight exceeds maximum for service" |
| Unknown country | "Country not supported" |
| Calculation error | "Unable to calculate shipping rate" |

---

## API Endpoints Summary

### Calculate Rates (Frontend Preview)

**Endpoint:** POST /api/rates

- No authentication required
- Returns calculated price breakdown
- Used for real-time UI updates

### Finalize Shipment (Server Calculation)

**Endpoint:** POST /api/shipments/finalize

- Authentication required
- Server recalculates rates
- Ignores frontend prices
- Stores authoritative rates

---

## Test Scenarios Summary

| Scenario | Service | Weight | Country | Pickup | Options | Expected Total |
|----------|---------|--------|---------|--------|---------|----------------|
| Basic Domestic | Dom. Standard | 10 kg | SA | Home | None | $28.00 |
| Express Domestic | Dom. Express | 10 kg | UAE | Postal | None | $43.00 |
| IntraGulf with options | Gulf Standard | 15 kg | Kuwait | Home | Sig+Ins | $74.50 |
| International | Int. Economy | 20 kg | Egypt | Postal | All | $113.00 |
| Forced signature (Jordan) | Gulf Standard | 10 kg | Jordan | Home | Auto | $52.00 |
| Heavy (postal only) | Gulf Standard | 20 kg | SA | Postal | None | $58.00 |
| All options selected | Int. Standard | 25 kg | Lebanon | Postal | All | $163.00 |

### Calculation Verification

**Test Case: IntraGulf with options**
Service: Gulf Standard
Weight: 15 kg
Sender: Kuwait
Pickup: Home
Base: $25.00
Weight: 15 × $1.50 = $22.50
Home Pickup (Kuwait): $7.00
Signature: $5.00
Insurance: $15.00
Total: $25.00 + $22.50 + $7.00 + $5.00 + $15.00 = $74.50 ✓
