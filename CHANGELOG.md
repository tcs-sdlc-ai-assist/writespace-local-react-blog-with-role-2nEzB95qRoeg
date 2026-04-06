# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-06-01

### Added

- **Public Landing Page** — welcoming hero section with gradient background, feature highlights (Write & Publish, Role-Based Access, Local Persistence), latest posts preview, and responsive footer with navigation links.
- **Authentication System** — login and registration pages with form validation, session management via `localStorage`, and hard-coded admin credentials (`admin` / `admin123`).
- **Role-Based Access Control** — `ProtectedRoute` component enforcing authentication and role checks; admin-only routes redirect unauthorized users to `/blogs`, unauthenticated users redirect to `/login`.
- **Blog CRUD with Ownership Enforcement** — create, read, update, and delete blog posts; regular users can only edit and delete their own posts; admins can edit and delete any post.
- **Admin Dashboard** — statistics overview (total posts, total users, admin count, regular user count) using `StatCard` components, recent posts table with edit and delete actions, and quick action links.
- **User Management Panel** — admin-only page to create new user accounts, view all registered users in a responsive table/card layout, and delete users along with their associated posts.
- **localStorage Persistence** — all data (users, posts, sessions) stored in the browser using `localStorage` with keys `writespace_users`, `writespace_posts`, and `writespace_session`; graceful error handling for storage failures.
- **Responsive Tailwind CSS UI** — fully responsive design using Tailwind CSS utility classes with custom color palette (primary, secondary, accent, admin, user, surface, success, danger, warning), gradient backgrounds, card shadows, and smooth animations (fade-in, slide-up, slide-down).
- **Avatar System** — role-based avatar display using emoji indicators (👑 for admins, 📚 for regular users) with color-coded backgrounds.
- **Navigation Components** — authenticated `Navbar` with desktop and mobile responsive menu, profile dropdown with logout; public `PublicNavbar` with session-aware links.
- **Vercel SPA Deployment Configuration** — `vercel.json` with SPA rewrite rules to support client-side routing.
- **Test Suite** — unit tests for authentication utilities (`getSession`, `setSession`, `clearSession`, `login`, `register`), storage utilities (`getPosts`, `savePosts`, `getUsers`, `saveUsers`, `createPost`, `updatePost`, `deletePost`, `createUser`, `deleteUser`), and `ProtectedRoute` component covering happy paths, error cases, and edge cases.