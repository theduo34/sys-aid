import { cn } from '@/lib/utils'
import type { CommentWithAuthor } from '../types/comment.types'

interface CommentItemProps {
  comment: CommentWithAuthor
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className={cn(
      'flex flex-col gap-1 p-3',
      comment.is_internal && 'border-l-2 border-warning bg-muted'
    )}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-foreground">{comment.author.full_name}</span>
        {comment.is_internal && (
          <span className="text-xs text-warning">Internal</span>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          {new Date(comment.created_at).toLocaleString()}
        </span>
      </div>
      <p className="text-sm text-foreground">{comment.body}</p>
    </div>
  )
}
