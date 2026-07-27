import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type BlogPreview = {
  id: string;
  title: string;
  body_text: string;
  image_url: string | null;
  published_at: string | null;
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('id, title, body_text, image_url, published_at')
      .eq('is_published', true)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        setPosts(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="fade-up">
      <section className="border-b border-rule">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="tag text-blue mb-4">The Journal</div>
              <h1 className="font-serif font-black text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-ink">
                Longer than a question. Shorter than a book.
              </h1>
              <p className="font-sans text-lg text-ink-soft leading-relaxed mt-6 max-w-2xl">
                Essays and notes from inside the disease — not advice, not a system,
                not a "framework." Just one person writing down what they see, what
                they got wrong, and what they'd do differently. Newest first.
              </p>
            </div>
            <div className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-8">
              <div className="tag text-orange mb-3">{posts.length} entries</div>
              <p className="font-sans text-sm text-ink-soft leading-relaxed">
                No schedule. No word count. No SEO strategy. When there's something
                worth saying, it goes here.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-cream-dark animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="font-serif italic text-xl text-ink-soft py-12">
            No posts yet. Check back — or better, sign up for the newsletter.
          </p>
        ) : (
          <div className="space-y-px bg-rule border-y border-rule">
            {posts.map((post, i) => {
              const date = post.published_at
                ? new Date(post.published_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : '';
              const excerpt = post.body_text.slice(0, 180).trim() + (post.body_text.length > 180 ? '…' : '');
              return (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group bg-cream grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 lg:p-8 hover:bg-cream-dark transition-colors"
                >
                  <div className="lg:col-span-3">
                    {post.image_url ? (
                      <div className="doc-photo aspect-[4/3] w-full">
                        <img
                          src={post.image_url}
                          alt=""
                          className="w-full h-full object-cover mix-blend-multiply opacity-90"
                        />
                      </div>
                    ) : (
                      <div className="doc-photo aspect-[4/3] w-full" />
                    )}
                  </div>
                  <div className="lg:col-span-9 flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-serif font-black text-xl text-rule">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="tag text-ink-soft">{date}</span>
                    </div>
                    <h2 className="font-serif font-bold text-2xl md:text-3xl text-ink leading-tight group-hover:text-blue transition-colors">
                      {post.title}
                    </h2>
                    <p className="font-sans text-base text-ink-soft leading-relaxed mt-3 max-w-2xl">
                      {excerpt}
                    </p>
                    <span className="text-sm text-ink mt-4 inline-flex items-center gap-1 font-semibold">
                      Read it <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
