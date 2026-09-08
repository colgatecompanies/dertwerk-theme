# @dertwerk/theme

Appearance for every DertWerk application: the palette, light/dark, the
control that switches them, and the branded sign-in screen.

Public because the five apps that consume it build on AWS Amplify from private
repositories, and a private dependency would mean a credential in five build
environments plus a sixth to remember for the next app. Nothing in here is a
secret — design tokens, a toggle, and a wrapper around the Amplify
authenticator. It does name the `dw_ui` cookie and the `/me/ui-prefs` endpoint,
both of which are visible to anyone with the browser devtools open anyway.

## Using it

```
npm i github:colgatecompanies/dertwerk-theme#v1.0.0
```

```ts
// main.tsx — before createRoot, so the first paint is already right
import { bootstrapTheme } from '@dertwerk/theme'
bootstrapTheme()
```

```tsx
import ThemeToggle from '@dertwerk/theme/ThemeToggle'
import { BrandedAuthenticator } from '@dertwerk/theme/BrandedAuthenticator'
import '@dertwerk/theme/themetoggle.css'
```

## What the host app must provide

Three role tokens. The package deliberately does not guess at them, because
the answers genuinely differ between a marketing site and a dense product UI.

| token | what it answers |
|---|---|
| `--auth-mode` | `light` or `dark`, declared in each mode's scope. The sign-in screen reads it rather than inferring the mode from class names. |
| `--control-ink` | the ink of whatever the appearance control sits on — a page surface on the dertwerk sites, the brand-coloured bar in the products. |
| `--control-ground` | what is behind the control, used as the label colour once a button fills with `--control-ink`. |

`theme.css` carries the four palette scopes and is what the three dertwerk
sites import. The two product apps declare their own tokens, in the same
vocabulary, inside their `index.css`.

## The vocabulary

Names say the role, never the colour, because the colour moves:
`--ground --surface --surface-sunk --ink --ink-muted --ink-subtle --accent
--accent-strong --accent-edge --accent-ink --accent-wash --on-accent --link
--link-wash --edge --edge-strong`.

Two independent axes, both as classes on `<html>`, both always written
explicitly: `palette-gold` / absent, and `theme-dark` / `theme-light`.
No classes at all is Field/Dark, which is the default everywhere.
