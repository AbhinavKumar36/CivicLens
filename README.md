# CivicLens AI Operating System

![CivicLens Header](https://via.placeholder.com/1200x400/0b1326/8083ff?text=CivicLens+AI+OS)

CivicLens is a next-generation, AI-driven municipal operating system designed to bridge the gap between citizens, field workers, and city administration. Built with an absolute commitment to Google Stitch design principles, it delivers a stunning, accessible, and high-performance digital infrastructure for modern smart cities.

## 🌟 Key Features

### 🏛 Citizen & Community Hub
- **Services Directory**: Apply for building permits, trade licenses, and park reservations through dynamic wizard flows.
- **AI-Powered Issue Reporting**: Gone are the days of tedious forms. Speak or type to the native **Gemini AI**, which intelligently parses conversational context into strict JSON payloads for instant dispatch.
- **Interactive Map Dashboard**: A real-time, interactive Leaflet map rendering active incidents, worker locations, and infrastructure statuses across the city grid.

### 📊 Administrative & Worker Platforms
- **Universal Profile System**: A dynamically adapting profile view that simplifies the interface for Operators and Workers while displaying detailed civic metrics for Citizens.
- **Admin Control Center**: Comprehensive operational overview powered by animated `recharts` data visualizations, tracking department performance, ward comparisons, and citizen satisfaction.
- **Field Worker View**: A mobile-optimized interface for on-the-ground technicians to manage priority tasks and location-based agendas.
- **Emergency Response Center**: A striking, high-visibility dashboard for monitoring active crises, dispatching responders, and broadcasting SOS alerts.

### 🧠 Cutting-Edge Architecture
- **Global Voice Navigation**: Powered by the Web Speech API. Press `Ctrl+M` to activate the microphone and navigate the OS hands-free (e.g., "Go to Dashboard", "Report an issue").
- **WCAG AA Accessibility Engine**: A dedicated settings context allowing users to seamlessly toggle High Contrast (WCAG AAA), Large Text (Dynamic Scaling), and Reduced Motion settings globally.
- **Dynamic Theming**: An intricate CSS variable architecture supporting Light, Dark, and System modes with local storage persistence and a synchronous zero-flash initialization script.

### 🤖 AI Capabilities
CivicLens leverages state-of-the-art Google Gemini integration to provide an unprecedented civic experience:
- **Conversational Civic Assistant**: Engage in open-ended dialogue to find services or track issues.
- **Robust Fallback Mechanism**: The AI engine ensures 100% uptime by seamlessly cascading from `gemini-3.5-flash` to `gemini-2.5-flash`, and finally to an offline simulated mock session if network connections fail.
- **Hyper-Local Context Awareness**: The AI dynamically integrates browser geolocation to provide context-aware responses when you ask location-specific questions.
- **Natural-Language Complaint Reporting**: Describe your issue naturally without wrestling with complex forms.
- **Image-Based Issue Classification**: AI automatically interprets uploaded imagery to aid in diagnosis, with built-in fallbacks.
- **Voice Interaction**: Tap the mic button to speak directly to the AI. Fully functional Web Speech API integration translates spoken words into actionable text.
- **Department Recommendation**: The AI autonomously assigns incoming reports to the correct municipal department.
- **Priority Estimation**: Instant algorithmic triage assigns severity and priority levels based on urgency.
- **Government Service Guidance**: The assistant guides citizens through complex bureaucratic processes.

### 🇮🇳 Culturally Localized
- **Personas & Mock Data**: Default user profiles and mock data have been thoughtfully localized with Indian names (e.g., Priya Sharma as the Global Mock User, Rahul Verma) and relevant avatars to make the demonstration more relatable to local civic bodies.
- **Branding**: Fully customized with project-specific logos and favicons embedded across the Landing Page, Auth Flows, and Sidebar.

---

## 🏗 Technology Stack

### Frontend (Client)
- **Framework**: React 18 / Vite
- **Routing**: React Router v6 (Lazy-loaded chunks for extreme performance)
- **Styling**: Tailwind CSS + Vanilla CSS Variables
- **Animations**: Framer Motion
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Maps & Charts**: Leaflet (OpenStreetMap) + Recharts
- **AI Integration**: `@google/generative-ai` (Gemini)

### Backend (Server)
- **Framework**: Node.js / Express
- **Database**: SQLite (`better-sqlite3`)
- **API Simulation**: Built-in latency injection for realistic testing

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A Google Gemini API Key

### 1. Project Setup

The project runs both the frontend and the mock backend concurrently from the root directory.

```bash
npm install

# Create environment file
echo VITE_GEMINI_API_KEY=your_api_key_here > .env

# Seed the database with realistic mock data
node seed.js

# Start the development server (runs both Vite and Express)
npm run dev
```
> The frontend application will now be running at `http://localhost:5173`.
> The mock API server runs simultaneously on port 3000.

---

## 📦 Production Deployment

This application is fully optimized for production environments like **Vercel**.

1. **Code Splitting**: The application utilizes `React.lazy()` and Suspense boundaries to split massive route components (like the Map and Admin dashboards) into isolated JavaScript chunks, dropping the core bundle payload to ~140kB.
2. **SPA Routing**: A `vercel.json` configuration file is included in the frontend root to intercept deep links and correctly route them to `index.html`.

To deploy, simply push the repository to GitHub and link it to your Vercel dashboard. The build command `npm run build` is pre-configured to execute a strict Vite compilation.

---

## 🛡 Accessibility (A11y)

CivicLens is deeply committed to universal access:
- Semantic HTML5 elements (`<nav>`, `<main>`, `<aside>`) and ARIA roles (`role="navigation"`, `aria-label`).
- Explicit `:focus-visible` outline rings for pristine keyboard (Tab) navigation.
- A dedicated User Settings portal to override colors, text sizing, and vestibular-triggering animations.

---

## 👨‍💻 Creator
**Abhinav Kumar**
*Lead Architect & Full-Stack Developer*
The driving engineering force behind CivicLens. Abhinav spearheaded the entire architecture, UI/UX design, and full-stack AI implementation—crafting a seamless interface and robust smart city ecosystem from the ground up.

- **Email**: [itsabhinav36@gmail.com](mailto:itsabhinav36@gmail.com)
- **LinkedIn**: [Abhinav Kumar](https://www.linkedin.com/in/abhinav-kumar-b4b993382/)
- **GitHub**: [AbhinavKumar36](https://github.com/AbhinavKumar36)

---
*Built as a conceptual demonstration of advanced Agentic Coding and AI-driven municipal infrastructure.*
