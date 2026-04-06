import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { UserRow } from '../components/UserRow';
import { getSession } from '../utils/auth';
import { getUsers, createUser, deleteUser, getPosts, deletePost } from '../utils/storage';
import type { User, Session } from '../utils/types';

export default function UserManagement(): JSX.Element {
  const session = getSession() as Session;

  const [users, setUsers] = useState<User[]>([]);
  const [displayName, setDisplayName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const resetForm = () => {
    setDisplayName('');
    setUsername('');
    setPassword('');
    setPassword2('');
  };

  const handleCreateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedPassword2 = password2.trim();

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword || !trimmedPassword2) {
      setError('All fields are required.');
      return;
    }

    if (trimmedDisplayName.length < 2) {
      setError('Display name must be at least 2 characters.');
      return;
    }

    if (trimmedUsername.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    if (trimmedPassword.length < 3) {
      setError('Password must be at least 3 characters.');
      return;
    }

    if (trimmedPassword !== trimmedPassword2) {
      setError('Passwords do not match.');
      return;
    }

    if (trimmedUsername.toLowerCase() === 'admin') {
      setError('Username is already taken.');
      return;
    }

    const existingUsers = getUsers();
    const exists = existingUsers.some(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
    );

    if (exists) {
      setError('Username is already taken.');
      return;
    }

    setLoading(true);

    createUser({
      displayName: trimmedDisplayName,
      username: trimmedUsername,
      password: trimmedPassword,
      role: 'user',
    });

    setUsers(getUsers());
    resetForm();
    setSuccess(`User "${trimmedDisplayName}" created successfully.`);
    setLoading(false);
  };

  const handleDelete = (userId: string) => {
    // Don't allow deleting the hard-coded admin or self
    if (userId === 'admin' || userId === session.userId) return;

    // Delete user's posts as well
    const posts = getPosts();
    const userPosts = posts.filter((p) => p.authorId === userId);
    for (const post of userPosts) {
      deletePost(post.id);
    }

    deleteUser(userId);
    setUsers(getUsers());
    setShowConfirm(null);
    setSuccess('User deleted successfully.');
    setError('');
  };

  const userToDelete = showConfirm ? users.find((u) => u.id === showConfirm) : null;

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <Navbar displayName={session.displayName} role={session.role} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900">
            User Management
          </h1>
          <p className="mt-1 text-sm text-surface-500">
            Create and manage user accounts.
          </p>
        </div>

        {/* Create User Form */}
        <div className="rounded-xl border border-surface-200 bg-white p-6 sm:p-8 shadow-card mb-8 animate-fade-in">
          <h2 className="text-xl font-bold text-surface-900 mb-6">
            Create New User
          </h2>

          {error && (
            <div className="mb-6 rounded-lg bg-danger-light px-4 py-3 text-sm font-medium text-danger animate-fade-in">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-lg bg-success-light px-4 py-3 text-sm font-medium text-success-dark animate-fade-in">
              {success}
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-surface-700 mb-1.5"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
                  placeholder="Enter display name"
                  className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors duration-200"
                  autoComplete="name"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-surface-700 mb-1.5"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors duration-200"
                  autoComplete="username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-surface-700 mb-1.5"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors duration-200"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label
                  htmlFor="password2"
                  className="block text-sm font-medium text-surface-700 mb-1.5"
                >
                  Confirm Password
                </label>
                <input
                  id="password2"
                  type="password"
                  value={password2}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword2(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors duration-200"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-white shadow-card hover:shadow-glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                {loading ? 'Creating…' : 'Create User'}
              </button>
            </div>
          </form>
        </div>

        {/* User List */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-surface-900">
              All Users
            </h2>
            <span className="text-sm text-surface-500">
              {users.length} {users.length === 1 ? 'user' : 'users'} registered
            </span>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-surface-200 bg-gradient-card animate-fade-in">
              <span className="text-5xl mb-4 block">👥</span>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">
                No users yet
              </h3>
              <p className="text-surface-500">
                Create the first user using the form above.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table (md+) */}
              <div className="rounded-xl border border-surface-200 bg-white shadow-card overflow-hidden">
                <table className="hidden md:table w-full">
                  <thead>
                    <tr className="border-b border-surface-200 bg-surface-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <UserRow
                        key={user.id}
                        user={user}
                        onDelete={(id: string) => setShowConfirm(id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Cards (below md) */}
              <div className="md:hidden space-y-4">
                {users.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onDelete={(id: string) => setShowConfirm(id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Delete confirmation dialog */}
      {showConfirm && userToDelete && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConfirm(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="w-full max-w-sm rounded-2xl border border-surface-200 bg-white p-6 shadow-card-hover animate-fade-in">
              <div className="text-center mb-6">
                <span className="text-4xl mb-3 block">🗑️</span>
                <h2 className="text-lg font-bold text-surface-900 mb-2">
                  Delete User
                </h2>
                <p className="text-sm text-surface-500">
                  Are you sure you want to delete &ldquo;{userToDelete.displayName}&rdquo;?
                  This will also delete all their posts. This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(null)}
                  className="flex-1 rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-100 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(showConfirm)}
                  className="flex-1 rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-white hover:bg-danger-dark transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}