import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAvailablePolicies = createAsyncThunk(
  "availablePolicies/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/policy/getAvailablePolicies",
        { withCredentials: true }
      );
      return res.data.policies;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Buy a policy
export const buyPolicy = createAsyncThunk(
  "availablePolicies/buy",
  async (policyId, { rejectWithValue }) => {
    try {
      await axios.post(
        "http://localhost:4000/api/policy/buy",
        { policyId },
        { withCredentials: true }
      );
      return policyId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
const slice = createSlice({
  name: "availablePolicies",
  initialState: { items: [], isLoading: false, error: null, buyingId: null },
  extraReducers: (b) =>
    b
      .addCase(fetchAvailablePolicies.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(fetchAvailablePolicies.fulfilled, (s, a) => {
        s.isLoading = false;
        s.items = a.payload;
      })
      .addCase(fetchAvailablePolicies.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.payload;
      })
      .addCase(buyPolicy.pending, (s, a) => {
        s.buyingId = a.meta.arg;
        s.error = null;
      })
      .addCase(buyPolicy.fulfilled, (s, a) => {
        s.buyingId = null;
        s.items = s.items.filter((p) => p._id !== a.payload);
      })
      .addCase(buyPolicy.rejected, (s, a) => {
        s.buyingId = null;
        s.error = a.payload;
      }),
});

export default slice.reducer;
