'use client'

import { useState } from 'react'
import { createTicket } from '../actions/ticketActions'
import { toast } from 'sonner'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { CreateTicketInput } from '@/lib/validations/ticket'

export function useCreateTicket() {
  const { role } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(data: CreateTicketInput) {
    if (!role) return
    setIsSubmitting(true)

    const { error } = await createTicket(data, role)

    if (error) {
      toast.error('Failed to submit ticket.')
    } else {
      toast.success('Ticket submitted.')
    }

    setIsSubmitting(false)
  }

  return { submit, isSubmitting }
}
