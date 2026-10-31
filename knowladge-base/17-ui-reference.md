# 17 — UI Reference

Every page, URL, section, form field, table, button and modal of the web app, with its
Playwright locator (role/label first, CSS id fallback), when it is visible or enabled, the messages it
shows and the business rule behind it (BR-xx from [13](./13-business-rules-catalog.md)).
The app has **no test ids** on purpose: it is accessibility-first, so role + accessible name is the primary locator.
How to execute tasks in the browser: [18 — UI Playbooks](./18-ui-playbooks.md).

Base URL: `http://localhost:3000` (`npm run dev`). Source paths below are relative to `src/`.

## Contents

| § | Section |
|---|---|
| 17.1 | Site Map & URLs |
| 17.2 | Layout & Navigation |
| 17.3 | Login & Register |
| 17.4 | Order Form (`/`, `/?edit=`, `/?repeat=`) |
| 17.5 | My Shipments list |
| 17.6 | Shipment Details |
| 17.7 | AI Assistant UI |
| 17.8 | UI vs Knowledge Base Gaps (UI-01..UI-19) |

## 17.1 — Site Map & URLs

Base URL: `http://localhost:3000`. SvelteKit app; routes live in `src/routes/`.

### Pages

| URL | `<title>` | H1 (visible) | Eyebrow | Source |
|---|---|---|---|---|
| `/login` | Log In - My Shipments | Log In | — | `src/routes/login/+page.svelte` |
| `/register` | Sign Up - My Shipments | Create a New Account | — | `src/routes/register/+page.svelte` |
| `/` | Create a New Shipment - My Shipments | Create a New **Shipment** | New shipment | `src/routes/+page.svelte` |
| `/?edit={id}` | Edit Shipment - My Shipments | Edit **Shipment** | Editing | same |
| `/?repeat={id}` | Repeat Shipment - My Shipments | Repeat **Shipment** | Repeating | same |
| `/shipments` | My Shipments | My **Shipments** | Dashboard | `src/routes/shipments/+page.svelte` |
| `/shipments/{id}` | `Draft Shipment #{id} - My Shipments` or `TR######### - My Shipments` | same as title prefix | — | `src/routes/shipments/[id]/+page.svelte` |
| `/assistant` | Shipping Rules Assistant | Shipping Rules **Assistant** | Documentation Q&A | `src/routes/assistant/+page.svelte` |

Sub-descriptions under the H1 on `/`: "Fill in the shipment details below" (new),
"Update the shipment details below" (edit), "Review and edit the shipment details below" (repeat).

### Query parameters

| Page | Param | Values | Effect |
|---|---|---|---|
| `/` | `edit` | shipment id | Loads that shipment into the form; Save/Finalize send `PUT /api/shipments/{id}`. Finalized shipment → server refuses "Only drafts can be edited" |
| `/` | `repeat` | shipment id | Loads that shipment as a new order (POST on save) |
| `/shipments` | `status` | `draft`, `finalized` (omit = all) | Status filter (server-side) |
| `/shipments` | `type` | `Domestic`, `IntraGulf`, `International` (omit = all) | Type filter |
| `/shipments` | `success` | `true` | Shows green status banner "Shipment saved successfully!"; removed when a filter changes |

Unknown / other customer's id on `/?edit=` or `/?repeat=` → red alert at top of form "Shipment not found".
Same on `/shipments/{id}` → SvelteKit error page 404 "Shipment not found"; non-numeric id → 400 "Invalid shipment ID".

### Redirects (server, `src/routes/+layout.server.ts`)

| Situation | Result |
|---|---|
| Logged out, any URL except `/login` `/register` | 303 → `/login` (does **not** return to the original page after login — goes to `/`) |
| Logged in, opens `/login` or `/register` | 303 → `/` |
| Successful login / register | client `goto('/')` |
| Logout | client `goto('/login')` |
| Save as Draft / Finalize success on `/` | `goto('/shipments?success=true')` |
| Delete on details page | `goto('/shipments')` |

### Navigation map

```
/login ⇄ /register           (links "Sign up here" / "Log in here")
   │ login/register
   ▼
/  (Create Shipment) ─────── sidebar ───── /shipments (My Shipments)
   ▲  ▲                                       │  row menu: View → /shipments/{id}
   │  └── "Edit" (draft) /?edit={id} ◄────────┤           Edit → /?edit={id}
   └───── "Repeat" (finalized) /?repeat={id} ◄┘           Repeat → /?repeat={id}
/shipments/{id}: "← Back to Shipments" → /shipments ; Edit/Repeat buttons as above
/assistant: reachable only by typing the URL (no link anywhere)
```

### Session

Cookie-based session, 30 days. Server reads it in `src/hooks.server.ts`.

## 17.2 — Layout & Navigation

Source: `src/routes/+layout.svelte`. Shown on every page **when logged in** and not on `/login` `/register`.

### Structure

```
┌──────────── aside (complementary, w-64) ──┬──────────── main ─────────────────────┐
│ Logo link "QAcart — ShipTest home" → /    │  page content (p-8)                   │
│ User block: avatar initial, full name,    │                                       │
│             email                         │                                       │
│ nav "Main": Create Shipment (/)           │                                       │
│             My Shipments (/shipments)     │                    [Open assistant] ◉ │ ← only on /
│ ─────────                                 │                                       │
│ [Log Out]                                 │                                       │
└───────────────────────────────────────────┴───────────────────────────────────────┘
```

