// src/Slices/statsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchStats = createAsyncThunk(
  "stats/fetchStats",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("http://localhost:4000/api/users/getStats", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch stats");
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const statsSlice = createSlice({
  name: "stats",
  initialState: {
    data: {
      totalPolicies: 0,
      policiesSold: 0,
      revenue: "₹0",
    },
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export default statsSlice.reducer;
