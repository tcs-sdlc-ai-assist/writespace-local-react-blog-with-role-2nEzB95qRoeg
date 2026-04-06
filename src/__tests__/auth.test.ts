import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSession,
  setSession,
  clearSession,
  login,
  register,
} from '../utils/auth';
import { getUsers, saveUsers } from '../utils/storage';
import type { Session, User } from '../utils/types';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('getSession', () => {
  it('should return null when no session exists', () => {
    const session = getSession();
    expect(session).toBeNull();
  });

  it('should return a valid session when one exists', () => {
    const mockSession: Session = {
      userId: 'u1',
      username: 'alice',
      displayName: 'Alice',
      role: 'user',
    };
    localStorage.setItem('writespace_session', JSON.stringify(mockSession));

    const session = getSession();
    expect(session).toEqual(mockSession);
  });

  it('should return null when localStorage contains invalid JSON', () => {
    localStorage.setItem('writespace_session', 'not valid json{{{');

    const session = getSession();
    expect(session).toBeNull();
  });

  it('should return null when session object is missing required fields', () => {
    localStorage.setItem(
      'writespace_session',
      JSON.stringify({ userId: 'u1' })
    );

    const session = getSession();
    expect(session).toBeNull();
  });

  it('should return null when session has invalid role', () => {
    localStorage.setItem(
      'writespace_session',
      JSON.stringify({
        userId: 'u1',
        username: 'alice',
        displayName: 'Alice',
        role: 'superadmin',
      })
    );

    const session = getSession();
    expect(session).toBeNull();
  });

  it('should return null when localStorage.getItem throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage error');
    });

    const session = getSession();
    expect(session).toBeNull();
  });

  it('should return a valid admin session', () => {
    const adminSession: Session = {
      userId: 'admin',
      username: 'admin',
      displayName: 'Admin',
      role: 'admin',
    };
    localStorage.setItem('writespace_session', JSON.stringify(adminSession));

    const session = getSession();
    expect(session).toEqual(adminSession);
    expect(session!.role).toBe('admin');
  });
});

describe('setSession', () => {
  it('should save a session to localStorage', () => {
    const mockSession: Session = {
      userId: 'u1',
      username: 'alice',
      displayName: 'Alice',
      role: 'user',
    };

    setSession(mockSession);

    const raw = localStorage.getItem('writespace_session');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toEqual(mockSession);
  });

  it('should overwrite an existing session', () => {
    const oldSession: Session = {
      userId: 'u1',
      username: 'alice',
      displayName: 'Alice',
      role: 'user',
    };
    setSession(oldSession);

    const newSession: Session = {
      userId: 'u2',
      username: 'bob',
      displayName: 'Bob',
      role: 'user',
    };
    setSession(newSession);

    const session = getSession();
    expect(session).toEqual(newSession);
  });

  it('should not throw when localStorage.setItem throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage full');
    });

    const mockSession: Session = {
      userId: 'u1',
      username: 'alice',
      displayName: 'Alice',
      role: 'user',
    };

    expect(() => setSession(mockSession)).not.toThrow();
  });
});

describe('clearSession', () => {
  it('should remove the session from localStorage', () => {
    const mockSession: Session = {
      userId: 'u1',
      username: 'alice',
      displayName: 'Alice',
      role: 'user',
    };
    setSession(mockSession);

    clearSession();

    const session = getSession();
    expect(session).toBeNull();
    expect(localStorage.getItem('writespace_session')).toBeNull();
  });

  it('should not throw when no session exists', () => {
    expect(() => clearSession()).not.toThrow();
  });

  it('should not throw when localStorage.removeItem throws', () => {
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('Storage error');
    });

    expect(() => clearSession()).not.toThrow();
  });
});

