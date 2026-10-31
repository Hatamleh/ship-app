# 04 — Package

## Fields

| Field | Required | Unit | Rule |
|---|---|---|---|
| Weight | Yes | kg | More than 0 and no more than the shipment-type limit |
| Length | Yes | cm | More than 0, no more than 200 |
| Width | Yes | cm | More than 0, no more than 200 |
| Height | Yes | cm | More than 0, no more than 200 |
| Item description | Conditional | — | Non-Gulf → Gulf only; 5–200 characters |

Only numbers are accepted for weight and dimensions.

## Weight limit by shipment type

| Shipment type | Max weight |
|---|---|
| Domestic | 50 kg |
| IntraGulf | 30 kg |
| International | 25 kg |

Message example: "Weight cannot exceed 30 kg for IntraGulf shipments".

| Weight | Type | Valid |
|---|---|---|
| 0 | Any | No — must be greater than 0 |
| -5 | Any | No |
| 50 | Domestic | Yes |
| 51 | Domestic | No |
| 30 | IntraGulf | Yes |
| 31 | IntraGulf | No |
| 25 | International | Yes |
| 26 | International | No |

Weight also affects:
- which services are offered ([Services](./05-services.md)),
- whether home pickup is allowed — over 17 kg it is not ([Pickup](./06-additional-options-and-pickup.md)),
- the price ([Pricing](./07-pricing.md)).

## Dimensions

Each side must be more than 0 and no more than 200 cm. All three are required.

| Dimension | Value | Valid |
|---|---|---|
| Length | 0 | No |
| Length | 200 | Yes |
| Length | 201 | No |
| Width | -5 | No |
| Height | 150 | Yes |

Dimensions do **not** affect the price (no volumetric weight).

## Item description (customs)

- **Shown and required only when a non-Gulf sender ships to a Gulf receiver.** Hidden otherwise.
- Minimum 5 characters, maximum 200.
- Reason: customs documentation for goods entering the Gulf.

| Sender | Receiver | Description |
|---|---|---|
| Egypt | Saudi Arabia | Required |
| Jordan | Kuwait | Required |
| Lebanon | Qatar | Required |
| Saudi Arabia | UAE | Hidden |
| Saudi Arabia | Egypt | Hidden |
| Egypt | Jordan | Hidden |

| Input (Egypt → Saudi Arabia) | Result |
|---|---|
| empty | Error — required |
| `abc` | Error — minimum 5 characters |
| `Electronics` | OK |

## Package section completion

Complete when weight is within the limit, all dimensions are within limits, and the description
is filled when required. This unlocks both the Service and Additional Options sections.
