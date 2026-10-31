# 13 — Business Rules Catalog

Every business rule in one place. "Enforced at" shows when the rule blocks the customer:
**Form** = while filling the form, **Final** = at finalization, **Draft** = when saving a draft.

## Geography & routes

| ID | Rule | Trigger | Effect | Enforced at |
|---|---|---|---|---|
| BR-01 | Gulf street (sender) | Sender in a Gulf country | Street required | Form, Final |
| BR-02 | Gulf street (receiver) | Receiver in a Gulf country | Street required | Form, Final |
| BR-03 | Gulf → Iraq block | Gulf sender and Iraq receiver | Shipment refused | Form, Final |
| BR-04 | Shipment type | Country pair | Same country = Domestic; both Gulf = IntraGulf; else International | Form, Final |

## Package

| ID | Rule | Trigger | Effect | Enforced at |
|---|---|---|---|---|
| BR-05 | Positive weight | Always | Weight > 0 | Form, Final |
| BR-06 | Type weight limit | Shipment type | Domestic ≤ 50, IntraGulf ≤ 30, International ≤ 25 kg | Form, Final |
| BR-07 | Dimension limits | Each side | > 0 and ≤ 200 cm | Form, Final |
| BR-08 | Customs description | Non-Gulf sender → Gulf receiver | Description shown, required, 5–200 characters | Form, Final |
| BR-09 | Valid numbers | Draft save | Weight and dimensions must be non-negative numbers | Draft |

## Services

| ID | Rule | Trigger | Effect | Enforced at |
|---|---|---|---|---|
| BR-10 | Type match | Shipment type | Only that type's two services offered | Form |
| BR-11 | Service weight limit | Weight above service max | Service not offered; finalization refused | Form, Final |
| BR-12 | Service required | Finalize | A service must be selected | Final |

## Options & pickup

| ID | Rule | Trigger | Effect | Enforced at |
|---|---|---|---|---|
| BR-13 | Forced signature | Receiver in Jordan or Egypt | Signature ticked, locked, +$5 | Form, Final |
| BR-14 | Heavy pickup | Weight > 17 kg | Home pickup disabled; postal office selected | Form, Final |
| BR-15 | Iraq pickup exception | Sender in Iraq | BR-14 does not apply | Form, Final |
| BR-16 | Pickup required | Finalize | A pickup method must be chosen | Final |

## Pricing

| ID | Rule | Effect |
|---|---|---|
| BR-17 | Price formula | Base + weight × per-kg + pickup fee + option fees |
| BR-18 | Pickup fee | Depends on sender country and method; unknown country uses $20 home / $8 postal |
| BR-19 | Option fees | Signature $5, Liquid $10, Insurance $15, Packaging $8 |
| BR-20 | Currency | USD, rounded to 2 decimals |
| BR-21 | Price authority | System recalculates at finalization; customer prices ignored |

## Contact & address fields (sender and receiver)

| ID | Rule | Effect |
|---|---|---|
| BR-22 | Name | At least 2 characters (stories: letters, spaces, hyphens, apostrophes only) |
| BR-23 | Phone | At least 10 digits after removing symbols |
| BR-24 | City | At least 2 characters |
| BR-25 | Postal code | 3–10 characters |
| BR-26 | Sender lock | Sender is always the customer's profile; not editable, not proposable by AI |

## Lifecycle

| ID | Rule | Effect |
|---|---|---|
| BR-27 | Draft leniency | Drafts skip business rules |
| BR-28 | Finalize once | A finalized shipment cannot be finalized again |
| BR-29 | Immutability | Finalized shipments cannot be edited |
| BR-30 | Tracking number | `TR` + 9 digits, unique, given only at finalization |
| BR-31 | Delete confirmation | Every delete asks for confirmation |
| BR-32 | Cancellation | Deleting a finalized shipment counts as cancelling it |
| BR-33 | Repeat | New independent order pre-filled from a finalized one, priced fresh |

## Accounts & access

| ID | Rule | Effect |
|---|---|---|
| BR-34 | Unique email | One account per email |
| BR-35 | Password length | At least 6 characters |
| BR-36 | Session length | 30 days, then log in again |
| BR-37 | Login required | Everything except Login and Register |
| BR-38 | Data isolation | Customers only reach their own shipments, also through the AI |
| BR-39 | Generic login error | "Invalid email or password" for any failure |

## History

| ID | Rule | Effect |
|---|---|---|
| BR-40 | Page size | 10 per page, newest first by default |
| BR-41 | Filter reset | Changing a filter returns to page 1 |

## AI assistant

| ID | Rule | Effect |
|---|---|---|
| BR-42 | Optional AI | App fully usable without it |
| BR-43 | Form-only bubble | Assistant offered only on new/edit/repeat order form |
| BR-44 | No invented facts | Shipments, prices and rules only from real sources |
| BR-45 | Consent to fill | Proposals applied only when the customer presses Apply |
| BR-46 | Documented policy only | Policy answers only from documentation, with sources |
