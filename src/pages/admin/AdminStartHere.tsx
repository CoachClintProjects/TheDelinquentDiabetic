import { useEffect, useState } from 'react';
import { supabase, type StartHereSection } from '@/lib/supabase';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

type Draft = {
  id?: string;
  topic_title: string;
  body_text: string;
  sort_order: number;
};

const empty: Draft = { topic_title: '', body_text: '', sort_order: 0 };

export default function AdminStartHere() {
  const [items, setItems] = useState<StartHereSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);

  const load = () => {
    setLoading(true);
    supabase.from('start_here_sections').select('*').order('sort_order').then(({ data }) => {
      setItems(data ?? []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing || !editing.topic_title.trim()) return;
    if (editing.id) {
      await supabase.from('start_here_sections').update({
        topic_title: editing.topic_title,
        body_text: editing.body_text,
        sort_order: editing.sort_order,
      }).eq('id', editing.id);
    } else {
      await supabase.from('start_here_sections').insert({
        topic_title: editing.topic_title,
        body_text: editing.body_text,
        sort_order: editing.sort_order,
      });
    }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this section? This cannot be undone.')) return;
    await supabase.from('start_here_sections').delete().eq('id', id);
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif font-bold text-2xl text-ink">Start Here Sections</h1>
          <p className="text-sm text-ink-soft mt-1">{items.length} sections</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="flex items-center gap-2 bg-blue text-cream px-4 py-2 text-sm font-semibold hover:bg-blue-dark transition-colors">
          <Plus size={16} /> New
        </button>
      </div>

      {editing && (
        <div className="mb-8 border border-rule bg-cream-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">{editing.id ? 'Edit' : 'New'} Section</h2>
            <button onClick={() => setEditing(null)} className="text-ink-soft hover:text-ink"><X size={18} /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="tag text-ink-soft block mb-1">Topic title</label>
              <input type="text" value={editing.topic_title} onChange={(e) => setEditing({ ...editing, topic_title: e.target.value })} className="w-full border border-rule px-3 py-2 focus:outline-none focus:border-blue bg-cream" />
            </div>
            <div>
              <label className="tag text-ink-soft block mb-1">Sort order</label>
              <input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="w-full border border-rule px-3 py-2 focus:outline-none focus:border-blue bg-cream" />
            </div>
            <div>
              <label className="tag text-ink-soft block mb-1">Body text</label>
              <textarea rows={8} value={editing.body_text} onChange={(e) => setEditing({ ...editing, body_text: e.target.value })} className="w-full border border-rule px-3 py-2 focus:outline-none focus:border-blue bg-cream resize-y font-sans" />
            </div>
            <button onClick={save} className="bg-blue text-cream px-5 py-2 text-sm font-semibold hover:bg-blue-dark transition-colors">Save</button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-ink-soft">Loading…</p>
      ) : (
        <div className="border border-rule divide-y divide-rule">
          {items.map((s, i) => (
            <div key={s.id} className="flex items-start gap-4 p-4 hover:bg-cream-dark/50">
              <span className="font-serif font-black text-2xl text-rule mt-1">{String(i + 1).padStart(2, '0')}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-ink">{s.topic_title}</h3>
                <p className="text-sm text-ink-soft mt-1 line-clamp-2">{s.body_text}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditing({ id: s.id, topic_title: s.topic_title, body_text: s.body_text, sort_order: s.sort_order })} className="text-ink-soft hover:text-blue"><Pencil size={15} /></button>
                <button onClick={() => remove(s.id)} className="text-ink-soft hover:text-orange"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
