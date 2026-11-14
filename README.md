# Engineer's Calculator · حاسبة المهندس — Android and iOS app

The Benchmark Guides calculator (53 calculators, Arabic and English) packaged as a native app with
[Capacitor](https://capacitorjs.com). It runs fully offline: the page and its fonts are bundled inside the app.

- App ID: `com.benchmarkguides.calculator`
- App name: Engineer's Calculator (Android shows حاسبة المهندس on phones set to Arabic)

## Where things live

| Path | What it is |
| --- | --- |
| `G:\My Drive\Benchmarkguides\Calculation Sheets BG\MEP Calculator\index.html` | **The calculator source. Edit only this.** The same file feeds the website (via `build-shopify.py`) and the app. |
| `src/calculator.html` | Copy of the source kept in this repo for cloud builds. Refreshed automatically on every build. |
| `scripts/build-web.mjs` | Wraps the calculator in an app shell and writes `www/` (bundled fonts, safe areas, no zoom). |
| `static/fonts/` | Fonts downloaded once from Google Fonts (OFL) so the app works offline. |
| `scripts/make-icon-sources.mjs` | Renders the brand app mark into `assets/`; `npm run build:icons` makes every icon and splash size. |
| `android/`, `ios/` | Native projects (Android Studio / Xcode). |
| `.github/workflows/ios.yml` | Compiles the iOS app on a GitHub Mac. |

## After changing the calculator

```bash
npm run sync            # rebuild www/ from the Drive source and copy it into android/ and ios/
```

## Android

Test build (installable APK, not for the Play Store):

```bash
npm run android:debug
```

The APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`. Copy it to a phone and open it
(allow "install unknown apps"), or open `android/` in Android Studio and press Run.

### Play Store release

1. Create an upload key once and keep it safe (losing it means you cannot update the app):

   ```bash
   keytool -genkeypair -v -keystore android/upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Create `android/keystore.properties` (it is git-ignored):

   ```properties
   storeFile=../upload.jks
   storePassword=YOUR_PASSWORD
   keyAlias=upload
   keyPassword=YOUR_PASSWORD
   ```

3. Build the bundle: `npm run android:release` → `android/app/build/outputs/bundle/release/app-release.aab`.
4. In [Play Console](https://play.google.com/console) (one-time US$25 developer fee): create the app, upload the
   `.aab`, fill in the store listing, content rating and data-safety form (the app collects no data).
   Bump `versionCode` and `versionName` in `android/app/build.gradle` for every new upload.

## iOS

iOS apps can only be compiled on a Mac. Two ways:

- **GitHub Actions (no Mac needed to check it builds).** Push this folder to a GitHub repository; the
  `iOS build` workflow compiles it for the simulator on every push.
- **App Store release.** Needs an Apple Developer account (US$99 / year) and either a Mac with Xcode
  (`npx cap open ios`, then Product → Archive → Distribute) or a cloud service such as Codemagic or
  Ionic Appflow connected to this repository, which signs and uploads to App Store Connect for you.
