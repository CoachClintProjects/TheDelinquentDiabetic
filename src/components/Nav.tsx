import { NavLink, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/start-here', label: 'Start Here' },
  { to: '/real-questions', label: 'Real Questions' },
  { to: '/day-in-the-life', label: 'A Day in the Life' },
  { to: '/blog', label: 'Journal' },
  { to: '/resources', label: 'Resources' },
  { to: '/about', label: 'About' },
  { to: '/newsletter', label: 'Newsletter' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-blue text-cream border-b border-blue-dark">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 leading-none">
            <img src="/dd_hollow_logo_2-removebg-preview.png" alt="Delinquent Diabetic" className="h-9 w-9 object-contain" />
            <span className="font-serif font-black text-xl tracking-tight text-cream">
              Delinquent<span className="text-orange">.</span>Diabetic
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? 'text-cream border-b-2 border-orange pb-1'
                      : 'text-cream/70 hover:text-cream'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            className="lg:hidden text-cream"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-cream/15 bg-blue">
          <div className="px-5 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `py-2.5 text-base font-medium ${
                    isActive ? 'text-orange' : 'text-cream/80'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
