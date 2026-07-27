export default function About() {
  return (
    <div className="fade-up">
      {/* Header — large, narrative */}
      <section className="bg-blue text-cream">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="tag text-orange mb-4">About</div>
              <h1 className="font-serif font-black text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-cream">
                I didn't manage this disease well.
                <br />
                <span className="italic font-medium text-cream/90">That's the whole point.</span>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:border-l lg:border-cream/20 lg:pl-8 lg:pt-4">
              <p className="font-sans text-base text-cream/80 leading-relaxed">
                This is the part where most sites put a smiling headshot and a bio
                about "passion" and "community." This isn't that. This is the reason
                anything on this site is worth reading.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The timeline — vertical, editorial */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sticky sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="tag text-blue mb-4">The short version</div>
              <ul className="space-y-3 text-sm">
                {[
                  'Diagnosed Type 2 — 2015',
                  'Diabetic ketoacidosis',
                  'Pancreatitis',
                  'Acute liver failure',
                  'Brain swelling',
                  'Severe diabetic neuropathy',
                  'Heart attack',
                  'Double bypass surgery',
                  'Bladder cancer',
                  'Former certified personal trainer',
                  'Swimming & athletic coaching background',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="font-serif font-black text-lg text-blue/40 leading-none mt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-ink-soft">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Narrative body */}
          <div className="lg:col-span-8">
            <div className="font-sans text-lg leading-relaxed text-ink space-y-6">
              <p className="dropcap">
                I was diagnosed with Type 2 diabetes in 2015. If you're picturing a
                slow, manageable decline from there — some dietary tweaks, a pill,
                maybe an A1C that crept around 7 for a decade — that's not what
                happened.
              </p>
              <p>
                What actually happened: diabetic ketoacidosis. Pancreatitis. Acute
                liver failure. My brain swelled. Severe diabetic neuropathy that
                doesn't go away and doesn't care that you'd rather it did. A heart
                attack, followed by a double bypass. Bladder cancer.
              </p>
              <p>
                That's not a list I'm proud of. It's not a redemption arc I'm selling
                you either. It's just what this disease did when it wasn't managed —
                to me, specifically, in my body, on my watch. If you're newly
                diagnosed and terrified, or ten years in and still white-knuckling
                it, I'm not here to tell you none of that can happen to you. I'm here
                because it happened to me, and I'm still around to talk about it,
                which means there's something worth saying.
              </p>
            </div>

            {/* Pull quote */}
            <blockquote className="my-12 border-l-4 border-blue pl-6">
              <p className="font-serif font-medium text-2xl md:text-3xl text-ink italic leading-snug">
                "I'm not writing to you as someone who read about diabetes. I'm
                writing as someone who has lived on both ends of it."
              </p>
            </blockquote>

            <div className="font-sans text-lg leading-relaxed text-ink space-y-6">
              <h2 className="font-serif font-bold text-2xl text-blue pt-4">
                Here's the part that makes this site different from the others
              </h2>
              <p>
                I'm also a former certified personal trainer, with a background
                coaching competitive swimming and athletics. So I'm not writing to
                you as someone who read about diabetes. I'm writing as someone who
                has lived on both ends of it: I understand training, nutrition, and
                physiology at a professional level — and I still ended up in a
                hospital bed more than once because understanding something and
                actually living it under the weight of a chronic disease are two
                very different things.
              </p>
              <p>
                That combination is why this site exists. Most diabetes content comes
                from one of two places: people who've never had the disease
                explaining it to you clinically, or people selling you a
                transformation story with a clean before-and-after. I don't fit
                either. I know the training science, and I know exactly what it
                feels like to ignore it, to be too exhausted or too checked-out or
                too human to do the thing I knew I should do — and then pay for it.
              </p>

              <h2 className="font-serif font-bold text-2xl text-blue pt-4">
                What this site is not
              </h2>
              <p>
                It's not a redemption story. I'm not "fixed." I'm not going to tell
                you I've got this all figured out now and neither should you expect
                that of yourself. Managing this disease is a daily, imperfect,
                occasionally-you-just-eat-the-thing-anyway process, and anyone
                telling you otherwise is selling something.
              </p>
              <p>
                It's also not medical advice. I'm not your doctor. Nothing here
                replaces an actual conversation with your actual healthcare team.
                What I can offer is the thing most of that content can't: what it
                actually looks like when this disease wins for a while, what it
                costs, and what I've learned — the hard way, more than once — about
                what actually matters day to day versus what's noise.
              </p>

              <h2 className="font-serif font-bold text-2xl text-blue pt-4">
                Why "Delinquent Diabetic"
              </h2>
              <p>
                Because I wasn't the compliant patient. I skipped things I shouldn't
                have. I ignored numbers I shouldn't have ignored. If your
                relationship with this disease has ever looked less like a
                wellness-brand infographic and more like avoidance, frustration, or
                just being a tired human who didn't do the "right" thing that day —
                you're not the only one, and you're not the problem. The disease is
                relentless. That's worth saying plainly, without the guilt-tripping
                most diabetes content can't seem to resist.
              </p>
              <p>
                I'm not here to lecture you. I've done everything on this page's list
                of things not to do. I'm here because I'm still here, and I'd rather
                tell you the truth about what that took than pretend it was simple.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
