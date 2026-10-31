# 09 — Shipment Lifecycle

## States

```
                 Save as draft                 Finalize
   [Order form] ──────────────► [DRAFT] ───────────────────► [FINALIZED]
        │                         │ edit / delete              │ tracking number
        └──── Finalize directly ──┴───────────────────────────►│ no editing
                                                               │ delete = cancel
                                                               └─ Repeat → new order form
```

| State | Tracking number | Editable | Deletable | Business rules enforced |
|---|---|---|---|---|
| Draft | No ("Draft") | Yes | Yes | No — only number checks |
| Finalized | Yes | **No** | Yes (cancellation) | Yes — all of them |

## Save as draft

- Lets the customer stop and continue later.
- Only checks that weight and dimensions, if entered, are valid non-negative numbers.
- No tracking number. Shows as "Draft" in the list.

## Finalize

Can be done from the order form, from a draft's details, or from the actions menu in the list.

1. All business rules are checked (sender, receiver, route, package, service, options).
2. The price is recalculated by the system.
3. A **tracking number** is generated.
4. Status becomes Finalized; estimated delivery is set from the service.

Refused if: any rule fails, no service is selected, or the shipment is already finalized.

## Tracking number

- Format: `TR` + 9 random digits, 11 characters in total (e.g. `TR123456789`).
- Unique across all shipments.
- Only given at finalization, never to drafts.

## Edit

- **Drafts only.** Finalized shipments are immutable: "Only drafts can be edited".
- Every field can change except the sender.
- After editing, the customer can save again as draft or finalize.

## Delete / cancel

- Always asks for confirmation: "Are you sure you want to delete this shipment? This action cannot be undone."
- Draft → "Shipment deleted successfully".
- Finalized → "Shipment cancelled successfully" (business meaning: cancellation).
- The record is removed permanently in both cases.
- Only the owner can delete.

## Repeat

- Offered on finalized shipments.
- Opens a new order form pre-filled with the old shipment's details.
- The new order is independent of the original; any field can be changed.
- The price is calculated fresh (prices may have changed).

## Test scenarios

| Action | Expected |
|---|---|
| Save incomplete order as draft | Saved, no tracking number |
| Finalize a valid draft | Tracking number generated |
| Finalize an invalid draft | Errors shown, stays draft |
| Finalize an already finalized order | Refused |
| Edit a draft | Form pre-filled, changes saved |
| Edit a finalized shipment | Not allowed |
| Delete a draft | Removed, "deleted" message |
| Delete a finalized shipment | Removed, "cancelled" message |
| Repeat a finalized shipment | New pre-filled form |
