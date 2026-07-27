import { BookOpen, Wrench, Users } from 'lucide-react';

const resources = [
  {
    type: 'Books',
    icon: BookOpen,
    items: [
      { title: 'Bright Spots & Landmines', author: 'Adam Brown', note: 'The closest thing to a useful reference book. Practical, not preachy.' },
      { title: 'Think Like a Pancreas', author: 'Gary Scheiner', note: 'Deep on insulin. Written for Type 1 but the mechanics apply.' },
      { title: 'Dr. Bernstein\'s Diabetes Solution', author: 'Richard K. Bernstein', note: 'Controversial and rigid, but the math is worth understanding.' },
    ],
  },
  {
    type: 'Tools',
    icon: Wrench,
    items: [
      { title: 'A CGM (any of them)', author: 'Dexcom, Libre, etc.', note: 'If you can get one, get one. The data changes how you think.' },
      { title: 'A food scale', author: '$15 on Amazon', note: 'Not for counting calories. For learning what a portion actually is.' },
      { title: 'A plain notebook', author: 'No app needed', note: 'Write down what you ate, what you did, what the number was. Patterns appear.' },
    ],
  },
  {
    type: 'Communities',
    icon: Users,
    items: [
      { title: 'r/diabetes', author: 'Reddit', note: 'Unfiltered, occasionally chaotic, but real people in real time.' },
      { title: 'r/diabetes_t2', author: 'Reddit', note: 'Type 2 specific. Less noise than the main sub.' },
      { title: 'Diabetes Daily', author: 'Forum', note: 'Old-school forum energy. Good for long-form questions.' },
    ],
  },
];

export default function Resources() {
  return (
    <div className="fade-up">
      <section className="border-b border-rule">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="tag text-blue mb-4">Resources</div>
              <h1 className="font-serif font-black text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-ink">
                Things I've actually used. Nothing I haven't.
              </h1>
              <p className="font-sans text-lg text-ink-soft leading-relaxed mt-6 max-w-2xl">
                No affiliate links. No sponsored placements. No "Top 10 Apps"
                listicles. If it's here, I've used it and found it worth your time.
                If it's not here, either I haven't tried it or I did and it wasn't.
              </p>
            </div>
            <div className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-8">
              <div className="tag text-orange mb-3">Editorial independence</div>
              <p className="font-sans text-sm text-ink-soft leading-relaxed">
                This site takes no money from any product, company, or brand mentioned
                here. No one pays for placement. No one gets a cut. If that ever
                changes, it'll be plastered across the top of this page — not buried
                in a footnote.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="space-y-16">
          {resources.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.type}>
                <div className="flex items-center gap-3 mb-8">
                  <Icon size={20} className="text-blue" />
                  <h2 className="font-serif font-bold text-2xl md:text-3xl text-ink">{group.type}</h2>
                  <div className="flex-1 h-px bg-rule" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule">
                  {group.items.map((item) => (
                    <div key={item.title} className="bg-cream p-6 lg:p-8">
                      <h3 className="font-serif font-bold text-xl text-ink leading-tight">{item.title}</h3>
                      <p className="tag text-ink-soft mt-1 mb-4">{item.author}</p>
                      <p className="font-sans text-base text-ink-soft leading-relaxed">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
