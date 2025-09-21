import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  email: string;
  password: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: { email: "", password: "" },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.user.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.user.password = action.payload;
    },
    userLoginSuccess: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = { email: "", password: "" };
    },
  },
});

export const { setEmail, setPassword, userLoginSuccess, logout } =
  authSlice.actions;
export default authSlice.reducer;
