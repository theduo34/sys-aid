interface AuthLayoutProps {
  title: string
  children: React.ReactNode
}

export function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-lg font-semibold text-foreground">SysAid</h1>
          <p className="mt-1 text-sm text-muted-foreground">{title}</p>
        </div>
        <div className="border border-border bg-card p-6">{children}</div>
      </div>
    </div>
  )
}
