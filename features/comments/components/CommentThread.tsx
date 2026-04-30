'use client'

import { useComments } from '../hooks/useComments'
import { CommentItem } from './CommentItem'
import { CommentForm } from './CommentForm'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

interface CommentThreadProps {
  ticketId: string
}

export function CommentThread({ ticketId }: CommentThreadProps) {
  const { comments, isLoading } = useComments(ticketId)

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} />
        ))}
      </div>
      <CommentForm ticketId={ticketId} />
    </div>
  )
}
