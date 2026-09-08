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
import { type ThemeChoice } from './theme';
export default function ThemeToggle({ value, onChange, persist, compact, }: {
    value: ThemeChoice;
    onChange: (next: ThemeChoice) => void;
    persist?: (next: ThemeChoice) => void;
    compact?: boolean;
}): import("react").JSX.Element;
