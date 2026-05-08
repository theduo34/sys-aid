-- Allow technicians to create their own tickets (they may need IT support too)
-- Replaces the previous "students and staff only" INSERT policy

DROP POLICY IF EXISTS "tickets: students and staff can create" ON public.tickets;

CREATE POLICY "tickets: authenticated users can create"
  ON public.tickets FOR INSERT
  WITH CHECK (
    created_by = auth.uid()
    AND public.get_my_role() IN ('student', 'staff', 'technician', 'admin')
  );