### Elements

| Element | Playwright locator | CSS / notes | Behaviour |
|---|---|---|---|
| Sidebar | `getByRole('complementary')` | `aside` | Always visible when logged in |
| Logo / home | `getByRole('link', { name: 'QAcart — ShipTest home' })` | `aside a[href="/"]` (first) | → `/` |
| User name | `getByRole('complementary').getByText('<fullName>')` | `aside p.text-sm.font-medium` | From account, e.g. "Ahmad Khalil" |
| User email | `getByText('<email>')` | `aside p.text-xs` | e.g. `jor@qacart.com` |
| Avatar initial | hidden from a11y (`aria-hidden`) | `aside span.text-primary` | First letter of name, uppercase |
| Main nav | `getByRole('navigation', { name: 'Main' })` | `nav[aria-label="Main"]` | — |
| Create Shipment link | `getByRole('link', { name: 'Create Shipment' })` | `nav a[href="/"]` | Active: `aria-current="page"` when path is `/` |
| My Shipments link | `getByRole('link', { name: 'My Shipments' })` | `nav a[href="/shipments"]` | Active: `aria-current="page"` on `/shipments` only (not on `/shipments/{id}`) |
| Log Out | `getByRole('button', { name: 'Log Out' })` | `aside button` | POST `/api/auth/logout` → `/login`. While running text is "Loading..." and button disabled |
| Chat bubble | `getByRole('button', { name: 'Open assistant' })` | fixed bottom-right | Rendered **only when pathname is `/`** |

⚠️ On `/shipments` there are two "Create Shipment" links: sidebar "Create Shipment" and page
button "+ Create Shipment". Use `{ name: 'Create Shipment', exact: true }` or scope to the navigation.

## 17.3 — Login & Register

No sidebar on these pages. Both are public; a logged-in user is redirected to `/`.

### Login — `/login`

Source: `src/routes/login/+page.svelte`. Heading "Log In".

| # | Element | Label / text | Locator | CSS | Type / rules |
|---|---|---|---|---|---|
| 1 | Error banner | server/client message | `getByRole('alert')` | `form [role=alert]` | Shown above fields after a failed submit |
| 2 | Email | Email | `getByLabel('Email')` | `#email` | `type=email`, required, placeholder "Enter your email" |
| 3 | Password | Password | `getByLabel('Password')` | `#password` | `type=password`, required, placeholder "Enter your password" |
| 4 | Submit | Log In | `getByRole('button', { name: 'Log In' })` | `button[type=submit]` | Text "Loading..." + disabled while signing in |
| 5 | Register link | Sign up here | `getByRole('link', { name: 'Sign up here' })` | `a[href="/register"]` | Under text "Don't have an account?" |

#### Messages

| Situation | Message (alert) |
|---|---|
| Empty field (bypassing HTML `required`) | "This field is required" |
| Wrong email or password | "Invalid email or password" (same for both — BR-39) |
| Server 500 | "Login failed" |

Browser-native `required`/`type=email` validation fires first when using the UI normally (no alert shown, tooltip only).

#### Demo accounts (password `Test@1234`)

| Email | Sender country | City | Name shown in sidebar / sender card |
|---|---|---|---|
| `ksa@qacart.com` | Saudi Arabia | Riyadh | Khalid Al-Otaibi |
| `uae@qacart.com` | United Arab Emirates | Dubai | Mohammed Al-Mansouri |
| `kwt@qacart.com` | Kuwait | Kuwait City | Fahad Al-Ajmi |
| `jor@qacart.com` | Jordan | Amman | Ahmad Khalil |
| `egy@qacart.com` | Egypt | Cairo | Omar Hassan |

Source: `prisma/seed.ts`.

The account country = sender country, which drives street requirement, item description, pickup fees.

### Register — `/register`

Source: `src/routes/register/+page.svelte`. Heading "Create a New Account". Two fieldsets.

| Fieldset (`getByRole('group', { name })`) | Field | Label | Locator | CSS | Rules |
|---|---|---|---|---|---|
| Account Information | Email | Email | `getByLabel('Email')` | `#email` | email, required |
| Account Information | Password | Password | `getByLabel('Password', { exact: true })` | `#password` | required, server min 6 |
| Account Information | Confirm | Confirm Password | `getByLabel('Confirm Password')` | `#confirmPassword` | must equal password (client) |
| Personal Information | Full name | Full Name | `getByLabel('Full Name')` | `#fullName` | required, ≥ 2 |
| Personal Information | Phone | Phone Number | `getByLabel('Phone Number')` | `#phone` | `type=tel`, required, ≥ 10 digits |
| Personal Information | Country | Country | `getByLabel('Country')` | `#country` | select; first option "Select a country"; 10 countries (value = country name) |
| Personal Information | City | City | `getByLabel('City')` | `#city` | required, ≥ 2 |
| Personal Information | Postal code | Postal Code | `getByLabel('Postal Code')` | `#postalCode` | required, 3–10 |
| Personal Information | Street | Street | `getByLabel('Street')` | `#street` | **required on this form for every country** |

