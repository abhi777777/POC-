import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const signupUser = createAsyncThunk(
  "user/signupUser",
  async (formData, { rejectWithValue }) => {
    try {
      const fullName = `${formData.firstName} ${formData.middleName ? formData.middleName + " " : ""}${formData.lastName}`;
      const payload = {
        name: fullName.trim(),
        email: formData.email,
        mobile: formData.mobile,
        dob: formData.dob,
        address: formData.address,
        role: formData.role,
        password: formData.password,
      };

      const response = await axios.post(
        "http://localhost:4000/api/users/register",
        payload
      );
      toast.success("Signup successful!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || "Signup failed");
      return rejectWithValue(error.response?.data);
    }
  }
);

// Profile thunk
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/users/profile",
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch profile"
      );
    }
  }
);

const initialState = {
  userInfo: null,
  loading: false,
  error: null,
  profileLoading: false,
  profileError: null,
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
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Signup failed";
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.userInfo = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });
  },
});

export const { setUserInfo, logout } = userSlice.actions;
export default userSlice.reducer;
