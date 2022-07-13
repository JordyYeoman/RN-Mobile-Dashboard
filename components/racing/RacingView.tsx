import React, {LegacyRef, useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {Rn_SpriteSheet} from '../utility/Rn_SpriteSheet';

// Render n racers
const n = 1;
const ACTION_PERIOD = 5000;

function RacingView() {
  const spriteRef = useRef<Rn_SpriteSheet | null>(null);

  const sparseAction = () => {
    spriteRef.current && spriteRef.current.play({name: 'run'});
  };

  useEffect(() => {
    const interval = setInterval(() => {
      sparseAction();
    }, ACTION_PERIOD);
    return () => {
      let sprite = spriteRef;
      clearInterval(interval);
      sprite.current && sprite.current.stop();
    };
  }, []);

  return (
    <View>
      {[...Array(n)].map((elem, index) => (
        <Rn_SpriteSheet
          key={index}
          src={require('../utility/deadRoboto.png')}
          ref={spriteRef.current as LegacyRef<Rn_SpriteSheet>}
          cols={9}
          rows={1}
          rate={15}
          style={[styles.container]}
          anims={[
            {name: 'idle', row: 0, frames: 2, loop: false},
            {name: 'run', row: 0, frames: 9, loop: false},
          ]}
          defaultAnim={'run'}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1.05,
    height: 120,
    width: undefined,
  },
});

export default RacingView;
