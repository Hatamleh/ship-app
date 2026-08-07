# Package Information Stories

This document contains all user stories related to the package information card in the shipment creation form.

---

## US-030: Enter Package Details

**As a** user creating a shipment
**I want to** enter package weight and dimensions
**So that** appropriate services and pricing can be calculated

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Card enabled | Only after receiver card is complete |
| 2 | Weight required | Must enter package weight in kg |
| 3 | Dimensions required | Must enter length, width, height in cm |
| 4 | Conditional description | Item description required for non-Gulf to Gulf |
| 5 | Numeric inputs | Only numbers accepted |

### Fields

| Field | Type | Required | Unit | Validation |
|-------|------|----------|------|------------|
| Weight | number | Yes | kg | > 0, ≤ shipment type max |
| Length | number | Yes | cm | > 0, ≤ 200 |
| Width | number | Yes | cm | > 0, ≤ 200 |
| Height | number | Yes | cm | > 0, ≤ 200 |
| Item Description | text | Conditional | - | Min 5 chars when required |

---

## US-031: Package Weight Validation

**As a** system
**I want to** validate package weight
**So that** packages meet carrier requirements

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Greater than zero | Weight must be > 0 kg |
| 2 | Maximum by type | Cannot exceed shipment type limit |
| 3 | Numeric only | Non-numeric values rejected |
| 4 | Error message | Shows specific limit exceeded |

### Weight Limits by Shipment Type

| Shipment Type | Maximum Weight |
|---------------|----------------|
| Domestic | 50 kg |
| IntraGulf | 30 kg |
| International | 25 kg |

### Business Rule

### Test Cases

| Weight | Shipment Type | Valid | Error |
|--------|---------------|-------|-------|
| 0 | Any | No | Weight must be > 0 |
| -5 | Any | No | Weight must be > 0 |
| 25 | Domestic | Yes | - |
| 51 | Domestic | No | Exceeds 50 kg limit |
| 30 | IntraGulf | Yes | - |
| 31 | IntraGulf | No | Exceeds 30 kg limit |
| 25 | International | Yes | - |
| 26 | International | No | Exceeds 25 kg limit |

---

## US-032: Package Dimension Validation

**As a** system
**I want to** validate package dimensions
**So that** packages fit carrier size limits

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Length > 0 | Cannot be zero or negative |
| 2 | Length ≤ 200 cm | Maximum 200 cm |
| 3 | Width > 0 | Cannot be zero or negative |
| 4 | Width ≤ 200 cm | Maximum 200 cm |
| 5 | Height > 0 | Cannot be zero or negative |
| 6 | Height ≤ 200 cm | Maximum 200 cm |
| 7 | All dimensions required | All three must be provided |

### Validation Rules

### Test Cases

| Dimension | Value | Valid | Error |
|-----------|-------|-------|-------|
| Length | 0 | No | Must be > 0 |
| Length | 100 | Yes | - |
| Length | 200 | Yes | - |
| Length | 201 | No | Exceeds 200 cm |
| Width | -5 | No | Must be > 0 |
| Width | 50 | Yes | - |
| Height | 0 | No | Must be > 0 |
| Height | 150 | Yes | - |

---

## US-033: Item Description Requirement (Non-Gulf to Gulf)

**As a** system
**I want to** require item description for non-Gulf to Gulf shipments
**So that** customs requirements are met

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Non-Gulf sender + Gulf receiver | Description field is SHOWN and REQUIRED |
| 2 | Gulf sender + Any receiver | Description field is HIDDEN |
| 3 | Non-Gulf sender + Non-Gulf receiver | Description field is HIDDEN |
| 4 | Minimum length | At least 5 characters when required |
| 5 | Error message | "Item description is required (minimum 5 characters)" |

### Business Rule

IF sender.country NOT IN Gulf Countries
AND receiver.country IN Gulf Countries
THEN itemDescription.required = true AND itemDescription.visible = true
ELSE itemDescription.visible = false

### Visibility Matrix

| Sender | Receiver | Description Field |
|--------|----------|-------------------|
| Saudi Arabia | UAE | Hidden |
| Saudi Arabia | Egypt | Hidden |
| Egypt | Saudi Arabia | Required (min 5 chars) |
| Jordan | Kuwait | Required (min 5 chars) |
| Lebanon | Qatar | Required (min 5 chars) |
| Egypt | Jordan | Hidden |

### Gulf Countries (Reference)

- Saudi Arabia
- United Arab Emirates
- Kuwait
- Bahrain
- Qatar
- Oman

---

## US-034: Package Card Enables Service Selection

**As a** user
**I want to** proceed to service selection after entering package details
**So that** I can choose how to ship my package

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | All fields valid | Card marked as complete |
| 2 | Weight within limits | Must be ≤ shipment type maximum |
| 3 | Dimensions within limits | All ≤ 200 cm |
| 4 | Description if required | Filled with min 5 chars |
| 5 | Service card enabled | Next section becomes available |

---

## US-035: Service Filtering by Weight

**As a** system
**I want to** filter available services based on package weight
**So that** users only see services that can handle their package

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Weight filter | Services with maxWeight < package weight are excluded |
| 2 | Real-time update | Service list updates as weight changes |
| 3 | No services message | "No services available" if all filtered out |

### Service Weight Limits

| Service | Shipment Type | Max Weight |
|---------|---------------|------------|
| Domestic Standard | Domestic | 50 kg |
| Domestic Express | Domestic | 30 kg |
| Gulf Standard | IntraGulf | 30 kg |
| Gulf Express | IntraGulf | 20 kg |
| International Economy | International | 25 kg |
| International Standard | International | 25 kg |

### Filtering Examples

| Weight | Shipment Type | Available Services |
|--------|---------------|-------------------|
| 10 kg | Domestic | Standard, Express |
| 35 kg | Domestic | Standard only |
| 55 kg | Domestic | None |
| 15 kg | IntraGulf | Standard, Express |
| 25 kg | IntraGulf | Standard only |
| 20 kg | International | Economy, Standard |
| 30 kg | International | None |

---

## API Endpoint

### Get Package Rules

**Endpoint:** POST /api/rules/package

---

## Test Scenarios Summary

| Scenario | Input | Expected |
|----------|-------|----------|
| Valid weight for Domestic | 40 kg | Success |
| Exceeds Domestic max | 55 kg | Error: exceeds 50 kg |
| Valid weight for IntraGulf | 25 kg | Success |
| Exceeds IntraGulf max | 35 kg | Error: exceeds 30 kg |
| Valid weight for International | 20 kg | Success |
| Exceeds International max | 30 kg | Error: exceeds 25 kg |
| Zero weight | 0 kg | Error: must be > 0 |
| Valid dimensions | 100x50x30 | Success |
| Exceeds max dimension | 100x250x30 | Error: exceeds 200 cm |
| Zero dimension | 100x0x30 | Error: must be > 0 |
| Non-Gulf to Gulf no description | Egypt→Saudi, empty | Error: description required |
| Non-Gulf to Gulf short description | Egypt→Saudi, "abc" | Error: min 5 chars |
| Non-Gulf to Gulf valid description | Egypt→Saudi, "Electronics" | Success |
| Gulf to Gulf no description | UAE→Saudi, empty | Success (not required) |
