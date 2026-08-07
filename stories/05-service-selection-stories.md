# Service Selection Stories

This document contains all user stories related to shipping service selection in the shipment creation form.

---

## US-040: View Available Services

**As a** user creating a shipment
**I want to** see available shipping services
**So that** I can choose the delivery speed and price that suits me

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Card enabled | Only after package card is complete |
| 2 | Services filtered | Only services matching shipment type shown |
| 3 | Weight filtering | Services that can't handle weight are excluded |
| 4 | Service details | Name, description, delivery days, price shown |
| 5 | Selection required | Must select a service to proceed |

### Service Display Information

Each service shows:
- Service name
- Description
- Estimated delivery days
- Base price
- Price per kg
- Maximum weight supported

---

## US-041: Domestic Shipment Services

**As a** user shipping within the same country (Domestic)
**I want to** choose between Standard and Express delivery
**So that** I can balance cost vs speed

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Standard shown | Domestic Standard service available |
| 2 | Express shown | Domestic Express service available |
| 3 | Standard details | Base $15, $0.50/kg, 3 days, max 50 kg |
| 4 | Express details | Base $30, $1.00/kg, 1 day, max 30 kg |

### Domestic Services

| Service | Base Price | Per KG | Delivery | Max Weight |
|---------|-----------|--------|----------|------------|
| Domestic Standard | $15.00 | $0.50 | 3 days | 50 kg |
| Domestic Express | $30.00 | $1.00 | 1 day | 30 kg |

### Filtering by Weight

| Package Weight | Available Services |
|----------------|-------------------|
| 10 kg | Standard, Express |
| 25 kg | Standard, Express |
| 30 kg | Standard, Express |
| 35 kg | Standard only |
| 50 kg | Standard only |
| 51+ kg | None |

---

## US-042: IntraGulf Shipment Services

**As a** user shipping between Gulf countries (IntraGulf)
**I want to** choose between Standard and Express delivery
**So that** I can balance cost vs speed for regional shipping

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Standard shown | Gulf Standard service available |
| 2 | Express shown | Gulf Express service available |
| 3 | Standard details | Base $25, $1.50/kg, 5 days, max 30 kg |
| 4 | Express details | Base $45, $2.50/kg, 2 days, max 20 kg |

### IntraGulf Services

| Service | Base Price | Per KG | Delivery | Max Weight |
|---------|-----------|--------|----------|------------|
| Gulf Standard | $25.00 | $1.50 | 5 days | 30 kg |
| Gulf Express | $45.00 | $2.50 | 2 days | 20 kg |

### Filtering by Weight

| Package Weight | Available Services |
|----------------|-------------------|
| 10 kg | Standard, Express |
| 20 kg | Standard, Express |
| 25 kg | Standard only |
| 30 kg | Standard only |
| 31+ kg | None |

---

## US-043: International Shipment Services

**As a** user shipping internationally
**I want to** choose between Economy and Standard delivery
**So that** I can balance cost vs speed for international shipping

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Economy shown | International Economy service available |
| 2 | Standard shown | International Standard service available |
| 3 | Economy details | Base $35, $2.00/kg, 10 days, max 25 kg |
| 4 | Standard details | Base $50, $3.00/kg, 7 days, max 25 kg |

### International Services

| Service | Base Price | Per KG | Delivery | Max Weight |
|---------|-----------|--------|----------|------------|
| International Economy | $35.00 | $2.00 | 10 days | 25 kg |
| International Standard | $50.00 | $3.00 | 7 days | 25 kg |

### Filtering by Weight

| Package Weight | Available Services |
|----------------|-------------------|
| 10 kg | Economy, Standard |
| 25 kg | Economy, Standard |
| 26+ kg | None |

---

## US-044: No Services Available Message

**As a** user
**I want to** see a clear message when no services can handle my package
**So that** I know to adjust my package weight

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | All services filtered | "No services available" message shown |
| 2 | Reason explained | User informed about weight limit |
| 3 | Cannot proceed | Form submission blocked |
| 4 | Guidance provided | Suggestion to reduce weight |

### Scenarios Triggering "No Services"

| Shipment Type | Weight | Result |
|---------------|--------|--------|
| Domestic | 51+ kg | No services |
| IntraGulf | 31+ kg | No services |
| International | 26+ kg | No services |

---

## US-045: Select Shipping Service

**As a** user
**I want to** select my preferred shipping service
**So that** my shipment is processed with chosen speed

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Single selection | Can only select one service |
| 2 | Visual feedback | Selected service highlighted |
| 3 | Triggers rate calc | Rate calculation starts on selection |
| 4 | Updates total | Total price updates in rate card |

### Selection Flow

1. User views available services
2. User clicks/selects desired service
3. System marks service as selected
4. System calculates rates with selected service
5. Rate card updates with pricing breakdown

---

## US-046: Service Card Updates Rate Card

**As a** user
**I want to** see pricing update when I select a service
**So that** I know the cost before finalizing

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Rate calculation | Triggered on service selection |
| 2 | Price breakdown | Shows base, weight cost, fees |
| 3 | Real-time update | Changes immediately on selection |
| 4 | API call | POST /api/rates with service details |

---

## API Endpoint

### Get Available Services

**Endpoint:** POST /api/rules/service

---

---

## Test Scenarios Summary

| Scenario | Shipment Type | Weight | Expected Services |
|----------|---------------|--------|-------------------|
| Domestic light package | Domestic | 10 kg | Standard, Express |
| Domestic medium package | Domestic | 35 kg | Standard only |
| Domestic heavy package | Domestic | 55 kg | None |
| IntraGulf light package | IntraGulf | 15 kg | Standard, Express |
| IntraGulf medium package | IntraGulf | 25 kg | Standard only |
| IntraGulf heavy package | IntraGulf | 35 kg | None |
| International light | International | 20 kg | Economy, Standard |
| International at limit | International | 25 kg | Economy, Standard |
| International over limit | International | 30 kg | None |
| Service selection | Any | Valid | Rate card updates |
| No selection | Any | Valid | Cannot finalize |
