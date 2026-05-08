-- Fix: allow ticket submitters (student/staff) to close their own resolved tickets.
-- The initial schema only covered technician + admin for UPDATE.

CREATE POLICY "tickets: submitters can close their own resolved tickets"
  ON public.tickets FOR UPDATE
  USING (created_by = auth.uid() AND status = 'resolved')
  WITH CHECK (status = 'closed');