describe('login', () => {
  it('should login with hard-coded admin credentials', () => {
    const session = login('admin', 'admin123');

    expect(session).not.toBeNull();
    expect(session!.userId).toBe('admin');
    expect(session!.username).toBe('admin');
    expect(session!.displayName).toBe('Admin');
    expect(session!.role).toBe('admin');
  });

  it('should set session on successful admin login', () => {
    login('admin', 'admin123');

    const session = getSession();
    expect(session).not.toBeNull();
    expect(session!.role).toBe('admin');
  });

  it('should return null for wrong admin password', () => {
    const session = login('admin', 'wrongpassword');
    expect(session).toBeNull();
  });

  it('should login with valid user credentials', () => {
    const mockUsers: User[] = [
      {
        id: 'u1',
        displayName: 'Alice',
        username: 'alice',
        password: 'pass123',
        role: 'user',
        createdAt: '2024-06-01T12:00:00.000Z',
      },
    ];
    saveUsers(mockUsers);

    const session = login('alice', 'pass123');

    expect(session).not.toBeNull();
    expect(session!.userId).toBe('u1');
    expect(session!.username).toBe('alice');
    expect(session!.displayName).toBe('Alice');
    expect(session!.role).toBe('user');
  });

  it('should set session on successful user login', () => {
    const mockUsers: User[] = [
      {
        id: 'u1',
        displayName: 'Alice',
        username: 'alice',
        password: 'pass123',
        role: 'user',
        createdAt: '2024-06-01T12:00:00.000Z',
      },
    ];
    saveUsers(mockUsers);

    login('alice', 'pass123');

    const session = getSession();
    expect(session).not.toBeNull();
    expect(session!.userId).toBe('u1');
  });

  it('should return null for invalid username', () => {
    const session = login('nonexistent', 'pass123');
    expect(session).toBeNull();
  });

  it('should return null for wrong user password', () => {
    const mockUsers: User[] = [
      {
        id: 'u1',
        displayName: 'Alice',
        username: 'alice',
        password: 'pass123',
        role: 'user',
        createdAt: '2024-06-01T12:00:00.000Z',
      },
    ];
    saveUsers(mockUsers);

    const session = login('alice', 'wrongpassword');
    expect(session).toBeNull();
  });

  it('should login with case-insensitive username for users', () => {
    const mockUsers: User[] = [
      {
        id: 'u1',
        displayName: 'Alice',
        username: 'alice',
        password: 'pass123',
        role: 'user',
        createdAt: '2024-06-01T12:00:00.000Z',
      },
    ];
    saveUsers(mockUsers);

    const session = login('Alice', 'pass123');

    expect(session).not.toBeNull();
    expect(session!.userId).toBe('u1');
  });

  it('should always allow admin login regardless of localStorage state', () => {
    // Even with corrupted or missing user data, admin login should work
    localStorage.setItem('writespace_users', 'corrupted data{{{');

    const session = login('admin', 'admin123');

    expect(session).not.toBeNull();
    expect(session!.userId).toBe('admin');
    expect(session!.role).toBe('admin');
  });

  it('should allow admin login even when localStorage.getItem throws for users', () => {
    const originalGetItem = Storage.prototype.getItem;
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => {
      if (key === 'writespace_users') {
        throw new Error('Storage error');
      }
      return originalGetItem.call(localStorage, key);
    });

    const session = login('admin', 'admin123');

    expect(session).not.toBeNull();
    expect(session!.userId).toBe('admin');
    expect(session!.role).toBe('admin');
  });
});

describe('register', () => {
  it('should register a new user successfully', () => {
    const result = register('Alice', 'alice', 'pass123');

    expect(result.success).toBe(true);
    expect(result.session).toBeDefined();
    expect(result.session!.username).toBe('alice');
    expect(result.session!.displayName).toBe('Alice');
    expect(result.session!.role).toBe('user');
  });

  it('should set session on successful registration', () => {
    register('Alice', 'alice', 'pass123');

    const session = getSession();
    expect(session).not.toBeNull();
    expect(session!.username).toBe('alice');
    expect(session!.displayName).toBe('Alice');
    expect(session!.role).toBe('user');
  });

  it('should persist the new user to localStorage', () => {
    register('Alice', 'alice', 'pass123');

    const users = getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].username).toBe('alice');
    expect(users[0].displayName).toBe('Alice');
    expect(users[0].password).toBe('pass123');
    expect(users[0].role).toBe('user');
  });

  it('should return error for duplicate username', () => {
    register('Alice', 'alice', 'pass123');

    const result = register('Alice 2', 'alice', 'pass456');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Username is already taken.');
  });

  it('should return error for duplicate username case-insensitive', () => {
    register('Alice', 'alice', 'pass123');

    const result = register('Alice 2', 'Alice', 'pass456');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Username is already taken.');
  });

  it('should return error when trying to register with admin username', () => {
    const result = register('Admin User', 'admin', 'pass123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Username is already taken.');
  });

  it('should return error for empty display name', () => {
    const result = register('', 'alice', 'pass123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('All fields are required.');
  });

  it('should return error for empty username', () => {
    const result = register('Alice', '', 'pass123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('All fields are required.');
  });

  it('should return error for empty password', () => {
    const result = register('Alice', 'alice', '');

    expect(result.success).toBe(false);
    expect(result.error).toBe('All fields are required.');
  });

  it('should return error for whitespace-only fields', () => {
    const result = register('   ', 'alice', 'pass123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('All fields are required.');
  });

  it('should trim display name and username on registration', () => {
    const result = register('  Alice  ', '  alice  ', 'pass123');

    expect(result.success).toBe(true);
    expect(result.session!.displayName).toBe('Alice');
    expect(result.session!.username).toBe('alice');

    const users = getUsers();
    expect(users[0].displayName).toBe('Alice');
    expect(users[0].username).toBe('alice');
  });

  it('should generate a unique user id', () => {
    const result1 = register('Alice', 'alice', 'pass123');
    const result2 = register('Bob', 'bob', 'pass456');

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    expect(result1.session!.userId).not.toBe(result2.session!.userId);
  });

  it('should assign user role to registered users', () => {
    const result = register('Alice', 'alice', 'pass123');

    expect(result.success).toBe(true);
    expect(result.session!.role).toBe('user');

    const users = getUsers();
    expect(users[0].role).toBe('user');
  });
});