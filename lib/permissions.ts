export type Role = 'student' | 'staff' | 'technician' | 'admin'

export type Permission =
  | 'tickets:create'
  | 'tickets:read:own'
  | 'tickets:read:assigned'
  | 'tickets:read:all'
  | 'tickets:update:assigned'
  | 'tickets:update:all'
  | 'tickets:assign:self'
  | 'tickets:assign:any'
  | 'tickets:resolve:assigned'
  | 'tickets:close:own'
  | 'tickets:delete:any'
  | 'comments:create:public'
  | 'comments:create:internal'
  | 'comments:read:internal'
  | 'kb:read'
  | 'kb:write'
  | 'users:manage'
  | 'users:create:technician'
  | 'categories:manage'
  | 'reports:view'
  | 'sla:configure'
  | 'roles:assign'
  | 'users:impersonate'
  | 'role-requests:create'
  | 'role-requests:review'

const rolePermissions: Record<Role, Permission[]> = {
  student: [
    'tickets:create',
    'tickets:read:own',
    'tickets:close:own',
    'comments:create:public',
    'kb:read',
    'role-requests:create',
  ],
  // staff priority enforced in ticketActions.ts, not here
  staff: [
    'tickets:create',
    'tickets:read:own',
    'tickets:close:own',
    'comments:create:public',
    'kb:read',
  ],
  technician: [
    'tickets:read:assigned',
    'tickets:update:assigned',
    'tickets:assign:self',
    'tickets:resolve:assigned',
    'comments:create:public',
    'comments:create:internal',
    'comments:read:internal',
    'kb:read',
  ],
  admin: [
    'tickets:create',
    'tickets:read:own',
    'tickets:read:assigned',
    'tickets:read:all',
    'tickets:update:assigned',
    'tickets:update:all',
    'tickets:assign:self',
    'tickets:assign:any',
    'tickets:resolve:assigned',
    'tickets:close:own',
    'tickets:delete:any',
    'comments:create:public',
    'comments:create:internal',
    'comments:read:internal',
    'kb:read',
    'kb:write',
    'users:manage',
    'users:create:technician',
    'categories:manage',
    'reports:view',
    'sla:configure',
    'roles:assign',
    'users:impersonate',
    'role-requests:review',
  ],
}

export interface PermissionContext {
  userId?: string
  resourceOwnerId?: string
  assignedToId?: string
}

export function can(
  role: Role,
  permission: Permission,
  context?: PermissionContext
): boolean {
  const allowed = rolePermissions[role]?.includes(permission) ?? false
  if (!allowed) return false

  if (permission === 'tickets:read:own' || permission === 'tickets:close:own') {
    return context?.userId === context?.resourceOwnerId
  }
  if (
    permission === 'tickets:update:assigned' ||
    permission === 'tickets:resolve:assigned'
  ) {
    return context?.userId === context?.assignedToId
  }

  return true
}
