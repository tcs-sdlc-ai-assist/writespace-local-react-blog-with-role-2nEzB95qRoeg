import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { BlogCard } from '../components/BlogCard';
import { getSession } from '../utils/auth';
import { getPosts } from '../utils/storage';
import type { Post, Session } from '../utils/types';

export default function Home(): JSX.Element {
  const session = getSession() as Session;
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const allPosts = getPosts();
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setPosts(sorted);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <Navbar displayName={session.displayName} role={session.role} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-surface-900">
              All Blog Posts
            </h1>
            <p className="mt-1 text-sm text-surface-500">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} published
            </p>
          </div>
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
            Write Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <span className="text-5xl mb-4 block">📝</span>
            <h2 className="text-xl font-semibold text-surface-900 mb-2">
              No posts yet
            </h2>
            <p className="text-surface-500 mb-6">
              Be the first to share your thoughts with the world!
            </p>
            <Link
              to="/write"
              className="inline-flex items-center rounded-lg bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-white shadow-card hover:shadow-glow transition-all duration-200"
            >
              Write your first post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}