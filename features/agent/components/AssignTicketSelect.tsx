'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { assignTicket } from '@/features/tickets/actions/ticketActions'
import { toast } from 'sonner'
import type { Profile } from '@/types/types_db'

const selectCls =
  'rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground ' +
  'focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer'

interface AssignTicketSelectProps {
  ticketId: string
  currentAssignee?: string | null
}

export function AssignTicketSelect({ ticketId, currentAssignee }: AssignTicketSelectProps) {
  const [technicians, setTechnicians] = useState<Pick<Profile, 'id' | 'full_name'>[]>([])
  const [prevProp, setPrevProp]       = useState(currentAssignee)
  const [assignee, setAssignee]       = useState(currentAssignee ?? '')
  const [saving, setSaving] = useState(false)

  // Sync controlled value when the prop changes (e.g. via realtime reassignment)
  if (prevProp !== currentAssignee) {
    setPrevProp(currentAssignee)
    setAssignee(currentAssignee ?? '')
  }

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, full_name')
      .eq('role', 'technician')
      .order('full_name')
      .then(({ data }) => setTechnicians(data ?? []))
  }, [])

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value
    setSaving(true)
    try {
      const { error } = await assignTicket(ticketId, value)
      if (error) {
        toast.error('Failed to assign ticket.')
      } else {
        setAssignee(value)
        toast.success(value ? 'Ticket assigned.' : 'Assignment removed.')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <select
      value={assignee}
      onChange={handleChange}
      disabled={saving}
      className={selectCls}
    >
      <option value="">Unassigned</option>
      {technicians.map((t) => (
        <option key={t.id} value={t.id}>{t.full_name}</option>
      ))}
    </select>
  )
}
