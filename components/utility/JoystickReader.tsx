import React from 'react';
import {View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';
import {Direction} from '../../Utilities/enums';

function JoystickReader() {
  const {direction}: {direction: Direction} = useSelector(
    (state: RootState) => state.joystick,
  );

  return (
    <View>
      <Text>{direction}</Text>
    </View>
  );
}

export default JoystickReader;
