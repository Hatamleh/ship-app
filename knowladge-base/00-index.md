# ShipTest — Business Knowledge Base

Business-only knowledge about the ShipTest shipping platform
(source: github.com/AnenQA/ship-app — user stories, rule configuration and business logic).
No technology details are included on purpose.

## What the product is

ShipTest is a shipping management platform for the Middle East. A registered customer can
create shipping orders, get an exact price before committing, save orders as drafts, finalize
them to receive a tracking number, and manage their shipment history. An optional AI assistant
answers questions about shipments, prices and rules, and can offer to fill in the order form.

The product exists to **teach software testing** (manual, UI automation, API and AI testing),
so a few behaviours are deliberate testing exercises (for example a random promo popup).

## Documents

| # | Domain | What it covers |
|---|---|---|
| 01 | [Geography & Routes](./01-geography-and-routes.md) | Supported countries, Gulf grouping, shipment types, blocked routes |
| 02 | [Customer Accounts](./02-customer-accounts.md) | Registration, login, session, logout, profile |
| 03 | [Sender & Receiver](./03-sender-and-receiver.md) | Address and contact rules for both parties |
| 04 | [Package](./04-package.md) | Weight, dimensions, customs item description |
| 05 | [Services](./05-services.md) | Service catalogue, weight filtering, delivery times |
| 06 | [Additional Options & Pickup](./06-additional-options-and-pickup.md) | Signature, liquid, insurance, packaging, pickup method |
| 07 | [Pricing](./07-pricing.md) | Price formula, fee tables, worked examples, price integrity |
| 08 | [Shipment Creation Flow](./08-shipment-creation-flow.md) | Step-by-step guided form, unlocking, validation timing |
| 09 | [Shipment Lifecycle](./09-shipment-lifecycle.md) | Draft, finalize, edit, delete/cancel, repeat, tracking numbers |
| 10 | [Shipment History](./10-shipment-history.md) | List, counters, filters, sorting, paging, details page |
| 11 | [AI Assistant](./11-ai-assistant.md) | Shipping assistant, rules assistant, AI trust rules |
| 12 | [Trust & Data Protection](./12-trust-and-data-protection.md) | Data isolation, price authority, safe error messages |
| 13 | [Business Rules Catalog](./13-business-rules-catalog.md) | Every rule in one table with IDs |
| 14 | [Known Gaps & Contradictions](./14-known-gaps-and-contradictions.md) | Places where documentation and behaviour disagree |

## Technical reference

Documents 01–14 are business-only. These cover the implementation.

| # | Domain | What it covers |
|---|---|---|
| 15 | [Backend & API Reference](./15-backend-api-reference.md) | Stack, auth, every endpoint with bodies, responses and errors, env vars |
| 16 | [Database](./16-database.md) | Tables, columns, relations, seed data, which actions write to which table |
| 17 | [UI Reference](./17-ui-reference.md) | Every page, URL, section, field, table, button, modal; locators, conditions, messages; UI-vs-KB gaps (UI-xx) |
| 18 | [UI Playbooks](./18-ui-playbooks.md) | How to execute tasks in the browser: where to go, fill order, test data, expected results |

## Glossary

| Term | Meaning |
|---|---|
| **Gulf country** | Saudi Arabia, UAE, Kuwait, Bahrain, Qatar, Oman |
| **Non-Gulf country** | Egypt, Jordan, Lebanon, Iraq |
| **Shipment type** | Domestic, IntraGulf or International — decided automatically from the two countries |
| **Service** | The delivery product the customer chooses (e.g. Gulf Express) |
| **Draft** | A saved, unconfirmed order; editable, no tracking number |
| **Finalized** | A confirmed order; has a tracking number, cannot be edited |
| **Tracking number** | `TR` followed by 9 digits, e.g. `TR123456789` |
| **Pickup method** | Home pickup or drop-off at a postal office |
| **Rate card** | The live price summary shown on the order form |
| **Repeat** | Start a new order pre-filled from a finalized one |

## Demo accounts

Five seeded customers, one per country, all with password `Test@1234`:
Saudi Arabia (`ksa@qacart.com`), UAE (`uae@qacart.com`), Kuwait (`kwt@qacart.com`),
Jordan (`jor@qacart.com`), Egypt (`egy@qacart.com`). The country of the account decides which
rules apply, because it is always the sender country.
