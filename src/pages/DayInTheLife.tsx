import { useEffect, useState } from 'react';
import { supabase, type Video } from '@/lib/supabase';

function normalizeEmbed(url: string): string {
  // TikTok
  const tiktokMatch = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
  if (tiktokMatch) {
    return `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`;
  }
  // Instagram reel/post
  const igMatch = url.match(/instagram\.com\/(reel|p|reels)\/([\w-]+)/);
  if (igMatch) {
    return `https://www.instagram.com/${igMatch[1]}/${igMatch[2]}/embed`;
  }
  // YouTube Shorts / youtu.be / watch?v=
  const ytShort = url.match(/youtube\.com\/shorts\/([\w-]+)/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
  const ytdMatch = url.match(/youtu\.be\/([\w-]+)/);
  if (ytdMatch) return `https://www.youtube.com/embed/${ytdMatch[1]}`;
  const ytWatch = url.match(/[?&]v=([\w-]+)/);
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`;
  // Already an embed URL or unknown — return as-is
  return url;
}

export default function DayInTheLife() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('videos')
      .select('*')
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data }) => {
        setVideos(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="fade-up">
      {/* Header — full-bleed dark intro */}
      <section className="bg-ink text-cream">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="tag text-blue mb-4">A Day in the Life</div>
              <h1 className="font-serif font-black text-4xl md:text-5xl lg:text-6xl leading-[1.08]">
                Every diabetic has a story. Most of them don't make the highlight reel.
              </h1>
              <p className="font-sans text-lg text-cream/70 leading-relaxed mt-6 max-w-2xl">
                This isn't the polished, "I reversed my diabetes in 30 days" content.
                This is what living with this disease actually looks like — the 3am
                fingerstick, the sensor that won't calibrate, the meal you didn't plan
                for, the walk you were too tired to take. Short, unfiltered, and
                honestly kind of boring. That's the point.
              </p>
            </div>
            <div className="lg:col-span-4 lg:border-l lg:border-cream/15 lg:pl-8">
              <div className="tag text-cream/50 mb-3">Why this format</div>
              <p className="font-sans text-sm text-cream/60 leading-relaxed">
                Because the curated version of diabetes on social media is a lie. Most
                of the useful stuff happens in the mundane moments — and nobody films
                those. So we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video grid */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[9/16] bg-cream-dark animate-pulse" />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <p className="font-serif italic text-xl text-ink-soft py-12">
            No videos yet. They'll show up here the moment they're added.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v, i) => (
              <figure key={v.id} className="flex flex-col">
                <div className="relative aspect-[9/16] bg-ink overflow-hidden">
                  <iframe
                    src={normalizeEmbed(v.embed_url)}
                    title={`Day in the Life — ${i + 1}`}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    allow="autoplay; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                    scrolling="no"
                  />
                </div>
                <figcaption className="mt-3 font-sans text-sm text-ink-soft leading-relaxed">
                  <span className="tag text-blue mr-2">{String(i + 1).padStart(2, '0')}</span>
                  {v.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
