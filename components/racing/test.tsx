import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const Test = () => {
  const randomNumber = useSharedValue(100);

  const style = useAnimatedStyle(() => {
    return {width: randomNumber.value, height: randomNumber.value};
  });

  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#7CA1B4',
      }}>
      <TouchableOpacity
        onPress={() => {
          randomNumber.value = withSpring(Math.random() * 350);
        }}>
        <Animated.Image
          source={require('../utility/mario.png')}
          resizeMode="contain"
          style={style}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Test;
