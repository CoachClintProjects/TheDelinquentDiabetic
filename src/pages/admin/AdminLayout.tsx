import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { ListChecks, BookOpen, Video, FileText, LogOut, ExternalLink } from 'lucide-react';

const menu = [
  { to: '/admin', label: 'Questions', icon: ListChecks, end: true },
  { to: '/admin/start-here', label: 'Start Here', icon: BookOpen, end: false },
  { to: '/admin/videos', label: 'Videos', icon: Video, end: false },
  { to: '/admin/blog', label: 'Blog Posts', icon: FileText, end: false },
];

export default function AdminLayout() {
  const { session, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-screen bg-ink flex items-center justify-center text-cream">Loading…</div>;
  }
  if (!session) return <Navigate to="/admin/login" replace />;

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-ink text-cream flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-cream/10 flex flex-col">
        <div className="px-5 py-6 border-b border-cream/10">
          <div className="font-serif font-black text-lg text-cream leading-none">
            Delinquent<span className="text-orange">.</span>Diabetic
          </div>
          <div className="tag text-cream/40 mt-1">Admin</div>
        </div>
        <nav className="flex-1 py-4">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                    isActive ? 'bg-cream/10 text-orange' : 'text-cream/60 hover:text-cream'
                  }`
                }
              >
                <Icon size={16} /> {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-cream/10 p-4 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-1 py-2 text-sm text-cream/60 hover:text-cream transition-colors"
          >
            <ExternalLink size={16} /> View site
          </a>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-1 py-2 text-sm text-cream/60 hover:text-cream transition-colors w-full"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-x-auto bg-cream text-ink">
        <Outlet />
      </main>
    </div>
  );
}
