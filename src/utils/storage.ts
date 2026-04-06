import type { Post, User } from './types';

const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';

function generateId(): string {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function getPosts(): Post[] {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePosts(posts: Post[]): void {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch {
    // localStorage may be full or unavailable; silently fail
  }
}

export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // localStorage may be full or unavailable; silently fail
  }
}

export function createPost(post: Omit<Post, 'id' | 'createdAt'>): Post {
  const newPost: Post = {
    ...post,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  const posts = getPosts();
  posts.unshift(newPost);
  savePosts(posts);
  return newPost;
}

export function updatePost(id: string, updates: Partial<Post>): Post | null {
  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const updated: Post = { ...posts[index], ...updates, id: posts[index].id };
  posts[index] = updated;
  savePosts(posts);
  return updated;
}

export function deletePost(id: string): void {
  const posts = getPosts();
  const filtered = posts.filter((p) => p.id !== id);
  savePosts(filtered);
}

export function createUser(user: Omit<User, 'id' | 'createdAt'>): User {
  const newUser: User = {
    ...user,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  const users = getUsers();
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function deleteUser(id: string): void {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  saveUsers(filtered);
}