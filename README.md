# Cloud Kitchen Billing Dashboard (Frontend Only)

A single-page admin dashboard for managing a **Cloud Kitchen Billing System** with two billing types:

- **Corporate Billing** (recurring meals on multiple service dates)
- **Event Billing** (one-off personal/corporate events with custom packages)

This project is **frontend-only** (no backend). Data is stored in **Redux Toolkit** and persisted in **localStorage**.

---

## Live Demo
- Live Link: `https://cloud-kitchen-billing.vercel.app/corporate`
- GitHub Repo: `https://github.com/Alamin4D/cloud-kitchen-billing`

---

## Features

### Dashboard (Common)
- Sidebar navigation: **Corporate Billing** / **Event Billing**
- Bills list view:
  - Invoice/ID
  - Name (Corporate Name / Event Name)
  - Billing Type
  - Date
  - Total Amount
  - Actions: View / Edit / Delete
- Responsive UI:
  - Mobile: card view + sidebar drawer
  - Desktop: table view

### Corporate Billing
- Create/Edit/Delete corporate bills
- Required fields:
  - Corporate Name
  - Contact Person
  - Contact No
  - Billing Date
- Line items (multiple rows):
  - Service Date
  - Package Type (Economy/Standard/Premium)
  - Persons
  - Unit Price (BDT)
  - Line Total (auto = persons × unit price)
- Grand total auto calculation
- Amount in words auto update

### Event Billing
- Create/Edit/Delete event bills
- Required fields:
  - Event Name
  - Contact Person
  - Contact No
  - Event Date
- Package items (multiple rows):
  - Package Name
  - Package Type
  - Description (food items)
  - Persons
  - Unit Price (BDT)
  - Line Total (auto)
- Grand total auto calculation
- Amount in words auto update

### Validation
- Basic required-field validation
- Contact number validation (digits only, 10–14)
- Save button disabled until the form is valid

### Persistence
- Redux state persisted to **localStorage**
- Reloading the page keeps saved bills

### Print View (Bonus)
- Bill details page supports **Print** via browser print

---

## Tech Stack
- React (Vite)
- Redux Toolkit + React Redux
- React Router DOM
- Tailwind CSS
- JavaScript (ES6+)

---