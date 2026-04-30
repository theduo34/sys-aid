// Auto-generated via `bun supabase:generate-types` — never edit manually
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Profile {
  id: string
  full_name: string
  role: 'student' | 'staff' | 'technician' | 'admin'
  department: string | null
  student_id: string | null
  impersonated_by: string | null
  created_at: string
}
export type ProfileInsert = Omit<Profile, 'created_at'>
export type ProfileUpdate = Partial<ProfileInsert>

export interface Ticket {
  id: string
  title: string
  description: string
  status: 'open' | 'assigned' | 'in_progress' | 'pending' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  category_id: string | null
  created_by: string
  assigned_to: string | null
  attachment_url: string | null
  sla_deadline: string | null
  resolved_at: string | null
  created_at: string
  updated_at: string
}
export type TicketInsert = Omit<Ticket, 'id' | 'created_at' | 'updated_at'>
export type TicketUpdate = Partial<TicketInsert>

export interface Comment {
  id: string
  ticket_id: string
  author_id: string
  body: string
  is_internal: boolean
  created_at: string
}
export type CommentInsert = Omit<Comment, 'id' | 'created_at'>
export type CommentUpdate = Partial<CommentInsert>

export interface Category {
  id: string
  name: string
  department: string | null
  default_priority: 'low' | 'medium' | 'high' | 'critical'
  created_at: string
}
export type CategoryInsert = Omit<Category, 'id' | 'created_at'>
export type CategoryUpdate = Partial<CategoryInsert>

export interface KnowledgeArticle {
  id: string
  title: string
  slug: string
  body: string
  category_id: string | null
  created_by: string | null
  published: boolean
  created_at: string
  updated_at: string
}
export type KnowledgeArticleInsert = Omit<KnowledgeArticle, 'id' | 'created_at' | 'updated_at'>
export type KnowledgeArticleUpdate = Partial<KnowledgeArticleInsert>

export interface ImpersonationLog {
  id: string
  admin_id: string
  target_user_id: string
  started_at: string
  ended_at: string | null
  reason: string | null
}
export type ImpersonationLogInsert = Omit<ImpersonationLog, 'id' | 'started_at'>
