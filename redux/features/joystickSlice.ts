import {createSlice} from '@reduxjs/toolkit';
import {Direction} from '../../Utilities/enums';

export interface JoystickState {
  direction: Direction;
}

const initialState: JoystickState = {
  direction: Direction.None,
};

export const joystickSlice = createSlice({
  name: 'joystick',
  initialState,
  reducers: {
    setDirection: (state, action: any) => {
      state.direction = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setDirection} = joystickSlice.actions;

export default joystickSlice.reducer;
