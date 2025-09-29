# Memeify - Modern Meme Generator App

A beautiful, modern React Native meme generator app built with Expo. Create hilarious memes with ease using popular templates and share them instantly!

## 🚀 Features

- **Modern UI Design**: Clean, card-based interface with gradient headers
- **Template Selection**: Horizontal scrollable grid of popular meme templates
- **Real-time Preview**: See your selected template instantly
- **Easy Text Input**: Simple top and bottom text input fields
- **One-Click Generation**: Generate memes with a single tap
- **Instant Sharing**: Share your memes directly from the app
- **Cross-Platform**: Works on both iOS and Android

## 📱 Screenshots

The app features a modern interface with:
- Blue gradient header with "😂 Memeify" branding
- Horizontal template selection with visual indicators
- Clean text input fields with placeholder text
- Professional "GENERATE & SHARE" button
- Reset functionality for quick editing

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and build system
- **TypeScript** - Type-safe JavaScript
- **Expo Linear Gradient** - Beautiful gradient backgrounds
- **Axios** - HTTP client for API requests
- **Expo Sharing** - Native sharing capabilities

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MemeGenerator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm start
# or
expo start
```

### 4. Run on Device/Simulator

- **iOS**: Press `i` in the terminal or scan QR code with Camera app
- **Android**: Press `a` in the terminal or scan QR code with Expo Go app
- **Web**: Press `w` in the terminal

## 🏗️ Building for Production

### Android Build

1. Install EAS CLI:
```bash
npm install eas-cli
```

2. Configure EAS Build:
```bash
npx eas build:configure
```

3. Build for Android:
```bash
npx eas build --platform android
```

### iOS Build

```bash
npx eas build --platform ios
```

## 📦 Project Structure

```
MemeGenerator/
├── components/
│   └── MemeGenerator.tsx    # Main app component
├── assets/                  # App icons and images
│   ├── icon.png
│   ├── adaptive-icon.png
│   ├── splash-icon.png
│   └── favicon.png
├── App.tsx                  # Root component
├── app.json                 # Expo configuration
├── eas.json                 # EAS Build configuration
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🎨 Customization

### White-Label Configuration

This app is designed for white-label deployment. To customize for different brands:

1. **App Name**: Update in `app.json`
2. **Package Name**: Change Android package identifier
3. **Icons**: Replace files in `assets/` folder
4. **Colors**: Modify gradient colors in `MemeGenerator.tsx`
5. **Branding**: Update header title and emoji

### API Configuration

The app uses the Memegen API (https://api.memegen.link/). No API key required.

## 🔧 Configuration Files

### app.json
- App metadata and configuration
- Platform-specific settings
- Build configurations

### eas.json
- EAS Build profiles
- Environment configurations
- Build optimization settings

## 📱 Publishing

### Google Play Store

1. Build APK/AAB:
```bash
npx eas build --platform android
```

2. Submit to Play Store:
```bash
npx eas submit --platform android
```

### Apple App Store

1. Build for iOS:
```bash
npx eas build --platform ios
```

2. Submit to App Store:
```bash
npx eas submit --platform ios
```

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `expo start -c`
2. **Build failures**: Check EAS Build logs in Expo dashboard
3. **Sharing not working**: Ensure proper permissions in app.json
4. **Template loading**: Check internet connection and API availability

### Development Tips

- Use `expo start --tunnel` for testing on physical devices
- Enable remote debugging for better development experience
- Test on both iOS and Android before production builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Memegen API](https://api.memegen.link/) for providing meme templates
- [Expo](https://expo.dev/) for the amazing development platform
- React Native community for excellent documentation and support

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check Expo documentation
- Visit React Native community forums

---

**Made with ❤️ for meme lovers everywhere!**