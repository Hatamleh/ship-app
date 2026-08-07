# Progressive Form & UI Flow Stories

This document contains all user stories related to the progressive form unlocking, user interface flow, and user experience in the shipment creation process.

---

## US-130: Progressive Form Disclosure

**As a** user
**I want to** see form sections unlock progressively
**So that** I'm guided through the process step-by-step

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Initial state | Only sender card enabled |
| 2 | After sender | Receiver card unlocks |
| 3 | After receiver | Package card unlocks |
| 4 | After package | Service and options cards unlock |
| 5 | After service | Rate card appears |
| 6 | Visual indication | Disabled cards appear grayed/locked |

### Form Unlock Sequence

┌─────────────────────────────────────────────────┐
│ Step 1: Sender Information                      │
│ ✓ Always enabled on load                        │
│ → Pre-filled with user profile (disabled)       │
└─────────────────────────────────────────────────┘
│
▼ (Complete)
┌─────────────────────────────────────────────────┐
│ Step 2: Receiver Information                    │
│ → Unlocks after sender complete                 │
│ → User enters recipient details                 │
└─────────────────────────────────────────────────┘
│
▼ (Complete)
┌─────────────────────────────────────────────────┐
│ Step 3: Package Information                     │
│ → Unlocks after receiver complete               │
│ → User enters weight and dimensions             │
└─────────────────────────────────────────────────┘
│
▼ (Complete)
┌─────────────────────────────────────────────────┐
│ Step 4: Service Selection                       │
│ → Unlocks after package complete                │
│ → Shows services based on type and weight       │
└─────────────────────────────────────────────────┘
│
▼ (Complete)
┌─────────────────────────────────────────────────┐
│ Step 5: Additional Options                      │
│ → Unlocks after package complete                │
│ → Signature, insurance, pickup method           │
└─────────────────────────────────────────────────┘
│
▼ (Service Selected)
┌─────────────────────────────────────────────────┐
│ Step 6: Rate Card                               │
│ → Shows after service selected                  │
│ → Displays pricing breakdown                    │
│ → Save/Finalize buttons                         │
└─────────────────────────────────────────────────┘

---

## US-131: Sender Card Always Enabled

**As a** user
**I want to** see my sender information on form load
**So that** I can start the shipment process

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Enabled on load | Card is active immediately |
| 2 | Pre-filled | User profile data loaded |
| 3 | Read-only | Fields are disabled (cannot edit) |
| 4 | Auto-complete | Card marked complete if profile valid |

---

## US-132: Receiver Card Unlock

**As a** system
**I want to** unlock receiver card after sender is complete
**So that** users follow the correct sequence

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Trigger | Sender card validation passes |
| 2 | Visual change | Card becomes interactive |
| 3 | Focus shift | First receiver field gains focus |
| 4 | Rules loaded | Receiver rules fetched based on sender country |

---

## US-133: Package Card Unlock

**As a** system
**I want to** unlock package card after receiver is complete
**So that** shipment type is known before package entry

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Trigger | Receiver card validation passes |
| 2 | No blocked routes | Gulf to Iraq check passed |
| 3 | Shipment type set | Domestic/IntraGulf/International determined |
| 4 | Weight limits set | Max weight based on shipment type |
| 5 | Description visibility | Shows if non-Gulf to Gulf |

---

## US-134: Service Card Unlock

**As a** system
**I want to** unlock service selection after package is complete
**So that** services can be filtered by weight

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Trigger | Package card validation passes |
| 2 | Weight valid | Within shipment type limits |
| 3 | Dimensions valid | All within 200 cm |
| 4 | Description valid | If required, min 5 chars |
| 5 | Services filtered | Only compatible services shown |

---

## US-135: Additional Options Card Unlock

**As a** system
**I want to** unlock options after package is complete
**So that** weight-based rules can be applied

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Trigger | Package card validation passes |
| 2 | Concurrent with service | Both unlock at same time |
| 3 | Rules applied | Signature/pickup rules based on context |

### Dynamic Rules

| Condition | Effect |
|-----------|--------|
| Receiver = Jordan | Signature forced |
| Receiver = Egypt | Signature forced |
| Weight > 17 kg | Home pickup disabled |
| Sender = Iraq | Home pickup exception |

---

## US-136: Rate Card Display

**As a** system
**I want to** show rate card after service selection
**So that** users see pricing before submission

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Trigger | Service selected |
| 2 | Rate calculated | API call to /api/rates |
| 3 | Breakdown shown | Itemized costs displayed |
| 4 | Total shown | Final price prominent |
| 5 | Buttons available | Save Draft and Finalize |

---

## US-137: Form Validation on Blur

