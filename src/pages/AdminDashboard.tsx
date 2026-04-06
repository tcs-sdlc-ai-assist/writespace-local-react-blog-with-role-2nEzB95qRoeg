import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { StatCard } from '../components/StatCard';
import { getAvatar } from '../components/Avatar';
import { getSession } from '../utils/auth';
import { getPosts, getUsers, deletePost } from '../utils/storage';
import type { Post, User, Session } from '../utils/types';

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export default function AdminDashboard(): JSX.Element {
  const session = getSession() as Session;
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  useEffect(() => {
    const allPosts = getPosts();
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setPosts(sorted);
    setUsers(getUsers());
  }, []);

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for hard-coded admin
  const adminCount = users.filter((u) => u.role === 'admin').length + 1;
  const userCount = users.filter((u) => u.role === 'user').length;
  const recentPosts = posts.slice(0, 5);

  const handleDelete = (postId: string) => {
    deletePost(postId);
    const allPosts = getPosts();
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setPosts(sorted);
    setShowConfirm(null);
  };

  const postToDelete = showConfirm ? posts.find((p) => p.id === showConfirm) : null;

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <Navbar displayName={session.displayName} role={session.role} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Gradient Header Banner */}
        <div className="rounded-2xl bg-gradient-hero p-8 sm:p-10 mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-3">
            {getAvatar('admin')}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Welcome back, {session.displayName}!
              </h1>
              <p className="text-sm text-white/70 mt-1">
                Here&apos;s an overview of your WriteSpace platform.
              </p>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatCard
            label="Total Posts"
            value={totalPosts}
            color="bg-primary-100"
            icon="📝"
          />
          <StatCard
            label="Total Users"
            value={totalUsers}
            color="bg-secondary-100"
            icon="👥"
          />
          <StatCard
            label="Admins"
            value={adminCount}
            color="bg-admin-light"
            icon="👑"
          />
          <StatCard
            label="Regular Users"
            value={userCount}
            color="bg-user-light"
            icon="📚"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8 animate-fade-in">
          <Link
            to="/write"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-card hover:shadow-glow transition-all duration-200"
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
            Write New Post
          </Link>
          <Link
            to="/users"
            className="inline-flex items-center justify-center rounded-lg border border-surface-300 bg-white px-5 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-100 transition-colors duration-200"
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
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
            Manage Users
          </Link>
        </div>

        {/* Recent Posts */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-surface-900">
              Recent Posts
            </h2>
            <Link
              to="/blogs"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
            >
              View all →
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-surface-200 bg-gradient-card animate-fade-in">
              <span className="text-5xl mb-4 block">📝</span>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">
                No posts yet
              </h3>
              <p className="text-surface-500 mb-6">
                Create the first post to get started!
              </p>
              <Link
                to="/write"
                className="inline-flex items-center rounded-lg bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-white shadow-card hover:shadow-glow transition-all duration-200"
              >
                Write your first post
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border border-surface-200 bg-white shadow-card overflow-hidden">
              {/* Desktop Table (md+) */}
              <table className="hidden md:table w-full">
                <thead>
                  <tr className="border-b border-surface-200 bg-surface-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b border-surface-100 hover:bg-surface-50 transition-colors duration-200 animate-fade-in"
                    >
                      <td className="px-4 py-3">
                        <Link
                          to={`/blog/${post.id}`}
                          className="text-sm font-semibold text-surface-900 hover:text-primary-600 transition-colors duration-200 line-clamp-1"
                        >
                          {post.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getAvatar(post.authorId === 'admin' ? 'admin' : 'user')}
                          <span className="text-sm text-surface-700">
                            {post.authorName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <time
                          dateTime={post.createdAt}
                          className="text-sm text-surface-500"
                        >
                          {formatDate(post.createdAt)}
                        </time>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/edit/${post.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-surface-100 px-3 py-1.5 text-sm font-medium text-surface-700 hover:bg-primary-100 hover:text-primary-600 transition-colors duration-200"
                            aria-label={`Edit ${post.title}`}
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              />
                            </svg>
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => setShowConfirm(post.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-danger-light px-3 py-1.5 text-sm font-medium text-danger hover:bg-danger/10 transition-colors duration-200"
                            aria-label={`Delete ${post.title}`}
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Stacked Cards (below md) */}
              <div className="md:hidden divide-y divide-surface-100">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 hover:bg-surface-50 transition-colors duration-200 animate-fade-in"
                  >
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-sm font-semibold text-surface-900 hover:text-primary-600 transition-colors duration-200 line-clamp-2 mb-2 block"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getAvatar(post.authorId === 'admin' ? 'admin' : 'user')}
                        <span className="text-sm text-surface-700">
                          {post.authorName}
                        </span>
                      </div>
                      <time
                        dateTime={post.createdAt}
                        className="text-xs text-surface-400"
                      >
                        {formatDate(post.createdAt)}
                      </time>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/edit/${post.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-surface-100 px-3 py-1.5 text-sm font-medium text-surface-700 hover:bg-primary-100 hover:text-primary-600 transition-colors duration-200"
                        aria-label={`Edit ${post.title}`}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setShowConfirm(post.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-danger-light px-3 py-1.5 text-sm font-medium text-danger hover:bg-danger/10 transition-colors duration-200"
                        aria-label={`Delete ${post.title}`}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete confirmation dialog */}
      {showConfirm && postToDelete && (
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
                  Delete Post
                </h2>
                <p className="text-sm text-surface-500">
                  Are you sure you want to delete &ldquo;{postToDelete.title}&rdquo;?
                  This action cannot be undone.
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