# SVCZZ downloads

[Download SVCZZ](https://lipitechnology.github.io/svczz-releases/)

Install files for the SVCZZ apps. This repository holds release files only, no source code.

## Android (phones and tablets)

1. Open the [latest release](https://github.com/LipiTechnology/svczz-releases/releases/latest) on your phone.
2. Download `svczz-<version>.apk`.
3. Open it. Android asks once to allow installs from your browser or file manager; allow it.
4. Updates: install the newer APK over the old one. Your sign-in and settings stay.

Package `com.svczz.app`. Every APK is signed with the same key; Android refuses an update signed
by anyone else. SHA-256 of the signing certificate:

```
B2:B8:62:02:F0:1E:FF:09:86:5F:C0:8E:01:66:63:EB:C6:57:0A:E9:AC:1D:6C:BC:81:A1:14:E0:A3:DF:61:16
```

Each release also lists the SHA-256 of the APK file (`.sha256`).

Needs Android 8.0 or newer on an arm64 or 32-bit ARM device. Ads and popups are blocked inside the app.

## TV

Android TV / Google TV: install the same APK (0.1.12 or newer), e.g. with the Downloader app. It opens TV mode; sign in with your phone (QR).

Other TVs: open https://svczz.com/tv in the TV's browser. The Samsung (Tizen) app is not a public download.
