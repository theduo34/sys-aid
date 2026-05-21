-- Allow any authenticated user to read all profiles.
--
-- Context: without this, technicians viewing a ticket could not read the
-- submitter's profile (the created_by JOIN returned null) because the
-- existing SELECT policy only allows users to read their own row.
-- On a help desk platform every logged-in user legitimately needs to see
-- names and roles of other users — e.g. a technician seeing who submitted a
-- ticket, or a student seeing which technician is assigned to their ticket.
--
-- Existing SELECT policies are OR-combined with this one, so they remain in
-- place and still cover UPDATE/INSERT/DELETE rules independently.

CREATE POLICY "profiles: all authenticated users can read any profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);
