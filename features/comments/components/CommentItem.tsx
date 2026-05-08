import { cn } from '@/lib/utils'
import { Avatar } from '@/components/shared/Avatar'
import { LockSimpleIcon } from '@phosphor-icons/react/dist/ssr'
import type { CommentWithAuthor } from '../types/comment.types'

interface CommentItemProps {
  comment: CommentWithAuthor
  currentUserId?: string
}

export function CommentItem({ comment, currentUserId }: CommentItemProps) {
  const author    = comment.author
  const isOwn     = !!currentUserId && comment.author_id === currentUserId
  const roleLabel = author?.role === 'technician' ? 'Agent' : author?.role === 'admin' ? 'Admin' : undefined

  return (
    <div className={cn(
      'flex gap-3 rounded-lg px-4 py-3',
      comment.is_internal
        ? 'border-l-2 border-warning bg-warning/5'
        : isOwn
        ? 'border border-primary/20 bg-primary/5'
        : 'border border-border bg-card'
    )}>
      {!isOwn && (
        <Avatar name={author?.full_name ?? '?'} className="size-7 shrink-0 text-[11px] mt-0.5" />
      )}

      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {isOwn ? (
            <span className="ms-auto text-xs font-semibold text-primary">You</span>
          ) : (
            <span className="text-xs font-semibold text-foreground">{author?.full_name ?? 'Deleted user'}</span>
          )}
          {roleLabel && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wide">
              {roleLabel}
            </span>
          )}
          {comment.is_internal && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-warning-foreground">
              <LockSimpleIcon className="size-3" />
              Internal
            </span>
          )}
          <span className={cn('text-xs text-muted-foreground', isOwn ? '' : 'ms-auto')}>
            {new Date(comment.created_at).toLocaleString('en-GB', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
            })}
          </span>
        </div>
        <p className={cn('text-sm text-foreground leading-relaxed', isOwn && 'text-right')}>
          {comment.body}
        </p>
      </div>

      {isOwn && (
        <Avatar name={author?.full_name ?? '?'} className="size-7 shrink-0 text-[11px] mt-0.5" />
      )}
    </div>
  )
}
