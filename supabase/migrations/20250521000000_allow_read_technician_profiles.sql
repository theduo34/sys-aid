-- Allow any authenticated user to read profiles where role = 'technician'.
-- This is required so the "Assign to technician" dropdown on the ticket form
-- is populated for students, staff, and technicians — not just admins.
-- RLS policies on the same table/command are OR-ed, so this extends the
-- existing "users read own, admin reads all" policy without replacing it.

CREATE POLICY "profiles: authenticated users can view technician profiles"
  ON public.profiles FOR SELECT
  USING (role = 'technician' AND auth.uid() IS NOT NULL);
