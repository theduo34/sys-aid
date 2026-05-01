-- ============================================================
-- SysAid — University IT Help Desk
-- Initial schema migration
-- Run: bun supabase:start, then apply via Supabase Studio
--      or: bunx supabase db push
-- ============================================================

-- ==============================
-- Profiles
-- ==============================

CREATE TABLE public.profiles (
  id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   text        NOT NULL,
  role        text        NOT NULL DEFAULT 'student'
                          CHECK (role IN ('student', 'staff', 'technician', 'admin')),
  department  text,
  student_id  text,
  impersonated_by uuid   REFERENCES public.profiles(id),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Auto-create a profile row whenever a new auth user is registered.
-- The role always defaults to 'student' regardless of sign-up data.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================
-- Categories
-- ==============================

CREATE TABLE public.categories (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text        NOT NULL,
  department       text,
  default_priority text        NOT NULL DEFAULT 'medium'
                               CHECK (default_priority IN ('low', 'medium', 'high', 'critical')),
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ==============================
-- Tickets
-- ==============================

CREATE TABLE public.tickets (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text        NOT NULL,
  description    text        NOT NULL,
  status         text        NOT NULL DEFAULT 'open'
                             CHECK (status IN ('open', 'assigned', 'in_progress', 'pending', 'resolved', 'closed')),
  priority       text        NOT NULL DEFAULT 'medium'
                             CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  category_id    uuid        REFERENCES public.categories(id),
  created_by     uuid        NOT NULL REFERENCES public.profiles(id),
  assigned_to    uuid        REFERENCES public.profiles(id),
  attachment_url text,
  sla_deadline   timestamptz,
  resolved_at    timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER tickets_set_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ==============================
-- Comments
-- ==============================

CREATE TABLE public.comments (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id   uuid        NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  author_id   uuid        NOT NULL REFERENCES public.profiles(id),
  body        text        NOT NULL,
  is_internal boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ==============================
-- Knowledge Articles
-- ==============================

CREATE TABLE public.knowledge_articles (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text        NOT NULL,
  slug        text        NOT NULL UNIQUE,
  body        text        NOT NULL,
  category_id uuid        REFERENCES public.categories(id),
  created_by  uuid        REFERENCES public.profiles(id),
  published   boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER knowledge_articles_set_updated_at
  BEFORE UPDATE ON public.knowledge_articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ==============================
-- Role Requests
-- Students request promotion to 'staff'. Admin approves or rejects.
-- Technician accounts are created directly by admin — no request flow.
-- ==============================

CREATE TABLE public.role_requests (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid        NOT NULL REFERENCES public.profiles(id),
  requested_role text        NOT NULL DEFAULT 'staff'
                             CHECK (requested_role = 'staff'),
  reason         text,
  status         text        NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by    uuid        REFERENCES public.profiles(id),
  created_at     timestamptz NOT NULL DEFAULT now(),
  reviewed_at    timestamptz
);

-- Only one pending request per user at a time
CREATE UNIQUE INDEX role_requests_one_pending_per_user
  ON public.role_requests (user_id)
  WHERE status = 'pending';

-- ==============================
-- Impersonation Log
-- Append-only audit trail. No UPDATE or DELETE policies are defined.
-- ==============================

CREATE TABLE public.impersonation_log (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id       uuid        NOT NULL REFERENCES public.profiles(id),
  target_user_id uuid        NOT NULL REFERENCES public.profiles(id),
  started_at     timestamptz NOT NULL DEFAULT now(),
  ended_at       timestamptz,
  reason         text
);

-- ==============================
-- Indexes
-- ==============================

CREATE INDEX idx_tickets_created_by    ON public.tickets(created_by);
CREATE INDEX idx_tickets_assigned_to   ON public.tickets(assigned_to);
CREATE INDEX idx_tickets_status        ON public.tickets(status);
CREATE INDEX idx_tickets_sla_deadline  ON public.tickets(sla_deadline);
CREATE INDEX idx_tickets_priority      ON public.tickets(priority);
CREATE INDEX idx_comments_ticket_id    ON public.comments(ticket_id);
CREATE INDEX idx_role_requests_user    ON public.role_requests(user_id);
CREATE INDEX idx_role_requests_status  ON public.role_requests(status);

-- ==============================
-- Row Level Security
-- ==============================

ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_requests     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impersonation_log ENABLE ROW LEVEL SECURITY;

-- Helper: returns the current user's role without exposing the profiles table
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Profiles
CREATE POLICY "profiles: users read own, admin reads all"
  ON public.profiles FOR SELECT
  USING (id = auth.uid() OR public.get_my_role() = 'admin');

CREATE POLICY "profiles: users update own"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "profiles: admin updates any"
  ON public.profiles FOR UPDATE
  USING (public.get_my_role() = 'admin');

-- Tickets
CREATE POLICY "tickets: submitters see own, technicians and admins see all"
  ON public.tickets FOR SELECT
  USING (
    created_by = auth.uid()
    OR assigned_to = auth.uid()
    OR public.get_my_role() IN ('technician', 'admin')
  );

CREATE POLICY "tickets: students and staff can create"
  ON public.tickets FOR INSERT
  WITH CHECK (
    created_by = auth.uid()
    AND public.get_my_role() IN ('student', 'staff', 'admin')
  );

CREATE POLICY "tickets: technicians update assigned, admins update any"
  ON public.tickets FOR UPDATE
  USING (
    (public.get_my_role() = 'technician' AND assigned_to = auth.uid())
    OR public.get_my_role() = 'admin'
  );

CREATE POLICY "tickets: only admins delete"
  ON public.tickets FOR DELETE
  USING (public.get_my_role() = 'admin');

-- Comments
CREATE POLICY "comments: submitters read public comments on own tickets"
  ON public.comments FOR SELECT
  USING (
    (
      is_internal = false
      AND EXISTS (
        SELECT 1 FROM public.tickets
        WHERE id = ticket_id AND created_by = auth.uid()
      )
    )
    OR public.get_my_role() IN ('technician', 'admin')
  );

CREATE POLICY "comments: authenticated users can comment"
  ON public.comments FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND (
      is_internal = false
      OR public.get_my_role() IN ('technician', 'admin')
    )
  );

-- Categories
CREATE POLICY "categories: all roles can read"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "categories: only admins write"
  ON public.categories FOR ALL
  USING (public.get_my_role() = 'admin');

-- Knowledge articles
CREATE POLICY "articles: everyone reads published"
  ON public.knowledge_articles FOR SELECT
  USING (published = true OR public.get_my_role() = 'admin');

CREATE POLICY "articles: only admins write"
  ON public.knowledge_articles FOR ALL
  USING (public.get_my_role() = 'admin');

-- Role requests
CREATE POLICY "role_requests: students create own"
  ON public.role_requests FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND public.get_my_role() = 'student'
  );

CREATE POLICY "role_requests: users read own, admin reads all"
  ON public.role_requests FOR SELECT
  USING (
    user_id = auth.uid()
    OR public.get_my_role() = 'admin'
  );

CREATE POLICY "role_requests: only admins approve or reject"
  ON public.role_requests FOR UPDATE
  USING (public.get_my_role() = 'admin');

-- Impersonation log
CREATE POLICY "impersonation_log: admin insert only"
  ON public.impersonation_log FOR INSERT
  WITH CHECK (public.get_my_role() = 'admin');

CREATE POLICY "impersonation_log: admin read own entries"
  ON public.impersonation_log FOR SELECT
  USING (public.get_my_role() = 'admin');

-- No UPDATE or DELETE policies defined — the log is immutable by design.

-- ==============================
-- Seed: default categories
-- ==============================

INSERT INTO public.categories (name, department, default_priority) VALUES
  ('Network & Wi-Fi',        NULL,       'high'),
  ('Email & Account',        NULL,       'medium'),
  ('Hardware & Equipment',   NULL,       'medium'),
  ('Software & Applications',NULL,       'medium'),
  ('Printing',               NULL,       'low'),
  ('Projectors & AV',        'Academic', 'high'),
  ('Student Portal / LMS',   'Academic', 'medium'),
  ('Lab Computers',          'Academic', 'medium'),
  ('VPN & Remote Access',    NULL,       'medium'),
  ('Other',                  NULL,       'low');
