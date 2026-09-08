/* Side-effect CSS imports. tsc needs to be told these are modules; the bundler
   in each consuming app is what actually resolves and injects them. */
declare module '*.css'
