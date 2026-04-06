import type { UserRole } from '../utils/types';

export function getAvatar(role: UserRole): JSX.Element {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center justify-center rounded-full bg-admin-light p-2 text-lg">
        👑
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-center rounded-full bg-user-light p-2 text-lg">
      📚
    </span>
  );
}