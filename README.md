# DooPush React Native SDK

> **v0.1.0 alpha** — Minimal API surface for end-to-end validation.
> FCM (Android) + APNs (iOS) only. OEM channels and React Hooks coming in v0.5.0 beta.

React Native SDK for [DooPush](https://doopush.com) push notification service. Built with Expo Modules API; works in Expo (managed / prebuild) and bare React Native.

## What's in v0.1.0 alpha

- ✅ `DooPush.configure(config)`
- ✅ `DooPush.register()` — APNs (iOS) / FCM (Android) auto flow
- ✅ `DooPush.registerWithToken(token, vendor)` — for callers with a token already
- 🟡 `DooPush.getDeviceToken()` / `getDeviceId()` — both return `null` in v0.1.0 (native getters not yet exposed; arrives in v0.5.0)
- ✅ Event listeners: `addRegisterListener`, `addRegisterErrorListener`, `addMessageListener`
- ✅ Config plugin: FCM vendor (google-services.json), iOS entitlements
- ✅ Active mode (Android): DooPush owns notification UI; coexistence with `expo-notifications` via broadcast relay (opt-in, JS bridge in v0.5.0)

### Known v0.1 limitations

- `register()` resolves `{token, deviceId, vendor}` but `deviceId` is currently the empty string on Android (server-side deviceId not yet captured by the bridge — wired up in v0.5.0). The `token` and `vendor` fields are correct.
- `getDeviceToken()` / `getDeviceId()` always return `null` on Android (no public getter on the underlying SDK yet).

## Not in v0.1.0 (coming in v0.5.0+)

- React hooks (`useDooPush`, `useDooPushToken`)
- OEM vendors (HMS / Honor / Xiaomi / OPPO / VIVO / Meizu)
- WebSocket gateway JS API
- Statistics / badge / channel JS API
- npm publication (use git tag for now)

## Prerequisites

- iOS native SDK ≥ 1.1.0 (SPM tag `v1.1.0` of `doopush-ios-sdk`, OR path-based dev dependency)
- Android native SDK ≥ 1.1.0 (JitPack `com.github.doopush:doopush-android-sdk:v1.1.0`, OR mavenLocal)
- Expo SDK 50+ (or RN 0.73+ bare)

## Quick install (once published)

```bash
npx expo install doopush-react-native-sdk
```

In `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "doopush-react-native-sdk",
        {
          "appId": "your_app_id",
          "apiKey": "your_api_key",
          "baseURL": "https://doopush.com/api/v1",
          "ios": { "mode": "production" },
          "android": {
            "vendors": {
              "fcm": { "googleServicesFile": "./google-services.json" }
            }
          }
        }
      ]
    ]
  }
}
```

```bash
npx expo prebuild --clean
npx expo run:android   # or run:ios
```

## Usage

```tsx
import { useEffect, useState } from 'react';
import { DooPush, type DooPushMessage } from 'doopush-react-native-sdk';

export default function App() {
  useEffect(() => {
    DooPush.configure({
      appId: 'your_app_id',
      apiKey: 'your_api_key',
    });
    const sub = DooPush.addMessageListener((m: DooPushMessage) => {
      console.log('push received', m);
    });
    return () => sub.remove();
  }, []);

  const handleRegister = async () => {
    try {
      const { token, deviceId } = await DooPush.register();
      console.log('registered', token, deviceId);
    } catch (e) {
      console.error('register failed', e);
    }
  };

  // ...
}
```

## Local development

This package is part of the [doopush monorepo](https://github.com/doopush/doopush). To develop:

```bash
cd sdk/react-native/DooPushSDK
pnpm install
pnpm build
pnpm test                   # plugin Jest tests
cd example
pnpm install
npx expo prebuild --clean
npx expo run:android        # Linux/Mac
npx expo run:ios            # Mac only
```

For the example app to find the Android SDK, publish a local copy:

```bash
cd sdk/android/DooPushSDK
./gradlew :lib:publishToMavenLocal
# Then in example app's android/app/build.gradle, temporarily change
#   implementation 'com.github.doopush:doopush-android-sdk:1.1.+'
# to
#   implementation 'com.doopush:android-sdk:1.1.+'
```

(This dev-coordinate workaround goes away once JitPack publishes v1.1.0.)

## Coexistence

### With `expo-notifications`

Compatible by default. DooPush owns `UNUserNotificationCenterDelegate` (iOS) but uses delegate-forwarding to keep `expo-notifications` listeners working. On Android, DooPush owns `FirebaseMessagingService`; if you need `expo-notifications` to also receive FCM messages, call (in v0.5.0+):

```ts
DooPush.setExpoNotificationRelayEnabled(true);
```

### With `@react-native-firebase/messaging`

**Choose one** — both libraries declare `FirebaseMessagingService` and only one wins manifest merger. If you already use `react-native-firebase`, omit the FCM vendor from the DooPush plugin and use `react-native-firebase`'s token API:

```ts
import messaging from '@react-native-firebase/messaging';
import { DooPush } from 'doopush-react-native-sdk';

const token = await messaging().getToken();
const { deviceId } = await DooPush.registerWithToken(token, 'fcm');
```

## License

MIT
