# Focus Flow - Full-Stack Productivity SaaS

A powerful, full-stack productivity web application designed to help you manage focus sessions, track daily habits, and visualize your productivity trends. Built with a modern specialized backend and a premium Next.js frontend.

## 🚀 Live Demo

[https://focus-flow.vercel.app](https://focus-flow.vercel.app)

---

## ✨ Features & Solution

Staying focused in today's distracted world is challenging. Focus Flow solves this by providing:

- **Specialized Backend Architecture**: A dedicated Express.js API for complex business logic, security, and scalability.
- **Secure Authentication Infrastructure**:
  - Custom JWT-based authentication with secure HTTP-only cookies.
  - Multi-strategy support: Traditional Email/Password + Google OAuth 2.0.
  - Full Auth Lifecycle: Registration, Email Verification, Forgot/Reset Password.
  - Hardened security with API Rate Limiting and Next.js Middleware route protection.
- **Pomodoro Timer**: Structured focus sessions with customizable durations.
- **Habit Tracking**: Build and maintain daily habits with visual streak tracking and persistent database storage.
- **Productivity Insights**: Visualize your focus patterns and habit completion rates with real-time data from the API.

---

## 🛠 Tech Stack

### Frontend (apps/web)
- **Framework**: [Next.js 15](https://nextjs.org) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **State Management**: React Context (AuthProvider) + Global API Client
- **Styling**: [TailwindCSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **Charts**: [Recharts](https://recharts.org)

### Backend (apps/api)
- **Runtime**: [Node.js](https://nodejs.org) / [Express.js](https://expressjs.com)
- **Database/ORM**: [PostgreSQL](https://www.postgresql.org) + [Prisma ORM](https://www.prisma.io)
- **Security**: [Passport.js](https://www.passportjs.org) (Google OAuth), [Helmet](https://helmetjs.github.io), [express-rate-limit](https://www.npmjs.com/package/express-rate-limit), [bcryptjs](https://www.npmjs.com/package/bcryptjs).
- **Communication**: [Nodemailer](https://nodemailer.com) for authentication emails.

### Infrastructure
- **Monorepo Tooling**: [Turborepo](https://turbo.build)
- **Package Manager**: [pnpm](https://pnpm.io)
- **Deployment**: [Vercel](https://vercel.com) (Frontend) + Render/Railway (API)

---

## 🏗 Project Structure

```
focus-flow/
├── apps/
│   ├── api/                 # Express backend
│   │   ├── prisma/          # Database schema & migrations
│   │   └── src/
│   │       ├── config/      # Auth & Passport strategies
│   │       ├── controllers/ # Request handlers
│   │       ├── middlewares/ # Auth & Security guards
│   │       └── routes/      # API endpoint definitions
│   └── web/                 # Next.js frontend
│       ├── app/             # App Router pages
│       ├── components/      # UI & Logic components
│       ├── hooks/           # Global useAuth and custom hooks
│       └── lib/             # API Client & Utilities
├── package.json             # Root monorepo scripts
└── turbo.json               # Pipeline configuration
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- pnpm (recommended)
- PostgreSQL database instance

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/focus-flow.git
cd focus-flow
pnpm install
```

### 2. Environment Setup
Create a `.env` file in `apps/api` and `apps/web`.

**apps/api/.env:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/focusflow"
JWT_SECRET="your_jwt_secret"
GOOGLE_CLIENT_ID="your_google_id"
GOOGLE_CLIENT_SECRET="your_google_secret"
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="user@example.com"
SMTP_PASS="password"
FRONTEND_URL="http://localhost:3000"
```

**apps/web/.env:**
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

### 3. Database Initialization
```bash
cd apps/api
pnpx prisma generate
pnpx prisma db push
```

### 4. Run Development
```bash
# From the root directory
pnpm dev
```
- API starts at `http://localhost:5000`
- Web starts at `http://localhost:3000`

---

## 🔒 Security Focus

- **Password Hashing**: Uses `bcryptjs` with high salt rounds.
- **Route Guards**: Next.js Middleware blocks unauthenticated traffic before components even mount.
- **HTTP-Only Cookies**: JWTs are stored in secure cookies to prevent XSS-based token theft.
- **Input Validation**: Zero-trust approach using Prisma schemas and zod-based frontend validation.
- **Rate Limiting**: Brute-force protection on all auth endpoints.

---

## 🤝 Acknowledgments

- Built with [Next.js](https://nextjs.org) and [Express](https://expressjs.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Charts powered by [Recharts](https://recharts.org)

**Start your focused journey today with Focus Flow!**