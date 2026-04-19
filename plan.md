# Focus Flow - Features & Roadmap Plan

## 1. Executive Summary
Focus Flow is a solid frontend-only productivity tool with a Pomodoro timer, habit tracker, and insights dashboard. To transition this into a fully-fledged, scalable SaaS application, the roadmap below outlines structured development phases. The primary goal is to establish robust user data management—including the development of a **specialized custom backend API**—before progressively expanding into advanced productivity features, integrations, and cross-platform expandability.

*Note: Foundational work has already been started for Authentication (`@supabase/ssr` installed and `app/auth` routes exist).*

---

## Phase 1: Core SaaS Foundation & Specialized Backend
The first step is shifting away from `localStorage` by building a dedicated backend. Ensuring data is securely managed, persisted, and easily extendable via a specialized server architecture is critical.
- [x] **Secure Authentication Infrastructure**: 
   - Implemented custom JWT-based authentication with secure HTTP-only cookies.
   - Integrated Google OAuth 2.0 via Passport.js.
   - Added Email Verification and Password Reset flows with SMTP support.
   - Hardened security with API Rate Limiting and Next.js Route Middleware.
   - Established global AuthContext for seamless frontend user state management.
- [ ] **Database Migration & ORM**: 
   - Integrate a PostgreSQL database pairing with an ORM like Prisma or Drizzle within the specialized backend.
   - Design schemas for `Users`, `FocusSessions`, `Habits`, and `HabitLogs`.
- [ ] **Data Synchronization Layer**: Refactor existing state management (zustand hooks) on the Next.js frontend to securely pull and continuously push data to your custom API instead of relying on local storage, allowing for optimistic UI updates.
- [ ] **User Profile Management**: Create a dedicated settings interface for users to manage their profile details, timezone, aesthetic preferences, and account controls.

---

## Phase 2: Enhanced Productivity Features
Once the API is actively managing data, we can expand the app's utility for users.
- [ ] **Project & Task Tagging**: Allow users to categorize individual focus sessions under specific "Projects" or "Tags", providing granularity on exactly where their time goes.
- [ ] **Customized Timer Constraints**: Expand the default 15/25/45-minute options by allowing users to construct and save custom sprint and break increments.
- [ ] **Expansive History & Filtering**: Overhaul the history limitations allowing users to filter statistics across monthly, yearly, or all-time bounds via new API endpoints in the specialized backend.
- [ ] **Immersive Audio Controls**: Embed an internal audio player offering integrated white noise, lofi hip-hop, or ambient nature scenes to listen to during active sessions.

---

## Phase 3: Analytics & Smart Insights
Deliver ongoing value by actively tracking and visualizing user behavior patterns over time, utilizing the custom backend for heavy data crunching.
- [ ] **Extended Heatmaps Component**: Build a GitHub-style contribution overview graph to easily map out habit completion consistency across an entire year.
- [ ] **Smart Productivity Engine**: Utilize the custom backend to run analytics algorithms providing tangible recommendations (e.g., "You tend to accomplish the longest streaks on Tuesday mornings").
- [ ] **Automated Weekly Briefs**: Implement a cron system or background worker directly within the backend architecture to generate and deliver weekly email summaries covering time focused and habit goals met.

---

## Phase 4: Integrations & External Ecosystem
Transform the application into a central productivity hub by connecting it with tools the user relies on—natively handled efficiently server-side.
- [ ] **Task Manager Synchronization**: Build secure API integrations within the backend for platforms like Todoist, Notion, or Jira, allowing users to safely import pending tasks directly into the focus timer.
- [ ] **Calendar Blocking**: Two-way server-side sync with Google Calendar or MS Outlook. Users can schedule upcoming focus periods which will automatically manifest as "Busy - Do Not Disturb" blocks on their public calendar.
- [ ] **Status Automation**: Webhook support within the backend to automatically shift a user's Slack/Microsoft Teams status to "Focused 🍅 - Do Not Disturb" when their timer starts running.

---

## Phase 5: Social Dynamics & Platform Expansion
Ensure user retention through social accountability, and improve the immediate accessibility of the timer.
- [ ] **Virtual Focus Rooms (Real-Time Backend)**: Implement WebSockets (Socket.io) or Server-Sent Events (SSE) on the specialized backend to let users create or join multiplayer "rooms" with peers in real-time.
- [ ] **Shareable Milestones**: Auto-generate beautifully formatted statistic cards representing major milestones or long streaks that users can instantly export and share.
- [ ] **Desktop Wrapper (System Tray)**: Package the web application using Tauri/Electron to distribute a native desktop app for Mac/Windows, focusing entirely on a quick-access menu bar widget.
- [ ] **Browser Extension**: A lightweight Chrome extension natively communicating with the customized backend API, allowing users to start Pomodoros quickly and actively redirect distracting domains while the timer ticks.
