/**
 * The palette + mode control.
 *
 * Two separate switches rather than one four-way cycle, because the axes are
 * genuinely independent: somebody may want Gold because they prefer it and
 * Light because of their room, and pairing them into one button makes two of
 * the four states reachable only by passing through a third.
 *
 * `persist` is optional and fires only on a real change. It is where the
 * account write goes; the local cookie is already handled by setTheme, so a
 * failed or absent server call costs nothing visible.
 */
import { readCookie, setTheme, type Mode, type Palette, type ThemeChoice } from './theme'

export default function ThemeToggle({
  value,
  onChange,
  persist,
  compact = false,
}: {
  value: ThemeChoice
  onChange: (next: ThemeChoice) => void
  persist?: (next: ThemeChoice) => void
  compact?: boolean
}) {
  // Merge against the cookie rather than the `value` prop. setTheme writes
  // it synchronously, so two clicks landing in one React batch still
  // compose -- against the prop, the second would silently undo the first.
  const commit = (patch: Partial<ThemeChoice>) => {
    const current = readCookie() ?? value
    const next: ThemeChoice = { ...current, ...patch }
    if (next.palette === current.palette && next.mode === current.mode) return
    setTheme(next)
    onChange(next)
    persist?.(next)
  }

  const pal = (p: Palette, label: string) => (
    <button
      type="button"
      className={value.palette === p ? 'themesw__btn themesw__btn--on' : 'themesw__btn'}
      aria-pressed={value.palette === p}
      onClick={() => commit({ palette: p })}
    >
      {label}
    </button>
  )

  const mode = (m: Mode, label: string, glyph: string) => (
    <button
      type="button"
      className={value.mode === m ? 'themesw__btn themesw__btn--on' : 'themesw__btn'}
      aria-pressed={value.mode === m}
      onClick={() => commit({ mode: m })}
      title={label}
    >
      <span aria-hidden="true">{glyph}</span>
      {!compact && <span className="themesw__lbl">{label}</span>}
    </button>
  )

  return (
    <div className="themesw" role="group" aria-label="Appearance">
      <div className="themesw__grp">
        {pal('gold', 'Gold')}
        {/* The stored value stays 'field'; only the label changes. "Field" is a
            first-class domain object in both products -- FSA Fields, Field
            List, Field Operations, the FIELD breadcrumb -- so a theme by that
            name competed with a word that already means a parcel of land. */}
        {pal('field', 'Green')}
      </div>
      <div className="themesw__grp">
        {mode('light', 'Light', '☀')}
        {mode('dark', 'Dark', '☾')}
      </div>
    </div>
  )
}
