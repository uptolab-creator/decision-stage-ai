// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// On Vercel there is no Lovable build context, so the Nitro deploy plugin is
// skipped by default and the build won't produce Vercel output. Force-enable
// Nitro with the Vercel preset only when building on Vercel (VERCEL=1), so the
// default Lovable/Cloudflare deploy path stays untouched.
const vercelNitro = process.env.VERCEL ? { nitro: { preset: "vercel" } as const } : {};

export default defineConfig({
  ...vercelNitro,
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
