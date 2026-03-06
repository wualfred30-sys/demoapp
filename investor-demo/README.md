# Investor Demo

Dedicated investor-facing Next.js demo with a static-export-friendly architecture.

## Purpose

- remove dependency on the full app's providers and API routes
- support reliable hosting on a custom domain
- keep the demo focused on the investor narrative:
  - landing
  - registration
  - dashboard
  - digital ID rendering

## Local run

From `Investor_showcase_app/Investor_showcase_app`:

```powershell
cd investor-demo
..\node_modules\.bin\next.cmd dev
```

## Static build

```powershell
cd investor-demo
..\node_modules\.bin\next.cmd build
```

The static export is generated in `investor-demo/out`.

## Deploy target

Use a custom domain on a static host such as Cloudflare Pages or any host that can serve the `out` directory.
