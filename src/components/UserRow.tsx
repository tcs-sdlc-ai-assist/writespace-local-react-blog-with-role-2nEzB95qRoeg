import type { User } from '../utils/types';
import { getAvatar } from './Avatar';

interface UserRowProps {
  user: User;
  onDelete: (id: string) => void;
}

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

export function UserRow({ user, onDelete }: UserRowProps): JSX.Element {
  const roleBadge =
    user.role === 'admin' ? (
      <span className="inline-flex items-center rounded-full bg-admin-light px-2.5 py-0.5 text-xs font-semibold text-admin-dark">
        Admin
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-user-light px-2.5 py-0.5 text-xs font-semibold text-user-dark">
        User
      </span>
    );

  return (
    <>
      {/* Desktop: Table Row (md+) */}
      <tr className="hidden md:table-row border-b border-surface-100 hover:bg-surface-50 transition-colors duration-200 animate-fade-in">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            {getAvatar(user.role)}
            <div>
              <p className="text-sm font-semibold text-surface-900">
                {user.displayName}
              </p>
              <p className="text-xs text-surface-500">@{user.username}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          {roleBadge}
        </td>
        <td className="px-4 py-3">
          <time dateTime={user.createdAt} className="text-sm text-surface-500">
            {formatDate(user.createdAt)}
          </time>
        </td>
        <td className="px-4 py-3 text-right">
          <button
            type="button"
            onClick={() => onDelete(user.id)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-danger-light px-3 py-1.5 text-sm font-medium text-danger hover:bg-danger/10 transition-colors duration-200"
            aria-label={`Delete ${user.displayName}`}
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
        </td>
      </tr>

      {/* Mobile: Stacked Card (below md) */}
      <div className="md:hidden rounded-xl border border-surface-200 bg-gradient-card p-4 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getAvatar(user.role)}
            <div>
              <p className="text-sm font-semibold text-surface-900">
                {user.displayName}
              </p>
              <p className="text-xs text-surface-500">@{user.username}</p>
            </div>
          </div>
          {roleBadge}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-surface-100 pt-3">
          <time dateTime={user.createdAt} className="text-xs text-surface-400">
            Joined {formatDate(user.createdAt)}
          </time>
          <button
            type="button"
            onClick={() => onDelete(user.id)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-danger-light px-3 py-1.5 text-sm font-medium text-danger hover:bg-danger/10 transition-colors duration-200"
            aria-label={`Delete ${user.displayName}`}
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
    </>
  );
}