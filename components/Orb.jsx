import React, { useState } from 'react';
import { Animated, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Colors, { ORB_SIZE } from './Colors';

const Orb = ({ x, y, type, onPress }) => {
  const [scale] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.85,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.orb,
        {
          left: x,
          top: y,
          backgroundColor:
            type === 'hazard' ? Colors.secondaryAccent : Colors.primaryAccent,
          borderColor:
            type === 'hazard'
              ? Colors.warningRed || Colors.secondaryAccent
              : Colors.backgroundLight,
          transform: [{ scale }],
        },
      ]}
    >
      <TouchableWithoutFeedback
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={styles.touchArea} />
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
    zIndex: 2,
  },
  touchArea: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
  },
});

export default Orb; 