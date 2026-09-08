import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Authenticator, ThemeProvider, useAuthenticator, } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './brandedAuthenticator.css';
/**
 * Which appearance is in force, read off <html>.
 *
 * `palette-gold` is spelled identically in all five apps, so the palette can
 * be read straight from the class list. The MODE cannot: the dertwerk sites
 * write `.theme-light` (absent = dark) and the product apps write
 * `.theme-dark` (absent = light), so "no classes" means opposite things in
 * the two families. Each app therefore declares `--auth-mode` once in its own
 * stylesheet, and that is the single thing this file relies on.
 *
 * Read at render rather than module load: bootstrapTheme() has already run by
 * then, and a stale module-level read would survive a toggle.
 */
function readAppearance() {
    if (typeof document === 'undefined')
        return { mode: 'dark', palette: 'field' };
    const root = document.documentElement;
    const declared = getComputedStyle(root).getPropertyValue('--auth-mode').trim();
    return {
        mode: declared === 'light' ? 'light' : 'dark',
        palette: root.classList.contains('palette-gold') ? 'gold' : 'field',
    };
}
// Amplify's own tokens, pointed at ours. Amplify emits these as CSS custom
// properties (--amplify-colors-brand-primary-60 and friends), so a `var()`
// on the right-hand side resolves normally at use time — which is what lets
// one theme object serve all four palette/mode combinations instead of four.
const brandedTheme = {
    name: 'dertwerk',
    tokens: {
        colors: {
            background: {
                primary: { value: 'var(--auth-bg)' },
                secondary: { value: 'var(--auth-card)' },
                tertiary: { value: 'var(--auth-inset)' },
            },
            font: {
                primary: { value: 'var(--auth-ink)' },
                secondary: { value: 'var(--auth-ink-dim)' },
                tertiary: { value: 'var(--auth-ink-faint)' },
                interactive: { value: 'var(--auth-accent-bright)' },
            },
            brand: {
                primary: {
                    10: { value: 'var(--auth-accent-pale)' },
                    20: { value: 'var(--auth-accent-pale)' },
                    40: { value: 'var(--auth-accent-bright)' },
                    60: { value: 'var(--auth-accent)' },
                    80: { value: 'var(--auth-accent-dim)' },
                    90: { value: 'var(--auth-accent-dim)' },
                    100: { value: 'var(--auth-accent-dim)' },
                },
            },
            border: {
                primary: { value: 'var(--auth-border)' },
                secondary: { value: 'var(--auth-border-soft)' },
            },
        },
        radii: {
            small: { value: '6px' },
            medium: { value: '10px' },
            large: { value: '14px' },
        },
        components: {
            authenticator: {
                router: {
                    backgroundColor: { value: 'var(--auth-card)' },
                    borderColor: { value: 'var(--auth-border-soft)' },
                    boxShadow: { value: '0 12px 40px var(--auth-card-shadow)' },
                },
            },
            button: {
                primary: {
                    backgroundColor: { value: 'var(--auth-accent)' },
                    color: { value: 'var(--auth-on-accent)' },
                    _hover: {
                        backgroundColor: { value: 'var(--auth-accent-dim)' },
                    },
                    _focus: {
                        backgroundColor: { value: 'var(--auth-accent-dim)' },
                    },
                },
                link: {
                    color: { value: 'var(--auth-accent-bright)' },
                    _hover: { color: { value: 'var(--auth-accent)' } },
                },
            },
            tabs: {
                item: {
                    color: { value: 'var(--auth-ink-dim)' },
                    _hover: { color: { value: 'var(--auth-accent-bright)' } },
                    _active: {
                        color: { value: 'var(--auth-accent-bright)' },
                        borderColor: { value: 'var(--auth-accent)' },
                    },
                },
            },
            fieldcontrol: {
                borderColor: { value: 'var(--auth-border)' },
                color: { value: 'var(--auth-ink)' },
                _focus: {
                    borderColor: { value: 'var(--auth-accent)' },
                    boxShadow: { value: '0 0 0 2px var(--auth-focus-ring)' },
                },
            },
        },
    },
};
function Header({ logoSrc }) {
    return (_jsxs("div", { className: "branded-auth__header", children: [_jsx("img", { className: "branded-auth__logo", src: logoSrc, alt: "DertWerk", onError: (e) => { e.currentTarget.style.display = 'none'; } }), _jsx("div", { className: "branded-auth__brand", children: "DertWerk" }), _jsx("div", { className: "branded-auth__tagline", children: "For those who work in the dirt." })] }));
}
function Footer() {
    return (_jsxs("div", { className: "branded-auth__footer", children: ["\u00A9 ", new Date().getFullYear(), " DertWerk \u00B7 Software for agriculture"] }));
}
function renderChildren(children, signOut, user) {
    if (typeof children === 'function') {
        return children({ signOut, user });
    }
    return children;
}
/**
 * Inner component — assumes Authenticator.Provider context is already in
 * scope (we wrap with it in the outer export). Conditionally renders:
 *   - authenticated: children directly, no shell wrap (the app owns layout)
 *   - anything else: the login UI inside the dark, centered shell
 *
 * This split is the F1/F2 fix: the previous version always wrapped with the
 * shell div, so its `display:flex; padding; dark background` bled into the
 * authed app's layout, width-capping it and adding black space above the nav.
 */
function BrandedAuthInner({ children, logoSrc = '/brand/dertwerk-logo.png' }) {
    const { authStatus, signOut, user } = useAuthenticator((ctx) => [
        ctx.authStatus,
        ctx.user,
    ]);
    if (authStatus === 'authenticated') {
        // Render children with no wrapping shell. The app's own layout takes
        // the full viewport (own theme, own background, own height).
        return _jsx(_Fragment, { children: renderChildren(children, signOut, user) });
    }
    // Unauthenticated — show the branded login UI centered in a full-page
    // dark substrate.
    const { mode, palette } = readAppearance();
    return (_jsx("div", { className: "branded-auth__shell", "data-auth-mode": mode, "data-auth-palette": palette, children: _jsx(ThemeProvider, { theme: brandedTheme, colorMode: mode, children: _jsx(Authenticator, { components: {
                    Header: () => _jsx(Header, { logoSrc: logoSrc }),
                    Footer,
                }, children: (props) => _jsx(_Fragment, { children: renderChildren(children, props.signOut, props.user) }) }) }) }));
}
export function BrandedAuthenticator(props) {
    return (_jsx(Authenticator.Provider, { children: _jsx(BrandedAuthInner, { ...props }) }));
}
