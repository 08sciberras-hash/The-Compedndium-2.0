# The Compendium

The Compendium is a personal, installable bird-recording web app designed for a long-running collection across mobile and desktop. It combines a photographic species catalogue with sightings, family browsing, rarity classes, points, achievements, reference material and cross-device sync.

## Current build: v8.0

Core collection features include species tiles, common and scientific names, rarity classes, country data, multiple sightings, dates, locations, notes, multiple photos per sighting, editable main photos, search and sorting. The app stores its working collection in IndexedDB and can synchronise structured data and photos through Supabase when signed in.

The Families section is based on IOC/World Bird List family classification and includes acquired and mystery species. Mystery cards can show Sydney-centred suggested regions, Google Maps destinations, representative photographs and bird audio where suitable. Acquired cards can show family links, reference photographs, sounds and full-screen read-only photo cards.

The game layer includes rarity-based points, achievement bonus points, trophies, items and unlockable cosmetic abilities. Theme and font selectors are intentionally unavailable until the relevant achievements are earned.

## Version history

### v1 — Original Compendium
Tile-based bird collection, rarity classes, search/sort, sightings, photos, notes, iNaturalist lookup, IndexedDB storage and the installable PWA shell.

### v2 — Icon + deletion
Added the three-bird application icon and safe bird deletion with confirmation.

### v3 — Editing overhaul
Fixed species editing, added per-sighting edit/delete controls, main-photo management and the multiple-sighting badge.

### v4 — Cloud sync
Added Supabase account sync and private photo storage so the same collection can be used across devices. The service worker moved to network-first same-origin loading to reduce stale iPhone deployments.

### v5 series — Collection expansion
Added country fields and country sorting; rarity suggestions based on the entered sighting place; family browsing and family search; IOC-style family/species indexes; acquired and mystery family tiles; Sydney-centred suggested regions; and Google Maps links.

### v6 series — Reference + game systems
Added curated/adult-preferred reference photographs, acquired-card family links, desktop background birds, the rarity point counter, achievements, trophies, items and achievement-linked cosmetic abilities.

### v7.0 — Achievement rewards
Added point rewards and ability rewards. Theme/font controls became achievement unlocks instead of permanent controls.

### v7.1 — Achievement data fixes
Connected species-specific achievements to saved Compendium data and added shorter Sydney/species challenges.

### v7.2 — Stable achievements
Removed a self-triggering achievement render loop and stabilised refresh behaviour.

### v7.3 — Swoop experiment
Attempted the Welcome Swallow card-opening effect; this build was rolled back because it interfered with achievement state.

### v7.4 — Isolated Welcome Swallow
Moved the swallow effect into its own feature layer so it could not rewrite achievements.

### v7.5 — Achievement data bridge
Improved species matching using aliases and scientific names so existing saved birds correctly satisfy species-specific achievements.

### v7.6–v7.8 — Card stability pass
Separated feature scripts and removed observer behaviour that could cause opened cards to lock up or repeatedly refresh.

### v7.9–v7.11 — Bird audio + silent-species notes
Added acquired and mystery-card sound playback, Wikimedia Commons sourcing and conservative notes for species with no typical vocal call.

### v7.12 — Sound quality control
Changed audio selection from first-match behaviour to scored species-matched recordings with penalties for juveniles, captive recordings, mixed-species audio and other poor references.

### v7.13 — Iconic-call rules
Added stricter handling for well-known calls such as kookaburras, magpies, currawongs, ravens, cockatoos and koels.

### v7.14 — Verified iconic recordings
Added pinned/verified handling for key iconic recordings where reliable source material was available.

### v7.15 — Sighting photo expansion
Made saved sighting photographs expandable.

### v7.16 — Photo/card handoff
Opening a sighting image closes the underlying bird card first.

### v7.17 — Full-screen photo cards
Expanded sighting and reference images became read-only full-screen species cards with names, scientific names, date/location metadata and sighting-note captions. Mystery locations attempt English/Latin-alphabet place-name presentation where resolvable.

### v7.18 — Mobile achievement reconciliation
Rebuilt earned achievement abilities from the actual saved bird database on each device so synced collections can restore earned theme/font controls on phone and desktop.

### v8.0 — Final audit + documentation
Unified cache versions, explicitly loaded the achievement-state bridge, completed the Khaki theme, consolidated ability effects and added the in-app Read Me with build diagnostics, changelog, credits, references, data/privacy notes and maintenance information.

## Credits and references

- **iNaturalist** — taxon/species lookup, observation counts used by rarity suggestions, reference photographs and observation metadata. Individual image attribution is preserved when available from the source.
- **International Ornithologists’ Union / IOC World Bird List** — family classification source used to structure the Families index.
- **Wikimedia Commons** — reference bird audio. Each media file remains subject to its own licence and attribution terms.
- **OpenStreetMap + Nominatim** — entered-place geocoding, reverse geocoding and English/Latin-alphabet place-name resolution where available.
- **Google Maps** — external destination for suggested-location map searches.
- **Supabase** — authentication, cloud record sync and cloud photo storage.
- **GitHub + GitHub Pages** — source control and deployment/hosting.
- **Google Fonts** — EB Garamond and UnifrakturCook web-font fallbacks.
- **Browser platform APIs** — IndexedDB, Service Worker/Cache APIs, Geolocation, Blob/Object URL and standard PWA capabilities.

The Compendium is not affiliated with or endorsed by those organisations. External data, images, sounds, maps and fonts remain subject to their respective source terms and licences.

## Data and privacy

The primary local collection lives in browser IndexedDB. Cloud sync is optional and account-based. When enabled, structured bird records are stored in Supabase and photos are uploaded to the configured storage bucket for that user. GPS is requested only when a location action explicitly uses it. Third-party lookups necessarily send the relevant species or place query to that external service.

Cosmetic achievement abilities should never intentionally alter stored bird data. Themes, fonts and enabled/disabled ability state are local interface preferences; whether an ability is earned is reconciled against the actual saved Compendium data.

## PWA/update behaviour

The service worker uses a versioned cache and network-first loading for same-origin assets. Deployments bump the cache so new files replace stale ones while leaving IndexedDB bird data untouched. On iOS, fully closing and reopening the installed app after a deployment remains the most reliable way to force the latest shell to appear.