Helper text: "This information will be used as your default sender details".
Submit: `getByRole('button', { name: 'Sign Up' })` ("Loading..." while busy). Link "Log in here" → `/login`.

#### Messages (alert at top)

| Situation | Message |
|---|---|
| Passwords differ | "Passwords do not match" (client, no request sent) |
| Bad email | "Invalid email format" |
| Short password | "Password must be at least 6 characters" |
| Missing field | "All fields are required" |
| Other field rule | first server validation message |
| Duplicate email | "Email is already registered" (409) |
| Server error | "Failed to register user" / "Registration failed" |

Success → logged in → `/`.

## 17.4 — Order Form (`/`, `/?edit={id}`, `/?repeat={id}`)

Sources: `src/routes/+page.svelte`, `src/lib/components/ShipmentForm.svelte`,
`src/lib/components/DynamicCard.svelte`, `src/lib/components/cards/*.svelte`,
state/logic `src/lib/state/shipment-form.svelte.ts`, rules `src/lib/rules/*.json` + `src/routes/api/rules/*/+server.ts`.
KB: `08-shipment-creation-flow.md`, `03`–`07`, `13`.

### Layout (desktop ≥ lg, 5-column grid)

```
┌─ form (max-w-7xl) ─────────────────────────────────────────────────────────────┐
│ [alert: submitError]  [alert: errors.general]                (top of form)      │
├──────────── left col (3/5) ───────────────┬──────── right col (2/5) ───────────┤
│ 1. Sender Information (section, summary)  │ 4. Service Selection (fieldset)     │
│ 2. Receiver Information (fieldset)        │    [alert: "Please select a service"]│
│ 3. Package Information (fieldset)  [TYPE] │ 5. Additional Options (fieldset)    │
│                                           │ 6. Rate (section)                   │
├───────────────────────────────────────────┴────────────────────────────────────┤
│                                     [Save as Draft]  [Finalize Shipment]        │
└─────────────────────────────────────────────────────────────────────────────────┘
                                                                  (Open assistant ◉)
```
One column below `lg` (1024px). Inside cards, fields are 2 columns from `md`; Country, Street and
Item Description span full width.

### Unlock chain (the core logic)

| # | Section | Enabled when | Rules loaded from | While locked shows |
|---|---|---|---|---|
| 1 | Sender | Always (summary only) | `POST /api/rules/sender` (sender country) | — |
| 2 | Receiver | Sender complete (all required sender fields from profile non-empty) | `POST /api/rules/receiver` (on load and on every receiver-country change) | inputs disabled, card `opacity-50` |
| 3 | Package | Receiver complete: all required receiver fields non-empty **and** no route violation (Gulf → Iraq) | `POST /api/rules/package` | legend "Package Details", text "Complete the previous section to unlock this card" |
| 4 | Service Selection | Package complete: weight, length, width, height parse to > 0 and all required package fields filled | `POST /api/rules/service` (type + weight) | "Complete the previous section to unlock this card" |
| 5 | Additional Options | Same as 4 | `POST /api/rules/additional-options` (countries + weight) | "Complete the previous section to unlock this card" |
| 6 | Rate | A service is selected | `POST /api/rates` (re-priced on any change of service, weight, countries, pickup, 4 options) | total `-`; text "Complete the previous section…" or "Select a service to see pricing" |

Notes:
- "Complete" = **required fields non-empty**, not "valid". A 1-char name still unlocks the next card
  (length errors only show on blur and are enforced at Finalize). Weight > type max still unlocks
  services, but no service may fit → "No service can carry this package…".
- Completion cascades: emptying a receiver field relocks Package, Service, Options.
- Raising the weight above the selected service's max **deselects** the service (price back to `-`).

---

### 1. Sender Information (read-only summary)

| Element | Locator | Content |
|---|---|---|
| Section | `getByRole('region', { name: 'Sender Information' })` | `section[aria-labelledby="sender-heading"]` |
| Heading | `#sender-heading` | "Sender Information" |
| Summary line | inside region, `p.font-semibold` | `{senderName} - {senderCountry}` e.g. "Ahmad Khalil - Jordan" |
| Note | text | "Sender details are filled from your account automatically and cannot be edited" |

No inputs. Sender phone/city/street/postal come from the account and are sent with the shipment (BR-26).
On edit/repeat the sender comes from the stored shipment, not the account.

### 2. Receiver Information (fieldset)

Scope: `getByRole('group', { name: 'Receiver Information' })`.

| Field (form key) | Label | Locator | CSS | Type | Placeholder | Required | UI checks on blur |
|---|---|---|---|---|---|---|---|
| receiverName | Full Name | `getByLabel('Full Name')` | `#receiverName` | text | Enter the receiver's full name | Yes | min 2 → "Minimum 2 characters" |
| receiverPhone | Phone Number | `getByLabel('Phone Number')` | `#receiverPhone` | text | e.g. 0501234567 | Yes | digits only counted: < 10 → "Phone number must be at least 10 digits"; > 15 → "Phone number cannot exceed 15 digits" |
| receiverCountry | Country | `getByLabel('Country')` | `#receiverCountry` | select | Select a country | Yes | empty → "Please select a country" |
| receiverCity | City | `getByLabel('City')` | `#receiverCity` | text | Enter the city | Yes | min 2 → "Minimum 2 characters" |
| receiverStreet | Street Address | `getByLabel('Street Address')` | `#receiverStreet` | text | Enter the street address | **Only if receiver is Gulf** (asterisk appears) | if filled: min 5 → "Minimum 5 characters"; empty+required → "Street address is required" |
| receiverPostalCode | Postal Code | `getByLabel('Postal Code')` | `#receiverPostalCode` | text | Enter the postal code | Yes | 3–10 → "Minimum 3 characters" / "Maximum 10 characters" |

