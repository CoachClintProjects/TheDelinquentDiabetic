import { useEffect, useState } from 'react';
import { supabase, type RealQuestion, QUESTION_CATEGORIES } from '@/lib/supabase';
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from 'lucide-react';

type Draft = {
  id?: string;
  question: string;
  category: string;
  answer: string;
  is_published: boolean;
  sort_order: number;
};

const empty: Draft = {
  question: '',
  category: QUESTION_CATEGORIES[0],
  answer: '',
  is_published: false,
  sort_order: 0,
};

export default function AdminQuestions() {
  const [items, setItems] = useState<RealQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);

  const load = () => {
    setLoading(true);
    supabase
      .from('real_questions')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing || !editing.question.trim()) return;
    if (editing.id) {
      await supabase.from('real_questions').update({
        question: editing.question,
        category: editing.category,
        answer: editing.answer,
        is_published: editing.is_published,
        sort_order: editing.sort_order,
      }).eq('id', editing.id);
    } else {
      await supabase.from('real_questions').insert({
        question: editing.question,
        category: editing.category,
        answer: editing.answer,
        is_published: editing.is_published,
        sort_order: editing.sort_order,
      });
    }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this question? This cannot be undone.')) return;
    await supabase.from('real_questions').delete().eq('id', id);
    load();
  };

  const togglePublish = async (q: RealQuestion) => {
    await supabase.from('real_questions').update({ is_published: !q.is_published }).eq('id', q.id);
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif font-bold text-2xl text-ink">Real Questions</h1>
          <p className="text-sm text-ink-soft mt-1">{items.length} entries</p>
        </div>
        <button
          onClick={() => setEditing({ ...empty })}
          className="flex items-center gap-2 bg-blue text-cream px-4 py-2 text-sm font-semibold hover:bg-blue-dark transition-colors"
        >
          <Plus size={16} /> New
        </button>
      </div>

      {editing && (
        <div className="mb-8 border border-rule bg-cream-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">{editing.id ? 'Edit' : 'New'} Question</h2>
            <button onClick={() => setEditing(null)} className="text-ink-soft hover:text-ink"><X size={18} /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="tag text-ink-soft block mb-1">Question</label>
              <input
                type="text"
                value={editing.question}
                onChange={(e) => setEditing({ ...editing, question: e.target.value })}
                className="w-full border border-rule px-3 py-2 focus:outline-none focus:border-blue bg-cream"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="tag text-ink-soft block mb-1">Category</label>
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full border border-rule px-3 py-2 focus:outline-none focus:border-blue bg-cream"
                >
                  {QUESTION_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="tag text-ink-soft block mb-1">Sort order</label>
                <input
                  type="number"
                  value={editing.sort_order}
                  onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full border border-rule px-3 py-2 focus:outline-none focus:border-blue bg-cream"
                />
              </div>
            </div>
            <div>
              <label className="tag text-ink-soft block mb-1">Answer</label>
              <textarea
                rows={6}
                value={editing.answer}
                onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
                className="w-full border border-rule px-3 py-2 focus:outline-none focus:border-blue bg-cream resize-y font-sans"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={editing.is_published}
                onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })}
              />
              Published
            </label>
            <button onClick={save} className="bg-blue text-cream px-5 py-2 text-sm font-semibold hover:bg-blue-dark transition-colors">
              Save
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-ink-soft">Loading…</p>
      ) : (
        <div className="border border-rule">
          <table className="w-full">
            <thead className="bg-cream-dark border-b border-rule">
              <tr className="text-left">
                <th className="tag text-ink-soft px-4 py-3">Question</th>
                <th className="tag text-ink-soft px-4 py-3">Category</th>
                <th className="tag text-ink-soft px-4 py-3 w-20">Status</th>
                <th className="tag text-ink-soft px-4 py-3 w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {items.map((q) => (
                <tr key={q.id} className="hover:bg-cream-dark/50">
                  <td className="px-4 py-3 text-sm text-ink max-w-md">{q.question}</td>
                  <td className="px-4 py-3 text-sm text-ink-soft">{q.category}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublish(q)}
                      className={`tag px-2 py-1 ${q.is_published ? 'text-green' : 'text-ink-soft'}`}
                    >
                      {q.is_published ? <span className="flex items-center gap-1"><Eye size={12} /> Live</span> : <span className="flex items-center gap-1"><EyeOff size={12} /> Draft</span>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setEditing({ id: q.id, question: q.question, category: q.category, answer: q.answer, is_published: q.is_published, sort_order: q.sort_order })} className="text-ink-soft hover:text-blue"><Pencil size={15} /></button>
                      <button onClick={() => remove(q.id)} className="text-ink-soft hover:text-orange"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
