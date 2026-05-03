'use client'

import Link from 'next/link'
import { PlusIcon } from '@phosphor-icons/react'
import { useBasePath } from '@/hooks/useBasePath'
import { TicketList } from '@/features/tickets/components/TicketList'
import { Button } from '@/components/ui/button'

export function TicketsPage() {
  const base = useBasePath()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button asChild size="sm">
          <Link href={`${base}/tickets/new`}>
            <PlusIcon data-icon="inline-start" />
            New Ticket
          </Link>
        </Button>
      </div>
      <TicketList />
    </div>
  )
}
