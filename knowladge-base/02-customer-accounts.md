# 02 — Customer Accounts

## Roles

| Role | Can do |
|---|---|
| **Visitor** | See the Login and Register pages only |
| **Customer** | Create and manage their own shipments; use the AI assistant |

There is no admin, courier or operations role. Every customer is a sender.

## Registration

**Required fields:** email, password, full name, phone, country, city, street, postal code.

| Field | Rule | Message |
|---|---|---|
| Email | Valid format (something@domain.tld) | Validation error |
| Email | Must not already exist | "Email already registered" |
| Password | At least 6 characters | Validation error |
| Full name | At least 2 characters | Validation error |
| Phone | At least 10 digits | Validation error |
| Country | One of the 10 supported countries | — |
| City | At least 2 characters | Validation error |
| Postal code | 3–10 characters | Validation error |

**Outcome:** the customer is logged in automatically and taken to the home page (the order form).

**Business importance:** the registered address becomes the customer's **permanent sender
address**. It fills the Sender section of every order and cannot be changed there.

## Login

- Email and password are both required.
- Wrong email **or** wrong password → always the same message: "Invalid email or password".
  The system never reveals which one was wrong.
- A loading indicator shows while signing in.
- After login the customer returns to the page they originally tried to open.

## Session

- A session lasts **30 days** and survives closing the browser.
- After 30 days the customer must log in again (no automatic renewal).
- Any page except Login and Register sends a logged-out visitor to Login.

## Logout

- Ends the session immediately and returns to Login.
- Protected pages are no longer reachable afterwards.

## Profile

- The customer's details (name, email, phone, country, city, street, postal code) are loaded
  when the app opens. The password is never displayed or returned.
- There is no profile-editing screen in scope; the stories say "to change sender info, the user
  must update their profile".

## Test scenarios

| Scenario | Expected |
|---|---|
| Register with valid data | Account created, logged in |
| Register with an existing email | Rejected as duplicate |
| Password of 5 characters | Rejected |
| Email "notanemail" | Rejected |
| Login with correct credentials | Logged in |
| Login with wrong password / unknown email | "Invalid email or password" |
| Open a protected page while logged out | Sent to Login |
| Logout | Session ended, sent to Login |
| 31 days after login | Must log in again |
