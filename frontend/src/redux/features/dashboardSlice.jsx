import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeMenu: true,
  screenSize: window.innerWidth,
}

export const dashboardSlice = createSlice({
  name: "dashboardContext",
  initialState,
  reducers: {
    showSidebar: (state) => {
      state.activeMenu = true;
    },
    hideSidebar: (state) => {
      state.activeMenu = false;
    },
    setScreenSize: (state,action) => {
      state.screenSize = action.payload;
    }
  },
});

export const {showSidebar,hideSidebar,setScreenSize} = dashboardSlice.actions
