# 18 — UI Playbooks

How to do things in the real UI with the Chrome tools (`mcp__claude-in-chrome__*`). Element details, locators and messages: [17 — UI Reference](./17-ui-reference.md).

## Ground rules

1. Load tools in one ToolSearch: `tabs_context_mcp, navigate, computer, read_page, find, form_input, tabs_create_mcp, tabs_close_mcp`.
2. Check the server: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` → 303/200 = up. If down, tell the user to run `npm run dev`.
3. `navigate` to the exact URL from the table below. If you land on `/login`, the browser is logged out:
   log in with a demo account **only for this local app** (see 17.3) — pick the account whose country
   matches the requested sender, or ask if the sender country matters and is not stated.
4. Get element refs with `find` (e.g. "receiver form inputs and country select") or `read_page filter=interactive`.
5. Fill with `form_input` (fires the input/change events Svelte needs). Fill **in unlock order**.
6. Screenshot after each section to confirm the next one unlocked and no `role=alert` errors appeared.
7. **Do not click Save as Draft / Finalize Shipment / Delete / Finalize menu item / Apply to form unless the user asked.** They write to the DB.
8. Report back a table of field → value, plus what got unlocked and the total price if shown.

## Where to go for each task

| Task | URL | Then |
|---|---|---|
| Log in | `/login` | `#email`, `#password`, click "Log In" |
| Register | `/register` | fill 9 fields, click "Sign Up" |
| Create a shipment | `/` | sections 2 → 3 → 4 → 5, then Save as Draft / Finalize |
| Edit a draft | `/?edit={id}` (id from list "Actions for draft shipment {id}") | wait for prefill, change fields, Save |
| Repeat a finalized | `/?repeat={id}` (id from row link `/shipments/{id}`) | adjust, Save/Finalize |
| See all shipments | `/shipments` | close promo if shown |
| Only drafts / a type | `/shipments?status=draft&type=IntraGulf` | — |
| Open one shipment | `/shipments/{id}` | — |
| Finalize a draft | `/shipments/{id}` → "Finalize Shipment" (or list ⋮ → Finalize Shipment) | — |
| Delete (with confirmation) | `/shipments` → ⋮ → Delete → modal Delete | details page Delete has no confirmation |
| Ask a rules question | `/assistant` | `#question`, "Ask" |
| Use chat assistant | `/` → "Open assistant" | `#agent-message`, Enter |

## Fill order on `/` (create shipment)

| Step | Field (CSS id) | Wait for |
|---|---|---|
| 1 | `#receiverCountry` (select by country name) | street `*` appears for Gulf; Iraq error for Gulf sender |
| 2 | `#receiverName`, `#receiverPhone`, `#receiverCity`, `#receiverStreet`, `#receiverPostalCode` | Package card unlocks, legend tag shows type |
| 3 | `#weight`, `#length`, `#width`, `#height` (+ `#itemDescription` if rendered) | Service + Additional Options unlock |
| 4 | Click service radio (`input[name=serviceType][value=<id>]` or by name) | Rate total shows `$xx.xx` |
| 5 | Options: `#signatureRequired` `#containsLiquid` `#insurance` `#packaging`; pickup `#pickup-home` / `#pickup-postal_office` | total updates |
| 6 | (only if asked) Save as Draft / Finalize Shipment | redirect `/shipments?success=true` |

Valid weight per route: Domestic ≤ 50, IntraGulf ≤ 30 (Gulf Express ≤ 20), International ≤ 25. Keep ≤ 17 kg to keep Home Pickup.

## Ready test data — receivers per country

| Country | Name | Phone | City | Street | Postal |
|---|---|---|---|---|---|
| Saudi Arabia | Faisal Al-Harbi | 0551234789 | Riyadh | King Fahd Road, Al Olaya District, Building 4521 | 12214 |
| United Arab Emirates | Mariam Al-Suwaidi | 0501234567 | Dubai | Sheikh Zayed Road, Tower 12 | 00000 |
| Kuwait | Yousef Al-Sabah | 96550012345 | Kuwait City | Gulf Street, Block 3 | 13001 |
| Bahrain | Ali Al-Khalifa | 97333123456 | Manama | Road 2803, Seef District | 428 |
| Qatar | Noora Al-Thani | 97455123456 | Doha | Corniche Street, Building 7 | 2001 |
| Oman | Salim Al-Busaidi | 96891234567 | Muscat | Sultan Qaboos Street, Way 3021 | 112 |
| Jordan | Sara Al-Zoubi | 0791234567 | Irbid | (optional) University Street | 21110 |
| Egypt | Mahmoud Fahmy | 01012345678 | Cairo | (optional) Tahrir Street 15 | 11511 |
| Lebanon | Rami Haddad | 9613123456 | Beirut | (optional) Hamra Street | 1103 |
| Iraq | Hussein Al-Jabouri | 07701234567 | Baghdad | (optional) Karrada Street | 10001 |

Gulf receivers need a street (≥ 5 chars on blur). Gulf sender → Iraq is blocked.

## Ready scenarios (expected UI)

| Sender acct | Receiver | Package | Expect |
|---|---|---|---|
| ksa@ | Saudi Arabia | 10 kg, 30×20×15 | Domestic, 2 services, Domestic Standard home = $28.00 |
| ksa@ | United Arab Emirates | 20 kg | IntraGulf; Gulf Standard only (+ Gulf Express since 20 ≤ 20); Home Pickup disabled (> 17) |
| ksa@ | Iraq | — | Error under Country, Package stays locked |
| jor@ | Saudi Arabia | 4.5 kg | International, Item Description shown & required |
| ksa@ | Egypt | 12 kg | International, Signature forced; Economy + insurance home = $87.00 |
| uae@ | Kuwait | 25 kg | IntraGulf, only Gulf Standard |
| any | any International | 26 kg | "No service can carry this package. Reduce the weight to see options." |

## Gotchas

- `form_input` on the Country select first; other receiver fields can then be filled in any order.
- Package inputs are `type=number`: pass numbers as strings ("4.5").
- Item Description appears only after the receiver is complete — re-`find` refs after each unlock (refs for new elements don't exist before).
- After `goto` or reload refs change; always re-`find`.
- `/shipments` promo dialog blocks clicks: wait ~2 s, then close it.
- Errors render only on blur or Finalize; `form_input` may not blur — click elsewhere or screenshot after Finalize to see them.
