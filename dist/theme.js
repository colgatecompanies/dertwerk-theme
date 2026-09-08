/**
 * Palette + mode: storage, and the rules about which store wins.
 *
 * The preference is per-USER, not per-browser, so the real record lives on
 * the account (GET /me, PUT /me/ui-prefs) and follows somebody to a new
 * machine. But the server cannot be consulted before first paint -- that
 * needs a token and a round trip -- so a cookie carries it locally.
 *
 * Precedence, in order:
 *
 *   1. cookie, applied synchronously before React mounts (no flash)
 *   2. server, adopted once /me answers and overwriting the cookie if they differ
 *   3. Field/Dark, when neither has an opinion
 *
 * The cookie is set on `.dertwerk.com`, the same parent the SSO token uses,
 * so the choice already carries across landing -> account -> admin -> the
 * products without a round trip. On a shared browser the server correction
 * in step 2 is what stops one person's palette sticking to the next.
 *
 * Default is Field/Dark on purpose: it is what every dertwerk site renders,
 * so a signed-in customer moving between them sees one continuous product.
 *
 * Lives in @dertwerk/theme and is installed by every app, so there is exactly
 * one of it. It used to be hand-copied into five repos with nothing holding
 * the copies together, which is how a comment edited in one of them drifted
 * them apart inside an hour.
 */
export const DEFAULT_THEME = { palette: 'field', mode: 'dark' };
const COOKIE = 'dw_ui';
const ONE_YEAR = 60 * 60 * 24 * 365;
/**
 * There used to be a per-app MODE_CLASS constant here, because the two app
 * families spelled the mode axis with opposite polarity -- the sites wrote
 * `.theme-light`, the products `.theme-dark`, and each let the absence of its
 * own class mean the other mode. applyTheme now stamps both classes
 * explicitly, so the convention is identical everywhere and the constant is
 * gone along with the divergence it documented.
 */
function isDertwerkHost(hostname) {
    return hostname === 'dertwerk.com' || hostname.endsWith('.dertwerk.com');
}
function parse(raw) {
    if (!raw)
        return null;
    const [p, m] = raw.split(':');
    if ((p !== 'gold' && p !== 'field') || (m !== 'light' && m !== 'dark'))
        return null;
    return { palette: p, mode: m };
}
export function readCookie() {
    if (typeof document === 'undefined')
        return null;
    const hit = document.cookie
        .split('; ')
        .find((c) => c.startsWith(`${COOKIE}=`));
    return parse(hit?.slice(COOKIE.length + 1));
}
export function writeCookie(choice) {
    if (typeof document === 'undefined')
        return;
    const onDertwerk = isDertwerkHost(window.location.hostname);
    // No domain attribute on localhost: it has no shared parent, and setting
    // one there makes the browser silently drop the cookie.
    const domain = onDertwerk ? '; domain=.dertwerk.com' : '';
    const secure = onDertwerk ? '; secure' : '';
    document.cookie =
        `${COOKIE}=${choice.palette}:${choice.mode}` +
            `; path=/${domain}; max-age=${ONE_YEAR}; samesite=lax${secure}`;
}
/**
 * The one thing that actually changes what you see.
 *
 * Both mode classes are written explicitly, and always. Historically each
 * family wrote only one of them and let its absence mean the other -- the
 * sites wrote `.theme-light` (absent = dark), the products `.theme-dark`
 * (absent = light). That is why "no classes on <html>" meant opposite things
 * in the two families, and why anything shared between them had to be told
 * which convention it was living under.
 *
 * Stamping both removes the ambiguity without touching a single rule: the
 * products' `.theme-dark .foo` overrides still match in dark, the sites'
 * `:root.theme-light` token block still matches in light, and a stylesheet
 * shared by all five can now name both scopes and be right everywhere.
 *
 * The bare `:root` block in each app stays as the pre-script frame, for the
 * instant before bootstrapTheme() runs.
 */
export function applyTheme(choice) {
    const root = document.documentElement;
    root.classList.toggle('palette-gold', choice.palette === 'gold');
    root.classList.toggle('theme-dark', choice.mode === 'dark');
    root.classList.toggle('theme-light', choice.mode === 'light');
}
/**
 * Call before React mounts. Synchronous and dependency-free by design --
 * anything async here reintroduces the flash of the wrong theme.
 */
export function bootstrapTheme() {
    const choice = readCookie() ?? migrateLegacyLocalStorage() ?? DEFAULT_THEME;
    applyTheme(choice);
    return choice;
}
/**
 * FarmRx stored the mode in `localStorage('theme')` before the preference
 * became per-user. That store is per-origin, so it never followed anyone
 * between farmrx. and fsacre. and the dertwerk sites -- which is the whole
 * reason it is being retired.
 *
 * Read it once, so somebody who picked Light a year ago is not silently
 * reset to Dark on the deploy that switches stores, then delete it so this
 * never runs again. Palette has no legacy value; it starts at the default.
 */
function migrateLegacyLocalStorage() {
    if (typeof localStorage === 'undefined')
        return null;
    let legacy = null;
    try {
        legacy = localStorage.getItem('theme');
    }
    catch {
        // Private mode / storage disabled. Nothing to migrate.
        return null;
    }
    if (legacy !== 'light' && legacy !== 'dark')
        return null;
    const choice = { palette: DEFAULT_THEME.palette, mode: legacy };
    writeCookie(choice);
    try {
        localStorage.removeItem('theme');
    }
    catch { /* best effort */ }
    return choice;
}
/** Local write: apply, and remember on this browser. */
export function setTheme(choice) {
    applyTheme(choice);
    writeCookie(choice);
}
/**
 * Adopt what the account says, once /me has answered.
 *
 * Tolerates the fields being absent: they are null until somebody has
 * actually picked something, and a site that reset people to the default on
 * every load would be worse than one that simply keeps using its cookie.
 */
export function adoptServerTheme(me) {
    const fromServer = parse(me.ui_palette && me.ui_theme ? `${me.ui_palette}:${me.ui_theme}` : null);
    if (!fromServer)
        return null;
    const local = readCookie();
    if (local && local.palette === fromServer.palette && local.mode === fromServer.mode) {
        return fromServer;
    }
    setTheme(fromServer);
    return fromServer;
}
