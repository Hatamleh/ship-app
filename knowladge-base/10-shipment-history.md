# 10 — Shipment History

## Shipment list

- Shows **only the logged-in customer's shipments**.
- Default order: newest first.
- **10 shipments per page**, with Previous / Next and "Page X of Y", plus the total count.
- Empty list: "No shipments found".

### Columns

| Column | Content |
|---|---|
| Status | Draft or Finalized badge |
| Tracking number | `TR#########`, or "Draft" |
| From | Sender country |
| To | Receiver country |
| Total cost | USD |
| Created | Date |
| Actions | Menu: view, edit (draft), finalize (draft), repeat (finalized), delete |

## Summary counters

Three cards above the list: **Total**, **Drafts**, **Finalized**. They update when the list changes.

## Filters

| Filter | Values |
|---|---|
| Status | All, Draft, Finalized |
| Shipment type | All, Domestic, IntraGulf, International |

- Filters combine (for example Draft + International).
- Changing a filter returns to page 1.

## Sorting

| Sort by | Directions |
|---|---|
| Date created | Oldest first / newest first |
| Total cost | Low → high / high → low |
| Status | Draft vs Finalized |

Selecting the same column again reverses direction; an arrow shows the current direction.

## Shipment details page

| Section | Content |
|---|---|
| Header | Status, tracking number (or "Draft"), creation date |
| Sender | Name, phone, country, city, street (if any), postal code |
| Receiver | Same fields as sender |
| Package | Weight, dimensions (L × W × H), item description (if any) |
| Service | Shipment type, service name, pickup method, estimated delivery |
| Options | Signature, liquid, insurance, packaging — Yes/No |
| Cost breakdown | Base cost, signature, liquid, insurance, packaging, **total** |
| Actions | Edit / finalize / delete / repeat, depending on status |

The details page is read-only; the AI assistant is not offered there.

## Promotional popup

- A "**Special Offer!** Get 20% off express shipping this week only!" popup appears on roughly
  half of visits to the list, after a short delay, and is closed with a Close button.
- It is a **testing exercise** (handling unpredictable popups). The discount is **not** applied
  to any price.
