import { Link } from 'react-router-dom';
import type { Post } from '../utils/types';
import { getSession } from '../utils/auth';
import { getAvatar } from './Avatar';

interface BlogCardProps {
  post: Post;
  index: number;
}

const accentColors = [
  'border-primary-500',
  'border-secondary-500',
  'border-accent-500',
  'border-admin-DEFAULT',
  'border-user-DEFAULT',
  'border-success-DEFAULT',
  'border-danger-DEFAULT',
  'border-warning-DEFAULT',
];

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
  if (content.length <= 120) return content;
  return content.slice(0, 120).trimEnd() + '…';
}

export function BlogCard({ post, index }: BlogCardProps): JSX.Element {
  const session = getSession();
  const borderColor = accentColors[index % accentColors.length];

  const isAdmin = session?.role === 'admin';
  const isOwner = session?.userId === post.authorId;
  const canEdit = isAdmin || isOwner;

  return (
    <div
      className={`relative flex flex-col rounded-xl border-t-4 ${borderColor} bg-gradient-card border border-surface-200 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in`}
    >
      <Link
        to={`/blog/${post.id}`}
        className="flex flex-1 flex-col p-5 sm:p-6"
      >
        <h3 className="text-lg font-semibold text-surface-900 line-clamp-2 mb-2 hover:text-primary-600 transition-colors duration-200">
          {post.title}
        </h3>

        <p className="text-sm text-surface-500 leading-relaxed mb-4 flex-1">
          {getExcerpt(post.content)}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-100">
          <div className="flex items-center gap-2">
            {getAvatar(
              post.authorId === 'admin' ? 'admin' : 'user'
            )}
            <span className="text-sm font-medium text-surface-700">
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
      </Link>

      {canEdit && (
        <Link
          to={`/edit/${post.id}`}
          className="absolute top-3 right-3 inline-flex items-center justify-center rounded-lg bg-surface-100 p-2 text-surface-500 hover:bg-primary-100 hover:text-primary-600 transition-colors duration-200"
          aria-label={`Edit ${post.title}`}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
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
        </Link>
      )}
    </div>
  );
}