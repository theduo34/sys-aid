import type { Comment, Profile } from '@/types/types_db'

export type { Comment }

export interface CommentWithAuthor extends Comment {
  author: Pick<Profile, 'id' | 'full_name' | 'role'> | null
}
