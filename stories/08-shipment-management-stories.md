# Shipment Management Stories

This document contains all user stories related to viewing, managing, and tracking shipments after creation.

---

## US-070: View All Shipments

**As a** logged-in user
**I want to** see all my shipments in a list
**So that** I can track and manage my orders

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Authentication required | Redirect to login if not authenticated |
| 2 | User's shipments only | Only show shipments belonging to current user |
| 3 | Default sort | Newest shipments first (createdAt desc) |
| 4 | Pagination | 10 items per page by default |
| 5 | Stats summary | Show total, draft, and finalized counts |

### Displayed Information

| Column | Description |
|--------|-------------|
| Status | Draft or Finalized badge |
| Tracking Number | TR + 9 digits (or "Draft" if not finalized) |
| From | Sender country |
| To | Receiver country |
| Total Cost | Final price in USD |
| Created | Date created |
| Actions | Kebab menu with options |

---

## US-071: View Shipment Statistics

**As a** user
**I want to** see summary statistics of my shipments
**So that** I have a quick overview

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Total count | Number of all shipments |
| 2 | Draft count | Number of draft shipments |
| 3 | Finalized count | Number of finalized shipments |
| 4 | Real-time | Updates when list changes |

### Stats Cards Display

┌─────────────┬─────────────┬─────────────┐
│   Total     │   Drafts    │  Finalized  │
│     15      │      3      │     12      │
└─────────────┴─────────────┴─────────────┘

---

## US-072: Filter Shipments by Status

**As a** user
**I want to** filter shipments by draft or finalized status
**So that** I can find specific shipments easily

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | All option | Shows all shipments |
| 2 | Draft option | Shows only draft shipments |
| 3 | Finalized option | Shows only finalized shipments |
| 4 | Real-time | List updates immediately on filter change |
| 5 | Preserved pagination | Resets to page 1 on filter change |

### Filter Values

| Filter | API Value | Description |
|--------|-----------|-------------|
| All | `all` | No status filter |
| Draft | `draft` | isDraft = true |
| Finalized | `finalized` | isDraft = false |

---

## US-073: Filter Shipments by Type

**As a** user
**I want to** filter shipments by type (Domestic, IntraGulf, International)
**So that** I can view specific categories

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | All option | Shows all shipment types |
| 2 | Domestic option | Shows only Domestic shipments |
| 3 | IntraGulf option | Shows only IntraGulf shipments |
| 4 | International option | Shows only International shipments |
| 5 | Combined filters | Works with status filter |

### Filter Values

| Filter | API Value |
|--------|-----------|
| All | `all` |
| Domestic | `Domestic` |
| IntraGulf | `IntraGulf` |
| International | `International` |

---

## US-074: Sort Shipments

**As a** user
**I want to** sort shipments by different criteria
**So that** I can organize the list as needed

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Sort by date | createdAt ascending/descending |
| 2 | Sort by cost | totalCost ascending/descending |
| 3 | Sort by status | status ascending/descending |
| 4 | Toggle direction | Clicking again reverses order |
| 5 | Visual indicator | Arrow shows current sort direction |

### Sort Options

| Sort By | API Value | Description |
|---------|-----------|-------------|
| Date | `createdAt` | When shipment was created |
| Cost | `totalCost` | Total price |
| Status | `status` | Draft vs Finalized |

### Sort Direction

| Direction | API Value |
|-----------|-----------|
| Ascending | `asc` |
| Descending | `desc` |

---

## US-075: Paginate Shipments

**As a** user
**I want to** navigate through pages of shipments
**So that** I can view all my shipments

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Default page size | 10 items per page |
| 2 | Page navigation | Previous/Next buttons |
| 3 | Page indicator | "Page X of Y" displayed |
| 4 | Total count | Total items shown |
| 5 | Empty state | "No shipments found" if empty |

### Pagination Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| page | 1 | Current page number |
| limit | 10 | Items per page |

---

## US-076: View Shipment Details

**As a** user
**I want to** see full details of a specific shipment
**So that** I can review all information

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | All information shown | Sender, receiver, package, service, options, rate |
| 2 | Status indicator | Draft or Finalized badge |
| 3 | Tracking number | Displayed for finalized shipments |
| 4 | Cost breakdown | Itemized fees shown |
| 5 | Actions available | Edit, finalize, delete based on status |

### Detail Sections

**Header**
- Status badge
- Tracking number (or "Draft")
- Creation date

**Sender Information**
- Name, phone
- Country, city
- Street (if provided)
- Postal code

**Receiver Information**
- Name, phone
- Country, city
- Street (if provided)
- Postal code

**Package Information**
- Weight (kg)
- Dimensions (L × W × H cm)
- Item description (if provided)

**Service Information**
- Shipment type
- Service name
- Pickup method
- Estimated delivery

**Additional Options**
- Signature required (Yes/No)
- Contains liquid (Yes/No)
- Insurance (Yes/No)
- Professional packaging (Yes/No)

**Cost Breakdown**
- Base cost
- Signature fee
- Liquid fee
- Insurance fee
- Packaging fee
- **Total**

---

## US-077: Save Shipment as Draft

**As a** user
**I want to** save an incomplete shipment as draft
**So that** I can complete it later

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Minimal validation | Only type checking, not business rules |
| 2 | Status set to draft | isDraft = true, status = 'draft' |
| 3 | No tracking number | Tracking number not generated |
| 4 | Can be edited | Draft can be modified later |
| 5 | Can be finalized | Draft can be completed later |

