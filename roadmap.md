Option A — Keep using Expo modules in a bare RN app (recommended quickest)
1) Install & link the native bits
yarn add expo-modules-core expo-file-system expo-media-library expo-sharing
npx pod-install


RN 0.71+ autolinks Expo modules. No manual changes to MainApplication are needed.

2) Android permissions (scoped storage compliant)

android/app/src/main/AndroidManifest.xml

<!-- Android 13+ -->
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<!-- For Android 12 and below (optional, wider support) -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />


Don’t use WRITE_EXTERNAL_STORAGE on Android 10+.

3) Use cacheDirectory only, create a subfolder, and rebuild

Replace your path helper with a cache-based one (no more “Storage directory not available”):

import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

const ensureCachePath = async (filename: string) => {
  const base = FileSystem.cacheDirectory;            // guaranteed when module is linked
  if (!base) return null;
  const dir = `${base}memelab/`;
  try { await FileSystem.makeDirectoryAsync(dir, { intermediates: true }); } catch {}
  return `${dir}${filename}`;
};

const downloadToCache = async (remoteUrl: string) => {
  const fileUri = await ensureCachePath(`meme-${Date.now()}.png`);
  if (!fileUri) return null;
  const { uri } = await FileSystem.downloadAsync(remoteUrl, fileUri);
  return uri;
};

// SHARE
const shareMeme = async () => {
  if (!generatedMemeUrl) return Alert.alert('Error', 'Generate a meme first.');
  try {
    const localUri = await downloadToCache(generatedMemeUrl);
    if (!localUri) return Alert.alert('Error', 'No writable cache dir.');
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(localUri, { mimeType: 'image/png', dialogTitle: 'Share your meme!' });
      return;
    }
    // Fallback: RNShare with base64
    if (RNShare?.open) {
      const b64 = await FileSystem.readAsStringAsync(localUri, { encoding: FileSystem.EncodingType.Base64 });
      await RNShare.open({ url: `data:image/png;base64,${b64}`, type: 'image/png', failOnCancel: false });
      return;
    }
    Alert.alert('Error', 'Sharing is not available on this device.');
  } catch (e) {
    console.log('shareMeme error', e);
    Alert.alert('Error', 'Failed to share meme.');
  }
};

// SAVE
const saveMemeToLibrary = async () => {
  if (!generatedMemeUrl) return Alert.alert('Error', 'Generate a meme first.');
  try {
    const perms = await MediaLibrary.requestPermissionsAsync();
    if (!perms.granted) return Alert.alert('Permission required', 'Allow Photos access to save images.');
    const localUri = await downloadToCache(generatedMemeUrl);
    if (!localUri) return Alert.alert('Error', 'No writable cache dir.');
    const asset = await MediaLibrary.createAssetAsync(localUri);
    try { await MediaLibrary.createAlbumAsync('MemeLab', asset, false); } catch {}
    Alert.alert('Saved', 'Meme saved to your Photos library.');
  } catch (e) {
    console.log('saveMemeToLibrary error', e);
    Alert.alert('Error', 'Failed to save meme.');
  }
};

4) Rebuild the native app

Android: cd android && ./gradlew clean assembleDebug (or Release)

iOS: npx pod-install && build/run from Xcode

If console.log(FileSystem.cacheDirectory) still prints null, the Expo modules aren’t being included—double-check step 1 and that your app actually picked up the new native code (clean + rebuild).