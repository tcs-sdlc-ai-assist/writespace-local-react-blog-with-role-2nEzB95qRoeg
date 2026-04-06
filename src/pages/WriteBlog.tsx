import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { getSession } from '../utils/auth';
import { getPosts, createPost, updatePost } from '../utils/storage';
import type { Post, Session } from '../utils/types';

const TITLE_MIN_LENGTH = 3;
const CONTENT_MIN_LENGTH = 10;

export default function WriteBlog(): JSX.Element {
  const session = getSession() as Session;
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [titleError, setTitleError] = useState<string>('');
  const [contentError, setContentError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (!isEditing || !id) return;

    const posts = getPosts();
    const post = posts.find((p: Post) => p.id === id);

    if (!post) {
      setNotFound(true);
      return;
    }

    const isAdmin = session.role === 'admin';
    const isOwner = session.userId === post.authorId;

    if (!isAdmin && !isOwner) {
      navigate('/blogs', { replace: true });
      return;
    }

    setTitle(post.title);
    setContent(post.content);
  }, [id, isEditing, session.role, session.userId, navigate]);

  const validateTitle = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return 'Title is required.';
    if (trimmed.length < TITLE_MIN_LENGTH) return `Title must be at least ${TITLE_MIN_LENGTH} characters.`;
    return '';
  };

  const validateContent = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return 'Content is required.';
    if (trimmed.length < CONTENT_MIN_LENGTH) return `Content must be at least ${CONTENT_MIN_LENGTH} characters.`;
    return '';
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    if (titleError) {
      setTitleError(validateTitle(value));
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    if (contentError) {
      setContentError(validateContent(value));
    }
  };

  const handleTitleBlur = () => {
    setTitleError(validateTitle(title));
  };

  const handleContentBlur = () => {
    setContentError(validateContent(content));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const tError = validateTitle(title);
    const cError = validateContent(content);

    setTitleError(tError);
    setContentError(cError);

    if (tError || cError) return;

    setLoading(true);

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (isEditing && id) {
      updatePost(id, { title: trimmedTitle, content: trimmedContent });
    } else {
      createPost({
        title: trimmedTitle,
        content: trimmedContent,
        authorId: session.userId,
        authorName: session.displayName,
      });
    }

    navigate('/blogs', { replace: true });
  };

  const handleCancel = () => {
    navigate('/blogs');
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-surface-50">
        <Navbar displayName={session.displayName} role={session.role} />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center animate-fade-in">
            <span className="text-5xl mb-4 block">🔍</span>
            <h1 className="text-2xl font-bold text-surface-900 mb-2">Post Not Found</h1>
            <p className="text-surface-500 mb-6">
              The blog post you&apos;re looking for doesn&apos;t exist.
            </p>
            <button
              type="button"
              onClick={() => navigate('/blogs')}
              className="inline-flex items-center rounded-lg bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-white shadow-card hover:shadow-glow transition-all duration-200"
            >
              Back to Blogs
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <Navbar displayName={session.displayName} role={session.role} />

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-surface-900">
              {isEditing ? 'Edit Post' : 'Write a New Post'}
            </h1>
            <p className="mt-1 text-sm text-surface-500">
              {isEditing
                ? 'Update your blog post below.'
                : 'Share your thoughts with the world.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-surface-700 mb-1.5"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                placeholder="Enter your post title"
                className={`w-full rounded-lg border ${
                  titleError
                    ? 'border-danger focus:border-danger focus:ring-danger/20'
                    : 'border-surface-300 focus:border-primary-500 focus:ring-primary-500/20'
                } bg-white px-4 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 transition-colors duration-200`}
              />
              {titleError && (
                <p className="mt-1.5 text-sm font-medium text-danger animate-fade-in">
                  {titleError}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-surface-700"
                >
                  Content
                </label>
                <span className="text-xs text-surface-400">
                  {content.length} character{content.length !== 1 ? 's' : ''}
                </span>
              </div>
              <textarea
                id="content"
                value={content}
                onChange={handleContentChange}
                onBlur={handleContentBlur}
                placeholder="Write your blog post content here..."
                rows={12}
                className={`w-full rounded-lg border ${
                  contentError
                    ? 'border-danger focus:border-danger focus:ring-danger/20'
                    : 'border-surface-300 focus:border-primary-500 focus:ring-primary-500/20'
                } bg-white px-4 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 transition-colors duration-200 resize-y`}
              />
              {contentError && (
                <p className="mt-1.5 text-sm font-medium text-danger animate-fade-in">
                  {contentError}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-white shadow-card hover:shadow-glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? isEditing
                    ? 'Updating…'
                    : 'Publishing…'
                  : isEditing
                    ? 'Update Post'
                    : 'Publish Post'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-surface-300 bg-white px-6 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-100 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}