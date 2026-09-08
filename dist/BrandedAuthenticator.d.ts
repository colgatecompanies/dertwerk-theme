/**
 * Branded Amplify Authenticator — ships BYTE-IDENTICAL in all five dertwerk
 * apps (landing, admin, account, farmrx, fsacre) so the sign-in experience is
 * the same regardless of which subdomain somebody lands on first.
 *
 * If you change this file, mirror it to the other four (or extract to a
 * shared workspace package).
 *
 * It follows the palette. Every colour comes from the --auth-* tokens in
 * brandedAuthenticator.css, which is also shared — see that file for why
 * this screen carries its own palette rather than borrowing each app's.
 *
 * Owns:
 *   - Header (dertwerk logo + tagline)
 *   - Footer (copyright + tagline)
 *   - Theme overrides, mapped onto the --auth-* tokens
 *   - The login-page background/centering shell — ONLY while the user is
 *     unauthenticated. Once signed in, children render with NO shell wrap,
 *     so the app's own layout takes the full viewport (no width-cap, no
 *     stray black space above the nav).
 *
 * The CookieStorage shared-session setup lives in each app's main entry
 * point (App.tsx / main.tsx), not here, because it has to run before
 * Amplify.configure() resolves.
 */
import type { ReactNode } from 'react';
import '@aws-amplify/ui-react/styles.css';
import './brandedAuthenticator.css';
type ChildrenProps = {
    signOut?: () => void;
    user?: unknown;
};
interface Props {
    /** Render-prop children (Authenticator gives us {signOut, user}). */
    children?: ReactNode | ((props: ChildrenProps) => ReactNode);
    /** Optional logo path. Defaults to /brand/dertwerk-logo.png which exists in
     *  every dertwerk app's public/. Apps that don't have the logo asset will
     *  fall back to a text-only header (img onError hides it). */
    logoSrc?: string;
}
export declare function BrandedAuthenticator(props: Props): import("react").JSX.Element;
export {};
