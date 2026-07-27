import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDownRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import NewsletterForm from '@/components/NewsletterForm';

type QuestionPreview = { id: string; question: string; category: string };

export default function Home() {
  const [questions, setQuestions] = useState<QuestionPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('real_questions')
      .select('id, question, category')
      .eq('is_published', true)
      .order('sort_order')
      .limit(4)
      .then(({ data }) => {
        setQuestions(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="fade-up">
      {/* Hero — asymmetric editorial layout */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 lg:pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="tag text-orange">No. 001</span>
              <span className="h-px w-12 bg-blue/30" />
              <span className="tag text-blue">Est. 2015</span>
            </div>
            <h1 className="font-serif font-black text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-ink">
              Understanding Diabetes.
              <br />
              <span className="italic font-medium">Without the</span>{' '}
              <span className="relative inline-block">
                <span className="text-orange">Bullshit</span>
                <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-orange/20" />
              </span>
              <span className="text-orange">.</span>
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pt-6">
            <p className="font-sans text-lg leading-relaxed text-ink-soft">
              This is not a wellness brand. This is not a clinic. This is one person
              who was diagnosed with Type 2 diabetes in 2015, survived everything
              the disease can throw at a body, and got tired of being lied to about it.
            </p>
            <p className="font-sans text-lg leading-relaxed text-ink-soft mt-4">
              Nothing here is medical advice. Everything here is real.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/start-here"
                className="inline-flex items-center gap-2 bg-blue text-cream px-6 py-3 text-sm font-semibold tracking-wide hover:bg-blue-dark transition-colors"
              >
                Start Here <ArrowRight size={16} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-ink link-underline text-sm font-semibold pt-3"
              >
                Who's writing this? <ArrowDownRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Documentary photo strip */}
      <section className="border-y border-rule">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-3 flex items-center gap-4 overflow-x-auto">
          <span className="tag text-ink-soft whitespace-nowrap shrink-0">From the desk —</span>
          <div className="flex gap-3 shrink-0">
            {['A CGM on an arm at 6am', 'The kitchen table after a low', 'Walking shoes by the door', 'A pill organizer, Sunday night'].map(
              (label, i) => (
                <div key={i} className="flex items-center gap-3 shrink-0">
                  <div className="doc-photo w-24 h-16 rounded-sm" />
                  <span className="text-xs text-ink-soft italic whitespace-nowrap">{label}</span>
                  <span className="text-rule">·</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Real Questions preview */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="tag text-orange mb-2">Real Questions</div>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-ink">
              The things you're actually wondering
            </h2>
          </div>
          <Link
            to="/real-questions"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-ink link-underline"
          >
            All questions <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-cream h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule">
            {questions.map((q, i) => (
              <Link
                key={q.id}
                to="/real-questions"
                className="group bg-cream p-6 lg:p-8 hover:bg-cream-dark transition-colors flex flex-col justify-between min-h-[140px]"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-serif text-2xl font-black text-blue/20">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="tag text-orange">{q.category}</span>
                  </div>
                  <p className="font-serif text-xl text-ink leading-snug group-hover:text-blue transition-colors">
                    {q.question}
                  </p>
                </div>
                <span className="text-sm text-ink-soft mt-4 inline-flex items-center gap-1">
                  Read the answer <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="md:hidden mt-6">
          <Link to="/real-questions" className="inline-flex items-center gap-2 text-sm font-semibold text-ink link-underline">
            All questions <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Newsletter — blue band */}
      <section className="bg-blue text-cream">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-6">
              <div className="tag text-orange mb-3">The Newsletter</div>
              <h2 className="font-serif font-bold text-3xl md:text-4xl leading-tight">
                Not "stay updated."
              </h2>
              <p className="font-sans text-cream/70 text-lg leading-relaxed mt-4 max-w-lg">
                You get the things I wish someone had told me — not the sanitized
                version, not the version that sells supplements. One email when there's
                something worth saying. No schedule, no filler, no "5 tips for managing
                your diabetes." If I don't have something real to add, I don't send it.
              </p>
            </div>
            <div className="lg:col-span-6 lg:pl-10 lg:border-l lg:border-cream/15">
              <NewsletterForm variant="dark" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
