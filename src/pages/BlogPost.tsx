import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase, type BlogPost } from '@/lib/supabase';

export default function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setPost(data);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-5 lg:px-8 py-24">
        <div className="h-64 bg-cream-dark animate-pulse" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="max-w-3xl mx-auto px-5 lg:px-8 py-24 text-center">
        <p className="font-serif italic text-2xl text-ink-soft">
          That post doesn't exist or isn't published.
        </p>
        <Link to="/blog" className="inline-flex items-center gap-2 mt-6 text-ink link-underline font-semibold">
          <ArrowLeft size={16} /> Back to the Journal
        </Link>
      </div>
    );
  }

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="fade-up">
      <article className="max-w-3xl mx-auto px-5 lg:px-8 py-16 lg:py-24">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink transition-colors mb-8">
          <ArrowLeft size={16} /> The Journal
        </Link>

        <header className="mb-10">
          <div className="tag text-blue mb-4">{date}</div>
          <h1 className="font-serif font-black text-4xl md:text-5xl leading-[1.1] text-ink">
            {post.title}
          </h1>
        </header>

        {post.image_url && (
          <div className="doc-photo aspect-[16/9] w-full mb-10">
            <img
              src={post.image_url}
              alt=""
              className="w-full h-full object-cover mix-blend-multiply opacity-90"
            />
          </div>
        )}

        <div className="font-sans text-lg leading-relaxed text-ink whitespace-pre-line">
          <p className="dropcap">{post.body_text}</p>
        </div>

        <div className="mt-16 pt-8 border-t border-rule">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-ink link-underline font-semibold">
            <ArrowLeft size={16} /> More from the Journal
          </Link>
        </div>
      </article>
    </div>
  );
}
