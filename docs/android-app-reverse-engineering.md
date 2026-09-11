# Android App Reverse Engineering

This documents the local workflow used to inspect Dawat-e-Islami Android apps and extract their databases and decompiled source. It does not require ADB or an Android device.

## Tools

- `apkeep`: downloads APK/XAPK files from Google Play.
- `apktool`: decodes the Android manifest, resources, assets, and Smali code.
- `jadx`: decompiles DEX bytecode into approximate Java source.
- `sqlite3`: inspects and queries extracted SQLite databases.

The tools are available globally through `~/bin` or the existing PATH:

```bash
apkeep --help
apktool --version
jadx --version
sqlite3 --version
```

## Download

Create a directory using the application package name, then download the app:

```bash
mkdir -p "reversing/com.example.app"
cd "reversing/com.example.app"
apkeep -a com.example.app .
```

The result may be either:

- `.apk`: a single APK.
- `.xapk`: a ZIP bundle containing a base APK and configuration/architecture split APKs.

## Extract An XAPK

```bash
python -c "import zipfile; zipfile.ZipFile('app.xapk').extractall('.')"
```

The base APK normally has the package name as its filename. Configuration APKs such as `config.arm64_v8a.apk` contain native libraries and are only needed when inspecting architecture-specific code.

## Decode Resources And Smali

Run Apktool against the base APK:

```bash
apktool d -f -o apktool-out base.apk
```

The output includes:

- `apktool-out/AndroidManifest.xml`: decoded manifest and declared components.
- `apktool-out/res/`: decoded Android resources.
- `apktool-out/assets/`: packaged assets, including databases and HTML.
- `apktool-out/smali*/`: Smali representation of Android bytecode.
- `apktool-out/lib/`: native libraries when decoding an architecture split.

## Decompile Java/Kotlin Bytecode

Run JADX separately. It provides readable Java-like source but is an approximation, not the original source:

```bash
jadx -d jadx-out base.apk
```

The generated source is in `jadx-out/sources/`, and decoded resources are in `jadx-out/resources/`. Names may be obfuscated, and some methods may contain decompilation errors.

## Flutter Apps

Flutter apps can be identified from the manifest or APK contents:

```bash
grep flutter apktool-out/AndroidManifest.xml
```

For Flutter apps:

- Java source mainly contains the Flutter host and plugin wrappers.
- Application logic is usually compiled Dart AOT code in `lib/arm64-v8a/libapp.so`.
- Packaged content commonly appears under `assets/flutter_assets/`.
- A Dart snapshot decompiler is required for deeper Dart reconstruction; JADX cannot restore Dart source from `libapp.so`.

## Extract Only A Database

For database work, a full decode is unnecessary. List database files inside the APK:

```bash
python -c "import zipfile; z=zipfile.ZipFile('base.apk'); print('\n'.join(f'{i.file_size:>12} {i.filename}' for i in z.infolist() if i.filename.endswith(('.db','.sqlite','.db-wal'))))"
```

Extract a known database:

```bash
python -c "import zipfile; z=zipfile.ZipFile('base.apk'); z.extract('assets/databases/Bahar_e_Shariat.db', '.')"
```

For an XAPK, first extract the base APK from the XAPK, then run the same command against that base APK.

## Inspect SQLite

```bash
sqlite3 path/to/database.db ".tables"
sqlite3 path/to/database.db ".schema"
sqlite3 path/to/database.db "SELECT COUNT(*) FROM some_table;"
```

Copy databases needed by this project into `db/`, preserving their original filenames:

```bash
cp extracted/path/database.db db/
```

## Notes And Safety

- This workflow performs local file extraction and static analysis; it does not install or execute the APK.
- No ADB, emulator, or Android device is required.
- Treat APKs and extracted native libraries as untrusted files. Do not execute them outside a controlled analysis environment.
- Use the workflow only for lawful purposes and respect the app publisher's copyright, terms, and licensing.
- Keep the original APK/XAPK and extracted database so results remain traceable to the downloaded app version.
