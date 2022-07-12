import React, {useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import SpriteSheet from '../utility/SpriteSheet';

// Render n# racers
const n = 4;

function RacingView() {
  const spriteRef = useRef<SpriteSheet | null>(null);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <View>
      {[...Array(n)].map((elem, index) => (
        <SpriteSheet
          key={index}
          src={require('../../src/assets/horse-horizontal.png')}
          ref={spriteRef}
          cols={7}
          rows={1}
          rate={20}
          style={[styles.container]}
          animations={[{name: 'run', row: 0, frames: 7, loop: true}]}
          defaultAnimation={'run'}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1.33,
    width: 100,
  },
});

export default RacingView;
