# 05 — Services

## Service catalogue

Two services per shipment type. Each service has its own price and its own weight limit.

| Shipment type | Service | Base price | Per kg | Delivery | Max weight | Described as |
|---|---|---|---|---|---|---|
| Domestic | Domestic Standard | $15.00 | $0.50 | 3 days | 50 kg | 2–3 business days |
| Domestic | Domestic Express | $30.00 | $1.00 | 1 day | 30 kg | 1 business day |
| IntraGulf | Gulf Standard | $25.00 | $1.50 | 5 days | 30 kg | 4–5 business days |
| IntraGulf | Gulf Express | $45.00 | $2.50 | 2 days | 20 kg | 2 business days |
| International | International Economy | $35.00 | $2.00 | 10 days | 25 kg | 8–10 business days |
| International | International Standard | $50.00 | $3.00 | 7 days | 25 kg | 5–7 business days |

Each service card shows: name, description, delivery days, base price, price per kg, max weight.

## Which services are offered

1. Only services of the shipment's type.
2. Only services whose max weight is **at least** the package weight (equal is allowed).
3. The list updates as the weight changes.

| Type | Weight | Offered |
|---|---|---|
| Domestic | 10 kg | Standard, Express |
| Domestic | 30 kg | Standard, Express |
| Domestic | 35 kg | Standard only |
| Domestic | 50 kg | Standard only |
| Domestic | 51 kg | None |
| IntraGulf | 15 kg | Standard, Express |
| IntraGulf | 20 kg | Standard, Express |
| IntraGulf | 25 kg | Standard only |
| IntraGulf | 31 kg | None |
| International | 20 kg | Economy, Standard |
| International | 25 kg | Economy, Standard |
| International | 26 kg | None |

## No services available

- Message: "No services available", with the weight limit explained and a suggestion to reduce weight.
- The order cannot be finalized.

## Selecting a service

- Exactly one service can be selected; it is highlighted.
- Selecting a service shows the price summary (rate card) and updates the total.
- A service is required to finalize.

## Estimated delivery

At finalization the estimated delivery is derived from the chosen service's delivery days.
