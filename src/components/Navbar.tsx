import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import type { UserRole } from '../utils/types';
import { clearSession } from '../utils/auth';
import { getAvatar } from './Avatar';

interface NavbarProps {
  displayName: string;
  role: UserRole;
  onLogout?: () => void;
}

export function Navbar({ displayName, role, onLogout }: NavbarProps): JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  const adminLinks = [
    { to: '/blogs', label: 'All Blogs' },
    { to: '/write', label: 'Write' },
    { to: '/admin', label: 'Dashboard' },
    { to: '/users', label: 'Users' },
  ];

  const userLinks = [
    { to: '/blogs', label: 'All Blogs' },
    { to: '/write', label: 'Write' },
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  const linkBaseClass =
    'inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200';
  const linkActiveClass = 'bg-primary-100 text-primary-700';
  const linkInactiveClass = 'text-surface-600 hover:bg-surface-100 hover:text-surface-900';

  const mobileLinkBaseClass =
    'block px-3 py-2 text-base font-medium rounded-lg transition-colors duration-200';
  const mobileLinkActiveClass = 'bg-primary-100 text-primary-700';
  const mobileLinkInactiveClass = 'text-surface-600 hover:bg-surface-100 hover:text-surface-900';

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-surface-200 shadow-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to={role === 'admin' ? '/admin' : '/blogs'}
            className="flex items-center gap-2 text-xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            ✍️ WriteSpace
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/blogs' || link.to === '/admin'}
                className={({ isActive }) =>
                  `${linkBaseClass} ${isActive ? linkActiveClass : linkInactiveClass}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Side: Avatar + Logout */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 rounded-full bg-surface-100 px-3 py-1.5 hover:bg-surface-200 transition-colors duration-200 cursor-pointer"
              >
                {getAvatar(role)}
                <span className="text-sm font-medium text-surface-700">
                  {displayName}
                </span>
                <svg
                  className={`h-4 w-4 text-surface-400 transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-surface-200 shadow-card-hover animate-fade-in">
                  <div className="px-4 py-3 border-b border-surface-100">
                    <p className="text-sm font-semibold text-surface-900">{displayName}</p>
                    <p className="text-xs text-surface-500 capitalize">{role}</p>
                  </div>
                  <div className="p-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-danger hover:bg-danger-light rounded-lg transition-colors duration-200"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-surface-500 hover:bg-surface-100 hover:text-surface-700 transition-colors duration-200"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-200 bg-white animate-slide-down">
          <div className="space-y-1 px-4 py-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/blogs' || link.to === '/admin'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `${mobileLinkBaseClass} ${isActive ? mobileLinkActiveClass : mobileLinkInactiveClass}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="border-t border-surface-200 px-4 py-3">
            <div className="flex items-center gap-3 mb-3">
              {getAvatar(role)}
              <div>
                <p className="text-sm font-semibold text-surface-900">{displayName}</p>
                <p className="text-xs text-surface-500 capitalize">{role}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-danger-light px-4 py-2 text-sm font-semibold text-danger hover:bg-danger/10 transition-colors duration-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Backdrop to close profile menu */}
      {profileMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileMenuOpen(false)}
        />
      )}
    </nav>
  );
}