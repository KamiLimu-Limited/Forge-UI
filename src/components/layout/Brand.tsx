// The Forge logo: a teal mark with a black "F", then the FORGE wordmark.
// The wordmark is the logo, so it stays uppercase.
export function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="flex size-brand-mark shrink-0 items-center justify-center rounded-md bg-teal-500 font-mono text-subheading font-bold text-text-on-primary"
      >
        F
      </span>
      <span className="font-mono text-subheading font-bold tracking-wide text-text-primary">
        FORGE
      </span>
    </div>
  )
}
