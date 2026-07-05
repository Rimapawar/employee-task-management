import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// ✅ IMPORTANT: export types correctly
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;