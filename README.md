# iPhone Hardware Tester PWA

A comprehensive hardware diagnostic tool for iPhone (and other devices) built with Expo SDK 54, React Native, and NativeWind.

## Features
- **Media**: Camera, Microphone, Speaker, Flashlight
- **Sensors**: Gyroscope, Accelerometer, Magnetometer, Vibration
- **Display**: Touch, Dead Pixels, Brightness, Orientation
- **Connectivity**: WiFi, Network Speed, GPS, Battery, Device Info
- **AI Assistant**: Automated analysis of test results

## Development

### Prerequisites
- Node.js (TLS)
- Expo Go app on iPhone (for physical testing)

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```
   - Press `i` for iOS simulator (macOS only)
   - Scan QR code with Camera app on iPhone

## Web / PWA Support

This app works as a Progressive Web App (PWA).

### Running on Web
```bash
npx expo start --web
```

### Deploying to GitHub Pages

1. **Configure Base Path (Important)**
   If your repository is not at the root domain (e.g. `username.github.io/repo-name`), you might need to adjust routing or just rely on the hash router/SPA redirect script included. 
   
   *Tip: This project uses a `404.html` redirect trick to support client-side routing on GitHub Pages.*

2. **Build for Web**
   ```bash
   npx expo export --platform web
   ```
   This creates a `dist` directory.

3. **Deploy**
   Use the `gh-pages` package to deploy the `dist` folder:
   ```bash
   npx gh-pages -d dist
   ```

## Troubleshooting
- **Camera on Web**: Ensure you are using HTTPS. Browser permissions require secure context.
- **Microphone**: Some browsers block audio capture without user gesture. The UI handles this.

## Tech Stack
- Expo SDK 54
- React Native 0.76
- NativeWind (Tailwind CSS)
- Zustand (State Management)