Country options (value = label = English name): Saudi Arabia, United Arab Emirates, Kuwait, Bahrain,
Qatar, Oman, Egypt, Jordan, Lebanon, Iraq. Gulf = first six.

Required marker: visible red `*` (aria-hidden) + sr-only "(required)" → accessible label becomes e.g.
"Full Name (required)"; `getByLabel('Full Name')` still matches (substring). Inputs have `aria-required="true"`.

Errors: `<p id="{field}-error" role="alert">` under the field; input gets `aria-invalid="true"`,
`aria-describedby="{field}-error"` and red border. Typing in a field clears its error.

Dynamic rules:
| Trigger | UI effect | BR |
|---|---|---|
| Receiver country = Gulf | Street Address gets `*`, becomes required (Package stays locked until filled) | BR-02 |
| Sender Gulf + receiver Iraq | Immediately under Country: "Shipping from Gulf countries to Iraq is not currently available"; Package stays locked | BR-03 |
| Country changed away from Iraq | that error is cleared | — |

### 3. Package Information (fieldset)

Scope: `getByRole('group', { name: /Package (Information|Details)/ })` — legend is "Package Details"
while locked and "Package Information" once rules load. When unlocked the legend also shows a tag with
the shipment type: `Domestic`, `IntraGulf` or `International` (raw value, no hyphen).

| Field | Label (as rendered) | Locator | CSS | Type | Placeholder | Required | UI range |
|---|---|---|---|---|---|---|---|
| weight | Weight (kg) * (Max: 50/30/25) | `getByLabel('Weight (kg)')` | `#weight` | number, step 0.1 | Enter the weight in kilograms | Yes | min 0.1, max = type limit |
| length | Length (cm) * (Max: 200) | `getByLabel('Length (cm)')` | `#length` | number | Enter the length | Yes | 1–200 |
| width | Width (cm) * (Max: 200) | `getByLabel('Width (cm)')` | `#width` | number | Enter the width | Yes | 1–200 |
| height | Height (cm) * (Max: 200) | `getByLabel('Height (cm)')` | `#height` | number | Enter the height | Yes | 1–200 |
| itemDescription | Item Description * | `getByLabel('Item Description')` | `#itemDescription` | text, full width | Describe the package contents | Yes when shown | 5–200 chars |

- **Item Description is only rendered for non-Gulf sender → Gulf receiver** (e.g. Jordan → Saudi Arabia).
  Otherwise it is absent from the DOM (BR-08).
- Max weight per type (BR-06): Domestic 50, IntraGulf 30, International 25.
- Blur messages: "Please enter a valid number", "Value must be at least {min}", "Value cannot exceed {max}".
- Shipment type (BR-04): same country → Domestic; both Gulf → IntraGulf; else International.

### 4. Service Selection (fieldset, radio group)

Scope: `getByRole('group', { name: 'Service Selection' })`. Radios `name="serviceType"`, value = service id.
Locator: `getByRole('radio', { name: /Gulf Express/ })` (the whole card is the label).

Each card shows: name, `{deliveryDays} day(s)`, description, "Base: ${basePrice} + ${pricePerKg}/kg".
Selected card: `border-primary bg-primary/20`, radio checked.

| Type | id | Name | Card text | Max kg | Base | /kg |
|---|---|---|---|---|---|---|
| Domestic | domestic_standard | Domestic Standard | 3 days · Standard domestic delivery (2-3 business days) | 50 | 15 | 0.5 |
| Domestic | domestic_express | Domestic Express | 1 day · Express domestic delivery (1 business day) | 30 | 30 | 1 |
| IntraGulf | gulf_standard | Gulf Standard | 5 days · Standard Gulf shipping (4-5 business days) | 30 | 25 | 1.5 |
| IntraGulf | gulf_express | Gulf Express | 2 days · Express Gulf shipping (2 business days) | 20 | 45 | 2.5 |
| International | international_economy | International Economy | 10 days · Economy international shipping (8-10 business days) | 25 | 35 | 2 |
| International | international_standard | International Standard | 7 days · Standard international shipping (5-7 business days) | 25 | 50 | 3 |

- Only services with `weight <= maxWeight` are listed (BR-10, BR-11).
- None fits → `role="status"` text "No service can carry this package. Reduce the weight to see options."
- Below the card, on Finalize without a service: `role="alert"` "Please select a service".

### 5. Additional Options (fieldset)

Scope: `getByRole('group', { name: 'Additional Options' })`.

