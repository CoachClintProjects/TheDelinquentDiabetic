import { useEffect, useMemo, useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { supabase, type RealQuestion, QUESTION_CATEGORIES } from '@/lib/supabase';

export default function RealQuestions() {
  const [questions, setQuestions] = useState<RealQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('real_questions')
      .select('*')
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data }) => {
        setQuestions(data ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchesCat = activeCategory === 'All' || q.category === activeCategory;
      const matchesSearch =
        !search ||
        q.question.toLowerCase().includes(search.toLowerCase()) ||
        q.answer.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [questions, activeCategory, search]);

  return (
    <div className="fade-up">
      {/* Header */}
      <section className="border-b border-rule">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <div className="tag text-orange mb-4">Real Questions</div>
              <h1 className="font-serif font-black text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-ink">
                The questions you ask your doctor in the last two minutes.
              </h1>
              <p className="font-sans text-lg text-ink-soft leading-relaxed mt-6 max-w-2xl">
                These are the things diabetics actually wonder about at 2am — not the
                things that fill a pamphlet. Search, filter, or just scroll. Click any
                question to expand the answer. If yours isn't here yet, it will be.
              </p>
            </div>
            <div className="lg:col-span-5 lg:border-l lg:border-rule lg:pl-8">
              <div className="relative">
                <Search size={18} className="absolute left-0 top-3 text-ink-soft" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search questions…"
                  className="w-full pl-8 pb-2 bg-transparent border-b-2 border-rule focus:border-orange text-ink placeholder:text-ink-soft/50 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category filter bar */}
      <section className="sticky top-16 z-40 bg-cream/95 backdrop-blur-sm border-b border-rule">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-3 flex gap-2 overflow-x-auto">
          {['All', ...QUESTION_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`tag whitespace-nowrap px-3 py-1.5 transition-colors ${
                activeCategory === cat
                  ? 'bg-blue text-cream'
                  : 'text-ink-soft hover:text-blue border border-rule'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Questions list */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-cream-dark animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="font-serif italic text-xl text-ink-soft py-12">
            No questions match that yet. Try another search.
          </p>
        ) : (
          <div className="divide-y divide-rule border-y border-rule">
            {filtered.map((q, i) => {
              const isOpen = openId === q.id;
              return (
                <div key={q.id} className="py-1">
                  <button
                    onClick={() => setOpenId(isOpen ? null : q.id)}
                    className="w-full text-left py-5 flex items-start gap-5 group"
                  >
                    <span className="font-serif font-black text-2xl text-blue/30 shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <div className="tag text-blue mb-1.5">{q.category}</div>
                      <h3 className="font-serif text-xl md:text-2xl text-ink leading-snug group-hover:text-orange transition-colors">
                        {q.question}
                      </h3>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`shrink-0 mt-1 text-ink-soft transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pl-12 pr-4 pb-6">
                      <div className="border-l-2 border-blue pl-5">
                        <p className="font-sans text-base md:text-lg leading-relaxed text-ink-soft whitespace-pre-line">
                          {q.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
