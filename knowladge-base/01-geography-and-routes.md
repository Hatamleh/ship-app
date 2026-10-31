# 01 — Geography & Routes

Geography drives most of the business logic: which fields are required, which services exist,
weight limits, and whether a route is allowed at all.

## Supported countries

| Country | Code | Group |
|---|---|---|
| Saudi Arabia | SA | Gulf |
| United Arab Emirates | AE | Gulf |
| Kuwait | KW | Gulf |
| Bahrain | BH | Gulf |
| Qatar | QA | Gulf |
| Oman | OM | Gulf |
| Egypt | EG | Non-Gulf |
| Jordan | JO | Non-Gulf |
| Lebanon | LB | Non-Gulf |
| Iraq | IQ | Non-Gulf |

Countries also have Arabic names in the reference data. Only these 10 countries can be selected.

## What "Gulf" affects

1. Street address is required for Gulf addresses (sender or receiver).
2. Gulf → Iraq shipments are blocked.
3. Non-Gulf → Gulf shipments require an item description (customs).
4. Shipment type (Domestic / IntraGulf / International).

## Shipment type

Decided automatically from sender and receiver country. The customer never picks it.

| Rule (checked in order) | Type | Max weight |
|---|---|---|
| Sender country = receiver country | **Domestic** | 50 kg |
| Both countries are Gulf | **IntraGulf** | 30 kg |
| Anything else | **International** | 25 kg |

### Matrix

| Sender | Receiver | Type |
|---|---|---|
| Saudi Arabia | Saudi Arabia | Domestic |
| Kuwait | Kuwait | Domestic |
| Egypt | Egypt | Domestic |
| Saudi Arabia | UAE | IntraGulf |
| UAE | Kuwait | IntraGulf |
| Saudi Arabia | Egypt | International |
| UAE | Jordan | International |
| Egypt | Saudi Arabia | International ⚠️ |
| Lebanon | Qatar | International ⚠️ |
| Egypt | Jordan | International |
| Lebanon | Iraq | International |

⚠️ Some documents say non-Gulf → Gulf is IntraGulf. The actual behaviour is International.
See [Known Gaps](./14-known-gaps-and-contradictions.md).

## Blocked route: Gulf → Iraq

- **Rule:** if the sender is in any Gulf country and the receiver is in Iraq, the shipment is refused.
- **Message:** "Shipping from Gulf countries to Iraq is not currently available".
- **When:** immediately when Iraq is selected on the form, and again at finalization.
- The order cannot be finalized while this error exists.

| Sender | Receiver | Allowed |
|---|---|---|
| Saudi Arabia / UAE / Kuwait / Bahrain / Qatar / Oman | Iraq | **No** |
| Egypt / Jordan / Lebanon | Iraq | Yes |
| Iraq | Iraq | Yes (Domestic) |
| Iraq | Saudi Arabia | Yes |

## Iraq as a sender

Iraq has a special exception: senders in Iraq can always choose home pickup regardless of weight.
See [Additional Options & Pickup](./06-additional-options-and-pickup.md).
