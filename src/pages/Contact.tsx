import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.from('contact_messages').insert({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });
    setStatus(error ? 'error' : 'done');
    if (!error) {
      setName('');
      setEmail('');
      setMessage('');
    }
  };

  if (status === 'done') {
    return (
      <div className="fade-up max-w-2xl mx-auto px-5 lg:px-8 py-24 text-center">
        <div className="tag text-green mb-4">Sent</div>
        <h1 className="font-serif font-bold text-3xl md:text-4xl text-ink mb-4">
          Got it. Thanks for writing.
        </h1>
        <p className="font-sans text-lg text-ink-soft leading-relaxed">
          I read everything. I don't always reply fast — but I read it.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-8 text-sm text-ink link-underline font-semibold"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <section className="border-b border-rule">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <div className="tag text-blue mb-4">Contact</div>
              <h1 className="font-serif font-black text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-ink">
                Tell me what's on your mind.
              </h1>
              <p className="font-sans text-lg text-ink-soft leading-relaxed mt-6 max-w-xl">
                A question that isn't in the library yet. A correction. A disagreement.
                A story. Use this form. I can't give medical advice and I won't try —
                but I will read it.
              </p>
            </div>
            <div className="lg:col-span-5 lg:border-l lg:border-rule lg:pl-8">
              <div className="tag text-orange mb-3">Before you send</div>
              <p className="font-sans text-sm text-ink-soft leading-relaxed">
                If you're in a medical emergency, this form is not the right tool —
                call your doctor or emergency services. This is for conversation, not
                crises.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-5 lg:px-8 py-16">
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="tag text-ink-soft block mb-2">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b-2 border-rule focus:border-blue py-2 focus:outline-none text-ink transition-colors"
            />
          </div>
          <div>
            <label className="tag text-ink-soft block mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b-2 border-rule focus:border-blue py-2 focus:outline-none text-ink transition-colors"
            />
          </div>
          <div>
            <label className="tag text-ink-soft block mb-2">Message</label>
            <textarea
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-transparent border-b-2 border-rule focus:border-blue py-2 focus:outline-none text-ink transition-colors resize-none"
            />
          </div>
          {status === 'error' && (
            <p className="text-orange text-sm">Something went wrong. Try again in a moment.</p>
          )}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-blue text-cream px-6 py-3 text-sm font-semibold tracking-wide hover:bg-blue-dark transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Sending…' : 'Send it'}
          </button>
        </form>
      </section>
    </div>
  );
}
