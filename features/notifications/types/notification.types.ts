export interface DbNotification {
  id:         string
  user_id:    string
  type:       string
  title:      string
  body:       string | null
  link:       string | null
  read_at:    string | null
  created_at: string
}
