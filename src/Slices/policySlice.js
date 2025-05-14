import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPolicies = createAsyncThunk(
  "policies/fetchPolicies",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/policy/Mypolicies",
        { withCredentials: true }
      );
      return res.data.policies;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const policiesSlice = createSlice({
  name: "policies",
  initialState: { items: [], isLoading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolicies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPolicies.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchPolicies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default policiesSlice.reducer;
