# Bird Compendium PWA

A tile-based personal bird compendium for iPhone/iPad.

## Included
- Home-screen species tiles showing only the common name, cover image, and rarity dot
- Search
- Sort A–Z / Z–A, newest / oldest, rarity low→high / high→low
- Rarity classes: Common, Uncommon, Epic, Mythical, Legendary
- Common = orange
- Multiple sightings per species
- Multiple photos per sighting
- Date, location, and notes for each sighting
- Edit common name, scientific name, rarity, general notes, and main image
- Change the main image later by:
  1. Editing the species and choosing a new cover photo, or
  2. Opening a sighting and tapping “Use as main” on any photo
- iNaturalist species lookup
- Optional local rarity suggestion based on nearby iNaturalist observations
- GPS/reverse-geocoding support
- Local IndexedDB storage
- Offline shell after first load

## iPhone installation
For a real “Add to Home Screen” app, host this folder over HTTPS using GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.

Then in Safari:
1. Open the hosted site.
2. Tap Share.
3. Tap Add to Home Screen.
4. Launch Bird Compendium from the icon.

Internet is only required for species lookup, local rarity suggestion, and reverse geocoding. Your saved collection itself is local.


## Version 2 update
- Replaced the placeholder feather icon with the chosen three-bird app icon.
- Added a Delete Bird button to every expanded bird card.
- Deleting a bird asks for confirmation first and then removes that species and all of its stored sightings/photos.
- Existing IndexedDB data uses the same database and object store, so updating the hosted app files does not intentionally reset your existing collection.
- Service-worker cache bumped to v2 so the new code/icon can be fetched.

### Important iOS icon note
If the old Home Screen icon remains after you deploy this update, iOS may keep the previous icon cached. Remove the Home Screen shortcut and add the same site to Home Screen again. Your bird data belongs to the site storage, not to the shortcut icon itself, as long as the hosted URL stays exactly the same.


## Version 3 update
- The Edit button now edits the existing species card instead of behaving like a new-entry form.
- Species editing can change the common name, scientific name, class, general notes, and main image.
- Each sighting now has its own Edit and Delete controls so dates, locations, notes, and photos can be changed later.
- Added an explicit red “Delete bird from compendium” button inside each species card.
- Tiles with more than one sighting show a small overlapping-windows badge in the top-right corner.
- Existing IndexedDB name/version are unchanged so this release is designed to keep existing bird data when deployed over the same GitHub Pages URL.
- Service-worker cache bumped to v3.
