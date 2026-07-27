import NewsletterForm from '@/components/NewsletterForm';

export default function NewsletterPage() {
  return (
    <div className="fade-up">
      <section className="max-w-3xl mx-auto px-5 lg:px-8 py-16 lg:py-24">
        <div className="tag text-blue mb-4">The Newsletter</div>
        <h1 className="font-serif font-black text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-ink">
          What you actually get.
        </h1>

        <div className="mt-10 space-y-6 font-sans text-lg leading-relaxed text-ink-soft">
          <p>
            Not a weekly digest. Not "tips and tricks." Not a funnel to sell you
            something. Here's what shows up in your inbox:
          </p>
          <ul className="space-y-4">
            <li className="flex gap-4">
              <span className="font-serif font-black text-2xl text-blue leading-none mt-0.5">01</span>
              <span>
                <strong className="text-ink">New Real Questions answers</strong> — when
                a question gets a full write-up, you hear about it first.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="font-serif font-black text-2xl text-blue leading-none mt-0.5">02</span>
              <span>
                <strong className="text-ink">Journal entries</strong> — the longer
                pieces, the ones that don't fit in a Q&A, delivered when they go live.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="font-serif font-black text-2xl text-blue leading-none mt-0.5">03</span>
              <span>
                <strong className="text-ink">The occasional rant</strong> — when
                something in the diabetes world deserves to be taken apart, it goes
                here. No schedule. No filler.
              </span>
            </li>
          </ul>
          <p>
            One email when there's something real to say. If I haven't got anything to
            add, you won't hear from me. Unsubscribe is one click — no guilt trip.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-rule">
          <div className="tag text-orange mb-4">Sign up</div>
          <NewsletterForm variant="light" />
        </div>
      </section>
    </div>
  );
}
