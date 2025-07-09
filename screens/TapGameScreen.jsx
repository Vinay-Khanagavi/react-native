import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ORB_SIZE = 60;
const Colors = {
  backgroundDark: '#1a1a1a',
  primaryAccent: '#00ff88',
  textPrimary: '#ffffff',
  textSecondary: '#cccccc',
  neutral: '#444444',
};

const GAME_STATES = {
  START: 'start',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over',
};

const ORB_LIFETIME = 2000; // 1 second exactly
const SPAWN_DELAY = 500; // 0.5 second delay between orbs
const HAZARD_CHANCE = 0.3; // 30% chance for red orb
const BONUS_CHANCE = 0.2; // 20% chance for gold orbr

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const GAME_AREA_PADDING = 32;

const TapGame = () => {
  const [gameState, setGameState] = useState(GAME_STATES.START);
  const [score, setScore] = useState(0);
  const [currentOrb, setCurrentOrb] = useState(null);
  const [bestScore, setBestScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [reactionTime, setReactionTime] = useState(0);
  
  const orbTimeout = useRef(null);
  const spawnTimeout = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Load best score on mount
  useEffect(() => {
    const loadBestScore = async () => {
      try {
        const stored = await AsyncStorage.getItem('bestScore');
        if (stored !== null) setBestScore(Number(stored));
      } catch (e) {
        console.log('Error loading best score:', e);
      }
    };
    loadBestScore();
  }, []);

  // Update best score on game over
  useEffect(() => {
    if (gameState === GAME_STATES.GAME_OVER && score > bestScore) {
      setBestScore(score);
      AsyncStorage.setItem('bestScore', String(score));
    }
  }, [gameState, score, bestScore]);

  // Calculate level based on score
  const getCurrentLevel = useCallback(() => {
    return Math.floor(score / 10) + 1;
  }, [score]);

  // Clean up timeouts
  const cleanupTimeouts = useCallback(() => {
    if (orbTimeout.current) {
      clearTimeout(orbTimeout.current);
      orbTimeout.current = null;
    }
    if (spawnTimeout.current) {
      clearTimeout(spawnTimeout.current);
      spawnTimeout.current = null;
    }
  }, []);

  // Generate random position for orb
  const getRandomPosition = useCallback(() => {
    const areaWidth = SCREEN_WIDTH - GAME_AREA_PADDING * 2 - ORB_SIZE;
    const areaHeight = SCREEN_HEIGHT - 300 - GAME_AREA_PADDING * 2 - ORB_SIZE;
    const x = Math.random() * areaWidth + GAME_AREA_PADDING;
    const y = Math.random() * areaHeight + GAME_AREA_PADDING + 120;
    return { x, y };
  }, []);

  // Determine orb type based on chances
  const getOrbType = useCallback(() => {
    const rand = Math.random();
    if (rand < HAZARD_CHANCE) {
      return 'hazard';
    } else if (rand < HAZARD_CHANCE + BONUS_CHANCE) {
      return 'bonus';
    }
    return 'normal';
  }, []);

  // Create new orb
  const createOrb = useCallback(() => {
    const position = getRandomPosition();
    const type = getOrbType();
    
    return {
      id: Date.now(),
      x: position.x,
      y: position.y,
      type,
      createdAt: Date.now(),
      opacity: new Animated.Value(0)
    };
  }, [getRandomPosition, getOrbType]);

  // Spawn single orb
  const spawnOrb = useCallback(() => {
    if (gameState !== GAME_STATES.PLAYING) return;
    
    const newOrb = createOrb();
    setCurrentOrb(newOrb);
    setLevel(getCurrentLevel());
    
    // Animate orb appearing
    Animated.timing(newOrb.opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    
    // Set timeout to remove orb after exactly 1 second
    orbTimeout.current = setTimeout(() => {
      // Animate orb disappearing
      Animated.timing(newOrb.opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentOrb(null);
        
        // Penalty for missing normal orbs
        if (newOrb.type === 'normal') {
          setLives(prev => Math.max(0, prev - 1));
          setCombo(0); // Reset combo
        }
        
        // Schedule next orb spawn
        spawnTimeout.current = setTimeout(() => {
          spawnOrb();
        }, SPAWN_DELAY);
      });
    }, ORB_LIFETIME);
  }, [gameState, createOrb, getCurrentLevel]);

  // Main game loop
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING) {
      // Start with first orb
      spawnOrb();
    } else {
      // Clean up when not playing
      cleanupTimeouts();
      setCurrentOrb(null);
    }

    return cleanupTimeouts;
  }, [gameState, spawnOrb, cleanupTimeouts]);

  // Check for game over
  useEffect(() => {
    if (lives <= 0 && gameState === GAME_STATES.PLAYING) {
      handleGameOver();
    }
  }, [lives, gameState]);

  // Handle orb tap
  const handleOrbTap = useCallback((orb) => {
    if (gameState !== GAME_STATES.PLAYING || !orb) return;
    
    // Calculate reaction time
    const currentTime = Date.now();
    const reactionTimeMs = currentTime - orb.createdAt;
    setReactionTime(reactionTimeMs);
    
    // Clear timeouts
    cleanupTimeouts();
    
    // Animate orb disappearing
    Animated.timing(orb.opacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
    
    // Remove orb immediately
    setCurrentOrb(null);
    
    // Handle different orb types
    if (orb.type === 'hazard') {
      // Red orb - lose life and reset combo
      setLives(prev => Math.max(0, prev - 1));
      setCombo(0);
      // Screen flash effect
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.3, duration: 100, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true })
      ]).start();
    } else if (orb.type === 'bonus') {
      // Gold orb - bonus points and extra life
      const bonusPoints = reactionTimeMs < 500 ? 5 : 3;
      setScore(prev => prev + bonusPoints);
      setCombo(prev => prev + 1);
      setLives(prev => Math.min(5, prev + 1));
    } else {
      // Normal green orb - regular points
      const points = reactionTimeMs < 400 ? 2 : 1;
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
    }
    
    // Schedule next orb
    spawnTimeout.current = setTimeout(() => {
      spawnOrb();
    }, SPAWN_DELAY);
  }, [gameState, cleanupTimeouts, fadeAnim, spawnOrb]);

  // Game control handlers
  const handleStart = useCallback(() => {
    setScore(0);
    setCombo(0);
    setLevel(1);
    setLives(3);
    setReactionTime(0);
    setCurrentOrb(null);
    cleanupTimeouts();
    setGameState(GAME_STATES.PLAYING);
  }, [cleanupTimeouts]);

  const handlePause = useCallback(() => {
    setGameState(GAME_STATES.PAUSED);
  }, []);

  const handleResume = useCallback(() => {
    setGameState(GAME_STATES.PLAYING);
  }, []);

  const handleGameOver = useCallback(() => {
    cleanupTimeouts();
    setGameState(GAME_STATES.GAME_OVER);
  }, [cleanupTimeouts]);

  const handleRetry = useCallback(() => {
    handleStart();
  }, [handleStart]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {gameState === GAME_STATES.START && (
          <View style={styles.centered}>
            <Text style={styles.title}>⚡ Quick Tap ⚡</Text>
            <Text style={styles.subtitle}>One orb at a time - disappears in 1 second!</Text>
            <Text style={styles.subtitle}>🟢 Green = +1 point</Text>
            <Text style={styles.subtitle}>🔴 Red = -1 life</Text>
            <Text style={styles.subtitle}>🟡 Gold = +3 points & +1 life</Text>
            <Text style={styles.bestScore}>Best: {bestScore}</Text>
            <TouchableOpacity style={styles.playButton} onPress={handleStart}>
              <Text style={styles.playButtonText}>Start Game</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {gameState === GAME_STATES.PLAYING && (
          <View style={styles.gameArea}>
            <View style={styles.header}>
              <View style={styles.statsContainer}>
                <Text style={styles.score}>Score: {score}</Text>
                <Text style={styles.level}>Level: {level}</Text>
                <Text style={styles.combo}>Combo: {combo}</Text>
                <Text style={styles.reactionTime}>
                  Last: {reactionTime}ms
                </Text>
              </View>
              <View style={styles.rightHeader}>
                <View style={styles.livesContainer}>
                  <Text style={styles.lives}>Lives: {lives}</Text>
                </View>
                <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
                  <Text style={styles.pauseIcon}>⏸</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.orbArea}>
              {currentOrb && (
                <Animated.View
                  style={[
                    styles.orbContainer,
                    {
                      left: currentOrb.x,
                      top: currentOrb.y,
                      opacity: currentOrb.opacity,
                    }
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.orb,
                      {
                        backgroundColor: currentOrb.type === 'hazard' ? '#ff4444' : 
                                       currentOrb.type === 'bonus' ? '#ffd700' : '#00ff88',
                        borderColor: currentOrb.type === 'hazard' ? '#ff6666' : 
                                   currentOrb.type === 'bonus' ? '#ffed4a' : '#00ffaa',
                      }
                    ]}
                    onPress={() => handleOrbTap(currentOrb)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.orbText}>
                      {currentOrb.type === 'hazard' ? '💀' : currentOrb.type === 'bonus' ? '⭐' : '✨'}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </View>
        )}
        
        {gameState === GAME_STATES.PAUSED && (
          <View style={styles.centered}>
            <Text style={styles.title}>Paused</Text>
            <Text style={styles.subtitle}>Score: {score}</Text>
            <TouchableOpacity style={styles.playButton} onPress={handleResume}>
              <Text style={styles.playButtonText}>Resume</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {gameState === GAME_STATES.GAME_OVER && (
          <View style={styles.centered}>
            <Text style={styles.title}>Game Over!</Text>
            <Text style={styles.score}>Final Score: {score}</Text>
            <Text style={styles.level}>Level Reached: {level}</Text>
            <Text style={styles.combo}>Best Combo: {combo}</Text>
            <Text style={styles.reactionTime}>
              Last Reaction: {reactionTime}ms
            </Text>
            <Text style={styles.bestScore}>Best: {bestScore}</Text>
            <TouchableOpacity style={styles.playButton} onPress={handleRetry}>
              <Text style={styles.playButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    color: Colors.primaryAccent,
    fontWeight: 'bold',
    marginBottom: 20,
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
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
    marginTop: 20,
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
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  statsContainer: {
    flex: 1,
  },
  rightHeader: {
    alignItems: 'flex-end',
  },
  score: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  level: {
    color: Colors.primaryAccent,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  combo: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  reactionTime: {
    color: '#ffaa00',
    fontSize: 14,
    fontWeight: '500',
  },
  livesContainer: {
    marginBottom: 8,
  },
  lives: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
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
  orbArea: {
    flex: 1,
    position: 'relative',
  },
  orbContainer: {
    position: 'absolute',
    width: ORB_SIZE,
    height: ORB_SIZE,
  },
  orb: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 8,
  },
  orbText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bestScore: {
    color: Colors.textSecondary,
    fontSize: 18,
    marginTop: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default TapGame;