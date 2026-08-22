# The Compendium v8.0

This build is the final integration/audit pass over the current feature set.

- Unified all local asset URLs under the v8.0 cache key so desktop and installed mobile builds pull the same code.
- Explicitly loads the achievement-state bridge so earned abilities are reconstructed from the actual bird collection rather than relying only on device-local UI state.
- Preserves earned/selected theme and font controls across mobile and desktop and completes the Khaki theme promised by Field Journal.
- Consolidates cosmetic achievement effects in an isolated ability layer so they do not mutate stored bird records.
- Adds an in-app Read Me link at the very bottom of the page with the full build history, credits, references, privacy/storage notes, maintenance notes and live capability diagnostics.
- Expands the repository README to document the current architecture and historical releases.
- Keeps the network-first service-worker strategy so deployment changes replace stale app files without intentionally touching IndexedDB collection data.

See `README.md` and the in-app **Read Me · build 8.0** screen for the complete history and source credits.
