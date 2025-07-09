import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const games = [
  {
    name: 'Tap Game',
    key: 'TapGame',
    color: '#4F8EF7',
    available: true,
  },
  {
    name: 'Game 2',
    key: 'Game2',
    color: '#34C759',
    available: false,
  },
  {
    name: 'Game 3',
    key: 'Game3',
    color: '#FF9500',
    available: false,
  },
  {
    name: 'Game 4',
    key: 'Game4',
    color: '#FF3B30',
    available: false,
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Hub</Text>
      <View style={styles.grid}>
        {games.map((game, idx) => (
          <View key={game.key} style={[styles.box, { backgroundColor: game.color }]}> 
            <Text style={styles.gameName}>{game.name}</Text>
            {game.available ? (
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => navigation.navigate('TapGame')}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.playButton, styles.disabledButton]} disabled>
                <Text style={styles.comingSoonText}>Coming Soon</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },
  box: {
    width: '45%',
    aspectRatio: 1,
    margin: '2.5%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gameName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  playButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  playButtonText: {
    color: '#4F8EF7',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  comingSoonText: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
