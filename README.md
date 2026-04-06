# WriteSpace

A clean, modern blogging platform built with React 18, TypeScript, and Vite. Write, share, and manage blog posts — all from your browser with no backend required.

## Features

- **Public Landing Page** — Hero section with gradient background, feature highlights, latest posts preview, and responsive footer
- **Authentication System** — Login and registration with form validation, session management via `localStorage`, and hard-coded admin credentials
- **Role-Based Access Control** — Admin and regular user roles with route protection and ownership enforcement
- **Blog CRUD** — Create, read, update, and delete blog posts; regular users manage their own posts, admins manage all
- **Admin Dashboard** — Statistics overview, recent posts table, and quick action links
- **User Management** — Admin-only panel to create, view, and delete user accounts (with cascading post deletion)
- **Responsive Design** — Fully responsive UI with Tailwind CSS, custom color palette, gradient backgrounds, and smooth animations
- **Offline-First** — All data persisted in `localStorage` with graceful error handling for storage failures

## Tech Stack

| Technology | Purpose |
| --- | --- |
| [React 18](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first CSS framework |
| [React Router v6](https://reactrouter.com/) | Client-side routing |
| [Vitest](https://vitest.dev/) | Unit testing framework |
| [Testing Library](https://testing-library.com/) | Component testing utilities |
| `localStorage` | Client-side data persistence |

## Folder Structure

```
writespace/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS theme and extensions
├── postcss.config.cjs          # PostCSS plugins
├── vite.config.ts              # Vite build configuration
├── vitest.config.ts            # Vitest test configuration
├── vercel.json                 # Vercel SPA rewrite rules
├── src/
│   ├── main.tsx                # React DOM entry point
│   ├── App.tsx                 # Router and route definitions
│   ├── index.css               # Tailwind directives
│   ├── vite-env.d.ts           # Vite type declarations
│   ├── components/
│   │   ├── Avatar.tsx          # Role-based avatar display
│   │   ├── BlogCard.tsx        # Blog post card component
│   │   ├── Navbar.tsx          # Authenticated navigation bar
│   │   ├── ProtectedRoute.tsx  # Auth and role guard component
│   │   ├── PublicNavbar.tsx    # Public navigation bar
│   │   ├── StatCard.tsx        # Dashboard statistics card
│   │   └── UserRow.tsx         # User list row/card component
│   ├── pages/
│   │   ├── AdminDashboard.tsx  # Admin overview page
│   │   ├── Home.tsx            # Blog listing page
│   │   ├── LandingPage.tsx     # Public landing page
│   │   ├── LoginPage.tsx       # Login form page
│   │   ├── ReadBlog.tsx        # Single blog post view
│   │   ├── RegisterPage.tsx    # Registration form page
│   │   ├── UserManagement.tsx  # Admin user management page
│   │   └── WriteBlog.tsx       # Create/edit blog post page
│   ├── utils/
│   │   ├── auth.ts             # Authentication logic
│   │   ├── routing.ts          # Route definitions and access mapping
│   │   ├── storage.ts          # localStorage CRUD operations
│   │   └── types.ts            # TypeScript type definitions
│   └── __tests__/
│       ├── setup.ts            # Test setup (jest-dom)
│       ├── auth.test.ts        # Auth utility tests
│       ├── storage.test.ts     # Storage utility tests
│       └── ProtectedRoute.test.tsx  # Route guard tests
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later (included with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/writespace.git
cd writespace

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

## Available Scripts

| Script | Command | Description |
| --- | --- | --- |
| `dev` | `npm run dev` | Start Vite dev server with HMR |
| `build` | `npm run build` | Type-check with `tsc` and build for production |
| `preview` | `npm run preview` | Preview the production build locally |
| `test` | `npm run test` | Run all tests once with Vitest |
| `test:watch` | `npm run test:watch` | Run tests in watch mode |

## Route Map

| Path | Component | Access Level | Description |
| --- | --- | --- | --- |
| `/` | `LandingPage` | Public | Welcome page with features and latest posts |
| `/login` | `LoginPage` | Public | User login form |
| `/register` | `RegisterPage` | Public | User registration form |
| `/blogs` | `Home` | Authenticated | All blog posts listing |
| `/write` | `WriteBlog` | Authenticated | Create a new blog post |
| `/edit/:id` | `WriteBlog` | Authenticated | Edit an existing blog post (owner or admin) |
| `/blog/:id` | `ReadBlog` | Authenticated | Read a single blog post |
| `/admin` | `AdminDashboard` | Admin only | Platform statistics and recent posts |
| `/users` | `UserManagement` | Admin only | Create and manage user accounts |

Unauthenticated users are redirected to `/login`. Non-admin users accessing admin routes are redirected to `/blogs`.

## Default Admin Credentials

The application includes a hard-coded admin account for immediate access:

| Field | Value |
| --- | --- |
| Username | `admin` |
| Password | `admin123` |

The admin account always works regardless of `localStorage` state and cannot be deleted through the UI.

## localStorage Schema

All application data is stored in the browser's `localStorage` under the following keys:

### `writespace_session`

```json
{
  "userId": "string",
  "username": "string",
  "displayName": "string",
  "role": "admin | user"
}
```

### `writespace_posts`

```json
[
  {
    "id": "string (UUID)",
    "title": "string",
    "content": "string",
    "createdAt": "string (ISO 8601)",
    "authorId": "string",
    "authorName": "string"
  }
]
```

### `writespace_users`

```json
[
  {
    "id": "string (UUID)",
    "displayName": "string",
    "username": "string",
    "password": "string (plain text)",
    "role": "admin | user",
    "createdAt": "string (ISO 8601)"
  }
]
```

## Design Decisions

- **No Backend** — All data lives in `localStorage` to keep the project self-contained and deployable as a static site. No server, database, or API keys required.
- **Hard-Coded Admin** — A built-in admin account (`admin` / `admin123`) ensures there is always a way to access admin features, even on a fresh browser with no stored data.
- **Role-Based Access** — The `ProtectedRoute` component checks session data on every render, enforcing authentication and role requirements at the routing level.
- **Ownership Enforcement** — Regular users can only edit and delete their own posts. Admins can manage all content and users.
- **Tailwind CSS** — Utility-first styling with a custom theme (primary, secondary, accent, admin, user, surface, success, danger, warning) for consistent design tokens across the application.
- **Graceful Storage Failures** — All `localStorage` read/write operations are wrapped in try-catch blocks. If storage is full or unavailable, the application silently degrades rather than crashing.
- **Case-Insensitive Usernames** — Login and registration compare usernames in lowercase to prevent duplicate accounts with different casing.

## Known Limitations

- **No Backend / No Data Sharing** — Data is stored per-browser, per-device. Users on different browsers or devices cannot see each other's data.
- **Plain-Text Passwords** — Passwords are stored as plain text in `localStorage`. This is acceptable for a demo/MVP but not suitable for production use with real credentials.
- **Client-Side Only Security** — Authentication and authorization are enforced entirely in the browser. A knowledgeable user could modify `localStorage` directly to bypass access controls.
- **Storage Limits** — Browsers typically provide 5–10 MB of `localStorage` per origin. This is sufficient for hundreds of posts but not unlimited content.
- **No Data Recovery** — Clearing browser data, cookies, or site storage permanently deletes all application data.
- **No Rich Text Editor** — Blog content is plain text only. There is no markdown rendering or WYSIWYG editing.
- **Single-User Experience** — The platform is designed as a single-user or demo experience per browser instance.

## Deployment

WriteSpace is configured for deployment on [Vercel](https://vercel.com) as a static SPA. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

Quick deploy:

```bash
npm run build
npx vercel --prod
```

The included `vercel.json` configures SPA rewrites so all routes are handled by React Router.

## License

This project is private and proprietary. All rights reserved.