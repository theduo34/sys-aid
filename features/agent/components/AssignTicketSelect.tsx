'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { assignTicket } from '@/features/tickets/actions/ticketActions'
import { toast } from 'sonner'
import type { Profile } from '@/types/types_db'

interface AssignTicketSelectProps {
  ticketId: string
  currentAssignee?: string | null
}

export function AssignTicketSelect({ ticketId, currentAssignee }: AssignTicketSelectProps) {
  const [technicians, setTechnicians] = useState<Pick<Profile, 'id' | 'full_name'>[]>([])

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, full_name')
      .eq('role', 'technician')
      .then(({ data }) => setTechnicians(data ?? []))
  }, [])

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { error } = await assignTicket(ticketId, e.target.value)
    if (error) toast.error('Failed to assign ticket.')
    else toast.success('Ticket assigned.')
  }

  return (
    <select
      defaultValue={currentAssignee ?? ''}
      onChange={handleChange}
      className="border border-border bg-background px-2 py-1 text-sm text-foreground"
    >
      <option value="">Unassigned</option>
      {technicians.map((t) => (
        <option key={t.id} value={t.id}>{t.full_name}</option>
      ))}
    </select>
  )
}
