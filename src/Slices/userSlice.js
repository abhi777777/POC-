import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null, // e.g., { email, role, token }
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
    },
  },
});

export const { setUserInfo, logout } = userSlice.actions;
export default userSlice.reducer;
