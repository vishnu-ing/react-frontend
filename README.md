# Employee Portal

Repo Details
----
This project is an employee portal to manage the new-employee onboarding process. Employees can update personal information, upload required identification and work-authorization documents, and track housing assignments.

Tech Stack
----------
- Frontend: React (Vite)
- State: @reduxjs/toolkit, react-redux
- HTTP: axios
- UI: MUI (Material UI) and Tailwind CSS
- Build / Dev: Vite

Install

```bash
npm install
```

Run development server

```bash
npm run dev
```

Build for production

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

Linting

```bash
npm run lint
```

Notes on configuration
----------------------
- API base URL and any auth tokens should be configured using environment variables (e.g., a `.env` file) read by the app where appropriate.
- The axios interceptor in `src/api/auth.interceptor.js` centralizes auth header handling and token refresh logic.
