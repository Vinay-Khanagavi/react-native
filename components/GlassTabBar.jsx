import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import ProfileSvg from '../assets/images/profile.svg';
import HomeSvg from '../assets/images/home.svg';
import SettingsIcon from '../assets/images/setting.svg';

const tabs = [
  { name: 'Home', icon: <HomeSvg width={24} height={24} />, route: 'Home' },
  { name: 'Profile', icon: <ProfileSvg width={24} height={24} />, route: 'Profile' },
  { name: 'Settings', icon: <SettingsIcon width={24} height={24} />, route: 'Settings' },
];

export default function GlassTabBar({ navigation, currentRoute }) {
  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.route}
          style={[styles.button, currentRoute === tab.route && styles.activeButton]}
          onPress={() => navigation.navigate(tab.route)}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrapper}>
            {typeof tab.icon === 'string' ? (
              <Text style={styles.icon}>{tab.icon}</Text>
            ) : (
              tab.icon
            )}
          </View>
          <Text style={[styles.label, currentRoute === tab.route && styles.activeLabel]}>{tab.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderTopWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.3)',
    // For glass effect, you can add a blur view if using expo-blur
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  activeButton: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderColor: '#fff',
  },
  iconWrapper: {
    marginBottom: 2,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 12,
    color: '#222',
    opacity: 0.7,
  },
  activeLabel: {
    color: '#000',
    fontWeight: 'bold',
    opacity: 1,
  },
}); 