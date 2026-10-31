# 06 — Additional Options & Pickup

The Options section unlocks at the same time as Services (after the package is valid).

## Options

| Option | Type | Fee | Default | Rule |
|---|---|---|---|---|
| Signature required | Checkbox | $5.00 | Off | Optional, except forced for Jordan/Egypt receivers |
| Contains liquid | Checkbox | $10.00 | Off | Always optional — special handling |
| Insurance | Checkbox | $15.00 | Off | Always optional — loss/damage protection |
| Professional packaging | Checkbox | $8.00 | Off | Always optional |
| Pickup method | Choice | Varies | Home pickup | Home pickup or postal-office drop-off |

Ticking an option adds its fee to the total; unticking removes it.

## Mandatory signature — Jordan and Egypt

- If the **receiver** is in Jordan or Egypt, signature is automatically ticked and **locked**.
- The $5 fee is always added.
- An explanation tells the customer why it is required (regulatory requirement).
- Finalizing without signature to these countries is refused:
  "Signature is required when shipping to Jordan" (or Egypt).

| Receiver country | Signature required | Customer can change |
|---|---|---|
| Saudi Arabia, UAE, Kuwait, Bahrain, Qatar, Oman | No | Yes |
| Lebanon, Iraq | No | Yes |
| **Jordan** | **Yes** | **No** |
| **Egypt** | **Yes** | **No** |

Note: it depends on the receiver, not the sender. An Egypt **sender** is not forced.

## Pickup method

| Method | Meaning |
|---|---|
| Home pickup | Courier collects from the sender's address (default) |
| Postal office | Sender drops the package at a postal office |

### Heavy package rule (17 kg)
- Package **over 17 kg** → home pickup is disabled and postal office is selected automatically,
  with a message explaining why.
- Exactly 17 kg → home pickup still allowed.
- Finalizing with home pickup over 17 kg is refused:
  "Home pickup is not available for packages over 17 kg. Please choose drop off at a postal office".

### Iraq exception
- If the **sender** is in Iraq, home pickup is always available, at any weight.

| Sender | Weight | Home pickup |
|---|---|---|
| Saudi Arabia | 10 kg | Available |
| Saudi Arabia | 17 kg | Available |
| Saudi Arabia | 18 kg | Disabled |
| UAE | 20 kg | Disabled |
| Iraq | 18 kg | Available (exception) |
| Iraq | 50 kg | Available (exception) |

### Pickup fees (by sender country)

| Sender country | Home pickup | Postal office |
|---|---|---|
| Saudi Arabia | $8.00 | $3.00 |
| United Arab Emirates | $10.00 | $3.00 |
| Kuwait | $7.00 | $2.50 |
| Bahrain | $6.00 | $2.00 |
| Qatar | $8.00 | $3.00 |
| Oman | $7.00 | $2.50 |
| Jordan | $12.00 | $4.00 |
| Lebanon | $12.00 | $4.00 |
| Egypt | $15.00 | $5.00 |
| Iraq | $18.00 | $6.00 |
| Any other country | $20.00 | $8.00 |

## Test scenarios

| Receiver | Weight | Expected |
|---|---|---|
| UAE | 10 kg | All options available |
| Jordan | 10 kg | Signature forced and locked |
| Egypt | 10 kg | Signature forced and locked |
| Saudi Arabia (sender SA) | 20 kg | Home pickup disabled |
| Any (sender Iraq) | 20 kg | Home pickup available |
