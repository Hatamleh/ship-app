# Shipping Application - User Stories

This directory contains comprehensive user stories for all features and business logic in the shipping application.

---

## Overview

The shipping application is a full-featured platform for creating, managing, and tracking shipments across Gulf countries, Middle East, and international destinations. These user stories document every feature, business rule, and validation implemented in the system.

---

## Story Files

| # | File | Description | Stories |
|---|------|-------------|---------|
| 01 | [Authentication Stories](./01-authentication-stories.md) | User registration, login, logout, session management | US-001 to US-006 |
| 02 | [Sender Information Stories](./02-sender-information-stories.md) | Sender card, pre-filled data, Gulf street requirement | US-010 to US-017 |
| 03 | [Receiver Information Stories](./03-receiver-information-stories.md) | Receiver card, Gulf-to-Iraq blocking, shipment type detection | US-020 to US-029 |
| 04 | [Package Information Stories](./04-package-information-stories.md) | Weight limits, dimensions, item description requirement | US-030 to US-035 |
| 05 | [Service Selection Stories](./05-service-selection-stories.md) | Service types, weight filtering, pricing | US-040 to US-046 |
| 06 | [Additional Options Stories](./06-additional-options-stories.md) | Signature, insurance, packaging, pickup method | US-050 to US-059 |
| 07 | [Pricing & Rates Stories](./07-pricing-and-rates-stories.md) | Price calculation, fees, rate breakdown | US-060 to US-070 |
| 08 | [Shipment Management Stories](./08-shipment-management-stories.md) | List, filter, sort, edit, delete, finalize | US-070 to US-083 |
| 09 | [Business Rules Stories](./09-business-rules-stories.md) | All validation rules and constraints | US-090 to US-103 |
| 10 | [Security Stories](./10-security-stories.md) | Authentication, authorization, data protection | US-110 to US-120 |
| 11 | [Progressive Form Stories](./11-progressive-form-stories.md) | Form flow, unlocking sequence, UI/UX | US-130 to US-143 |
| 12 | [AI Assistant Stories](./12-ai-assistant-stories.md) | Shipment agent, RAG assistant, form read/fill, AI security | US-150 to US-162 |

---

## Quick Reference

### Supported Countries

**Gulf Countries (Special Rules Apply):**
- Saudi Arabia
- United Arab Emirates
- Kuwait
- Bahrain
- Qatar
- Oman

**Middle East (Non-Gulf):**
- Egypt
- Jordan
- Lebanon
- Iraq

### Shipment Types

| Type | Condition | Max Weight |
|------|-----------|------------|
| Domestic | Same country | 50 kg |
| IntraGulf | Both Gulf OR Non-Gulf to Gulf | 30 kg |
| International | Gulf to Non-Gulf OR Both Non-Gulf | 25 kg |

### Key Business Rules

| Rule | Trigger | Effect |
|------|---------|--------|
| Gulf Street | Sender/Receiver in Gulf | Street required |
| Gulf to Iraq | Gulf sender + Iraq receiver | BLOCKED |
| Item Description | Non-Gulf to Gulf | Description required (5+ chars) |
| Mandatory Signature | Jordan or Egypt destination | Signature forced |
| Home Pickup Limit | Weight > 17 kg | Home pickup disabled |
| Iraq Exception | Sender is Iraq | Home pickup always available |

### Services

**Domestic:**
- Standard: $15 + $0.50/kg, 3 days, max 50 kg
- Express: $30 + $1.00/kg, 1 day, max 30 kg

**IntraGulf:**
- Standard: $25 + $1.50/kg, 5 days, max 30 kg
- Express: $45 + $2.50/kg, 2 days, max 20 kg

**International:**
- Economy: $35 + $2.00/kg, 10 days, max 25 kg
- Standard: $50 + $3.00/kg, 7 days, max 25 kg

### Additional Fees

| Option | Fee |
|--------|-----|
| Signature | $5.00 |
| Contains Liquid | $10.00 |
| Insurance | $15.00 |
| Professional Packaging | $8.00 |
| Home Pickup | $6-20 (country-specific) |
| Postal Office | $2-8 (country-specific) |

---

## Total Coverage

- **130+ Business Rules** documented
- **120+ User Stories** across all features
- **40+ Test Scenarios** for validation
- **All API Endpoints** documented
- **Security Requirements** specified

---

## How to Use These Stories

### For Developers
- Implement features according to acceptance criteria
- Use API endpoint specifications for backend development
- Follow validation rules exactly as documented

### For Testers
- Create test cases from acceptance criteria
- Use test matrices for comprehensive coverage
- Reference business rules for edge case testing

### For Product Owners
- Review stories for feature completeness
- Validate business logic accuracy
- Prioritize features for development sprints

---

## Story Format

Each story follows this structure:

```markdown
## US-XXX: Story Title

**As a** [user type]
**I want to** [action]
**So that** [benefit]

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | ... | ... |

### Business Rules

[Detailed rules and logic]

### API Endpoint

[Request/Response examples]

### Test Scenarios

[Test cases table]
```

---

## Related Documentation

- `/lib/rules/*.json` - Configuration files for rules
- `/src/lib/rules/*.json` - Rules as configuration
- `/src/lib/server/validators/` - Server-side rule enforcement
- `/src/lib/server/services/` - Rate calculation
- `/src/routes/api/` - API route implementations

---

## Version

- **Application:** ShipTest v1.0
- **Stories Version:** 1.0
- **Last Updated:** January 2024
- **Total Stories:** 120+
