import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import TapGame from './components/TapGame';

export default function App() {
  return (
    <View style={styles.container}>
      <TapGame />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
