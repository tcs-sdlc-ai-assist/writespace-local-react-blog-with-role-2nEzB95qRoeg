import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getPosts,
  savePosts,
  getUsers,
  saveUsers,
  createPost,
  updatePost,
  deletePost,
  createUser,
  deleteUser,
} from '../utils/storage';
import type { Post, User } from '../utils/types';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('getPosts', () => {
  it('should return an empty array when localStorage has no posts', () => {
    const posts = getPosts();
    expect(posts).toEqual([]);
  });

  it('should return posts when localStorage has valid data', () => {
    const mockPosts: Post[] = [
      {
        id: 'p1',
        title: 'Test Post',
        content: 'Test content',
        createdAt: '2024-06-01T12:00:00.000Z',
        authorId: 'u1',
        authorName: 'Alice',
      },
    ];
    localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

    const posts = getPosts();
    expect(posts).toEqual(mockPosts);
    expect(posts).toHaveLength(1);
  });

  it('should return an empty array when localStorage contains invalid JSON', () => {
    localStorage.setItem('writespace_posts', 'not valid json{{{');

    const posts = getPosts();
    expect(posts).toEqual([]);
  });

  it('should return an empty array when localStorage contains a non-array value', () => {
    localStorage.setItem('writespace_posts', JSON.stringify({ foo: 'bar' }));

    const posts = getPosts();
    expect(posts).toEqual([]);
  });

  it('should return an empty array when localStorage.getItem throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage error');
    });

    const posts = getPosts();
    expect(posts).toEqual([]);
  });
});

describe('savePosts', () => {
  it('should save posts to localStorage', () => {
    const mockPosts: Post[] = [
      {
        id: 'p1',
        title: 'Test Post',
        content: 'Test content',
        createdAt: '2024-06-01T12:00:00.000Z',
        authorId: 'u1',
        authorName: 'Alice',
      },
    ];

    savePosts(mockPosts);

    const raw = localStorage.getItem('writespace_posts');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toEqual(mockPosts);
  });

  it('should overwrite existing posts', () => {
    const oldPosts: Post[] = [
      {
        id: 'p1',
        title: 'Old Post',
        content: 'Old content',
        createdAt: '2024-06-01T12:00:00.000Z',
        authorId: 'u1',
        authorName: 'Alice',
      },
    ];
    savePosts(oldPosts);

    const newPosts: Post[] = [
      {
        id: 'p2',
        title: 'New Post',
        content: 'New content',
        createdAt: '2024-06-02T12:00:00.000Z',
        authorId: 'u2',
        authorName: 'Bob',
      },
    ];
    savePosts(newPosts);

    const posts = getPosts();
    expect(posts).toEqual(newPosts);
    expect(posts).toHaveLength(1);
  });

  it('should not throw when localStorage.setItem throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage full');
    });

    expect(() => savePosts([])).not.toThrow();
  });
});

describe('getUsers', () => {
  it('should return an empty array when localStorage has no users', () => {
    const users = getUsers();
    expect(users).toEqual([]);
  });

  it('should return users when localStorage has valid data', () => {
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
    localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

    const users = getUsers();
    expect(users).toEqual(mockUsers);
    expect(users).toHaveLength(1);
  });

  it('should return an empty array when localStorage contains invalid JSON', () => {
    localStorage.setItem('writespace_users', '{{invalid}}');

    const users = getUsers();
    expect(users).toEqual([]);
  });

  it('should return an empty array when localStorage contains a non-array value', () => {
    localStorage.setItem('writespace_users', JSON.stringify('a string'));

    const users = getUsers();
    expect(users).toEqual([]);
  });

  it('should return an empty array when localStorage.getItem throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage error');
    });

    const users = getUsers();
    expect(users).toEqual([]);
  });
});

describe('saveUsers', () => {
  it('should save users to localStorage', () => {
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

    const raw = localStorage.getItem('writespace_users');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toEqual(mockUsers);
  });

  it('should not throw when localStorage.setItem throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage full');
    });

    expect(() => saveUsers([])).not.toThrow();
  });
});

