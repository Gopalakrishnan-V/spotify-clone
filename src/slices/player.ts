import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Track, State, STATE_NONE} from 'react-native-track-player';

interface PlayerState {
  track?: Track;
  state?: State;
}

const initialState: PlayerState = {
  track: undefined,
  state: STATE_NONE,
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setTrack: (state, action: PayloadAction<Track>) => {
      state.track = action.payload;
    },
    setState: (state, action: PayloadAction<State>) => {
      state.state = action.payload;
    },
  },
});

export const {setTrack, setState} = playerSlice.actions;

export default playerSlice.reducer;
