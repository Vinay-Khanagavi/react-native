import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import Colors from '../components/Colors';

export default function SettingsScreen() {
  const [sound, setSound] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Sound</Text>
        <Switch
          value={sound}
          onValueChange={setSound}
          trackColor={{ false: Colors.neutral, true: Colors.primaryAccent }}
          thumbColor={sound ? Colors.secondaryAccent : Colors.neutral}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: Colors.neutral, true: Colors.primaryAccent }}
          thumbColor={notifications ? Colors.secondaryAccent : Colors.neutral}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: Colors.neutral, true: Colors.primaryAccent }}
          thumbColor={darkMode ? Colors.secondaryAccent : Colors.neutral}
        />
      </View>
      <View style={styles.dragonFooter}>
        <Text style={styles.dragonText}>🐉 Dragon's Lair</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  title: {
    color: Colors.primaryAccent,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    alignSelf: 'center',
    letterSpacing: 1,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    shadowColor: Colors.neutral,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  label: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  dragonFooter: {
    marginTop: 40,
    alignItems: 'center',
  },
  dragonText: {
    color: Colors.secondaryAccent,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
}); 