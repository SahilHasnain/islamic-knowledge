# Android app (Trusted Web Activity)

This folder is the starting point for packaging Dar al-Kutub as a Google Play Android app using
Google Chrome's Trusted Web Activity (TWA). The Android project cannot be initialized until the
website is deployed at its planned HTTPS origin, `https://darulkutub.durood.live`. A TWA displays the website in the user's browser;
it is not a bundled/offline copy of the site.

## What's prepared

- `web/app/manifest.ts` exposes the PWA manifest at `/manifest.webmanifest`.
- `web/public/twa-icon.svg` is used for the favicon.
- `web/public/icons/` contains the matching 192px, 512px, and maskable 512px PNG install icons.
- A root-scoped service worker provides a small offline page for failed navigations. It does not
  cache book pages or reader data.
- `mobile/twa/assetlinks.template.json` documents the Digital Asset Links file to publish once
  the final Android package ID and signing certificate fingerprint are known.

## Next steps after deploying the website

1. Review/replace the starter branding if desired. Confirm the deployed manifest and icons are
   available at `https://darulkutub.durood.live/manifest.webmanifest` and the paths listed in that manifest.
2. Install Bubblewrap and initialize the TWA from this directory:

   ```sh
   npm install --global @bubblewrap/cli
   cd mobile/twa
   bubblewrap init --manifest=https://darulkutub.durood.live/manifest.webmanifest
   ```

   Choose a permanent reverse-domain Android application ID during initialization. Do not use a
   placeholder or change it after publishing. Bubblewrap generates the Android project and
   `twa-manifest.json` here; those generated files belong in version control, but never commit
   signing keys or passwords.
3. Build and test the generated app:

   ```sh
   bubblewrap build
   bubblewrap install
   ```

4. Configure `assetlinks.json` using the exact package ID and SHA-256 fingerprint for the app's
   **Play app-signing certificate**, then deploy it at
   `https://darulkutub.durood.live/.well-known/assetlinks.json` with no redirect. Use the Play Console
   app-signing fingerprint for the production association (the upload-key fingerprint is not
   necessarily the one devices receive).
5. Verify Digital Asset Links and TWA behavior, then upload the signed Android App Bundle
   (`.aab`) produced by the Android build to Play Console. Complete Play's current app-content,
   privacy, testing, and listing requirements there.

The checked-in asset-links file is only a template and must **not** be deployed as-is. The domain
is selected, but until it serves the deployed site and the Android package/signing identity are
chosen, the Android project and valid association cannot be generated.

References: [Trusted Web Activity overview](https://developer.android.com/develop/ui/views/layout/webapps/trusted-web-activities),
[Chrome TWA quick start](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start),
[Next.js manifest convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest).
