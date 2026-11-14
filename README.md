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
- **App Store release.** Codemagic builds, signs and uploads the app for you (no Mac needed).
  The steps are below.

### iOS release with Codemagic

`codemagic.yaml` holds the build. These steps are done once, in your own accounts.

**1. Apple Developer Program.** Enrol at [developer.apple.com/programs](https://developer.apple.com/programs/)
(US$99 / year). Enrol as an organisation (needs a D-U-N-S number) if the seller name on the App Store should be
Benchmark Guides; as an individual it shows your personal name.

**2. Register the app ID.** [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list)
→ Identifiers → + → App IDs → App → Bundle ID (explicit) `com.benchmarkguides.calculator`,
description "Engineer's Calculator". No capabilities are needed.

**3. Create the app in App Store Connect.** [appstoreconnect.apple.com](https://appstoreconnect.apple.com) → Apps → +
→ New App: platform iOS, name **حاسبة المهندس** (or Engineer's Calculator), primary language Arabic,
bundle ID `com.benchmarkguides.calculator`, SKU `bg-engineers-calculator`. Add English as a second
localisation for the store listing.

**4. Create an App Store Connect API key.** App Store Connect → Users and Access → Integrations →
App Store Connect API → Team Keys → + . Name it "Codemagic", access **App Manager**. Download the `.p8` file
(it can be downloaded only once) and note the **Issuer ID** and **Key ID** shown on that page.

**5. Connect Codemagic.**
1. Sign up at [codemagic.io](https://codemagic.io) with your GitHub account (the free plan includes 500 build
   minutes a month on Mac mini M2).
2. Add application → GitHub → `MoAbdelhay/EC` → project type "Other" → it finds `codemagic.yaml`.
3. Team / user settings → Integrations → **Developer Portal** → Connect → name it exactly
   **`BG App Store Connect`** (the name used in `codemagic.yaml`), paste the Issuer ID and Key ID, upload the `.p8`.
4. Team / user settings → **Code signing identities** → iOS certificates → Generate certificate →
   type **Apple Distribution**, using the `BG App Store Connect` key. Then → iOS provisioning profiles →
   Fetch profiles → pick the **App Store** profile for `com.benchmarkguides.calculator` (create it if listed as missing).

**6. Build.** In Codemagic: Start new build → branch `main` → workflow **iOS App Store**. Or push a tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

About 10–15 minutes later the build appears in App Store Connect → TestFlight. Install it with the TestFlight
app on your iPhone and check it.

**7. Submit for review** (in App Store Connect, each release):
- Screenshots: 6.9" iPhone (1320 × 2868) and, because the app also runs on iPad, 13" iPad (2064 × 2752).
  Take them from TestFlight on real devices or from the iOS simulator.
- Description, keywords, support URL (e.g. `https://benchmarkguides.com`) and privacy policy URL
  (your store's privacy page).
- App Privacy → **Data Not Collected** (the app stores inputs only on the device).
- Category: Utilities or Productivity. Age rating: 4+.
- Select the TestFlight build → Add for Review → Submit.

For the next release, raise `"version"` in `package.json` (e.g. 1.0.1), commit, and build again. The build number
is set automatically from the build time.
