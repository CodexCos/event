# EventMate — Setup & Run Guide

A beginner-friendly guide to getting EventMate running on your local machine using VS Code.

---

## Table of Contents

1. [Project Structure Overview](#1-project-structure-overview)
2. [Prerequisites](#2-prerequisites)
3. [Step-by-Step Setup Instructions](#3-step-by-step-setup-instructions)
4. [Demo Login Accounts](#4-demo-login-accounts)
5. [Troubleshooting Common Issues](#5-troubleshooting-common-issues)
6. [OS-Specific Notes](#6-os-specific-notes)

---

## 1. Project Structure Overview

Once you open the project in VS Code, here is what each folder contains:

```
eventmate/
├── public/                  # Static assets (favicon, etc.)
├── src/
│   ├── assets/              # Images and other media used in the app
│   ├── components/          # Reusable UI building blocks used across pages
│   │   ├── Avatar.jsx         – Renders a user's initials avatar
│   │   ├── Badge.jsx          – Status/category labels (e.g. "Active", "Music")
│   │   ├── Button.jsx         – Standard button with variants (primary, danger…)
│   │   ├── EventCard.jsx      – Card preview for a single event
│   │   ├── EventCarousel.jsx  – Horizontally scrollable event recommendations
│   │   ├── Layout.jsx         – Wraps all dashboard pages with Sidebar + Navbar
│   │   ├── Modal.jsx          – Accessible pop-up dialog
│   │   ├── Navbar.jsx         – Top navigation bar
│   │   ├── RegistrationChart.jsx – Recharts area/bar charts for analytics
│   │   ├── Sidebar.jsx        – Left navigation panel (role-aware links)
│   │   ├── Spinner.jsx        – Loading spinner
│   │   ├── StatCard.jsx       – KPI metric card for dashboards
│   │   └── ...                  (plus a few more utility components)
│   │
│   ├── context/             # Global state shared across the whole app
│   │   ├── AuthContext.jsx    – Handles login, logout, and current user session
│   │   └── ToastContext.jsx   – System-wide notification toasts (success/error/info)
│   │
│   ├── data/                # Mock JSON "database" — no real backend needed
│   │   ├── events.json        – 20 sample events across 6 categories
│   │   ├── users.json         – 15 users (1 Admin, 5 Organizers, 9 Participants)
│   │   ├── registrations.json – Which users are registered for which events
│   │   └── notifications.json – Pre-seeded notifications for participants
│   │
│   ├── pages/               # Full page views, grouped by user role
│   │   ├── LandingPage.jsx    – Public home page (no login required)
│   │   ├── LoginPage.jsx      – Sign-in form with quick demo account buttons
│   │   ├── RegisterPage.jsx   – New user registration form
│   │   ├── admin/             – Pages only accessible to Admins
│   │   │   ├── AdminDashboard.jsx   – Platform-wide stats and charts
│   │   │   ├── ManageUsers.jsx      – View/activate/deactivate all users
│   │   │   └── ManageEvents.jsx     – Browse and delete any event
│   │   ├── organizer/         – Pages only accessible to Organizers
│   │   │   ├── OrganizerDashboard.jsx – Organizer overview and quick links
│   │   │   ├── MyEvents.jsx         – List of the organizer's own events
│   │   │   ├── CreateEditEvent.jsx  – Form to create or edit an event
│   │   │   ├── ManageAttendees.jsx  – Attendee check-in and management
│   │   │   └── EventAnalytics.jsx   – Charts for a single event
│   │   └── participant/       – Pages only accessible to Participants
│   │       ├── ParticipantDashboard.jsx – Personalized event recommendations
│   │       ├── BrowseEvents.jsx     – Search and filter all events
│   │       ├── EventDetails.jsx     – Full event detail + registration button
│   │       ├── MyRegistrations.jsx  – List of the participant's bookings
│   │       └── Notifications.jsx    – Unread/read notification feed
│   │
│   ├── routes/              # Routing and access control
│   │   ├── AppRoutes.jsx      – Full route map of the entire app
│   │   └── ProtectedRoute.jsx – Redirects users who lack the right role
│   │
│   ├── services/            # Functions that read/write mock data (simulates an API)
│   │   ├── analyticsService.js   – Dashboard totals and chart data
│   │   ├── eventService.js       – Event filtering, sorting, recommendations
│   │   ├── registrationService.js – Register, cancel, check-in attendees
│   │   └── userService.js        – Fetch and update user profiles/status
│   │
│   ├── App.jsx              # Root component — sets up contexts and routing
│   ├── index.css            # Global CSS (Tailwind base + custom design tokens)
│   └── main.jsx             # App entry point — mounts React into the HTML page
│
├── index.html               # HTML shell (loads Google Fonts and the React app)
├── tailwind.config.js       # Tailwind CSS configuration (custom colours, fonts)
├── vite.config.js           # Vite bundler configuration
└── package.json             # Project metadata and npm scripts
```

> **In plain English:** All the visual "building blocks" live in `components/`. Each screen you navigate to is a "page" in `pages/`. The `data/` folder is the fake database. The `services/` folder acts as a fake API layer between the data and the UI.

---

## 2. Prerequisites

Install these tools **in order** before doing anything else.

### Node.js (v18 or higher)

EventMate requires **Node.js 18 or newer**. Node.js also installs `npm` automatically.

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS (Long-Term Support)** version — this is the safe, stable choice.
3. Run the installer with default settings.
4. Verify the installation by opening a terminal and typing:

```bash
node --version
# Should print something like: v22.0.0

npm --version
# Should print something like: 10.x.x
```

> If you see `command not found` or `not recognized`, Node.js was not installed correctly. Try restarting your terminal or running the installer again.

---

### VS Code (Recommended Editor)

1. Go to [https://code.visualstudio.com](https://code.visualstudio.com)
2. Download and install the version for your OS.

#### Recommended VS Code Extensions

After opening VS Code, install these extensions for the best development experience.
Click the **Extensions** icon on the left sidebar, or press `Ctrl+Shift+X`, then search by name:

| Extension | Why it helps |
|---|---|
| **ES7+ React/Redux/React-Native snippets** | Shorthand snippets for React components |
| **Tailwind CSS IntelliSense** | Auto-complete for Tailwind class names |
| **Prettier - Code Formatter** | Auto-formats your code on save |
| **ESLint** | Highlights code errors and style issues inline |
| **Path Intellisense** | Auto-completes file paths when importing |

---

### Git (for cloning from a repository)

1. Go to [https://git-scm.com](https://git-scm.com)
2. Download and install Git for your OS.
3. Verify:

```bash
git --version
# Should print: git version 2.x.x
```

> **Note:** Git is only required if you are cloning the project from a remote repository like GitHub. If you already have the project files on your machine, you can skip this step.

---

## 3. Step-by-Step Setup Instructions

Follow these steps exactly, in order.

### Step 1 — Get the project files

**Option A: Clone from GitHub** (if the project is hosted on GitHub)
```bash
git clone https://github.com/your-username/eventmate.git
```

**Option B: Already have the files?**
Skip this step and continue from Step 2.

---

### Step 2 — Open the project in VS Code

1. Open VS Code.
2. Click **File → Open Folder** (Windows/Linux) or **File → Open...** (macOS).
3. Navigate to and select the `eventmate` folder.

Alternatively, from a terminal already in the right location:
```bash
code eventmate
```

---

### Step 3 — Open the integrated terminal

Inside VS Code, open a terminal:
- Press `` Ctrl+` `` (Windows/Linux) or `` Cmd+` `` (macOS)
- Or go to **Terminal → New Terminal** from the menu bar.

Make sure the terminal shows you are **inside the `eventmate` folder**:

```
C:\Users\YourName\eventmate>        ← Windows
~/eventmate $                        ← macOS / Linux
```

If you are in the wrong folder, navigate there:
```bash
cd path/to/eventmate
```

---

### Step 4 — Install dependencies

This downloads all the packages the project needs (React, Tailwind CSS, etc.):

```bash
npm install
```

This may take **1–2 minutes** on the first run. When it finishes, a `node_modules/` folder will appear in the project. You only need to run this **once**.

---

### Step 5 — Start the development server

```bash
npm run dev
```

You will see output like this in the terminal:

```
  VITE v8.0.16  ready in 196 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Step 6 — Open the app in your browser

Open your web browser and visit:

**http://localhost:5173**

You should see the EventMate landing page.

> **To stop the server:** Go back to the VS Code terminal and press `Ctrl+C`.

---

## 4. Demo Login Accounts

EventMate has three user roles. You do not need to create an account — use the **quick-fill buttons** on the Login page, or enter these credentials manually:

| Role | Email | Password |
|---|---|---|
| **Admin** | `rajesh@eventmate.com` | `admin123` |
| **Organizer** | `shyam@eventpro.com` | `organizer123` |
| **Participant** | `laxmi@eventmate.com` | `participant123` |

Each role gives access to different sections of the app:
- **Admin** — Manage all users and events platform-wide.
- **Organizer** — Create events, view analytics, manage attendees.
- **Participant** — Browse events, register, view notifications.

> All data is stored in your browser's local memory and resets if you clear your browser storage.

---

## 5. Troubleshooting Common Issues

### npm install fails or shows errors

**Likely cause:** Your Node.js version is too old.

**Fix:** Run `node --version`. If the version is below **v18**, download the latest LTS from [nodejs.org](https://nodejs.org), then run `npm install` again.

---

### Port 5173 is already in use

**Error message you see:**
```
Error: listen EADDRINUSE: address already in use :::5173
```

**Fix:** Another process is already using that port. Either stop the other process, or run EventMate on a different port:
```bash
npm run dev -- --port 3000
```
Then open `http://localhost:3000` instead.

---

### npm run dev says "vite: command not found"

**Cause:** Dependencies were not installed.

**Fix:** Run `npm install` first, then try `npm run dev` again.

---

### The page is blank or shows a React error in the browser

**Fix:**
1. Open browser Developer Tools (press `F12`) and check the **Console** tab for red errors.
2. Try a hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (macOS).
3. Try opening the app in a private/incognito window to rule out extension conflicts.

---

### git clone fails

**Possible causes:** Git is not installed, the URL is wrong, or the repo is private.

**Fix:** Verify Git is installed (`git --version`). Double-check the repository URL. If the repo is private, make sure you are authenticated with GitHub.

---

### Code changes are not showing up in the browser

Vite's hot-reload should update the browser automatically. If it does not:
1. Save the file (`Ctrl+S` / `Cmd+S`).
2. Hard-refresh the browser (`Ctrl+Shift+R`).
3. If the issue persists, stop the server (`Ctrl+C`) and run `npm run dev` again.

---

## 6. OS-Specific Notes

The core commands (`npm install`, `npm run dev`) work **identically on Windows, macOS, and Linux**. The small differences are noted below.

### Windows

- Use **PowerShell** or the **VS Code integrated terminal**. Avoid the old Command Prompt (`cmd.exe`).
- If you see a **script execution policy** error when running npm commands, open PowerShell as Administrator and run:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
- File paths in Windows use backslashes (`\`) but npm and Vite both understand forward slashes (`/`).

### macOS

- You may need **Xcode Command Line Tools** if you see errors about missing build tools:
  ```bash
  xcode-select --install
  ```
- If `npm` is not found after installing Node.js, restart your terminal. If it still fails, try installing Node.js via [nvm](https://github.com/nvm-sh/nvm).

### Linux

- You may need to prefix some install commands with `sudo` when using a system package manager.
- Recommended: Install Node.js via **nvm** (no root access required):
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  # Restart your terminal, then:
  nvm install --lts
  nvm use --lts
  ```

### Line Endings (Windows only)

If Git shows warnings about `CRLF` vs `LF` line endings, run this once to silence them:
```bash
git config --global core.autocrlf true
```

---

## Quick Reference Commands

| Task | Command |
|---|---|
| Install dependencies | `npm install` |
| Start dev server | `npm run dev` |
| Open in browser | `http://localhost:5173` |
| Stop the server | `Ctrl+C` in terminal |
| Build for production | `npm run build` |
| Preview production build | `npm run preview` |

---

> **No backend required.** EventMate runs entirely in the browser using mock data in `src/data/`. There is no database or server to set up — everything is powered by the React frontend.
