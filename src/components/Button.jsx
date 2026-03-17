/* ─────────────────────────────────────────────────────────────────
   Button — oval CTA component
   Renders an <a> when href is provided, a <button> otherwise.
   variant: 'dark' | 'light' | 'gold' | 'ghost-dark' | 'ghost-light'
─────────────────────────────────────────────────────────────────── */
export default function Button({ label, href = '#', onClick, variant = 'dark', large = false }) {
  const isGhost = variant === 'ghost-dark' || variant === 'ghost-light'

  const classes = [
    'btn',
    variant === 'dark'        ? 'btn--primary-dark'  : '',
    variant === 'light'       ? 'btn--primary-light' : '',
    variant === 'gold'        ? 'btn--gold'          : '',
    isGhost                   ? 'btn--ghost'         : '',
    variant === 'ghost-dark'  ? 'btn--ghost-dark'    : '',
    variant === 'ghost-light' ? 'btn--ghost-light'   : '',
    large && !isGhost         ? 'btn--large'         : '',
  ].filter(Boolean).join(' ')

  const content = (
    <>
      <span className="btn__text">{label}</span>
      <span className="btn__arrow">→</span>
    </>
  )

  if (onClick) {
    return (
      <button className={classes} onClick={onClick}>
        {content}
      </button>
    )
  }

  return (
    <a href={href} className={classes}>
      {content}
    </a>
  )
}