| Option | Label | Locator | CSS | Fee | Default |
|---|---|---|---|---|---|
| signatureRequired | Signature Required | `getByLabel('Signature Required')` / `getByRole('checkbox', { name: 'Signature Required' })` | `#signatureRequired` | $5 | off |
| containsLiquid | Contains Liquid | `getByLabel('Contains Liquid')` | `#containsLiquid` | $10 | off |
| insurance | Insurance ($15.00) | `getByLabel('Insurance ($15.00)')` | `#insurance` | $15 | off |
| packaging | Professional Packaging ($8.00) | `getByLabel('Professional Packaging ($8.00)')` | `#packaging` | $8 | off |
| pickupMethod | (nested fieldset "Pickup Method") Home Pickup | `getByRole('radio', { name: 'Home Pickup' })` | `#pickup-home` | by sender country | **checked** |
| pickupMethod | Drop Off at Postal Office | `getByRole('radio', { name: 'Drop Off at Postal Office' })` | `#pickup-postal_office` | by sender country | — |

Dynamic rules:
| Trigger | UI effect | BR |
|---|---|---|
| Receiver = Jordan or Egypt | Signature auto-checked + disabled, text "Required for this destination" (`#signatureRequired-forced`) | BR-13 |
| Weight > 17 and sender ≠ Iraq | Home Pickup radio disabled + "Unavailable for this package" (`#pickup-home-why`); selection switches to Postal Office | BR-14 |
| Sender = Iraq | Home Pickup always enabled | BR-15 |
| Weight back to ≤ 17 | Home Pickup re-enabled (selection stays Postal Office) | — |

⚠️ Changing receiver from Jordan/Egypt to another country unlocks the checkbox but leaves it **checked**.

Pickup fees (home / postal): SA 8/3, AE 10/3, KW 7/2.5, BH 6/2, QA 8/3, OM 7/2.5, JO 12/4, LB 12/4, EG 15/5, IQ 18/6.

### 6. Rate (section)

Scope: `getByRole('region', { name: 'Rate' })` (`section[aria-labelledby="rate-heading"]`).

| Element | Locator | Content |
|---|---|---|
| Total | `getByRole('status', { name: 'Total Price' })` or `page.locator('output[aria-labelledby="total-price-label"]')` | `-` or `$xx.xx`; `aria-live="polite"` (wait on text change) |
| Breakdown | `dl` inside region | "Base Shipping Cost" always; then only lines > 0: "Signature Required", "Insurance", "Professional Packaging", "Liquid Handling" |
| Placeholder | text | locked: "Complete the previous section to unlock this card"; unlocked, no service: "Select a service to see pricing" |

**Base Shipping Cost = service base + weight × per-kg + pickup fee** (pickup fee is not its own line).
Total = Base Shipping Cost + option fees (BR-17..20).

Example (sender Jordan → Saudi Arabia, 4.5 kg, International Economy, home): 35 + 9 + 12 = **$56.00**.

### Buttons & submit

| Button | Locator | Action | While busy |
|---|---|---|---|
| Save as Draft | `getByRole('button', { name: 'Save as Draft' })` | No client validation; POST `/api/shipments/draft` (or PUT when `?edit=`). Server checks only numbers (BR-09) | "Saving..." disabled |
| Finalize Shipment | `getByRole('button', { name: 'Finalize Shipment' })` (type=submit; Enter in a field also submits) | Client check → POST `/api/shipments/finalize` (or PUT when `?edit=`) → server runs all rules | "Finalizing..." disabled |

Both buttons are **always enabled** (even with locked sections).
Success → `/shipments?success=true`. ⚠️ On `?edit=`, both buttons do the same PUT (Finalize on edit does not finalize) — see UI-07 in 17.8.

#### Client check on Finalize (before request)
| Condition | Error key → message |
|---|---|
| Required sender/receiver field empty | under field: the rule's message, e.g. "Name must be at least 2 characters", "Phone number must be between 10-15 digits", "Please select a country", "City is required", "Postal code must be between 3-10 characters", "Street address is required" |
| Gulf → Iraq | receiverCountry: "Shipping from Gulf countries to Iraq is not currently available" |
| Weight empty/≤ 0 (package unlocked) | weight: "Weight is required" |
| Weight > type max | weight: "Weight cannot exceed {max} kg" |
| No service | below Service card: "Please select a service" |

#### Server errors on Finalize (shown under fields + top alert "Please correct the errors in the form" or "Validation failed")
| Field | Message |
|---|---|
| receiverName | Receiver name must be at least 2 characters |
| receiverPhone | Phone number must contain at least 10 digits |
| receiverCity | Receiver city must be at least 2 characters |
| receiverPostalCode | Receiver postal code must be at least 3 characters |
| receiverStreet | Street address is required for Gulf countries |
| receiverCountry | Shipping from Gulf countries to Iraq is not currently available |
| weight | Weight must be greater than 0 kg / Weight cannot exceed {N} kg for {Type} shipments |
| length/width/height | {Dim} must be greater than 0 cm / {Dim} cannot exceed 200 cm |
| itemDescription | Item description is required (minimum 5 characters) when shipping from outside the Gulf into a Gulf country |
| signatureRequired | Signature is required when shipping to Jordan / Egypt |
| pickupMethod | Home pickup is not available for packages over 17 kg. Please choose drop off at a postal office |
| (top alert) | service/price problems: details text, e.g. "Invalid service or weight" |

