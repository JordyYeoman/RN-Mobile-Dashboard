import React, {LegacyRef, useEffect, useRef} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Rn_SpriteSheet} from '../utility/Rn_SpriteSheet';

// Render n racers
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
      <Rn_SpriteSheet
        src={require('../utility/horse-horizontal.png')}
        ref={spriteRef.current as LegacyRef<Rn_SpriteSheet>}
        cols={7}
        rows={1}
        rate={10}
        style={[styles.container]}
        anims={[
          {
            name: 'run',
            row: 0,
            frames: 3,
            loop: true,
            // startFrame: 5,
          },
        ]}
        defaultAnim={'walk-right'}
      />
      <Rn_SpriteSheet
        src={require('../utility/male_adventurer.png')}
        ref={spriteRef.current as LegacyRef<Rn_SpriteSheet>}
        cols={9}
        rows={5}
        rate={5}
        style={[styles.container]}
        anims={[
          // {name: 'idle', row: 0, frames: 3, loop: true},
          {
            name: 'run',
            row: 0,
            frames: 3,
            loop: true,
            // startFrame: 5,
          },
          {name: 'jump', row: 0, frames: 4, loop: true, startFrame: -2},
          {name: 'climb', row: 0, frames: 3, loop: true, startFrame: 3},
          {name: 'run', row: 2, frames: 4, loop: true, startFrame: 4},
          {
            name: 'walk-left',
            row: 4,
            frames: 8,
            loop: true,
            startFrame: -1,
            flipAnimation: true,
          },
          {name: 'walk-right', row: 4, frames: 9, loop: true, startFrame: -2},
        ]}
        defaultAnim={'walk-right'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: 0.75,
    height: 120,
    width: undefined,
  },
});

export default RacingView;
