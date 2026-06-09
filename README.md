# ManufactoCRM AI 🏭

**AI-powered CRM & BDA Management System for Manufacturing Companies**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://mongodb.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev)

---

## 🚀 Overview

ManufactoCRM AI is a production-ready, full-stack MERN SaaS CRM platform built for manufacturing companies. It empowers Business Development Associate (BDA) teams with intelligent lead management, AI-powered sales assistance, real-time analytics, and a beautiful modern UI.

---

## ✨ Features

| Feature | Description |
|---|---|
| ⚡ **Direct Sign-up & Auto-Login** | Registrations are active immediately. Bypasses email verification (OTP) pages, signs the user in, and redirects straight to the role-based dashboard. |
| 🎬 **CRM Video Tour Modal** | The public home page includes a professional interactive video modal player displaying a responsive YouTube product tour trailer. |
| 🔬 **SMTP & Health Diagnostics** | Self-diagnostics system integrated into the backend `/api/health` endpoint to test SMTP settings, database status, and resolve network connectivity live in production. |
| 🔐 **Authentication & RBAC** | JWT-based auth with bcrypt, secure social log-ins (Google, GitHub, Microsoft), and strict role-based access controls (Admin/Team Lead/Sales Exec). |
| 📊 **Dashboard Views** | Role-based KPI stats cards, 4 interactive Recharts charts (Area, Bar, Pie, Line), and recent activity streams. |
| 👥 **Lead Management** | Comprehensive CRUD control, advanced global filters, search matching, pagination, and teammate assignments. |
| 🎯 **Kanban Pipeline** | Drag-and-drop CRM visual board with 7 pipeline stages powered by `@dnd-kit`. |
| 🤖 **AI Assistant** | Instantly generates follow-up emails, sales pitches, lead summaries, and recommended actions using AI text generation. |
| ⚙️ **System Settings** | User profile card management, secure password updates, and configurable notification preferences. |
| 📱 **Fully Responsive Layout** | Sleek glassmorphic mobile drawer, collapsible sidebars, and fluid responsive layouts optimized for all screens. |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite 8**
- **Tailwind CSS** — Utility-first styling
- **React Router DOM** — Client-side routing
- **Framer Motion** — Animations & transitions
- **Recharts** — Data visualization
- **@dnd-kit** — Drag-and-drop Kanban
- **React Icons** — Icon library
- **React Hot Toast** — Notifications
- **Axios** — HTTP client

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** — Authentication
- **bcryptjs** — Password hashing
- **cors, morgan, dotenv**

---

## 📁 Project Structure

```
manufacto-crm-ai/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Sidebar, Navbar
│   │   ├── context/           # AuthContext
│   │   ├── hooks/             # useLeads
│   │   ├── layouts/           # AppLayout
│   │   ├── pages/             # 12 pages
│   │   ├── services/          # Axios API client
│   │   └── utils/             # Helpers & constants
│   └── index.html
│
└── server/                    # Express Backend
    ├── config/                # Database config
    ├── controllers/           # Business logic
    ├── middleware/            # Auth, Error handling
    ├── models/                # Mongoose schemas
    ├── routes/                # API routes
    ├── utils/                 # Seed data
    └── server.js
```

---

## 🚀 Getting Started

Follow these detailed step-by-step instructions to get the application set up and running on your local machine.

### Prerequisites
Before you start, make sure you have the following installed on your machine:
- **Node.js (v18 or higher)**: The JavaScript runtime environment needed to run the backend and package managers.
- **MongoDB**: You can use either a local MongoDB instance (Community Edition) or a free MongoDB Atlas cloud cluster.
- **Git**: For cloning the repository.
- **npm** (comes packaged with Node.js) or **yarn** to install dependencies.

---

### Step 1: Clone the Repository
Begin by cloning the repository from your version control system to your local workspace, then navigate into the project root directory:
```bash
git clone https://github.com/your-username/manufacto-crm-ai.git
cd manufacto-crm-ai
```

---

### Step 2: Configure the Backend Server Environment
1. Navigate into the `server/` directory:
   ```bash
   cd server
   ```
2. Install all required backend Node.js dependencies (such as Express, Mongoose, JWT, bcryptjs, cors, morgan, dotenv):
   ```bash
   npm install
   ```
