import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { getAvatar } from '../components/Avatar';
import { getSession } from '../utils/auth';
import { getPosts, deletePost } from '../utils/storage';
import type { Post, Session } from '../utils/types';

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export default function ReadBlog(): JSX.Element {
  const session = getSession() as Session;
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }

    const posts = getPosts();
    const found = posts.find((p: Post) => p.id === id);

    if (!found) {
      setNotFound(true);
      return;
    }

    setPost(found);
  }, [id]);

  const isAdmin = session.role === 'admin';
  const isOwner = post ? session.userId === post.authorId : false;
  const canEdit = isAdmin || isOwner;

  const handleDelete = () => {
    if (!post) return;
    deletePost(post.id);
    navigate('/blogs', { replace: true });
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-surface-50">
        <Navbar displayName={session.displayName} role={session.role} />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center animate-fade-in">
            <span className="text-5xl mb-4 block">🔍</span>
            <h1 className="text-2xl font-bold text-surface-900 mb-2">
              Post Not Found
            </h1>
            <p className="text-surface-500 mb-6">
              The blog post you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              to="/blogs"
              className="inline-flex items-center rounded-lg bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-white shadow-card hover:shadow-glow transition-all duration-200"
            >
              Back to Blogs
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-surface-50">
        <Navbar displayName={session.displayName} role={session.role} />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <p className="text-surface-500">Loading…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <Navbar displayName={session.displayName} role={session.role} />

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="animate-fade-in">
          {/* Back link */}
          <Link
            to="/blogs"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-surface-500 hover:text-primary-600 transition-colors duration-200 mb-6"
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
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Blogs
          </Link>

          {/* Post header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                {getAvatar(post.authorId === 'admin' ? 'admin' : 'user')}
                <div>
                  <p className="text-sm font-semibold text-surface-700">
                    {post.authorName}
                  </p>
                  <time
                    dateTime={post.createdAt}
                    className="text-xs text-surface-400"
                  >
                    {formatDate(post.createdAt)}
                  </time>
                </div>
              </div>

              {canEdit && (
                <div className="flex items-center gap-2">
                  <Link
                    to={`/edit/${post.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-surface-100 px-4 py-2 text-sm font-medium text-surface-700 hover:bg-primary-100 hover:text-primary-600 transition-colors duration-200"
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
                    onClick={() => setShowConfirm(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-danger-light px-4 py-2 text-sm font-medium text-danger hover:bg-danger/10 transition-colors duration-200"
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
              )}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-surface-200 mb-8" />

          {/* Post content */}
          <article className="prose prose-surface max-w-none">
            <div className="text-surface-700 leading-relaxed whitespace-pre-wrap text-base">
              {post.content}
            </div>
          </article>
        </div>
      </main>

      {/* Delete confirmation dialog */}
      {showConfirm && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="w-full max-w-sm rounded-2xl border border-surface-200 bg-white p-6 shadow-card-hover animate-fade-in">
              <div className="text-center mb-6">
                <span className="text-4xl mb-3 block">🗑️</span>
                <h2 className="text-lg font-bold text-surface-900 mb-2">
                  Delete Post
                </h2>
                <p className="text-sm text-surface-500">
                  Are you sure you want to delete &ldquo;{post.title}&rdquo;?
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-100 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
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