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
 * Hand-copied into five repos and byte-identical in all five. Nothing
 * enforces that yet, so mirror any edit by hand.
 */
export type Palette = 'gold' | 'field';
export type Mode = 'light' | 'dark';
export interface ThemeChoice {
    palette: Palette;
    mode: Mode;
}
export declare const DEFAULT_THEME: ThemeChoice;
export declare function readCookie(): ThemeChoice | null;
export declare function writeCookie(choice: ThemeChoice): void;
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
export declare function applyTheme(choice: ThemeChoice): void;
/**
 * Call before React mounts. Synchronous and dependency-free by design --
 * anything async here reintroduces the flash of the wrong theme.
 */
export declare function bootstrapTheme(): ThemeChoice;
/** Local write: apply, and remember on this browser. */
export declare function setTheme(choice: ThemeChoice): void;
/**
 * Adopt what the account says, once /me has answered.
 *
 * Tolerates the fields being absent: they are null until somebody has
 * actually picked something, and a site that reset people to the default on
 * every load would be worse than one that simply keeps using its cookie.
 */
export declare function adoptServerTheme(me: {
    ui_palette?: string | null;
    ui_theme?: string | null;
}): ThemeChoice | null;
