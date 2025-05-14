import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../src/Slices/userSlice";
import statsReducer from "../src/Slices/statsSlice";
import policiesReducer from "../src/Slices/policySlice";
import availablePoliciesReducer from "../src/Slices/availablePoliciesSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    stats: statsReducer,
    policies: policiesReducer,
    availablePolicies: availablePoliciesReducer,
  },
});
