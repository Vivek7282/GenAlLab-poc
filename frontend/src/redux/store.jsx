/* eslint-disable react-refresh/only-export-components */
import { configureStore } from "@reduxjs/toolkit";
import { alertSlice } from "./features/alertSlice";
import { dashboardSlice } from "./features/dashboardSlice";
import { navlinkSlice } from "./features/navlinkSlice";
import { userSlice } from "./features/userSlice";

export default configureStore({
  reducer: {
    alerts: alertSlice.reducer,
    dashboardContext: dashboardSlice.reducer,
    navlinkContext: navlinkSlice.reducer,
    user: userSlice.reducer,
  },
});