Errors keyed `signatureRequired`, `pickupMethod`, `serviceType` have no field slot in the UI (only the top alert shows).

### Edit / Repeat specifics

| | `/?edit={id}` | `/?repeat={id}` |
|---|---|---|
| Heading | Edit Shipment | Repeat Shipment |
| Prefill | all fields from shipment incl. sender, service re-selected after services load | same |
| Save | PUT `/api/shipments/{id}` (draft only; else alert "Only drafts can be edited") | POST new draft / finalize |
| Not found | top alert "Shipment not found" | same |

## 17.5 — My Shipments (`/shipments`)

Sources: `src/routes/shipments/+page.svelte`, `+page.server.ts`,
`src/lib/components/shipments/{StatsCards,ShipmentFilters,ShipmentsTable,DeleteModal,PromoModal}.svelte`.
KB: `10-shipment-history.md`, `09-shipment-lifecycle.md`.

### Layout (top to bottom)

```
[Promo dialog "Special Offer!"  — random overlay]
Dashboard
My Shipments                                         [+ Create Shipment]
View and manage all your shipments
[status: Shipment saved successfully!]   (only with ?success=true)
[alert: error message]                    (failed finalize/delete)
┌ Total Shipments ┐ ┌ Draft ┐ ┌ Finalized ┐          (stats cards)
┌ Status [All Statuses ▾]   Type [All Types ▾] ┐     (filters)
┌ table: ⋮ | Tracking Number | Sender | Receiver | Destination | Type | Status ┐
[Delete confirmation alertdialog]                      (on demand)
```

### Header

| Element | Locator | Behaviour |
|---|---|---|
| H1 | `getByRole('heading', { name: 'My Shipments', level: 1 })` | — |
| + Create Shipment | `getByRole('link', { name: '+ Create Shipment' })` | → `/` |
| Success banner | `getByRole('status').filter({ hasText: 'Shipment saved successfully!' })` | Only when URL has `?success=true` |
| Error banner | `getByRole('alert')` | "Failed to delete shipment", finalize errors, e.g. "This draft cannot be finalized because it contains data errors", "Shipment is already finalized" |

### Stats cards (`dl` — `dt` label / `dd` number)

| Card | Locator | Counts |
|---|---|---|
| Total Shipments | `getByRole('term').filter({ hasText: 'Total Shipments' })` + sibling `dd` | rows currently loaded |
| Draft | `dt` "Draft" | status = draft |
| Finalized | `dt` "Finalized" | status ≠ draft |

⚠️ Counts are computed from the **filtered** list, so with `?status=draft` Finalized shows 0.

### Filters (change the URL, server reloads list)

| Filter | Label | Locator | CSS | Options (label → value) | URL |
|---|---|---|---|---|---|
| Status | Status | `getByLabel('Status')` | `#status-filter` | All Statuses → `all`, Draft → `draft`, Finalized → `finalized` | `?status=` |
| Type | Type | `getByLabel('Type')` | `#type-filter` | All Types → `all`, Domestic, Intra-Gulf → `IntraGulf`, International | `?type=` |

Filters combine. Choosing "All" removes the param. Changing a filter drops `success`.
Faster than clicking: navigate straight to e.g. `/shipments?status=draft&type=International`.

### Table

`getByRole('table', { name: 'Your shipments' })` (sr-only caption). Newest first. Up to 100 rows. No paging, no sorting.

| # | Column header | Cell content | Notes |
|---|---|---|---|
| 1 | (sr-only "Actions") | ⋮ button | `getByRole('button', { name: 'Actions for TR123456789' })` or `'Actions for draft shipment 4'` |
| 2 | Tracking Number | `TR#########` or `-` for drafts | row header (`th scope=row`) → row name |
| 3 | Sender | sender name | — |
| 4 | Receiver | receiver name | — |
| 5 | Destination | `{city}, {country}` | e.g. "Alexandria, Egypt" |
| 6 | Type | Domestic / Intra-Gulf / International | display label |
| 7 | Status | tag "Draft" (grey) or "Finalized" (gold) | — |

Find a row: `getByRole('row', { name: /TR158478470/ })`; draft row: `getByRole('row').filter({ has: page.getByRole('button', { name: 'Actions for draft shipment 4' }) })`.

Empty list: heading "No shipments found", text "Create your first shipment!", link "+ Create Shipment".

### Row actions menu

Open with the ⋮ button (`aria-haspopup="menu"`, `aria-expanded`). Menu: `getByRole('menu', { name: 'Actions for …' })`,
position fixed (flips upward near the bottom). Closes on outside click, Escape, scroll, resize.

| Menu item (`getByRole('menuitem', { name })`) | Shown for | Does |
|---|---|---|
| View | all | → `/shipments/{id}` |
| Edit | draft | → `/?edit={id}` |
| Finalize Shipment | draft | POST `/api/shipments/{id}/finalize` immediately (no confirm); list reloads; errors in alert |
| Repeat | finalized | → `/?repeat={id}` |
| Delete | all | opens Delete modal |

### Delete modal

`getByRole('alertdialog', { name: 'Delete Shipment' })`.