describe('createPost', () => {
  it('should create a post with generated id and createdAt', () => {
    const post = createPost({
      title: 'My Post',
      content: 'Some content here',
      authorId: 'u1',
      authorName: 'Alice',
    });

    expect(post.title).toBe('My Post');
    expect(post.content).toBe('Some content here');
    expect(post.authorId).toBe('u1');
    expect(post.authorName).toBe('Alice');
    expect(typeof post.id).toBe('string');
    expect(post.id.length).toBeGreaterThan(0);
    expect(typeof post.createdAt).toBe('string');
    // Verify createdAt is a valid ISO string
    expect(new Date(post.createdAt).toISOString()).toBe(post.createdAt);
  });

  it('should prepend the new post to the posts array', () => {
    const existingPost: Post = {
      id: 'p-existing',
      title: 'Existing Post',
      content: 'Existing content',
      createdAt: '2024-06-01T12:00:00.000Z',
      authorId: 'u1',
      authorName: 'Alice',
    };
    savePosts([existingPost]);

    const newPost = createPost({
      title: 'New Post',
      content: 'New content',
      authorId: 'u2',
      authorName: 'Bob',
    });

    const posts = getPosts();
    expect(posts).toHaveLength(2);
    expect(posts[0].id).toBe(newPost.id);
    expect(posts[1].id).toBe('p-existing');
  });

  it('should generate unique IDs for multiple posts', () => {
    const post1 = createPost({
      title: 'Post 1',
      content: 'Content 1',
      authorId: 'u1',
      authorName: 'Alice',
    });

    const post2 = createPost({
      title: 'Post 2',
      content: 'Content 2',
      authorId: 'u1',
      authorName: 'Alice',
    });

    expect(post1.id).not.toBe(post2.id);
  });

  it('should persist the post to localStorage', () => {
    createPost({
      title: 'Persisted Post',
      content: 'Persisted content',
      authorId: 'u1',
      authorName: 'Alice',
    });

    const raw = localStorage.getItem('writespace_posts');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].title).toBe('Persisted Post');
  });
});

describe('updatePost', () => {
  it('should update an existing post by id', () => {
    const post = createPost({
      title: 'Original Title',
      content: 'Original content',
      authorId: 'u1',
      authorName: 'Alice',
    });

    const updated = updatePost(post.id, { title: 'Updated Title', content: 'Updated content' });

    expect(updated).not.toBeNull();
    expect(updated!.id).toBe(post.id);
    expect(updated!.title).toBe('Updated Title');
    expect(updated!.content).toBe('Updated content');
    expect(updated!.authorId).toBe('u1');
    expect(updated!.authorName).toBe('Alice');
  });

  it('should return null when post id does not exist', () => {
    const result = updatePost('nonexistent-id', { title: 'New Title' });
    expect(result).toBeNull();
  });

  it('should persist the update to localStorage', () => {
    const post = createPost({
      title: 'Original',
      content: 'Original content',
      authorId: 'u1',
      authorName: 'Alice',
    });

    updatePost(post.id, { title: 'Changed' });

    const posts = getPosts();
    const found = posts.find((p) => p.id === post.id);
    expect(found).toBeDefined();
    expect(found!.title).toBe('Changed');
  });

  it('should not change the post id even if updates include id', () => {
    const post = createPost({
      title: 'Test',
      content: 'Test content',
      authorId: 'u1',
      authorName: 'Alice',
    });

    const updated = updatePost(post.id, { id: 'hacked-id', title: 'New Title' } as Partial<Post>);

    expect(updated).not.toBeNull();
    expect(updated!.id).toBe(post.id);
  });

  it('should only update specified fields', () => {
    const post = createPost({
      title: 'Original Title',
      content: 'Original content',
      authorId: 'u1',
      authorName: 'Alice',
    });

    const updated = updatePost(post.id, { title: 'New Title' });

    expect(updated).not.toBeNull();
    expect(updated!.title).toBe('New Title');
    expect(updated!.content).toBe('Original content');
  });
});

