import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import { clearNextSlotTime } from "./countdownSlice";

export type TUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

type TAuthState = {
  user: null | TUser;
  token: null | string;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;

export const userCurrentToken = (state: RootState) => state.auth.token;

export const userCurrentUser = (state: RootState) => state.auth.user;
// Thunk for handling logout and clearing countdown
export const handleLogout = () => (dispatch: AppDispatch) => {
  dispatch(logout()); // First, log out the user
  dispatch(clearNextSlotTime()); // Then, clear the countdown state
};