3. Create your backend environment configuration file. Copy the provided `.env.example` file to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
4. Open the newly created `server/.env` file in your text editor and specify your MongoDB connection string and secret key:
   - For a local MongoDB instance, set `MONGO_URI=mongodb://localhost:27017/manufactocrm`
   - For MongoDB Atlas, paste the connection string generated from the Atlas dashboard.
   - Set a strong `JWT_SECRET` (e.g., `your_super_secret_jwt_key`) to secure user authentication sessions.

---

### Step 3: Seed the Database with Mock Data
To populate the CRM with realistic leads, mock BDAs, and initial activities for testing:
1. Start the backend development server from the `server/` directory:
   ```bash
   npm run dev
   ```
   *The server will start running on port 5000 (`http://localhost:5000`).*
2. While the backend server is running, open a separate terminal window and trigger the database seeder by making a POST request to the seeding endpoint:
   ```bash
   curl -X POST http://localhost:5000/api/seed
   ```
   *This endpoint will populate 20 active mock manufacturing leads (such as Tata Motors Ltd, Reliance Industries, etc.), assign them across test users, and configure demo accounts for testing.*

---

### Step 4: Configure and Start the React Frontend
1. Navigate into the `client/` directory:
   ```bash
   cd ../client
   ```
2. Install all required frontend React and Vite packages:
   ```bash
   npm install
   ```
3. Start the client development server:
   ```bash
   npm run dev
   ```
   *The Vite dev server will boot up and expose the web app at `http://localhost:5173`.*

---

### Step 5: Log in to the CRM
Open your web browser and navigate to `http://localhost:5173`. Use one of the pre-configured demo credentials below to test the role-based dashboards:

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Admin** | `admin@manufactocrm.com` | `admin123` | Full administrative control, user management, global reports |
| **Team Lead** | `teamlead@manufactocrm.com` | `lead123` | Lead management, BDA assignment, analytics |
| **Sales Executive** | `rahul@manufactocrm.com` | `exec123` | Personal leads CRUD, pipeline Kanban, AI Assistant features |

---

## 🔑 Environment Variables Reference

### Backend Configuration (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/manufactocrm
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## 📊 Core API Endpoints

### 🔐 Authentication & Profile
- `POST /api/auth/register` — Register a new platform account.
- `POST /api/auth/login` — Log in and receive a JWT token.
- `GET /api/auth/me` — Fetch currently logged-in user profile metadata.
- `PUT /api/auth/profile` — Update account profile details (Name, Address, Phone).
- `PUT /api/auth/password` — Change account password.

### 💼 Lead Operations
- `GET /api/leads` — Retrieve filtered, paginated, and searched list of leads.
- `POST /api/leads` — Create a new manufacturing client lead.
- `GET /api/leads/:id` — Retrieve comprehensive lead details and logs.
- `PUT /api/leads/:id` — Update lead specifications (Stage, priority, BDA assigned).
- `DELETE /api/leads/:id` — Remove a lead from the database (Restricted to Admin/Lead roles).
- `GET /api/leads/kanban` — Fetch leads formatted for columns on the Kanban board.

### 📈 Reports & Analytics
- `GET /api/analytics/dashboard` — Fetch aggregate counts, KPI cards, and charts.
- `GET /api/analytics/team` — Fetch team leaderboard and BDA conversion rankings.

### 💬 Client Activities & Notes
- `GET /api/activities/recent` — Fetch recent activity streams.
- `GET /api/activities/:leadId` — Retrieve logs associated with a specific lead.
- `POST /api/activities` — Log a new client interaction (Call, Email, Meeting).

### 🤖 AI Utilities
- `POST /api/ai/generate` — Connects to the text generator to draft follow-up templates or pitches.

---

## 🖥️ Application Pages & Walkthrough

Here is a detailed guide explaining the structure, design, and features of each page in the application, accompanied by screenshots.

### 1. Account Registration (Step 1)
When new users sign up for ManufactoCRM AI, they undergo a multi-step guided registration wizard to configure their role and profile metrics. Step 1 gathers fundamental identification details, credentials, and permits instant authorization through popular OAuth providers (Google, GitHub, and Microsoft).



---

### 2. User Authentication Page
The login screen features pre-filled credentials for testing different role-based views. It uses a modern dark layout with card elements detailing core features such as Pipeline management, Analytics tools, and AI Sales Assist.


