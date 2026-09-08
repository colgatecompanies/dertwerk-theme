import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { readCookie, setTheme } from './theme';
export default function ThemeToggle({ value, onChange, persist, compact = false, }) {
    // Merge against the cookie rather than the `value` prop. setTheme writes
    // it synchronously, so two clicks landing in one React batch still
    // compose -- against the prop, the second would silently undo the first.
    const commit = (patch) => {
        const current = readCookie() ?? value;
        const next = { ...current, ...patch };
        if (next.palette === current.palette && next.mode === current.mode)
            return;
        setTheme(next);
        onChange(next);
        persist?.(next);
    };
    const pal = (p, label) => (_jsx("button", { type: "button", className: value.palette === p ? 'themesw__btn themesw__btn--on' : 'themesw__btn', "aria-pressed": value.palette === p, onClick: () => commit({ palette: p }), children: label }));
    const mode = (m, label, glyph) => (_jsxs("button", { type: "button", className: value.mode === m ? 'themesw__btn themesw__btn--on' : 'themesw__btn', "aria-pressed": value.mode === m, onClick: () => commit({ mode: m }), title: label, children: [_jsx("span", { "aria-hidden": "true", children: glyph }), !compact && _jsx("span", { className: "themesw__lbl", children: label })] }));
    return (_jsxs("div", { className: "themesw", role: "group", "aria-label": "Appearance", children: [_jsxs("div", { className: "themesw__grp", children: [pal('gold', 'Gold'), pal('field', 'Field')] }), _jsxs("div", { className: "themesw__grp", children: [mode('light', 'Light', '☀'), mode('dark', 'Dark', '☾')] })] }));
}
