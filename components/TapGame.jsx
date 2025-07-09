import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import Colors from './Colors';
import Orb from './Orb';

const GAME_STATES = {
  START: 'start',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over',
};

const ORB_SIZE = 70;
const ORB_SPAWN_INTERVAL = 1000; // ms
const HAZARD_CHANCE = 0.2; // 20% chance for hazard orb

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const GAME_AREA_PADDING = 32;

const TapGame = () => {
  const [gameState, setGameState] = useState(GAME_STATES.START);
  const [score, setScore] = useState(0);
  const [orbs, setOrbs] = useState([]);
  const orbTimeouts = React.useRef({});

  React.useEffect(() => {
    if (gameState !== GAME_STATES.PLAYING) {
      // Clear orbs and timeouts when not playing
      setOrbs([]);
      Object.values(orbTimeouts.current).forEach(clearTimeout);
      orbTimeouts.current = {};
      return;
    }

    // Spawn orbs at intervals
    const spawnInterval = setInterval(() => {
      spawnOrb();
    }, ORB_SPAWN_INTERVAL);

    return () => {
      clearInterval(spawnInterval);
      Object.values(orbTimeouts.current).forEach(clearTimeout);
      orbTimeouts.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const spawnOrb = () => {
    // Random position within game area
    const areaWidth = SCREEN_WIDTH - GAME_AREA_PADDING * 2 - ORB_SIZE;
    const areaHeight = SCREEN_HEIGHT - 200 - GAME_AREA_PADDING * 2 - ORB_SIZE; // 200 for header/footer
    const x = Math.random() * areaWidth + GAME_AREA_PADDING;
    const y = Math.random() * areaHeight + GAME_AREA_PADDING + 80; // 80 for header
    const isHazard = Math.random() < HAZARD_CHANCE;
    const id = Date.now() + Math.random();
    const orb = { id, x, y, type: isHazard ? 'hazard' : 'normal' };
    setOrbs((prev) => [...prev, orb]);

    // Remove orb after 1.2s if not tapped
    orbTimeouts.current[id] = setTimeout(() => {
      setOrbs((prev) => prev.filter((o) => o.id !== id));
      // Optionally: handle miss (e.g., game over or penalty)
    }, 1200);
  };

  // Placeholder handlers
  const handleStart = () => {
    setScore(0);
    setGameState(GAME_STATES.PLAYING);
  };

  const handlePause = () => setGameState(GAME_STATES.PAUSED);
  const handleResume = () => setGameState(GAME_STATES.PLAYING);
  const handleGameOver = () => setGameState(GAME_STATES.GAME_OVER);
  const handleRetry = () => handleStart();

  const handleOrbPress = (orb) => {
    // Remove orb and clear its timeout
    setOrbs((prev) => prev.filter((o) => o.id !== orb.id));
    if (orbTimeouts.current[orb.id]) {
      clearTimeout(orbTimeouts.current[orb.id]);
      delete orbTimeouts.current[orb.id];
    }
    if (orb.type === 'hazard') {
      handleGameOver();
    } else {
      setScore((prev) => prev + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {gameState === GAME_STATES.START && (
        <View style={styles.centered}>
          <Text style={styles.title}>Tap Reflex Challenge</Text>
          <TouchableOpacity style={styles.playButton} onPress={handleStart}>
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>
        </View>
      )}
      {gameState === GAME_STATES.PLAYING && (
        <View style={styles.gameArea}>
          <View style={styles.header}>
            <Text style={styles.score}>Score: {score}</Text>
            <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
              <Text style={styles.pauseIcon}>⏸</Text>
            </TouchableOpacity>
          </View>
          {/* Game elements: Render orbs */}
          <View style={styles.orbArea}>
            {orbs.map((orb) => (
              <Orb
                key={orb.id}
                x={orb.x}
                y={orb.y}
                type={orb.type}
                onPress={() => handleOrbPress(orb)}
              />
            ))}
          </View>
        </View>
      )}
      {gameState === GAME_STATES.PAUSED && (
        <View style={styles.centered}>
          <Text style={styles.title}>Paused</Text>
          <TouchableOpacity style={styles.playButton} onPress={handleResume}>
            <Text style={styles.playButtonText}>Resume</Text>
          </TouchableOpacity>
        </View>
      )}
      {gameState === GAME_STATES.GAME_OVER && (
        <View style={styles.centered}>
          <Text style={styles.title}>Game Over</Text>
          <Text style={styles.score}>Score: {score}</Text>
          <TouchableOpacity style={styles.playButton} onPress={handleRetry}>
            <Text style={styles.playButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
  },
  title: {
    fontSize: 32,
    color: Colors.primaryAccent,
    fontWeight: 'bold',
    marginBottom: 32,
    letterSpacing: 1.5,
  },
  playButton: {
    backgroundColor: Colors.primaryAccent,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 32,
    shadowColor: Colors.primaryAccent,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  playButtonText: {
    color: Colors.backgroundDark,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  gameArea: {
    flex: 1,
    paddingTop: 32,
    backgroundColor: Colors.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  score: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  pauseButton: {
    backgroundColor: Colors.neutral,
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.neutral,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  pauseIcon: {
    color: Colors.primaryAccent,
    fontSize: 24,
  },
  gamePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: Colors.textSecondary,
    fontSize: 18,
    opacity: 0.5,
  },
  orbArea: {
    flex: 1,
    position: 'relative',
  },
  orb: {
    position: 'absolute',
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primaryAccent,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
});

export default TapGame;
