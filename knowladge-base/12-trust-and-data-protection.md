# 12 — Trust & Data Protection

Business-level protections the platform owner requires.

## Customer data isolation

- Every shipment belongs to exactly one customer.
- Customers can only see, edit, finalize and delete **their own** shipments.
- Someone else's shipment behaves as if it does not exist ("Not found") — the system never says
  "this belongs to someone else".
- The same boundary applies to the AI assistant.

## Access

| Open to everyone | Requires login |
|---|---|
| Login page, Register page | Order form, shipment list, shipment details, AI assistant, profile |

A price preview can be calculated without logging in; saving or finalizing requires login.

## Passwords

- Never stored or displayed in readable form.
- Never returned with profile information.

## Sessions

- Valid for 30 days, then the customer must log in again.
- Logout ends the session immediately.
- A tampered or expired session is treated as logged out.

## Price authority

- The customer cannot set or change a price.
- At finalization the system recalculates the price and stores only its own calculation.
- Example: an attempt to finalize with a fake low price still produces the correct price.

## Account uniqueness

- One account per email address. A duplicate registration is rejected.

## Safe error messages

| Situation | Message shown |
|---|---|
| Wrong password or unknown email | "Invalid email or password" (same for both) |
| Another customer's shipment | "Not found" |
| Unexpected problem | A generic error, no technical details |

## Input checks

All customer input is checked before it is accepted: email format, password length, name, phone,
postal code, weight (positive and within limits) and dimensions (positive, no more than 200 cm).

## Accessibility (product requirement)

Every control can be found by its visible role and label. A control that cannot be identified that
way is treated as an accessibility defect.
