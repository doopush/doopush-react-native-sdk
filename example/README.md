# DooPush RN SDK Example

Minimal Expo app demonstrating doopush-react-native-sdk v0.1.0 alpha.

## Setup

1. Drop a real Firebase `google-services.json` in this directory (it's gitignored).
2. Update `app.json` with your real DooPush appId / apiKey.
3. From the parent SDK directory:
   ```bash
   cd ../  # to sdk/react-native/DooPushSDK
   pnpm install
   pnpm build
   ```
4. From this directory:
   ```bash
   pnpm prebuild           # generates ios/ and android/
   pnpm android            # build + run on Android emulator/device
   pnpm ios                # build + run on iOS simulator (Mac only)
   ```

## What v0.1.0 alpha tests

- Plugin runs successfully during prebuild
- Native bridge compiles
- JS API call paths work
- Real APNs/FCM token retrieval requires a real device + valid Firebase project
