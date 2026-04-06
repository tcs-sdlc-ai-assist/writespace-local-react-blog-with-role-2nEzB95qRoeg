import { Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getAvatar } from './Avatar';

export function PublicNavbar(): JSX.Element {
  const session = getSession();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-surface-200 shadow-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            ✍️ WriteSpace
          </Link>

          <div className="flex items-center gap-3">
            {session ? (
              <>
                <div className="flex items-center gap-2 rounded-full bg-surface-100 px-3 py-1.5">
                  {getAvatar(session.role)}
                  <span className="hidden sm:inline text-sm font-medium text-surface-700">
                    {session.displayName}
                  </span>
                </div>
                <Link
                  to={session.role === 'admin' ? '/admin' : '/blogs'}
                  className="inline-flex items-center rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-card hover:shadow-glow transition-all duration-200"
                >
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-card hover:shadow-glow transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}