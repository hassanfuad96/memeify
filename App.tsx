import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Platform } from 'react-native';
import MemeGenerator from './components/MemeGenerator';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <MemeGenerator />
      <StatusBar style="dark" backgroundColor="#f8f9fa" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
});
