import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Lock, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (session) return <Navigate to="/admin" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <Link to="/" className="inline-flex items-center gap-2 text-cream/50 hover:text-cream text-sm mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to site
        </Link>
        <div className="flex items-center gap-3 mb-8">
          <Lock size={20} className="text-blue" />
          <h1 className="font-serif font-black text-2xl text-cream">Admin</h1>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="tag text-cream/50 block mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b-2 border-cream/20 focus:border-blue py-2 focus:outline-none text-cream transition-colors"
            />
          </div>
          <div>
            <label className="tag text-cream/50 block mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b-2 border-cream/20 focus:border-blue py-2 focus:outline-none text-cream transition-colors"
            />
          </div>
          {error && <p className="text-orange text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue text-cream py-3 text-sm font-semibold tracking-wide hover:bg-blue-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
