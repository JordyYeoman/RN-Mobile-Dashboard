import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, {useAnimatedStyle, withSpring} from 'react-native-reanimated';

function Box({offsetValue}: {offsetValue: number}) {
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateX: withSpring(offsetValue * 255)}],
    };
  });

  return (
    <>
      <Animated.View style={[styles.box, animatedStyles]} />
    </>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#4E4E4E',
    borderRadius: 10,
    width: 50,
    height: 50,
  },
});

export default Box;
