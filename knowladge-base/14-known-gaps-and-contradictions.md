# 14 — Known Gaps & Contradictions

Places where the documentation disagrees with itself or with the product's actual behaviour.
Each one needs a business decision, and each is a good candidate for a test case.

| # | Topic | Documentation says | Product does | Impact |
|---|---|---|---|---|
| G-01 | **Non-Gulf → Gulf shipment type** | README summary, rules summary table and one receiver test scenario: **IntraGulf (30 kg)** | **International (25 kg)** — also what the detailed stories say | Changes weight limit, services offered and price |
| G-02 | Gulf → Iraq message language | Some stories give the message in Arabic, others in English | Shows English | Message checks may fail |
| G-03 | Name characters | Letters, spaces, hyphens and apostrophes only — `John123` invalid | Final check only counts length; `John123` is accepted | Invalid names can be finalized |
| G-04 | Phone maximum | Stories: at least 10 digits; form settings: 10–15 digits | Final check: at least 10 digits, no maximum | Very long numbers accepted |
| G-05 | Postal code maximum | 3–10 characters | Final check only requires at least 3 | Long postal codes accepted |
| G-06 | Street minimum | Form settings: at least 5 characters | Final check: just not empty | A 1-character street is accepted |
| G-07 | Price examples | See table below | Formula gives different totals | Wrong expected results in tests |
| G-08 | Promotion | "20% off express shipping this week only" | Not applied to any price | Customer-facing promise not honoured |
| G-09 | Details cost breakdown | Rate card shows pickup fee and liquid fee as separate lines | Stored breakdown folds pickup into base cost; liquid fee has no own line | Details page doesn't match the rate card |
| G-10 | Draft prices | Prices are always calculated by the system | Draft saves and edits keep the price sent by the browser; corrected only at finalization | A draft can show a wrong total until finalized |
| G-11 | Story numbering | — | ID **US-070** is used for two different stories (rate validation and shipment list) | Traceability confusion |
| G-12 | Shipment status wording | Draft / Finalized | Default status value elsewhere is "Pending" | Possible inconsistent status labels |
| G-13 | Delivery time wording | Service delivery days (3, 5, 10, 7) | Descriptions say ranges (2–3, 4–5, 8–10, 5–7 business days) | Unclear which is the promise |
| G-14 | Profile editing | "To change sender info, update your profile" | No profile-editing screen exists | Customers cannot change their sender address |

## G-07 — Price examples that don't match the formula

| Documented example | Documented total | Correct total | Likely cause |
|---|---|---|---|
| International Economy, 20 kg, Egypt sender, postal, all options | $113.00 | **$118.00** (35 + 40 + 5 + 5 + 10 + 15 + 8) | Signature left out |
| International Standard, 25 kg, Lebanon sender, postal, all options | $163.00 | **$167.00** (50 + 75 + 4 + 5 + 10 + 15 + 8) | Arithmetic error |
| "Forced signature (Jordan)", Gulf Standard, 10 kg, Jordan, home | $52.00 | $57.00 if Jordan is the sender (25 + 15 + 12 + 5); but a Jordan sender can't use a Gulf service, and a Jordan receiver makes it International | Impossible combination |
| AI quote: Saudi Arabia → Egypt, International Economy, 12 kg, home, insurance | $82.00 | **$87.00** on the form (Egypt receiver forces the $5 signature) | Forced signature ignored in the AI example |

## Open business questions

1. Should non-Gulf → Gulf be IntraGulf or International? (G-01)
2. Is the Gulf → Iraq message meant to be Arabic, English or both? (G-02)
3. Should name, phone, postal and street limits be enforced strictly at finalization? (G-03 to G-06)
4. Should the 20% express promotion be real, or removed from customer view? (G-08)
5. Should the AI quote include forced signatures automatically? (G-07)
6. Should customers be able to edit their profile and sender address? (G-14)