### API Endpoint

**Endpoint:** POST /api/shipments/draft

---

## US-078: Finalize Shipment

**As a** user
**I want to** finalize a shipment to confirm my order
**So that** the package can be shipped

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Full validation | All 130+ business rules enforced |
| 2 | Server rate calculation | Rates recalculated on server |
| 3 | Tracking number generated | Format: TR + 9 random digits |
| 4 | Status updated | isDraft = false, status = 'finalized' |
| 5 | Estimated delivery | Calculated based on service |
| 6 | Cannot re-finalize | Already finalized shipments rejected |

### API Endpoint

**Endpoint:** POST /api/shipments/finalize

---

## US-079: Edit Draft Shipment

**As a** user
**I want to** modify a draft shipment
**So that** I can update details before finalizing

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Only drafts | Finalized shipments cannot be edited |
| 2 | All fields editable | Can change any field except sender |
| 3 | Form pre-filled | Existing values loaded in form |
| 4 | Save as draft | Can save changes as draft |
| 5 | Finalize | Can finalize after editing |

### Edit Flow

1. User clicks Edit on draft shipment
2. Navigate to form with ?edit=shipmentId
3. Form loads existing shipment data
4. User makes changes
5. User saves as draft or finalizes

### API Endpoint

**Endpoint:** PUT /api/shipments/[id]

---

## US-080: Delete Shipment

**As a** user
**I want to** delete a shipment
**So that** I can remove unwanted orders

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Confirmation required | Modal asks for confirmation |
| 2 | Draft deletion | Allowed, permanently removed |
| 3 | Finalized deletion | Allowed (cancellation) |
| 4 | Own shipments only | Cannot delete others' shipments |
| 5 | Success message | Confirmation shown after deletion |

### Delete Confirmation Modal

┌────────────────────────────────────────┐
│         Delete Shipment?               │
│                                        │
│  Are you sure you want to delete this  │
│  shipment? This action cannot be       │
│  undone.                               │
│                                        │
│        [Cancel]    [Delete]            │
└────────────────────────────────────────┘

### API Endpoint

**Endpoint:** DELETE /api/shipments/[id]

---

## US-081: Repeat Previous Shipment

**As a** user
**I want to** create a new shipment based on a previous one
**So that** I can quickly ship to the same address

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Available for finalized | Repeat button shown on finalized shipments |
| 2 | Form pre-filled | Uses previous shipment's data |
| 3 | New shipment | Creates new draft, not linked to original |
| 4 | Editable | User can modify any fields |
| 5 | Fresh rates | Rates recalculated (prices may have changed) |

### Repeat Flow

1. User views finalized shipment details
2. User clicks "Repeat" button
3. Navigate to form with ?repeat=shipmentId
4. Form loads with previous shipment's data
5. User reviews and modifies if needed
6. User saves as draft or finalizes as new shipment

---

## US-082: Finalize Draft from List

**As a** user
**I want to** quickly finalize a draft from the shipment list
**So that** I don't have to open the detail page

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Kebab menu option | "Finalize" shown for drafts |
| 2 | Direct finalization | Calls finalize API |
| 3 | Full validation | All rules enforced |
| 4 | Success feedback | Status updates in list |
| 5 | Error handling | Validation errors shown |

---

## US-083: Tracking Number Generation

**As a** system
**I want to** generate unique tracking numbers
**So that** shipments can be tracked

### Acceptance Criteria

| # | Criterion | Expected Behavior |
|---|-----------|-------------------|
| 1 | Format | "TR" + 9 random digits |
| 2 | Length | 11 characters total |
| 3 | Unique | No duplicates in database |
| 4 | Generated on finalize | Not assigned to drafts |

### Tracking Number Format

TR123456789
│ └──────── 9 random digits
└────────── Prefix "TR"

---

## API Endpoints Summary

### List Shipments

**Endpoint:** GET /api/shipments

Query Parameters:
- `status`: all | draft | finalized
- `shipmentType`: all | Domestic | IntraGulf | International
- `sortBy`: createdAt | totalCost | status
- `sortOrder`: asc | desc
- `page`: number (default: 1)
- `limit`: number (default: 10)

### Get Single Shipment

**Endpoint:** GET /api/shipments/[id]

### Create Shipment

**Endpoint:** POST /api/shipments

### Save Draft

**Endpoint:** POST /api/shipments/draft

### Finalize Shipment

**Endpoint:** POST /api/shipments/finalize

### Update Shipment

**Endpoint:** PUT /api/shipments/[id]

### Delete Shipment

**Endpoint:** DELETE /api/shipments/[id]

---

## Test Scenarios Summary

| Scenario | Action | Expected |
|----------|--------|----------|
| View empty list | No shipments | "No shipments found" message |
| View with shipments | Has shipments | List displayed with pagination |
| Filter by draft | Select draft filter | Only drafts shown |
| Filter by finalized | Select finalized filter | Only finalized shown |
| Filter by type | Select Domestic | Only Domestic shown |
| Sort by date asc | Click date column | Oldest first |
| Sort by cost desc | Click cost column | Highest first |
| Navigate pages | Click next | Page 2 loaded |
| View details | Click shipment | Detail page shown |
| Edit draft | Click edit | Form with data loaded |
| Edit finalized | Try to edit | Error/not allowed |
| Delete draft | Confirm delete | Shipment removed |
| Delete finalized | Confirm delete | Shipment removed |
| Finalize draft | Click finalize | Tracking number generated |
| Repeat shipment | Click repeat | New form with data |