| Element | Content / locator |
|---|---|
| Title | "Delete Shipment" |
| Subtitle | "Shipment #{id}" |
| Text | "Are you sure you want to delete this shipment? This action cannot be undone." |
| Cancel | `getByRole('button', { name: 'Cancel' })` — also Escape |
| Delete | `getByRole('button', { name: 'Delete' })` — focused on open; DELETE `/api/shipments/{id}`, list reloads |

No success toast after delete (API returns "Shipment deleted/cancelled successfully" but UI does not show it).

### Promo popup (deliberate flaky overlay)

| Item | Value |
|---|---|
| Locator | `getByRole('dialog', { name: 'Special Offer!' })` |
| Text | "Get 20% off express shipping this week only!" |
| Close | `getByRole('button', { name: 'Close' })` |
| When | 1.5 s after page mount, `Math.random() < 0.5`, once per page load of `/shipments` (filter changes do not re-trigger it) |
| Blocks | Full-screen overlay `z-50`; clicks on the page fail while open |

Playwright: `page.addLocatorHandler(page.getByRole('dialog', { name: 'Special Offer!' }), d => d.getByRole('button', { name: 'Close' }).click())`.
Browser agent: after opening `/shipments`, wait ~2 s, screenshot, close it if present.

## 17.6 — Shipment Details (`/shipments/{id}`)

Source: `src/routes/shipments/[id]/+page.svelte`, `+page.server.ts`. KB: `10-shipment-history.md`.
Read-only page. No chat bubble. Other customer's id → 404 "Shipment not found".

### Header

| Element | Locator | Draft | Finalized |
|---|---|---|---|
| Back link | `getByRole('link', { name: '← Back to Shipments' })` | → `/shipments` | same |
| H1 | `getByRole('heading', { level: 1 })` | "Draft Shipment #{id}" | "TR#########" |
| Created | text | "Created on M/D/YYYY" (en-US) | same |
| Status chip | text | "Draft" | "Finalized" |
| Edit | `getByRole('link', { name: 'Edit' })` | → `/?edit={id}` | — |
| Finalize | `getByRole('button', { name: 'Finalize Shipment' })` | POST finalize, page reloads in place ("Finalizing..." while busy) | — |
| Repeat | `getByRole('link', { name: 'Repeat' })` | — | → `/?repeat={id}` |
| Delete | `getByRole('button', { name: 'Delete' })` | ⚠️ deletes **immediately, no confirmation** → `/shipments` | same |
| Error | `getByRole('alert')` | finalize/delete failure message | — |

### Sections (each `getByRole('region', { name })`, content is `dl` dt/dd)

| Region | Items |
|---|---|
| Sender Information | Name · Phone · Address = "{street}, {city}, {country} {postalCode}" |
| Receiver Information | same as sender (empty street shows as ", City, …") |
| Package Details | Shipment Type (Domestic / Intra-Gulf / International) · Weight "{n} kg" · Dimensions (L × W × H) "{l} × {w} × {h} cm" · Item Description (only if any) |
| Service & Options | Service Type (raw id, e.g. `international_economy`) · Pickup Method ("Home Pickup" / "Drop Off at Postal Office") · Additional Options: bullet list of Insurance, Signature Required, Professional Packaging, Contains Liquid — or "No additional options selected" |
| Cost Details | Base Shipping Cost · Signature Required / Insurance / Professional Packaging (only if > 0) · **Total Cost** |

Locate a value: `page.getByRole('region', { name: 'Package Details' }).getByRole('definition')` or
`locator('dt:has-text("Weight") + dd')`.

⚠️ Liquid fee has no line in Cost Details (it is inside Total only); pickup fee is folded into Base Shipping Cost (G-09).
⚠️ Service Type shows the raw id, not the friendly service name.

## 17.7 — AI Assistant UI

KB: `11-ai-assistant.md`. Needs `OPENROUTER_API_KEY` in `.env`; without it the UI shows a setup error, the rest of the app works.

### A. Shipping Assistant chat drawer (only on `/`, `/?edit=`, `/?repeat=`)

Source: `src/lib/components/agent/ChatDrawer.svelte`.

| Element | Locator | Notes |
|---|---|---|
| Open bubble | `getByRole('button', { name: 'Open assistant' })` | Fixed bottom-right circle with bot icon; hidden while panel open |
| Panel | `getByRole('dialog', { name: 'Shipping Assistant' })` | 420×600, bottom-right |
| Title | heading "Shipping Assistant" | — |
| Close | `getByRole('button', { name: 'Close assistant' })` | Conversation kept when reopened (until page reload) |
| Transcript | `getByRole('log', { name: 'Conversation' })` | `aria-live=polite`; empty text "Ask me about your shipments, pricing, or shipping rules." |
| Input | `getByLabel('Ask about your shipments or shipping rules...')` | `#agent-message` textarea; Enter sends, Shift+Enter new line; disabled while loading |
| Send | `getByRole('button', { name: 'Send' })` | disabled when input empty or loading |
| Thinking | `getByRole('status')` "Thinking..." | while waiting |
| Error | `getByRole('alert')` in log | e.g. missing key / "The assistant could not answer that. Please try again." |
| Tools used | `getByRole('list', { name: 'Tools used' })` → `listitem` per tool name | hover title = args JSON |
| Latency | text "{n} ms" under each answer | — |
| Proposal card | eyebrow "Suggested values", `dl` of field → value | only when the agent proposes form values |
| Violations | `role=alert` inside proposal | rule problems with proposed values |
| Apply | `getByRole('button', { name: 'Apply to form' })` | writes values into the form (consent, BR-45) |
| Applied | `getByRole('status')` "Applied to the form" | replaces the button |

