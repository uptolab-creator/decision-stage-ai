// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// The Nitro deploy plugin only runs inside Lovable's cloud context; outside it
// we must force-enable it. Use the Vercel preset on Vercel, Cloudflare Pages
// preset everywhere else (the default Lovable deploy target).
const nitroConfig = process.env.VERCEL
  ? ({ nitro: { preset: "vercel" } } as const)
  : ({ nitro: { preset: "cloudflare-pages" } } as const);

export default defineConfig({
  ...nitroConfig,
  tanstackStart: {
    server: { entry: "server" },
  },
});
