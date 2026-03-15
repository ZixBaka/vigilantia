# Vigilantia — Real Holat

Citizen monitoring platform for verifying government renovation promises at schools across Uzbekistan. Citizens take photos and mark each promise as **Done** or **Problem**, creating a transparent public record in real time.

Built for a 48-hour hackathon.

---

## Features

- **School list** with search by name or district
- **Photo reports** — take a photo, mark done/problem, add comment
- **Live map** with color-coded pins (green/yellow/red) updated in real time
- **Stats dashboard** — overall satisfaction rate, per-school breakdowns
- **3 languages** — Russian, Uzbek, English (switchable in-app)
- **Real-time sync** — all clients update instantly via Firestore `onSnapshot`

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Expo SDK 54 + Expo Router 6 |
| Database | Firebase Firestore |
| Storage | Firebase Storage |
| State | Zustand |
| Styling | NativeWind v4 (Tailwind for RN) |
| Maps | react-native-maps |
| Camera | expo-image-picker |
| i18n | i18next + react-i18next |

## Getting Started

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your phone.

On first launch, 10 demo schools are seeded automatically into Firestore.
To seed demo reports (for a rich dashboard demo), long-press the Dashboard title.

## Project Structure

```
app/
  (tabs)/         # Schools list, Map, Dashboard
  school/[id]     # School detail + promises
  report/[id]     # Camera + submit report
components/       # SchoolCard, PromiseItem, StatusBadge, StatCard
constants/        # Colors, i18n translations, seed data
hooks/            # useSchools, useReports, useStats
lib/              # Firebase init, Zustand store, seed functions
types/            # TypeScript interfaces
```

## Demo Path (30 seconds)

1. Open app → school list loads (10 schools)
2. Tap any school → see promises list
3. Tap **Verify** → camera opens → take photo → tap **Done**
4. Switch to **Map** tab → school pin turns green
5. Switch to **Stats** tab → satisfaction % updates live