describe('deletePost', () => {
  it('should delete a post by id', () => {
    const post = createPost({
      title: 'To Delete',
      content: 'Will be deleted',
      authorId: 'u1',
      authorName: 'Alice',
    });

    expect(getPosts()).toHaveLength(1);

    deletePost(post.id);

    expect(getPosts()).toHaveLength(0);
  });

  it('should not affect other posts when deleting', () => {
    const post1 = createPost({
      title: 'Post 1',
      content: 'Content 1',
      authorId: 'u1',
      authorName: 'Alice',
    });

    const post2 = createPost({
      title: 'Post 2',
      content: 'Content 2',
      authorId: 'u2',
      authorName: 'Bob',
    });

    deletePost(post1.id);

    const posts = getPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].id).toBe(post2.id);
  });

  it('should do nothing when deleting a nonexistent id', () => {
    createPost({
      title: 'Existing',
      content: 'Content',
      authorId: 'u1',
      authorName: 'Alice',
    });

    deletePost('nonexistent-id');

    expect(getPosts()).toHaveLength(1);
  });
});

describe('createUser', () => {
  it('should create a user with generated id and createdAt', () => {
    const user = createUser({
      displayName: 'Alice',
      username: 'alice',
      password: 'pass123',
      role: 'user',
    });

    expect(user.displayName).toBe('Alice');
    expect(user.username).toBe('alice');
    expect(user.password).toBe('pass123');
    expect(user.role).toBe('user');
    expect(typeof user.id).toBe('string');
    expect(user.id.length).toBeGreaterThan(0);
    expect(typeof user.createdAt).toBe('string');
    // Verify createdAt is a valid ISO string
    expect(new Date(user.createdAt).toISOString()).toBe(user.createdAt);
  });

  it('should append the new user to the users array', () => {
    const existingUser: User = {
      id: 'u-existing',
      displayName: 'Existing',
      username: 'existing',
      password: 'pass',
      role: 'user',
      createdAt: '2024-06-01T12:00:00.000Z',
    };
    saveUsers([existingUser]);

    const newUser = createUser({
      displayName: 'New User',
      username: 'newuser',
      password: 'pass456',
      role: 'user',
    });

    const users = getUsers();
    expect(users).toHaveLength(2);
    expect(users[0].id).toBe('u-existing');
    expect(users[1].id).toBe(newUser.id);
  });

  it('should generate unique IDs for multiple users', () => {
    const user1 = createUser({
      displayName: 'User 1',
      username: 'user1',
      password: 'pass1',
      role: 'user',
    });

    const user2 = createUser({
      displayName: 'User 2',
      username: 'user2',
      password: 'pass2',
      role: 'user',
    });

    expect(user1.id).not.toBe(user2.id);
  });

  it('should persist the user to localStorage', () => {
    createUser({
      displayName: 'Persisted User',
      username: 'persisted',
      password: 'pass',
      role: 'user',
    });

    const raw = localStorage.getItem('writespace_users');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].displayName).toBe('Persisted User');
  });
});

describe('deleteUser', () => {
  it('should delete a user by id', () => {
    const user = createUser({
      displayName: 'To Delete',
      username: 'todelete',
      password: 'pass',
      role: 'user',
    });

    expect(getUsers()).toHaveLength(1);

    deleteUser(user.id);

    expect(getUsers()).toHaveLength(0);
  });

  it('should not affect other users when deleting', () => {
    const user1 = createUser({
      displayName: 'User 1',
      username: 'user1',
      password: 'pass1',
      role: 'user',
    });

    const user2 = createUser({
      displayName: 'User 2',
      username: 'user2',
      password: 'pass2',
      role: 'user',
    });

    deleteUser(user1.id);

    const users = getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].id).toBe(user2.id);
  });

  it('should do nothing when deleting a nonexistent id', () => {
    createUser({
      displayName: 'Existing',
      username: 'existing',
      password: 'pass',
      role: 'user',
    });

    deleteUser('nonexistent-id');

    expect(getUsers()).toHaveLength(1);
  });
});