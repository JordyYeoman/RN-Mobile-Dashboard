// Testing

import React from 'react';
import {StyleSheet, View} from 'react-native';
import Draggable from 'react-native-draggable';
import {useDispatch} from 'react-redux';
import {setDirection} from '../../redux/features/joystickSlice';
import {Direction} from '../../Utilities/enums';

// Left, right, up, down movements

// on tap and move, move the element

// on release, return to center

export interface Props {
  joystickColor: string;
  joystickSize: number;
}

const Joystick: React.FC<Props> = props => {
  const dispatch = useDispatch();

  const getDirection = (x: number, y: number): Direction => {
    // console.log('X: ' + x + ' ' + 'Y: ' + y);
    // Up and Right
    if (y < 0 && x > 0) {
      //   console.log('UpRight');
      dispatch(setDirection(Direction.UpRight));
      return Direction.UpRight;
    }
    // Up and Left
    if (y < 0 && x < 0) {
      //   console.log('UpLeft');
      dispatch(setDirection(Direction.UpLeft));
      return Direction.UpLeft;
    }
    // Down and Left
    if (y > 0 && x < 0) {
      //   console.log('DownLeft');
      dispatch(setDirection(Direction.DownLeft));
      return Direction.DownLeft;
    }
    // Down and Right
    if (y > 0 && x > 0) {
      //   console.log('DownRight');
      dispatch(setDirection(Direction.DownRight));
      return Direction.DownRight;
    }
    dispatch(setDirection(Direction.None));
    return Direction.None;
  };

  return (
    <View>
      <View style={[styles.container]}>
        <Draggable
          x={2.5}
          y={2.5}
          renderSize={100}
          maxX={150}
          maxY={150}
          minX={-50}
          minY={-50}
          renderColor={props.joystickColor}
          renderText="Go"
          isCircle
          shouldReverse
          onDrag={(event, gestureState) => {
            getDirection(gestureState.dx, gestureState.dy);
          }}
          onRelease={() => {
            dispatch(setDirection(Direction.None));
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifySelf: 'center',
    borderWidth: 2,
    borderColor: 'red',
    width: 110,
    height: 110,
    borderRadius: 102,
    backgroundColor: 'transparent',
  },
});

export default Joystick;
