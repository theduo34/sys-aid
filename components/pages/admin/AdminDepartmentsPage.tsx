'use client'

import { useAdminData } from '@/features/admin/hooks/useAdminData'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Avatar } from '@/components/shared/Avatar'
import { EmptyState } from '@/components/shared/EmptyState'

function groupByDepartment<T extends { department?: string | null }>(items: T[]) {
  const map = new Map<string, T[]>()
  items.forEach((item) => {
    const dept = item.department ?? 'Unassigned'
    if (!map.has(dept)) map.set(dept, [])
    map.get(dept)!.push(item)
  })
  return map
}

export function AdminDepartmentsPage() {
  const { users, categories, isLoading } = useAdminData()

  if (isLoading) return <LoadingSpinner />

  const technicians = users.filter((u) => u.role === 'technician')
  const techByDept  = groupByDepartment(technicians)
  const catByDept   = groupByDepartment(categories)

  const allDepts = new Set([
    ...Array.from(techByDept.keys()),
    ...Array.from(catByDept.keys()),
  ])

  if (!allDepts.size || (allDepts.size === 1 && allDepts.has('Unassigned') && !technicians.length)) {
    return (
      <EmptyState
        message="No departments configured."
        description="Add departments to technician profiles and ticket categories to enable auto-assignment."
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs text-muted-foreground">
        Departments are derived from technician profiles and category configuration. To add a technician to a department, edit their profile in the Users tab.
      </p>

      <div className="flex flex-col gap-4">
        {Array.from(allDepts).sort().map((dept) => {
          const deptTechs = techByDept.get(dept) ?? []
          const deptCats  = catByDept.get(dept)  ?? []

          return (
            <div key={dept} className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="border-b border-border bg-muted/40 px-4 py-2.5">
                <h3 className="text-sm font-semibold text-foreground">{dept}</h3>
              </div>

              <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
                <div className="flex flex-col gap-2 px-4 py-3">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Technicians ({deptTechs.length})
                  </span>
                  {deptTechs.length ? (
                    <div className="flex flex-col gap-1.5">
                      {deptTechs.map((t) => (
                        <div key={t.id} className="flex items-center gap-2">
                          <Avatar name={t.full_name} className="size-6 text-[10px]" />
                          <span className="text-sm text-foreground">{t.full_name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No technicians in this department.</p>
                  )}
                </div>

                <div className="flex flex-col gap-2 px-4 py-3">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Categories ({deptCats.length})
                  </span>
                  {deptCats.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {deptCats.map((c) => (
                        <span key={c.id} className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-foreground">
                          {c.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No categories linked.</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