---

### 3. Admin Dashboard View
Logging in as an Administrator directs you to a system-wide control center. It offers full visibility into cumulative metrics across all sales executives. The dashboard displays KPI cards (Total active users, total leads, total revenue, and system health status), lists recent logs of activities across the company, shows user breakdown statistics, and features rapid shortcut buttons to manage CRM users.



---

### 4. Lead Management Page (`My Leads`)
The Lead Management page allows Sales Executives and managers to inspect assigned client leads. It lists details like lead name, status, industry sector, deal size, priority level, and assigned date. Users can filter by priority level and pipeline status, create new leads via the **New Lead** button, and search leads in real-time. If no leads are currently assigned, a friendly mailbox alert is displayed.

---

### 5. Sales Pipeline Kanban Board
The Pipeline page displays leads as drag-and-drop cards mapped across columns representing the 7 key sales stages. Powered by `@dnd-kit`, Sales Executives can drag and drop cards to change a lead's stage instantly, updating the backend database and logging the activity automatically.



---

### 6. Analytics Dashboard
The Analytics page compiles historical data into charts. It displays KPI metrics (Total Leads, Conversion Rate, Total Revenue, and Deals Won) and showcases visual breakdowns:
- **Pipeline Distribution**: Pie charts representing lead frequency at each stage.
- **Industry Breakdown**: Bar graphs classifying leads by sector (Automotive, Electronics, Metal, etc.).
- **Lead Generation Trend**: Area charts showing lead ingestion count over time.
- **Revenue by Month**: Revenue trends generated from closed won deals.


---

### 7. Global Search Box & User Experience Enhancements
The application features a global navbar search box that allows users to query and filter leads by company name, contact person, or industry.
- The input field triggers an animated dropdown showing filtered results as you type.
- Clean alerts indicate if no matching leads are found.
- Clicking a result routes the user to the lead detail page while keeping the active dashboard layout intact.
- Upon successful authentication or profile configuration, floating green confirmation toasts are rendered to welcome users.

| Component | UI Screenshot / Toast |
|---|---|
| **Global Search Input** | ![Global Search Input](screenshots/media__1779622519460.png) |
| **Search Button** | ![Search Button](screenshots/media__1779622890655.png) |
| **Welcome Aboard Toast** | ![Welcome Toast](screenshots/media__1779621033261.png) |
| **No Matches Found Dropdown** | ![No Matches Dropdown](screenshots/media__1779623634423.png) |

---

## 🏗️ Technical Highlights

- **Direct Auth & Session Auto-Login**: Replaced the multi-step verification code (OTP) requirement with direct sign-up. Upon registering, users are created as verified, session tokens are signed immediately using JWT, and the frontend logs them in seamlessly. Unverified legacy accounts are automatically verified during login or duplicate signup attempts to ensure zero-friction entry.
- **Node.js IPv4 DNS Resolution Policy**: Configured the backend Node.js runtime environment using `dns.setDefaultResultOrder('ipv4first')` to resolve connection timeouts (`ENETUNREACH`) on cloud hosts (like Render) that block outbound IPv6 routes, forcing SMTP connections over IPv4.
- **Cross-Window Security on Social Login**: Configured the OAuth social authentication popups (Google, GitHub, Microsoft) to establish secure cross-window message relays with strict origin validation, dynamically supporting `localhost`, `vercel.app`, and `onrender.com` subdomains.
- **Live Health Diagnostics Suite**: Implemented an automated `/api/health` query diagnostics system. Developers can run direct, isolated SMTP tests (by hitting `/api/health?testEmail=...&testName=...`) or inspect user database records in real-time.
- **Full-Stack Architecture**: React 19 + Express + Node.js + MongoDB Atlas.
- **Role-Based Access Control (RBAC)**: Client-side router-guards and server-side authorization middlewares lock access paths depending on active roles (Admin, Team Lead, Sales Executive).
- **Dynamic Leads Auto-Assignment**: Backend middleware dynamically hooks new Sales Executive registrations and auto-assigns 20 mock manufacturing leads on first log-in to guarantee an instantly interactive testing sandbox.
- **Search Everywhere**: Integrated a global search component that queries leads database collections across names, contacts, and sectors, featuring animated dropdowns and seamless page routing.

---

Thank You For Visiting! 🚀
