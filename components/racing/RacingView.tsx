import React from 'react';
import {View} from 'react-native';
import SpriteSheet from '../utility/SpriteSheet';

// Render n racers
const n = 6;

function RacingView() {
  return (
    <View>
      {[...Array(n)].map((elem, index) => (
        <SpriteSheet
          key={index}
          src={require('./src/assets/horse-horizontal.png')}
          cols={7}
          defaultAnimation={'run'}
          animations={[{name: 'run', row: 0, frames: 7}]}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            height: 50,
            aspectRatio: 1,
          }}
        />
      ))}
    </View>
  );
}

export default RacingView;
