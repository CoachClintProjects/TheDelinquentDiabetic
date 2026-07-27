import { useEffect, useState } from 'react';
import { supabase, type Video } from '@/lib/supabase';
import { Plus, Trash2, X, Eye, EyeOff } from 'lucide-react';

type Draft = {
  id?: string;
  embed_url: string;
  caption: string;
  is_published: boolean;
  sort_order: number;
};

const empty: Draft = { embed_url: '', caption: '', is_published: true, sort_order: 0 };

export default function AdminVideos() {
  const [items, setItems] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);

  const load = () => {
    setLoading(true);
    supabase.from('videos').select('*').order('sort_order').then(({ data }) => {
      setItems(data ?? []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing || !editing.embed_url.trim()) return;
    if (editing.id) {
      await supabase.from('videos').update({
        embed_url: editing.embed_url,
        caption: editing.caption,
        is_published: editing.is_published,
        sort_order: editing.sort_order,
      }).eq('id', editing.id);
    } else {
      await supabase.from('videos').insert({
        embed_url: editing.embed_url,
        caption: editing.caption,
        is_published: editing.is_published,
        sort_order: editing.sort_order,
      });
    }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this video? This cannot be undone.')) return;
    await supabase.from('videos').delete().eq('id', id);
    load();
  };

  const togglePublish = async (v: Video) => {
    await supabase.from('videos').update({ is_published: !v.is_published }).eq('id', v.id);
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif font-bold text-2xl text-ink">Videos — A Day in the Life</h1>
          <p className="text-sm text-ink-soft mt-1">{items.length} videos</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="flex items-center gap-2 bg-blue text-cream px-4 py-2 text-sm font-semibold hover:bg-blue-dark transition-colors">
          <Plus size={16} /> New
        </button>
      </div>

      <div className="mb-6 text-sm text-ink-soft bg-cream-dark border border-rule p-4">
        Paste any TikTok, Instagram Reel, or YouTube Shorts link. The site converts it to an embed automatically.
      </div>

      {editing && (
        <div className="mb-8 border border-rule bg-cream-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">{editing.id ? 'Edit' : 'New'} Video</h2>
            <button onClick={() => setEditing(null)} className="text-ink-soft hover:text-ink"><X size={18} /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="tag text-ink-soft block mb-1">Video link (TikTok / Instagram / YouTube)</label>
              <input type="text" value={editing.embed_url} onChange={(e) => setEditing({ ...editing, embed_url: e.target.value })} placeholder="https://www.tiktok.com/@user/video/123…" className="w-full border border-rule px-3 py-2 focus:outline-none focus:border-blue bg-cream" />
            </div>
            <div>
              <label className="tag text-ink-soft block mb-1">Caption</label>
              <input type="text" value={editing.caption} onChange={(e) => setEditing({ ...editing, caption: e.target.value })} className="w-full border border-rule px-3 py-2 focus:outline-none focus:border-blue bg-cream" />
            </div>
            <div>
              <label className="tag text-ink-soft block mb-1">Sort order</label>
              <input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="w-full border border-rule px-3 py-2 focus:outline-none focus:border-blue bg-cream" />
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" checked={editing.is_published} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} />
              Published
            </label>
            <button onClick={save} className="bg-blue text-cream px-5 py-2 text-sm font-semibold hover:bg-blue-dark transition-colors">Save</button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-ink-soft">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((v) => (
            <div key={v.id} className="border border-rule p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <button onClick={() => togglePublish(v)} className={`tag ${v.is_published ? 'text-green' : 'text-ink-soft'}`}>
                  {v.is_published ? <span className="flex items-center gap-1"><Eye size={12} /> Live</span> : <span className="flex items-center gap-1"><EyeOff size={12} /> Draft</span>}
                </button>
                <button onClick={() => remove(v.id)} className="text-ink-soft hover:text-orange"><Trash2 size={15} /></button>
              </div>
              <div className="text-xs text-ink-soft break-all bg-cream-dark px-2 py-1 mb-2">{v.embed_url}</div>
              <p className="text-sm text-ink">{v.caption || <span className="italic text-ink-soft">No caption</span>}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
