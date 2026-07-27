import { useEffect, useState } from 'react';
import { supabase, type BlogPost } from '@/lib/supabase';
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from 'lucide-react';

type Draft = {
  id?: string;
  title: string;
  body_text: string;
  image_url: string;
  is_published: boolean;
  published_at: string;
};

const empty: Draft = {
  title: '',
  body_text: '',
  image_url: '',
  is_published: false,
  published_at: new Date().toISOString().slice(0, 10),
};

export default function AdminBlog() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);

  const load = () => {
    setLoading(true);
    supabase.from('blog_posts').select('*').order('published_at', { ascending: false, nullsFirst: false }).then(({ data }) => {
      setItems(data ?? []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing || !editing.title.trim()) return;
    const publishedAt = editing.is_published && editing.published_at
      ? new Date(editing.published_at).toISOString()
      : editing.is_published
        ? new Date().toISOString()
        : null;
    if (editing.id) {
      await supabase.from('blog_posts').update({
        title: editing.title,
        body_text: editing.body_text,
        image_url: editing.image_url || null,
        is_published: editing.is_published,
        published_at: publishedAt,
      }).eq('id', editing.id);
    } else {
      await supabase.from('blog_posts').insert({
        title: editing.title,
        body_text: editing.body_text,
        image_url: editing.image_url || null,
        is_published: editing.is_published,
        published_at: publishedAt,
      });
    }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    load();
  };

  const togglePublish = async (p: BlogPost) => {
    const nowPublished = !p.is_published;
    await supabase.from('blog_posts').update({
      is_published: nowPublished,
      published_at: nowPublished && !p.published_at ? new Date().toISOString() : p.published_at,
    }).eq('id', p.id);
    load();
  };

  const editFrom = (p: BlogPost): Draft => ({
    id: p.id,
    title: p.title,
    body_text: p.body_text,
    image_url: p.image_url ?? '',
    is_published: p.is_published,
    published_at: p.published_at ? p.published_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif font-bold text-2xl text-ink">Blog Posts — Journal</h1>
          <p className="text-sm text-ink-soft mt-1">{items.length} posts</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="flex items-center gap-2 bg-blue text-cream px-4 py-2 text-sm font-semibold hover:bg-blue-dark transition-colors">
          <Plus size={16} /> New
        </button>
      </div>

      {editing && (
        <div className="mb-8 border border-rule bg-cream-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">{editing.id ? 'Edit' : 'New'} Post</h2>
            <button onClick={() => setEditing(null)} className="text-ink-soft hover:text-ink"><X size={18} /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="tag text-ink-soft block mb-1">Title</label>
              <input type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full border border-rule px-3 py-2 focus:outline-none focus:border-blue bg-cream" />
            </div>
            <div>
              <label className="tag text-ink-soft block mb-1">Image URL (optional)</label>
              <input type="text" value={editing.image_url} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} placeholder="https://images.pexels.com/…" className="w-full border border-rule px-3 py-2 focus:outline-none focus:border-blue bg-cream" />
            </div>
            <div>
              <label className="tag text-ink-soft block mb-1">Body text</label>
              <textarea rows={10} value={editing.body_text} onChange={(e) => setEditing({ ...editing, body_text: e.target.value })} className="w-full border border-rule px-3 py-2 focus:outline-none focus:border-blue bg-cream resize-y font-sans" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="tag text-ink-soft block mb-1">Publish date</label>
                <input type="date" value={editing.published_at} onChange={(e) => setEditing({ ...editing, published_at: e.target.value })} className="w-full border border-rule px-3 py-2 focus:outline-none focus:border-blue bg-cream" />
              </div>
              <label className="flex items-end gap-2 text-sm text-ink-soft pb-2">
                <input type="checkbox" checked={editing.is_published} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} />
                Published
              </label>
            </div>
            <button onClick={save} className="bg-blue text-cream px-5 py-2 text-sm font-semibold hover:bg-blue-dark transition-colors">Save</button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-ink-soft">Loading…</p>
      ) : (
        <div className="border border-rule divide-y divide-rule">
          {items.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-cream-dark/50">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-ink">{p.title}</h3>
                <p className="text-sm text-ink-soft mt-0.5">
                  {p.published_at ? new Date(p.published_at).toLocaleDateString() : 'No date'}
                </p>
              </div>
              <button onClick={() => togglePublish(p)} className={`tag ${p.is_published ? 'text-green' : 'text-ink-soft'}`}>
                {p.is_published ? <span className="flex items-center gap-1"><Eye size={12} /> Live</span> : <span className="flex items-center gap-1"><EyeOff size={12} /> Draft</span>}
              </button>
              <button onClick={() => setEditing(editFrom(p))} className="text-ink-soft hover:text-blue"><Pencil size={15} /></button>
              <button onClick={() => remove(p.id)} className="text-ink-soft hover:text-orange"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
