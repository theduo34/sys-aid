interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 96"
      role="img"
      aria-label="SysAid Help Desk"
      className={className}
    >
      <g fill="currentColor">
        <path
          d="M 14 56 A 34 34 0 0 1 82 56"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <rect x="6"  y="54" width="18" height="26" rx="6" />
        <rect x="72" y="54" width="18" height="26" rx="6" />
        <path
          d="M 81 80 Q 81 94 67 96"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
      {/* Accent dot — always blue */}
      <circle cx="67" cy="96" r="5" fill="#4F8AF7" />
      <text
        x="110" y="60"
        fontFamily="ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
        fontSize="26"
        fontWeight="600"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        SysAid
      </text>
      <text
        x="110" y="80"
        fontFamily="ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
        fontSize="10"
        fill="currentColor"
        opacity="0.6"
        letterSpacing="2.5"
      >
        HELP DESK
      </text>
    </svg>
  )
}
