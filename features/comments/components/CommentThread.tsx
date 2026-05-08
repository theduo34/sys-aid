'use client'

import { useComments } from '../hooks/useComments'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { CommentItem } from './CommentItem'
import { CommentForm } from './CommentForm'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

interface CommentThreadProps {
  ticketId: string
  showInternal?: boolean
  internalOnly?: boolean
}

export function CommentThread({ ticketId, showInternal = true, internalOnly = false }: CommentThreadProps) {
  const { comments, isLoading, refetch } = useComments(ticketId)
  const { user } = useAuth()

  const visible = comments.filter((c) => {
    if (internalOnly) return c.is_internal
    if (!showInternal) return !c.is_internal
    return true
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="flex flex-col gap-5">
      {visible.length === 0 ? (
        <EmptyState
          message={internalOnly ? 'No internal notes yet.' : 'No comments yet.'}
          description={internalOnly ? 'Use internal notes to communicate with other agents.' : 'Start the conversation below.'}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map((c) => <CommentItem key={c.id} comment={c} currentUserId={user?.id} />)}
        </div>
      )}
      <CommentForm ticketId={ticketId} onPosted={refetch} />
    </div>
  )
}
