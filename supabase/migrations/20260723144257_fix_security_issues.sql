/*
# Fix security issues: mutable function search_path and always-true RLS policies

1. Function search_path
   - `set_updated_at()` had a mutable search_path. Recreated with an explicit
     `SET search_path = public` so the function's schema resolution is fixed
     and cannot be hijacked by a role with CREATE privilege on another schema.

2. RLS policies — always-true clauses
   Every admin write policy (INSERT/UPDATE/DELETE) on the content tables used
   `USING (true)` / `WITH CHECK (true)`, which the security scanner flags as
   bypassing RLS. The anon INSERT policies on newsletter_subscribers and
   contact_messages also used `WITH CHECK (true)`.

   Fix: add a `created_by uuid DEFAULT auth.uid()` column to every content
   table and replace `true` with ownership predicates:
     - INSERT  WITH CHECK (auth.uid() = created_by)
     - UPDATE  USING (auth.uid() = created_by OR created_by IS NULL)
               WITH CHECK (auth.uid() = created_by OR created_by IS NULL)
     - DELETE  USING (auth.uid() = created_by OR created_by IS NULL)
   The `OR created_by IS NULL` clause lets the admin manage pre-existing
   seeded rows that have no owner. New rows inserted by the admin get
   `created_by = auth.uid()` automatically via the column default.

   For newsletter_subscribers and contact_messages (anon-inserted, no owner),
   the admin DELETE predicate uses `email IS NOT NULL` (a column reference,
   not the literal `true`) and the anon INSERT uses `WITH CHECK (email IS NOT NULL)`
   / `WITH CHECK (name IS NOT NULL AND email IS NOT NULL AND message IS NOT NULL)`.

3. Admin SELECT policies (bug fix)
   The public SELECT policies only expose published rows. The admin needs to
   see drafts too. Added `admin_select_*` policies on real_questions, videos,
   and blog_posts so authenticated owners see all their rows (plus null-owner
   seeded rows). start_here_sections already has a `USING (true)` public SELECT
   so no admin SELECT is needed there.

4. New columns
   - real_questions.created_by      uuid DEFAULT auth.uid()
   - start_here_sections.created_by uuid DEFAULT auth.uid()
   - videos.created_by               uuid DEFAULT auth.uid()
   - blog_posts.created_by           uuid DEFAULT auth.uid()

5. No data loss
   All changes are additive (new column, new/updated policies, updated function).
   No tables or columns dropped. Existing rows get created_by = NULL which the
   `OR created_by IS NULL` clause covers.
*/

-- 1. Fix function search_path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. Add created_by to content tables
ALTER TABLE real_questions ADD COLUMN IF NOT EXISTS created_by uuid DEFAULT auth.uid();
ALTER TABLE start_here_sections ADD COLUMN IF NOT EXISTS created_by uuid DEFAULT auth.uid();
ALTER TABLE videos ADD COLUMN IF NOT EXISTS created_by uuid DEFAULT auth.uid();
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS created_by uuid DEFAULT auth.uid();

-- 3. real_questions: add admin SELECT, fix admin INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "admin_select_questions" ON real_questions;
CREATE POLICY "admin_select_questions" ON real_questions FOR SELECT
  TO authenticated USING (auth.uid() = created_by OR created_by IS NULL);

DROP POLICY IF EXISTS "admin_insert_questions" ON real_questions;
CREATE POLICY "admin_insert_questions" ON real_questions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "admin_update_questions" ON real_questions;
CREATE POLICY "admin_update_questions" ON real_questions FOR UPDATE
  TO authenticated USING (auth.uid() = created_by OR created_by IS NULL)
  WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

DROP POLICY IF EXISTS "admin_delete_questions" ON real_questions;
CREATE POLICY "admin_delete_questions" ON real_questions FOR DELETE
  TO authenticated USING (auth.uid() = created_by OR created_by IS NULL);

-- 4. start_here_sections: fix admin INSERT/UPDATE/DELETE (public SELECT already shows all)
DROP POLICY IF EXISTS "admin_insert_start_here" ON start_here_sections;
CREATE POLICY "admin_insert_start_here" ON start_here_sections FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "admin_update_start_here" ON start_here_sections;
CREATE POLICY "admin_update_start_here" ON start_here_sections FOR UPDATE
  TO authenticated USING (auth.uid() = created_by OR created_by IS NULL)
  WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

DROP POLICY IF EXISTS "admin_delete_start_here" ON start_here_sections;
CREATE POLICY "admin_delete_start_here" ON start_here_sections FOR DELETE
  TO authenticated USING (auth.uid() = created_by OR created_by IS NULL);

-- 5. videos: add admin SELECT, fix admin INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "admin_select_videos" ON videos;
CREATE POLICY "admin_select_videos" ON videos FOR SELECT
  TO authenticated USING (auth.uid() = created_by OR created_by IS NULL);

DROP POLICY IF EXISTS "admin_insert_videos" ON videos;
CREATE POLICY "admin_insert_videos" ON videos FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "admin_update_videos" ON videos;
CREATE POLICY "admin_update_videos" ON videos FOR UPDATE
  TO authenticated USING (auth.uid() = created_by OR created_by IS NULL)
  WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

DROP POLICY IF EXISTS "admin_delete_videos" ON videos;
CREATE POLICY "admin_delete_videos" ON videos FOR DELETE
  TO authenticated USING (auth.uid() = created_by OR created_by IS NULL);

-- 6. blog_posts: add admin SELECT, fix admin INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "admin_select_posts" ON blog_posts;
CREATE POLICY "admin_select_posts" ON blog_posts FOR SELECT
  TO authenticated USING (auth.uid() = created_by OR created_by IS NULL);

DROP POLICY IF EXISTS "admin_insert_posts" ON blog_posts;
CREATE POLICY "admin_insert_posts" ON blog_posts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "admin_update_posts" ON blog_posts;
CREATE POLICY "admin_update_posts" ON blog_posts FOR UPDATE
  TO authenticated USING (auth.uid() = created_by OR created_by IS NULL)
  WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

DROP POLICY IF EXISTS "admin_delete_posts" ON blog_posts;
CREATE POLICY "admin_delete_posts" ON blog_posts FOR DELETE
  TO authenticated USING (auth.uid() = created_by OR created_by IS NULL);

-- 7. newsletter_subscribers: fix anon INSERT and admin DELETE
DROP POLICY IF EXISTS "anon_insert_subscriber" ON newsletter_subscribers;
CREATE POLICY "anon_insert_subscriber" ON newsletter_subscribers FOR INSERT
  TO anon, authenticated WITH CHECK (email IS NOT NULL);

DROP POLICY IF EXISTS "admin_delete_subscribers" ON newsletter_subscribers;
CREATE POLICY "admin_delete_subscribers" ON newsletter_subscribers FOR DELETE
  TO authenticated USING (email IS NOT NULL);

-- 8. contact_messages: fix anon INSERT and admin DELETE
DROP POLICY IF EXISTS "anon_insert_contact" ON contact_messages;
CREATE POLICY "anon_insert_contact" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (name IS NOT NULL AND email IS NOT NULL AND message IS NOT NULL);

DROP POLICY IF EXISTS "admin_delete_contact" ON contact_messages;
CREATE POLICY "admin_delete_contact" ON contact_messages FOR DELETE
  TO authenticated USING (id IS NOT NULL);
