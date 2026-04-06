import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';
import { getSession } from '../utils/auth';
import { getPosts } from '../utils/storage';
import type { Post } from '../utils/types';

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

function getExcerpt(content: string): string {
  if (content.length <= 100) return content;
  return content.slice(0, 100).trimEnd() + '…';
}

const features = [
  {
    icon: '✍️',
    title: 'Write & Publish',
    description:
      'Create beautiful blog posts with our clean, distraction-free editor. Share your thoughts with the world in seconds.',
    color: 'bg-primary-100 text-primary-600',
  },
  {
    icon: '👥',
    title: 'Role-Based Access',
    description:
      'Admins manage users and all content. Regular users write and edit their own posts. Simple and secure.',
    color: 'bg-secondary-100 text-secondary-600',
  },
  {
    icon: '💾',
    title: 'Local Persistence',
    description:
      'All your data is stored safely in your browser. No server needed — your content is always available offline.',
    color: 'bg-accent-100 text-accent-600',
  },
];

export default function LandingPage(): JSX.Element {
  const session = getSession();
  const posts = getPosts();
  const latestPosts: Post[] = posts.slice(0, 3);

  const dashboardLink = session
    ? session.role === 'admin'
      ? '/admin'
      : '/blogs'
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 sm:py-28 lg:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              WriteSpace
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-white/80 mb-10 animate-slide-up">
            A clean, modern blogging platform where you can write, share, and
            manage your stories — all from your browser.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            {session ? (
              <Link
                to={dashboardLink!}
                className="inline-flex items-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-primary-700 shadow-card hover:shadow-glow transition-all duration-200"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-primary-700 shadow-card hover:shadow-glow transition-all duration-200"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center rounded-xl border-2 border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">
              Everything you need to blog
            </h2>
            <p className="mx-auto max-w-xl text-surface-500 text-lg">
              Simple, powerful, and completely local. No sign-ups to external
              services required.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center rounded-xl border border-surface-200 bg-gradient-card p-8 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in"
              >
                <span
                  className={`inline-flex items-center justify-center rounded-full ${feature.color} p-4 text-3xl mb-5`}
                >
                  {feature.icon}
                </span>
                <h3 className="text-lg font-semibold text-surface-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-surface-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16 sm:py-24 bg-surface-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-4">
              Latest Posts
            </h2>
            <p className="mx-auto max-w-xl text-surface-500 text-lg">
              Check out what people are writing about.
            </p>
          </div>

          {latestPosts.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <span className="text-5xl mb-4 block">📝</span>
              <p className="text-surface-500 text-lg mb-2">
                No posts yet.
              </p>
              <p className="text-surface-400 text-sm">
                Be the first to write something!
              </p>
              {!session && (
                <Link
                  to="/register"
                  className="mt-6 inline-flex items-center rounded-lg bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-white shadow-card hover:shadow-glow transition-all duration-200"
                >
                  Get Started
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="flex flex-col rounded-xl border border-surface-200 bg-gradient-card p-6 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in"
                >
                  <h3 className="text-lg font-semibold text-surface-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="text-sm text-surface-500 leading-relaxed mb-4 flex-1">
                    {getExcerpt(post.content)}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-surface-100 mt-auto">
                    <span className="text-sm font-medium text-surface-700">
                      {post.authorName}
                    </span>
                    <time
                      dateTime={post.createdAt}
                      className="text-xs text-surface-400"
                    >
                      {formatDate(post.createdAt)}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-dark py-12 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-lg font-bold text-white">
              ✍️ WriteSpace
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="text-sm text-surface-400 hover:text-white transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm text-surface-400 hover:text-white transition-colors duration-200"
              >
                Register
              </Link>
              <Link
                to="/blogs"
                className="text-sm text-surface-400 hover:text-white transition-colors duration-200"
              >
                Blogs
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-surface-700 pt-8 text-center">
            <p className="text-sm text-surface-400">
              © {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}