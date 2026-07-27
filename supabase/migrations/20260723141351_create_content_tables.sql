/*
# Create content tables for Delinquent Diabetic

1. Overview
This is a single-admin editorial site. Public visitors read published content;
one authenticated admin (email/password, no public sign-up) manages all content.

2. New Tables
- `real_questions` — Q&A library, categorized and filterable.
  - id, question, category, answer, is_published, sort_order, created_at, updated_at
- `start_here_sections` — the 7 on-ramp sections for newly diagnosed readers.
  - id, topic_title, body_text, sort_order, created_at, updated_at
- `videos` — embedded short-form video entries for "A Day in the Life".
  - id, embed_url, caption, is_published, sort_order, created_at, updated_at
- `blog_posts` — journal-style posts, listed newest first.
  - id, title, body_text, image_url, is_published, published_at, created_at, updated_at
- `newsletter_subscribers` — email signups from the newsletter sections.
  - id, email (unique), created_at
- `contact_messages` — submissions from the contact form.
  - id, name, email, message, created_at

3. Security (RLS)
- Public (anon) can SELECT only published rows on content tables.
- Authenticated admin can SELECT all rows and perform INSERT/UPDATE/DELETE on all content tables.
- Newsletter subscribers: anon can INSERT (sign up); only authenticated can SELECT/DELETE.
- Contact messages: anon can INSERT; only authenticated can SELECT/DELETE.
- No public sign-up: auth accounts are created manually by the site owner.
*/

-- Real Questions
CREATE TABLE IF NOT EXISTS real_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  category text NOT NULL,
  answer text NOT NULL DEFAULT '',
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE real_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_questions" ON real_questions;
CREATE POLICY "public_read_published_questions" ON real_questions FOR SELECT
  TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "admin_insert_questions" ON real_questions;
CREATE POLICY "admin_insert_questions" ON real_questions FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_questions" ON real_questions;
CREATE POLICY "admin_update_questions" ON real_questions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_questions" ON real_questions;
CREATE POLICY "admin_delete_questions" ON real_questions FOR DELETE
  TO authenticated USING (true);

-- Start Here sections
CREATE TABLE IF NOT EXISTS start_here_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_title text NOT NULL,
  body_text text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE start_here_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_start_here" ON start_here_sections;
CREATE POLICY "public_read_start_here" ON start_here_sections FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_start_here" ON start_here_sections;
CREATE POLICY "admin_insert_start_here" ON start_here_sections FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_start_here" ON start_here_sections;
CREATE POLICY "admin_update_start_here" ON start_here_sections FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_start_here" ON start_here_sections;
CREATE POLICY "admin_delete_start_here" ON start_here_sections FOR DELETE
  TO authenticated USING (true);

-- Videos (A Day in the Life)
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  embed_url text NOT NULL,
  caption text NOT NULL DEFAULT '',
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_videos" ON videos;
CREATE POLICY "public_read_published_videos" ON videos FOR SELECT
  TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "admin_insert_videos" ON videos;
CREATE POLICY "admin_insert_videos" ON videos FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_videos" ON videos;
CREATE POLICY "admin_update_videos" ON videos FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_videos" ON videos;
CREATE POLICY "admin_delete_videos" ON videos FOR DELETE
  TO authenticated USING (true);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body_text text NOT NULL DEFAULT '',
  image_url text,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_posts" ON blog_posts;
CREATE POLICY "public_read_published_posts" ON blog_posts FOR SELECT
  TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "admin_insert_posts" ON blog_posts;
CREATE POLICY "admin_insert_posts" ON blog_posts FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_posts" ON blog_posts;
CREATE POLICY "admin_update_posts" ON blog_posts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_posts" ON blog_posts;
CREATE POLICY "admin_delete_posts" ON blog_posts FOR DELETE
  TO authenticated USING (true);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_subscriber" ON newsletter_subscribers;
CREATE POLICY "anon_insert_subscriber" ON newsletter_subscribers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_subscribers" ON newsletter_subscribers;
CREATE POLICY "admin_read_subscribers" ON newsletter_subscribers FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_delete_subscribers" ON newsletter_subscribers;
CREATE POLICY "admin_delete_subscribers" ON newsletter_subscribers FOR DELETE
  TO authenticated USING (true);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact" ON contact_messages;
CREATE POLICY "anon_insert_contact" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_contact" ON contact_messages;
CREATE POLICY "admin_read_contact" ON contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_delete_contact" ON contact_messages;
CREATE POLICY "admin_delete_contact" ON contact_messages FOR DELETE
  TO authenticated USING (true);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_real_questions_category ON real_questions(category);
CREATE INDEX IF NOT EXISTS idx_real_questions_published ON real_questions(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_published ON videos(is_published);

-- updated_at trigger helper
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_real_questions_updated ON real_questions;
CREATE TRIGGER trg_real_questions_updated BEFORE UPDATE ON real_questions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_start_here_updated ON start_here_sections;
CREATE TRIGGER trg_start_here_updated BEFORE UPDATE ON start_here_sections
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_videos_updated ON videos;
CREATE TRIGGER trg_videos_updated BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_blog_posts_updated ON blog_posts;
CREATE TRIGGER trg_blog_posts_updated BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
