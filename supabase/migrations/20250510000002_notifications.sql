-- ==============================
-- Notifications
-- ==============================

CREATE TABLE public.notifications (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type       text        NOT NULL,
  title      text        NOT NULL,
  body       text,
  -- Relative path from the user's base: e.g. 'tickets/abc' | 'queue' | 'users'
  link       text,
  read_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_id    ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can read and mark-read their own notifications
CREATE POLICY "notifications: users read own"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "notifications: users update own"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- SECURITY DEFINER function — bypasses RLS so server actions can create
-- notifications for any user without needing a permissive INSERT policy.
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id uuid,
  p_type    text,
  p_title   text,
  p_body    text,
  p_link    text DEFAULT NULL
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  INSERT INTO public.notifications (user_id, type, title, body, link)
  VALUES (p_user_id, p_type, p_title, p_body, p_link);
$$;

-- Enable realtime so the client subscription fires on INSERT
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
