# Android app (Trusted Web Activity)

This folder is the starting point for packaging Dar al-Kutub as a Google Play Android app using
Google Chrome's Trusted Web Activity (TWA). The intended website origin is
`https://darulkutub.durood.live`. A TWA displays the website in the user's browser; it is not a
bundled/offline copy of the site.

## What's prepared

- `web/app/manifest.ts` exposes the PWA manifest at `/manifest.webmanifest`.
- `web/public/twa-icon.svg` is used for the favicon.
- `web/public/icons/` contains the matching 192px, 512px, and maskable 512px PNG install icons.
- A root-scoped service worker provides a small offline page for failed navigations. It does not
  cache book pages or reader data.
- `mobile/twa/twa-manifest.json` records the selected Android package ID (`com.darulkutub`) and
  TWA settings. Bubblewrap's `init` generates the Android project and its authoritative config.
- `mobile/twa/assetlinks.template.json` has the final package ID but intentionally leaves the
  Play app-signing SHA-256 fingerprint as a placeholder.
- `mobile/twa/.gitignore` prevents private keystores and signed APK/AAB artifacts from being
  committed.

## Remaining steps

1. Confirm the production site is live and these URLs work over HTTPS:
   - `https://darulkutub.durood.live/`
   - `https://darulkutub.durood.live/manifest.webmanifest`
   - `https://darulkutub.durood.live/icons/icon-512.png`
   - `https://darulkutub.durood.live/icons/icon-maskable-512.png`
2. Install Bubblewrap and initialize the TWA in this directory:

   ```sh
   npm install --global @bubblewrap/cli
   cd mobile/twa
   bubblewrap init --manifest=https://darulkutub.durood.live/manifest.webmanifest
   ```

   Confirm `com.darulkutub` as the application ID and Dar al-Kutub's app name/icons. Keep the
   application ID unchanged after publishing. Bubblewrap will generate the Android project and
   update `twa-manifest.json`. Create and back up the upload keystore securely; do not commit the
   keystore or its passwords. Keep the upload key safe because future updates must use it.
3. Build and test on an Android device:

   ```sh
   bubblewrap build
   bubblewrap install
   ```

4. Create the Google Play Console app with package ID `com.darulkutub`, upload the generated
   `app-release-bundle.aab` to an internal testing track, and enroll in Play App Signing. After
   Google generates the app-signing certificate, copy its SHA-256 fingerprint from **Play
   Console → App integrity → App signing key certificate**. This fingerprint is not necessarily
   the local upload-key fingerprint.
5. Replace the placeholder in `assetlinks.template.json` with that Play app-signing fingerprint.
   Publish the completed file as
   `web/public/.well-known/assetlinks.json` and redeploy the website, so it is available without a
   redirect at `https://darulkutub.durood.live/.well-known/assetlinks.json`.
6. Verify the asset link and launch the app again. Once the TWA opens without browser UI, finish
   Play Console's app listing, privacy, app-content, testing, and release requirements.

Do **not** deploy the asset-links template while its fingerprint is a placeholder. Bubblewrap's
CLI could not be downloaded in this environment, so the native Android project and signed bundle
have not been generated here. Run the commands above on a machine with network access, Java 17,
and Android SDK/build tools.

## GitHub Actions APK/AAB builds

`.github/workflows/android-twa.yml` runs on pushes that change `mobile/twa/` on `main`, or when
manually started from the GitHub Actions tab. Manual runs let you choose one artifact—APK or AAB;
push-triggered runs default to AAB. It runs only the selected Gradle task (`assembleRelease` for
APK or `bundleRelease` for AAB), signs that output with the upload keystore, and uploads only that
artifact. Before using it:

1. Run Bubblewrap `init` locally and commit its generated Android project (including `gradlew`,
   `gradlew.bat`, and `gradle/wrapper/`). Do not commit `android.keystore` or passwords.
2. Add these **repository Actions secrets** in GitHub Settings → Secrets and variables → Actions:
   - `BUBBLEWRAP_KEYSTORE_BASE64`: base64 encoding of the upload keystore file.
   - `BUBBLEWRAP_KEYSTORE_PASSWORD`: keystore password.
   - `BUBBLEWRAP_KEY_PASSWORD`: signing-key password.
3. Run the workflow. For a manual run, choose APK or AAB. Download the selected file from the
   completed run's Artifacts section (`dar-al-kutub-apk-<run number>` or
   `dar-al-kutub-aab-<run number>`).

The build uses `--skipPwaValidation` so producing artifacts does not depend on the production
domain being reachable during CI. Before release, make the site/domain live, test the TWA and
Digital Asset Links, and upload the AAB through Play Console. This workflow builds artifacts; it
does not publish them to Play automatically.

References: [Trusted Web Activity overview](https://developer.android.com/develop/ui/views/layout/webapps/trusted-web-activities),
[Chrome TWA quick start](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start),
[Next.js manifest convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest).
