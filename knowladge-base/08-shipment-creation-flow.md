# 08 — Shipment Creation Flow

The order form (home page) guides the customer through sections that unlock one at a time.

## Sequence

```
1. Sender  →  2. Receiver  →  3. Package  →  4. Service ┐
                                           →  5. Options ┘→  6. Price summary + Save / Finalize
```

| Step | Section | Unlocks when | Notes |
|---|---|---|---|
| 1 | Sender | Page opens | Pre-filled from profile, read-only |
| 2 | Receiver | Sender complete | Customer types recipient details |
| 3 | Package | Receiver complete and route allowed | Shipment type and weight limit now known |
| 4 | Service | Package valid | Only services that fit type and weight |
| 5 | Options | Package valid (same time as Service) | Signature and pickup rules applied |
| 6 | Price summary | A service is selected | Buttons: Save as draft, Finalize |

Locked sections appear greyed out.

## What each step decides for the next

| After | The system knows |
|---|---|
| Sender | Sender country → street requirement |
| Receiver | Shipment type, Gulf → Iraq block, receiver street requirement, whether description is needed |
| Package | Max weight, offered services, home pickup availability, forced signature |
| Service | Price |

## When validation happens

| Moment | What is checked |
|---|---|
| Leaving a field | That field; error shown below it; section completion rechecked |
| Selecting a country | Gulf → Iraq block and street requirement immediately |
| Save as draft | Only that numbers are valid numbers |
| Finalize | **Every business rule** (see [Rules Catalog](./13-business-rules-catalog.md)) |

On finalize, all errors are highlighted and the first error is scrolled into view.
The system's final check wins over the form's own checks.

## Where errors appear

| Error | Location |
|---|---|
| Field | Below the field |
| Section | Top of the section |
| Whole form | Top of the form |
| System | Popup or notice |

## Entry points to the form

| Entry | Behaviour |
|---|---|
| New order | Empty form (sender pre-filled) |
| Edit draft | Form pre-filled with the draft |
| Repeat | Form pre-filled from a finalized shipment; saved as a new order |

## Layout

Two columns on desktop and tablet (left: Sender, Receiver, Package; right: Service, Options,
Price summary). One column on mobile.

## Loading feedback

Page load, section rules, price calculation and submit buttons all show loading indicators.
