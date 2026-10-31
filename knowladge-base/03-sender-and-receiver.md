# 03 — Sender & Receiver

## Sender

- **Always the logged-in customer.** Filled automatically from their profile.
- **Read-only** on the order form — the customer cannot type a different sender.
- Normally complete as soon as the form opens, which unlocks the Receiver section.
- The AI assistant is also forbidden from changing the sender.

## Receiver

Entered by the customer for each order.

| Field | Required | Rule |
|---|---|---|
| Full name | Yes | At least 2 characters; letters, spaces, hyphens and apostrophes (see note) |
| Phone | Yes | At least 10 digits; any format, symbols and spaces are ignored |
| Country | Yes | One of the 10 supported countries |
| City | Yes | At least 2 characters |
| Street | Gulf only | Required when the country is a Gulf country, optional otherwise |
| Postal code | Yes | 3–10 characters |

## Rules shared by both parties

### Street address for Gulf countries
- Gulf country → street **required**: "Street address is required for Gulf countries".
- Non-Gulf country → street optional.
- The requirement changes immediately when the country changes; required fields show an asterisk.

| Country | Role | Street empty | Result |
|---|---|---|---|
| Saudi Arabia | Sender | Yes | Error |
| Saudi Arabia | Receiver | Yes | Error |
| Egypt | Sender | Yes | OK |
| Egypt | Receiver | Yes | OK |
| Jordan | Receiver | Yes | OK |

### Name
| Input | Valid |
|---|---|
| `Ahmad` | Yes |
| `Al-Hassan` | Yes (hyphen) |
| `O'Brien` | Yes (apostrophe) |
| `John Smith` | Yes (space) |
| `A` | No (too short) |
| `John123` | No per stories (digits) ⚠️ |
| `User@Name` | No per stories (symbol) ⚠️ |

⚠️ Final validation only checks length — see [Known Gaps](./14-known-gaps-and-contradictions.md).

### Phone
| Input | Digits counted | Valid |
|---|---|---|
| `5550123456` | 10 | Yes |
| `555-012-3456` | 10 | Yes |
| `(555) 012-3456` | 10 | Yes |
| `+966501234567` | 12 | Yes |
| `12345` | 5 | No |

### Postal code and city
- Postal code: required, 3–10 characters.
- City: required, at least 2 characters.

## Receiver section completion

The Receiver section is complete when every field is valid **and** the route is not blocked
(Gulf → Iraq). Completing it fixes the shipment type and unlocks the Package section.

## Test scenarios

| Sender | Receiver | Situation | Expected |
|---|---|---|---|
| UAE | Saudi Arabia | Valid | OK, IntraGulf |
| Kuwait | Kuwait | Valid | OK, Domestic |
| Saudi Arabia | Iraq | — | Blocked |
| Lebanon | Iraq | Valid | OK, International |
| Saudi Arabia | UAE | No receiver street | Error |
| Egypt | Jordan | No receiver street | OK |
| Any | Any | 5-digit phone | Error |
