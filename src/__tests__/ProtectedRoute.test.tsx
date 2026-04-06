import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import type { Session } from '../utils/types';

const SESSION_KEY = 'writespace_session';

function renderWithRouter(
  initialPath: string,
  element: JSX.Element
) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/blogs" element={<div>Blogs Page</div>} />
        <Route path="/protected" element={element} />
        <Route path="/admin" element={element} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('ProtectedRoute', () => {
  describe('unauthenticated users', () => {
    it('should redirect to /login when no session exists', () => {
      renderWithRouter(
        '/protected',
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should redirect to /login when session is invalid JSON', () => {
      localStorage.setItem(SESSION_KEY, 'not valid json{{{');

      renderWithRouter(
        '/protected',
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should redirect to /login when session is missing required fields', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: 'u1' }));

      renderWithRouter(
        '/protected',
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should redirect to /login when session has invalid role', () => {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          userId: 'u1',
          username: 'alice',
          displayName: 'Alice',
          role: 'superadmin',
        })
      );

      renderWithRouter(
        '/protected',
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should redirect to /login when localStorage throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      renderWithRouter(
        '/protected',
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('authenticated regular users', () => {
    const userSession: Session = {
      userId: 'u1',
      username: 'alice',
      displayName: 'Alice',
      role: 'user',
    };

    it('should render protected content for authenticated user', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify(userSession));

      renderWithRouter(
        '/protected',
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });

    it('should redirect non-admin user to /blogs when role="admin" is required', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify(userSession));

      renderWithRouter(
        '/admin',
        <ProtectedRoute role="admin">
          <div>Admin Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });

    it('should render content when no role prop is specified', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify(userSession));

      renderWithRouter(
        '/protected',
        <ProtectedRoute>
          <div>User Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('User Content')).toBeInTheDocument();
    });
  });

  describe('authenticated admin users', () => {
    const adminSession: Session = {
      userId: 'admin',
      username: 'admin',
      displayName: 'Admin',
      role: 'admin',
    };

    it('should render admin content for admin user when role="admin"', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify(adminSession));

      renderWithRouter(
        '/admin',
        <ProtectedRoute role="admin">
          <div>Admin Dashboard</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
      expect(screen.queryByText('Blogs Page')).not.toBeInTheDocument();
    });

    it('should render protected content for admin user without role prop', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify(adminSession));

      renderWithRouter(
        '/protected',
        <ProtectedRoute>
          <div>General Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('General Protected Content')).toBeInTheDocument();
    });

    it('should allow admin to access user-level routes', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify(adminSession));

      renderWithRouter(
        '/protected',
        <ProtectedRoute>
          <div>User Level Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('User Level Content')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should render children when session exists and no role restriction', () => {
      const session: Session = {
        userId: 'u2',
        username: 'bob',
        displayName: 'Bob',
        role: 'user',
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));

      renderWithRouter(
        '/protected',
        <ProtectedRoute>
          <div>
            <h1>Title</h1>
            <p>Paragraph</p>
          </div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
    });

    it('should redirect unauthenticated user even for admin routes', () => {
      renderWithRouter(
        '/admin',
        <ProtectedRoute role="admin">
          <div>Admin Only</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Admin Only')).not.toBeInTheDocument();
    });
  });
});