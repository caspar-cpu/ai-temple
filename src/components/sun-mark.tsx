export function SunMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="4.5" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <line x1="16" y1="9" x2="16" y2="5" />
        <line x1="16" y1="27" x2="16" y2="23" />
        <line x1="9" y1="16" x2="5" y2="16" />
        <line x1="27" y1="16" x2="23" y2="16" />
        <line x1="11" y1="11" x2="8" y2="8" />
        <line x1="24" y1="24" x2="21" y2="21" />
        <line x1="11" y1="21" x2="8" y2="24" />
        <line x1="24" y1="8" x2="21" y2="11" />
      </g>
    </svg>
  );
}
