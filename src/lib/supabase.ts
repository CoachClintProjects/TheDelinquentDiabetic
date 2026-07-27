import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type RealQuestion = {
  id: string;
  question: string;
  category: string;
  answer: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type StartHereSection = {
  id: string;
  topic_title: string;
  body_text: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Video = {
  id: string;
  embed_url: string;
  caption: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  body_text: string;
  image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const QUESTION_CATEGORIES = [
  'Blood Sugar',
  'Food',
  'CGMs',
  'Insulin',
  'Exercise',
  'Medication',
  'Complications',
  'Mental Health',
  'Numbers & Testing',
] as const;
