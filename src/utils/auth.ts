import type { Session } from './types';
import { getUsers, createUser } from './storage';

const SESSION_KEY = 'writespace_session';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_SESSION: Session = {
  userId: 'admin',
  username: 'admin',
  displayName: 'Admin',
  role: 'admin',
};

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.userId === 'string' &&
      typeof parsed.username === 'string' &&
      typeof parsed.displayName === 'string' &&
      (parsed.role === 'admin' || parsed.role === 'user')
    ) {
      return parsed as Session;
    }
    return null;
  } catch {
    return null;
  }
}

export function setSession(session: Session): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // localStorage may be full or unavailable; silently fail
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // silently fail
  }
}

export function login(username: string, password: string): Session | null {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    setSession(ADMIN_SESSION);
    return ADMIN_SESSION;
  }

  const users = getUsers();
  const found = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );

  if (!found) return null;

  const session: Session = {
    userId: found.id,
    username: found.username,
    displayName: found.displayName,
    role: found.role,
  };

  setSession(session);
  return session;
}

export function register(
  displayName: string,
  username: string,
  password: string
): { success: boolean; error?: string; session?: Session } {
  if (!displayName.trim() || !username.trim() || !password.trim()) {
    return { success: false, error: 'All fields are required.' };
  }

  if (username.toLowerCase() === ADMIN_USERNAME) {
    return { success: false, error: 'Username is already taken.' };
  }

  const users = getUsers();
  const exists = users.some(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase()
  );

  if (exists) {
    return { success: false, error: 'Username is already taken.' };
  }

  const newUser = createUser({
    displayName: displayName.trim(),
    username: username.trim(),
    password,
    role: 'user',
  });

  const session: Session = {
    userId: newUser.id,
    username: newUser.username,
    displayName: newUser.displayName,
    role: newUser.role,
  };

  setSession(session);
  return { success: true, session };
}