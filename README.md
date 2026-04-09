# 🧭 The Yellow Brick Road

A mobile step-tracking app built with React Native and Expo that motivates users through fun themed journeys. Choose routes from stories such as The Lord of The Rings or real life treks like the Tongariro Alpine Crossing, and watch your real-world steps carry you through interesting events / landmarks along the way.

---

## Features

### Journey System
- Choose from three iconic journeys, each with a unique total step goal and destination
- Each journey has a description covering terrain, difficulty, and what to expect
- Switching journeys resets your step count with a warning prompt
- Your active journey is highlighted with a "Current" badge in the selection list

### Step Tracking
- Uses the device pedometer via `expo-sensors` to count steps in real time
- Steps are counted even when the app is in the background or on another screen
- A configurable **step sensitivity** multiplier (20%–100%) filters out noise from device motion
- A fractional accumulator ensures no partial steps are lost between sensor updates
- Steps persist across app restarts via `AsyncStorage`

### Landmark System
- Each journey has a series of landmarks unlocked at specific step milestones
- A banner carousel at the top of the home screen displays unlocked landmarks
- New cards appear in the carousel as you hit each milestone
- Tapping a card opens a popup with the landmark image, title, step count, and description
- A **push notification** fires when each landmark is reached (works in background)
- A separate journey complete notification fires when you finish a journey

### Home Screen
- Animated step counter that smoothly counts up as steps are recorded
- Shows steps remaining to your final destination
- Shows steps remaining to the next landmark
- Displays a celebratory message when a journey is completed
- Swipeable banner carousel with animated dot indicators that mirror the swipe gesture

### Stats Page
- Current journey info and progress bar
- All-time steps and kilometres
- Journey kilometres and estimated calories burned
- 7-day step history line chart
- Step sensitivity adjustment UI

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React Native | Core mobile framework |
| Expo (SDK 54) | Build tooling, native modules |
| Expo Router | File-based navigation |
| expo-sensors (Pedometer) | Step counting |
| expo-notifications | Push notifications for landmarks |
| AsyncStorage | Persistent local storage |
| React Context API | Global state (steps, journey, settings) |
| Victory Native | Line chart for 7-day stats |
| react-native-svg | SVG support for charts |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- Android Studio (for Android builds) with SDK Platform Tools in your PATH
- A physical Android device (pedometer does not work in emulators)

### Installation

```bash
git clone https://github.com/yourusername/the-yellow-brick-road.git
cd the-yellow-brick-road
npm install --legacy-peer-deps
```

### Running in development

```bash
npx expo start
```

Scan the QR code with your Expo Go app — note that pedometer and notification permissions require a development build rather than Expo Go.

### Building a development build (recommended)

```bash
npx expo install expo-dev-client
npx expo run:android
```

Once installed on your device, use `npx expo start` and scan the QR code — your dev build will open instead of Expo Go, with full native support.

### Building for release

```bash
npx expo run:android --variant release
```

---

## Configuration

### Step Sensitivity

Adjust how many detected steps are actually counted via the Stats page UI, or change the default in `PedometerContext.jsx`:

```js
const [stepMultiplier, setStepMultiplier] = useState(0.6); // 60% of steps counted
```

### Adding Journeys

Add a new entry to `constants/journeys.js`:

```js
{
    id: '6',
    title: 'My Custom Journey',
    image: 'https://example.com/image.jpg',
    totalSteps: 500000,
    goal: 'The Final Destination',
    description: 'A description of the journey terrain and difficulty.',
    bannerItems: [
        {
            id: 'custom-1',
            unlockedAfterSteps: 0,
            title: 'The Beginning',
            image: 'https://example.com/landmark1.jpg',
            detail: 'Detail text shown in the popup modal.',
        },
        // ... more landmarks
    ],
}
```

### Adding Banner Items

Banner items are embedded directly in each journey's `bannerItems` array. Each item needs:

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique identifier |
| `unlockedAfterSteps` | number | Steps required to unlock |
| `title` | string | Card and modal title |
| `image` | string | Image URL |
| `detail` | string | Modal description text |

---

## Permissions

The app requests the following permissions at runtime:

| Permission | Purpose |
|---|---|
| `ACTIVITY_RECOGNITION` | Step counting via device pedometer |
| Notifications | Landmark and journey completion alerts |