Every message sends the current form values, completion flags, errors and shipment type to the agent.
Fields the agent may fill: receiver fields, weight, length, width, height, itemDescription, pickupMethod, 4 option checkboxes. Never sender.

### B. Shipping Rules Assistant page (`/assistant`)

Source: `src/routes/assistant/+page.svelte`. Not linked anywhere — open the URL directly.

| Element | Locator | Notes |
|---|---|---|
| H1 | "Shipping Rules Assistant" | eyebrow "Documentation Q&A" |
| Question | `getByLabel('Your question')` | `#question`; placeholder "e.g. What is the maximum weight for a Domestic shipment?" |
| Ask | `getByRole('button', { name: 'Ask' })` | disabled when empty / loading |
| Examples | `getByRole('button', { name: '<question>' })` | "Can I ship from Saudi Arabia to Iraq?", "What is the maximum weight for an IntraGulf shipment?", "When is a signature mandatory?", "Why is home pickup sometimes unavailable?" — one click asks |
| Thinking | `getByRole('status')` "Thinking..." | — |
| Answer | `getByRole('region', { name: 'Answer' })` | markdown |
| Sources | `getByRole('region', { name: 'Sources' })` → ordered list | each: `[n]` · heading · source file · score (3 decimals) |
| Error | `getByRole('alert')` | — |

The search-only mode (`/api/assistant/search`) has no UI; API only.

## 17.8 — UI vs Knowledge Base Gaps

Found while scanning the source and live UI. The knowledge base (`knowladge-base/`) describes the
intended behaviour; these are places where the actual UI differs. Flag them with ⚠️ and the ID.
Business gaps G-01..G-14 are in `knowladge-base/14-known-gaps-and-contradictions.md`.

| ID | Area | KB says | UI does | Source |
|---|---|---|---|---|
| UI-01 | List paging | 10 per page, Previous/Next, "Page X of Y" (BR-40) | No paging; all rows (up to 100) on one page | `routes/shipments/+page.server.ts` |
| UI-02 | List sorting | Sort by date, total cost, status; arrow shows direction | No sorting; always newest first | `ShipmentsTable.svelte` |
| UI-03 | List columns | Status, Tracking, From, To, Total cost, Created, Actions | Actions, Tracking Number, Sender (name), Receiver (name), Destination, Type, Status — no cost, no date | `ShipmentsTable.svelte` |
| UI-04 | Draft tracking cell | Shows "Draft" | Shows `-` | `ShipmentsTable.svelte:212` |
| UI-05 | Delete confirmation | Every delete asks for confirmation (BR-31) | Details page Delete deletes immediately, no confirmation | `shipments/[id]/+page.svelte:114` |
| UI-06 | Delete message | "Shipment deleted/cancelled successfully" shown | API returns it, UI never shows it | `shipments/+page.svelte` |
| UI-07 | Finalize on edit | Edit draft → can finalize | On `/?edit=`, "Finalize Shipment" only PUTs the draft; it stays a draft (finalize from details or list instead) | `shipment-form.svelte.ts:513` |
| UI-08 | Return after login | Customer returns to the page they first tried to open | Always goes to `/` | `login/+page.svelte:37` |
| UI-09 | Stats counters | Total / Drafts / Finalized of all shipments | Computed from the filtered list | `shipments/+page.svelte:19` |
| UI-10 | Rate card lines | Separate pickup fee line | Pickup fee folded into "Base Shipping Cost" (base + weight + pickup) | `rate-calculator.ts:91` |
| UI-11 | Register street | Street required only for Gulf | Register form requires Street for every country | `register/+page.svelte:210` |
| UI-12 | No-service message | "No services available" + weight limit explained | "No service can carry this package. Reduce the weight to see options." | `ServiceSelectionCard.svelte:40` |
| UI-13 | Forced signature after country change | Only Jordan/Egypt force it | Switching away from Jordan/Egypt unlocks the box but leaves it checked ($5 stays) | `shipment-form.svelte.ts:307` |
| UI-14 | Service on details | Service name | Raw id (e.g. `international_economy`) | `shipments/[id]/+page.svelte:229` |
| UI-15 | Unlocking vs validity | Section completes when fields are valid | Unlocks when required fields are non-empty; length/format errors only on blur/Finalize | `shipment-form.svelte.ts:49` |
| UI-16 | Section-level errors | Errors for signature/pickup/service shown | Server errors keyed `signatureRequired`, `pickupMethod`, `serviceType` have no slot; only the top alert appears | `DynamicCard.svelte`, `AdditionalOptionsCard.svelte` |
| UI-17 | Phone max | — (G-04) | UI blur rejects > 15 digits, server has no max | `receiver-card.json` |
| UI-18 | Street min | — (G-06) | UI blur requires ≥ 5 chars if filled, server only non-empty | `receiver-card.json` |
| UI-19 | Type label | Intra-Gulf | Package legend tag shows `IntraGulf`; list/details/filter show `Intra-Gulf` | `DynamicCard.svelte:83` |

