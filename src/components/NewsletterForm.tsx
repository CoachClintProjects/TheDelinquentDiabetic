import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function NewsletterForm({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    const { error } = await supabase.from('newsletter_subscribers').insert({ email: email.trim() });
    if (error) {
      if (error.code === '23505') {
        setStatus('done');
        return;
      }
      setStatus('error');
      return;
    }
    setStatus('done');
  };

  const inputBase = 'w-full bg-transparent border-b-2 py-3 px-1 focus:outline-none transition-colors';
  const inputClass =
    variant === 'dark'
      ? `${inputBase} border-cream/30 focus:border-orange text-cream placeholder:text-cream/40`
      : `${inputBase} border-rule focus:border-blue text-ink placeholder:text-ink-soft/50`;

  if (status === 'done') {
    return (
      <p className={`font-serif text-lg italic ${variant === 'dark' ? 'text-cream' : 'text-ink'}`}>
        You're in. Check your inbox — and your spam folder, because email is weird.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className={inputClass}
        disabled={status === 'loading'}
      />
      {status === 'error' && (
        <p className="text-orange text-sm">Something went wrong. Try again in a moment.</p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="self-start bg-blue text-cream px-6 py-3 text-sm font-semibold tracking-wide hover:bg-blue-dark transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending…' : 'Sign me up'}
      </button>
    </form>
  );
}
