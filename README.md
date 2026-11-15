# Philately – The Collector’s Society

A full-stack philatelic platform and vault application designed for postage stamp collectors, historians, and researchers. The system combines digital stamp catalogue curation and personal collection management with India Post–inspired **Philatelic Deposit Accounts (PDA)** and mathematical verification mechanisms based on **Number Theory** (Modulo-11 checksums and deterministic coprime fair allotment).

---

## Academic Context & Problem Statement

Philately—the study and collection of postage stamps—demands rigorous provenance tracking, condition grading, and fair distribution of scarce commemorative issues. 

This project addresses three central domain challenges:
1. **Provenance & Collection Management:** Organizing philatelic rarities with condition ratings (*Mint Never Hinged*, *Fine Used*, *Very Fine Mint*) linked to a relational database.
2. **Serial & Document Verification:** Implementing an official India Post–style **Weighted Modulo-11 Checksum** to detect transposition and alteration errors on postal certificates and serial numbers.
3. **Provably Fair Limited-Edition Allotment:** Implementing a deterministic, verifiable pseudo-random allotment algorithm using modular arithmetic and coprime stepping to allocate scarce stamp issues among applicants without administrative bias.

---

## Core System Architecture

The application is built as a decoupled full-stack architecture:

```
Major-Project/
├── src/                           # Frontend React SPA
│   ├── assets/                    # Postal marks & philatelic insignia SVGs
│   ├── components/                # Reusable UI components (StampCard, CollectionCard, Navbar, etc.)
│   ├── layouts/                   # Global shell (MainLayout)
│   ├── pages/                     # Routed views (Home, Stamps, Collection, PDA, etc.)
│   ├── services/api.js            # Unified API client layer
│   └── utils/numberTheory.js      # Client-side Number Theory algorithms
│
└── server/                        # Backend Node.js / Express REST API
    ├── prisma/
    │   ├── schema.prisma          # PostgreSQL relational schema
    │   ├── seed.js                # Database seeder for baseline historical rarities
    │   └── migrations/            # SQL migration history
    └── src/
        ├── app.js                 # Express application & middleware setup
        ├── server.js              # Server entry point with port fallback logic
        ├── db/config.js           # Prisma ORM client & auto-seeding hooks
        └── routes/                # Modular REST route handlers
```

---

## Mathematical Foundations & Algorithms

### 1. Weighted Modulo-11 Checksum Verification
The system validates 9-digit postal order and stamp serial identifiers using a weighted modulo-11 algorithm:
- **Base Digits:** $d_1, d_2, \dots, d_8$
- **Weight Vector:** $W = [8, 6, 4, 2, 3, 5, 9, 7]$
- **Weighted Sum:**
  $$S = \sum_{i=1}^{8} (d_i \times W_i)$$
- **Checksum Calculation:**
  $$R = S \pmod{11}$$
  $$\text{Check Digit } C = 11 - R \quad (\text{with } 10 \to 0,\; 11 \to 5)$$

This algorithm catches single-digit entry errors and adjacent transposition errors.

### 2. Fair Allotment via Coprime Modular Generation
When allocating scarce stamp drops (where total applicants $N >$ available quantity $K$), the system utilizes a deterministic linear generator:
$$\text{Winner ID}_{step} = ((\text{seed} + step \times P) \pmod N) + 1$$
where $P = 17$ (a prime chosen to remain coprime with typical applicant pools $\gcd(P, N) = 1$), ensuring uniform coverage and zero duplicate bias. Results are persisted to the database in `StampAllocation`.

---

## Technology Stack

- **Frontend:**
  - React 18
  - Vite 6
  - Tailwind CSS 3 (with custom philatelic color tokens: Burgundy, Deep Navy, Gold, Parchment)
  - Lucide React (vector iconography)
  - React Router v7
- **Backend:**
  - Node.js & Express 4
  - Prisma ORM 6
  - PostgreSQL
  - CORS & Dotenv
- **Testing & Verification:**
  - Custom integration test runner (`server/test-db.js`)

---

## Database Schema (Prisma / PostgreSQL)

- **`User`**: Registered philatelic society members (`id`, `email`, `name`, timestamps).
- **`Stamp`**: Historical stamp catalogue items (`id`, `name`, `year`, `country`, `category`, `description`, `image`).
- **`CollectionItem`**: Personal vault entries linking users and stamps with `quantity` and `condition`.
- **`PdaApplication`**: Philatelic Deposit Accounts with unique `accountNumber`, `holderName`, `postalCircle`, `balance`, and standing orders (`mintStamps`, `firstDayCovers`, `miniatureSheets`).
- **`StampAllocation`**: Persistent record of fair-drop winners linked to stamps and PDA accounts.

---

## API Reference

### Health & Information
- `GET /` — API greeting & endpoint catalogue
- `GET /api/health` — Service health and uptime status

### Stamp Catalogue
- `GET /api/stamps` — Retrieve all catalogue stamps
- `GET /api/stamps/:id` — Retrieve a single stamp by ID
- `POST /api/stamps` — Create a new stamp record
- `DELETE /api/stamps/:id` — Delete a stamp record

### Personal Collection
- `GET /api/collection` — Retrieve all items in the personal collection
- `POST /api/collection` — Add a stamp to the collection
- `DELETE /api/collection/:id` — Remove an item from the collection

### National PDA (Philatelic Deposit Account)
- `GET /api/pda/accounts` — List active PDA accounts
- `POST /api/pda/open` — Open a new PDA account with Modulo-11 verified account number
- `POST /api/pda/verify` — Verify a 9-digit postal serial number

### Mathematical Verification & Allotment
- `POST /api/verification/check-stamp` — Verify serial checksum against Modulo-11
- `POST /api/verification/fair-drop` — Execute deterministic fair allotment drop and persist allocations
- `GET /api/verification/allocations` — List recorded stamp allocations

---

## Getting Started

### Prerequisites
- **Node.js** (v18.x or later recommended; v22.x verified)
- **npm** (v9.x or later)
- **PostgreSQL** (running locally or accessible via connection string)

### 1. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Configure `DATABASE_URL` with your PostgreSQL credentials:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://postgres:password@localhost:5432/philately_db?schema=public"
   ```
4. Push the Prisma schema and seed initial stamps:
   ```bash
   npx prisma db push
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   *Note: If port 5000 is occupied (e.g., macOS AirPlay), the server automatically falls back to port 5001.*

### 2. Frontend Setup
1. From the repository root, install dependencies:
   ```bash
   npm install
   ```
2. Create your frontend environment file:
   ```bash
   cp .env.example .env
   ```
   Ensure `VITE_API_BASE_URL` matches your server port (defaults to `http://localhost:5001/api` or `http://localhost:5000/api`).
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Running Verification Tests
To run backend automated health and API tests:
```bash
cd server
npm test
```
