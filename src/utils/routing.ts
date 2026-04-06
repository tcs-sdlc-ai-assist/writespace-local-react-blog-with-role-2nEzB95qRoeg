import type { UserRole } from './types';

interface RouteDefinition {
  component: string;
  access: 'guest' | 'user' | 'admin';
}

interface RouteAccess {
  requiresAuth: boolean;
  requiredRole?: UserRole;
}

export const routeMap: Record<string, RouteDefinition> = {
  '/': {
    component: 'LandingPage',
    access: 'guest',
  },
  '/login': {
    component: 'LoginPage',
    access: 'guest',
  },
  '/register': {
    component: 'RegisterPage',
    access: 'guest',
  },
  '/blogs': {
    component: 'Home',
    access: 'user',
  },
  '/write': {
    component: 'WriteBlog',
    access: 'user',
  },
  '/edit/:id': {
    component: 'WriteBlog',
    access: 'user',
  },
  '/blog/:id': {
    component: 'ReadBlog',
    access: 'user',
  },
  '/admin': {
    component: 'AdminDashboard',
    access: 'admin',
  },
  '/users': {
    component: 'UserManagement',
    access: 'admin',
  },
};

export function getRouteAccess(path: string): RouteAccess {
  const route = routeMap[path];

  if (!route) {
    // Try matching parameterized routes
    for (const [pattern, def] of Object.entries(routeMap)) {
      if (pattern.includes(':')) {
        const regex = new RegExp(
          '^' + pattern.replace(/:[^/]+/g, '[^/]+') + '$'
        );
        if (regex.test(path)) {
          return mapAccessToRouteAccess(def.access);
        }
      }
    }
    // Default: require auth for unknown routes
    return { requiresAuth: true };
  }

  return mapAccessToRouteAccess(route.access);
}

function mapAccessToRouteAccess(access: 'guest' | 'user' | 'admin'): RouteAccess {
  switch (access) {
    case 'guest':
      return { requiresAuth: false };
    case 'user':
      return { requiresAuth: true };
    case 'admin':
      return { requiresAuth: true, requiredRole: 'admin' };
  }
}