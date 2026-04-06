# Deployment Guide

This guide covers deploying **WriteSpace** to [Vercel](https://vercel.com) as a static single-page application (SPA).

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Configuration](#build-configuration)
- [Vercel SPA Rewrite Configuration](#vercel-spa-rewrite-configuration)
- [Deploy via GitHub Integration](#deploy-via-github-integration)
- [Deploy via Vercel CLI](#deploy-via-vercel-cli)
- [Local Preview](#local-preview)
- [Environment Variables](#environment-variables)
- [localStorage Limitations in Production](#localstorage-limitations-in-production)

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later (included with Node.js)
- A [Vercel](https://vercel.com) account (free tier is sufficient)
- (Optional) [Vercel CLI](https://vercel.com/docs/cli) installed globally:

```bash
npm install -g vercel
```

---

## Build Configuration

WriteSpace uses **Vite** with **TypeScript** and **React 18**. The build process compiles TypeScript and bundles the application into static assets.

| Setting          | Value            |
| ---------------- | ---------------- |
| Build Command    | `npm run build`  |
| Output Directory | `dist`           |
| Install Command  | `npm install`    |
| Framework Preset | Vite             |

To build locally:

```bash
npm install
npm run build
```

This runs `tsc && vite build`, which:

1. Type-checks all TypeScript files with `tsc`
2. Bundles the application into the `dist/` directory with Vite

---

## Vercel SPA Rewrite Configuration

WriteSpace uses client-side routing via `react-router-dom`. All routes (e.g., `/blogs`, `/admin`, `/blog/:id`) must be served by `index.html` so the React router can handle them.

The `vercel.json` file at the project root configures this:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures that any URL path returns `index.html`, allowing React Router's `<BrowserRouter>` to resolve the correct page component. **Do not remove or modify this file** unless you change the routing strategy.

---

## Deploy via GitHub Integration

This is the recommended approach for continuous deployment.

### Steps

1. **Push your code to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/writespace.git
   git push -u origin main
   ```

2. **Connect to Vercel**

   - Go to [vercel.com/new](https://vercel.com/new)
   - Click **"Import Git Repository"**
   - Select your `writespace` repository from the list
   - If you don't see it, click **"Adjust GitHub App Permissions"** to grant Vercel access

3. **Configure Project Settings**

   Vercel should auto-detect the Vite framework. Verify the following settings:

   | Setting          | Value           |
   | ---------------- | --------------- |
   | Framework Preset | Vite            |
   | Build Command    | `npm run build` |
   | Output Directory | `dist`          |
   | Install Command  | `npm install`   |

4. **Deploy**

   - Click **"Deploy"**
   - Vercel will install dependencies, run the build, and deploy the `dist/` output
   - Once complete, you'll receive a production URL (e.g., `https://writespace-xxxx.vercel.app`)

5. **Automatic Deployments**

   After the initial setup, every push to the `main` branch will trigger a new production deployment automatically. Pull requests will generate preview deployments with unique URLs.

---

## Deploy via Vercel CLI

For manual deployments or CI/CD pipelines without GitHub integration.

### Steps

1. **Install the Vercel CLI** (if not already installed):

   ```bash
   npm install -g vercel
   ```

2. **Log in to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy a preview build**:

   ```bash
   vercel
   ```

   The CLI will prompt you to:
   - Link to an existing project or create a new one
   - Confirm the project settings (framework, build command, output directory)

   This creates a **preview deployment** with a unique URL.

4. **Deploy to production**:

   ```bash
   vercel --prod
   ```

   This deploys to your production domain.

5. **One-command build and deploy** (skipping prompts after initial setup):

   ```bash
   vercel --prod --yes
   ```

---

## Local Preview

To preview the production build locally before deploying:

```bash
# Build the project
npm run build

# Start a local preview server
npm run preview
```

This starts a local server (typically at `http://localhost:4173`) serving the `dist/` directory. The preview server behaves like a production environment, so you can verify:

- All routes work correctly with client-side navigation
- Static assets load properly
- The build output is correct

For development with hot module replacement, use:

```bash
npm run dev
```

This starts the Vite dev server (typically at `http://localhost:5173`) with instant updates on file changes.

---

## Environment Variables

**WriteSpace does not require any environment variables.**

All data is stored in the browser using `localStorage`. There is no backend server, no database connection, and no API keys to configure.

If you need to add environment variables in the future (e.g., for an analytics service), follow these conventions:

- Prefix all client-side variables with `VITE_` (e.g., `VITE_ANALYTICS_ID`)
- Access them in code via `import.meta.env.VITE_ANALYTICS_ID`
- Add them in Vercel under **Project Settings → Environment Variables**
- Add placeholder values to `.env.example` for documentation

---

## localStorage Limitations in Production

WriteSpace stores all data (users, posts, sessions) in the browser's `localStorage`. This is important to understand for production use:

### Data is Per-Browser, Per-Device

- Data stored on one browser or device is **not accessible** from another
- A user who creates posts on their laptop will not see those posts on their phone
- Different browsers on the same device have separate `localStorage` stores

### Storage Limits

- Most browsers provide **5–10 MB** of `localStorage` per origin
- This is sufficient for hundreds of blog posts but not unlimited content
- The application handles storage failures gracefully (silent failure on write errors)

### Data Persistence

- Data persists across page refreshes and browser restarts
- Data is **cleared** if the user clears their browser data, cookies, or site storage
- Private/incognito browsing sessions do not persist data after the window is closed

### No Data Sharing Between Users

- Since there is no backend, users cannot see each other's posts unless they are on the same browser with the same `localStorage`
- The application is designed as a **single-user or demo** experience per browser instance

### Security Considerations

- Passwords are stored in plain text in `localStorage` — this is acceptable for a demo/MVP but **not suitable for production applications handling real user credentials**
- The hard-coded admin credentials (`admin` / `admin123`) are visible in the source code
- `localStorage` data can be read and modified by any JavaScript running on the same origin

### Recommendations for Production Use

If you plan to use WriteSpace beyond a demo or prototype:

1. **Add a backend API** with a proper database for persistent, shared storage
2. **Hash passwords** using bcrypt or a similar algorithm
3. **Use HTTP-only cookies or JWTs** for session management instead of `localStorage`
4. **Implement HTTPS** (Vercel provides this by default)
5. **Remove hard-coded credentials** and use a proper user registration flow