**As a** system
**I want to** validate fields when user leaves them
**So that** errors are shown immediately

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Trigger | Field loses focus (blur event) |
| 2 | Field validated | Single field validation runs |
| 3 | Error shown | Error message appears below field |
| 4 | Card completion | Rechecked after each validation |

### Validation Flow

1. User enters value in field
2. User clicks/tabs to next field
3. Blur event triggers validation
4. If invalid → Show error message
5. If valid → Clear error, update completion status

---

## US-138: Form Validation on Submit

**As a** system
**I want to** validate entire form on submission
**So that** all errors are caught

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Save as Draft | Minimal validation (type checking) |
| 2 | Finalize | Full validation (130+ rules) |
| 3 | Scroll to error | First error scrolled into view |
| 4 | Error summary | All errors highlighted |
| 5 | Block submission | Cannot proceed with errors |

### Validation Levels

| Action | Validation Level |
|--------|-----------------|
| Save as Draft | Type checking only |
| Finalize | Full business rules |

---

## US-139: API Validation Priority

**As a** system
**I want to** prioritize API validation over client-side
**So that** authoritative rules are enforced

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Server errors | Override client validation |
| 2 | Display API errors | Show in form |
| 3 | Unexpected errors | Handle gracefully |

### Error Priority

1. Client-side (immediate feedback)
2. API validation (authoritative)
3. API errors override client errors

---

## US-140: Dynamic Rule Loading

**As a** system
**I want to** load rules dynamically based on context
**So that** forms adapt to user input

### Rule Loading Points

| Trigger | Rules Loaded |
|---------|--------------|
| Form load | Sender rules |
| Sender complete | Receiver rules |
| Receiver complete | Package rules |
| Package complete | Service rules, Options rules |
| Service selected | Rate calculation |

### API Endpoints Called

Form Load:
→ POST /api/rules/sender
After Sender:
→ POST /api/rules/receiver
After Receiver:
→ POST /api/rules/package
After Package:
→ POST /api/rules/service
→ POST /api/rules/additional-options
After Service Selection:
→ POST /api/rates

---

## US-141: Form Layout

**As a** user
**I want to** see a clear, organized form layout
**So that** I can easily complete the shipment

### Layout Structure

┌─────────────────────────────────────────────────────────┐
│                    Header / Navigation                   │
├─────────────────────────────┬───────────────────────────┤
│       Left Column           │      Right Column          │
│                             │                            │
│  ┌──────────────────────┐   │  ┌──────────────────────┐  │
│  │   Sender Card        │   │  │   Service Card       │  │
│  │   (Pre-filled)       │   │  │   (Step 4)           │  │
│  └──────────────────────┘   │  └──────────────────────┘  │
│                             │                            │
│  ┌──────────────────────┐   │  ┌──────────────────────┐  │
│  │   Receiver Card      │   │  │   Options Card       │  │
│  │   (Step 2)           │   │  │   (Step 5)           │  │
│  └──────────────────────┘   │  └──────────────────────┘  │
│                             │                            │
│  ┌──────────────────────┐   │  ┌──────────────────────┐  │
│  │   Package Card       │   │  │   Rate Card          │  │
│  │   (Step 3)           │   │  │   (Final Step)       │  │
│  └──────────────────────┘   │  └──────────────────────┘  │
│                             │                            │
└─────────────────────────────┴───────────────────────────┘

### Responsive Behavior

| Viewport | Layout |
|----------|--------|
| Desktop | 2-column grid |
| Tablet | 2-column grid |
| Mobile | Single column stack |

---

## US-142: Error Display

**As a** user
**I want to** see clear error messages
**So that** I know what to fix

### Error Display Patterns

| Error Type | Display Location |
|------------|-----------------|
| Field error | Below the field |
| Card error | Top of card |
| Form error | Top of form |
| API error | Modal or toast |

---

## US-143: Loading States

**As a** user
**I want to** see loading indicators
**So that** I know the system is working

### Loading Scenarios

| Action | Loading Display |
|--------|-----------------|
| Page load | Full page spinner |
| Rule fetching | Card skeleton |
| Rate calculation | Rate card loading |
| Form submission | Button spinner |

---

## Test Scenarios Summary

| Scenario | Action | Expected |
|----------|--------|----------|
| Initial load | Open form | Only sender enabled |
| Complete sender | Fill sender | Receiver unlocks |
| Complete receiver | Fill receiver | Package unlocks |
| Complete package | Fill package | Service + Options unlock |
| Select service | Choose service | Rate card appears |
| Field blur | Leave field | Validation runs |
| Save draft | Click save | Minimal validation |
| Finalize | Click finalize | Full validation |
| API error | Server rejects | Error displayed |
| Mobile view | Small screen | Single column layout |
