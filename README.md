# 🦫 Multiplayer Beaver Habit Tracker

A collaborative, full-stack habit-tracking platform designed to manage high-concurrency interactions and ensure system-level data integrity. Users work together in "Colonies" to evolve a shared virtual pet through consistent, verified habit completion.

## 🛡️ Trust & Safety / Risk & Response Features

This project was built with a "Safety by Design" philosophy, implementing protocols common in content moderation and risk management systems:

- **Data Integrity Protection**: Implemented Row-Level Security (RLS) in Supabase to ensure strict data isolation between users and colonies.
- **Role-Based Access Control (RBAC)**: Developed permission-based workflows where "Colony Admins" manage memberships and escalation handling for shared states.
- **Server-Side Validation**: Utilized Supabase Edge Functions to process XP rewards and habit completions, preventing frontend "spoofing" and ensuring logical consistency.
- **Audit-Ready Dashboards**: Designed the database schema to track every interaction with unique session IDs and timestamps for reproducible evaluation of user behavior.

## 🚀 Features

- **Real-Time Synchronization**: Instant state updates across concurrent user sessions using Supabase Realtime.
- **Beaver Evolution Engine**: A state-driven interaction model where "Colony XP" triggers visual and logical evolution of the shared avatar.
- **Accountability Feed**: A live activity stream showing verified user actions and system-level notifications.
- **Mobile-Optimized UI**: Reusable, accessible component design built for high-performance mobile and desktop web experiences.

## 🛠️ Tech Stack

- **Next.js 15+ (App Router)** - React framework for high-performance server-side rendering.
- **TypeScript** - Enforcing type-safe system architecture and reliability.
- **Supabase (PostgreSQL)** - Real-time database with built-in Auth and RLS.
- **Tailwind CSS** - Modern, responsive styling with WCAG accessibility compliance.
- **Lucide React** - Standardized iconography for clear UX communication.

## 📥 How to Run Locally

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone [https://github.com/satoe8/beaver-habit-tracker.git](https://github.com/satoe8/beaver-habit-tracker.git)
   cd beaver-habit-tracker

2. **Extract and open terminal** in the project folder

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the app**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and go to: `http://localhost:3000`

### 🧠 System Architecture
The platform manages risk and data flow through three distinct layers:

- Frontend: Collects user intent through "Hold-to-Confirm" interactions to prevent accidental data entry.

- Middleware: Validates user sessions and JWT tokens before reaching database resources.

- Database (Security Layer): Enforces PostgreSQL RLS policies to ensure that a "Risk Actor" cannot access or modify data outside of their authorized scope.

### 📈 Future Roadmap
- Heuristic Anomaly Detection: Identifying and flagging suspicious habit completion patterns that suggest botting or system abuse.

- Advanced Admin Audit Logs: A dedicated interface for "Moderators" to review colony-wide activity and resolve state conflicts.
