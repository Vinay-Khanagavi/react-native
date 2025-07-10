import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const COLORS = {
  background: '#fbfbf3',
  card: '#fff',
  accent: '#6f96c4',
  textPrimary: '#60534d',
  textSecondary: '#6f96c4',
  thumbOn: '#6f96c4',
  thumbOff: '#ccc',
};

export default function SettingsScreen() {
  const [sound, setSound] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.label}>Sound</Text>
          <Switch
            value={sound}
            onValueChange={setSound}
            trackColor={{ false: COLORS.thumbOff, true: COLORS.accent }}
            thumbColor={sound ? COLORS.thumbOn : COLORS.thumbOff}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: COLORS.thumbOff, true: COLORS.accent }}
            thumbColor={notifications ? COLORS.thumbOn : COLORS.thumbOff}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: COLORS.thumbOff, true: COLORS.accent }}
            thumbColor={darkMode ? COLORS.thumbOn : COLORS.thumbOff}
          />
        </View>
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
    backgroundColor: COLORS.background,
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    color: COLORS.accent,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    alignSelf: 'center',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 32,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 18,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  dragonFooter: {
    marginTop: 20,
    alignItems: 'center',
  },
  dragonText: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
}); 