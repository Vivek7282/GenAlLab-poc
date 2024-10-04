import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chat: false,
  userProfile: false,
  notification: false,
}

export const navlinkSlice = createSlice({
  name: "navlinkContext",
  initialState,
  reducers: {
    setIsClicked: (state,action) => {
        const button = action.payload
        Object.keys(state).forEach(name => {
            if (name !== button) {
              state[name] = false;
            }
          });
        state[button] = !state[button];
    }
  },
});

export const { setIsClicked } = navlinkSlice.actions;
