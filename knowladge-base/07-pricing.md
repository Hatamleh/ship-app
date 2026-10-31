# 07 — Pricing

## Formula

```
Total = Service base price
      + Weight (kg) × Service price per kg
      + Pickup fee            (sender country × pickup method)
      + Signature   $5.00     (if ticked or forced)
      + Liquid      $10.00    (if ticked)
      + Insurance   $15.00    (if ticked)
      + Packaging   $8.00     (if ticked)
```

- Currency: **USD**, shown with 2 decimals, rounded to the cent.
- Dimensions and receiver country do not change the price directly. The receiver country only
  matters through shipment type (service choice) and the forced signature (Jordan/Egypt).
- Discounts, taxes and promotions do not exist in the pricing rules.

## Inputs

| Input | Source |
|---|---|
| Base price, price per kg | [Services](./05-services.md) |
| Pickup fee | [Pickup fee table](./06-additional-options-and-pickup.md#pickup-fees-by-sender-country) |
| Option fees | Signature $5, Liquid $10, Insurance $15, Packaging $8 |

## Rate card (price summary)

Shown once a service is selected, and updated live as options change. Lines:
service base, weight cost, pickup fee, signature, liquid, insurance, packaging, **total**.

## Price integrity

- The price shown while filling the form is a **preview** only.
- At finalization the system **recalculates the price itself** from the current pricing rules and
  ignores any price sent by the customer's browser. The recalculated price is the one stored.
- Finalization fails if the service doesn't exist, the weight is above the service limit, or the
  price cannot be calculated.

## Worked examples (verified against the formula)

| Route (sender → receiver) | Service | Weight | Pickup | Options | Calculation | Total |
|---|---|---|---|---|---|---|
| SA → SA | Domestic Standard | 10 kg | Home | — | 15 + 5 + 8 | **$28.00** |
| UAE → UAE | Domestic Express | 10 kg | Postal | — | 30 + 10 + 3 | **$43.00** |
| Kuwait → SA | Gulf Standard | 5 kg | Home | Signature, Insurance | 25 + 7.50 + 7 + 5 + 15 | **$59.50** |
| Kuwait → SA | Gulf Standard | 15 kg | Home | Signature, Insurance | 25 + 22.50 + 7 + 5 + 15 | **$74.50** |
| SA → UAE | Gulf Standard | 20 kg | Postal | — | 25 + 30 + 3 | **$58.00** |
| SA → Egypt | International Economy | 12 kg | Home | Insurance + forced Signature | 35 + 24 + 8 + 15 + 5 | **$87.00** |
| Egypt → SA | International Economy | 20 kg | Postal | All four | 35 + 40 + 5 + 5 + 10 + 15 + 8 | **$118.00** |
| Lebanon → UAE | International Standard | 25 kg | Postal | All four | 50 + 75 + 4 + 5 + 10 + 15 + 8 | **$167.00** |

Some examples in the original documentation give different totals ($113, $163, $82, $52).
These appear to be errors — see [Known Gaps](./14-known-gaps-and-contradictions.md).

## Single service base cost examples

| Service | Weight | Calculation | Result |
|---|---|---|---|
| Domestic Standard | 10 kg | 15 + 10 × 0.50 | $20.00 |
| Domestic Express | 10 kg | 30 + 10 × 1.00 | $40.00 |
| Gulf Standard | 15 kg | 25 + 15 × 1.50 | $47.50 |
| Gulf Express | 15 kg | 45 + 15 × 2.50 | $82.50 |
| International Economy | 20 kg | 35 + 20 × 2.00 | $75.00 |
| International Standard | 20 kg | 50 + 20 × 3.00 | $110.00 |

## Stored breakdown

A finalized shipment stores: base cost (service base + weight cost + **pickup fee** combined),
signature, insurance, packaging, and total. Liquid is included in the total but not stored as its
own line.
