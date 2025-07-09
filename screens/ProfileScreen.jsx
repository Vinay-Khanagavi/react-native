import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Colors from '../components/Colors';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={require('../assets/images/background_dragon.png')}
          style={styles.avatar}
        />
      </View>
      <Text style={styles.username}>DragonMaster</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>1200</Text>
          <Text style={styles.statLabel}>Score</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>7</Text>
          <Text style={styles.statLabel}>Dragons</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Achievements</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
    alignItems: 'center',
    paddingTop: 80,
  },
  avatarContainer: {
    backgroundColor: Colors.primaryAccent,
    borderRadius: 60,
    padding: 6,
    marginBottom: 16,
    shadowColor: Colors.primaryAccent,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.secondaryAccent,
  },
  username: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 24,
    padding: 20,
    width: '90%',
    shadowColor: Colors.neutral,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  statBox: {
    alignItems: 'center',
    marginHorizontal: 18,
  },
  statValue: {
    color: Colors.primaryAccent,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
}); 