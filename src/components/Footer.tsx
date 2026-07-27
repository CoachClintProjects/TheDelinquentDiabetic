import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-ink text-cream mt-24">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/dd_hollow_logo_2-removebg-preview.png" alt="Delinquent Diabetic" className="h-8 w-8 object-contain" />
              <div className="font-serif font-black text-2xl">
                Delinquent<span className="text-orange">.</span>Diabetic
              </div>
            </div>
            <p className="text-cream/70 text-sm leading-relaxed max-w-md font-sans">
              Understanding diabetes. Without the bullshit. Written by someone
              who's been there — not someone who read about it.
            </p>
          </div>

          <div className="lg:col-span-3">
            <div className="tag text-cream/50 mb-4">Pages</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/start-here" className="text-cream/80 hover:text-cream link-underline">Start Here</Link></li>
              <li><Link to="/real-questions" className="text-cream/80 hover:text-cream link-underline">Real Questions</Link></li>
              <li><Link to="/day-in-the-life" className="text-cream/80 hover:text-cream link-underline">A Day in the Life</Link></li>
              <li><Link to="/blog" className="text-cream/80 hover:text-cream link-underline">Journal</Link></li>
              <li><Link to="/about" className="text-cream/80 hover:text-cream link-underline">About</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <div className="tag text-cream/50 mb-4">Connect</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/newsletter" className="text-cream/80 hover:text-cream link-underline">Newsletter</Link></li>
              <li><Link to="/contact" className="text-cream/80 hover:text-cream link-underline">Contact</Link></li>
              <li><Link to="/resources" className="text-cream/80 hover:text-cream link-underline">Resources</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cream/15">
          <div className="bg-cream/10 border-l-4 border-orange px-5 py-4 mb-6">
            <p className="text-cream/90 text-sm leading-relaxed font-sans">
              <strong className="text-cream">Disclaimer:</strong> Everything on this
              site is education from lived experience, not medical advice. I am not
              your doctor. Always consult your healthcare team before making any
              medical decisions — including changes to medication, diet, or activity.
              What worked (and didn't) for me may not apply to you.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-4 text-cream/50 text-xs">
            <p>© {new Date().getFullYear()} Delinquent Diabetic. All rights reserved.</p>
            <p>Built stubborn, not pretty.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
