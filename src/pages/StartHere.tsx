import { useEffect, useState } from 'react';
import { supabase, type StartHereSection } from '@/lib/supabase';

export default function StartHere() {
  const [sections, setSections] = useState<StartHereSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('start_here_sections')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        setSections(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="fade-up">
      {/* Page header — left-aligned, editorial */}
      <section className="border-b border-rule">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="tag text-orange mb-4">Start Here</div>
              <h1 className="font-serif font-black text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-ink">
                If you just found out, or just found this site.
              </h1>
              <p className="font-sans text-lg text-ink-soft leading-relaxed mt-6 max-w-2xl">
                You're probably overwhelmed, scared, or angry. Maybe all three. That's
                normal. This page is the short version of what actually matters — no
                guilt trips, no forbidden-food lists, no "your journey starts today."
                Read it in order if you can. Skip around if you can't.
              </p>
            </div>
            <div className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-8">
              <div className="tag text-blue mb-3">In this guide</div>
              <ol className="space-y-1.5">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-sm text-ink-soft hover:text-orange transition-colors">
                      {i + 1}. {s.topic_title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Sections — alternating layout */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        {loading ? (
          <div className="space-y-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-cream-dark animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-20">
            {sections.map((s, i) => (
              <article
                key={s.id}
                id={s.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 scroll-mt-24 ${
                  i % 2 === 1 ? 'lg:[direction:rtl]' : ''
                }`}
              >
                <div className={`lg:col-span-4 lg:[direction:ltr] ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="sticky top-24">
                    <span className="font-serif font-black text-6xl text-blue/20 leading-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="font-serif font-bold text-2xl md:text-3xl text-ink mt-3 leading-tight">
                      {s.topic_title}
                    </h2>
                    <div className="h-1 w-12 bg-blue mt-4" />
                  </div>
                </div>
                <div className={`lg:col-span-8 lg:[direction:ltr] ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="font-sans text-lg leading-relaxed text-ink-soft whitespace-pre-line">
                    {i === 0 ? <p className="dropcap">{s.body_text}</p> : s.body_text}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
